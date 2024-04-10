import type { Meal } from "./meal";

export interface OrderDetails {
    meal: Meal,
    numberOfOrders: number
}