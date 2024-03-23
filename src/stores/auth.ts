import axios from "axios";
import { defineStore } from "pinia";
import router from "@/router";

const AUTH_API_URL = "http://localhost:8080/api/v1/auth";
const TIMER_DURATION = 600; // In seconds

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => {
        return {
            user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
            token: localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')!) : null,
            refreshToken: localStorage.getItem('refreshToken') ? JSON.parse(localStorage.getItem('refreshToken')!) : null,
            showModal: false,
            loading: false,
        }
    },
    actions: {
        async login(username: string, password: string) {
            this.loading = true;
            const response = await axios.post(`${AUTH_API_URL}/login`, 
            {
                "email": username,
                "password": password
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if(response.status === 200) {
                const token = response.data.token;
                const refreshToken = response.data.refreshToken;
                localStorage.setItem('user', JSON.stringify(username));
                localStorage.setItem('token', JSON.stringify(token));
                localStorage.setItem('refreshToken',JSON.stringify(refreshToken));
                this.user = username;
                this.token = token;
                this.refreshToken = refreshToken;
                this.showModal = false;

                router.push('/');
            }
            else {
                this.loading = false;
                throw new Error("Invalid credentials");
            }  
        },
        logout() {
            this.user = '';
            this.token = '';
            this.refreshToken = '';
            
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('timerEnd');
            router.push('/login');
        },
        async timer() {
            var dateEnd = 0;

            if(!localStorage.getItem('timerEnd')) {
                dateEnd = Date.now() + TIMER_DURATION * 1000;
                localStorage.setItem('timerEnd', JSON.stringify(dateEnd));
            }
            else {
                const time = localStorage.getItem('timerEnd');
                if(time != null) {
                    dateEnd = parseInt(time);
                }
            }

            while(this.user && this.token && this.refreshToken && !this.showModal) {
                await this.delay(1000)
                if(Date.now() > dateEnd) {
                    this.showModal = true;
                }
            }
        },
        delay(time: number) {
            return new Promise(resolve => setTimeout(resolve, time));
        },
        async refreshAccessTokens() {
            const response = await axios.post(`${AUTH_API_URL}/refresh`,
            {
                "token": this.refreshToken
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if(response.status === 200) {
                const token = response.data.token;
                const refreshToken = response.data.refreshToken;
                localStorage.setItem('token', JSON.stringify(token));
                localStorage.setItem('refreshToken',JSON.stringify(refreshToken));
                this.token = token;
                this.refreshToken = refreshToken;
                this.showModal = false;
                localStorage.removeItem('timerEnd');
                this.timer();
            }
            else {
                throw new Error("Invalid credentials");
            }  
        }
    }
});