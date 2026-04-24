import pool from "../db/connection_db.model.js";
import Profile from "../models/profile.model.js";
import profileRepository from "../repository/profile.repository.js";

export const get_profiles = async () => {
    let sql = "select * from profiles";
    let { rows } = await pool.query(sql);
    return rows;
};

export const get_recent_profiles = async () => {
    const sql = `
        SELECT 
            p.id as profile_id, p.first_name, p.last_name, p.image_url, p.theme, p.bio,
            u.username, u.created_at,
            (
                SELECT json_agg(json_build_object('id', l.id, 'title', l.title, 'url', l.url, 'url_image', l.url_image))
                FROM (
                    SELECT * FROM links 
                    WHERE profile_id = p.id AND is_visible = true
                    ORDER BY position ASC 
                    LIMIT 3
                ) l
            ) as recent_links
        FROM profiles p
        JOIN users u ON p.user_id = u.id
        WHERE p.is_public = true 
          AND EXISTS (
              SELECT 1 FROM links 
              WHERE profile_id = p.id AND is_visible = true
          )
        ORDER BY u.created_at DESC
        LIMIT 30
    `;
    let { rows } = await pool.query(sql);
    return rows.map(row => ({
        ...row,
        recent_links: row.recent_links || []
    }));
};

export const get_profile = async (username) => {
    let sql = `select p.* from profiles p join users u on p.user_id = u.id where u.username = $1`;
    let { rows } = await pool.query(sql, [username]);

    if (rows.length === 0) return null;

    let row = rows[0];
    return new Profile(
        row.id, row.user_id, row.first_name, row.last_name, row.birth_date,
        row.recovery_email, row.bio, row.image_url, row.theme, row.created_at
    );
};

export const patch_profile = async (username, body, file) => {
    const { firstName, lastName, birthDate, recoveryEmail, description, theme, delete_image } = body;

    let imageUrl = undefined;
    if (file) {
        imageUrl = `/yourtree/api/upload/${file.filename}`;
    } else if (delete_image === "true") {
        imageUrl = "";
    }

    let sql = `select p.id from profiles p join users u on p.user_id = u.id where u.username = $1`;
    let { rows } = await pool.query(sql, [username]);

    if (rows.length === 0) throw new Error("PROFILE_NOT_FOUND");

    const profileId = rows[0].id;

    await profileRepository.patchProfile(
        profileId,
        firstName || undefined,
        lastName || undefined,
        birthDate || undefined,
        recoveryEmail || undefined,
        description || undefined,
        imageUrl,
        theme || undefined
    );

    return imageUrl;
};

export const post_profile = async () => {};
export const delete_profile = async () => {};
export const put_profile = async () => {};