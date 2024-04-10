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
            mealsOnDays: [] as Meal[][],
            daysOfMeals: [] as number[]
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
                this.orderMeals();
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
        async createMeal(menuId: number, identification: string, description: string, dateOfMeal: Date, token: string) {
            var mealDate = dateOfMeal.getTime() + (dateOfMeal.getTimezoneOffset() * 60 * 1000);

            const response = await axios.post(MENU_API_URL + '/menu/meal/create', {
                "menuId": menuId,
                "identification": identification,
                "description": description,
                "dateOfMeal": mealDate
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
                this.orderMeals();
            }
        },
        async deleteMeal(mealId: number, menuId: number, token: string) {
            const response = await axios.post(MENU_API_URL + '/menu/meal/delete', {
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
                this.orderMeals();
            }
        },
        getMenuAvailableFromDate() {
            const date = new Date(this.menu.availableFrom);

            var years = date.getFullYear().toString();
            var months = (date.getMonth() + 1).toString();
            var day = (date.getDate()).toString();

            if(months.length == 1) {
                months = '0' + months; 
            }
            if(day.length == 1) {
                day = '0' + day;
            }

            return years + '-' + months + '-' + day
        },
        getMenuAvailableToDate() {
            const date = new Date(this.menu.availableTo);

            var years = date.getFullYear().toString();
            var months = (date.getMonth() + 1).toString();
            var day = (date.getDate()).toString();

            if(months.length == 1) {
                months = '0' + months; 
            }
            if(day.length == 1) {
                day = '0' + day;
            }

            return years + '-' + months + '-' + day
        },
        getDateOfToday() {
            const date = new Date();

            var years = date.getFullYear().toString();
            var months = (date.getMonth() + 1).toString();
            var day = (date.getDate() + 1).toString();

            if(months.length == 1) {
                months = '0' + months; 
            }
            if(day.length == 1) {
                day = '0' + day;
            }

            return years + '-' + months + '-' + day
        },
        orderMeals() {
            var meals = this.menu.meals.sort((a, b) => {
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
                this.mealsOnDays = [[]];
                this.daysOfMeals.push(firstDay);
                let j = 0;
                for(var i = 0; i < meals.length; i++) {
                    if(firstDay == meals[i].dayOfMeal) {
                        this.mealsOnDays[j].push(meals[i]);
                    }
                    else {
                        j++;
                        this.mealsOnDays.push([] as Meal[]);
                        this.mealsOnDays[j].push(meals[i])
                        firstDay = meals[i].dayOfMeal;
                        this.daysOfMeals.push(firstDay);
                    }
                }

                for(var i = 0; i < this.mealsOnDays.length; i++) {
                    this.mealsOnDays[i] = this.mealsOnDays[i].sort((a, b) => {
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