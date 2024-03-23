import axios from "axios";
import { defineStore } from "pinia";
import { useNotificationStore } from "./notificationsStore";
import router from "@/router";

const USERS_API_URL = "http://localhost:8080/api/v1/admin";

export const useUsersStore = defineStore({
    id: 'users',
    state: () => {
        return {
            users: []
        }
    },
    actions: {
        async getUsers(token: string) {
            const response = await axios.get(USERS_API_URL, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.status === 200) {
                this.users = response.data;
            }
        },
        async addUser(firstName: string, lastName: string, email: string, password: string, role: number, token: string) {
            const response = await axios.post(USERS_API_URL + '/users', 
            {
                'firstName': firstName,
                'lastName': lastName,
                'email': email,
                'password': password,
                'role': role
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.status === 201) {
                useNotificationStore().sendCreatedNotification('New User Added', `User named ${firstName} ${lastName} added`);
                router.push('/users');
            }
        },
        async deleteUser(id: number, firstName:string, lastName:string, token: string) {
            const response = await axios.delete(USERS_API_URL + `/${id}`, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.status === 200) {
                useNotificationStore().sendDeletedNotification('User Deleted', `User named ${firstName} ${lastName} deleted`);
            }
        }
    }
})