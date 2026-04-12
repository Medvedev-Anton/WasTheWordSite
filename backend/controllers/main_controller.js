export class MainController {
    constructor (request, response) {
        this.request = request;
        this.response = response;
    }

    /**
     * Проверяет наличие необходимых параметров
     * @param {Array} params 
     */
    has(params) {
        if (!(params instanceof Array)) {
            return;
        }

        for (const param of params) {
            if (this.request[param] === undefined) {
                this.send(400, {
                    message: `Отсутствует обязательный параметр: ${param}`
                });
            }
        }
    }

    send(status, data) {
        this.response.status(status).json(data);
    }
}