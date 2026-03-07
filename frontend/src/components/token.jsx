/* import {useAuth} from "./auth.jsx";
let {logout} = useAuth(); */
import cookie from "js-cookie";
export const getUser = () => {
	return JSON.parse(cookie.get("user"));
};

export const getToken = () => {
	// obtenemos el primer token que tenemos
	return cookie.get("token");
};

export const getRefreshToken = () => {
	//obtenemos el segundo token
	return cookie.get("refreshToken");
};

export const refreshToken = async () => {
	// traemos el segundo token el cual sera para refrescarlo
	const refreshToken = getRefreshToken();
	// si no lo encuentra regresa un valor nulo
	// console.log(refreshToken);

	if (!refreshToken) return null;
	// enviamos el contenido del token pero esta vez por el metodo post =
	let res = await fetch("/yourtree/api/refresh", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ refreshToken }),
	});
	//si la respuesta es un error 40_ o 50_ se considera
	// que no esta bien , entonces retorna un valor de false para el header
	if (!res.ok) return false;

	// obtenemos los datos del back
	let data = await res.json();
	//guardamos el token en el almacenamiento local
	localStorage.setItem("token", data.token);
	//regredamos los datos de token
	return data.token;
};

export const verifyToken = async () => {
	try {
		//si tenemos un token activo lo buscamos
		const token = getToken();

		//si no lo tenemos el valor es flase ara el header y ahi queda
		if (!token) return false;
		// enviamos al back el token con la clave de authorization
		// por el header de la web enviamos el token
		let res = await fetch("/yourtree/api/authenticate", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		// console.log(res);
		// console.log(res.body);

		// si no lo encuentra pasamos al generar el token de nuevo
		if (res.status === 401) {
			// llamamos al metodo que tenemos arriba el cual se encarga del proceso de enviar datos
			const newToken = await refreshToken();
			// si lo nos regresa nada entonces no se puede regenerar el token y por ende no esta logueado
			// osea que el header es falso y nos muestra dichas opciones
			if (!newToken) return false;
			//si no es un valor vacio entonces lo enviamos al back como un nuevo token
			res = await fetch("/yourtree/api/authenticate", {
				headers: { Authorization: `Bearer ${newToken}` },
			});
			// console.log("se refresco el token");
		}
		// si nos dice que la respuesta HTTP esta entre los 400 a 500 retornamos falso
		if (!res.ok) {
			// logout();
			return false;
		}
		// sino esperamos la resuesta del backend
		let data = await res.json();
		// console.log(data);
		// retornamos los datos del back y en especifico si esta logueado o no
		// ponemos el !! para asegurarnos que el valor sea un boooleano por la doble negacion
		return !!data.isLogged;
	} catch (error) {
		console.error(error);
		return false;
	}
};
