<script lang="ts" setup>
import { notificationType } from '@/enums/notificationTypes';
import { useNotificationStore } from '@/stores/notificationsStore';

const notes = useNotificationStore();

const props = defineProps([
    'id',
    'title',
    'message',
    'type'
]);
function deleteNote() {
    notes.notifications.splice(props.id,1);
}
</script>

<template>
    <div class="notification-body" @click.prevent="deleteNote">
        <div class="notification-holder">
            <h1 class="notification-title" :class="{'title-created': type == notificationType.CREATED,
                'title-deleted': type == notificationType.DELETED,
                'title-error': type == notificationType.ERROR,
                'title-info': type == notificationType.INFO}">{{ title }}</h1>
            <h2 class="notification-message" :class="{'message-cerated': type == notificationType.CREATED,
                'message-deleted': type == notificationType.DELETED,
                'message-error': type == notificationType.ERROR,
                'message-info': type == notificationType.INFO}">{{ message }}</h2>
        </div>
    </div>
</template>

<style scoped>
.notification-body {
    user-select: none;
    margin-bottom: 10px;
    pointer-events: all;
}
.notification-holder:hover {
    padding: 0 0 5px 0;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.274);
}

.notification-title {
    margin: 0;
    font-size: 22px;
    padding: 5px 0px 5px 10px;
    border-radius: 5px 5px 0 0;
}
.title-created {
    background-color: rgb(0, 175, 0);
}
.title-deleted {
    background-color: rgb(225, 0, 0);
}
.title-error {
    background-color: rgb(245, 190, 15);
}
.title-info {
    background-color: rgb(0, 175, 255);
}

.notification-message {
    margin: 0;
    font-size: 16px;
    font-weight: 100;
    padding: 10px 0px 10px 15px;
    border-radius: 0 0 5px 5px;
    background-color: rgb(255, 255, 255);
}
.message-cerated {
    border: solid rgb(0, 175, 0);
    border-width: thick;
}
.message-deleted {
    border: solid rgb(225, 0, 0);
    border-width: thick;
}
.message-error {
    border: solid rgb(245, 190, 15);
    border-width: thick;
}
.message-info {
    border: solid rgb(0, 175, 255);
    border-width: thick;
}
</style>