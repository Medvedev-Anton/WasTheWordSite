import NotificationsFacade from "../facades/notifications_facade.js";
import { MainController } from "./main_controller.js";

export default class NotificationsController extends MainController {
    constructor(request, response) {
        super(request, response);
    }

    /**
     * Обработчик получения всех уведомлений пользователя
     */
    getAllUserNotifications() {
        try {
            const user = parseInt(this.request.user.userId);
            const notifications = NotificationsFacade.getAllByUser(user);
            const notificationsMessages = notifications.map(notify => {
                NotificationsFacade.delete(notify.id);
                return notify.message;
            });

            this.message(200, {
                notifications: notificationsMessages
            });
        }
        catch (e) {
            throw new Error('Get all user notifications error: ' + e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }
}