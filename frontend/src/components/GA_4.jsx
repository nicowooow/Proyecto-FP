import ReactGA from "react-ga4";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const GA_ID = import.meta.env.VITE_GA_ID;
ReactGA.initialize(GA_ID);


const AnalyticsTracker = () => {
    const location = useLocation();

    useEffect(() => {
        // Registra la visita cada vez que cambia la URL
        ReactGA.send({
            hitType: "pageview",
            page: location.pathname + location.search
        });
    }, [location]);

    return null; // Este componente no renderiza nada visual
};

export default AnalyticsTracker;