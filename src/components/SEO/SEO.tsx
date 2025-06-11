import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    noindex?: boolean;
    image?: string;
    url?: string;
    breadcrumbs?: Array<{
        name: string;
        item: string;
    }>;
}

export const SEO = ({ 
    title = 'DILAVIA - интернет-магазин мебели в Минске', 
    description, 
    keywords, 
    noindex = false,
    image = '/logo.png',
    url,
    breadcrumbs = []
}: SEOProps) => {
    const location = useLocation();
    const baseUrl = 'https://dilavia.by';
    const currentUrl = url || `${baseUrl}${location.pathname}`;

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "DILAVIA",
        "url": baseUrl,
        "logo": `${baseUrl}/logo.png`,
        "description": "Интернет-магазин мебели в Минске. Диваны, кровати и кресла с доставкой по Беларуси",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "BY",
            "addressLocality": "Минск"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+375-XX-XXX-XX-XX",
            "contactType": "customer service"
        }
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "DILAVIA",
        "url": baseUrl,
        "potentialAction": {
            "@type": "SearchAction",
            "target": `${baseUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
        }
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.item
        }))
    };

    return (
        <Helmet>
            <title>{title}</title>
            {description && <meta name="description" content={description} />}
            {keywords && <meta name="keywords" content={keywords} />}
            {noindex && <meta name="robots" content="noindex, nofollow" />}
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={title} />
            {description && <meta property="og:description" content={description} />}
            <meta property="og:image" content={`${baseUrl}${image}`} />
            <meta property="og:site_name" content="DILAVIA" />
            
            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={currentUrl} />
            <meta name="twitter:title" content={title} />
            {description && <meta name="twitter:description" content={description} />}
            <meta name="twitter:image" content={`${baseUrl}${image}`} />
            
            {/* Additional Meta Tags */}
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            <link rel="canonical" href={currentUrl} />

            {/* Schema.org markup */}
            <script type="application/ld+json">
                {JSON.stringify(organizationSchema)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(websiteSchema)}
            </script>
            {breadcrumbs.length > 0 && (
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
            )}
        </Helmet>
    );
}; 