import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./components/auth.jsx";
import { HelmetProvider } from "react-helmet-async";

//import "./assets/css/index.css";
import Header from "./components/header";

// paginas pesadas, se cargan solo cuando se necesitan
const YourTree = lazy(() => (import("./pages/YourTree.jsx")));
const YourTreeUser = lazy(() => (import("./pages/YourTreeUser.jsx")));
const Forums = lazy(() => (import("./pages/Forums.jsx")));
const Recent_Pages = lazy(() => (import("./pages/Recent_Pages.jsx")));
const Profile = lazy(() => (import("./pages/Profile.jsx")));
const Forgot_Password = lazy(() => (import("./pages/Forgot_Password.jsx")));
const Reset_Password = lazy(() => (import("./pages/Reset_Password.jsx")));


// paginas no pesadas, se cargan al inicio
import Home from "./pages/Home.jsx";
import Sign_in from "./pages/Sign_in.jsx";
import Sign_up from "./pages/Sign_up.jsx";
import Log_out from "./pages/Log_out.jsx";
import AnalyticsTracker from "./components/GA_4.jsx";
import NotFound from "./pages/NotFound.jsx";
import BuyMeACoffee from "./components/BuyMeACoffee.jsx";

import './assets/css/base.css';
import './assets/css/background_dark.css';
import './assets/css/background_light.css';

function AppWithHeader() {
	const location = useLocation();

	// true si la ruta es /YourTree/:username (empieza por /YourTree/ y tiene algo más)
	const hideHeader = /^\/[yY]our[tT]ree\/[^/]+$/.test(location.pathname);
	const titles = {
		'/': 'YourTree - Link in Bio & Community',
		'/Forums': 'YourTree Forums',
		'/Signin': 'Sign In - YourTree',
		'/Signup': 'Sign Up - YourTree',
		'/Profile/:username': 'Profile - YourTree'
	};

	const descriptions = {
		'/': 'YourTree is a link in bio & community platform. Share your profile, connect with others, and build your online presence.',
		'/Forums': 'Join YourTree forums to discuss and engage with our community members.',
		'/Sign_in': 'Sign in to your YourTree account to access your profile and community features.',
		'/Sign_up': 'Create your YourTree account and start sharing your profile with the world.',
		'/Profile/:username': 'Check out this user profile on YourTree.'
	};

	return (
		<>
			<AnalyticsTracker />
			{!hideHeader && <Header />}

			<Suspense fallback={
				<div style={{
					minHeight: 200,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}>Cargando...</div >
			}>

				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/YourTree" element={<YourTree />} />
					<Route path="/YourTree/:username" element={<YourTreeUser />} />
					<Route path="/Forums" element={<Forums />} />
					<Route path="/Forums/:forumId" element={<Forums />} />
					<Route path="/Recent_Pages" element={<Recent_Pages />} />
					<Route path="/Profile" element={<Profile />} />
					<Route path="/Log_out" element={<Log_out />} />
					<Route path="/Sign_in" element={<Sign_in />} />
					<Route path="/Sign_up" element={<Sign_up />} />
					<Route path="/Forgot_Password" element={<Forgot_Password />} />
					<Route path="/Reset_Password" element={<Reset_Password />} />
					<Route path="/404" element={<NotFound />} />
					<Route path="/*" element={<NotFound />} />
				</Routes>
				<BuyMeACoffee />
			</Suspense >
		</>
	);
}

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<HelmetProvider>
			<BrowserRouter>
				<AuthProvider>
					<AppWithHeader />
				</AuthProvider>
			</BrowserRouter>
		</HelmetProvider>
	</StrictMode>,
);
