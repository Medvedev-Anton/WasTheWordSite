export class MainController {
    constructor (request, response) {
        this.request = request;
        this.response = response;
    }

    /**
     * Проверяет наличие необходимых параметров
     * @param {Array} params 
     * @returns {boolean}
     */
    has(params) {
        if (!(params instanceof Array)) {
            return true;
        }

        for (const param of params) {
            if (
                (this.request[param] === undefined) && 
                (this.request.body !== undefined && this.request.body[param] === undefined) &&
                (this.request.params !== undefined && this.request.params[param] === undefined)
            ) {
                this.send(400, {
                    message: `Отсутствует обязательный параметр: ${param}`
                });

                return false;
            }
        }

        return true;
    }

    send(status, data) {
        this.response.status(status).json(data);
    }
}