<script lang="ts" setup>
const props = defineProps([
    'identification',
    'description'
]);

</script>
<template>
    <div class="card-body">
        <h4 class="mealIdentifyer">{{ props.identification }}</h4>
        <p class="mealDescription">{{ props.description }}</p>
    </div>
</template>

<style scoped>
.card-body {
    background-color: white;
    padding: 5px;
    margin-bottom: 5px;
    border-radius: 5px;
    border: rgba(0, 220, 255, 0.5) solid;
}
.mealIdentifyer {
    margin: 0;
    padding: 0;
}
.mealDescription {
    margin: 0;
    padding: 0;
}
</style>