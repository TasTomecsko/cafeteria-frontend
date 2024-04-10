<script lang="ts" setup>
    import LoginForm from '../components/LoginForm.vue';

</script>

<template>
<div class="container">
    <div class="left-side">
        <h1 class="title">Cafateria Example</h1>
        <login-form />
    </div>
    <div class="right-side">
        <div class="fog">
            
        </div>
    </div>
</div>
</template>

<style scoped>
    .container {
        display: grid;
        grid-template-columns: 100% 0%;
    }
    .left-side {
        height: 100%;
        background-size: cover;
        height: 90vh;
        margin-top: 10vh;
    }
    .title {
        text-align: center;
        font-size: 35px;
    }

    @media screen and (min-width: 850px) {
        .container {
            display: grid;
            grid-template-columns: 50% 50%;
        }
        .right-side {
            background-color: rgb(241, 241, 241); /* For browsers that do not support gradients */
            background-image: linear-gradient(rgb(0, 204, 255), rgb(48, 135, 248));
            background-size: cover;
            height: 100vh;
            min-height: 450px;
        }
        .fog {
            height: 100%;
            width: 100%;
            background-color: rgba(255, 255, 255, 0.1);
        }
        .title {
            font-size: 40px;
        }
    }
</style>