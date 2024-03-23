<script lang="ts" setup>
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUserInfoStore } from '@/stores/userInfo';
import { onMounted, ref, computed } from 'vue';
import RefreshModal from '@/components/RefreshModal.vue';
import { useNotificationStore } from '@/stores/notificationsStore';

const auth = useAuthStore();
const userInfo = useUserInfoStore();
const role = ref();
const showModal = computed(() => auth.showModal);
const note = useNotificationStore();

function logout() {
    userInfo.clearUserInfoStore();
    auth.logout();
}

onMounted(async () => {
    auth.timer();
    await userInfo.getUserInfo(auth.token).catch(function (error) {
        if(error.response.status === 403) {
            auth.showModal = true;
        }
        else {
            note.sendDeletedNotification('Server Error', 'Something went wrong, please try again later');
        }
    });
    role.value = userInfo.role
});
</script>

<template>
    <header>
        <menu>
            <div>
                <li class="routerLink"><RouterLink class="link" to="/">Home</RouterLink></li>
                <li class="routerLink"><RouterLink class="link" to="/meals">Meals</RouterLink></li>
                <li class="routerLink" v-if="role == 'ADMIN'"><RouterLink class="link" to="/menu">Menu</RouterLink></li>
                <li class="routerLink" v-if="role == 'ADMIN'"><RouterLink class="link" to="/users">Users</RouterLink></li>
            </div>
            <li class="logout link"><a class="logout-link" href="#" @click="logout">Logout</a></li>
        </menu>
    </header>
    <RefreshModal v-if="showModal" />
</template>

<style scoped>
    header {
        background-color:rgb(255, 255, 255);
        height: 55px;
    }
    menu {
        margin: 0;
        padding: 15px 20px;
        display: grid;
        grid-template-columns: 90% 10%;
    }
    li {
        display: inline;
        margin-right: 15px;
    }
    .link {
        font-size: 20px;
        color: black;
    }
    a {
        text-decoration: none;
        background-color: rgb(255, 255, 255);
        padding: 8px;
        border-radius: 10px;
    }
    .link:hover {
        background-color: rgb(211, 211, 211);
    }
    .logout {
        justify-self: end;
        margin: 0;
    }
    .logout-link {
        color: white;
        background-color: rgb(230, 0, 0);
    }
    .logout-link:hover {
        background-color: rgb(250, 0, 0);
    }
</style>./Notifications/Notifications.vue