<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useLanguageStore } from '@/stores/languageStore';

const user = reactive({
    username: '',
    password: ''
});

const loading = computed(() => useAuthStore().loading);
const errorMessage = ref('');
const language = useLanguageStore();

onMounted(() => {
    useAuthStore().loading = false;
});

function languageSelect(language: string) {
    useLanguageStore().setPageLanguage(language);
}

async function onSubmit() {
    if(user.username != '' && user.password != '') {
        await useAuthStore().login(user.username, user.password)
        .catch(function (error) {
            if(!error.response) {
                errorMessage.value = language.languageFile.login.errorMessages.serverError.toString();
            }
            else {
                errorMessage.value = language.languageFile.login.errorMessages.badCredentials.toString();
            }
            useAuthStore().loading = false;
        });
        user.username = '';
        user.password = '';
    }
}
</script>

<template>
    <form @submit.prevent="onSubmit" class="loginForm">
        <div class="login-text">
            <h1>{{ language.languageFile.login.login }}</h1>
        </div>
        <div class="input-holder">
            <label for="email">{{ language.languageFile.login.email.label }}</label><br>
            <input type="email" id="email" :placeholder="language.languageFile.login.email.example" v-model="user.username" :disabled="loading" required>
        </div>
        <div class="input-holder">
            <label for="password">{{ language.languageFile.login.password.label }}</label><br>
            <input type="password" id="password" :placeholder="language.languageFile.login.password.example" v-model="user.password" :disabled="loading" required>
        </div>
        <div class="error-holder" v-if="errorMessage">
            {{ errorMessage }}
        </div>
        <div class="button-holder">
            <button type="submit" :disabled="loading" class="login-btn">{{ language.languageFile.login.buttonText }}</button>
        </div>
        <div class="lang-button-holder">
            <div class="grid-element">
                <button @click.prevent="languageSelect('german')" class="lang-select ger"></button>
            </div>
            <div class="grid-element">
                <button @click.prevent="languageSelect('hungarian')" class="lang-select hu"></button>
            </div>
            <div class="grid-element">
                <button @click.prevent="languageSelect('english')" class="lang-select uk"></button>
            </div>
        </div>
    </form>
</template>

<style scoped>
h1 {
    margin-top: 0;
    font-size: 32px;
}
label {
    font-size: 18px;
}
input {
    font-size: 12px;
    width: 200px;
    height: 20px;
}
.login-text {
    text-align: center;
}
.input-holder {
    padding-bottom: 15px;
    text-align: center;
}
.button-holder {
    padding-bottom: 15px;
    padding-top: 7px;
    text-align: center;
}
.error-holder {
    background-color: rgb(230, 0, 0);
    margin-left: 20%;
    margin-right: 20%;
    border-radius: 15px;
    padding-top: 5px;
    padding-bottom: 5px;
    text-align: center;
    color: white;
    font-size: 14px;
}
.login-btn {
    height: 30px;
    width: 100px;
    font-size: 14px;
    border: none;
    border-radius: 5px;
    background-color: rgb(0, 160, 0);
    transition: .5s;
}
.login-btn:hover {
    background-color: rgb(0, 175, 0);
    transition: .5s;
}
form {
    background-color: rgb(255, 255, 255);
    padding-top: 20px;
    padding-bottom: 0px;
    margin-left: 20%;
    margin-right: 20%;
    border-radius: 25px;
}

.lang-button-holder {
    display: grid;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
.lang-select {
    height: 30px;
    width: 50px;
    border: none;
}
.lang-select:hover {
    background-blend-mode: saturation;
    background-color: rgba(255, 255, 255, 0.2);
}
.grid-element {
    margin: 20px 0 15px 0;
    text-align: center;
}
.ger {
    background-image: url("@/assets/images/Germany.svg");
    background-size: contain;
}
.hu {
    background-image: url("@/assets/images/Hungary.svg");
    background-size: contain;
}
.uk {
    background-image: url("@/assets/images/United_Kingdom.svg");
    background-size: contain;
}

@media screen and (min-width: 600px) {
    h1 {
        font-size: 36px;
    }
    label {
        font-size: 20px;
    }
    input {
        font-size: 15px;
        width: 300px;
        height: 30px;
    }
    .error-holder {
        font-size: 18px;
    }
    button {
        width: 150px;
        font-size: 18px;
    }
}

@media screen and (min-width: 850px) {
    h1 {
        font-size: 36px;
    }
    label {
        font-size: 20px;
    }
    input {
        font-size: 15px;
        width: 200px;
        height: 25px;
    }
    .error-holder {
        font-size: 18px;
    }
    button {
        width: 150px;
        font-size: 18px;
    }
}

@media screen and (min-width: 1200px) {
    h1 {
        font-size: 36px;
    }
    label {
        font-size: 20px;
    }
    input {
        font-size: 15px;
        width: 300px;
        height: 30px;
    }
    .error-holder {
        font-size: 18px;
    }
    button {
        width: 150px;
        font-size: 18px;
    }
}
</style>