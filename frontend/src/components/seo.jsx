import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = "YourTree - Link in Bio & Community", 
  description = "Create your custom link page and join the creator community.",
  image = "/logo.svg"
}) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="robots" content="index,follow" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:url" content={`https://demo.treedlink.com${window.location.pathname}`} />
    <meta name="twitter:card" content="summary_large_image" />
  </Helmet>
);

export default SEO;