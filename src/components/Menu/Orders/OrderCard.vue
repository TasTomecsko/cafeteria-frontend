<script lang="ts" setup>
import { useLanguageStore } from '@/stores/languageStore';

const language = useLanguageStore();

const props = defineProps([
    'identification',
    'description',
    'orderNumber'
]);
</script>

<template>
    <div class="card-body">
        <div class="grid-body-left">
            <h4 class="label">{{ props.identification }}</h4>
            <p class="info">{{ props.description }}</p>
        </div> 
        <div class="grid-body-right">
            <h4 class="label">{{ language.languageFile.menu.inspect.orders.orderNumber }}</h4>
            <p class="info">{{ props.orderNumber }}</p>
        </div>
    </div>
</template>

<style scoped>
.card-body {
    background-color: white;
    padding: 5px;
    margin-bottom: 15px;
    border-radius: 5px;
    border: rgb(255, 255, 255) solid;
    display: grid;
    grid-template-columns: 75% 25%;
}
.label {
    margin: 0;
    padding: 0;
    margin-bottom: 5px;
}
.info {
    margin: 0;
    padding: 0;
}
.grid-body-left {
    margin-left: 5px;
}
.grid-body-right {
    text-align: center;
    margin-top: auto;
    margin-bottom: auto;
}
</style>