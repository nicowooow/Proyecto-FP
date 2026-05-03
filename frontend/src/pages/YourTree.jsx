// import "./../assets/css/links_base.css";
import "./../assets/css/forms.css";
import "./../assets/css/YourTree.css";
import Alert from '@mui/material/Alert';
import { useState, useRef, useEffect } from "react"; // el useMemo es para el uso que tiene en memoria
import { General_tree, PutLinks } from "../components/linksBase";
import { useNavigate } from "react-router-dom";
import { Collapsible } from "../components/collapsible.jsx";
import cookies from "js-cookie";
import {
	FormCreateLink,
	FormDeleteLink,
	FormUpdateLink,
	FormUploadImage,
} from "../components/forms.jsx";
import { useAuth } from "../components/auth.jsx";
import { getToken } from "../components/token.jsx";

import SEO from './../components/seo.jsx';
function YourTree() {
	// si no esta loggeado lo manda al incio
	const auth = useAuth();
	const navigate = useNavigate();
	const [layout, setLayout] = useState("3");
	const [description, setDescription] = useState("");
	const [selectedFile, setSelectedFile] = useState(null);
	const [imageUrl, setImageUrl] = useState("");
	const [imagePreview, setImagePreview] = useState(null);
	const [deleteImage, setDeleteImage] = useState(false);

	// Evitar que la imagen se guarde en cache y se muestre la nueva
	const [cacheBuster, setCacheBuster] = useState(Date.now());

	// Alert state
	const [muiAlert, setMuiAlert] = useState(null);
	const showAlert = (severity, message) => {
		setMuiAlert({ severity, message });
		setTimeout(() => setMuiAlert(null), 3500);
	};

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
				// Actualizar el cache para mostrar la nueva foto al instante
				setCacheBuster(Date.now());

				if (deleteImage) {
					setImageUrl("");
				} else if (data.imageUrl) {
					setImageUrl(data.imageUrl);
				}

				// Reset file states
				setSelectedFile(null);
				setImagePreview(null);
				setDeleteImage(false);
				showAlert('success', 'Perfil guardado correctamente.');
			} else {
				console.error("Failed to update profile");
				showAlert('error', 'No se pudo guardar el perfil.');
			}
		} catch (error) {
			console.error(error);
			showAlert('error', 'Error al guardar el perfil.');
		}
	};

	let displayImageUrl = imageUrl;
	if (imagePreview) {
		displayImageUrl = imagePreview;
	} else if (imageUrl && !imageUrl.includes("profile_default.svg") && !imageUrl.includes("profile?default.svg")) {
		displayImageUrl = `${imageUrl}?t=${cacheBuster}`;
	}

	return (
		<main id="main_yourtree">
			{muiAlert && (
				<div style={{ position: 'fixed', top: '1.2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, minWidth: '280px', maxWidth: '90vw' }}>
					<Alert severity={muiAlert.severity} variant="filled" onClose={() => setMuiAlert(null)}>
						{muiAlert.message}
					</Alert>
				</div>
			)}
			<SEO
				title="YourTree Editor - Create Custom Link Page"
				description="Customize your link-in-bio on YourTree: add links, change colors, upload photo, and share your unique profile."
				index={false}
			/>
			<section id="general_area">
				<section id="general_settings">
					<form className="settings" onSubmit={handleSaveProfile}>
						<h1>Settings View</h1>
						<Collapsible title="head" section="style_view">
							<div>
								<FormUploadImage
									onFileSelect={(file) => {
										setSelectedFile(file);
										setImagePreview(URL.createObjectURL(file));
										setDeleteImage(false);
									}}
									onDeleteImage={() => {
										setSelectedFile(null);
										setImagePreview(null);
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

						<input type="button" value="cancel" className="btn-constrast" title="cancel" />
						<input type="submit" value="save" className="btn-constrast" title="save" />
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
						imageUrl={displayImageUrl}
					/>
				</section>
			</section>
		</main>
	);
}
export default YourTree;
