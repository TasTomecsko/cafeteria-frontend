<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notificationsStore';
import { useOrderStore } from '@/stores/orderStore';
import { onMounted } from 'vue';
import { convertMillisToDate } from '@/functions/timeFunctions';
import Button from '@/assets/Button.vue';
import { buttonType } from '@/enums/buttonTypes';
import router from '@/router';
import OrderCard from '@/components/Menu/Orders/OrderCard.vue';
import { useLanguageStore } from '@/stores/languageStore';

const order = useOrderStore();
const auth = useAuthStore();
const note = useNotificationStore();
const language = useLanguageStore();

const props = defineProps([
    'id'
]);

function errorConnect() {
    auth.showModal = true;
}

function onBackClick() {
    router.push(`/menu/inspect/${props.id}`);
}

onMounted(async() => {
    await order.getOrdersFromMeal(props.id, auth.token).catch(function(error) {
        if(error.response.status === 403) {
            errorConnect()
        }
        else {
            note.sendDeletedNotification(language.languageFile.errors.server.title, language.languageFile.errors.server.message);
        }
    });
});
</script>

<template>
    <div class="menu-order-details">
        <div class="section-header">
            <h1 class="section-details">{{ language.languageFile.menu.inspect.orders.title }}</h1>
        </div>
        <div v-for="(day, dayIndex) in order.daysOfOrders" class="orders">
            <h3 class="date-of-order">{{ convertMillisToDate(day) }}</h3>
            <div v-for="(orderElement) in order.ordersList[dayIndex]">
                <OrderCard :identification="orderElement.meal.identification" :description="orderElement.meal.description" :order-number="orderElement.numberOfOrders"/>
            </div>
        </div>
    </div>
    <div class="back-button-holder">
        <Button @clicked="onBackClick" :text="language.languageFile.menu.inspect.orders.backButton" :assigned-type="buttonType.RED" class="back-button"/>
    </div>
</template>

<style scoped>
.menu-order-details {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    margin: 15px;
    padding: 10px;
}
.section-header {
    margin-bottom: 20px;
    padding: 10px 0 10px 0;
    background-color: white;
    border-radius: 5px;
}
.section-details {
    margin: 0px;
    padding: 0px;
    font-size: 28px;
    text-align: center;
}
.orders {
    background-color: rgba(255, 255, 255, 0.425);
    border-radius: 5px;
    margin-bottom: 25px;
    padding: 15px 0 0 0;
}
.date-of-order {
    padding: 0;
    margin: 0 0 5px 15px;
}
.back-button-holder {
    text-align: end;
    margin-right: 15px;
    margin-top: 35px;
}
.back-button {
    width: 100px;
    background-color: whitesmoke;
}
@media screen and (min-width: 700px) {
    .menu-order-details {
        max-width: 550px;
        margin-left: auto;
        margin-right: auto;
    }
}
</style>