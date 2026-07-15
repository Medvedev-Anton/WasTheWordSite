import { BalanceFacade } from "../facades/balance_facade.js";
import { OrgsFacade } from "../facades/orgs_facade.js";
import OrgsResourcesFacade from "../facades/orgs_resources_facade.js";
import OrgsSimpleItemsFacade from "../facades/orgs_simple_items_facade.js";
import SimpleItemsFacade from "../facades/simple_items_facade.js";
import { MainController } from "./main_controller.js";

export default class SimpleItemsController extends MainController {
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
        return uploaded ? `/uploads/simple-items/${uploaded.filename}` : null;
    }

    /**
     * Обработчик запроса на получение всех предметов
     */
    getAll() {
        try {
            const items = SimpleItemsFacade.getAll();

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
            'countNeedEnergy', 
            'countNeedMoney',
            'needResourceId',
            'countNeedResource'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const {
                number, 
                name, 
                countNeedEnergy, 
                countNeedMoney,
                needResourceId,
                countNeedResource
            } = this.request.body;

            const imageUrl = this.getUploadedFileUrl('image');

            SimpleItemsFacade.create(number, name, imageUrl, countNeedEnergy, countNeedMoney, needResourceId, countNeedResource);
            
            const items = SimpleItemsFacade.getAll();

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

            SimpleItemsFacade.delete(id);

            const items = SimpleItemsFacade.getAll();

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

            SimpleItemsFacade.updateNumber(id, number);

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

            SimpleItemsFacade.updateName(id, name);

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

            SimpleItemsFacade.deleteImage(id);
            const uploadedImageUrl = this.getUploadedFileUrl('image');

            SimpleItemsFacade.updateImageUrl(id, uploadedImageUrl);

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

            SimpleItemsFacade.updateNeedEnergy(id, energy);

            this.send(200, {
                message: 'Update success'
            });
        }
        catch (e) {
            console.error('Update item energy error:', e.message);
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

            SimpleItemsFacade.updateNeedMoney(id, money);

            this.send(200, {
                message: 'Update success'
            });
        }
        catch (e) {
            console.error('Update item money error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обновление ID необходимого ресурса
     */
    updateNeedResourceId() {
        const validate = this.has([
            'id',
            'newResourceId', 
        ]);

        if (validate === false) {
            return;
        }

        try {
            const id = parseInt(this.request.params.id);
            const newResourceId = parseInt(this.request.body.newResourceId);

            SimpleItemsFacade.updateNeedResourceId(id, newResourceId);

            this.send(200, {
                message: 'Update success'
            });
        }
        catch (e) {
            console.error('Update item need resource id error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обновление количества необходимого ресурса
     */
    updateNeedResourceCount() {
        const validate = this.has([
            'id',
            'newResourceCount', 
        ]);

        if (validate === false) {
            return;
        }

        try {
            const id = parseInt(this.request.params.id);
            const newResourceCount = parseInt(this.request.body.newResourceCount);

            SimpleItemsFacade.updateCountNeedResource(id, newResourceCount);

            this.send(200, {
                message: 'Update success'
            });
        }
        catch (e) {
            console.error('Update item need resource count error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Создание предмета мастерской
     */
    workshopCreateSimpleItem() {
        const validate = this.has([
            'orgId',
            'id', 
        ]);

        if (validate === false) {
            return;
        }

        try {
            const orgId = parseInt(this.request.body.orgId);
            const simpleItemId = parseInt(this.request.params.id);

            SimpleItemsFacade.workshopCreate(orgId, simpleItemId);

            const orgBalance = BalanceFacade.entity('orgs').getBalance(orgId);
            const orgEnergy = OrgsFacade.getOrgEnergy(orgId);
            const orgResources = OrgsResourcesFacade.getAllByOrgId(orgId);

            this.send(200, {
                orgBalance: orgBalance,
                orgEnergy: orgEnergy,
                orgResources: orgResources
            });
        }
        catch (e) {
            console.error('Workshop create item error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Получить предмет по ID
     */
    getById() {
        const validate = this.has([
            'id', 
        ]);

        if (validate === false) {
            return;
        }

        try {
            const simpleItemId = parseInt(this.request.params.id);
            const simpleItem = SimpleItemsFacade.getById(simpleItemId);

            this.send(200, {
                simpleItem: simpleItem
            });
        }
        catch (e) {
            console.error('Get simple item by id error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Покупка простого предмета организацией у организации
     */
    buyOrgFromOrg() {
        const validate = this.has([
            'sellerId',
            'buyerId',
            'id',
        ]);

        if (validate === false) {
            return;
        }

        try {
            const userId = parseInt(this.request.user.userId);
            const buyerId = parseInt(this.request.body.buyerId);
            const buyerAdminId = OrgsFacade.getAdminId(buyerId);

            if (userId !== buyerAdminId) {
                this.send(400, {
                    message: 'Вы не являетесь владельцем покупающей организации'
                });
                return;
            }

            const sellerId = parseInt(this.request.body.sellerId);
            const resourceId = parseInt(this.request.params.id);

            SimpleItemsFacade.buyOrgFromOrg(sellerId, buyerId, resourceId, 1);

            const buyerBalance = BalanceFacade.entity('orgs').getBalance(buyerId);
            const sellerSimpleItems = OrgsSimpleItemsFacade.getAllByOrgId(sellerId);

            this.send(200, {
                buyerBalance: buyerBalance,
                sellerSimpleItems: sellerSimpleItems
            });
        }
        catch (e) {
            console.error('Buy org from org simple item error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Покупка простого предмета пользователем у организации
     */
    buyUserFromOrg() {
        const validate = this.has([
            'sellerId',
            'buyerId',
            'id',
        ]);

        if (validate === false) {
            return;
        }

        try {
            const userId = parseInt(this.request.user.userId);
            const buyerId = parseInt(this.request.body.buyerId);
            const sellerId = parseInt(this.request.body.sellerId);
            const simpleItem = parseInt(this.request.params.id);

            SimpleItemsFacade.buyUserFromOrg(sellerId, buyerId, simpleItem, 1);

            const buyerBalance = BalanceFacade.entity('users').getBalance(buyerId);
            const sellerSimpleItems = OrgsSimpleItemsFacade.getAllByOrgId(sellerId);
            const sellerBalance = BalanceFacade.entity('orgs').getBalance(sellerId);

            this.send(200, {
                buyerBalance: buyerBalance,
                sellerSimpleItems: sellerSimpleItems,
                sellerBalance: sellerBalance
            });
        }
        catch (e) {
            console.error('Buy user from org simple item error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }
}