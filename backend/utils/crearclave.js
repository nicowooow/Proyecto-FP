const letras = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numeros = "0123456789";
const especiales = "!@#$%^&*()_+-=[]{}|;:,.<>?";

export function crearClave64dig() {
	// Combinamos todos los caracteres posibles
	const todosLosCaracteres = letras + numeros + especiales;

	let salida = "";
	const longitud = 64;

	for (let i = 0; i < longitud; i++) {
		// Seleccionamos un índice aleatorio de la cadena total
		const indiceAleatorio = Math.floor(
			Math.random() * todosLosCaracteres.length,
		);
		salida += todosLosCaracteres[indiceAleatorio];
	}
	console.log(salida);
	return salida;
}

export function crearClaveAuth() {
	let salida = "";
	const longitud = 6;
	for (let i = 0; i < longitud; i++) {
		// Seleccionamos un índice aleatorio de la cadena total
		const indiceAleatorio = Math.floor(Math.random() * numeros.length);
		salida +=
			i === longitud / 2
				? "-" + numeros[indiceAleatorio]
				: numeros[indiceAleatorio];
	}
	console.log(salida);
	return salida;
}
