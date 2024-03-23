<script lang="ts" setup>
import { useNotificationStore } from '@/stores/notificationsStore';
import { watch } from 'vue';
import NotificationCard from './NotificationCard.vue';

const notes = useNotificationStore();

var notifications = notes.notifications;

watch(notes.notifications, async() => {
    notes.notifications.forEach(function() {
        notifications = notes.notifications;
    });
});
</script>

<template>
    <div class="modal-wrapper" v-if="notes.notifications.length > 0">
        <div v-for="(n, index) in notifications">
            <NotificationCard :id="index" :title="n.title" :message="n.message" :type="n.notificationType"/>
        </div>
    </div>
</template>

<style scoped>
    .modal-wrapper {
        background-color: rgba(0, 0, 0, 0.041);
        border-radius: 15px;
        padding: 10px;
        z-index: 9997;
        width: 300px;
        height: auto;
        pointer-events: none;

        margin-left: auto;
        position: fixed;
        bottom: 0;
        right: 0;
    }
</style>