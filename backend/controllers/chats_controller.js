import ChatsFacade from "../facades/chats_facade.js";
import { MainController } from "./main_controller.js";

export default class ChatsController extends MainController {
    constructor(request, response) {
        super(request, response);
    }

    /**
     * Обработчик добавления участника в чат
     */
    addUserToChat() {
        const validate = this.has([
            'chatId'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const userId = parseInt(this.request.user.userId);
            const chatId = parseInt(this.request.body.chatId);

            ChatsFacade.addUserToChat(userId, chatId);

            this.send(200, {
                message: 'Success'
            });
        }
        catch (e) {
            console.error('Add user to chat error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обработчик проверки есть ли пользователь в чате организации
     */
    isUserInOrgChat() {
        try {
            const userId = parseInt(this.request.user.userId);
            const orgId = parseInt(this.request.params.id);

            const result = ChatsFacade.isUserInOrgChat(userId, orgId);

            this.send(200, {
                inChat: result
            });
        }
        catch (e) {
            console.error('Is user in org chat error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обработчик удаления чата
     */
    deleteChat() {
        try {
            const chatId = parseInt(this.request.params.id);
            ChatsFacade.deleteById(chatId);

            this.send(200, {
                message: 'Success'
            });
        }
        catch (e) {
            console.error('Delete chat error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обработчик обновления последнего прочитанного сообщения в чате для пользователя
     */
    updateLastReadedMessageInChat() {
        const validate = this.has([
            'chatId'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const chatId = parseInt(this.request.body.chatId);
            const userId = parseInt(this.request.user.userId);
            const messageId = parseInt(this.request.params.id);

            ChatsFacade.updateOrCreateLastUserMessageView(userId, chatId, messageId);

            this.send(200, {
                message: 'Success'
            });
        }
        catch (e) {
            console.error('Delete chat error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }
}