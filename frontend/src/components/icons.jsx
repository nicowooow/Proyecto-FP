import "./../assets/css/icons.css";
import { useState } from "react";
export const ShareIcon = ({ username }) => {
	const [copied, setCopied] = useState(false);
	const handleCopy = async () => {
		const link = `https://demo.treedlink.com/YourTree/${username}`;
		try {
			// console.log(username);
			// console.log(link);

			await navigator.clipboard.writeText(link);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			// console.log(error);
		}
	};
	// biome-ignore format: juntar en uno solo los svg
	return (
		<section className="share" onClick={handleCopy}>
			<svg className="share_icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000" >
				<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
				<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" ></g>
				<g id="SVGRepo_iconCarrier">
					<path
						d="M8.68439 10.6578L15.3124 7.34378M15.3156 16.6578L8.69379 13.3469M21 6C21 7.65685 19.6569 9 18 9C16.3431 9 15 7.65685 15 6C15 4.34315 16.3431 3 18 3C19.6569 3 21 4.34315 21 6ZM9 12C9 13.6569 7.65685 15 6 15C4.34315 15 3 13.6569 3 12C3 10.3431 4.34315 9 6 9C7.65685 9 9 10.3431 9 12ZM21 18C21 19.6569 19.6569 21 18 21C16.3431 21 15 19.6569 15 18C15 16.3431 16.3431 15 18 15C19.6569 15 21 16.3431 21 18Z"
						stroke="var(--color-principal-dark)"
						strokeWidth="1.5"
					></path>
				</g>
			</svg>
			{copied && <span className="copied-text">Copied</span>}
		</section>
	);
};
