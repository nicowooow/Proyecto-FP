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
			html: `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- HEADER -->
          <tr>

            <td
              style="align-items:center; justify-content: center;  background:linear-gradient(135deg,#1a1a2e,#16213e);padding:36px 40px;text-align:center;">
              <img style="width: 3rem; height: 3rem; align-items:center; justify-self: center; align-self: center;"
                src="https://demo.treedlink.com/favicon.svg" alt="logo de https://demo.treedlink.com">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:1px;">
                YourTree</h1>
              <p style="margin:8px 0 0;color:#a0aec0;font-size:14px;">Account Verification</p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:40px 40px 20px;">
              <h2 style="margin:0 0 12px;color:#1a1a2e;font-size:22px;">Welcome aboard! 👋</h2>
              <p style="margin:0 0 28px;color:#4a5568;font-size:15px;line-height:1.6;">
                Thanks for signing up. To activate your account, use the verification code below.
              </p>

              <!-- CODE BOX -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center"
                    style="padding:28px 0;background:#f7f8fc;border-radius:12px;border:2px dashed #e2e8f0;">
                    <p style="margin:0 0 6px;color:#718096;font-size:12px;letter-spacing:2px;text-transform:uppercase;">
                      Your verification code</p>
                    <p style="margin:0;color:#1a1a2e;font-size:42px;font-weight:800;letter-spacing:8px;">${code}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0;color:#718096;font-size:13px;text-align:center;">
                ⏱ This code expires in <strong style="color:#e53e3e;">5 minutes</strong>. Do not share it with anyone.
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:20px 40px 36px;">
              <p style="margin:0;color:#a0aec0;font-size:12px;text-align:center;line-height:1.6;">
                If you did not create an account on YourTree, you can safely ignore this email.<br>
                &copy; ${new Date().getFullYear()} YourTree. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>

</html>
`,

		});

		return true
	} catch (error) {
		console.log(error);
		return false;
	}
};
