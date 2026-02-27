import { createContext, useContext, useState, useEffect, useMemo } from "react";
import cookies from "js-cookie";
import { verifyToken } from "./token.jsx";

const AuthContext = createContext();
// creamos un contexto de autenticacion general para la aplicacion es decir
// es una etiqueta semantica en react que sera obligatoria de pasar al estar dentro de la app web

// creamos dicha etiqueta con el nombre de AuthProvider el cual tendra como parametro de entrada\
// un objeto cualquiera
export function AuthProvider({ children }) {
	// isLogged y loading lo ponemos con sus valores por defecto
	let [isLogged, setIsLogged] = useState(false);

	// usamos un efecto en el cual metemos una funcion asincrona para esperar la repuesta del servidor
	useEffect(() => {
		//hacemos una funcion vacia para por asi decirlo para ejecutar el verifytoken
		(async () => {
			const logged = await verifyToken();
			// si no encuentra su refresh lo elimina, loss tokens guardados previamente
			// console.log(logged);

			if (!logged) logout();
			// ponemos los datos
			// el resultado de verifyToken sera un boolean lo cual nos dira si esta logueado o no
			setIsLogged(logged);
			// setLoading(false);
			// esto nos serviria para el loader de la paginal si es falso desaparece el loader de la vista princial
		})();
	}, []);

	// esta sera una funcion para almacenar los tokens en el login
	const login = (token, refreshToken, user) => {
		// token inicial el cual es token de autenticacion original
		cookies.set("token", token, {
			expires: 1,
			secure: true,
			sameSite: "strict",
		});
		// este ser el token que usaremos para recargar el anterior antes de que expire
		cookies.set("refreshToken", refreshToken, {
			expires: 7,
			secure: true,
			sameSite: "strict",
		});
		// almacena los datos que sacamos de usuario en el almacenamiento local
		cookies.set("user", JSON.stringify(user), { expires: 7 });
		// cambiamos el valor de isLogged a true por ende si se logro loguear
		console.log("se creo el token y su refresh");
		setIsLogged(true);
	};

	// esta sera para destruir los datos almacenados en el almacenamiento local
	const logout = () => {
		// removemos el token origial
		cookies.remove("token");
		// removemos el refresh token
		cookies.remove("refreshToken");
		//removemos los datos del usuario
		cookies.remove("user");
		// retornamos que el login es falso, es decir que no tiene la sesion abierta
		setIsLogged(false);
	};

	//retornamos la etiqueta que generamos con el contexto y que tiene los valores de
	// isLogged, login, logout  y loading
	// cuales pueden tener elementos adentro
	const value = { isLogged, login, logout };

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
