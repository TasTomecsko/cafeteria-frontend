<script lang="ts" setup>
import { computed } from 'vue';
import { useMenuStore } from '@/stores/menuStore';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notificationsStore';
import router from '@/router';


const menu = useMenuStore();
const auth = useAuthStore();
const note = useNotificationStore();

const props = defineProps([
    'menuId',
    'cardNumber',
    'selectionStartDate',
    'selectionEndDate',
    'availabilityStartDate',
    'availabilityEndDate'
]);

const selectionStart = computed(() => {
    return convertMillisToDate(props.selectionStartDate);
});

const selectionEnd = computed(() => {
    return convertMillisToDate(props.selectionEndDate);
});

const availabilityStart = computed(() => {
    return convertMillisToDate(props.availabilityStartDate);
});

const availabilityEnd = computed(() => {
    return convertMillisToDate(props.availabilityEndDate);
});

function convertMillisToDate(milliseconds: number) {
    var converted_year = new Date(milliseconds).getFullYear().toString();
    var converted_month = (new Date(milliseconds).getMonth() + 1).toString();
    var converted_day = new Date(milliseconds).getDate().toString();

    if(converted_month.length == 1) {
        converted_month = '0' + converted_month; 
    }
    if(converted_day.length == 1) {
        converted_day = '0' + converted_day;
    }
    
    return converted_year + '.' + converted_month + '.' + converted_day + '.';
}

async function deleteMenu() {
    var ableToDelete: boolean = true
    await menu.deleteMenu(props.menuId, auth.token).catch(function(error) {
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
        menu.menus.splice(props.cardNumber, 1);
    }
}

function inspectMenu() {
    router.push(`/menu/inspect/${props.menuId}`);
}
</script>

<template>
    <div class="card">
        <div>
            <h1 class="card-name">Menu {{ menuId }}</h1>
        </div>
        <div class="card-body">
            <div>
                <p class="data-type">Meal selection starts at:</p>
                <p class="data-date">{{ selectionStart }}</p>
            </div>
            <div>
                <p class="data-type">Meal selection ands at:</p>
                <p class="data-date">{{ selectionEnd }}</p>
            </div>
            <div>
                <p class="data-type">Meals are available starting from:</p>
                <p class="data-date">{{ availabilityStart }}</p>
            </div>
            <div>
                <p class="data-type">Meal are available to:</p>
                <p class="data-date">{{ availabilityEnd }}</p>
            </div>
        </div>
        <div class="card-footer">
            <button class="inspect-button" @click.prevent="inspectMenu">Inspect</button>
            <button class="delete-button" @click.prevent="deleteMenu">Delete</button>
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
    .card-name {
        font-size: 18px;
        font-weight: 100;
    }
    .card-body {
        margin-left: 5px;
    }
    .card-footer {
        margin-top: 5px;
        display: grid;
        grid-template-columns: 50% 50%;
    }
    .data-type {
        font-size: 20px;
        margin-top: 15px;
        margin-bottom: 10px;
    }
    .data-date {
        font-size: 18px;
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
        background-color: white;
        border: 2px solid rgb(230, 0, 0);
        border-radius: 5px;
        font-weight: 400;
    }
    .delete-button:hover {
        background-color: rgb(230, 0, 0);
    }

    .inspect-button {
        background-color: white;
        border: 2px solid rgb(0, 175, 255);
        border-radius: 5px;
        font-weight: 400;
    }
    .inspect-button:hover {
        background-color: rgb(0, 175, 255);
    }
</style>