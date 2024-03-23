<script lang="ts" setup>
import { computed } from 'vue';
import { useUsersStore } from '@/stores/users';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notificationsStore';

const users = useUsersStore();
const auth = useAuthStore();
const note = useNotificationStore();

const props = defineProps([
    'id',
    'cardNumber',
    'firstName',
    'lastName',
    'email',
    'role'
]);

async function deleteUser() {
    var ableToDelete: boolean = true
    await users.deleteUser(props.id, props.firstName, props.lastName, auth.token).catch(function(error) {
        if(error.response.status === 403) {
            auth.showModal = true;
            ableToDelete = false;
        }
        else if(error.response.status === 400) {
            note.sendErrorNotification(error.response.data.title, error.response.data.detail);
            ableToDelete  = false;
        }
        else if(error.response.status === 500) {
            note.sendDeletedNotification('Server Error', 'Something went wrong, please try again later');
        }
    });

    if(Number(ableToDelete) - Number(true) == 0) {
        users.users.splice(props.cardNumber, 1);
    }
}
</script>

<template>
    <div class="card">
        <div class="name-holder">
            <h1 class="card-name">{{ firstName }}</h1>
        </div>
        <div class="card-body">
            <div class="email-holder">
                <p class="data-type">Email address:</p>
                <p class="data-email email-holder-child">{{ email }}</p>
            </div>
            <div>
                <p class="data-type">Role:</p>
                <p class="data-role">{{ role }}</p>
            </div>
        </div>
        <div class="card-footer">
            <div></div>
            <button class="delete-button" @click.prevent="deleteUser">Delete</button>
        </div>
    </div>
</template>

<style scoped>
    .card {
        background-color: white;
        border-radius: 10px;
        margin: 15px;
        padding: 10px;
    }
    .name-holder {
        overflow: hidden;
    }
    .card-name {
        font-size: 24px;
        font-weight: 100;
    }
    .card-body {
        margin-left: 5px;
    }
    .card-footer {
        display: grid;
        grid-template-columns: 50% 50%;
    }
    .data-type {
        font-size: 20px;
        margin-top: 15px;
        margin-bottom: 10px;
    }
    .data-email {
        font-size: 18px;
    }
    .data-role {
        font-size: 16px;
    }
    .email-holder-child {
        overflow: hidden;
    }

    h1 {
        padding: 0;
        margin: 0;
    }
    p {
        margin: 0;
    }

    button {
        width: 100px;
        justify-self: end;
        font-size: 16px;
        height: 30px;
        border: none;
    }
    .delete-button {
        border: 2px solid rgb(230, 0, 0);
        background-color: white;
        border-radius: 5px;
        font-weight: 400;
    }
    .delete-button:hover {
        background-color: rgb(230, 0, 0);
    }
</style>