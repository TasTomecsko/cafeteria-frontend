<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useMenuStore } from '@/stores/menuStore';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notificationsStore';
import router from '@/router';
import Button from '@/assets/Button.vue';
import { buttonType } from '@/enums/buttonTypes';
import { convertMillisToDate } from '@/functions/timeFunctions';
import { useLanguageStore } from '@/stores/languageStore';

const menu = useMenuStore();
const auth = useAuthStore();
const note = useNotificationStore();
const language = useLanguageStore();

const showModal = ref(false);

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

function openModal() {
    showModal.value = true;
}

function closeModal() {
    showModal.value = false;
}

async function deleteMenu() {
    var ableToDelete: boolean = true
    await menu.deleteMenu(props.menuId, auth.token).catch(function(error) {
        if(error.response.status === 403) {
            auth.showModal = true;
            ableToDelete = false;
        }
        else if(error.response.status === 400) {
            note.sendErrorNotificationLocalized(error.response.data, language.languageId);
            ableToDelete  = false;
        }
        else if(error.response.status === 500) {
            note.sendDeletedNotification(language.languageFile.errors.server.title, language.languageFile.errors.server.message);
        }
    });

    showModal.value = false;

    if(Number(ableToDelete) - Number(true) == 0) {
        menu.menus.splice(props.cardNumber, 1);
    }
}

function inspectMenu() {
    router.push(`/menu/inspect/${props.menuId}`);
}
</script>

<template>
    <div class="modal-wrapper" v-if="showModal">
        <div class="modal-body">
            <h1 class="warning">{{ language.languageFile.menu.menuList.modal.text.replace("$id", props.menuId) }}</h1>
            <div class="modal-button-holder">
                <div><Button @clicked="deleteMenu" :text="language.languageFile.menu.menuList.modal.deleteButton" :assigned-type="buttonType.RED"/></div>
                <div><Button @clicked="closeModal" :text="language.languageFile.menu.menuList.modal.cancelButton" :assigned-type="buttonType.RED"/></div>
            </div>
        </div>
    </div>
    <div class="card">
        <div>
            <h1 class="card-name">{{ language.languageFile.menu.menuList.title.replace("$id", props.menuId) }}</h1>
        </div>
        <div class="card-body">
            <div>
                <p class="data-type">{{ language.languageFile.menu.menuList.selectionStart }}:</p>
                <p class="data-date">{{ selectionStart }}</p>
            </div>
            <div>
                <p class="data-type">{{ language.languageFile.menu.menuList.selectionEnd }}:</p>
                <p class="data-date">{{ selectionEnd }}</p>
            </div>
            <div>
                <p class="data-type">{{ language.languageFile.menu.menuList.availableStart }}:</p>
                <p class="data-date">{{ availabilityStart }}</p>
            </div>
            <div>
                <p class="data-type">{{ language.languageFile.menu.menuList.availableTo }}:</p>
                <p class="data-date">{{ availabilityEnd }}</p>
            </div>
        </div>
        <div :class="{'card-footer': new Date().getTime() < props.selectionStartDate, 'card-footer-single': new Date().getTime() > props.selectionStartDate}">
            <Button @clicked="inspectMenu" :text="language.languageFile.menu.menuList.inspectButton" :assigned-type="buttonType.BLUE"/>
            <Button @clicked="openModal" :text="language.languageFile.menu.menuList.deleteButton" :assigned-type="buttonType.RED" 
                v-if="new Date().getTime() < props.selectionStartDate"/>
        </div>
    </div>
</template>

<style scoped>
    .modal-wrapper {
        position: fixed;
        z-index: 9997;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
    }
    .modal-body {
        width: 350px;
        margin: 150px auto;
        padding: 20px 30px;
        background-color: white;
        border-radius: 4px;
        text-align: center;
    }
    .warning {
        font-size: 25px;
    }
    .modal-button-holder {
        display: grid;
        grid-template-columns: 50% 50%;
        text-align: center;
    }
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
    .card-footer-single {
        margin-top: 5px;
        display: grid;
        grid-template-columns: 100%;
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
        justify-self: end;
    }
</style>