import { defineStore } from "pinia";
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
export enum NotificationType {
  SUCCESS = "Success",
}
type ActionLink = { to: string; label: string };
export type Notification = {
  id: string;
  type: NotificationType;
  message: string;
  actionLink?: ActionLink;
};

export const useNotificationStore = defineStore("notification", () => {
  const notifications = ref<Notification[]>([]);
  const addSuccessNotification = (
    message: string,
    actionLink?: ActionLink,
    duration: number = 6000,
  ) => {
    const id = uuidv4();
    notifications.value.push({
      id,
      type: NotificationType.SUCCESS,
      message,
      actionLink,
    });
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  };

  const removeNotification = (id: string) => {
    notifications.value = notifications.value.filter((n) => n.id !== id);
  };
  return { notifications, addSuccessNotification, removeNotification };
});
