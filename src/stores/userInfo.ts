import axios from "axios";
import { defineStore } from "pinia";

const USER_INFO_API_URL = "http://localhost:8080/api/v1/user/info";

export const useUserInfoStore = defineStore({
    id: 'userInfo',
    state: () => {
        return {
            role: null
        }
    },
    actions: {
        async getUserInfo(token: string) {
            if(this.role == null) {
                const response = await axios.post(USER_INFO_API_URL, 
                {
                    'token': token
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });

                if(response.status === 200) {
                    this.role = response.data.role;
                }
            }
        },
        clearUserInfoStore() {
            this.role = null;
        }
    }
})