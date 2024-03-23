<script lang="ts" setup>
import { useMenuStore } from '@/stores/menuStore';
import MealCard from './MealCard.vue';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notificationsStore';
import { reactive, ref } from 'vue';

const menu = useMenuStore();
const auth = useAuthStore();
const note = useNotificationStore();

const showModal = ref(false);

const meal = reactive({
    identification: '',
    description: ''
});

const mealCreationInfo = reactive({
    dayId: ''
});

const props = defineProps([
    'menuId'
]);

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function errorConnect() {
    auth.showModal = true;
}

function addMealToMenu(dayid: number) {
    mealCreationInfo.dayId = dayid.toString();
    showModal.value = true;
}

function onCancelClick() {
    meal.identification = '';
    meal.description = '';
    showModal.value = false;
}

async function onCreateClick() {
    await menu.createMeal(Number(mealCreationInfo.dayId), props.menuId, meal.identification, meal.description, auth.token).catch(function (error) {
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
    showModal.value = false;
}
</script>

<template>
    <div class="modal-wrapper" v-if="showModal">
        <div class="modal-body">
            <h1>Add New Meal for {{ days[Number(mealCreationInfo.dayId)] }}</h1>

            <label for="identification" class="data-label">Identification</label><br>
            <textarea type="text" id="identification" v-model="meal.identification" required class="data identification"/><br>

            <label for="description" class="data-label">Description</label><br>
            <textarea type="text" id="description" v-model="meal.description" required class="data"/>

            <div class="button-holder-modal">
                <button @click.prevent="onCreateClick" class="modal-btn-add">Create</button><br>
                <button @click.prevent="onCancelClick" class="modal-btn-end">Cancel</button>
            </div>
        </div>
    </div>
    <div class="grid">
        <h1 class="section-details">Meal Details</h1>
        <div v-for="dayindex in 7" class="meal-container">
            <div class="meal-header">
                <h3 class="meal-day-name">Meals for {{ days[dayindex - 1] }}</h3> 
                <div class="button-holder">
                    <button class="addMeal-button" @click.prevent="addMealToMenu(dayindex - 1)">+</button>
                </div>
            </div>
            <div v-for="(meal, index) in menu.meal[dayindex - 1]">
                <MealCard :id="meal.mealId" :menu-id="props.menuId" :card-index="index" :dayid="(dayindex - 1)" :identification="meal.identification" :description="meal.description"/>
            </div>
        </div>
    </div>
</template>

<style scoped>
.section-details {
    margin: 0px;
    padding: 0px;
    margin-bottom: 20px;
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

.modal-btn-add {
    height: 30px;
    width: 120px;
    font-weight: 600;
    margin-bottom: 5px;
    font-size: 15px;
    border: 2px solid rgb(0, 160, 0);
    border-radius: 5px;
    background-color: white;
}
.modal-btn-add:hover {
    background-color: rgb(0, 160, 0);
}

.modal-btn-end {
    height: 30px;
    width: 120px;
    font-size: 15px;
    font-weight: 600;
    border: 2px solid rgb(230, 0, 0);
    border-radius: 5px;
    background-color: white;
}
.modal-btn-end:hover {
    background-color: rgb(230, 0, 0);
}

.meal-header {
    display: grid;
    grid-template-columns: 60% 40%;
    margin-bottom: 25px;
}
.meal-day-name {
    margin: 0;
    padding: 0;
}
.button-holder {
    text-align: end;
    margin-right: 15px;
}
.addMeal-button {
    height: 30px;
    width: 80px;
    font-size: 14px;
    font-weight: 600;
    border: 2px solid rgb(0, 160, 0);
    border-radius: 5px;
    background-color: white;
}
.addMeal-button:hover {
    background-color: rgb(0, 160, 0);
}

@media screen and (min-width: 700px) {
    .grid {
        max-width: 560px;
    }
}

</style>