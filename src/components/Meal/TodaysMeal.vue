<script lang="ts" setup>
import Button from '@/assets/Button.vue';
import { buttonType } from '@/enums/buttonTypes';
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
import { useMealStore } from '@/stores/mealStore';
import { useNotificationStore } from '@/stores/notificationsStore';
import { onMounted } from 'vue';
import { useLanguageStore } from '@/stores/languageStore';

const meal = useMealStore();
const auth = useAuthStore();
const note = useNotificationStore();
const language = useLanguageStore();

function back() {
    router.push('/meals')
}

function errorConnect() {
    auth.showModal = true;
}

onMounted(async() => {
    await meal.getTodayMeal(auth.token).catch(function(error) {
        if(error.response.status === 403) {
            errorConnect();
        }
        else {
            note.sendDeletedNotification('Server Error', 'Something went wrong, please try again later');
        }
    });
});
</script>
<template>
    <div class="card-body" v-if="meal.todaysMeal.description || meal.todaysMeal.identification">
        <h4 class="mealIdentifyer">{{ meal.todaysMeal.identification }}</h4>
        <p class="mealDescription">{{ meal.todaysMeal.description }}</p>
    </div>
    <div class="card-body" v-else>
        <h3 class="message">{{ language.languageFile.meal.todaysMeal.message }}</h3>
    </div>
    <div class="back-button-holder">
        <Button @clicked="back" :text="language.languageFile.meal.todaysMeal.backButton" :assigned-type="buttonType.RED" class="back-button"/>
    </div>
</template>
<style scoped>
.card-body {
    background-color: white;
    border: 1px solid black;
    padding: 25px;
    margin: 0 auto 0 auto;
    max-width: 250px;
    margin-bottom: 25px;
    border-radius: 5px;
}
.mealIdentifyer {
    margin: 0;
    padding: 0;
    margin-bottom: 15px;
    font-size: 20px;
}
.mealDescription {
    margin: 0;
    padding: 0;
    font-size: 18px;
}
.message {
    margin: 0;
    padding: 0;
    font-size: 28px;
    font-weight: 400;
    text-align: center;
}
.back-button-holder {
    text-align: end;
    margin-right: 15px;
}
.back-button{
    background-color: rgba(0, 0, 0, 0);
}
</style>