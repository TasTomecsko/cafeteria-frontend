<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth';
import { useHomeStore } from '@/stores/home';
import { useNotificationStore } from '@/stores/notificationsStore';
import { reactive } from 'vue';
import Button from '@/assets/Button.vue';
import { buttonType } from '@/enums/buttonTypes';
import { useLanguageStore } from '@/stores/languageStore';

const auth = useAuthStore();
const home = useHomeStore();
const note = useNotificationStore();
const language = useLanguageStore();

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
            note.sendErrorNotificationLocalized(error.response.data,  language.languageId);
        }
        else if(error.response.status === 404) {
            note.sendDeletedNotificationLocalized(error.response.data,  language.languageId);
        }
        else if(error.response.status === 500) {
            note.sendDeletedNotification(language.languageFile.errors.server.title, language.languageFile.errors.server.message);
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

function disable() {
    return user.firstName == '' ||
            user.lastName == '' || 
            user.oldPassword == '' ||
            user.newPassword == '';
}

function canCancel() {
    if(user.firstName != '' || user.lastName != '' || user.oldPassword != '' ||user.newPassword != '') {
        return false;
    }
    else {
        return true
    }
}
</script>

<template>
    <form class="form">
        <div class="form-name">
            <h1 class="form-name-text">{{ language.languageFile.home.userInformationUpdate.title }}</h1>
        </div>
        <div class="input-holder">
            <label class="label" for="firstName">{{ language.languageFile.home.userInformationUpdate.firstName }}:</label><br>
            <input class="input" type="text" id="firstName" :placeholder="home.userData.firstName" v-model="user.firstName" required :disabled="isLoading">
        </div>
        <div class="input-holder">
            <label class="label" for="lastName">{{ language.languageFile.home.userInformationUpdate.lastName }}:</label><br>
            <input class="input" type="text" id="lastName" :placeholder="home.userData.lastName" v-model="user.lastName" required :disabled="isLoading">
        </div>
        <div class="input-holder">
            <label class="label" for="oldPassword">{{ language.languageFile.home.userInformationUpdate.oldPass }}:</label><br>
            <input class="input" type="text" id="oldPassword" placeholder="12345" v-model="user.oldPassword" required :disabled="isLoading">
        </div>
        <div class="input-holder">
            <label class="label" for="newPassword">{{ language.languageFile.home.userInformationUpdate.newPass }}:</label><br>
            <input class="input" type="text" id="newPassword" placeholder="67890" v-model="user.newPassword" required :disabled="isLoading">
        </div>
        <div class="button-holder">
            <Button @clicked="onSubmit" :text="language.languageFile.home.userInformationUpdate.editButton" 
            :assigned-type="buttonType.GREEN" :is-disabled="disable() || isLoading" class="edit-button"/>
            <Button @clicked="onCancel" :text="language.languageFile.home.userInformationUpdate.cancelButton" 
            :assigned-type="buttonType.RED" :is-disabled="canCancel() || isLoading" class="cancel-button"/>
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

.edit-button {
    margin-right: 40px;
}

.cancel-button {
    margin-left: 20px;
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