<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth';
import { onMounted, ref } from 'vue';
import { useNotificationStore } from '@/stores/notificationsStore';
import { useMealStore } from '@/stores/mealStore';
import SelectableMenuCard from './SelectableMenuCard.vue';

const auth = useAuthStore();
const note = useNotificationStore();
const meal = useMealStore();

const menuData = ref();

function errorConnect() {
    auth.showModal = true;
}

onMounted(async() => {
    await meal.getMenuToSelect(auth.token).catch(function(error) {
        if(error.response.status === 403) {
            errorConnect()
        }
        else {
            note.sendDeletedNotification('Server Error', 'Something went wrong, please try again later');
        }
    });
    menuData.value = meal.menus;
});
</script>

<template>
    <div class="page-title-container">
        <h1 class="page-title">Available Menus</h1>
        <div class="button-holder">
            <button class="todays-meal-button">Todays Meal</button>
        </div>
    </div>
    <div class="container">
        <div class="card-holder" v-for="menuInfo in menuData">
            <SelectableMenuCard :menu-id="menuInfo.menuId" :selectionStartDate="menuInfo.selectionStart" :selectionEndDate="menuInfo.selectionEnd"/>
        </div>
    </div>
</template>

<style scoped>
.page-title-container {
    background-color: rgb(228, 228, 228);
    padding-top: 15px;
    padding-left: 30px;
    display: grid;
    grid-template-columns: 50% 50%;
}
.page-title {
    padding: 0;
    margin: 0;
}
.container {
    background-color: rgb(228, 228, 228);
    padding: 15px;
}
.button-holder {
    text-align: end;
    padding-right: 15px;
}
.todays-meal-button {
    background-color: rgba(0, 0, 0, 0);
    font-size: 16px;
    border: 2px solid rgb(0, 175, 255);
    padding: 5px;
    border-radius: 5px;
    font-weight: 400;
}
.todays-meal-button:hover {
    background-color: rgb(0, 175, 255);
}
@media screen and (min-width: 840px) {
    .container {
        display: grid;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (min-width: 1200px) {
    .container {
        display: grid;
        grid-template-columns: 33.3% 33.3% 33.3%;
    }
}
</style>