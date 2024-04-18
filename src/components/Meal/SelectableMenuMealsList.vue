<script lang="ts" setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notificationsStore';
import router from '@/router';
import { useMealStore } from '@/stores/mealStore';
import SelectableMenuMealCard from '@/components/Meal/SelectableMenuMealCard.vue';
import Button from '@/assets/Button.vue';
import { buttonType } from '@/enums/buttonTypes';
import { convertMillisToDate } from '@/functions/timeFunctions';
import { useLanguageStore } from '@/stores/languageStore';

const auth = useAuthStore();
const note = useNotificationStore();
const meal = useMealStore();
const language = useLanguageStore();

const props = defineProps([
    'id',
]);

const selectedMeals = [] as number[]

function errorConnect() {
    auth.showModal = true;
}

onMounted(async() => {
    await meal.getMenuById(props.id, auth.token).catch(function(error) {
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
});

function onBackClick() {
    router.push('/meals');
}

async function onSubmit() {
    await meal.placeOrder(meal.menuToSelect.menuId, selectedMeals, auth.token).catch(function(error) {
            if(error.response.status == 403) {
                errorConnect()
            }
            else if(error.response.status === 400) {
                note.sendErrorNotificationLocalized(error.response.data, language.languageId);
            }
            else {
                note.sendDeletedNotification(language.languageFile.errors.server.title, language.languageFile.errors.server.message);
            }
        });
}
</script>

<template>
    <div>
        <div class="menu-meals-details">
            <h1 class="card-name">{{ language.languageFile.meal.mealSelection.title.replace("$id", props.id) }}</h1>
            <form>
                <div v-for="(day, dayIndex) in meal.daysOfMeals">
                    <div>
                        <h3>{{ language.languageFile.meal.mealSelection.day.replace("$day", convertMillisToDate(day)) }}</h3>
                    </div>
                    <fieldset class="meal-wrapper">
                        <div v-for="mealItem in meal.mealsToSelect[dayIndex]">
                            <SelectableMenuMealCard :description="mealItem.description" :identification="mealItem.identification"/>
                            <div class="radio-button-holder">
                                <input class="radio-button" type="radio" :name="day.toString()" :value="mealItem.mealId" v-model="selectedMeals[dayIndex]">
                            </div>
                        </div>
                    </fieldset>
                </div>
                <div class="submit-button-holder">
                    <Button @clicked="onSubmit" :text="language.languageFile.meal.mealSelection.placeOrder" :assigned-type="buttonType.GREEN" class="order-button"/>
                </div>
            </form>
        </div>
    </div>
    <div class="back-button-holder">
        <Button @clicked="onBackClick" :text="language.languageFile.meal.mealSelection.backButton" :assigned-type="buttonType.RED" class="back-button"/>
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
    .card-name {
        font-size: 26px;
        text-align: center;
    }
    .meal-wrapper {
        border: none;
        padding: 0;
        margin: 0;
    }
    .radio-button-holder {
        text-align: center;
        margin-bottom: 10px;
    }
    .radio-button {
        height: 18px;
        width: 18px;
    }
    
    .back-button-holder {
        text-align: end;
        margin-right: 15px;
    }
    .back-button {
        width: 100px;
        background-color: rgba(255, 255, 255, 0);
    }
    .order-button {
        width: 150px;
    }
    .submit-button-holder {
        text-align: center;
        margin-top: 25px;
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