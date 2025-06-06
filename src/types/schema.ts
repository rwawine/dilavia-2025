export interface OrganizationSchema {
    "@context": "https://schema.org";
    "@type": "Organization";
    name: string;
    url: string;
    logo?: string;
    description?: string;
    address?: {
        "@type": "PostalAddress";
        streetAddress?: string;
        addressLocality?: string;
        addressRegion?: string;
        postalCode?: string;
        addressCountry?: string;
    };
    contactPoint?: {
        "@type": "ContactPoint";
        telephone?: string;
        contactType?: string;
        email?: string;
    };
}

export interface WebPageSchema {
    "@context": "https://schema.org";
    "@type": "WebPage";
    name: string;
    description: string;
    url: string;
    breadcrumb?: {
        "@type": "BreadcrumbList";
        itemListElement: Array<{
            "@type": "ListItem";
            position: number;
            name: string;
            item: string;
        }>;
    };
}

export interface ServiceSchema {
    "@context": "https://schema.org";
    "@type": "Service";
    name: string;
    description: string;
    provider: {
        "@type": "Organization";
        name: string;
    };
    areaServed?: string;
    serviceType?: string;
} 