// import "./../assets/css/links_base.css";
import "./../assets/css/YourTree.css";
import { useState, useRef, useEffect } from "react"; // el useMemo es para el uso que tiene en memoria
import { General_tree, PutLinks } from "../components/linksBase";
import { useParams, useNavigate } from "react-router-dom";
import { Collapsible } from "../components/collapsible.jsx";
import { HAPC, HPC } from "../components/colorPicker.jsx";
import cookies from "js-cookie";
import {
	FormCreateLink,
	FormDeleteLink,
	FormUpdateLink,
	FormUploadImage,
} from "../components/forms.jsx";
import { useAuth } from "../components/auth.jsx";
import { getToken } from "../components/token.jsx";

function YourTree() {
	// si no esta loggeado lo manda al incio
	const auth = useAuth();
	const navigate = useNavigate();
	const [layout, setLayout] = useState("3");
	const [description, setDescription] = useState("");
	const [selectedFile, setSelectedFile] = useState(null);
	const [imageUrl, setImageUrl] = useState("");
	const [deleteImage, setDeleteImage] = useState(false);

	const cookieUser = cookies.get("user") ? JSON.parse(cookies.get("user")) : null;
	const currentUsername = cookieUser ? cookieUser.username : "";

	useEffect(() => {
		if (!auth.isLogged && !auth.loading) {
			navigate("/Sign_in");
		}
	}, [auth.isLogged, auth.loading, navigate]);

	useEffect(() => {
		if (currentUsername) {
			fetch(`/yourtree/api/profile/${currentUsername}`)
				.then(res => res.json())
				.then(data => {
					if (data.bio) setDescription(data.bio);
					if (data.imageUrl) setImageUrl(data.imageUrl);
				})
				.catch(err => console.error("Error fetching profile", err));
		}
	}, [currentUsername]);

	if (!auth.isLogged) {
		return null;
	}

	const handleSaveProfile = async (e) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append("description", description);
		if (selectedFile) {
			formData.append("profile_photo", selectedFile);
		}
		if (deleteImage) {
			formData.append("delete_image", "true");
		}

		try {
			const token = getToken();
			const response = await fetch(`/yourtree/api/profile/${currentUsername}`, {
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formData,
			});

			if (response.ok) {
				const data = await response.json();
				console.log("Profile updated successfully:", data);
				alert("Profile saved successfully");
			} else {
				console.error("Failed to update profile");
				alert("Failed to save profile");
			}
		} catch (error) {
			console.error(error);
			alert("Error trying to save profile");
		}
	};

	return (
		<main id="main_yourtree">
			<section id="general_area">
				<section id="general_settings">
					<form className="settings" onSubmit={handleSaveProfile}>
						<h1>Settings View</h1>
						<Collapsible title="head" section="style_view">
							<div>
								<FormUploadImage
									onFileSelect={(file) => {
										setSelectedFile(file);
										setDeleteImage(false);
									}}
									onDeleteImage={() => {
										setSelectedFile(null);
										setDeleteImage(true);
										setImageUrl("");
									}}
								/>
							</div>
							<div>
								<label htmlFor="description">
									<strong>bio : </strong>
								</label>
								<input
									type="text"
									name="description"
									id="description"
									placeholder="description from user"
									value={description}
									onChange={(e) => setDescription(e.currentTarget.value)}
								/>
							</div>
						</Collapsible>

						<input type="button" value="cancel" className="btn-constrast" />
						<input type="submit" value="save" className="btn-constrast" />
					</form>
					<section className="settings">
						<Collapsible title="list of links" section="style_link">
							<PutLinks username={currentUsername}>
								{/* aqui iran los svg que hacen referencia a la accion que cumplen, actualizar y eliminar  */}
								<FormUpdateLink />
								<FormDeleteLink />
							</PutLinks>
							<FormCreateLink username={currentUsername} />
						</Collapsible>
					</section>
				</section>
				<section id="pre_view">
					<General_tree
						username={currentUsername}
						option={layout}
						descrition={description}
						imageUrl={imageUrl}
					/>
				</section>
			</section>
		</main>
	);
}
export default YourTree;
