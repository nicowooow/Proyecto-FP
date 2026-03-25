import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { General_tree } from "../components/linksBase";

import "./../assets/css/YourTree.css";
import SEO from './../components/seo.jsx';

function YourTreeUser() {
	const navigate = useNavigate();
	let { username } = useParams();

	const [description, setDescription] = useState("");
	const [imageUrl, setImageUrl] = useState("");

	useEffect(() => {
		async function existsUser(username) {
			try {
				const exists = await fetch(`/yourtree/api/user/verify/${username}`);
				const result = await exists.json();
				//// console.log(result);

				return result.exists;
			} catch (error) {
				// console.error("Error checking user:", error);
				return false;
			}
		}

		// console.log(username);
		if (!username) {
			navigate("/Sign_in");
		}

		// para que se ejecute la funcion asincrona, para comprobar si existe dicho usuario
		(async () => {
			const exists = await existsUser(username);
			//// console.log("User exists?", exists);

			if (!exists) {
				navigate("/404", { replace: true }); // Redirige a tu ruta 404
				// y en el historial no deja la busqueda mal hecha
			} else {
				fetch(`/yourtree/api/profile/${username}`)
					.then(res => res.json())
					.then(data => {
						if (data.bio) setDescription(data.bio);
						if (data.imageUrl) setImageUrl(data.imageUrl);
					})
					.catch(err => console.error("Error fetching profile", err));
			}
		})();
	}, [navigate, username]);
	return (
		<main id="main_yourtree">
<SEO 
  title={`@${username} on YourTree - Link in Bio`}
  description={`${username} shares their favorite links on YourTree. Visit their custom profile page.`}
/>
			<General_tree
				username={username}
				descrition={description}
				imageUrl={imageUrl}
			/>
		</main>
	);
}
export default YourTreeUser;
