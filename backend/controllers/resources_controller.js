import { BalanceFacade } from "../facades/balance_facade.js";
import { OrgsFacade } from "../facades/orgs_facade.js";
import OrgsResourcesFacade from "../facades/orgs_resources_facade.js";
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
        return uploaded ? `/uploads/resources/${uploaded.filename}` : null;
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
            
            const resources = ResourceFacade.getAll();

            this.send(201, {
                resources: resources
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

            const resources = ResourceFacade.getAll();

            this.send(200, {
                message: 'Success',
                resources: resources
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

            ResourceFacade.updateNumber(id, number);

            this.send(200, {
                message: 'Update success'
            });
        }
        catch (e) {
            console.error('Update resource number error:', e.message);
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
        ]);

        try {
            const id = parseInt(this.request.params.id);

            ResourceFacade.deleteImage(id);
            const uploadedImageUrl = this.getUploadedFileUrl('image');

            ResourceFacade.updateImageUrl(id, uploadedImageUrl);

            this.send(200, {
                update: 'Success',
                newImageUrl: uploadedImageUrl
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

    /**
     * Обрабатывает добычу ресурса организацией
     */
    orgExtract() {
        const validate = this.has([
            'id',
            'orgId', 
        ]);

        if (validate === false) {
            return;
        }

        try {
            const resourceId = parseInt(this.request.params.id);
            const orgId = parseInt(this.request.body.orgId);

            const orgType = OrgsFacade.getOrgType(orgId);

            if (orgType !== 'Ферма') {
                this.send(400, {
                    message: 'Добычу может вести только ферма'
                });
            }

            ResourceFacade.extract(orgId, resourceId);

            const orgBalance = BalanceFacade.entity('orgs').getBalance(orgId);
            const orgEnergy = OrgsFacade.getOrgEnergy(orgId);
            const orgResources = OrgsResourcesFacade.getAllByOrgId(orgId);

            this.send(200, {
                message: 'success',
                orgBalance: orgBalance,
                orgEnergy: orgEnergy,
                orgResources: orgResources
            });
        }
        catch (e) {
            console.error('Extract org resource error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Получить ресурс по ID
     */
    getById() {
        const validate = this.has([
            'id',
        ]);

        if (validate === false) {
            return;
        }

        try {
            const id = parseInt(this.request.params.id);
            const resource = ResourceFacade.getById(id);

            this.send(200, {
                resource: resource
            });
        }
        catch (e) {
            console.error('Get resource by id error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Покупка ресурса организацией у организации
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

            ResourceFacade.buyOrgFromOrg(sellerId, buyerId, resourceId, 1);

            const buyerBalance = BalanceFacade.entity('orgs').getBalance(buyerId);
            const sellerResources = OrgsResourcesFacade.getAllByOrgId(sellerId);

            this.send(200, {
                buyerBalance: buyerBalance,
                sellerResources: sellerResources
            });
        }
        catch (e) {
            console.error('Buy org from org resource error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }
}