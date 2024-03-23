<script lang="ts" setup>
import { computed } from 'vue';
import router from '@/router';

const props = defineProps([
    'menuId',
    'selectionStartDate',
    'selectionEndDate'
]);

const selectionStart = computed(() => {
    return convertMillisToDate(props.selectionStartDate);
});

const selectionEnd = computed(() => {
    return convertMillisToDate(props.selectionEndDate);
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

function selectMenu() {
    router.push(`/meals/order/${props.menuId}`);
}
</script>

<template>
    <div class="card" @click.prevent="selectMenu">
        <div>
            <h1 class="card-name">Menu {{ menuId }}</h1>
        </div>
        <div class="card-body">
            <div>
                <p class="data-type">Meal selection starts at:</p>
                <p class="data-date">{{ selectionStart }}</p>
            </div>
            <div>
                <p class="data-type">Meal selection ands at:</p>
                <p class="data-date">{{ selectionEnd }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
    h1 {
        padding: 0;
        margin: 0;
    }
    p {
        margin: 0;
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
    .data-type {
        font-size: 20px;
        margin-top: 15px;
        margin-bottom: 10px;
    }
    .data-date {
        font-size: 18px;
    }

    .card:hover {
        background-color: whitesmoke;
    }
</style>