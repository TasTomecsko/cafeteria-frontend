<script lang="ts" setup>
import HeadBar from '@/components/HeadBar.vue';
import UserInformation from '@/components/Home/UserInformation.vue';
import UpdateUser from '@/components/Home/UpdateUser.vue';
import { useLanguageStore } from '@/stores/languageStore';

const language = useLanguageStore();
</script>

<template>
    <HeadBar/>
    <div class="wrapper">
        <div class="user-view-header">
            <h1 class="page-title">{{ language.languageFile.home.home }}</h1>
        </div>
        <div class="page-content">
            <div class="container">
                <UserInformation/>
                <div class="divider"></div>
                <UpdateUser/>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .wrapper {
        padding: 0px 20px 20px 20px;
    }
    h1 {
        margin: 0;
        padding: 0;
        font-size: 34px;
    }
    .user-view-header {
        padding-top: 15px;
    }
    .page-title {
        padding-left: 10px;
    }
    .page-content {
        height: auto;
        padding: 15px;
    }
    .container {
        background-color: rgb(228, 228, 228);
        padding: 15px;
    }
    .divider {
        margin: 15px;
    }

    @media screen and (min-width: 800px) {
        .container {
            display: grid;
            grid-template-columns: calc(50% - 15px) 15px 50%;
        }
    }

    @media screen and (min-width: 1200px) {
        
    }
</style>