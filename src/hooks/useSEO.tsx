import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface UseSEOProps {
    title?: string;
    description?: string;
    keywords?: string;
}

/**
 * @deprecated This hook is deprecated. Please use the SEO component from src/components/SEO/SEO.tsx instead
 * for consistent SEO implementation across the site.
 */
export const useSEO = ({ 
    title = 'DILAVIA - интернет-магазин мебели в Минске', 
    description, 
    keywords 
}: UseSEOProps) => {
    useEffect(() => {
        // Принудительное обновление заголовка
        document.title = title;
        
        // Логируем для отладки
        console.log('SEO Hook: Setting title to', title);
        console.warn('useSEO hook is deprecated. Please use the SEO component from src/components/SEO/SEO.tsx instead');
    }, [title]);

    return (
        <Helmet>
            <title>{title}</title>
            {description && <meta name="description" content={description} />}
            {keywords && <meta name="keywords" content={keywords} />}
        </Helmet>
    );
}; 