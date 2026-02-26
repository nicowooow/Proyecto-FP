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
});

export const sendEmail = async (email, code) => {
	try {
		await transporter.sendMail({
			from: '"NicoWooow" <soporte@nicowooow.com>',
			to: email,
			subject: `Código de activación: + ${code}`,
			html: `<h1>¡Bienvenido!</h1><p>Tu código de verificación es: <b>${code}</b></p>`,
		});
	} catch (error) {
		console.log(error);
		throw error;
	}
};
