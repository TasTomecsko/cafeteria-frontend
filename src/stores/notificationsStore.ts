import { defineStore } from "pinia";
import type { Notification } from "@/interfaces/notification";
import { notificationType } from "@/enums/notificationTypes";

export const useNotificationStore = defineStore({
    id: 'notification',
    state: () => {
        return {
            notifications: [] as Notification[]
        }
    },
    actions: {
        sendCreatedNotification(noteTitle: string, noteMessage: string) {
            var notification: Notification;

            notification = {title: noteTitle, message: noteMessage, notificationType: notificationType.CREATED};
            this.notifications.push(notification);
        },
        sendDeletedNotification(noteTitle: string, noteMessage: string) {
            var notification: Notification;

            notification = {title: noteTitle, message: noteMessage, notificationType: notificationType.DELETED};
            this.notifications.push(notification);
        },
        sendErrorNotification(noteTitle: string, noteMessage: string) {
            var notification: Notification;

            notification = {title: noteTitle, message: noteMessage, notificationType: notificationType.ERROR};
            this.notifications.push(notification);
        },
        sendInfoNotification(noteTitle: string, noteMessage: string) {
            var notification: Notification;

            notification = {title: noteTitle, message: noteMessage, notificationType: notificationType.INFO};
            this.notifications.push(notification);
        }
    }
})