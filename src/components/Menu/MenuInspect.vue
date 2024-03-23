<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useMenuStore } from '@/stores/menuStore';
import { useNotificationStore } from '@/stores/notificationsStore';
import router from '@/router';
import EditMenu from './EditMenu.vue';
import MenuInfo from './MenuInfo.vue';
import MenuMealList from './MenuMealList.vue';

const auth = useAuthStore();
const menu = useMenuStore();
const note = useNotificationStore();
const editMode = ref(false);

const props = defineProps([
    'id',
]);

function errorConnect() {
    auth.showModal = true;
}

onMounted(async() => {
    await menu.getMenuById(props.id, auth.token).catch(function(error) {
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
});

function onEditClick() {
    editMode.value = true
}

function onCancelClick() {
    editMode.value = false
}

function onBackClick() {
    router.push('/menu');
}
</script>

<template>
    <div class="menu-holder">
        <div class="menu-time-details" v-if="editMode == false">
            <MenuInfo :id="props.id"/>
            <button class="edit-button" @click.prevent="onEditClick">Edit</button>
        </div>
        <div class="menu-time-details" v-else>
            <EditMenu :id="props.id"/>
            <button class="cancel-button" @click.prevent="onCancelClick">Cancel</button>
        </div>
        <div class="menu-meals-details">
            <MenuMealList :menu-id="props.id"/>
        </div>
    </div>
    <div class="back-button-holder">
        <button class="back-button" @click.prevent="onBackClick">Back</button>
    </div>
</template>

<style scoped>
    .menu-time-details {
        background-color: white;
        border-radius: 10px;
        margin: 15px;
        padding: 10px;
        text-align: center;
    }
    .menu-meals-details {
        background-color: white;
        border-radius: 10px;
        margin: 15px;
        padding: 10px;
    }
    
    .back-button-holder {
        text-align: end;
        margin-right: 15px;
    }
    .back-button {
        height: 30px;
        width: 100px;
        font-size: 14px;
        font-weight: 600;
        border: 2px solid rgb(230, 0, 0);
        border-radius: 5px;
    }
    .back-button:hover {
        background-color: rgb(230, 0, 0);
    }
    .cancel-button {
        height: 30px;
        width: 125px;
        font-size: 14px;
        font-weight: 600;
        border: 2px solid rgb(230, 0, 0);
        background-color: white;
        border-radius: 5px;
    }
    .cancel-button:hover {
        background-color: rgb(230, 0, 0);
    }
    .edit-button {
        height: 30px;
        width: 125px;
        font-size: 14px;
        font-weight: 600;
        border: 2px solid rgb(0, 160, 0);
        border-radius: 5px;
        background-color: white;
    }
    .edit-button:hover {
        background-color: rgb(0, 160, 0);
    }

    @media screen and (min-width: 700px) {
        .menu-meals-details {
            max-width: 550px;
            margin-left: auto;
            margin-right: auto;
        }
    }

    @media screen and (min-width: 1250px) {
        .menu-time-details {
            max-width: 1200px;
            margin-left: auto;
            margin-right: auto;
        }
    }
</style>