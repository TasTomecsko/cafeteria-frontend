import type { Meal } from "./meal";

export interface Menu {
    menuId: number,
    selectionStart: number,
    selectionEnd: number,
    availableFrom: number,
    availableTo: number,
    mondayMeals: Meal[],
    tuesdayMeals: Meal[],
    wednesdayMeals: Meal[],
    thursdayMeals: Meal[],
    fridayMeals: Meal[],
    saturdayMeals: Meal[],
    sundayMeals: Meal[]
}