import { useEffect } from "react";
import { useAuth } from "../components/auth";
import { useNavigate } from "react-router-dom";
function Log_out() {
    const navigate = useNavigate();
	let { logout } = useAuth();

	useEffect(() => {
		logout();
        navigate("/")
	}, []);
	return (
		<main>
			<h1>Log out</h1>
		</main>
	);
}

export default Log_out;
