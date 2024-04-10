import type { Meal } from "./meal";

export interface Menu {
    menuId: number,
    selectionStart: number,
    selectionEnd: number,
    availableFrom: number,
    availableTo: number,
    meals: Meal[]
}