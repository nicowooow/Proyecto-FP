import { useEffect, useState } from "react";
import '../assets/css/ads.css';

const AdsComponent = ({ inline = false, centered = false, styleType = 'forum' }) => {
    const [showFallback, setShowFallback] = useState(false);
    const AD_CLIENT = import.meta.env.VITE_AD_CLIENT;

    useEffect(() => {
        if (!showFallback) {
            try {
                // Intentamos cargar el anuncio
                (window.adsbygoogle = window.adsbygoogle || []).push({});

                // Creamos un pequeño intervalo para revisar si Google nos dejó vacíos
                const checkInterval = setInterval(() => {
                    const adElement = document.querySelector(`ins[data-ad-client="${AD_CLIENT}"]`);

                    // Si Google marca el anuncio como 'unfilled', activamos el fallback manualmente
                    if (adElement && adElement.getAttribute('data-ad-status') === 'unfilled') {
                        setShowFallback(true);
                        clearInterval(checkInterval);
                    }
                }, 1000);

                // Limpiamos el intervalo tras 5 segundos para no gastar recursos
                setTimeout(() => clearInterval(checkInterval), 5000);

            } catch (e) {
                console.error("Adsbygoogle error:", e);
                setShowFallback(true);
            }
        }
    }, [showFallback, AD_CLIENT]);

    const wrapperClass = centered ? 'ads_centered_wrapper' : inline ? 'ads_inline_wrapper' : 'ads_container';
    const cardClass = `ads_card ${styleType === 'profile' ? 'profile_card_mini' : 'forum_card'} ${centered ? 'ad_centered_card' : 'ad_inline_card'}`;

    const toGithub = () => {
        window.location.href = "https://github.com/nicowooow"
    }
    return (
        <div className={wrapperClass} aria-label="Anuncio de Google" className="col-span-full">
            <article className={cardClass}>
                {showFallback ? (
                    <>
                        <div className="ad_label">Ad</div>
                        <h3 className="ad_title">Sponsored Content</h3>
                        <p className="ad_copy">
                            Looking for more visualizations? Get in touch.
                        </p>
                        <div className="ad_action_group">
                            <button type="button" className="ad_button" onClick={toGithub}>My GitHub</button>
                            <span className="ad_note">Central ad placement until enough items are available.</span>
                        </div>

                    </>
                ) : (
                    <ins className="adsbygoogle"
                        style={{
                            display: 'block',
                            minHeight: '250px', // Altura mínima obligatoria
                            width: '100%'
                        }}
                        data-ad-format="fluid"
                        data-ad-layout-key="-fb+5w+4e-db+86"
                        data-ad-client={AD_CLIENT}
                        data-ad-slot="6567859106">
                    </ins>
                )}
            </article>
        </div >
    );
};

export default AdsComponent;