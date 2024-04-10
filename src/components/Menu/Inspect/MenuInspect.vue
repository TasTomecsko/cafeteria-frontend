<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useMenuStore } from '@/stores/menuStore';
import { useNotificationStore } from '@/stores/notificationsStore';
import router from '@/router';
import EditMenu from '@/components/Menu/Inspect/EditMenu.vue';
import MenuInfo from '@/components/Menu/Inspect/MenuInfo.vue';
import MenuMealList from '@/components/Menu/Inspect/MenuMealList.vue';
import Button from '@/assets/Button.vue';
import { buttonType } from '@/enums/buttonTypes';
import { useLanguageStore } from '@/stores/languageStore';

const auth = useAuthStore();
const menu = useMenuStore();
const note = useNotificationStore();
const language = useLanguageStore();
const editMode = ref(false);

const props = defineProps([
    'id'
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

function onOrdersClick() {
    router.push(`/menu/inspect/${props.id}/order`)
}
</script>

<template>
    <div class="menu-holder">
        <div class="menu-time-details" v-if="editMode == false">
            <MenuInfo :id="props.id"/>
            <Button @clicked="onEditClick" :text="language.languageFile.menu.inspect.menuInfo.editButton" :assigned-type="buttonType.GREEN" v-if="menu.menu.selectionStart > new Date().getTime()"/>
            <Button @clicked="onOrdersClick" :text="language.languageFile.menu.inspect.menuInfo.orderButton" :assigned-type="buttonType.BLUE" v-if="menu.menu.selectionStart < new Date().getTime()"/>
        </div>
        <div class="menu-time-details" v-else>
            <EditMenu :id="props.id"/>
            <Button @clicked="onCancelClick" :text="language.languageFile.menu.inspect.cancelButton" :assigned-type="buttonType.RED" v-if="menu.menu.selectionStart > new Date().getTime()"/>
        </div>
        <div class="menu-meals-details">
            <MenuMealList :menu-id="props.id"/>
        </div>
    </div>
    <div class="back-button-holder">
        <Button @clicked="onBackClick" :text="language.languageFile.menu.inspect.backButton" :assigned-type="buttonType.RED" class="back-button"/>
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
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        margin: 15px;
        padding: 10px;
    }
    
    .back-button-holder {
        text-align: end;
        margin-right: 15px;
    }
    .back-button {
        width: 100px;
        background-color: whitesmoke;
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