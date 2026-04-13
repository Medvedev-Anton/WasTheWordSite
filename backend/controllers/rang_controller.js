import { RangFacade } from "../facades/rang_facade.js";
import { MainController } from "./main_controller.js";

export class RangController extends MainController {
    constructor (request, response) {
        super(request, response);
    }

    /**
     * Обработчик запроса на обновление ранга
     */
    update() {
        const validate = this.has([
            'rangId'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const rangModel = RangFacade.buildFromArr(this.request);
            RangFacade.update(rangModel);

            this.send(200, {
                message: 'Update success'
            });
        }
        catch (e) {
            console.error('Update rang errror:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обработчик запроса на получение всех рангов
     */
    findAll() {
        try {
            const rangs = RangFacade.findAll(this.request.limit || -1);

            this.send(200, {
                message: 'Get all success',
                rangs: rangs
            });
        }
        catch (e) {
            console.error('Find all rang errror:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обработчик запроса на создание ранга
     */
    create() {
        console.log(this.request.params);

        const validate = this.has([
            'name',
            'thumbnailUrl',
            'orderNumber'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const rangModel = RangFacade.buildFromArr(this.request);
            RangFacade.create(rangModel);

            this.send(200, {
                message: 'Create success'
            });
        }
        catch (e) {
            console.error('Create rang errror:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обработчик запроса на удаление ранга
     */
    delete() {
        const validate = this.has([
            'id'
        ]);

        if (validate === false) {
            return;
        }

        const id = parseInt(this.request.params.id);

        if (isNaN(id)) {
            this.send(400, {
                message: 'Id is not a numeric value'
            });

            return;
        }

        try {
            RangFacade.delete(id);

            this.send(200, {
                message: 'Delete success'
            });
        }
        catch (e) {
            console.error('Delete rang errror:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }
}