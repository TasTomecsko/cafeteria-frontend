import { defineStore } from "pinia";
import type { Notification } from "@/interfaces/notification";
import type { Error } from "@/interfaces/error";
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
        },


        sendCreatedNotificationLocalized(note: Error, langId: string) {
            var notification: Notification;

            if(langId === 'eng') {
                notification = {title: note.title.eng, message: note.message.eng, notificationType: notificationType.ERROR};
            }
            else if(langId === 'de') {
                notification = {title: note.title.de, message: note.message.de, notificationType: notificationType.ERROR};
            }
            else if(langId === 'hu') {
                notification = {title: note.title.hu, message: note.message.hu, notificationType: notificationType.ERROR};
            }
            else {
                notification = {title: '', message: '', notificationType: notificationType.ERROR};
            }
            
            this.notifications.push(notification);
        },
        sendDeletedNotificationLocalized(note: Error, langId: string) {
            var notification: Notification;

            if(langId === 'eng') {
                notification = {title: note.title.eng, message: note.message.eng, notificationType: notificationType.ERROR};
            }
            else if(langId === 'de') {
                notification = {title: note.title.de, message: note.message.de, notificationType: notificationType.ERROR};
            }
            else if(langId === 'hu') {
                notification = {title: note.title.hu, message: note.message.hu, notificationType: notificationType.ERROR};
            }
            else {
                notification = {title: '', message: '', notificationType: notificationType.ERROR};
            }
            
            this.notifications.push(notification);
        },
        sendErrorNotificationLocalized(note: Error, langId: string) {
            var notification: Notification;
            console.log(note.message)

            if(langId === 'eng') {
                notification = {title: note.title.eng, message: note.message.eng, notificationType: notificationType.ERROR};
            }
            else if(langId === 'de') {
                notification = {title: note.title.de, message: note.message.de, notificationType: notificationType.ERROR};
            }
            else if(langId === 'hu') {
                notification = {title: note.title.hu, message: note.message.hu, notificationType: notificationType.ERROR};
            }
            else {
                notification = {title: '', message: '', notificationType: notificationType.ERROR};
            }
            
            this.notifications.push(notification);
        },
        sendInfoNotificationLocalized(note: Error, langId: string) {
            var notification: Notification;
            
            if(langId === 'eng') {
                notification = {title: note.title.eng, message: note.message.eng, notificationType: notificationType.INFO};
            }
            else if(langId === 'de') {
                notification = {title: note.title.de, message: note.message.de, notificationType: notificationType.INFO};
            }
            else if(langId === 'hu') {
                notification = {title: note.title.hu, message: note.message.hu, notificationType: notificationType.INFO};
            }
            else {
                notification = {title: '', message: '', notificationType: notificationType.INFO};
            }
            
            this.notifications.push(notification);
        }
    }
})