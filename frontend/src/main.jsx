import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./components/auth.jsx";
import { Helmet, HelmetProvider } from "react-helmet-async";

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
		'/forums': 'YourTree Forums',
		'/signin': 'Sign In - YourTree',
		'/signup': 'Sign Up - YourTree',
		'/profile/:username': 'Profile - YourTree'
	};

	const descriptions = {
		'/': 'YourTree is a link in bio & community platform. Share your profile, connect with others, and build your online presence.',
		'/forums': 'Join YourTree forums to discuss and engage with our community members.',
		'/signin': 'Sign in to your YourTree account to access your profile and community features.',
		'/signup': 'Create your YourTree account and start sharing your profile with the world.',
		'/profile/:username': 'Check out this user profile on YourTree.'
	};

	return (
		<>
			<Helmet>
				<html lang="en" />
				<title>{titles[location.pathname] || 'YourTree'}</title>
				<meta name="description" content={descriptions[location.pathname] || 'YourTree - Your link in bio & community platform'} />
				<meta name="theme-color" content="#ffffff" />
				<meta property="og:title" content={titles[location.pathname] || 'YourTree'} />
				<meta property="og:description" content={descriptions[location.pathname] || 'YourTree - Your link in bio & community platform'} />
				<meta property="og:type" content="website" />
				<meta property="og:url" content={`https://demo.treedlink.com${location.pathname}`} />
				<meta property="og:image" content="https://demo.treedlink.com/web-app-manifest-512x512.png" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={titles[location.pathname] || 'YourTree'} />
				<meta name="twitter:description" content={descriptions[location.pathname] || 'YourTree - Your link in bio & community platform'} />
				<meta name="twitter:image" content="https://demo.treedlink.com/web-app-manifest-512x512.png" />
				<link rel="canonical" href={`https://demo.treedlink.com${location.pathname}`} />
				<meta name="robots" content="index, follow" />
			</Helmet>
			<AnalyticsTracker />
			{!hideHeader && <Header />}

			<Suspense fallback={
				<div style={{
					minHeight: 200,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}>Cargando...</div >
			}></Suspense >
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/YourTree" element={<YourTree />} />
				<Route path="/YourTree/:username" element={<YourTreeUser />} />
				<Route path="/" element={<Home />} />
				<Route path="/Forums" element={<Forums />} />
				<Route path="/Forums/:forumId" element={<Forums />} />
				<Route path="/Recent_Pages" element={<Recent_Pages />} />
				<Route path="/Profile" element={<Profile />} />
				{/* <Route path="/profile/:username" element={<Profile />} /> */}
				<Route path="/Log_out" element={<Log_out />} />
				<Route path="/Sign_in" element={<Sign_in />} />
				<Route path="/Sign_up" element={<Sign_up />} />
				<Route path="/Forgot_Password" element={<Forgot_Password />} />
				<Route path="/Reset_Password" element={<Reset_Password />} />
				<Route path="/*" element={<NotFound />} />
				<Route path="/404" element={<NotFound />} />
			</Routes>
			<BuyMeACoffee />
		</>
	);
}

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<HelmetProvider>
			<AuthProvider>
				<BrowserRouter>
					<AppWithHeader />
				</BrowserRouter>
			</AuthProvider>
		</HelmetProvider>
	</StrictMode>,
);
