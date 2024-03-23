<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth';
import { useHomeStore } from '@/stores/home';
import { useNotificationStore } from '@/stores/notificationsStore';
import { reactive } from 'vue';

const auth = useAuthStore();
const home = useHomeStore();
const note = useNotificationStore();

var isLoading = false;

const user = reactive({
    firstName: '',
    lastName: '',
    oldPassword: '',
    newPassword: ''
});

async function onSubmit() {
    isLoading = true;
    await home.updateUser({
        firstName: user.firstName, 
        lastName: user.lastName,
        oldPassword: user.oldPassword,
        newPassword: user.newPassword
    }, auth.token)
    .catch(function(error) {
        isLoading = false;
        if(error.response.status === 403) {
            auth.showModal = true;
        }
        else if(error.response.status === 400) {
            note.sendErrorNotification(error.response.data.title, error.response.data.detail);
        }
        else if(error.response.status === 500) {
            note.sendDeletedNotification('Server Error', 'Something went wrong, please try again later');
        }
    });

    user.firstName = '';
    user.lastName = '';
    user.oldPassword = '';
    user.newPassword  = '';
    isLoading = false;
}

function onCancel() {
    user.firstName = '';
    user.lastName = '';
    user.oldPassword = '';
    user.newPassword  = '';
}
</script>

<template>
    <form class="form" @submit.prevent="onSubmit">
        <div class="form-name">
            <h1 class="form-name-text">Update User Details</h1>
        </div>
        <div class="input-holder">
            <label class="label" for="firstName">First Name:</label><br>
            <input class="input" type="text" id="firstName" :placeholder="home.userData.firstName" v-model="user.firstName" required :disabled="isLoading">
        </div>
        <div class="input-holder">
            <label class="label" for="lastName">Last Name:</label><br>
            <input class="input" type="text" id="lastName" :placeholder="home.userData.lastName" v-model="user.lastName" required :disabled="isLoading">
        </div>
        <div class="input-holder">
            <label class="label" for="oldPassword">Old Password:</label><br>
            <input class="input" type="text" id="oldPassword" placeholder="oldpassword123" v-model="user.oldPassword" required :disabled="isLoading">
        </div>
        <div class="input-holder">
            <label class="label" for="newPassword">New Password: </label><br>
            <input class="input" type="text" id="newPassword" placeholder="newpassword456" v-model="user.newPassword" required :disabled="isLoading">
        </div>
        <div class="button-holder">
            <button type="submit" class="create-button" :disabled="isLoading">Edit</button>
            <button type="button" class="cancel-button" @click.prevent="onCancel" :disabled="isLoading">Cancel</button>
        </div>
    </form>
</template>

<style scoped>
h1 {
    margin: 0;
    padding: 0;
}
.form {
    background-color: white;
    padding: 25px;
    text-align: center;
}
.form-name {
    margin-bottom: 20px;
}
.form-name-text {
    font-size: 26px;
    font-weight: 600;
}
.input-holder {
    margin-bottom: 15px;
    padding: 2px;
}
.label {
    font-size: 18px;
}
.input {
    font-size: 14px;
    margin-top: 5px;
    width: 200px;
    height: 20px;
    padding: 3px;
}
.select {
    font-size: 14px;
    margin-top: 5px;
    width: 210px;
    padding: 5px 0 5px 0;
}
.button-holder {
    margin-top: 25px;
}

.create-button {
    height: 40px;
    width: 100px;
    font-size: 16px;
    font-weight: 600;
    border: 2px solid rgb(0, 160, 0);
    background-color: white;
    border-radius: 5px;
    margin-right: 40px;
}
.create-button:hover {
    background-color: rgb(0, 160, 0);
}

.cancel-button {
    height: 40px;
    width: 100px;
    font-size: 16px;
    font-weight: 600;
    border: 2px solid rgb(230, 0, 0);
    background-color: white;
    border-radius: 5px;
    margin-left: 20px;
}
.cancel-button:hover {
    background-color: rgb(230, 0, 0);
}

@media screen and (min-width: 600px) {
    h1 {
        font-size: 28px;
    }
    .input {
        width: 250px;
    }
}

@media screen and (min-width: 950px) {
    h1 {
        font-size: 30px;
    }
    .label {
        font-size: 19px;
    }
    .input {
        width: 275px;
    }
}

@media screen and (min-width: 1200px) {
    h1 {
        font-size: 32px;
    }
    .label {
        font-size: 20px;
    }
    .input {
        width: 300px;
    }
}
</style>