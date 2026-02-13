import React, { useState, useEffect } from 'react';
import useSettings from '../../hooks/useSettings';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { getImageUrl } from '../../utils/imageUtils';

const Settings = () => {
    const { settings, loading, error, updateSettings } = useSettings();
    const [formData, setFormData] = useState(null);
    const [activeTab, setActiveTab] = useState('contact'); // 'contact', 'hero', 'services'
    const [saving, setSaving] = useState(false);

    // Service Cards State
    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(false);
    const [editingService, setEditingService] = useState(null); // null = list mode, object = edit mode, {} = create mode


    useEffect(() => {
        if (settings) {
            setFormData(settings);
        }
    }, [settings]);

    useEffect(() => {
        if (activeTab === 'services') {
            fetchServices();
        }
    }, [activeTab]);

    const fetchServices = async () => {
        try {
            setLoadingServices(true);
            const response = await axios.get('http://localhost:3001/categories');
            // Filter only service type categories
            const serviceCategories = response.data.filter(cat => cat.type === 'service');
            setServices(serviceCategories);
        } catch (error) {
            console.error('Error fetching services:', error);
            toast.error('Gagal memuat kartu layanan');
        } finally {
            setLoadingServices(false);
        }
    };

    const handleServiceSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (editingService.id) {
                // Update existing
                await axios.put(`http://localhost:3001/categories/${editingService.id}`, editingService);
                toast.success('Kartu layanan diperbarui');
            } else {
                // Create new
                const newId = `CAT-${Date.now()}`;
                const newService = {
                    ...editingService,
                    id: newId,
                    type: 'service',
                    count: 0 // Default count
                };
                await axios.post('http://localhost:3001/categories', newService);
                toast.success('Kartu layanan dibuat');
            }
            setEditingService(null);
            fetchServices();
        } catch (error) {
            console.error('Error saving service:', error);
            toast.error('Gagal menyimpan kartu layanan');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteService = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus kartu layanan ini?')) return;

        try {
            await axios.delete(`http://localhost:3001/categories/${id}`);
            toast.success('Kartu layanan dihapus');
            fetchServices();
        } catch (error) {
            console.error('Error deleting service:', error);
            toast.error('Gagal menghapus kartu layanan');
        }
    };

    const handleContactChange = (section, field, value) => {
        setFormData(prev => {
            if (section === 'phone') {
                return {
                    ...prev,
                    contact: {
                        ...prev.contact,
                        phone: value
                    }
                };
            }
            return {
                ...prev,
                contact: {
                    ...prev.contact,
                    [section]: {
                        ...prev.contact[section],
                        [field]: value
                    }
                }
            };
        });
    };

    const handleMapUrlChange = (value) => {
        setFormData(prev => ({
            ...prev,
            contact: {
                ...prev.contact,
                mapUrl: value
            }
        }));
    };

    const handleHeroChange = (page, value) => {
        setFormData(prev => ({
            ...prev,
            heroImages: {
                ...prev.heroImages,
                [page]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const success = await updateSettings(formData);
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 mt-10">
                <p>{error}</p>
            </div>
        );
    }

    if (!formData) return null;

    return (
        <React.Fragment>
            <header className="h-16 bg-[#111722]/80 backdrop-blur-md border-b border-[#1e293b] flex items-center justify-between px-8 sticky top-0 z-10">
                <h2 className="text-xl font-bold text-white tracking-tight">Pengaturan Website</h2>
            </header>

            <main className="flex-1 overflow-y-auto p-8 relative">
                <div className="max-w-4xl mx-auto space-y-6">

                    {/* Tabs */}
                    <div className="flex border-b border-border-dark mb-6 overflow-x-auto">
                        <button
                            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'contact'
                                ? 'border-primary text-white'
                                : 'border-transparent text-gray-400 hover:text-gray-300'
                                }`}
                            onClick={() => setActiveTab('contact')}
                        >
                            Informasi Kontak
                        </button>
                        <button
                            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'hero'
                                ? 'border-primary text-white'
                                : 'border-transparent text-gray-400 hover:text-gray-300'
                                }`}
                            onClick={() => setActiveTab('hero')}
                        >
                            Gambar Hero
                        </button>
                        <button
                            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'services'
                                ? 'border-primary text-white'
                                : 'border-transparent text-gray-400 hover:text-gray-300'
                                }`}
                            onClick={() => setActiveTab('services')}
                        >
                            Kartu Layanan
                        </button>
                    </div>

                    {/* Main Settings Form (Contact & Hero) */}
                    {(activeTab === 'contact' || activeTab === 'hero') && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Contact Information Section */}
                            {activeTab === 'contact' && (
                                <div className="space-y-6 animate-fadeIn">
                                    {/* Brand Identity */}
                                    <div className="bg-surface-dark border border-border-dark rounded-xl p-6">
                                        <h3 className="text-lg font-bold text-white mb-4">Identitas Brand</h3>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Logo Website</label>
                                            <div className="flex gap-6 items-center">
                                                <div className="w-24 h-24 bg-background-dark rounded-lg border border-border-dark overflow-hidden flex-shrink-0 relative flex items-center justify-center">
                                                    {formData.logo ? (
                                                        <img
                                                            src={getImageUrl(formData.logo)}
                                                            alt="Logo"
                                                            className="w-full h-full object-contain p-2"
                                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Error' }}
                                                        />
                                                    ) : (
                                                        <span className="material-symbols-outlined text-4xl text-gray-600">verified</span>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <label className="cursor-pointer bg-[#1a2332] hover:bg-[#253248] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-[#324467] flex items-center gap-2">
                                                            <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                                                            Unggah Logo
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={async (e) => {
                                                                    const file = e.target.files[0];
                                                                    if (file) {
                                                                        const uploadFormData = new FormData();
                                                                        uploadFormData.append('image', file);
                                                                        try {
                                                                            const response = await axios.post('http://localhost:3001/upload', uploadFormData, {
                                                                                headers: { 'Content-Type': 'multipart/form-data' }
                                                                            });
                                                                            setFormData(prev => ({ ...prev, logo: response.data.url }));
                                                                        } catch (error) {
                                                                            console.error('Error uploading logo:', error);
                                                                            toast.error('Gagal mengunggah logo');
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                        </label>
                                                        {formData.logo && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setFormData(prev => ({ ...prev, logo: '' }))}
                                                                className="text-red-400 hover:text-red-300 text-sm font-medium px-3 py-2 transition-colors"
                                                            >
                                                                Hapus
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500">Ukuran yang disarankan: 600x50px. PNG atau SVG transparan lebih disukai.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Headquarters */}
                                    <div className="bg-surface-dark border border-border-dark rounded-xl p-6">
                                        <h3 className="text-lg font-bold text-white mb-4">Kantor Pusat</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-gray-400 mb-1">Alamat Jalan</label>
                                                <input
                                                    type="text"
                                                    value={formData.contact?.headquarters?.street || ''}
                                                    onChange={(e) => handleContactChange('headquarters', 'street', e.target.value)}
                                                    className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder-gray-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-1">Kota</label>
                                                <input
                                                    type="text"
                                                    value={formData.contact?.headquarters?.city || ''}
                                                    onChange={(e) => handleContactChange('headquarters', 'city', e.target.value)}
                                                    className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder-gray-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-1">Kode Pos</label>
                                                <input
                                                    type="text"
                                                    value={formData.contact?.headquarters?.zip || ''}
                                                    onChange={(e) => handleContactChange('headquarters', 'zip', e.target.value)}
                                                    className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder-gray-600"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Details */}
                                    <div className="bg-surface-dark border border-border-dark rounded-xl p-6">
                                        <h3 className="text-lg font-bold text-white mb-4">Detail Kontak</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div className="col-span-1 md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-400 mb-1">Alamat Email</label>
                                                <input
                                                    type="email"
                                                    value={formData.contact?.email?.sales || ''}
                                                    onChange={(e) => handleContactChange('email', 'sales', e.target.value)}
                                                    className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder-gray-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-1">Telepon (WhatsApp)</label>
                                                <input
                                                    type="text"
                                                    value={formData.contact?.phone || ''}
                                                    onChange={(e) => handleContactChange('phone', '', e.target.value)}
                                                    className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder-gray-600"
                                                    placeholder="e.g. 628..."
                                                />
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold text-white mb-4 border-t border-border-dark pt-6">Jam Operasional</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-1">Jam Hari Kerja</label>
                                                <input
                                                    type="text"
                                                    value={formData.contact?.businessHours?.weekday || ''}
                                                    onChange={(e) => handleContactChange('businessHours', 'weekday', e.target.value)}
                                                    className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder-gray-600"
                                                    placeholder="cth. Sen - Jum, 09.00 - 18.00"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-1">Dukungan Darurat</label>
                                                <input
                                                    type="text"
                                                    value={formData.contact?.businessHours?.emergency || ''}
                                                    onChange={(e) => handleContactChange('businessHours', 'emergency', e.target.value)}
                                                    className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder-gray-600"
                                                    placeholder="cth. Tersedia 24/7"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-6 border-t border-border-dark pt-6">
                                            <label className="block text-sm font-medium text-gray-400 mb-1">URL Embed Google Maps</label>
                                            <textarea
                                                value={formData.contact?.mapUrl || ''}
                                                onChange={(e) => handleMapUrlChange(e.target.value)}
                                                rows="3"
                                                className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder-gray-600 font-mono text-xs"
                                                placeholder='<iframe src="...">'
                                            ></textarea>
                                            <p className="text-xs text-gray-500 mt-1">Tempel kode iframe lengkap dari opsi berbagi Google Maps.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Hero Images Section */}
                            {activeTab === 'hero' && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="bg-surface-dark border border-border-dark rounded-xl p-6">
                                        <h3 className="text-lg font-bold text-white mb-6">Gambar Header Halaman</h3>

                                        {['home', 'about', 'services', 'portfolio', 'contact'].map((page) => (
                                            <div key={page} className="mb-8 last:mb-0">
                                                <label className="block text-sm font-medium text-gray-400 mb-2 capitalize">{page} Page</label>
                                                <div className="flex gap-6 items-start">
                                                    <div className="w-48 h-28 bg-background-dark rounded-lg border border-border-dark overflow-hidden flex-shrink-0 relative group">
                                                        {formData.heroImages?.[page] ? (
                                                            <img
                                                                src={getImageUrl(formData.heroImages[page])}
                                                                alt={`${page} hero preview`}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Error' }}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs flex-col gap-2">
                                                                <span className="material-symbols-outlined text-2xl">image</span>
                                                                Tidak Ada Gambar
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 space-y-3">
                                                        <div className="flex items-center gap-3">
                                                            <label className="cursor-pointer bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg inline-flex items-center gap-2">
                                                                <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                                                                Unggah Gambar
                                                                <input
                                                                    type="file"
                                                                    className="hidden"
                                                                    accept="image/*"
                                                                    onChange={async (e) => {
                                                                        const file = e.target.files[0];
                                                                        if (file) {
                                                                            const uploadFormData = new FormData();
                                                                            uploadFormData.append('image', file);

                                                                            try {
                                                                                const response = await axios.post('http://localhost:3001/upload', uploadFormData, {
                                                                                    headers: {
                                                                                        'Content-Type': 'multipart/form-data'
                                                                                    }
                                                                                });
                                                                                handleHeroChange(page, response.data.url);
                                                                            } catch (error) {
                                                                                console.error('Error uploading image:', error);
                                                                                toast.error('Gagal mengunggah gambar');
                                                                            }
                                                                        }
                                                                    }}
                                                                />
                                                            </label>
                                                            {formData.heroImages?.[page] && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleHeroChange(page, '')}
                                                                    className="text-red-400 hover:text-red-300 text-sm font-medium px-3 py-2 transition-colors uppercase tracking-wider text-xs"
                                                                >
                                                                    Hapus
                                                                </button>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-500">
                                                            Format yang diizinkan: JPG, PNG, WEBP. Ukuran maks: 5MB.<br />
                                                            Resolusi yang disarankan: 1920x1080px untuk tampilan optimal.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Global Save Button (Only for Settings) */}
                            <div className="flex justify-end pt-4 border-t border-border-dark">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className={`px-6 py-2.5 bg-primary text-white font-medium rounded-lg shadow-lg hover:bg-primary-hover transition-all flex items-center gap-2 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {saving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-[20px]">save</span>
                                            Simpan Pengaturan
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Service Cards Section (Independent) */}
                    {activeTab === 'services' && (
                        <div className="space-y-6 animate-fadeIn">
                            {!editingService ? (
                                /* List View */
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-bold text-white">Kartu Layanan (Halaman Beranda)</h3>
                                        <button
                                            onClick={() => setEditingService({})}
                                            className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">add</span>
                                            Tambah Kartu Baru
                                        </button>
                                    </div>

                                    {loadingServices ? (
                                        <div className="text-center py-8 text-gray-400">Memuat layanan...</div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {services.map((service) => (
                                                <div key={service.id} className="bg-surface-dark border border-border-dark rounded-xl p-4 flex gap-4 group">
                                                    <div className="w-24 h-24 bg-background-dark rounded-lg overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={getImageUrl(service.image)}
                                                            alt={service.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image' }}
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start">
                                                            <h4 className="text-white font-medium truncate pr-2">{service.name}</h4>
                                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={() => setEditingService(service)}
                                                                    className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                                                                    title="Edit"
                                                                >
                                                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteService(service.id)}
                                                                    className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-400 text-sm line-clamp-2 mt-1">{service.description}</p>
                                                        <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                <span className="material-symbols-outlined text-[14px]">{service.icon}</span>
                                                                Icon
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <span className="material-symbols-outlined text-[14px]">payments</span>
                                                                {service.startingPrice}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Edit/Create Form */
                                <div className="bg-surface-dark border border-border-dark rounded-xl p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-bold text-white">
                                            {editingService.id ? 'Edit Kartu Layanan' : 'Kartu Layanan Baru'}
                                        </h3>
                                        <button
                                            onClick={() => setEditingService(null)}
                                            className="text-gray-400 hover:text-white transition-colors"
                                        >
                                            <span className="material-symbols-outlined">close</span>
                                        </button>
                                    </div>

                                    <form onSubmit={handleServiceSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Nama Layanan</label>
                                            <input
                                                type="text"
                                                required
                                                value={editingService.name || ''}
                                                onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                                                className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder-gray-600"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Deskripsi</label>
                                            <textarea
                                                required
                                                value={editingService.description || ''}
                                                onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                                                rows="2"
                                                className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder-gray-600"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                                    Nama Ikon
                                                    <a href="https://fonts.google.com/icons" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-hover ml-2 text-xs">(Ikon Google Fonts)</a>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        required
                                                        value={editingService.icon || ''}
                                                        onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                                                        className="w-full bg-background-dark border border-border-dark rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder-gray-600"
                                                        placeholder="e.g. tv, videocam"
                                                    />
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                        <span className="material-symbols-outlined text-[20px]">{editingService.icon || 'help'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-1">Teks Harga Mulai</label>
                                                <input
                                                    type="text"
                                                    value={editingService.startingPrice || ''}
                                                    onChange={(e) => setEditingService({ ...editingService, startingPrice: e.target.value })}
                                                    className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder-gray-600"
                                                    placeholder="e.g. Rp 750.000 / unit"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Gambar Sampul</label>
                                            <div className="flex gap-6 items-start">
                                                <div className="w-48 h-28 bg-background-dark rounded-lg border border-border-dark overflow-hidden flex-shrink-0 relative">
                                                    {editingService.image ? (
                                                        <img
                                                            src={getImageUrl(editingService.image)}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Error' }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs flex-col gap-2">
                                                            <span className="material-symbols-outlined text-2xl">image</span>
                                                            Tidak Ada Gambar
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <label className="cursor-pointer bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg inline-flex items-center gap-2">
                                                            <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                                                            Unggah Gambar
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={async (e) => {
                                                                    const file = e.target.files[0];
                                                                    if (file) {
                                                                        const uploadFormData = new FormData();
                                                                        uploadFormData.append('image', file);
                                                                        try {
                                                                            const response = await axios.post('http://localhost:3001/upload', uploadFormData, {
                                                                                headers: { 'Content-Type': 'multipart/form-data' }
                                                                            });
                                                                            setEditingService({ ...editingService, image: response.data.url });
                                                                        } catch (error) {
                                                                            console.error('Error uploading image:', error);
                                                                            toast.error('Gagal mengunggah gambar');
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                        </label>
                                                        <span className="text-gray-500 text-sm">atau masukkan URL:</span>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={editingService.image || ''}
                                                        onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                                                        className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder-gray-600"
                                                        placeholder="https://..."
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4 border-t border-border-dark gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setEditingService(null)}
                                                className="px-4 py-2 text-gray-400 hover:text-white font-medium transition-colors"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className={`px-6 py-2 bg-primary text-white font-medium rounded-lg shadow-lg hover:bg-primary-hover transition-all flex items-center gap-2 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                                            >
                                                {saving ? 'Menyimpan...' : 'Simpan Kartu Layanan'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </React.Fragment>
    );
};

export default Settings;
