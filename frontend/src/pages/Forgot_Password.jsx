import "../assets/css/Sign.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SEO from './../components/seo.jsx';

function Forgot_Password() {
	const navigate = useNavigate();
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(e) {
		e.preventDefault();
		setIsLoading(true);
		const form = new FormData(e.currentTarget);
		const username_or_email = form.get("username_or_email");

		try {
			const res = await fetch("/yourtree/api/forgot-password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username_or_email,
				}),
			});

			const data = await res.json().catch(() => ({}));
			
			if (res.ok) {
				setMessage("If the user exists, an email with the recovery code has been sent.");
				// Redirect to the Reset Password page after a short delay
				setTimeout(() => {
					navigate("/Reset_Password", { state: { username_or_email } });
				}, 3000);
			} else {
				setMessage(data.message || "Failed to request password reset.");
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
				title="Forgot Password - YourTree"
				description="Recover your YourTree account password."
			/>
			<section id="sign">
				<section>
					<form id="form_sign" onSubmit={handleSubmit} method="POST">
						<h2>Reset Password</h2>
						<p style={{marginBottom: "20px", color: "var(--text_2)"}}>
							Enter your username or email address and we'll send you a link to get back into your account.
						</p>
						
						<label htmlFor="username_or_email">Username / Email :*</label>
						<input
							type="text"
							name="username_or_email"
							id="username_or_email"
							required
						/>
						
						{message && <p className={message.includes("sent") ? "success" : "error"} style={{color: message.includes("sent") ? "green" : "red", marginTop: "10px"}}>{message}</p>}
						
						<input type="submit" value={isLoading ? "Sending..." : "Send Reset Code"} disabled={isLoading} />
					</form>
				</section>
				<section id="message_sign">
					<h2> Let's get you back into your account. </h2>
				</section>
			</section>
		</main>
	);
}

export default Forgot_Password;
