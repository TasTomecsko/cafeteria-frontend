import type { notificationType } from "@/enums/notificationTypes";

export interface Notification {
    title: string;
    message: string;
    notificationType: notificationType;
}