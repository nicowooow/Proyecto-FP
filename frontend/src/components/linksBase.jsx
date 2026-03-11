import React, { useMemo, useEffect } from "react";
import "./../assets/css/links_base.css";
import profile_default from "./../assets/images/profile_default.svg";
import logo from "./../assets/YourTree.svg";
import { useNavigate } from "react-router-dom";
import { ShareIcon } from "./../components/icons.jsx";

export const PutLinks = React.memo(({ username, children, ...rest }) => {
	let [links, setLinks] = React.useState([]);
	let [profileId, setProfileId] = React.useState(null);

	useEffect(() => {
		async function fetchLinks() {
			try {
				let profileRes = await fetch(`/yourtree/api/profile/${username}`);
				if (!profileRes.ok) return;
				let profile = await profileRes.json();

				if (profile.id) {
					setProfileId(profile.id);
					let linksRes = await fetch(`/yourtree/api/links/${profile.id}`);
					if (linksRes.ok) {
						let data = await linksRes.json();
						setLinks(data);
					}
				}
			} catch (e) {
				console.error("Error fetching links:", e);
			}
		}
		if (username) fetchLinks();
	}, [username]);

	const list_links = useMemo(
		() =>
			(links || []).map((link, i) => {
				const actions = React.Children.map(children, (child) =>
					React.isValidElement(child)
						? React.cloneElement(child, { linkId: link.id, profileId })
						: child,
				);
				return (
					<li key={link.id ?? i}>
						<section className="links">
							<a href={link.url ?? "#"}>
								{link.title ?? link.name ?? "name link"}
							</a>
						</section>
						<section className="links_actions">{actions}</section>
					</li>
				);
			}),
		[links, children],
	);

	return <ul>{list_links}</ul>;
});

export const Links_base = React.memo(function Links_base({
	optionCheck,
	usernameUser,
	descriptionInput,
	blurInput,
	imageUrl,
}) {
	//// console.log(username_input);

	// la opcion de visualizacion
	let option = Number(optionCheck);
	let username = usernameUser;
	let description = descriptionInput;
	// el formato en el que se mostrar
	// aqui ira la imagen de perfil del usuario
	let urlImage = imageUrl || profile_default;
	// aqui ira el tipo que escojio, el cual se dara su css respectivo
	let headOption;
	//// console.log(typeof(option),option)
	//// console.log(usernameUser);

	if (option === 0) headOption = "layout0";
	else if (option === 1) headOption = "layout1";
	else if (option === 2) headOption = "layout2";
	else headOption = "layout3";

	const linkHeadOption = useMemo(() => {
		if (option === 1) {
			return (
				<>
					<img src={urlImage} alt="user image" />
					<h2>@{username}</h2>
					<p>{description}</p>
				</>
			);
		} else if (option === 2) {
			return (
				<>
					<h2>@{username}</h2>
					<img src={urlImage} alt="user image" />
					<p>{description}</p>
				</>
			);
		} else if (option === 3) {
			return (
				<>
					<h2>@{username}</h2>
					<img src={urlImage} alt="user image" />
					<p>{description}</p>
				</>
			);
		}
		return (
			<>
				<div>
					<img src={urlImage} alt="user image" />
				</div>
				<div>
					<h2>@{username}</h2>
					<p>{description}</p>
				</div>
			</>
		);
	}, [option, username, description, urlImage]);

	return (
		<section className="link_base">
			<section className={`link_head ${headOption}`}>{linkHeadOption}</section>
			<section className="link_body">
				<PutLinks username={username} />
			</section>
		</section>
	);
});

export const General_tree = React.memo(function General_tree({
	username,
	option,
	descrition,
	imageUrl,
	...rest
}) {
	const navegate = useNavigate();
	const previous_page = () => {
		navegate(-1);
	};
	const usernameSuffix = useMemo(
		() => (username != "you" ? ` of ${username}` : ""),
		[username],
	);
	descrition = descrition === "" ? `Hello, i'm new here` : descrition;
	//// console.log("General_tree username:", username);
	//// console.log(username, option, descrition);

	// biome-ignore format: necesito que los svg no exparsan atributos
	return (
		<section
			id="link"
		>

			<section className="header">
				<button className="pre_page" onClick={previous_page}>
					<svg xmlns="www.w3.org" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
						<path d="m15 18-6-6 6-6" />
					</svg>
				</button>
				<h1>YourTree{usernameSuffix}</h1>
				<div className="img_logo">
					<a href="/">
						<img src={logo} alt="logo YourTree" />
					</a>
				</div>
			</section>
			<Links_base
				optionCheck={option}
				usernameUser={username}
				descriptionInput={descrition}
				imageUrl={imageUrl}
			/>
			<ShareIcon username={username} />
		</section>
	);
});
