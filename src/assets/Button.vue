<script lang="ts" setup>
import { buttonType } from '@/enums/buttonTypes';

const emit = defineEmits(['clicked']);

const props = defineProps([
    'text',
    'assignedType',
    'isDisabled'
]);
</script>
<template>
    <button class="button" @click.prevent="emit('clicked')"
        :class="{'red-button': assignedType == buttonType.RED,
            'green-button': assignedType == buttonType.GREEN,
            'blue-button': assignedType == buttonType.BLUE,
            'disabled-button': isDisabled}"
        :disabled="isDisabled"
    >{{ props.text }}</button>
</template>
<style scoped>
.button {
    height: 30px;
    width: 120px;
    font-size: 15px;
    font-weight: 400;
    border-radius: 5px;
    background-color: white;
    transition: .5s;
}

.red-button {
    border: 2px solid rgb(230, 0, 0);
}
.red-button:hover {
    background-color: rgb(230, 0, 0);
    transition: .5s;
}

.green-button {
    border: 2px solid rgb(0, 160, 0);
}
.green-button:hover {
    background-color: rgb(0, 160, 0);
    transform: .5s;
}

.blue-button {
    border: 2px solid rgb(0, 175, 255);
}
.blue-button:hover {
    background-color: rgb(0, 175, 255);
    transform: .5s;
}

.disabled-button {
    border: 2px solid rgb(125, 125, 125);
}
.disabled-button:hover {
    background-color: white;
}
</style>