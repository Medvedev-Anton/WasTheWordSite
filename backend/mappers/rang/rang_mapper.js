import { RangMapperInterface } from "./rang_mapper_interface";
import { db } from "../../database/init.js";
import { Rang } from "../../models/rang.js";
import { RangsCollection } from "../../collections/rangs_collection.js";

export class RangMapper extends RangMapperInterface {
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

    create(model) {
        if (!(model instanceof Rang)) {
            throw new Error('model должен иметь тип Rang');
        }

        if (model.getName() === undefined) {
            throw new Error('Отсутствует обязательный параметр name');
        }

        if (model.getThumbnailUrl() === undefined) {
            throw new Error('Отсутствует обязательный параметр thumbnail_url');
        }

        const insertResult = db.prepare(`
            INSERT
            INTO rangs (name, thumbnail_url)
            VALUES (?, ?)
        `).run(model.getName(), model.getThumbnailUrl());

        return insertResult.lastInsertRowid;
    }

    update(model) {
        if (!(model instanceof Rang)) {
            throw new Error('model должен иметь тип Rang');
        }

        if (model.getId() === undefined) {
            throw new Error('Отсутствует обязательный параметр id');
        }

        if (model.getId() <= 0) {
            throw new Error('id не может быть неположительным');
        }

        db.prepare(`
            UPDATE rangs 
            SET name = ?, thumbnail_url = ?
            WHERE id = ?
        `).run(model.getName() || '', model.getThumbnailUrl() || '', model.getId());
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

        return new Rang(rangs.id, rangs.name, rangs.thumbnail_url);
    }

    rowsArrayMapper(rows) {
        if (!(rows instanceof Array)) {
            throw new Error('rows должен быть массивом');
        }

        if (rows.length === 0) {
            return new RangsCollection([]);
        }

        modelsArr = [];

        for (const row of rows) {
            const model = this.rowMapper(row);
            modelsArr.add(model);
        }

        return new RangsCollection(modelsArr);
    }
}