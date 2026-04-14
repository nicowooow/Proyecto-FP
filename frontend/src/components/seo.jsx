import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

/**
 * SEO Component - Proporciona metaetiquetas optimizadas para SEO
 * @param {Object} props
 * @param {string} props.title - Título de la página
 * @param {string} props.description - Descripción meta
 * @param {string} props.image - URL de imagen para Open Graph y Twitter
 * @param {string} props.keywords - Palabras clave separadas por comas
 * @param {string} props.author - Autor de la página
 * @param {string} props.type - Tipo de contenido (website, article, profile, etc.)
 * @param {boolean} props.index - Si la página debe ser indexada
 * @param {string} props.canonical - URL canónica
 */
const SEO = ({
  title = "YourTree - Link in Bio & Community",
  description = "YourTree is a link in bio & community platform. Share your profile, connect with others, and build your online presence.",
  image = "https://demo.treedlink.com/web-app-manifest-512x512.png",
  keywords = "link in bio, profile, community, social, bio link",
  author = "YourTree",
  type = "website",
  index = true,
  canonical = null
}) => {
  const location = useLocation();
  const canonicalUrl = canonical || `https://demo.treedlink.com${location.pathname}`;
  const fullTitle = title.includes('YourTree') ? title : `${title} - YourTree`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={index ? 'index, follow' : 'noindex, nofollow'} />
      <meta name="googlebot" content={index ? 'index, follow' : 'noindex, nofollow'} />
      <meta name="bingbot" content={index ? 'index, follow' : 'noindex, nofollow'} />

      {/* Canonical URL - Muy importante para SEO */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph - Para compartir en redes sociales */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="512" />
      <meta property="og:image:height" content="512" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:site_name" content="YourTree" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card - Para compartir en Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@YourTree" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@YourTree" />

      {/* Adicionales */}
      <meta name="theme-color" content="#ffffff" />
      <meta name="language" content="en-US" />
      <meta name="revisit-after" content="7 days" />
      <meta name="rating" content="general" />
    </Helmet>
  );
};

export default SEO;