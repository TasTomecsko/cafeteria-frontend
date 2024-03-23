<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const user = reactive({
    username: '',
    password: ''
});

const loading = computed(() => useAuthStore().loading);
const errorMessage = ref('');

onMounted(() => {
    useAuthStore().loading = false;
});

async function onSubmit() {
    if(user.username != '' && user.password != '') {
        await useAuthStore().login(user.username, user.password)
        .catch(function (error) {
            if(!error.response) {
                errorMessage.value = "Unable to connect to Server"
            }
            else {
                errorMessage.value = error.response.data.detail;
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
            <h1>Login</h1>
        </div>
        <div class="input-holder">
            <label for="email">Email</label><br>
            <input type="email" id="email" placeholder="example@email.com" v-model="user.username" :disabled="loading" required>
        </div>
        <div class="input-holder">
            <label for="password">Password</label><br>
            <input type="password" id="password" placeholder="Password" v-model="user.password" :disabled="loading" required>
        </div>
        <div class="error-holder" v-if="errorMessage">
            {{ errorMessage }}
        </div>
        <div class="button-holder">
            <button type="submit" :disabled="loading" class="login-btn">Login</button>
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
        padding-top: 15px;
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
    }
    .login-btn:hover {
        background-color: rgb(0, 175, 0);
    }
    form {
        background-color: rgb(255, 255, 255);
        padding-top: 20px;
        padding-bottom: 0px;
        margin-left: 20%;
        margin-right: 20%;
        border-radius: 25px;
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