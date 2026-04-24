import userRepository from "../repository/user.repository.js";

export const scheduleCodeExpiration = async (userId) => {
    // Se ejecuta el temporizador para limpiar el código después de 5 minutos
    setTimeout(async () => {
        try {
            const rowCount = await userRepository.updateVerifyCode(null, userId);
            if (rowCount === 0) {
                console.error(`Verify code expiration failed: User ${userId} not found or already null`);
            }
        } catch (error) {
            console.error("Error updating verify code in background:", error);
        }
    }, 5 * 60 * 1000);

    // El servicio retorna inmediatamente para que el controlador responda al usuario
    return true;
};