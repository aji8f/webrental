import React, { useEffect } from 'react';
import useSettings from '../hooks/useSettings';
import { getImageUrl } from '../utils/imageUtils';

/**
 * Component to dynamically update the document <title> and <link rel="icon">
 * based on the settings from the backend database.
 */
const DynamicHead = () => {
    const { settings } = useSettings();

    useEffect(() => {
        if (settings) {
            // Update Tab Title
            if (settings.hero?.title) {
                document.title = settings.hero.title;
            } else if (settings.contact?.name) {
                document.title = settings.contact.name;
            }

            // Update Favicon (Logo)
            if (settings.logo) {
                const logoUrl = getImageUrl(settings.logo);
                // Find existing favicon or create a new one
                let link = document.querySelector("link[rel~='icon']");

                if (!link) {
                    link = document.createElement('link');
                    link.rel = 'icon';
                    document.head.appendChild(link);
                }

                link.href = logoUrl;
            }
        }
    }, [settings]);

    return null; // This component doesn't render anything visible
};

export default DynamicHead;
