import axios from "axios";
import { defineStore } from "pinia";
import type { OrderDetails } from "@/interfaces/orderDetails";

const ORDER_API_URL = "http://localhost:8080/api/v1/admin"

export const useOrderStore = defineStore({
    id: "order",
    state: () => {
        return {
            orders: [] as OrderDetails[],
            daysOfOrders: [] as number[],
            ordersList: [] as OrderDetails[][]
        }
    },
    actions: {
        async getOrdersFromMeal(menuId: number, token: string) {
            const response = await axios.get(ORDER_API_URL + `/menu/${menuId}/orders`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.status === 200) {
                this.orders = response.data.orderedMeals;
                this.orderOrders();
            }
        },
        orderOrders() {
            var sortedOrders = this.orders.sort((a, b) => {
                if(a.meal.dayOfMeal < b.meal.dayOfMeal) {
                    return -1;
                }
                if(a.meal.dayOfMeal > b.meal.dayOfMeal) {
                    return 1;
                }
                return 0;
            });
            this.daysOfOrders = [];
            if(sortedOrders.length > 0) {
                var firstDay = sortedOrders[0].meal.dayOfMeal;
                this.ordersList = [[]];
                this.daysOfOrders.push(firstDay);
                let j = 0;
                for(var i = 0; i < sortedOrders.length; i++) {
                    if(firstDay == sortedOrders[i].meal.dayOfMeal) {
                        this.ordersList[j].push(sortedOrders[i]);
                    }
                    else {
                        j++;
                        this.ordersList.push([] as OrderDetails[]);
                        this.ordersList[j].push(sortedOrders[i])
                        firstDay = sortedOrders[i].meal.dayOfMeal;
                        this.daysOfOrders.push(firstDay);
                    }
                }
    
                for(var i = 0; i < this.ordersList.length; i++) {
                    this.ordersList[i] = this.ordersList[i].sort((a, b) => {
                        if(a.meal.identification < b.meal.identification) {
                            return -1;
                        }
                        if(a.meal.identification > b.meal.identification) {
                            return 1;
                        }
                        return 0;
                    });
                }
            }
        }
    }  
})