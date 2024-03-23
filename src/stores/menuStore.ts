import axios from "axios";
import { defineStore } from "pinia";
import { useNotificationStore } from "./notificationsStore";
import router from "@/router";
import type { Menu } from "@/interfaces/menu";
import type { Meal } from "@/interfaces/meal";

const MENU_API_URL = "http://localhost:8080/api/v1/admin";

export const useMenuStore = defineStore({
    id: "menu",
    state: () => {
        return {
            menus: [] as Menu[],
            menu: {} as Menu,
            meal: [] as Meal[][]
        }
    },
    actions: {
        async getMenus(token: string) {
            const response = await axios.get(MENU_API_URL + "/menu", {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.status === 200) {
                this.menus = response.data;
            }
        },
        async deleteMenu(menuId: number, token: string) {
            const response = await axios.delete(MENU_API_URL + `/menu/${menuId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.status === 200) {
                useNotificationStore().sendDeletedNotification("Menu deleted", `Successfully deleted a menu with the id of ${menuId}!`);
            }
        },
        async getMenuById(menuId: number, token: string) {
            const response = await axios.get(MENU_API_URL + `/menu/${menuId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.status === 200) {
                this.menu = response.data;
                this.meal = [];
                this.meal.push(this.menu.mondayMeals);
                this.meal.push(this.menu.tuesdayMeals);
                this.meal.push(this.menu.wednesdayMeals);
                this.meal.push(this.menu.thursdayMeals);
                this.meal.push(this.menu.fridayMeals);
                this.meal.push(this.menu.saturdayMeals);
                this.meal.push(this.menu.sundayMeals);
            }
        },
        async editMenu(menuId: number, selectionStartDate: Date, selectionEndDate: Date, availableFromDate: Date, availableToDate: Date, token: string) {
            
            var selectionStart = selectionStartDate.getTime() + (selectionStartDate.getTimezoneOffset() * 60 * 1000);
            var selectionEnd = selectionEndDate.getTime() + (selectionEndDate.getTimezoneOffset() * 60 * 1000);
            var availableFrom = availableFromDate.getTime() + (availableFromDate.getTimezoneOffset() * 60 * 1000);
            var availableTo = availableToDate.getTime() + (availableToDate.getTimezoneOffset() * 60 * 1000);
            
            const response = await axios.post(MENU_API_URL + '/menu/modify', {
                "menuId": menuId,
                
                "selectionStart": selectionStart,
                "selectionEnd": selectionEnd,

                "availableFrom": availableFrom,
                "availableTo": availableTo
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.status === 200) {
                useNotificationStore().sendInfoNotification("Menu modifyed", `Menu with the id of ${menuId} has been successfully modifyed!`);
                router.push('/menu');
            }
        },
        async createMenu(selectionStartDate: Date, selectionEndDate: Date, availableFromDate: Date, availableToDate: Date, token: string) {

            var selectionStart = selectionStartDate.getTime() + (selectionStartDate.getTimezoneOffset() * 60 * 1000);
            var selectionEnd = selectionEndDate.getTime() + (selectionEndDate.getTimezoneOffset() * 60 * 1000);
            var availableFrom = availableFromDate.getTime() + (availableFromDate.getTimezoneOffset() * 60 * 1000);
            var availableTo = availableToDate.getTime() + (availableToDate.getTimezoneOffset() * 60 * 1000);

            const response = await axios.post(MENU_API_URL + '/menu/create', {
                "selectionStart": selectionStart,
                "selectionEnd": selectionEnd,

                "availableFrom": availableFrom,
                "availableTo": availableTo
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.status === 201) {
                useNotificationStore().sendCreatedNotification("Menu created", "New menu created successfully!");
                router.push("/menu");
            }
        },
        async createMeal(dayId: number, menuId: number, identification: string, description: string, token: string) {
            const response = await axios.post(MENU_API_URL + '/menu/meal/create', {
                "dayId": dayId,
                "menuId": menuId,
                "identification": identification,
                "description": description
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.status === 201) {
                useNotificationStore().sendCreatedNotification("Meal created", `New meal successfully added to "Menu #${menuId}"!`);
                this.menu = response.data;
                this.meal = [];
                this.meal.push(this.menu.mondayMeals);
                this.meal.push(this.menu.tuesdayMeals);
                this.meal.push(this.menu.wednesdayMeals);
                this.meal.push(this.menu.thursdayMeals);
                this.meal.push(this.menu.fridayMeals);
                this.meal.push(this.menu.saturdayMeals);
                this.meal.push(this.menu.sundayMeals);
            }
        },
        async deleteMeal(dayId: number, mealId: number, menuId: number, token: string) {
            const response = await axios.post(MENU_API_URL + '/menu/meal/delete', {
                "dayId": dayId,
                "mealId": mealId,
                "menuId": menuId
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.status === 200) {
                useNotificationStore().sendDeletedNotification("Meal deleted", `A meal has been deleted in "Menu #${menuId}"!`);
                this.menu = response.data;
                this.meal = [];
                this.meal.push(this.menu.mondayMeals);
                this.meal.push(this.menu.tuesdayMeals);
                this.meal.push(this.menu.wednesdayMeals);
                this.meal.push(this.menu.thursdayMeals);
                this.meal.push(this.menu.fridayMeals);
                this.meal.push(this.menu.saturdayMeals);
                this.meal.push(this.menu.sundayMeals);
            }
        }
    }
});