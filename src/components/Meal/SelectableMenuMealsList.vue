<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notificationsStore';
import router from '@/router';
import { useMealStore } from '@/stores/mealStore';
import SelectableMenuMealCard from '@/components/Meal/SelectableMenuMealCard.vue';

const auth = useAuthStore();
const note = useNotificationStore();
const meal = useMealStore();

const props = defineProps([
    'id',
]);

const selectedMeals = [] as number[]

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function errorConnect() {
    auth.showModal = true;
}

onMounted(async() => {
    await meal.getMenuById(props.id, auth.token).catch(function(error) {
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

function onBackClick() {
    router.push('/meals');
}

async function onSubmit() {
    await meal.placeOrder(meal.menuToSelect.menuId, selectedMeals, auth.token).catch(function(error) {
            if(error.response.status == 403) {
                errorConnect()
            }
            else if(error.response.status === 400) {
                note.sendErrorNotification(error.response.data.title, error.response.data.detail);
            }
            else {
                note.sendDeletedNotification('Server Error', 'Something went wrong, please try again later');
            }
        });
}
</script>

<template>
    <div class="menu-holder">
        <div class="menu-meals-details">
            <h1 class="card-name">Meals form Menu {{ props.id }}</h1>
            <form @submit.prevent="onSubmit">
                <div v-for="dayIndex in 7">
                    <div>
                        <h3>Meals for {{ days[dayIndex - 1] }}</h3>
                    </div>
                    <fieldset class="meal-wrapper">
                        <div v-for="mealItem in meal.mealsToSelect[dayIndex - 1]">
                            <SelectableMenuMealCard :description="mealItem.description" :identification="mealItem.identification"/>
                            <div class="radio-button-holder">
                                <input class="radio-button" type="radio" :name="days[dayIndex - 1]" :value="mealItem.mealId" v-model="selectedMeals[dayIndex - 1]">
                            </div>
                        </div>
                    </fieldset>
                </div>
                <div class="submit-button-holder">
                    <button class="submit-button">Place Order</button>
                </div>
            </form>
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
    .submit-button-holder {
        text-align: center;
    }
    .submit-button {
        margin-top: 15px;
        height: 30px;
        width: 100px;
        font-size: 14px;
        font-weight: 600;
        border: 2px solid rgb(0, 160, 0);
        border-radius: 5px;
        background-color: white;
    }
    .submit-button:hover {
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