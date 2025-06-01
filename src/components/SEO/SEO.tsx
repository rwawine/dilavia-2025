import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description?: string;
    keywords?: string;
    noindex?: boolean;
    image?: string;
    url?: string;
}

export const SEO = ({ 
    title, 
    description, 
    keywords, 
    noindex = false,
    image = '/logo.png',
    url = 'https://dilavia-2025-fjcc.vercel.app'
}: SEOProps) => {
    return (
        <Helmet>
            <title>{title}</title>
            {description && <meta name="description" content={description} />}
            {keywords && <meta name="keywords" content={keywords} />}
            {noindex && <meta name="robots" content="noindex, nofollow" />}
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            {description && <meta property="og:description" content={description} />}
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content="DILAVIA" />
            
            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={title} />
            {description && <meta name="twitter:description" content={description} />}
            <meta name="twitter:image" content={image} />
            
            {/* Additional Meta Tags */}
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            <link rel="canonical" href={url} />
        </Helmet>
    );
}; 