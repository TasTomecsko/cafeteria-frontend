<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth';
import { useUserInfoStore } from '@/stores/userInfo';
import { onMounted, ref, computed } from 'vue';
import RefreshModal from '@/components/RefreshModal.vue';
import { useNotificationStore } from '@/stores/notificationsStore';
import { useLanguageStore } from '@/stores/languageStore';
import NavbarDropdownButton from '@/assets/NavbarDropdownButton.vue';
import NavbarButton from '@/assets/NavbarButton.vue';
import { navIconType } from '@/enums/navIconTypes';

const auth = useAuthStore();
const userInfo = useUserInfoStore();
const language = useLanguageStore();
const role = ref();
const showModal = computed(() => auth.showModal);
const note = useNotificationStore();
const isNavOpen = ref(false);
const isSmallScreen = ref(false);

function logout() {
    userInfo.clearUserInfoStore();
    auth.logout();
}

function navControl() {
    if(isNavOpen.value)
        isNavOpen.value = false
    else
        isNavOpen.value = true
}

function setScreenSize() {
    if(window.innerWidth < 1200)
        isSmallScreen.value = true;
    else 
        isSmallScreen.value = false;
}

onMounted(async () => {
    window.addEventListener("resize", setScreenSize)
    auth.timer();
    await userInfo.getUserInfo(auth.token).catch(function (error) {
        if(error.response.status === 403) {
            auth.showModal = true;
        }
        else {
            note.sendDeletedNotification(language.languageFile.errors.server.title, language.languageFile.errors.server.message);
        }
    });
    role.value = userInfo.role;
});
</script>

<template>
    <header class="header">
        <menu class="menu">
            <div class="head-element-left">
                <div class="centerMenu" v-if="isSmallScreen">
                    <button @click.prevent="navControl" class="openMenuButton" :class="{'openMenuButtonActive': isNavOpen === true}"></button>
                </div>
                <div class="inlineDisplay" v-else>
                    <NavbarButton :nevigate-to="'/'" :button-text="language.languageFile.nav.home" :nav-menu-icon-type="navIconType.HOME"/>
                    <NavbarButton :nevigate-to="'/meals'" :button-text="language.languageFile.nav.meals" :nav-menu-icon-type="navIconType.MEALS"/>
                    <NavbarButton :nevigate-to="'/menu'" :button-text="language.languageFile.nav.menus" :nav-menu-icon-type="navIconType.MENUS" v-if="role === 'ADMIN'"/>
                    <NavbarButton :nevigate-to="'/users'" :button-text="language.languageFile.nav.users" :nav-menu-icon-type="navIconType.USERS" v-if="role === 'ADMIN'"/>
                </div>
            </div>
            <div class="head-element-right">
                <div class="centerLogout">
                    <button @click.prevent="logout" class="logout"></button>
                </div>
            </div>
        </menu>
    </header>
    <div v-if="isNavOpen && isSmallScreen" class="navigation" :class="{'navigation-smaller': role === 'USER'}">
        <NavbarDropdownButton :nevigate-to="'/'" :button-text="language.languageFile.nav.home" :nav-menu-icon-type="navIconType.HOME"/>
        <NavbarDropdownButton :nevigate-to="'/meals'" :button-text="language.languageFile.nav.meals" :nav-menu-icon-type="navIconType.MEALS"/>
        <NavbarDropdownButton :nevigate-to="'/menu'" :button-text="language.languageFile.nav.menus" :nav-menu-icon-type="navIconType.MENUS" v-if="role === 'ADMIN'"/>
        <NavbarDropdownButton :nevigate-to="'/users'" :button-text="language.languageFile.nav.users" :nav-menu-icon-type="navIconType.USERS" v-if="role === 'ADMIN'"/>
    </div>
    <RefreshModal v-if="showModal" />
</template>

<style scoped>
.header {
    background-color:rgb(0, 174, 255);
    height: 55px;
}
.menu {
    margin: 0;
    height: 55px;
    padding: 0 20px;
}
.logout {
    background-color: rgb(255, 0, 0);
    border: 1px solid rgb(255, 0, 0);
    text-decoration: none;
    border-radius: 5px;
    transition: .5s;
    background-image: url('@/assets/images/NavBar/Logout.svg');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 18px;
    height: 25px;
    width: 75px;
    padding: 14px 12px 14px 12px;
}
.logout:hover {
    background-color: rgb(220, 0, 0);
    transition: .5s;
}
.head-element-left {
    float: left;
    height: 55px;
    width: 150px;
}
.head-element-right {
    float: right;
    height: 55px;
    width: 150px;
}
.inlineDisplay {
    display: flex;
    justify-content: space-between;
    margin: calc((55px - 41px) / 2) 0;
}
.openMenuButton {
    background-image: url('@/assets/images/NavBar/NavBarMenu.svg');
    background-size: contain;
    background-repeat: no-repeat;
    border: none;
    height: 25px;
    width: 35px;
    background-color: rgba(0, 0, 0, 0);
}
.openMenuButton:hover {
    background-image: url('@/assets/images/NavBar/NavBarMenuHover.svg');
}
.openMenuButtonActive {
    background-image: url('@/assets/images/NavBar/NavBarMenuActive.svg');
}
.openMenuButtonActive:hover {
    background-image: url('@/assets/images/NavBar/NavBarMenuActiveHover.svg');
}
.navigation {
    position: absolute;
    z-index: 9996;
    top: 55px;
    left: 0;
    width: 200px;
    height: auto;
    background-color: rgb(255, 255, 255);
    padding: 20px 15px 10px 15px;
    display: grid;
    row-gap: 15px;
    grid-template-rows: 50px 50px 50px 50px;
    border-right: 1px solid black;
    border-bottom: 1px solid black;
}
.navigation-smaller {
    height: 115px;
}
.centerMenu {
    margin: calc((55px - 25px) / 2) 0;/* Calculated from the height of openMenuButton */
}
.centerLogout {
    margin: calc((55px - 30px) / 2) 0;
    text-align: end;
}
</style>