import { RangFacade } from "../facades/rang_facade";
import { MainController } from "./main_controller";

export class RangController extends MainController {
    constructor (request, response) {
        super(request, response);
    }

    /**
     * Обработчик запроса на обновление ранга
     */
    update() {
        this.has([
            'rangId'
        ]);

        try {
            rangModel = RangFacade.buildFromArr(this.request);
            RangFacade.update(rangModel);

            this.send(200, {
                message: 'Update success'
            });
        }
        catch (e) {
            console.error('Update rang errror:', e.message);
            this.send(500, {
                error: 'Server error'
            })
        }
    }

    /**
     * Обработчик запроса на получение всех рангов
     */
    findAll() {
        try {
            rangs = RangFacade.findAll(this.request.limit || -1);

            this.send(200, {
                message: 'Update success',
                rangs: rangs
            });
        }
        catch (e) {
            console.error('Update rang errror:', e.message);
            this.send(500, {
                error: 'Server error'
            })
        }
    }
}