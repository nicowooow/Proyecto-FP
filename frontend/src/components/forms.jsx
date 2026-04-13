import React, { useRef, useEffect, useState, useMemo, useId } from "react";
import VerificationInput from "react-verification-input";
import { useNavigate } from "react-router-dom";
import "./../assets/css/forms.css";
import { useAuth } from "./auth";
import { getUser, getToken } from "./token.jsx";
import cookie from 'js-cookie'
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropUtils.js";
import Alert from '@mui/material/Alert';

const getLink = async (linkId) => {
	try {
		const response = await fetch(`yourtree/api/link/${linkId}`);
		const data = await response.json();
		//// console.log(data[0]);
		return {
			title: data[0].title,
			url: data[0].url,
			urlImage: data[0].urlImage,
			position: data[0].position,
		};
	} catch (error) {
		console.error("Error fetching link:", error);
		return {
			title: "",
			url: "",
			urlImage: "",
			position: 0,
		};
	}
};

export const FormUpdateLink = React.memo(function FormUpdateLink({ linkId }) {
	const dialogRef = useRef(null);
	const baseId = useId();
	const [title, setTitle] = useState("");
	const [url, setUrl] = useState("");
	const [urlImage, setUrlImage] = useState("");
	const [position, setPosition] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [linkAlert, setLinkAlert] = useState(null);
	const showLinkAlert = (severity, message) => {
		setLinkAlert({ severity, message });
		setTimeout(() => setLinkAlert(null), 3000);
	};
	const openDialog = () => setIsOpen(true);
	const closeDialog = () => setIsOpen(false);

	useEffect(() => {
		getLink(linkId).then(({ title, url, urlImage, position }) => {
			setTitle(title || "");
			setUrl(url || "");
			setUrlImage(urlImage || "");
			setPosition(position || "");
		});
		if (isOpen) {
			dialogRef.current?.showModal();
		} else {
			dialogRef.current?.close();
		}
	}, [isOpen, linkId]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const titleVal = e.target.title_form_link.value || title;
		const urlVal = e.target.url_form_link.value || url;
		const urlImageVal = e.target.url_image_form_link.value || urlImage;
		const positionVal = e.target.position_form_link.value || position;
		try {
			const res = await fetch(`/yourtree/api/link/${linkId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${getToken()}`,
				},
				body: JSON.stringify({
					title: titleVal,
					url: urlVal,
					url_image: urlImageVal,
					position: positionVal,
					is_visible: true,
				}),
			});
			if (res.ok) {
				showLinkAlert('success', 'Link actualizado correctamente.');
				setTimeout(() => window.location.reload(), 1000);
			} else {
				console.error("Failed to update link");
				showLinkAlert('error', 'No se pudo actualizar el link.');
			}
		} catch (error) {
			console.error(error);
			showLinkAlert('error', 'Error al actualizar el link.');
		}
	};

	const editIcon = useMemo(
		() => (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="icon icon-tabler icon-tabler-tool"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
				<path d="M7 10h3v-3l-3.5 -3.5a6 6 0 0 1 8 8l6 6a2 2 0 0 1 -3 3l-6 -6a6 6 0 0 1 -8 -8l3.5 3.5"></path>
			</svg>
		),
		[],
	);

	//// console.log(url, urlImage, position, title);

	return (
		<>
			<button type="button" className="btn-constrast" onClick={openDialog}>
				{editIcon}
			</button>
			<dialog className="form_update" data-link-id={linkId} ref={dialogRef}>
				{linkAlert && (
					<Alert severity={linkAlert.severity} variant="filled" onClose={() => setLinkAlert(null)} sx={{ mb: 2 }}>
						{linkAlert.message}
					</Alert>
				)}
				<form data-link-id={linkId} onSubmit={handleSubmit}>
					<label htmlFor={`${baseId}-img-url`}>Image URL:</label>
					<input
						type="text"
						name="url_image_form_link"
						id={`${baseId}-img-url`}
						defaultValue={urlImage}
					/>

					<label htmlFor={`${baseId}-title`}>Title:</label>
					<input
						type="text"
						name="title_form_link"
						id={`${baseId}-title`}
						defaultValue={title}
					/>

					<label htmlFor={`${baseId}-url`}>URL:</label>
					<input
						type="text"
						name="url_form_link"
						id={`${baseId}-url`}
						defaultValue={url}
					/>

					<label htmlFor={`${baseId}-position`}>Position:</label>
					<input
						type="number"
						min={0}
						name="position_form_link"
						id={`${baseId}-position`}
						defaultValue={position}
					/>

					<input
						className="btn-constrast"
						type="button"
						value="Cancel"
						onClick={closeDialog}
					/>
					<input className="btn-constrast" type="submit" value="Update" />
				</form>
			</dialog>
		</>
	);
});

export const FormCreateLink = React.memo(function FormCreateLink({ username }) {
	const dialogRef = useRef(null);
	const baseId = useId();
	const [createAlert, setCreateAlert] = useState(null);
	const showCreateAlert = (severity, message) => {
		setCreateAlert({ severity, message });
		setTimeout(() => setCreateAlert(null), 3000);
	};
	function openDialog() {
		dialogRef.current?.showModal();
	}
	function closeDialog() {
		dialogRef.current?.close();
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		const title = e.target.title_form_link.value;
		const url = e.target.url_form_link.value;
		const url_image = e.target.url_image_form_link.value;
		const position = e.target.position_form_link.value;
		try {
			let profileRes = await fetch(`/yourtree/api/profile/${username}`);
			if (!profileRes.ok) return;
			let profile = await profileRes.json();
			if (!profile.id) return;

			const res = await fetch(`/yourtree/api/link/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${getToken()}`,
				},
				body: JSON.stringify({
					profile_id: profile.id,
					title,
					url,
					url_image,
					position,
					is_visible: true,
				}),
			});
			if (res.ok) {
				showCreateAlert('success', 'Link creado correctamente.');
				setTimeout(() => window.location.reload(), 1000);
			} else {
				console.error("Failed to create link");
				showCreateAlert('error', 'No se pudo crear el link.');
			}
		} catch (error) {
			console.error(error);
			showCreateAlert('error', 'Error al crear el link.');
		}
	};

	const plusIcon = useMemo(
		() => (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="icon icon-tabler icon-tabler-circle-plus"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
				<path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
				<path d="M9 12h6"></path>
				<path d="M12 9v6"></path>
			</svg>
		),
		[],
	);

	return (
		<>
			<button type="button" className="btn-constrast" onClick={openDialog}>
				{plusIcon}
			</button>
			<dialog className="form_create" ref={dialogRef}>
				{createAlert && (
					<Alert severity={createAlert.severity} variant="filled" onClose={() => setCreateAlert(null)} sx={{ mb: 2 }}>
						{createAlert.message}
					</Alert>
				)}
				<form onSubmit={handleSubmit}>
					<label htmlFor={`${baseId}-img-url`}>Image URL:</label>
					<input
						type="text"
						name="url_image_form_link"
						id={`${baseId}-img-url`}
						placeholder="URL of the image for this link"
					/>

					<label htmlFor={`${baseId}-title`}>Title:</label>
					<input
						type="text"
						name="title_form_link"
						id={`${baseId}-title`}
						placeholder="Title of the link"
					/>

					<label htmlFor={`${baseId}-url`}>URL:</label>
					<input
						type="text"
						name="url_form_link"
						id={`${baseId}-url`}
						placeholder="Link you want to share"
					/>

					<label htmlFor={`${baseId}-position`}>Position:</label>
					<input
						type="number"
						min={0}
						name="position_form_link"
						id={`${baseId}-position`}
						placeholder="Order in the list"
					/>

					<input
						className="btn-constrast"
						type="button"
						value="Cancel"
						onClick={closeDialog}
					/>
					<input className="btn-constrast" type="submit" value="Create" />
				</form>
			</dialog>
		</>
	);
});

export const FormDeleteLink = React.memo(function FormDeleteLink({ linkId }) {
	let dialogRef = useRef(null);
	const baseId = useId();
	const [deleteAlert, setDeleteAlert] = useState(null);
	const showDeleteAlert = (severity, message) => {
		setDeleteAlert({ severity, message });
		setTimeout(() => setDeleteAlert(null), 3000);
	};
	function openDialog() {
		dialogRef.current?.showModal();
	}
	function closeDialog() {
		dialogRef.current?.close();
	}

	const handleDelete = async () => {
		try {
			const res = await fetch(`/yourtree/api/link/${linkId}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${getToken()}`,
				},
			});
			if (res.ok) {
				showDeleteAlert('success', 'Link eliminado.');
				setTimeout(() => window.location.reload(), 1000);
			} else {
				console.error("Failed to delete link");
				showDeleteAlert('error', 'No se pudo eliminar el link.');
			}
		} catch (e) {
			console.error(e);
			showDeleteAlert('error', 'Error al eliminar el link.');
		}
	};

	const trashIcon = useMemo(
		() => (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="icon icon-tabler icon-tabler-trash"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
				<path d="M4 7l16 0"></path>
				<path d="M10 11l0 6"></path>
				<path d="M14 11l0 6"></path>
				<path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
				<path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
			</svg>
		),
		[],
	);

	return (
		<>
			<button type="button" className="btn-constrast" onClick={openDialog}>
				{trashIcon}
			</button>
			<dialog className="form_delete" data-link-id={linkId} ref={dialogRef}>
				{deleteAlert && (
					<Alert severity={deleteAlert.severity} variant="filled" onClose={() => setDeleteAlert(null)} sx={{ mb: 2 }}>
						{deleteAlert.message}
					</Alert>
				)}
				<button className="btn-constrast" type="button" onClick={closeDialog}>
					cancel
				</button>
				<button className="btn-constrast" type="button" onClick={handleDelete}>
					delete
				</button>
			</dialog>
		</>
	);
});

export const FormUploadImage = React.memo(function FormUploadImage({ onFileSelect, onDeleteImage }) {
	const dialogRef = useRef(null); // referencia que usamos para dialogo que se mostrara
	const [isOpen, setIsOpen] = useState(false);
	const baseId = useId();

	// Estados para el Modal de Recortar Imagen
	const [cropImageSrc, setCropImageSrc] = useState(null);
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
	const [showCropper, setShowCropper] = useState(false);

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.addEventListener("load", () => {
				setCropImageSrc(reader.result);
				setShowCropper(true);
			});
			reader.readAsDataURL(file);
			e.target.value = null; // reset input
		}
	};

	const onCropComplete = (croppedArea, croppedAreaPixels) => {
		setCroppedAreaPixels(croppedAreaPixels);
	};

	const confirmCrop = async () => {
		try {
			const croppedImageBlob = await getCroppedImg(
				cropImageSrc,
				croppedAreaPixels
			);
			const croppedFile = new File([croppedImageBlob], "profile_photo.png", { type: "image/png" });

			if (onFileSelect) onFileSelect(croppedFile);
			setShowCropper(false);
		} catch (e) {
			console.error(e);
		}
	};

	const cancelCrop = () => {
		setShowCropper(false);
		setCropImageSrc(null);
	};

	const handleDeleteClick = () => {
		if (onDeleteImage) onDeleteImage();
	};

	return (
		<>
			<div className="picture-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
				<strong style={{ fontSize: '14px', color: 'var(--text)' }}>Profile picture:</strong>
				<div className="picture-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
					<label htmlFor={`${baseId}-profile_photo`} className="custom-file-upload">
						<span>Upload</span>
					</label>
					<input
						type="file"
						name="profile_photo"
						id={`${baseId}-profile_photo`}
						onChange={handleFileChange}
						accept=".webp, .jpg, .jpeg, .png"
						style={{ display: 'none' }}
					/>

					<button type="button" className="btn-edit-profile btn-delete" onClick={handleDeleteClick}>
						Remove
					</button>
				</div>
			</div>

			{/* Fondo oscuro y ventana del recortador */}
			{showCropper && (
				<div className="cropper-modal" style={{ zIndex: 9999 }}>
					<div className="cropper-modal-content">
						<h3>Crop Profile Picture</h3>
						<div className="cropper-container" style={{ maxWidth: '350px', margin: '0 auto' }}>
							<Cropper
								image={cropImageSrc}
								crop={crop}
								zoom={zoom}
								aspect={1}
								cropShape="round"
								showGrid={false}
								onCropChange={setCrop}
								onCropComplete={onCropComplete}
								onZoomChange={setZoom}
							/>
						</div>
						<div className="cropper-controls">
							<input
								type="range"
								value={zoom}
								min={1}
								max={3}
								step={0.1}
								aria-labelledby="Zoom"
								onChange={(e) => setZoom(e.target.value)}
								className="zoom-range"
							/>
						</div>
						<div className="cropper-buttons">
							<button type="button" onClick={cancelCrop} className="btn-edit-profile cancel-crop">Cancel</button>
							<button type="button" onClick={confirmCrop} className="btn-edit-profile confirm-crop">Confirm</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
});

export const FormCodeVerification = React.memo(function FormCodeVerification() {
	const navigate = useNavigate();
	const { isLogged, isVerify } = useAuth();
	const user = getUser();
	const status = user ? user.status : null;
	const username = user ? user.username : null;

	useEffect(() => {
		// console.log(isLogged, isVerify);
		// console.log(status);

		if (status === "active") {
			// console.log(status);
		}
	}, [isVerify, isLogged, status]);

	const [code, setCode] = useState("");
	const [timeLeft, setTimeLeft] = useState(0);

	useEffect(() => {
		if (timeLeft > 0) {
			const timerId = setTimeout(() => {
				setTimeLeft(timeLeft - 1);
			}, 1000);
			return () => clearTimeout(timerId);
		}
	}, [timeLeft]);

	const handleResend = () => {
		if (timeLeft > 0) return;
		setTimeLeft(30);

		fetch("/yourtree/api/resend-code", {
			method: "POST",
			headers: { "Content-Type": "Application/json" },
			body: JSON.stringify({ username }),
		})
			.then((result) => result.json())
			.then((data) => {
				// console.log(data);
			})
			.catch((err) => console.error(err));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Lógica de verificación
		// console.log("Código:", code);
		fetch("/yourtree/api/verify-code", {
			method: "POST",
			headers: { "Content-Type": "Application/json" },
			body: JSON.stringify({
				code,
				username,
			}),
		})
			.then((result) => result.json())
			.then((data) => {
				// console.log(data);
				if (data.verificated) {
					// Actualizar cookie user.status a active
					let userCookie = getUser();
					if (userCookie) {
						userCookie.status = "active";
						cookie.set("user", JSON.stringify(userCookie));
					}
					window.location.reload();
				}
			});
	};
	return (
		<>
			{isLogged && status === "pending" && (
				<div className="modal-overlay">
					<form method="post" onSubmit={handleSubmit} className="verify_code">
						<label htmlFor="input_code">Verify Code</label>
						<VerificationInput
							id="input_code"
							type="number"
							fields={6}
							value={code}
							onChange={setCode}
						/>
						<div className="verify_actions" style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center' }}>
							<input
								type="button"
								value="Log out"
								onClick={() => {
									navigate("/Log_out");
								}}
							/>
							<input
								type="button"
								value={timeLeft > 0 ? `Resend (${timeLeft}s)` : "Resend Code"}
								onClick={handleResend}
								disabled={timeLeft > 0}
							/>
							<input type="submit" value="Verify code" />
						</div>
					</form>
				</div>
			)}
		</>
	);
});
