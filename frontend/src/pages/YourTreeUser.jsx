import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { General_tree } from "../components/linksBase";

import "./../assets/css/YourTree.css";

function YourTreeUser() {
	const navigate = useNavigate();
	let { username } = useParams();

	useEffect(() => {
		async function existsUser(username) {
			try {
				const exists = await fetch(`/yourtree/api/user/verify/${username}`);
				const result = await exists.json();
				// console.log(result);

				return result.exists;
			} catch (error) {
				// console.error("Error checking user:", error);
				return false;
			}
		}

		console.log(username);
		if (!username) {
			navigate("/Sign_in");
		}

		// para que se ejecute la funcion asincrona, para comprobar si existe dicho usuario
		(async () => {
			const exists = await existsUser(username);
			// console.log("User exists?", exists);

			if (!exists) {
				navigate("/404", { replace: true }); // Redirige a tu ruta 404
			}
		})();
	}, [navigate, username]);
	return (
		<main id="main_yourtree">
			<General_tree username={username} />
		</main>
	);
}
export default YourTreeUser;
