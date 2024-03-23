<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth';
import { useHomeStore } from '@/stores/home';
import { useNotificationStore } from '@/stores/notificationsStore';
import { onMounted } from 'vue';

const auth = useAuthStore();
const home = useHomeStore();
const note = useNotificationStore();

onMounted(async () => {
    await home.getUser(auth.token).catch(function(error) {
        if(error.response.status === 403) {
            auth.showModal = true;
        }
        else {
            note.sendDeletedNotification('Server Error', 'Something went wrong, please try again later');
        }
    });
});
</script>

<template>
    <div class="user-information-wrapper">
        <h1 class="user-information-title">User Information</h1>
        <div class="user-information-holder">
            <div class="information">
                <p class="data-name">First Name:</p>
                <p class="data">{{ home.userData.firstName }}</p>
            </div>
            <div class="information">
                <p class="data-name">Last Name:</p>
                <p class="data">{{ home.userData.lastName }}</p>
            </div>
            <div class="information">
                <p class="data-name">Email:</p>
                <p class="data">{{ home.userData.email }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
    h1 {
        margin: 0;
        padding: 0;
    }
    p {
        padding: 0;
        margin: 0;
    }
    .user-information-wrapper {
        background-color: white;
        padding: 10px;
        /*margin-bottom: 15px;*/
        text-align: left;
    }
    .user-information-title {
        font-size: 26px;
        font-weight: 600;
        margin-bottom: 15px;
    }
    .information {
        margin-top: 10px;
    }
    .data-name {
        font-size: 22px;
    }
    .data {
        font-size: 20px;
    }
</style>