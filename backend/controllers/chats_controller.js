import ChatsFacade from "../facades/chats_facade.js";

export default class ChatsController extends MainController {
    constructor(request, response) {
        super(request, response);
    }

    /**
     * Обработчик запроса на добавление участника в чат
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
}