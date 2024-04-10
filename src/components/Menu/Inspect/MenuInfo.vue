<script lang="ts" setup>
import { computed } from 'vue';
import { useMenuStore } from '@/stores/menuStore';
import { convertMillisToDate } from '@/functions/timeFunctions';
import { useLanguageStore } from '@/stores/languageStore';

const menu = useMenuStore();
const language = useLanguageStore();

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

const props = defineProps([
    'id'
]);
</script>

<template>
    <h1 class="section-details">{{ language.languageFile.menu.inspect.menuInfo.title.replace("$id", props.id) }}</h1>
    <div class="grid">
        <div>
            <p class="data-type">{{ language.languageFile.menu.inspect.menuInfo.selectionStart }}:</p>
            <p class="data-date">{{ selectionStartDate }}</p>
        </div>
        <div>
            <p class="data-type">{{ language.languageFile.menu.inspect.menuInfo.selectionEnd }}:</p>
            <p class="data-date">{{ selectionEndDate }}</p>
        </div>
        <div>
            <p class="data-type">{{ language.languageFile.menu.inspect.menuInfo.availableStart }}:</p>
            <p class="data-date">{{ availabilityStartDate }}</p>
        </div>
        <div>
            <p class="data-type">{{ language.languageFile.menu.inspect.menuInfo.availableTo }}:</p>
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