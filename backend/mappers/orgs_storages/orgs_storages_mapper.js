import OrgsStoragesMapperInterface from "./orgs_storages_mapper_interface.js";
import { db } from "../../database/init.js";

export default class OrgsStoragesMapper extends OrgsStoragesMapperInterface {
    constructor() {
        super();
    }

    createContentWithResource(orgId, resourceId, count) {
        db.prepare(`
            INSERT INTO orgs_storages_contents (storageId, resourceId, count)
            VALUES(
                (SELECT storageId FROM orgs_storages_members WHERE memberOrgId = ?),
                ?,
                ?
            )
        `).run(orgId, resourceId, count);
    }

    createContentWithSimpleItem(orgId, simpleItemId, count) {
        db.prepare(`
            INSERT INTO orgs_storages_contents (storageId, simpleItemId, count)
            VALUES(
                (SELECT storageId FROM orgs_storages_members WHERE memberOrgId = ?),
                ?,
                ?
            )
        `).run(orgId, simpleItemId, count);
    }

    createContentWithCompoundItem(orgId, compoundItemId, count) {
        db.prepare(`
            INSERT INTO orgs_storages_contents (storageId, compoundItemId, count)
            VALUES(
                (SELECT storageId FROM orgs_storages_members WHERE memberOrgId = ?),
                ?,
                ?
            )
        `).run(orgId, compoundItemId, count);
    }

    deleteContentById(id) {
        db.prepare(`
            DELETE FROM
                orgs_storages_contents
            WHERE
                id = ?
        `).run(id);
    }

    findContentById(id) {
        const result = db.prepare(`
            SELECT
                *
            FROM
                orgs_storages_contents
            WHERE
                id = ?   
        `).get(id);

        return result || null;
    }

    findAllResourcesByOrgId(orgId) {
        const result = db.prepare(`
            SELECT
                r.*,
                o.count as count,
                o.price as price
            FROM
                orgs_storages_members m
            JOIN
                orgs_storages_contents o
            ON
                m.storageId = o.storageId
            JOIN
                resources r
            ON
                r.id = o.resourceId
            WHERE
                m.memberOrgId = ?
                AND
                o.resourceId IS NOT NULL
        `).all(orgId);

        return result;
    }

    findAllSimpleItemsByOrgId(orgId) {
        const result = db.prepare(`
            SELECT
                s.*,
                o.count as count,
                o.price as price
            FROM
                orgs_storages_members m
            JOIN
                orgs_storages_contents o
            ON
                m.storageId = o.storageId
            JOIN
                simple_items s
            ON
                s.id = o.simpleItemId
            WHERE
                m.memberOrgId = ?
                AND
                o.simpleItemId IS NOT NULL
        `).all(orgId);

        return result;
    }

    findAllCompoundItemsByOrgId(orgId) {
        throw new Error('findAllCompoundItemsByOrgId без реализации');
    }

    findContentByOrgAndResource(orgId, resourceId) {
        const result = db.prepare(`
            SELECT
                o.*
            FROM
                orgs_storages_contents o
            JOIN
                orgs_storages_members m
            ON
                m.storageId = o.storageId
            WHERE
                m.memberOrgId = ?
                AND
                o.resourceId = ?
        `).get(orgId, resourceId);

        return result || null;
    }

    findContentByOrgAndSimpleItem(orgId, simpleItemId) {
        const result = db.prepare(`
            SELECT
                o.*
            FROM
                orgs_storages_contents o
            JOIN
                orgs_storages_members m
            ON
                m.storageId = o.storageId
            WHERE
                m.memberOrgId = ?
                AND
                o.simpleItemId = ?
        `).get(orgId, simpleItemId);

        return result || null;
    }

    findContentByOrgAndCompoundItem(orgId, compoundItemId) {
        const result = db.prepare(`
            SELECT
                o.*
            FROM
                orgs_storages_contents o
            JOIN
                orgs_storages_members m
            ON
                m.storageId = o.storageId
            WHERE
                m.memberOrgId = ?
                AND
                o.compoundItemId = ?
        `).get(orgId, compoundItemId);

        return result || null;
    }

    incrementOrgResource(orgId, resourceId, incrementValue) {
        db.prepare(`
            UPDATE
                orgs_storages_contents
            SET
                count = count + ?
            WHERE
                resourceId = ?
                AND
                storageId IN (
                    SELECT
                        storageId
                    FROM
                        orgs_storages_members
                    WHERE
                        memberOrgId = ?
                )
        `).run(incrementValue, resourceId, orgId);
    }

    incrementOrgSimpleItem(orgId, simpleItemId, incrementValue) {
        db.prepare(`
            UPDATE
                orgs_storages_contents
            SET
                count = count + ?
            WHERE
                simpleItemId = ?
                AND
                storageId IN (
                    SELECT
                        storageId
                    FROM
                        orgs_storages_members
                    WHERE
                        memberOrgId = ?
                )
        `).run(incrementValue, simpleItemId, orgId);
    }

    incrementOrgCompoundItem(orgId, compoundItemId, incrementValue) {
        db.prepare(`
            UPDATE
                orgs_storages_contents
            SET
                count = count + ?
            WHERE
                compoundItemId = ?
                AND
                storageId IN (
                    SELECT
                        storageId
                    FROM
                        orgs_storages_members
                    WHERE
                        memberOrgId = ?
                )
        `).run(incrementValue, compoundItemId, orgId);
    }

    decrementOrgResource(orgId, resourceId, decrementValue) {
        db.prepare(`
            UPDATE
                orgs_storages_contents
            SET
                count = count - ?
            WHERE
                resourceId = ?
                AND
                storageId IN (
                    SELECT
                        storageId
                    FROM
                        orgs_storages_members
                    WHERE
                        memberOrgId = ?
                )
        `).run(decrementValue, resourceId, orgId);
    }

    decrementOrgSimpleItem(orgId, simpleItemId, decrementValue) {
        db.prepare(`
            UPDATE
                orgs_storages_contents
            SET
                count = count - ?
            WHERE
                simpleItemId = ?
                AND
                storageId IN (
                    SELECT
                        storageId
                    FROM
                        orgs_storages_members
                    WHERE
                        memberOrgId = ?
                )
        `).run(decrementValue, simpleItemId, orgId);
    }

    decrementOrgCompoundItem(orgId, compoundItemId, decrementValue) {
        db.prepare(`
            UPDATE
                orgs_storages_contents
            SET
                count = count - ?
            WHERE
                compoundItemId = ?
                AND
                storageId IN (
                    SELECT
                        storageId
                    FROM
                        orgs_storages_members
                    WHERE
                        memberOrgId = ?
                )
        `).run(decrementValue, compoundItemId, orgId);
    }

    updatePriceByOrgAndResource(orgId, resourceId, newPrice) {
        db.prepare(`
            UPDATE
                orgs_storages_contents
            SET
                price = ?
            WHERE
                resourceId = ?
                AND
                storageId IN (
                    SELECT
                        storageId
                    FROM
                        orgs_storages_members
                    WHERE
                        memberOrgId = ?
                )
        `).run(newPrice, resourceId, orgId);
    }

    updatePriceByOrgAndSimpleItem(orgId, simpleItemId, newPrice) {
        db.prepare(`
            UPDATE
                orgs_storages_contents
            SET
                price = ?
            WHERE
                simpleItemId = ?
                AND
                storageId IN (
                    SELECT
                        storageId
                    FROM
                        orgs_storages_members
                    WHERE
                        memberOrgId = ?
                )
        `).run(newPrice, simpleItemId, orgId);
    }

    updatePriceByOrgAndCompoundItem(orgId, compoundItemId, newPrice) {
        db.prepare(`
            UPDATE
                orgs_storages_contents
            SET
                price = ?
            WHERE
                compoundItemId = ?
                AND
                storageId IN (
                    SELECT
                        storageId
                    FROM
                        orgs_storages_members
                    WHERE
                        memberOrgId = ?
                )
        `).run(newPrice, compoundItemId, orgId);
    }

    createNewStorageMember(storageId, memberOrgId) {
        db.prepare(`
            INSERT INTO orgs_storages_members (storageId, memberOrgId)
            VALUES (?, ?)
        `).run(storageId, memberOrgId);
    }

    createNewStorage(ownerOrgId) {
        const result =  db.prepare(`
            INSERT INTO orgs_storages (ownerOrgId)
            VALUES (?)
        `).run(ownerOrgId);

        return result.lastInsertRowid;
    }
}