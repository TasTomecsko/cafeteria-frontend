<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth';
import { onMounted, ref } from 'vue';
import { useNotificationStore } from '@/stores/notificationsStore';
import { useMealStore } from '@/stores/mealStore';
import SelectableMenuCard from './SelectableMenuCard.vue';
import Button from '@/assets/Button.vue';
import { buttonType } from '@/enums/buttonTypes';
import router from '@/router';
import { useLanguageStore } from '@/stores/languageStore';

const auth = useAuthStore();
const note = useNotificationStore();
const meal = useMealStore();
const language = useLanguageStore();

const menuData = ref();

function errorConnect() {
    auth.showModal = true;
}

function showTodaysMeal() {
    router.push('meals/ordered-meal');
}

onMounted(async() => {
    await meal.getMenuToSelect(auth.token).catch(function(error) {
        if(error.response.status === 403) {
            errorConnect()
        }
        else {
            note.sendDeletedNotification(language.languageFile.errors.server.title, language.languageFile.errors.server.message);
        }
    });
    menuData.value = meal.menus;
});
</script>

<template>
    <div class="page-title-container">
        <h1 class="page-title">{{ language.languageFile.meal.awailableMenus.title }}</h1>
        <div class="button-holder">
            <Button @clicked="showTodaysMeal" :text="language.languageFile.meal.awailableMenus.mealButton" :assigned-type="buttonType.BLUE" class="todays-meal-button"/>
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
    font-size: 24px;
}
.container {
    background-color: rgb(228, 228, 228);
    padding: 15px;
}
.button-holder {
    text-align: end;
    padding-right: 15px;
    margin-top: auto;
    margin-bottom: auto;
}
.todays-meal-button {
    background-color: rgba(0, 0, 0, 0);
}

@media screen and (min-width: 840px) {
    .container {
        display: grid;
        grid-template-columns: 50% 50%;
    }
    .page-title {
        font-size: 28px;
    }
}
@media screen and (min-width: 1200px) {
    .container {
        display: grid;
        grid-template-columns: 33.3% 33.3% 33.3%;
    }
    .page-title {
        font-size: 32px;
    }
}
</style>