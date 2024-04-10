<script lang="ts" setup>
import { computed } from 'vue';
import router from '@/router';
import { convertMillisToDate } from '@/functions/timeFunctions';
import { useLanguageStore } from '@/stores/languageStore';

const props = defineProps([
    'menuId',
    'selectionStartDate',
    'selectionEndDate'
]);

const language = useLanguageStore();

const selectionStart = computed(() => {
    return convertMillisToDate(props.selectionStartDate);
});

const selectionEnd = computed(() => {
    return convertMillisToDate(props.selectionEndDate);
});

function selectMenu() {
    router.push(`/meals/order/${props.menuId}`);
}
</script>

<template>
    <div class="card" @click.prevent="selectMenu">
        <div>
            <h1 class="card-name">{{ language.languageFile.meal.awailableMenus.menu.replace('$id', menuId) }}</h1>
        </div>
        <div class="card-body">
            <div>
                <p class="data-type">{{ language.languageFile.meal.awailableMenus.selectionStart }}:</p>
                <p class="data-date">{{ selectionStart }}</p>
            </div>
            <div>
                <p class="data-type">{{ language.languageFile.meal.awailableMenus.selectionEnd }}:</p>
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
        transition: .5s;
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
        background-color: rgb(240, 246, 255);
        transition: .5s;
    }
</style>