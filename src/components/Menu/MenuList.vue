<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth';
import { useMenuStore } from '@/stores/menuStore';
import { onMounted, ref, watch } from 'vue';
import MenuCard from './MenuCard.vue';
import { useNotificationStore } from '@/stores/notificationsStore';
import { useLanguageStore } from '@/stores/languageStore';

const auth = useAuthStore();
const menu = useMenuStore();
const note = useNotificationStore();
const language = useLanguageStore();

const menuData = ref();

function errorConnect() {
    auth.showModal = true;
}

onMounted(async() => {
    await menu.getMenus(auth.token).catch(function(error) {
        if(error.response.status === 403) {
            errorConnect()
        }
        else {
            note.sendDeletedNotification(language.languageFile.errors.server.title, language.languageFile.errors.server.message);
        }
    });
    menuData.value = menu.menus;
});

watch(menuData, async() => {
    menuData.value = menu.menus;
});
</script>

<template>
    <div class="button-holder">
        <RouterLink to="/menu/create" class="addButton"><b>{{ language.languageFile.menu.menuList.addButton }}</b></RouterLink>
    </div>
    <div class="container">
        <div class="card-holder" v-for="(menuInfo, index) in menuData">
            <MenuCard :menuId="menuInfo.menuId" :cardNumber="index" :selectionStartDate="menuInfo.selectionStart" :selectionEndDate="menuInfo.selectionEnd" 
            :availabilityStartDate="menuInfo.availableFrom" :availabilityEndDate="menuInfo.availableTo"/>
        </div>
    </div>
</template>

<style scoped>
.container {
    background-color: rgb(228, 228, 228);
    padding: 15px;
}

.button-holder {
    text-align: left;
    margin-top: auto;
    margin-bottom: auto;
    background-color: rgb(228, 228, 228);
    padding: 30px 20px 20px 20px;
}

.addButton {
    background-color: rgb(0, 160, 0);
    padding: 010px 15px 10px 15px;
    border-radius: 15px;
}

.addButton:hover {
    background-color: rgb(0, 175, 0);
}

a {
    text-decoration: none;
    color: black;
}
b {
    font-size: 16px;
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