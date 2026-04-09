import { useEffect, useState } from "react";
import '../assets/css/ads.css';

const AdsComponent = ({ inline = false, centered = false, styleType = 'forum' }) => {
    const [showFallback, setShowFallback] = useState(false);
    const AD_CLIENT = import.meta.env.VITE_AD_CLIENT;
    useEffect(() => {
        const scriptId = 'adsbygoogle-script';
        const scriptSrc = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`;

        // Si el script ya fue cargado, no hacer nada
        if (window.adsbyGoogleLoaded) {
            return;
        }

        // Cargar el script de Google AdSense solo una vez
        const script = document.createElement('script');
        script.async = true;
        script.src = scriptSrc;
        script.crossOrigin = 'anonymous';

        script.onerror = () => {
            console.warn('Google AdSense script no pudo cargar, mostrando fallback');
            setShowFallback(true);
        };

        document.body.appendChild(script);
        window.adsbyGoogleLoaded = true;

        // Timeout: si no carga en 5s, mostrar fallback
        setTimeout(() => {
            if (!window.adsbygoogle) {
                setShowFallback(true);
            }
        }, 5000);
    }, [AD_CLIENT]);

    const wrapperClass = centered ? 'ads_centered_wrapper' : inline ? 'ads_inline_wrapper' : 'ads_container';
    const cardClass = `ads_card ${styleType === 'profile' ? 'profile_card_mini' : 'forum_card'} ${centered ? 'ad_centered_card' : 'ad_inline_card'}`;

    return (
        <div className={wrapperClass} aria-label="Anuncio de Google">
            <article className={cardClass}>
                {showFallback ? (
                    <>
                        <div className="ad_label">Anuncio</div>
                        <h3 className="ad_title">Contenido patrocinado</h3>
                        <p className="ad_copy">
                            Un anuncio integrado en el mismo estilo que tus tarjetas de foro y páginas recientes.
                        </p>
                        <div className="ad_action_group">
                            <button type="button" className="ad_button">Ver oferta</button>
                            <span className="ad_note">Anuncio en posición central hasta que haya suficientes elementos.</span>
                        </div>
                    </>
                ) : (
                    <ins className="adsbygoogle"
                        style={{ display: 'block' }}
                        data-ad-format="fluid"
                        data-ad-layout-key="-fb+5w+4e-db+86"
                        data-ad-client={AD_CLIENT}
                        data-ad-slot="6567859106"></ins>
                )}
            </article>
        </div>
    );
};

export default AdsComponent;