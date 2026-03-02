// import "./../assets/css/links_base.css";
import "./../assets/css/YourTree.css";
import { useState, useRef, useEffect } from "react"; // el useMemo es para el uso que tiene en memoria
import { General_tree, PutLinks } from "../components/linksBase";
import { useParams,useNavigate} from "react-router-dom";
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
	let auth = useAuth();
	const navigate = useNavigate();
	let { username } = useParams();

	//variables temporales
	let colorTemp = useRef("#f7fbff3b");
	let colorPageTemp = useRef("#f7fbff3b");
	let colorTextTemp = useRef("#7d7d7d");

	// let blurTemp = useRef(25);
	// variables a mandar al back
	let [color, setColor] = useState("#f7fbff3b");
	let [colorPage, setColorPage] = useState("#f7fbff00");
	let [colorText, setColorText] = useState("#7d7d7d");
	let [stylePage, setStylePage] = useState(1);
	let [layout, setLayout] = useState("3");
	let [description, setDescription] = useState("");
	let [blur, setBlur] = useState(25);

	// console.log(color, colorPage); // esto puede consumir mucho
	// console.log(colorText);

	useEffect(() => {
		console.log(username, auth.isLogged, auth.loading);
		
		if (!auth.isLogged && !auth.loading && !username) {
			navigate("/Sign_in");
		}
	}, [auth.isLogged, auth.loading, navigate]);

	if (!auth.isLogged) {
		return null;
	}
	
	let cookieUser = JSON.parse(cookies.get("user"));
	let currentUsername = username || cookieUser.username;
	// console.log(cookieUser);
	// console.log(currentUsername);

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

							<Collapsible title="background " section="style_page">
								<div>
									<h3>which do you prefer?</h3>
									<section className="choose_option">
										<label htmlFor="color">color</label>
										<input
											type="radio"
											name="style_page"
											id="color"
											value={true}
											checked={stylePage === 1}
											onChange={() => setStylePage(1)}
										/>
										<label htmlFor="image">image</label>
										<input
											type="radio"
											name="style_page"
											id="image"
											value={false}
											checked={stylePage === 2}
											onChange={() => setStylePage(2)}
										/>
										<label htmlFor="transparent">transparent</label>
										<input
											type="radio"
											name="style_page"
											id="transparent"
											value={false}
											checked={stylePage === 3}
											onChange={() => {
												setStylePage(3);
												setColorPage("#fff0");
											}}
										/>
									</section>
									<section className="choosed_option">
										{stylePage === 1 ? (
											<HPC
												liveRef={colorPageTemp}
												onCommit={() => setColorPage(colorPageTemp.current)}
											/>
										) : stylePage === 2 ? (
											<>
												<label htmlFor="style_page_image">
													Upload an image :
												</label>
												<input
													type="file"
													name="style_page_image"
													id="style_page_image"
												/>
											</>
										) : (
											""
										)}
									</section>
								</div>
							</Collapsible>

							<Collapsible
								title="background YourTree"
								section="style_background"
							>
								<HAPC
									liveRef={colorTemp}
									onCommit={() => setColor(colorTemp.current)}
								/>
								<div>
									<label htmlFor="back_blur">background blur</label>
									<input
										type="range"
										name="back_blur"
										id="back_blur"
										min="0"
										max="50"
										step="1"
										value={blur}
										onChange={(e) => {
											// blurTemp.current = parseInt(e.target.value);
											setBlur(parseInt(e.target.value));
										}}
										title="Background blur intensity (it don't work with flat color)"
										aria-label="Adjust background blur intensity"
									/>
								</div>
							</Collapsible>

							<Collapsible title="text color" section="style_text">
								<HPC
									liveRef={colorTextTemp}
									onCommit={() => setColorText(colorTextTemp.current)}
								/>
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
						<section className="settings">
							<Collapsible title="public styles" section="style_public">
								<div>
									<label htmlFor="url_style">URL : </label>
									<input
										type="text"
										name="url_style"
										id="url_style"
										placeholder="URL of the style"
									/>
									<input type="submit" value="charge style" />
								</div>
								<div>
									<label htmlFor="title_style">Title : </label>
									<input
										type="text"
										id="title_style"
										placeholder="title from the style"
									/>
									<input type="submit" value="save and share style" />
								</div>
							</Collapsible>
						</section>
					</section>
					<section id="pre_view">
						<General_tree
							username={currentUsername}
							option={layout}
							descrition={description}
							color={color}
							colorPage={colorPage}
							blur={blur}
							textColor={colorText}
						/>
					</section>
				</section>
			</main>
		);
}
export default YourTree;
