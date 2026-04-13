import { RangMapperInterface } from "./rang_mapper_interface.js";
import { db } from "../../database/init.js";
import { Rang } from "../../models/rang.js";
import { RangsCollection } from "../../collections/rangs_collection.js";

export class RangMapper extends RangMapperInterface {
    constructor() {
        super();
    }

    findAll(limit = -1) {
        if (typeof limit !== 'number') {
            throw new Error('limit должен быть числовым');
        }

        let sql = `
            SELECT
                *
            FROM rangs    
        `;

        if (limit > 0) {
            sql += ` LIMIT ${limit}`;
        }

        const rangs = db.prepare(sql).all();
        
        try {
            return this.rowsArrayMapper(rangs);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    findById(id) {
        if (typeof id !== 'number') {
            throw new Error('number должен быть числовым');
        }

        if (id <= 0) {
            throw new Error('id не может быть неположительным');
        }

        const rang = db.prepare(`
            SELECT
                *
            FROM rangs
            WHERE id = ?    
        `).get(id);

        if (!rang) {
            return null;
        }

        try {
            return this.rowMapper(rang);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    create(rang) {
        if (!(rang instanceof Rang)) {
            throw new Error('rang должен иметь тип Rang');
        }

        if (rang.getName() === undefined) {
            throw new Error('Отсутствует обязательный параметр name');
        }

        if (rang.getThumbnailUrl() === undefined) {
            throw new Error('Отсутствует обязательный параметр thumbnail_url');
        }

        if (rang.getOrderNumber() === undefined) {
            throw new Error('Отсутствует обязательный параметр orderNumber');
        }

        const insertResult = db.prepare(`
            INSERT
            INTO rangs (name, thumbnail_url, orderNumber)
            VALUES (?, ?, ?)
        `).run(rang.getName(), rang.getThumbnailUrl(), rang.getOrderNumber());

        return insertResult.lastInsertRowid;
    }

    update(rang) {
        if (!(rang instanceof Rang)) {
            throw new Error('rang должен иметь тип Rang');
        }

        if (rang.getId() === undefined) {
            throw new Error('Отсутствует обязательный параметр id');
        }

        if (rang.getId() <= 0) {
            throw new Error('id не может быть неположительным');
        }

        db.prepare(`
            UPDATE rangs 
            SET name = ?, thumbnail_url = ?, orderNumber = ?
            WHERE id = ?
        `).run(rang.getName() || '', rang.getThumbnailUrl() || '', rang.getOrderNumber() || 0, rang.getId());
    }

    delete(id) {
        if (typeof id !== 'number') {
            throw new Error('number должен быть числовым');
        }

        if (id <= 0) {
            throw new Error('id не может быть неположительным');
        }

        db.prepare(`
            DELETE FROM rangs
            WHERE id = ?    
        `).run(id);

        return id;
    }

    findByOrderNumber(orderNumber) {
        if (typeof orderNumber !== 'number') {
            throw new Error('orderNumber должен быть числовым');
        }

        if (orderNumber < 0) {
            throw new Error('orderNumber не может быть отрицательным');
        }

        const rang = db.prepare(`
            SELECT
                *
            FROM rangs
            WHERE
                orderNumber = ?    
        `).get(orderNumber);

        if (!rang) {
            return null;
        }

        try {
            return this.rowMapper(rang);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    rowMapper(row) {
        if (row.id === undefined) {
            throw new Error('Отсутствует обязательный параметр id');
        }

        if (row.name === undefined) {
            throw new Error('Отсутствует обязательный параметр name');
        }

        if (row.thumbnail_url === undefined) {
            throw new Error('Отсутствует обязательный параметр thumbnail_url');
        }

        if (row.orderNumber === undefined) {
            throw new Error('Отсутствует обязательный параметр orderNumber');
        }

        return new Rang(row.id, row.name, row.thumbnail_url, row.orderNumber);
    }

    rowsArrayMapper(rows) {
        if (!(rows instanceof Array)) {
            throw new Error('rows должен быть массивом');
        }

        if (rows.length === 0) {
            return new RangsCollection([]);
        }

        const modelsArr = [];

        for (const row of rows) {
            const model = this.rowMapper(row);
            modelsArr.push(model);
        }

        return new RangsCollection(modelsArr);
    }
}