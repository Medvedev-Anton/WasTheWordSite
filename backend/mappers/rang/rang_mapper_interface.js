import {Mapper} from '../mapper.js';

export class RangMapperInterface extends Mapper {
    constructor () {
        throw new Error('Нельзя создать экземпляр абстрактного класса');
    }
}