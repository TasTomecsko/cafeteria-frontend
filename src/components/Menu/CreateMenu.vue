<script lang="ts" setup>
import { computed, ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useMenuStore } from '@/stores/menuStore';
import { useNotificationStore } from '@/stores/notificationsStore';
import router from '@/router';

const auth = useAuthStore();
const menu = useMenuStore();
const note = useNotificationStore();
const editMode = ref(false);

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
                note.sendErrorNotification(error.response.data.title, error.response.data.detail);
            }
            else if(error.response.status === 409) {
                note.sendErrorNotification(error.response.data.title, error.response.data.detail);
            }
            else {
                note.sendDeletedNotification('Server Error', 'Something went wrong, please try again later');
            }
        });
    
    editMode.value = false;
}

function onBackClick() {
    router.push('/menu');
}

const minDateComputed = computed(() => {
    const date = new Date();

    var years = date.getFullYear().toString();
    var months = (date.getMonth() + 1).toString();
    var day = (date.getDate() + 1).toString();

    if(months.length == 1) {
        months = '0' + months; 
    }
    if(day.length == 1) {
        day = '0' + day;
    }

    return years + '-' + months + '-' + day
});

const min = minDateComputed.value.toString();
</script>

<template>
    <div class="wrapper">
        <h1 class="section-details">Create Menu</h1>
        <form @submit.prevent="onSubmit">
            <div class="grid">
                <div>
                    <label for="selectionStart" class="data-label">Meal selection starts at:</label><br>
                    <input type="date" id="selectionStart" v-model="timeDetails.selectionStart" :min="min"  required class="date-picker">
                </div>
                <div>
                    <label for="selectionEnd" class="data-label">Meal selection ends at:</label><br>
                    <input type="date" id="selectionEnd" v-model="timeDetails.selectionEnd" :min="min" required class="date-picker">
                </div>
                <div>
                    <label for="availabilityStart" class="data-label">Meals are available starting from:</label><br>
                    <input type="date" id="availabilityStart" v-model="timeDetails.availableFrom" :min="min" required class="date-picker">
                </div>
                <div>
                    <label for="availabilityEnd" class="data-label">Meal are available to:</label><br>
                    <input type="date" id="availabilityEnd" v-model="timeDetails.availableTo" :min="min" required class="date-picker">
                </div>
            </div>
            <button class="edit-button" type="submit">Create Menu</button>
        </form>
        <button class="back-button" @click.prevent="onBackClick">Cancel</button>
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
.back-button {
    height: 30px;
    width: 100px;
    font-size: 14px;
    font-weight: 600;
    border: 2px solid rgb(230, 0, 0);
    border-radius: 5px;
    background-color: white;
}
.back-button:hover {
    background-color: rgb(230, 0, 0);
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