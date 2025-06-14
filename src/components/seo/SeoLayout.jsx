import React from 'react';
import { Helmet } from 'react-helmet-async';
import CanonicalTag from './CanonicalTag';

/**
 * Componente de diseño que incluye etiquetas SEO básicas
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la página
 * @param {string} props.description - Descripción meta
 * @param {string} props.keywords - Palabras clave (opcional)
 * @param {string} props.canonical - URL canónica personalizada (opcional)
 * @param {string} props.image - URL de la imagen para redes sociales (opcional)
 * @param {string} props.type - Tipo de contenido (article, website, etc.)
 * @param {React.ReactNode} props.children - Contenido de la página
 * @returns {JSX.Element}
 */
const SeoLayout = ({
  title,
  description,
  keywords = '',
  canonical,
  image,
  type = 'website',
  children,
}) => {
  const siteName = 'Vibe Chile';
  const siteUrl = import.meta.env.VITE_BASE_URL || 'https://tudominio.com';
  const defaultImage = `${siteUrl}/images/og-default.jpg`;
  
  return (
    <>
      <Helmet>
        {/* Metadatos básicos */}
        <title>{title ? `${title} | ${siteName}` : siteName}</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content={type} />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:title" content={title || siteName} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image || defaultImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title || siteName} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image || defaultImage} />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Helmet>
      
      {/* Etiqueta canónica */}
      <CanonicalTag path={canonical} />
      
      {/* Contenido de la página */}
      {children}
    </>
  );
};

export default SeoLayout;
