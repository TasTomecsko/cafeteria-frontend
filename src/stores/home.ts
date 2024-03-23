import axios from "axios";
import { defineStore } from "pinia";
import { useNotificationStore } from "./notificationsStore";
import type { UserData } from "@/interfaces/userData";
import type { UserUpdate } from "@/interfaces/userUpdate";

const HOME_API_URL = "http://localhost:8080/api/v1/user";

export const useHomeStore = defineStore({
    id: 'home',
    state: () => {
        return {
            userData: {} as UserData
        }
    },
    actions: {
        async getUser(token: string) {
            const response = await axios.post(HOME_API_URL, {
                'token': token
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.status === 200) {
                this.userData = {firstName: response.data.firstName, lastName:response.data.lastName, email:response.data.email}
            }
        },
        async updateUser(updatedUser: UserUpdate, token: string) {
            const response = await axios.post(HOME_API_URL + '/update', {
                'token': token,
                'firstName': updatedUser.firstName,
                'lastName': updatedUser.lastName,
                'oldPassword': updatedUser.oldPassword,
                'newPassword': updatedUser.newPassword
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.status === 200) {
                this.userData = {firstName: response.data.firstName, lastName:response.data.lastName, email:response.data.email};
                useNotificationStore().sendInfoNotification('User information updated', 'Successfully updated user information');
            }
        }
    }
})