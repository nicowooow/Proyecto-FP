import React, { useRef, useEffect, useState, useMemo, useId } from "react";

import "./../assets/css/forms.css";

export const FormUpdateLink = React.memo(function FormUpdateLink({
	element,
	display,
	linkId,
	profileId,
}) {
	const dialogRef = useRef(null);
	const baseId = useId();
	const [isOpen, setIsOpen] = useState(false); // estado para cuando este abierto el dialog
	const openDialog = () => setIsOpen(true);
	const closeDialog = () => setIsOpen(false);

	useEffect(() => {
		if (isOpen) {
			dialogRef.current?.showModal();
		} else {
			dialogRef.current?.close();
		}
	}, [isOpen]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		try {
			const res = await fetch(`/yourtree/api/link/${linkId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				},
				body: JSON.stringify({
					title: formData.get("title_form_link"),
					url: formData.get("url_form_link"),
					position: Number(formData.get("position_form_link") || 0),
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

	return (
		<>
			<button type="button" className="btn-constrast" onClick={openDialog}>
				{editIcon}
			</button>
			<dialog className="form_update" data-link-id={linkId} ref={dialogRef}>
				<form data-link-id={linkId} onSubmit={handleSubmit}>
					<label htmlFor={`${baseId}-title`}>title : </label>
					<input type="text" name="title_form_link" id={`${baseId}-title`} />

					<label htmlFor={`${baseId}-url`}>url : </label>
					<input type="text" name="url_form_link" id={`${baseId}-url`} />

					<label htmlFor={`${baseId}-position`}>position : </label>
					<input
						type="number"
						min={0}
						name="position_form_link"
						id={`${baseId}-position`}
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
	let dialogRef = useRef(null);
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
					<label htmlFor={`${baseId}-title`}>title : </label>
					<input type="text" name="title_form_link" id={`${baseId}-title`} />

					<label htmlFor={`${baseId}-url`}>url : </label>
					<input type="text" name="url_form_link" id={`${baseId}-url`} />

					<label htmlFor={`${baseId}-position`}>position : </label>
					<input
						type="number"
						min={0}
						name="position_form_link"
						id={`${baseId}-position`}
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
