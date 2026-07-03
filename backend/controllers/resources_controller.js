import ResourceFacade from "../facades/resource_facade.js";
import { MainController } from "./main_controller.js";

export default class ResourcesController extends MainController {
    constructor (request, response) {
        super(request, response);
    }

    /**
     * Возвращает URL загруженного изображения
     */
    getUploadedFileUrl(fieldName) {
        const files = this.request.files;
        if (!files || typeof files !== 'object') {
            return null;
        }

        const uploaded = files[fieldName]?.[0];
        return uploaded ? `/uploads/${uploaded.filename}` : null;
    }

    /**
     * Обработчик запроса на получение всех ресурсов
     */
    getAll() {
        try {
            const resources = ResourceFacade.getAll();

            this.send(200, {
                resources: resources
            });
        }
        catch (e) {
            console.error('Get all resources error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Создание ресурса
     */
    create() {
        const validate = this.has([
            'number',
            'name', 
            'image', 
            'countNeedEnergy', 
            'countNeedMoney'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const {number, name, countNeedEnergy, countNeedMoney} = this.request.body;

            const imageUrl = this.getUploadedFileUrl('image');

            ResourceFacade.create(number, name, imageUrl, countNeedEnergy, countNeedMoney);

            this.send(201, {
                message: 'Success'
            });
        }
        catch (e) {
            console.error('Create resource error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Удаление ресурса
     */
    delete() {
        const validate = this.has([
            'id', 
        ]);

        if (validate === false) {
            return;
        }

        try {
            const id = parseInt(this.request.params.id);

            ResourceFacade.delete(id);

            this.send(200, {
                message: 'Success'
            });
        }
        catch (e) {
            console.error('Delete resource error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обновление имени
     */
    updateName() {
        const validate = this.has([
            'id',
            'name', 
        ]);

        if (validate === false) {
            return;
        }

        try {
            const id = parseInt(this.request.params.id);
            const name = this.request.body.name;

            ResourceFacade.updateName(id, name);

            this.send(200, {
                message: 'Update success'
            });
        }
        catch (e) {
            console.error('Update resource name error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обновление изображения
     */
    updateImage() {
         const validate = this.has([
            'id',
            'image', 
        ]);

        try {
            const id = parseInt(this.request.params.id);

            ResourceFacade.deleteImage(id);
            const uploadedImageUrl = this.getUploadedFileUrl('image');

            ResourceFacade.updateImageUrl(id, uploadedImageUrl);

            this.send(200, {
                update: 'Success'
            });
        }
        catch (e) {
            console.error('Update resource image error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обновление количества необходимой энергии
     */
    updateNeedEnergy() {
        const validate = this.has([
            'id',
            'energy', 
        ]);

        if (validate === false) {
            return;
        }

        try {
            const id = parseInt(this.request.params.id);
            const energy = parseInt(this.request.body.energy);

            ResourceFacade.updateNeedEnergy(id, energy);

            this.send(200, {
                message: 'Update success'
            });
        }
        catch (e) {
            console.error('Update resource energy error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обновление количества необходимой суммы денег
     */
    updateNeedMoney() {
        const validate = this.has([
            'id',
            'money', 
        ]);

        if (validate === false) {
            return;
        }

        try {
            const id = parseInt(this.request.params.id);
            const money = parseInt(this.request.body.money);

            ResourceFacade.updateNeedMoney(id, money);

            this.send(200, {
                message: 'Update success'
            });
        }
        catch (e) {
            console.error('Update resource money error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }
}