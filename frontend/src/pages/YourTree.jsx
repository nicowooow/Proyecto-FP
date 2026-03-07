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

function YourTree() {
	// si no esta loggeado lo manda al incio
	const auth = useAuth();
	const navigate = useNavigate();
	const [layout, setLayout] = useState("3");
	const [description, setDescription] = useState("");

	useEffect(() => {
		// console.log(auth.isLogged, auth.loading);

		if (!auth.isLogged && !auth.loading) {
			navigate("/Sign_in");
		}
		// console.log(auth.isVerify);
	}, [auth.isLogged, auth.loading, navigate]);


	if (!auth.isLogged) {
		return null;
	}

	const cookieUser = JSON.parse(cookies.get("user"));
	const currentUsername = cookieUser.username;
	// console.log('cookie',cookieUser);
	// console.log('nombre',currentUsername);

	// console.log("YourTree username:", username);

	return (
		<main id="main_yourtree">
			<section id="general_area">
				<section id="general_settings">
					<form className="settings" method="POST">
						<h1>Settings View</h1>
						<Collapsible title="head" section="style_view">
							{/* <h3>Head Style</h3> */}
							<div className="layouts">
								<div>
									<label htmlFor="layout0">view 1</label>
									<input
										type="radio"
										id="layout0"
										name="layout"
										value="0"
										checked={layout === "0"}
										onChange={(e) => {
											setLayout(e.currentTarget.value);
										}}
									/>
								</div>
								<div>
									<label htmlFor="layout1">view 2</label>
									<input
										type="radio"
										id="layout1"
										name="layout"
										value="1"
										checked={layout === "1"}
										onChange={(e) => {
											setLayout(e.currentTarget.value);
										}}
									/>
								</div>
								<div>
									<label htmlFor="layout2">view 3</label>
									<input
										type="radio"
										id="layout2"
										name="layout"
										value="2"
										checked={layout === "2"}
										onChange={(e) => {
											setLayout(e.currentTarget.value);
										}}
									/>
								</div>
								<div>
									<label htmlFor="layout3">view 4</label>
									<input
										type="radio"
										id="layout3"
										name="layout"
										value="3"
										checked={layout === "3"}
										onChange={(e) => {
											setLayout(e.currentTarget.value);
										}}
									/>
								</div>
							</div>
							<div>
								<FormUploadImage />
							</div>
							<div>
								<label htmlFor="description">
									<strong>description : </strong>
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
						<input type="button" value="save" className="btn-constrast" />
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
					<section className="settings">
						<Collapsible title="" section=""></Collapsible>
					</section>
				</section>
				<section id="pre_view">
					<General_tree
						username={currentUsername}
						option={layout}
						descrition={description}
					/>
				</section>
			</section>
		</main>
	);
}
export default YourTree;
