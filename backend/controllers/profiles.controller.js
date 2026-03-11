import pool from "../db/connection_db.model.js";
import Profile from "../models/profile.model.js";
import profileRepository from "../repository/profile.repository.js";

export const get_profiles = async (req, res) => {
	try {
		let sql = "select * from profiles";
		let { rows } = await pool.query(sql);
		res.send(rows);
	} catch (error) {
		console.log(error);
	}
};
export const get_recent_profiles = async (req, res) => {
	try {
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

		// If recent_links is null, ensure it returns an empty array
		const formattedRows = rows.map(row => ({
			...row,
			recent_links: row.recent_links || []
		}));

		res.send(formattedRows);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error en el servidor" });
	}
};

export const get_profile = async (req, res, next) => {
	try {
		let { username } = req.params;
		let sql = `select p.* from profiles p join users u on p.user_id = u.id where u.username = $1`;
		let { rows } = await pool.query(sql, [username]);

		if (rows.length === 0)
			return res.status(404).json({ message: "Profile not found" });

		let row = rows[0];
		let profile = new Profile(
			row.id,
			row.user_id,
			row.plan_id,
			row.first_name,
			row.last_name,
			row.birth_date,
			row.phone,
			row.recovery_email,
			row.bio,
			row.image_url,
			row.theme,
			row.is_monthly_plan,
			row.is_public,
			row.created_at,
			row.updated_at
		);

		return res.status(200).send(profile.toPublic());
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error en el servidor" });
	}
};

export const post_profile = (req, res) => {
	try {
		let {
			user_id,
			plan_id,
			first_name,
			last_name,
			birth_day,
			phone,
			recovery_email,
			bio,
			image_url,
			theme,
			is_monthly_plan,
			is_public,
		} = req.body;
		let created_at = new Date();
		let updated_at;
	} catch (error) {
		console.log(error);
		// res.status(404).send("usuario no encontrado");
		res.status(500).json({ message: "Error en el servidor" }); // importante
	}
};

export const delete_profile = (req, res) => {
	try {
	} catch (error) {
		console.log(error);
		// res.status(404).send("usuario no encontrado");
		res.status(500).json({ message: "Error en el servidor" }); // importante
	}
};

export const put_profile = (req, res) => {
	try {
	} catch (error) {
		console.log(error);
		// res.status(404).send("usuario no encontrado");
		res.status(500).json({ message: "Error en el servidor" }); // importante
	}
};

export const patch_profile = async (req, res) => {
	try {
		const { username } = req.params;
		const { description, delete_image } = req.body; // we are sending description from frontend

		let imageUrl = undefined;
		if (req.file) {
			// Build the URL to be stored in the DB so it can be requested via the static route
			imageUrl = `/yourtree/api/upload/${req.file.filename}`;
		} else if (delete_image === "true") {
			imageUrl = "";
		}

		// We need the profile id. Let's find the user and their profile first.
		let sql = `select p.id from profiles p join users u on p.user_id = u.id where u.username = $1`;
		let { rows } = await pool.query(sql, [username]);

		if (rows.length === 0) {
			return res.status(404).json({ message: "Profile not found" });
		}

		const profileId = rows[0].id;

		// We only want to update bio (which comes as 'description' from front) and image_url.
		// For profileRepository.patchProfile, we pass undefined for fields we don't want to change.
		await profileRepository.patchProfile(
			profileId,
			undefined, // firstName
			undefined, // lastName
			undefined, // birthDate
			undefined, // phone
			undefined, // recoveryEmail
			description, // bio
			imageUrl, // imageUrl
			undefined, // theme
			undefined, // isMonthlyPlan
			undefined  // isPublic
		);

		return res.status(200).json({ message: "Profile updated successfully", imageUrl });
	} catch (error) {
		console.log("Error in patch_profile:", error);
		res.status(500).json({ message: "Error en el servidor" });
	}
};
