import {
  NotificationType,
  useNotificationStore,
} from "../../stores/notification";
import NotificationHandler from "./NotificationHandler.vue";

describe("<NotificationHandler />", () => {
  it("renders notifications and removes them and modifies it", () => {
    const notificationStore = useNotificationStore();
    notificationStore.addNotification("Added draft", NotificationType.SUCCESS);
    notificationStore.addNotification("Added model", NotificationType.SUCCESS);

    cy.mountWithPinia(NotificationHandler);

    notificationStore.notifications.forEach((n) => {
      cy.contains(n.message).should("be.visible");
    });
    const notification2 = notificationStore.notifications[1];
    cy.get(`[data-cy="closeNotification-${notification2.id}"]`).click();
    cy.contains(notification2.message).should("not.exist");
  });
});
