import "../assets/css/Sign.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PasswordField } from "../components/UsePassword.jsx";
import SEO from './../components/seo.jsx';

function Reset_Password() {
	const navigate = useNavigate();
	const location = useLocation();
	
	// Si viene de Forgot Password, autocompletamos el usuario
	const initialUsernameOrEmail = location.state?.username_or_email || "";
	
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	async function handleSubmit(e) {
		e.preventDefault();
		
		if (password !== confirmPassword) {
			return setMessage("Las contraseñas no coinciden");
		}

		setIsLoading(true);
		const form = new FormData(e.currentTarget);
		const username_or_email = form.get("username_or_email");
		const verify_code = form.get("verify_code");

		try {
			const res = await fetch("/yourtree/api/reset-password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username_or_email,
					verify_code,
					password,
				}),
			});

			const data = await res.json().catch(() => ({}));
			
			if (res.ok) {
				setMessage("Password updated successfully! Redirecting...");
				setTimeout(() => {
					navigate("/Sign_in");
				}, 3000);
			} else {
				setMessage(data.message || "Failed to reset password.");
			}
		} catch (error) {
			console.error(error);
			setMessage("Network error");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<main id="main_sign">
			<SEO 
				title="Reset Password - YourTree"
				description="Set a new password for your YourTree account."
			/>
			<section id="sign">
				<section>
					<form id="form_sign" onSubmit={handleSubmit} method="POST">
						<h2>Set New Password</h2>
						<p style={{marginBottom: "20px", color: "var(--text_2)"}}>
							Enter the code we sent to your email and your new password.
						</p>
						
						<label htmlFor="username_or_email">Username / Email :*</label>
						<input
							type="text"
							name="username_or_email"
							id="username_or_email"
							defaultValue={initialUsernameOrEmail}
							required
						/>

						<label htmlFor="verify_code">Verification Code :*</label>
						<input
							type="text"
							name="verify_code"
							id="verify_code"
							placeholder="e.g. A1B2C3"
							required
						/>
						
						<label htmlFor="password">New Password :*</label>
						<PasswordField
							id={"password"}
							name={"password"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>

						<label htmlFor="confirm_password">Confirm New Password :*</label>
						<PasswordField
							id={"confirm_password"}
							name={"confirm_password"}
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
						
						{message && <p className={message.includes("successfully") ? "success" : "error"} style={{color: message.includes("successfully") ? "green" : "red", marginTop: "10px"}}>{message}</p>}
						
						<input type="submit" value={isLoading ? "Updating..." : "Reset Password"} disabled={isLoading} />
					</form>
				</section>
				<section id="message_sign">
					<h2> Almost there... </h2>
				</section>
			</section>
		</main>
	);
}

export default Reset_Password;
