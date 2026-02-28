import axios from 'axios';
import API_BASE_URL from '../config/api';

/**
 * Fire-and-forget contact click tracking.
 * @param {'whatsapp'|'email'|'phone'} type - Type of contact click
 * @param {'home'|'contact'|'footer'|'floating'} source - Page source
 */
export const trackContactClick = (type, source) => {
    // Fire and forget — don't block the user's action
    axios.post(`${API_BASE_URL}/contact-clicks`, { type, source }).catch(() => {
        // Silently ignore errors — tracking should never break UX
    });
};
