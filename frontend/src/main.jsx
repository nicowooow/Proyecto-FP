import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./components/auth.jsx";

//import "./assets/css/index.css";

import Header from "./components/header";
import YourTree from "./pages/YourTree.jsx";
import YourTreeUser from "./pages/YourTreeUser.jsx";
import Home from "./pages/Home.jsx";
import Forums from "./pages/Forums.jsx";
import Sign_in from "./pages/Sign_in.jsx";
import Sign_up from "./pages/Sign_up.jsx";
import Log_out from "./pages/Log_out.jsx";
import Recent_Pages from "./pages/Recent_Pages.jsx";
import AnalyticsTracker from "./components/GA_4.jsx";
import NotFound from "./pages/NotFound.jsx";

function AppWithHeader() {
	const location = useLocation();

	// true si la ruta es /YourTree/:username (empieza por /YourTree/ y tiene algo más)
	const hideHeader = /^\/[yY]our[tT]ree\/[^/]+$/.test(location.pathname);

	return (
		<>
			<AnalyticsTracker />
			{!hideHeader && <Header />}
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/YourTree" element={<YourTree />} />
				<Route path="/YourTree/:username" element={<YourTreeUser />} />
				<Route path="/Home" element={<Home />} />
				<Route path="/Forums" element={<Forums />} />
				<Route path="/Forums/:forumId" element={<Forums />} />
				<Route path="/Recent_Pages" element={<Recent_Pages />} />

				<Route path="/Log_out" element={<Log_out />} />
				<Route path="/Sign_in" element={<Sign_in />} />
				<Route path="/Sign_up" element={<Sign_up />} />
				<Route path="*" element={<NotFound />} />
				<Route path="/404" element={<NotFound />} />
			</Routes>
		</>
	);
}

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<AuthProvider>
			<BrowserRouter>
				<AppWithHeader />
			</BrowserRouter>
		</AuthProvider>
	</StrictMode>,
);
