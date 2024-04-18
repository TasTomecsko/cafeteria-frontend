<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth';
import { useMenuStore } from '@/stores/menuStore';
import { useNotificationStore } from '@/stores/notificationsStore';
import { ref } from 'vue';
import Button from '@/assets/Button.vue';
import { buttonType } from '@/enums/buttonTypes';
import { useLanguageStore } from '@/stores/languageStore';

const menu = useMenuStore();
const auth = useAuthStore();
const note = useNotificationStore();
const language = useLanguageStore();

const showModal = ref(false);

const props = defineProps([
    'id',
    'menuId',
    'cardIndex',
    'identification',
    'description',
    'canBeDeleted'
]);


function errorConnect() {
    auth.showModal = true;
}

function openModal() {
    showModal.value = true;
}

function closeModal() {
    showModal.value = false;
}

async function deleteMeal() {
    await menu.deleteMeal(props.id, props.menuId, auth.token).catch(function(error) {
        if(error.response.status === 403) {
            errorConnect()
        }
        else if(error.response.status === 400) {
            note.sendErrorNotificationLocalized(error.response.data, language.languageId);
        }
        else {
            note.sendDeletedNotification(language.languageFile.errors.server.title, language.languageFile.errors.server.message);
        }
    });

    showModal.value = false;
}
</script>
<template>
    <div class="modal-wrapper" v-if="showModal">
        <div class="modal-body">
            <h1 class="warning">{{ language.languageFile.menu.inspect.mealDetails.modalDelete.text.replace("$description", props.description) }}</h1>
            <div class="modal-button-holder">
                <div><Button @clicked="deleteMeal" :text="language.languageFile.menu.inspect.mealDetails.modalDelete.deleteButton" :assigned-type="buttonType.RED"/></div>
                <div><Button @clicked="closeModal" :text="language.languageFile.menu.inspect.mealDetails.modalDelete.cancelButton" :assigned-type="buttonType.RED"/></div>
            </div>
        </div>
    </div>
    <div class="card-body">
        <div class="grid-body-left">
            <h4 class="mealIdentifyer">{{ props.identification }}</h4>
            <p class="mealDescription">{{ props.description }}</p>
        </div> 
        <div class="grid-body-right">
            <Button @clicked="openModal" :text="language.languageFile.menu.inspect.mealDetails.modalDelete.deleteButton" :assigned-type="buttonType.RED" class="delete-button" v-if="props.canBeDeleted"/>
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
.card-body {
    background-color: white;
    padding: 5px;
    margin-bottom: 15px;
    border-radius: 5px;
    border: rgb(255, 255, 255) solid;
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
    width: fit-content;
}
</style>