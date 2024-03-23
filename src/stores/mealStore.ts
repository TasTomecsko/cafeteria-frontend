import axios from "axios";
import { defineStore } from "pinia";
import { useNotificationStore } from "./notificationsStore";
import router from "@/router";
import type { Menu } from "@/interfaces/menu";
import type { Meal } from "@/interfaces/meal";

const MEAL_API_URL = "http://localhost:8080/api/v1/meals"

export const useMealStore = defineStore({
    id: "meal",
    state: () => {
        return {
            menus: [] as Menu[],
            menuToSelect: {} as Menu,
            mealsToSelect: [] as Meal[][]
        }
    },
    actions: {
        async getMenuToSelect(token: string) {
            const response = await axios.get(MEAL_API_URL, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.status === 200) {
                this.menus = response.data;
            }
        },
        async getMenuById(menuId: number, token: string) {
            const response = await axios.get(MEAL_API_URL + `/menu/${menuId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.status === 200) {
                this.menuToSelect = response.data;
                this.mealsToSelect.push(this.menuToSelect.mondayMeals);
                this.mealsToSelect.push(this.menuToSelect.tuesdayMeals);
                this.mealsToSelect.push(this.menuToSelect.wednesdayMeals);
                this.mealsToSelect.push(this.menuToSelect.thursdayMeals);
                this.mealsToSelect.push(this.menuToSelect.fridayMeals);
                this.mealsToSelect.push(this.menuToSelect.saturdayMeals);
                this.mealsToSelect.push(this.menuToSelect.sundayMeals);
            }
        },
        async placeOrder(menuId: number, selectedMenus: number[], token: string) {
            const response = await axios.post(MEAL_API_URL + '/order/create', {
                "token": token,

                "menuId": menuId,
                
                "mondayMealId": selectedMenus[0],
                "tuesdayMealId": selectedMenus[1],
                "wednesdayMealId": selectedMenus[2],
                "thursdayMealId": selectedMenus[3],
                "fridayMealId": selectedMenus[4],
                "saturdayMealId": selectedMenus[5],
                "sundayMealId": selectedMenus[6]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.status === 201) {
                useNotificationStore().sendCreatedNotification('Order created', `You have created an order, it will be available from 
                ${new Date(this.menuToSelect.availableFrom).getFullYear()} 
                ${(new Date(this.menuToSelect.availableFrom).getMonth() + 1).toString().length > 1 ? (new Date(this.menuToSelect.availableFrom).getMonth() + 1) : '0' + (new Date(this.menuToSelect.availableFrom).getMonth() + 1)} 
                ${new Date(this.menuToSelect.availableFrom).getDate().toString().length > 1 ? new Date(this.menuToSelect.availableFrom).getDate() : '0' + new Date(this.menuToSelect.availableFrom).getDate()}`);
                router.push('/meals');
            }
        }
    }
});