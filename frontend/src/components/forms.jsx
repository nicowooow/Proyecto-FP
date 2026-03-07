import React, { useRef, useEffect, useState, useMemo, useId } from "react";
import VerificationInput from "react-verification-input";
import { useNavigate } from "react-router-dom";
import "./../assets/css/forms.css";
import { useAuth } from "./auth";
import { getUser } from "./token";

const getLink = async (linkId) => {
	try {
		const response = await fetch(`yourtree/api/link/${linkId}`);
		const data = await response.json();
		// console.log(data[0]);
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
	const [isOpen, setIsOpen] = useState(false); // estado para cuando este abierto el dialog
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
		const title = e.target.title_form_link.value;
		const url = e.target.url_form_link.value;
		const url_image = e.target.url_image_form_link.value;
		const position = e.target.position_form_link.value;
		try {
			const res = await fetch(`/yourtree/api/link/${linkId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				},
				body: JSON.stringify({
					title,
					url,
					url_image,
					position,
					is_visible: true,
				}),
			});
			if (res.ok) {
				window.location.reload();
			} else {
				console.error("Failed to update link");
			}
		} catch (error) {
			console.error(error);
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

	// console.log(url, urlImage, position, title);

	return (
		<>
			<button type="button" className="btn-constrast" onClick={openDialog}>
				{editIcon}
			</button>
			<dialog className="form_update" data-link-id={linkId} ref={dialogRef}>
				<form data-link-id={linkId} onSubmit={handleSubmit}>
					<label htmlFor={`${baseId}-img-url`}>image url : </label>
					<input
						type="text"
						name="url_image_form_link"
						id={`${baseId}-img-url`}
						placeholder={urlImage}
					/>

					<label htmlFor={`${baseId}-title`}>title : </label>
					<input
						type="text"
						name="title_form_link"
						id={`${baseId}-title`}
						placeholder={title}
					/>

					<label htmlFor={`${baseId}-url`}>url : </label>
					<input
						type="text"
						name="url_form_link"
						id={`${baseId}-url`}
						placeholder={url}
					/>

					<label htmlFor={`${baseId}-position`}>position : </label>
					<input
						type="number"
						min={0}
						name="position_form_link"
						id={`${baseId}-position`}
						placeholder={position}
					/>

					<input
						className="btn-constrast"
						type="button"
						value="cancel"
						onClick={closeDialog}
					/>
					<input className="btn-constrast" type="submit" value="update" />
				</form>
			</dialog>
		</>
	);
});

export const FormCreateLink = React.memo(function FormCreateLink({ username }) {
	const dialogRef = useRef(null);
	const baseId = useId();
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
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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
				window.location.reload();
			} else {
				console.error("Failed to create link");
			}
		} catch (error) {
			console.error(error);
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
				<form onSubmit={handleSubmit}>
					<label htmlFor={`${baseId}-img-url`}>image url : </label>
					<input
						type="text"
						name="url_image_form_link"
						id={`${baseId}-img-url`}
						placeholder="URL of the image for this link"
					/>

					<label htmlFor={`${baseId}-title`}>title : </label>
					<input
						type="text"
						name="title_form_link"
						id={`${baseId}-title`}
						placeholder="Title of the link"
					/>

					<label htmlFor={`${baseId}-url`}>url : </label>
					<input
						type="text"
						name="url_form_link"
						id={`${baseId}-url`}
						placeholder="Link you want to share"
					/>

					<label htmlFor={`${baseId}-position`}>position : </label>
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
						value="cancel"
						onClick={closeDialog}
					/>
					<input className="btn-constrast" type="submit" value="create" />
				</form>
			</dialog>
		</>
	);
});

export const FormDeleteLink = React.memo(function FormDeleteLink({ linkId }) {
	let dialogRef = useRef(null);
	const baseId = useId();
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
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				},
			});
			if (res.ok) {
				window.location.reload();
			} else {
				console.error("Failed to delete link");
			}
		} catch (e) {
			console.error(e);
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

export const FormUploadImage = React.memo(function FormUploadImage() {
	const dialogRef = useRef(null); // referencia que usamos para dialogo que se mostrara
	const [isOpen, setIsOpen] = useState(false);
	const fileInputRef = useRef(null);
	const baseId = useId();

	const openDialog = () => setIsOpen(true);
	const closeDialog = () => setIsOpen(false);

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			// Preview o upload
			console.log("File:", file.name);
			// Tu lógica upload
		}
		closeDialog();
	};

	useEffect(() => {
		if (isOpen && dialogRef.current) dialogRef.current.showModal();
		else if (!isOpen && dialogRef.current) dialogRef.current.close();
	}, [isOpen]);

	return (
		<>
			<strong>profile image : </strong>
			<button type="button" className="btn-constrast">
				delete
			</button>
			<button type="button" className="btn-constrast" onClick={openDialog}>
				upload
			</button>
			<dialog className="upload_photo" ref={dialogRef}>
				<label htmlFor={`${baseId}-profile_photo`}>profile photo</label>
				<input
					type="file"
					name="profile_photo"
					id={`${baseId}-profile_photo`}
					onChange={handleFileChange}
					accept=".webp, .jpg, .jpeg, .png"
				/>

				<button type="button" onClick={closeDialog}>
					Cancel
				</button>
			</dialog>
		</>
	);
});

export const FormCodeVerification = React.memo(function FormCodeVerification() {
	const navigate = useNavigate();
	const { isLogged, isVerify } = useAuth();
	const { status, username } = getUser();

	useEffect(() => {
		console.log(isLogged, isVerify);
		if (status === "active") {
			console.log(status);
		}
	}, [isVerify, isLogged, status]);

	const [code, setCode] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		// Lógica de verificación
		console.log("Código:", code);
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
				console.log(data);
			});
	};
	return (
		<>
			{isLogged && (
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
						<input
							type="button"
							value="Log out"
							onClick={() => {
								navigate("/Log_out");
							}}
						/>
						<input type="submit" value="Verify code" />
					</form>
				</div>
			)}
		</>
	);
});
