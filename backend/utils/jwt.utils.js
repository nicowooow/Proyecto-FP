import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "./../config/config.js";
import jwt from "jsonwebtoken";
/* El access token es como un pase de entrada de corta duración: 
cuando se vence, uso el refresh token para sacar otro sin pedirle la contraseña al usuario.


El refresh token es el límite máximo de la sesión: 
mientras siga vivo, aunque el usuario se vaya y vuelva, puedo seguir renovando el access token en segundo plano; cuando el refresh token caduca o es inválido, ya no puedo renovar nada más y ahí sí se cierra la sesión por completo y toca iniciar sesión de nuevo. */
export const createAccessToken = (id, username, role) => {
  try {
    // console.log(id,username,role);

    return jwt.sign(
      {
        id,
        username,
        role,
      },
      JWT_ACCESS_SECRET,
      {
        expiresIn: "1d",
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const createRefreshToken = (id, tokenVersion) => {
  try {
    // console.log(id,tokenVersion);
    return jwt.sign(
      {
        id,
        tokenVersion,
      },
      JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );
  } catch (error) {
    console.log(error);
  }
};
