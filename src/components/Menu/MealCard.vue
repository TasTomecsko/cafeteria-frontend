<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth';
import { useMenuStore } from '@/stores/menuStore';
import { useNotificationStore } from '@/stores/notificationsStore';

const menu = useMenuStore();
const auth = useAuthStore();
const note = useNotificationStore();

const props = defineProps([
    'id',
    'menuId',
    'dayid',
    'cardIndex',
    'identification',
    'description'
]);

function errorConnect() {
    auth.showModal = true;
}

async function deleteMeal() {
    await menu.deleteMeal(props.dayid, props.id, props.menuId, auth.token).catch(function(error) {
        if(error.response.status === 403) {
            errorConnect()
        }
        else if(error.response.status === 400) {
            note.sendErrorNotification(error.response.data.title, error.response.data.detail);
        }
        else {
            note.sendDeletedNotification('Server Error', 'Something went wrong, please try again later');
        }
    });
}
</script>
<template>
    <div class="card-body">
        <div class="grid-body-left">
            <h4 class="mealIdentifyer">{{ props.identification }}</h4>
            <p class="mealDescription">{{ props.description }}</p>
        </div> 
        <div class="grid-body-right">
            <button class="delete-button" @click.prevent="deleteMeal">Delete</button>
        </div>
    </div>
</template>

<style scoped>
.card-body {
    background-color: white;
    padding: 5px;
    margin-bottom: 15px;
    border-radius: 5px;
    border: rgba(0, 220, 255, 0.5) solid;
    display: grid;
    grid-template-columns: 75% 25%;
}
.mealIdentifyer {
    margin: 0;
    padding: 0;
}
.mealDescription {
    margin: 0;
    padding: 0;
}
.grid-body-left {
    margin-left: 5px;
}
.grid-body-right {
    text-align: center;
    margin-top: auto;
    margin-bottom: auto;
}
.delete-button {
    height: 30px;
    width: fit-content;
    font-size: 15px;
    font-weight: 600;
    border: 2px solid rgb(230, 0, 0);
    border-radius: 5px;
    background-color: white;
}
.delete-button:hover {
    background-color: rgb(230, 0, 0);
}
</style>