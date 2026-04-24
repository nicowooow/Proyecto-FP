import userRepository from "../repository/user.repository.js";

// Obtener todos los usuarios
export const getUsers = async () => {
	const users = await userRepository.getAllUsers();
	return users;
};

// Obtener usuario por username (completo)
export const getUser = async (username) => {
	const user = await userRepository.getUser(username);

	if (!user) {
		throw new Error("USER_NOT_FOUND");
	}

	return user;
};

// Verificar si usuario existe (solo boolean)
export const userExists = async (username) => {
	const user = await userRepository.getUser(username);
	return !!user;
};

// Crear usuario
export const createUser = async ({
	username,
	email,
	password,
	status,
	role_id,
	verifyCode,
}) => {
	const exists = await userRepository.checkUser(username, email);

	if (exists) {
		throw new Error("USER_EXISTS");
	}

	const userId = await userRepository.createUser(
		username,
		email,
		password,
		status,
		role_id,
		verifyCode
	);

	if (!userId) {
		throw new Error("USER_NOT_CREATED");
	}

	// lógica de negocio (antes estaba mal en repository)
	setTimeout(() => {
		userRepository.updateVerifyCode(null, userId).catch(console.log);
	}, 5 * 60 * 1000);

	return userId;
};

// Eliminar usuario
export const deleteUser = async (id) => {
	const rowCount = await userRepository.deleteUser(id);

	if (rowCount === 0) {
		throw new Error("USER_NOT_FOUND");
	}
};

// Actualizar completamente
export const updateUser = async (id, data) => {
	const { username, email, password, status } = data;

	const rowCount = await userRepository.putUser(
		id,
		username,
		email,
		password,
		status
	);

	if (rowCount === 0) {
		throw new Error("USER_NOT_FOUND");
	}
};

// Actualizar parcialmente
export const patchUser = async (id, data) => {
	const { username, email, password, status, role_id } = data;

	const rowCount = await userRepository.patchUser(
		id,
		username,
		email,
		password,
		status,
		role_id
	);

	if (rowCount === 0) {
		throw new Error("USER_NOT_FOUND");
	}
};

// Buscar usuarios
export const searchUsers = async (query, limit) => {
	if (!query) return [];

	return await userRepository.searchUsers(query, limit);
};