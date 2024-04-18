<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useMenuStore } from '@/stores/menuStore';
import { useNotificationStore } from '@/stores/notificationsStore';
import router from '@/router';
import Button from '@/assets/Button.vue';
import { buttonType } from '@/enums/buttonTypes';
import { useLanguageStore } from '@/stores/languageStore';

const auth = useAuthStore();
const menu = useMenuStore();
const note = useNotificationStore();
const editMode = ref(false);
const language = useLanguageStore();

const timeDetails = reactive({
    selectionStart: '',
    selectionEnd: '',
    availableFrom: '',
    availableTo: ''
});

function errorConnect() {
    auth.showModal = true;
}

async function onSubmit() {
    await menu.createMenu(new Date(timeDetails.selectionStart), new Date(timeDetails.selectionEnd), 
        new Date(timeDetails.availableFrom), new Date(timeDetails.availableTo), auth.token).catch(function(error) {
            if(error.response.status == 403) {
                errorConnect()
            }
            else if(error.response.status === 400) {
                note.sendErrorNotificationLocalized(error.response.data, language.languageId);
            }
            else if(error.response.status === 409) {
                note.sendErrorNotificationLocalized(error.response.data, language.languageId);
            }
            else {
                note.sendDeletedNotification(language.languageFile.errors.server.title, language.languageFile.errors.server.message);
            }
        });
    
    editMode.value = false;
}

function onBackClick() {
    router.push('/menu');
}

function disable() {
    return timeDetails.availableFrom == '' ||
            timeDetails.availableTo == '' ||
            timeDetails.selectionStart == '' ||
            timeDetails.selectionEnd == '';
}

const min = menu.getDateOfToday();
</script>

<template>
    <div class="wrapper">
        <h1 class="section-details">{{ language.languageFile.menu.create.title }}</h1>
        <form>
            <div class="grid">
                <div>
                    <label for="selectionStart" class="data-label">{{ language.languageFile.menu.create.selectionStart }}:</label><br>
                    <input type="date" id="selectionStart" v-model="timeDetails.selectionStart" :min="min"  required class="date-picker">
                </div>
                <div>
                    <label for="selectionEnd" class="data-label">{{ language.languageFile.menu.create.selectionEnd }}:</label><br>
                    <input type="date" id="selectionEnd" v-model="timeDetails.selectionEnd" :min="min" required class="date-picker">
                </div>
                <div>
                    <label for="availabilityStart" class="data-label">{{ language.languageFile.menu.create.availableStart }}:</label><br>
                    <input type="date" id="availabilityStart" v-model="timeDetails.availableFrom" :min="min" required class="date-picker">
                </div>
                <div>
                    <label for="availabilityEnd" class="data-label">{{ language.languageFile.menu.create.availableTo }}:</label><br>
                    <input type="date" id="availabilityEnd" v-model="timeDetails.availableTo" :min="min" required class="date-picker">
                </div>
            </div>
            <Button @clicked="onSubmit" :text="language.languageFile.menu.create.createButton" :assigned-type="buttonType.GREEN" :is-disabled="disable()" class="create-button"/>
        </form>
        <Button @clicked="onBackClick" :text="language.languageFile.menu.create.cancelButton" :assigned-type="buttonType.RED"/>
    </div>
</template>

<style scoped>
form {
    margin-bottom: 10px;
}
.wrapper {
    background-color: white;
    border-radius: 10px;
    margin: 15px;
    padding: 10px;
    text-align: center;
}
.section-details {
    margin: 0px;
    padding: 0px;
    margin-bottom: 20px;
    font-size: 28px;
}
.data-label {
    padding: 0;
    margin: 0;
    font-size: 20px;
    margin-bottom: 5px;
}
.date-picker {
    padding: 0;
    margin: 0;
    font-size: 16px;
    margin-top: 5px;
    margin-bottom: 15px;
    width: 200px;
    height: 20px;
}
.create-button {
    min-width: 120px;
    width: fit-content;
}

@media screen and (min-width: 700px) {
    .grid {
        display: grid;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (min-width: 1200px) {
    .grid {
        display: grid;
        grid-template-columns: 25% 25% 25% 25%;
    }
    .wrapper {
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
    }
}
</style>