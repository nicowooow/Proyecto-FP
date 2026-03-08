import linkRepository from "./../repository/link.repository.js";
import Link from "./../models/link.model.js";

export const get_links = async (req, res) => {
	try {
		let { profileId } = req.params;
		let rows = await linkRepository.getLinks(profileId);
		if (rows.length > 0) {
			res.status(200).json(rows.map((row) => new Link(row).toPublic()));
		} else {
			res.status(404).json({ message: "No links found" });
		}
	} catch (error) {
		return res.status(500).json({ message: "Server error : " + error });
	}
};
export const get_link = async (req, res) => {
	try {
		let { id } = req.params;
		let rows = await linkRepository.getLink(id);
		// console.log(rows);
		if (rows.length > 0) {
			res.status(200).json(rows.map((row) => new Link(row).toPublic()));
		} else {
			res.status(404).json({ message: "Link not found" });
		}
	} catch (error) {
		return res.status(500).json({ message: "Server error : " + error });
	}
};
export const post_link = async (req, res) => {
	try {
		let { profile_id, title, url, url_image, position, is_visible } = req.body;
		console.log(profile_id, title, url, url_image, position, is_visible);

		let rowCount = await linkRepository.createLink(
			profile_id,
			title,
			url,
			url_image,
			position,
			is_visible,
		);
		if (rowCount > 0) {
			res.status(201).json({ message: "Link created successfully" });
		} else {
			res.status(400).json({ message: "Failed to create link" });
		}
	} catch (error) {
		return res.status(500).json({ message: "Server error : " + error });
	}
};
export const delete_link = async (req, res) => {
	try {
		let { id } = req.params;
		let rowCount = await linkRepository.deleteLink(id);
		if (rowCount > 0) {
			res.status(200).json({ message: "Link deleted successfully" });
		} else {
			res.status(404).json({ message: "Link not found" });
		}
	} catch (error) {
		return res.status(500).json({ message: "Server error : " + error });
	}
};
export const put_link = async (req, res) => {
	try {
		let { id } = req.params;
		let { title, url, url_image, position, is_visible } = req.body;
		console.log({ id, title, url, url_image, position, is_visible });

		let rowCount = await linkRepository.putLink(
			id,
			title,
			url,
			url_image,
			position,
			is_visible,
		);
		if (rowCount > 0) {
			res.status(200).json({ message: "Link updated successfully" });
		}
	} catch (error) {
		return res.status(500).json({ message: "Server error : " + error });
	}
};
export const patch_link = async (req, res) => {
	try {
		let { id } = req.params;
		let { title, url, url_image, position, is_visible } = req.body;
		let rowCount = await linkRepository.patchLink(
			id,
			title,
			url,
			url_image,
			position,
			is_visible,
		);
		if (rowCount > 0) {
			res.status(200).json({ message: "Link partially updated successfully" });
		} else {
			res.status(404).json({ message: "Link not found" });
		}
	} catch (error) {
		return res.status(500).json({ message: "Server error : " + error });
	}
};
