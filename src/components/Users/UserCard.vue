<script lang="ts" setup>
import { ref } from 'vue';
import { useUsersStore } from '@/stores/users';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notificationsStore';
import Button from '@/assets/Button.vue';
import { buttonType } from '@/enums/buttonTypes';
import { useLanguageStore } from '@/stores/languageStore';

const users = useUsersStore();
const auth = useAuthStore();
const note = useNotificationStore();
const language = useLanguageStore();

const showModal = ref(false);

const props = defineProps([
    'id',
    'cardNumber',
    'firstName',
    'lastName',
    'email',
    'role'
]);

function openModal() {
    showModal.value = true;
}

function closeModal() {
    showModal.value = false;
}

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

    showModal.value = false;

    if(Number(ableToDelete) - Number(true) == 0) {
        users.users.splice(props.cardNumber, 1);
    }
}
</script>

<template>
    <div class="modal-wrapper" v-if="showModal">
        <div class="modal-body">
            <h1 class="warning">{{ language.languageFile.users.deleteMessage.replace("$first", props.firstName).replace("$last", props.lastName) }}</h1>
            <div class="modal-button-holder">
                <div><Button @clicked="deleteUser" :text="language.languageFile.users.deleteButton" :assigned-type="buttonType.RED"/></div>
                <div><Button @clicked="closeModal" :text="language.languageFile.users.cancelButton" :assigned-type="buttonType.RED"/></div>
            </div>
        </div>
    </div>
    <div class="card">
        <div class="name-holder">
            <h1 class="card-name">{{ firstName }}</h1>
        </div>
        <div class="card-body">
            <div class="email-holder">
                <p class="data-type">{{ language.languageFile.users.email }}:</p>
                <p class="data-email email-holder-child">{{ email }}</p>
            </div>
            <div>
                <p class="data-type">{{ language.languageFile.users.role }}:</p>
                <p class="data-role">{{ role }}</p>
            </div>
        </div>
        <div class="card-footer">
            <div></div>
            <Button @clicked="openModal" :text="language.languageFile.users.deleteButton" :assigned-type="buttonType.RED"/>
        </div>
    </div>
</template>

<style scoped>
    .modal-wrapper {
        position: fixed;
        z-index: 9997;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
    }
    .modal-body {
        width: 350px;
        margin: 150px auto;
        padding: 20px 30px;
        background-color: white;
        border-radius: 4px;
        text-align: center;
    }
    .warning {
        font-size: 25px;
    }
    .modal-button-holder {
        display: grid;
        grid-template-columns: 50% 50%;
        text-align: center;
    }
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
        justify-self: end;
    }
</style>