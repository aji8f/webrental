import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import API_BASE_URL from '../config/api';

const SETTINGS_CACHE_KEY = 'webrental_settings_cache';

const getCachedSettings = () => {
    try {
        const cached = localStorage.getItem(SETTINGS_CACHE_KEY);
        if (cached) return JSON.parse(cached);
    } catch (e) {
        localStorage.removeItem(SETTINGS_CACHE_KEY);
    }
    return null;
};

const setCachedSettings = (settings) => {
    try {
        if (settings && Object.keys(settings).length > 0) {
            localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(settings));
        }
    } catch (e) { /* ignore */ }
};

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(() => getCachedSettings());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ready, setReady] = useState(() => !!getCachedSettings());

    const fetchSettings = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/settings`);
            const fresh = response.data;
            setSettings(fresh);
            setCachedSettings(fresh);
            setError(null);
            setReady(true);
        } catch (err) {
            console.error('Error fetching settings:', err);
            setError('Failed to load settings');
            if (!getCachedSettings()) {
                toast.error('Failed to load settings');
            }
            setReady(true);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateSettings = async (newSettings) => {
        const previousSettings = settings;
        try {
            setSettings(newSettings);
            setCachedSettings(newSettings);
            await axios.put(`${API_BASE_URL}/settings`, newSettings);
            toast.success('Settings saved successfully');
            return true;
        } catch (err) {
            console.error('Error updating settings:', err);
            setSettings(previousSettings);
            setCachedSettings(previousSettings);
            toast.error('Failed to save settings');
            return false;
        }
    };

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    // Block rendering until settings are ready (from cache or API)
    if (!ready) {
        return React.createElement('div', {
            className: 'bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center'
        }, React.createElement('div', {
            className: 'animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary'
        }));
    }

    return React.createElement(SettingsContext.Provider, { value: { settings, loading, error, updateSettings, refetch: fetchSettings } }, children);
};

// Hook to consume settings
const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

export default useSettings;
