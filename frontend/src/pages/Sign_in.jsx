import "../assets/css/Sign.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { PasswordField } from "../components/UsePassword.jsx";
import { useAuth } from "../components/auth.jsx";

function Sign_in() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [message, setMessage] = useState("");
	const [password, setPassword] = useState("");

	async function handleSubmit(e) {
		e.preventDefault(); // para que no se recargue la pagina
		const form = new FormData(e.currentTarget);
		const username_or_email = form.get("username_or_email");
		const passwd = form.get("password");
		// console.log(e);  console.log(form);  console.log(username_or_email); console.log(password);
		try {
			const res = await fetch("/yourtree/api/sign-in/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username_or_email,
					password: passwd,
				}),
			});

			const data = await res.json().catch((error) => console.log(error));
			// usamos el catch(() => ({})) para que si el back da un error o envia HTML no se rompa el front
			if (!res.ok) {
				return setMessage(data.message || "Login failed");
			}
			if (res.ok) {
				// console.log("LOGIN OK:", data);
				// return setMessage(data.message)
				// console.log(data.user);

				login(data.accessToken, data.refreshToken, data.user);

				navigate("/home");
				return setMessage("");
			}
			return setMessage("something was wrong");
		} catch (error) {
			console.error(error);
			return setMessage("Network error");
		}
	}
	return (
		<main id="main_sign">
			<section id="sign">
				<section>
					<form id="form_sign" onSubmit={handleSubmit} method="POST">
						<label htmlFor="username_or_email">Username / Email :*</label>
						<input
							type="text"
							name="username_or_email"
							id="username_or_email"
							required
						/>
						<label htmlFor="password">Password :*</label>
						<PasswordField
							id={"password"}
							name={"password"}
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
							}}
						/>
						{message && <p className="error">{message}</p>}
						<input type="submit" value="sing_in" />
					</form>
				</section>
				<section id="message_sign">
					<h2> Hello again, I can see that you want use your accont </h2>
				</section>
			</section>
		</main>
	);
}
export default Sign_in;
