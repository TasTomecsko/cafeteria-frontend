<script lang="ts" setup>
import { useMenuStore } from '@/stores/menuStore';
import MealCard from './MealCard.vue';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notificationsStore';
import { reactive, ref } from 'vue';
import Button from '@/assets/Button.vue';
import { buttonType } from '@/enums/buttonTypes';
import { convertMillisToDate } from '@/functions/timeFunctions';
import { useLanguageStore } from '@/stores/languageStore';

const menu = useMenuStore();
const auth = useAuthStore();
const note = useNotificationStore();
const language = useLanguageStore();

const showModal = ref(false);

const meal = reactive({
    identification: '',
    description: '',
    dateOfMeal: '',
});

const props = defineProps([
    'menuId'
]);

function errorConnect() {
    auth.showModal = true;
}

function addMealToMenu() {
    showModal.value = true;
}

function onCancelClick() {
    meal.identification = '';
    meal.description = '';
    meal.dateOfMeal = '';
    showModal.value = false;
}

async function onCreateClick() {
    await menu.createMeal(props.menuId, meal.identification, meal.description, new Date(meal.dateOfMeal), auth.token).catch(function (error) {
        if(error.response.status === 403) {
            errorConnect()
        }
        else if(error.response.status === 400) {
            note.sendErrorNotification(error.response.data.title, error.response.data.detail);
        }
        else {
            note.sendDeletedNotification('Server Error', 'Something went wrong, please try again later');
        }
    });
    meal.identification = '';
    meal.description = '';
    meal.dateOfMeal = '';
    showModal.value = false;
}

function disable() {
    return meal.identification =='' ||
            meal.description == '' ||
            meal.dateOfMeal == '';
}
</script>

<template>
    <div class="modal-wrapper" v-if="showModal">
        <div class="modal-body">
            <h1>{{ language.languageFile.menu.inspect.mealDetails.modalCreate.text.replace("$id", props.menuId) }}</h1>

            <label for="identification" class="data-label">{{ language.languageFile.menu.inspect.mealDetails.modalCreate.identification }}:</label><br>
            <textarea type="text" id="identification" v-model="meal.identification" required class="data identification"/><br>

            <label for="description" class="data-label">{{ language.languageFile.menu.inspect.mealDetails.modalCreate.description }}:</label><br>
            <textarea type="text" id="description" v-model="meal.description" required class="data"/><br>

            <label for="dateOfMeal" class="data-label">{{ language.languageFile.menu.inspect.mealDetails.modalCreate.dayOfMeal }}:</label><br>
            <input type="date" id="dateOfMeal" v-model="meal.dateOfMeal" :min="menu.getMenuAvailableFromDate()" :max="menu.getMenuAvailableToDate()" required class="date-picker">

            <div class="button-holder-modal">
                <Button @clicked="onCreateClick" :text="language.languageFile.menu.inspect.mealDetails.modalCreate.createButton" :assigned-type="buttonType.GREEN" class="modal-btn-add"
                    :is-disabled="disable()"/><br>
                <Button @clicked="onCancelClick" :text="language.languageFile.menu.inspect.mealDetails.modalCreate.cancelButton" :assigned-type="buttonType.RED"/>
            </div>
        </div>
    </div>
    <div class="grid">
        <div class="section-header">
            <h1 class="section-details">{{ language.languageFile.menu.inspect.mealDetails.title }}</h1>
            <div class="addMeal-button-holder" v-if="menu.menu.selectionStart > new Date().getTime()">
                <Button @clicked="addMealToMenu()" :text="'+'" :assigned-type="buttonType.GREEN" class="addMeal-button"/>
            </div>
        </div>
        <div class="meal-container">
            <div v-for="(day, dayIndex) in menu.daysOfMeals" class="meals">
                <h3 class="date-of-meal">{{ convertMillisToDate(day) }}</h3>
                <div v-for="(mealElement, index) in menu.mealsOnDays[dayIndex]">
                    <MealCard :id="mealElement.mealId" :menu-id="props.menuId" :card-index="index" :identification="mealElement.identification" 
                        :description="mealElement.description" :can-be-deleted="menu.menu.selectionStart > new Date().getTime()"/>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.section-header {
    margin-bottom: 20px;
    padding-bottom: 10px;
    padding-top: 5px;
    background-color: white;
    border-radius: 5px;
}
.section-details {
    margin: 0px;
    padding: 0px;
    margin-bottom: 10px;
    font-size: 28px;
    text-align: center;
}

.modal-wrapper {
    position: fixed;
    z-index: 9997;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}
.modal-body {
    width: 300px;
    margin: 150px auto;
    padding: 20px 30px;
    background-color: white;
    border-radius: 4px;
    text-align: center;
}
h1 {
    margin-top: 0;
    font-size: 32px;
}
.button-holder {
    text-align: center;
}
.data-label {
    padding: 0;
    margin: 0;
    font-size: 20px;
    margin-bottom: 5px;
}
.data {
    padding: 0;
    margin: 0;
    font-size: 16px;
    margin-top: 5px;
    margin-bottom: 10px;
    width: 200px;
    min-height: 20px;
    resize: vertical;
    padding: 3px;
}
.identification {
    text-align: center;
}
.date-picker {
    padding: 0;
    margin: 0;
    font-size: 16px;
    margin-top: 5px;
    margin-bottom: 15px;
    width: 200px;
    height: 20px;
}

.addMeal-button-holder {
    text-align: center;
}
.modal-btn-add {
    margin-bottom: 5px;
}

.meals {
    background-color: rgba(255, 255, 255, 0.425);
    border-radius: 5px;
    margin-bottom: 25px;
    padding: 15px 0 0 0;
}

.date-of-meal {
    padding: 0;
    margin: 0 0 5px 15px;
}

.addMeal-button {
    width: 80px;
}

@media screen and (min-width: 700px) {
    .grid {
        max-width: 560px;
    }
}
</style>