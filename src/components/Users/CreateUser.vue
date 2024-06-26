<script lang="ts" setup>
import { reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useUsersStore } from '@/stores/users';
import { useNotificationStore } from '@/stores/notificationsStore';
import router from '@/router';
import Button from '@/assets/Button.vue';
import { buttonType } from '@/enums/buttonTypes';
import { useLanguageStore } from '@/stores/languageStore';

const auth = useAuthStore();
const users = useUsersStore();
const note = useNotificationStore();
const language = useLanguageStore();

const user = reactive({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: ''
});

async function onSubmit() {
    await users.addUser(user.firstName, user.lastName, user.email, user.password, parseInt(user.role), auth.token).catch(function(error) {
        if(error.response.status === 403) {
            auth.showModal = true;
        }
        else if(error.response.status === 400) {
            note.sendErrorNotificationLocalized(error.response.data, language.languageId);
        }
        else if(error.response.status === 500) {
            note.sendDeletedNotification(language.languageFile.errors.server.title, language.languageFile.errors.server.message);
        }
    });
}

function onCancel() {
    router.push('/users');
}

function disable() {
    return user.firstName == '' ||
            user.lastName == '' ||
            user.email == '' ||
            user.password == '' ||
            user.role == '';
}
</script>

<template>
    <form class="form">
        <div class="form-name">
            <h1>{{ language.languageFile.users.createUser.title }}</h1>
        </div>
        <div class="input-holder">
            <label class="label" for="firstName">{{ language.languageFile.users.createUser.firstName }}:</label><br>
            <input class="input" type="text" id="firstName" placeholder="John" v-model="user.firstName" required>
        </div>
        <div class="input-holder">
            <label class="label" for="lastName">{{ language.languageFile.users.createUser.lastName }}:</label><br>
            <input class="input" type="text" id="lastName" placeholder="Doe" v-model="user.lastName" required>
        </div>
        <div class="input-holder">
            <label class="label" for="email">{{ language.languageFile.users.createUser.email }}:</label><br>
            <input class="input" type="email" id="email" placeholder="john.doe@example.com" v-model="user.email" required>
        </div>
        <div class="input-holder">
            <label class="label" for="password">{{ language.languageFile.users.createUser.password }}:</label><br>
            <input class="input" type="text" id="password" placeholder="Password" v-model="user.password" required>
        </div>
        <div class="input-holder">
            <label class="label" for="role">{{ language.languageFile.users.createUser.role }}:</label><br>
            <select class="select" name="role" id="role" v-model="user.role" required>
                <option value="0" selected>{{ language.languageFile.users.createUser.roles.user }}</option>
                <option value="1">{{ language.languageFile.users.createUser.roles.admin }}</option>
            </select>
        </div>
        <div class="button-holder">
            <Button @clicked="onSubmit" :text="language.languageFile.users.createUser.createButton" :assigned-type="buttonType.GREEN"
                :is-disabled="disable()"
                class="create-button"/>
            <Button @clicked="onCancel" :text="language.languageFile.users.createUser.cancelButton" :assigned-type="buttonType.RED" class="cancel-button"/>
        </div>
    </form>
</template>

<style scoped>
h1 {
    margin: 0;
    padding: 0;
    font-size: 26px;
    font-weight: 500;
}
.form {
    background-color: white;
    border-radius: 15px;
    padding: 25px;
    text-align: center;
}
.form-name {
    margin-bottom: 20px;
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
    margin-right: 40px;
}

.cancel-button {
    margin-left: 20px;
}

@media screen and (min-width: 600px) {
    h1 {
        font-size: 28px;
    }
    .form {
        width: 450px;
        margin: 0 auto 0 auto;
    }
    .input {
        width: 250px;
    }
    .select {
        width: 260px;
    }
}

@media screen and (min-width: 950px) {
    h1 {
        font-size: 30px;
    }
    .label {
        font-size: 19px;
    }
    .form {
        width: 475px;
        margin: 0 auto 0 auto;
    }
    .input {
        width: 275px;
    }
    .select {
        width: 285px;
    }
}

@media screen and (min-width: 1200px) {
    h1 {
        font-size: 32px;
    }
    .label {
        font-size: 20px;
    }
    .form {
        width: 500px;
        margin: 0 auto 0 auto;
    }
    .input {
        width: 300px;
    }
    .select {
        width: 310px;
    }
}
</style>