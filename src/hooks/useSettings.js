import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import API_BASE_URL from '../config/api';

const SETTINGS_CACHE_KEY = 'webrental_settings_cache';

/**
 * Reads cached settings from localStorage for instant hydration.
 * This eliminates the flash-of-default-content on page refresh.
 */
const getCachedSettings = () => {
    try {
        const cached = localStorage.getItem(SETTINGS_CACHE_KEY);
        if (cached) {
            return JSON.parse(cached);
        }
    } catch (e) {
        // Corrupted cache — ignore
        localStorage.removeItem(SETTINGS_CACHE_KEY);
    }
    return null;
};

/**
 * Saves settings to localStorage for next page load.
 */
const setCachedSettings = (settings) => {
    try {
        if (settings && Object.keys(settings).length > 0) {
            localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(settings));
        }
    } catch (e) {
        // localStorage full or unavailable — ignore silently
    }
};

const useSettings = () => {
    // Initialize from cache for instant rendering — no flash!
    const [settings, setSettings] = useState(() => getCachedSettings());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSettings = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/settings`);
            const freshSettings = response.data;
            setSettings(freshSettings);
            setCachedSettings(freshSettings); // Update cache for next refresh
            setError(null);
        } catch (err) {
            console.error('Error fetching settings:', err);
            setError('Failed to load settings');
            // Only show toast if we don't have cached data to fall back on
            if (!getCachedSettings()) {
                toast.error('Failed to load settings');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const updateSettings = async (newSettings) => {
        try {
            const previousSettings = settings;
            setSettings(newSettings);
            setCachedSettings(newSettings); // Update cache immediately

            await axios.put(`${API_BASE_URL}/settings`, newSettings);
            toast.success('Settings saved successfully');
            return true;
        } catch (err) {
            console.error('Error updating settings:', err);
            // Revert on error
            setSettings(previousSettings);
            setCachedSettings(previousSettings);
            toast.error('Failed to save settings');
            return false;
        }
    };

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    return {
        settings,
        loading,
        error,
        updateSettings,
        refetch: fetchSettings
    };
};

export default useSettings;
