import React from 'react';
import { Helmet } from 'react-helmet-async';
import useSettings from '../hooks/useSettings';
import { getImageUrl } from '../utils/imageUtils';

const SEO = ({ title, description, keywords, image }) => {
    const { settings } = useSettings();

    const siteName = settings?.hero?.title || settings?.contact?.name || 'Vendor TV LED Screen Terlengkap';
    const siteDescription = settings?.hero?.subtitle || 'Penyedia sewa layanan TV LED, Videotron, Smart TV, dan Proyektor terlengkap';
    const siteLogo = getImageUrl(settings?.logo) || '/src/assets/pake.png';

    const seo = {
        title: title ? `${title} | ${siteName}` : siteName,
        description: description || siteDescription,
        keywords: keywords || 'rental tv, sewa led screen, videotron, smart tv, proyektor, peralatan visual, event jakarta',
        image: image || siteLogo,
    };

    return (
        <Helmet>
            <title>{seo.title}</title>
            <meta name="description" content={seo.description} />
            <meta name="keywords" content={seo.keywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={seo.title} />
            <meta property="og:description" content={seo.description} />
            <meta property="og:image" content={seo.image} />
            <meta property="og:site_name" content={siteName} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={seo.title} />
            <meta name="twitter:description" content={seo.description} />
            <meta name="twitter:image" content={seo.image} />
        </Helmet>
    );
};

export default SEO;
