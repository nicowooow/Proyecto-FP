import styleRepository from "../repository/style.repository.js";

// Obtener todos
export const getStyles = async () => {
	const rows = await styleRepository.getStyles();
	return rows;
};

// Obtener uno por id
export const getStyle = async (id) => {
	const rows = await styleRepository.getStyle(id);

	if (rows.length === 0) {
		throw new Error("STYLE_NOT_FOUND");
	}

	return rows[0];
};

// Crear
export const createStyle = async ({ title, style }) => {
	const rowCount = await styleRepository.createStyle(title, style);

	if (rowCount === 0) {
		throw new Error("STYLE_NOT_CREATED");
	}
};

// Eliminar
export const deleteStyle = async (id) => {
	const rowCount = await styleRepository.deleteStyle(id);

	if (rowCount === 0) {
		throw new Error("STYLE_NOT_FOUND");
	}
};

// PUT (completo)
export const updateStyle = async (id, { title, style }) => {
	const rowCount = await styleRepository.putStyle(id, title, style);

	if (rowCount === 0) {
		throw new Error("STYLE_NOT_FOUND");
	}
};

// PATCH (parcial)
export const patchStyle = async (id, { title, style }) => {
	const rowCount = await styleRepository.patchStyle(id, title, style);

	if (rowCount === 0) {
		throw new Error("STYLE_NOT_FOUND");
	}
};