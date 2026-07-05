import { MainController } from "./main_controller.js";
import CompoundItemsFacade from "../facades/compound_items_facade.js";

export default class CompoundItemsController extends MainController {
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
        return uploaded ? `/uploads/compound-items/${uploaded.filename}` : null;
    }

    /**
     * Обработчик запроса на получение всех предметов
     */
    getAll() {
        try {
            const items = CompoundItemsFacade.getAll();

            this.send(200, {
                items: items
            });
        }
        catch (e) {
            console.error('Get all items error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Создание предмета
     */
    create() {
        const validate = this.has([
            'number',
            'name', 
            'itemsParts', 
        ]);

        if (validate === false) {
            return;
        }

        try {
            const {
                number, name, itemsParts
            } = this.request.body;

            const imageUrl = this.getUploadedFileUrl('image');

            CompoundItemsFacade.create(number, name, imageUrl, JSON.parse(itemsParts));
            
            const items = CompoundItemsFacade.getAll();

            this.send(201, {
                items: items
            });
        }
        catch (e) {
            console.error('Create item error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Удаление предмета
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

            CompoundItemsFacade.delete(id);

            const items = CompoundItemsFacade.getAll();

            this.send(200, {
                message: 'Success',
                items: items
            });
        }
        catch (e) {
            console.error('Delete item error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обновление номера
     */
    updateNumber() {
        const validate = this.has([
            'id',
            'number', 
        ]);

        if (validate === false) {
            return;
        }

        try {
            const id = parseInt(this.request.params.id);
            const number = parseInt(this.request.body.number);

            CompoundItemsFacade.updateNumber(id, number);

            this.send(200, {
                message: 'Update success'
            });
        }
        catch (e) {
            console.error('Update item number error:', e.message);
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

            CompoundItemsFacade.updateName(id, name);

            this.send(200, {
                message: 'Update success'
            });
        }
        catch (e) {
            console.error('Update item name error:', e.message);
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
        ]);

        try {
            const id = parseInt(this.request.params.id);

            CompoundItemsFacade.deleteImage(id);
            const uploadedImageUrl = this.getUploadedFileUrl('image');

            CompoundItemsFacade.updateImageUrl(id, uploadedImageUrl);

            this.send(200, {
                update: 'Success',
                newImageUrl: uploadedImageUrl
            });
        }
        catch (e) {
            console.error('Update item image error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Создание части предмета
     */
    createPart() {
        const validate = this.has([
            'id',
            'compoundItemId',
            'partItemId'
        ]);
        
        if (validate === false) {
            return;
        }

        try {
            const compoundItemId = parseInt(this.request.body.compoundItemId);
            const partItemId = parseInt(this.request.body.partItemId);

            CompoundItemsFacade.createPart(compoundItemId, partItemId);

            this.send(200, {
                message: 'Update success'
            });
        }
        catch (e) {
            console.error('Create item part error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Удаление части предмета
     */
    deletePart() {
        const validate = this.has([
            'id',
            'partId'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const partId = parseInt(this.request.params.partId);

            CompoundItemsFacade.deletePart(partId);

            const items = CompoundItemsFacade.getAll();

            this.send(200, {
                message: 'Success',
            });
        }
        catch (e) {
            console.error('Delete item part error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }
}