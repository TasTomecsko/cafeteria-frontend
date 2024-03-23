<script lang="ts" setup>
import HeadBar from '@/components/HeadBar.vue';
import { RouterView } from 'vue-router'
</script>

<template>
    <HeadBar/>
    <div class="wrapper">
        <div class="user-view-header">
            <h1 class="page-title">Users</h1>
        </div>
        <div class="page-content">
            <RouterView/>
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
</style>