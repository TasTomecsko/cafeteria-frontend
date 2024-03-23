<script lang="ts" setup>
import { computed } from 'vue';
import { useMenuStore } from '@/stores/menuStore';

const menu = useMenuStore();

const selectionStartDate = computed(() => {
    return convertMillisToDate(menu.menu.selectionStart);
});

const selectionEndDate = computed(() => {
    return convertMillisToDate(menu.menu.selectionEnd);
});

const availabilityStartDate = computed(() => {
    return convertMillisToDate(menu.menu.availableFrom);
});

const availabilityEndDate = computed(() => {
    return convertMillisToDate(menu.menu.availableTo);
});

function convertMillisToDate(milliseconds: number) {
    var converted_year = new Date(milliseconds).getFullYear().toString();
    var converted_month = (new Date(milliseconds).getMonth() + 1).toString();
    var converted_day = new Date(milliseconds).getDate().toString();

    if(converted_month.length == 1) {
        converted_month = '0' + converted_month; 
    }
    if(converted_day.length == 1) {
        converted_day = '0' + converted_day;
    }

    return converted_year + '.' + converted_month + '.' + converted_day + '.';
}

const props = defineProps([
    'id'
]);
</script>

<template>
    <h1 class="section-details">Menu {{ props.id }} Details</h1>
    <div class="grid">
        <div>
            <p class="data-type">Meal selection starts at:</p>
            <p class="data-date">{{ selectionStartDate }}</p>
        </div>
        <div>
            <p class="data-type">Meal selection ends at:</p>
            <p class="data-date">{{ selectionEndDate }}</p>
        </div>
        <div>
            <p class="data-type">Meals are available starting from:</p>
            <p class="data-date">{{ availabilityStartDate }}</p>
        </div>
        <div>
            <p class="data-type">Meal are available to:</p>
            <p class="data-date">{{ availabilityEndDate }}</p>
        </div>
    </div>
</template>

<style scoped>
.section-details {
    margin: 0px;
    padding: 0px;
    margin-bottom: 20px;
    font-size: 28px;
}
.data-type {
    padding: 0;
    margin: 0;
    font-size: 20px;
    margin-bottom: 5px;
}
.data-date {
    padding: 0;
    margin: 0;
    font-size: 18px;
    margin-bottom: 10px;
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