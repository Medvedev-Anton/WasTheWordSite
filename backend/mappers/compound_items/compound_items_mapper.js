import CompoundItemsMapperInterface from "./compound_items_mapper_interface.js";
import { db } from "../../database/init.js";

export default class CompoundItemsMapper extends CompoundItemsMapperInterface {
    constructor() {
        super();
    }

    findAll() {
        const rows = db.prepare(`
            SELECT 
                ci.id AS compound_id,
                ci.name AS compound_name,
                ci.imageUrl AS compound_imageUrl,
                si.id AS part_id,
                si.name AS part_name,
                si.imageUrl AS part_imageUrl
            FROM compound_items ci
            LEFT JOIN compound_items_parts cip ON ci.id = cip.compoundItemId
            LEFT JOIN simple_items si ON cip.partItemId = si.id
        `).all();

        const result = rows.reduce((acc, row) => {
            let compoundItem = acc.find(item => item.id === row.compound_id);
            
            if (!compoundItem) {
                compoundItem = {
                id: row.compound_id,
                name: row.compound_name,
                imageUrl: row.compound_imageUrl,
                parts: []
                };
                acc.push(compoundItem);
            }
            
            if (row.part_id) {
                compoundItem.parts.push({
                id: row.part_id,
                name: row.part_name,
                imageUrl: row.part_imageUrl
                });
            }
            
            return acc;
        }, []);

        return result;
    }

    create(number, name, imageUrl, itemsParts) {
        const transaction = db.transaction(() => {
            db.prepare(`
                INSERT INTO 
                    compound_items (name, imageUrl, number)
                VALUES (?, ?, ?)
            `).run(name, imageUrl, number);

            itemsParts.forEach(part => {
                db.prepare(`
                    INSERT INTO
                        compound_items_parts (compoundItemId, partItemId, countNeed)
                    VALUES (?, ?)
                `).run(part.compoundItemId, part.partItemId, part.countNeed);
            });
        });

        try {
            transaction();
        }
        catch (e) {
            throw new Error('Ошибка при обработке транзакции создания составного предмета: ' + e.message);
        }
    }

    delete(id) {
        db.prepare(`
            DELETE FROM
                compound_items
            WHERE
                id = ?    
        `).run(id);
    }

    update(id, fieldName, newValue) {
        db.prepare(`
            UPDATE
                compound_items
            SET
                ${fieldName} = ?
            WHERE
                id = ?
        `).run(newValue, id);
    }

    createPart(compoundItemId, partItemId, countNeed) {
        db.prepare(`
            INSERT INTO
                compound_items_parts (compoundItemId, partItemId, countNeed)    
            VALUES (?, ?, ?)
        `).run(compoundItemId, partItemId, countNeed);
    }

    deletePart(partId) {
        db.prepare(`
            DELETE FROM
                compound_items_parts
            WHERE
                id = ?
        `).run(partId);
    }

    findById(id) {
        const rows = db.prepare(`
            SELECT 
                ci.id AS compound_id,
                ci.name AS compound_name,
                ci.imageUrl AS compound_imageUrl,
                si.id AS part_id,
                si.name AS part_name,
                si.imageUrl AS part_imageUrl
            FROM compound_items ci
            LEFT JOIN compound_items_parts cip ON ci.id = cip.compoundItemId
            LEFT JOIN simple_items si ON cip.partItemId = si.id
            WHERE ci.id = ?
        `).all(id);

        const result = rows.reduce((acc, row) => {
            let compoundItem = acc.find(item => item.id === row.compound_id);
            
            if (!compoundItem) {
                compoundItem = {
                id: row.compound_id,
                name: row.compound_name,
                imageUrl: row.compound_imageUrl,
                parts: []
                };
                acc.push(compoundItem);
            }
            
            if (row.part_id) {
                compoundItem.parts.push({
                id: row.part_id,
                name: row.part_name,
                imageUrl: row.part_imageUrl
                });
            }
            
            return acc;
        }, []);

        return result;
    }
}