<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth';
import { useUsersStore } from '@/stores/users';
import { onMounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import UserCard from './UserCard.vue';
import { useNotificationStore } from '@/stores/notificationsStore';

const auth = useAuthStore();
const users = useUsersStore();
const note = useNotificationStore();
const userData = ref();

function errorConnect() {
    auth.showModal = true;
}

onMounted(async() => {
    await users.getUsers(auth.token).catch(function (error) {
        if(error.response.status === 403) {
            errorConnect()
        }
        else {
            note.sendDeletedNotification('Server Error', 'Something went wrong, please try again later');
        }
    });
    userData.value = users.users;
});

watch(userData, async() => {
    userData.value = users.users;
});
</script>

<template>
    <div class="button-holder">
        <RouterLink to="/users/create" class="addButton"><b>ADD</b></RouterLink>
    </div>
    <div class="container">
        <div class="card-holder" v-for="(user, index) in userData">
            <UserCard :id="user.id" :cardNumber="index" :firstName="user.firstName" :lastName="user.lastName" :email="user.email" :role="user.role"/>
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