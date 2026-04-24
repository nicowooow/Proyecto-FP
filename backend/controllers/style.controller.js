import * as styleService from "../services/style.services.js";

// GET ALL
export const get_styles = async (req, res) => {
	try {
		const rows = await styleService.getStyles();

		if (rows.length === 0) {
			return res.status(200).json({
				message: "there are no styles yet",
				data: [],
			});
		}

		return res.status(200).json({
			message: "styles found",
			data: rows,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "server error" });
	}
};

// GET ONE
export const get_style = async (req, res) => {
	try {
		const style = await styleService.getStyle(req.params.id);
		return res.status(200).json(style);
	} catch (error) {
		if (error.message === "STYLE_NOT_FOUND") {
			return res.status(404).json({
				message: `style with id ${req.params.id} not found`,
			});
		}

		console.log(error);
		return res.status(500).json({ message: "server error" });
	}
};

// POST
export const post_style = async (req, res) => {
	try {
		await styleService.createStyle(req.body);

		return res.status(201).json({
			message: "style created successfully",
		});
	} catch (error) {
		if (error.message === "STYLE_NOT_CREATED") {
			return res.status(500).json({
				message: "style not created",
			});
		}

		console.log(error);
		return res.status(500).json({ message: "server error" });
	}
};

// DELETE
export const delete_style = async (req, res) => {
	try {
		await styleService.deleteStyle(req.params.id);

		return res.status(200).json({
			message: "style deleted successfully",
		});
	} catch (error) {
		if (error.message === "STYLE_NOT_FOUND") {
			return res.status(404).json({
				message: `style with id ${req.params.id} not found`,
			});
		}

		console.log(error);
		return res.status(500).json({ message: "server error" });
	}
};

// PUT
export const put_style = async (req, res) => {
	try {
		await styleService.updateStyle(req.params.id, req.body);

		return res.status(200).json({
			message: "style updated successfully",
		});
	} catch (error) {
		if (error.message === "STYLE_NOT_FOUND") {
			return res.status(404).json({
				message: `style with id ${req.params.id} not found`,
			});
		}

		console.log(error);
		return res.status(500).json({ message: "server error" });
	}
};

// PATCH
export const patch_style = async (req, res) => {
	try {
		await styleService.patchStyle(req.params.id, req.body);

		return res.status(200).json({
			message: "style updated successfully",
		});
	} catch (error) {
		if (error.message === "STYLE_NOT_FOUND") {
			return res.status(404).json({
				message: `style with id ${req.params.id} not found`,
			});
		}

		console.log(error);
		return res.status(500).json({ message: "server error" });
	}
};