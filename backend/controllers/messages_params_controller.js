import MessagesParamsFacade from "../facades/messages_params_facade.js";
import { MainController } from "./main_controller.js";

export default class MessagesParamsController extends MainController {
    constructor(request, response) {
        super(request, response);
    }

    /**
     * Обработчик получения значения срока жизни сообщения
     */
    getMessageLiveDuring() {
        try {
            const liveDuringDays = MessagesParamsFacade.getByName('liveDuringDays');
            this.send(200, {
                liveDuringDays: liveDuring
            });
        }
        catch (e) {
            console.error('Get message live during error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обработчик обновления значения срока жизни сообщения
     */
    updateMessageLiveDuring() {
        const validate = this.has([
            'newDuring',
        ]);

        if (validate === false) {
            return;
        }

        try {
            const newDuring = parseInt(this.request.body.newDuring);

            MessagesParamsFacade.updateByName('liveDuringDays', newDuring);

            this.send(200, {
                message: 'Success'
            });
        }
        catch (e) {
            console.error('Get message live during error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }
} 