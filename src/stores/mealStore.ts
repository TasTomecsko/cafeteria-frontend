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
            mealsToSelect: [] as Meal[][],
            daysOfMeals: [] as number[],
            todaysMeal: {} as Meal
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
                this.orderMeals();
            }
        },
        async placeOrder(menuId: number, selectedMenus: number[], token: string) {
            const response = await axios.post(MEAL_API_URL + '/order/create', {
                "token": token,

                "menuId": menuId,
                
                "mealIdList": selectedMenus
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
        },
        async getTodayMeal(token: string) {
            const response = await axios.post(MEAL_API_URL + '/order/meal', {
                "token": token
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.status === 200) {
                this.todaysMeal = response.data;
            }
        },
        orderMeals() {
            var meals = this.menuToSelect.meals.sort((a, b) => {
                if(a.dayOfMeal < b.dayOfMeal) {
                    return -1;
                }
                if(a.dayOfMeal > b.dayOfMeal) {
                    return 1;
                }
                return 0;
            });
            this.daysOfMeals = [];
            if(meals.length > 0) {
                var firstDay = meals[0].dayOfMeal;
                this.mealsToSelect = [[]];
                this.daysOfMeals.push(firstDay);
                let j = 0;
                for(var i = 0; i < meals.length; i++) {
                    if(firstDay == meals[i].dayOfMeal) {
                        this.mealsToSelect[j].push(meals[i]);
                    }
                    else {
                        j++;
                        this.mealsToSelect.push([] as Meal[]);
                        this.mealsToSelect[j].push(meals[i])
                        firstDay = meals[i].dayOfMeal;
                        this.daysOfMeals.push(firstDay);
                    }
                }

                for(var i = 0; i < this.mealsToSelect.length; i++) {
                    this.mealsToSelect[i] = this.mealsToSelect[i].sort((a, b) => {
                        if(a.identification < b.identification) {
                            return -1;
                        }
                        if(a.identification > b.identification) {
                            return 1;
                        }
                        return 0;
                    });
                }
            }
        }
    }
});