import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const useSettings = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3001/settings');
            setSettings(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching settings:', err);
            setError('Failed to load settings');
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = async (newSettings) => {
        try {
            // Optimistic update
            const previousSettings = settings;
            setSettings(newSettings);

            await axios.put('http://localhost:3001/settings', newSettings);
            toast.success('Settings saved successfully');
            return true;
        } catch (err) {
            console.error('Error updating settings:', err);
            // Revert on error
            setSettings(previousSettings);
            toast.error('Failed to save settings');
            return false;
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return {
        settings,
        loading,
        error,
        updateSettings,
        refetch: fetchSettings
    };
};

export default useSettings;
