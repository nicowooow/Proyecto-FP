import {
	BREVO_HOST,
	BREVO_PORT,
	BREVO_PASSWD_SMTP,
	BREVO_USER,
} from "../config/config.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: BREVO_HOST,
	port: BREVO_PORT,
	auth: {
		user: BREVO_USER,
		pass: BREVO_PASSWD_SMTP,
	},
	secure: false, // false para puerto 587
	debug: true, // ¡Añade esto!
	logger: true, // ¡Y esto!
});

// transporter.verify(function (error, success) {
// 	if (error) {
// 		console.log("Error de conexión SMTP:");
// 		console.log(error);
// 	} else {
// 		console.log("El servidor está listo para enviar correos");
// 	}
// });

export const sendEmail = async (email, code) => {
	try {
		await transporter.sendMail({
			from: '"Nicowooow" <suport@nicowooow.com>',
			to: email,
			subject: `Activation code`,
			html: `<h1>Welcome!!</h1><p>Your verify code is : <b style='font-size:2rem;'>${code}</b></p>
			<p>This code will be available for 5 minutes.</p>`,
		});

		return true
	} catch (error) {
		console.log(error);
		return false;
	}
};
