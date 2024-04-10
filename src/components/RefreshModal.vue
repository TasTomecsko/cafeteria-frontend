<script lang="ts" setup>
    import { useAuthStore } from '@/stores/auth';
    import { useUserInfoStore } from '@/stores/userInfo';
    import Button from '@/assets/Button.vue';
    import { buttonType } from '@/enums/buttonTypes';

    const auth = useAuthStore();
    const userInfo = useUserInfoStore();

    function onButtonClick() {
        auth.refreshAccessTokens().catch(function (error) {
            if(error.response.status == 403) {
                auth.logout();
                userInfo.clearUserInfoStore();
            }
            else if (error.response.status === 500) {
                auth.logout();
                userInfo.clearUserInfoStore();
            }
        });
    }
</script>

<template>
    <div class="modal-wrapper">
        <div class="modal-body">
            <h1>Your access to this site will soon expire!</h1>
            <div class="button-holder">
                <Button @clicked="onButtonClick" :text="'Stay logged in'" :assigned-type="buttonType.RED" class="modal-btn"/>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .modal-wrapper {
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
    }
    .modal-body {
        width: 300px;
        margin: 150px auto;
        padding: 20px 30px;
        background-color: white;
        border-radius: 4px;
    }
    h1 {
        margin-top: 0;
        font-size: 32px;
    }
    .button-holder {
        text-align: center;
    }
    .modal-btn {
        width: 50%;
    }
</style>