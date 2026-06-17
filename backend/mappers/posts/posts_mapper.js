import { PostsMapperInterface } from "./posts_mapper_interface.js";
import { db } from "../../database/init.js";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

export class PostsMapper extends PostsMapperInterface {
    constructor() {
        super();
    }

    getTotalCountByUser(userId) {
        if (userId < 0) {
            throw new Error('userId не может быть отрицательным');
        }

        const result = db.prepare(`
            SELECT
                p.id, COUNT(p.id) as cnt
            FROM posts p
            JOIN users u ON p.authorId = u.id
            WHERE
                u.id = ?
        `).get(userId);

        return parseInt(result.cnt);
    }

    deleteAllOrgPosts(orgId) {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const filesToDelete = db.prepare(`
            SELECT
                f.fileUrl
            FROM
                posts p
            JOIN
                post_files f
            ON 
                p.id = f.postId
            WHERE
                p.organizationId = ?
        `).all(orgId);

        filesToDelete.forEach(file => {
            if (file.fileUrl) {
                const filePath = path.join(__dirname, '../..', file.fileUrl.replace(/^\//, ''));

                if (fs.existsSync(filePath)) {
                    try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
                }
            }
        });

        db.prepare(`
            DELETE FROM
                posts
            WHERE
                organizationId = ?    
        `).run(orgId);
    }

    deleteById(postId) {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const filesToDelete = db.prepare(`
            SELECT
                f.fileUrl
            FROM
                posts p
            JOIN
                post_files f
            ON 
                p.id = f.postId
            WHERE
                p.id = ?
        `).all(postId);

        filesToDelete.forEach(file => {
            if (file.fileUrl) {
                const filePath = path.join(__dirname, '../..', file.fileUrl.replace(/^\//, ''));

                if (fs.existsSync(filePath)) {
                    try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
                }
            }
        });

        db.prepare(`
            DELETE FROM
                posts
            WHERE
                id = ?    
        `).run(postId);
    }
}