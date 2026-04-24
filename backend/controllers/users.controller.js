import User from "../models/user.model.js";
import * as userService from "../services/user.services.js";

// GET ALL
export const get_users = async (req, res) => {
	try {
		const users = await userService.getUsers();
		return res.status(200).json(users.map(u => new User(u).toPublic()));
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "server error" });
	}
};

// GET PUBLIC (solo existe o no)
export const get_user_public = async (req, res) => {
	try {
		const exists = await userService.userExists(req.params.username);

		if (!exists) {
			return res.status(404).json({
				exists: false,
				message: "user not found",
			});
		}

		return res.status(200).json({ exists: true });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "server error" });
	}
};

// GET USER
export const get_user = async (req, res) => {
	try {
		const user = await userService.getUser(req.params.username);
		return res.status(200).json(new User(user).toPublic());
	} catch (error) {
		if (error.message === "USER_NOT_FOUND") {
			return res.status(404).json({ message: "user not found" });
		}

		console.log(error);
		return res.status(500).json({ message: "server error" });
	}
};

// POST
export const post_user = async (req, res) => {
	try {
		await userService.createUser({
			...req.body,
			verifyCode: req.verifyCode,
		});

		return res.status(201).json({ message: "user created successfully" });
	} catch (error) {
		if (error.message === "USER_EXISTS") {
			return res.status(409).json({
				message: "user already exists",
			});
		}

		if (error.message === "USER_NOT_CREATED") {
			return res.status(500).json({
				message: "user was not created",
			});
		}

		console.log(error);
		return res.status(500).json({ message: "server error" });
	}
};

// DELETE
export const delete_user = async (req, res) => {
	try {
		await userService.deleteUser(req.params.id);
		return res.status(200).json({ message: "user deleted successfully" });
	} catch (error) {
		if (error.message === "USER_NOT_FOUND") {
			return res.status(404).json({ message: "user not found" });
		}

		console.log(error);
		return res.status(500).json({ message: "server error" });
	}
};

// PUT
export const put_user = async (req, res) => {
	try {
		await userService.updateUser(req.params.id, req.body);

		return res.status(200).json({
			message: "user updated successfully",
		});
	} catch (error) {
		if (error.message === "USER_NOT_FOUND") {
			return res.status(404).json({ message: "user not found" });
		}

		console.log(error);
		return res.status(500).json({ message: "server error" });
	}
};

// PATCH
export const patch_user = async (req, res) => {
	try {
		await userService.patchUser(req.params.id, req.body);

		return res.status(200).json({
			message: "user updated successfully",
		});
	} catch (error) {
		if (error.message === "USER_NOT_FOUND") {
			return res.status(404).json({ message: "user not found" });
		}

		console.log(error);
		return res.status(500).json({ message: "server error" });
	}
};

// SEARCH
export const search_users = async (req, res) => {
	try {
		const limit = parseInt(req.query.limit) || 5;
		const searchQuery = req.query.q || "";

		const users = await userService.searchUsers(searchQuery, limit);

		return res.status(200).json(users);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "server error" });
	}
};