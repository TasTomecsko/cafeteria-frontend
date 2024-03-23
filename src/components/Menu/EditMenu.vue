<script lang="ts" setup>
import { computed, ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useMenuStore } from '@/stores/menuStore';
import { useNotificationStore } from '@/stores/notificationsStore';

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

const props = defineProps([
    'id'
]);

function errorConnect() {
    auth.showModal = true;
}

async function onSubmit() {
    var deleteDetails = true;
    await menu.editMenu(props.id, new Date(timeDetails.selectionStart), new Date(timeDetails.selectionEnd), 
        new Date(timeDetails.availableFrom), new Date(timeDetails.availableTo), auth.token).catch(function(error) {
            if(error.response.status == 403) {
                errorConnect()
                deleteDetails = false;
            }
            else if(error.response.status === 400 || error.response.status === 404 || error.response.status === 409) {
                note.sendErrorNotification(error.response.data.title, error.response.data.detail);
                deleteDetails = false;
            }
            else {
                note.sendDeletedNotification('Server Error', 'Something went wrong, please try again later');
                deleteDetails = false;
            }
        });

    if(deleteDetails) {
        timeDetails.selectionStart = '';
        timeDetails.selectionEnd = '';
        timeDetails.availableFrom = '';
        timeDetails.availableTo = '';
    }
    editMode.value = false;
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
    <h1 class="section-details">Edit Menu {{ props.id }}</h1>
    <form @submit.prevent="onSubmit">
        <div class="grid">
            <div>
                <p class="current-date">Currently set to: {{ new Date(menu.menu.selectionStart - new Date(menu.menu.selectionStart).getTimezoneOffset() * 60 * 1000).toISOString().slice(0,10) }}</p>
                <label for="selectionStart" class="data-label">Meal selection starts at:</label><br>
                <input type="date" id="selectionStart" v-model="timeDetails.selectionStart" :min="min"  required class="date-picker"><br>
            </div>
            <div>
                <p class="current-date">Currently set to: {{ new Date(menu.menu.selectionEnd - new Date(menu.menu.selectionEnd).getTimezoneOffset() * 60 * 1000).toISOString().slice(0,10) }}</p>
                <label for="selectionEnd" class="data-label">Meal selection ends at:</label><br>
                <input type="date" id="selectionEnd" v-model="timeDetails.selectionEnd" :min="min" required class="date-picker"><br>
            </div>
            <div>
                <p class="current-date">Currently set to: {{ new Date(menu.menu.availableFrom - new Date(menu.menu.availableFrom).getTimezoneOffset() * 60 * 1000).toISOString().slice(0,10) }}</p>
                <label for="availabilityStart" class="data-label">Meals are available starting from:</label><br>
                <input type="date" id="availabilityStart" v-model="timeDetails.availableFrom" :min="min" required class="date-picker"><br>
            </div>
            <div>
                <p class="current-date">Currently set to: {{ new Date(menu.menu.availableTo - new Date(menu.menu.availableTo).getTimezoneOffset() * 60 * 1000).toISOString().slice(0,10) }}</p>
                <label for="availabilityEnd" class="data-label">Meal are available to:</label><br>
                <input type="date" id="availabilityEnd" v-model="timeDetails.availableTo" :min="min" required class="date-picker"><br>
            </div>
        </div>
        <button class="edit-button" type="submit">Edit Time Details</button>
    </form>
</template>

<style scoped>
form {
    margin-bottom: 10px;
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
.current-date {
    padding: 0;
    margin: 0;
    margin-top: 5px;
    font-size: 16px;
}
.edit-button {
    height: 30px;
    width: 150px;
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
    .grid {
        display: grid;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (min-width: 1250px) {
    .grid {
        display: grid;
        grid-template-columns: 25% 25% 25% 25%;
    }
}
</style>