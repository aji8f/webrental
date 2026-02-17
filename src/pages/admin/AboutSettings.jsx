import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import API_BASE_URL from '../../config/api';

const AboutSettings = () => {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('home'); // 'home' or 'page'
    const [formData, setFormData] = useState({
        homeSummary: {
            tagline: '',
            title: '',
            description1: '',
            description2: ''
        },
        pageContent: {
            history: '',
            mission: '',
            whyChooseUs: []
        }
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/about`);
            if (response.data) {
                setFormData(response.data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching about data:', error);
            setLoading(false);
            toast.error('Gagal memuat data');
        }
    };

    const handleChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleWhyChooseUsChange = (index, field, value) => {
        const newWhyChooseUs = [...formData.pageContent.whyChooseUs];
        newWhyChooseUs[index] = { ...newWhyChooseUs[index], [field]: value };
        setFormData(prev => ({
            ...prev,
            pageContent: {
                ...prev.pageContent,
                whyChooseUs: newWhyChooseUs
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_BASE_URL}/about`, formData);
            toast.success('Pengaturan berhasil disimpan');
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Gagal menyimpan pengaturan');
        }
    };

    if (loading) {
        return <div className="p-8 text-white">Memuat...</div>;
    }

    const handleImageUpload = async (section, field, file) => {
        if (!file) return;

        const formDataObj = new FormData();
        formDataObj.append('image', file);

        try {
            const response = await axios.post(`${API_BASE_URL}/upload`, formDataObj, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: response.data.url
                }
            }));
            toast.success('Gambar berhasil diunggah');
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Gagal mengunggah gambar');
        }
    };

    return (
        <div className="flex flex-col h-full bg-background-dark text-white">
            <header className="h-16 bg-[#111722]/80 backdrop-blur-md border-b border-[#1e293b] flex items-center justify-between px-8 sticky top-0 z-10">
                <h2 className="text-xl font-bold tracking-tight">Manajemen Konten Tentang</h2>
            </header>

            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex space-x-1 rounded-xl bg-[#1e293b] p-1 mb-8 w-fit">
                        <button
                            onClick={() => setActiveTab('home')}
                            className={`w-full rounded-lg py-2.5 px-6 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 ${activeTab === 'home'
                                ? 'bg-primary text-white shadow'
                                : 'text-gray-400 hover:bg-white/[0.12] hover:text-white'
                                }`}
                        >
                            Ringkasan Halaman Beranda
                        </button>
                        <button
                            onClick={() => setActiveTab('page')}
                            className={`w-full rounded-lg py-2.5 px-6 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 ${activeTab === 'page'
                                ? 'bg-primary text-white shadow'
                                : 'text-gray-400 hover:bg-white/[0.12] hover:text-white'
                                }`}
                        >
                            Konten Halaman Tentang
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {activeTab === 'home' && (
                            <div className="bg-[#111722] p-6 rounded-xl border border-[#324467] space-y-6">
                                <h3 className="text-lg font-bold">Bagian "Tentang" Halaman Beranda</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Gambar Bagian Ringkasan</label>
                                    <div className="flex gap-6 items-start">
                                        <div className="w-48 h-28 bg-background-dark rounded-lg border border-border-dark overflow-hidden flex-shrink-0 relative">
                                            {formData.homeSummary?.image ? (
                                                <img
                                                    src={formData.homeSummary.image}
                                                    alt="Summary preview"
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
                                                        onChange={(e) => handleImageUpload('homeSummary', 'image', e.target.files[0])}
                                                    />
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Atau masukkan URL gambar..."
                                                    value={formData.homeSummary?.image || ''}
                                                    onChange={(e) => handleChange('homeSummary', 'image', e.target.value)}
                                                    className="flex-1 bg-[#1a2332] border border-[#324467] rounded-lg px-4 py-2 text-white text-sm focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Gambar yang ditampilkan di bagian ringkasan pada Halaman Beranda.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Tagline (Lencana Kecil)</label>
                                    <input
                                        type="text"
                                        value={formData.homeSummary?.tagline || ''}
                                        onChange={(e) => handleChange('homeSummary', 'tagline', e.target.value)}
                                        className="w-full bg-[#1a2332] border border-[#324467] rounded-lg px-4 py-2.5 text-white focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Judul Utama</label>
                                    <input
                                        type="text"
                                        value={formData.homeSummary?.title || ''}
                                        onChange={(e) => handleChange('homeSummary', 'title', e.target.value)}
                                        className="w-full bg-[#1a2332] border border-[#324467] rounded-lg px-4 py-2.5 text-white focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Paragraf Deskripsi 1</label>
                                    <textarea
                                        rows={4}
                                        value={formData.homeSummary?.description1 || ''}
                                        onChange={(e) => handleChange('homeSummary', 'description1', e.target.value)}
                                        className="w-full bg-[#1a2332] border border-[#324467] rounded-lg px-4 py-2.5 text-white focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Paragraf Deskripsi 2</label>
                                    <textarea
                                        rows={4}
                                        value={formData.homeSummary?.description2 || ''}
                                        onChange={(e) => handleChange('homeSummary', 'description2', e.target.value)}
                                        className="w-full bg-[#1a2332] border border-[#324467] rounded-lg px-4 py-2.5 text-white focus:ring-primary focus:border-primary"
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'page' && (
                            <div className="space-y-6">
                                <div className="bg-[#111722] p-6 rounded-xl border border-[#324467] space-y-6">
                                    <h3 className="text-lg font-bold">Sejarah & Misi Perusahaan</h3>

                                    {/* Team Image Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Gambar Tim/Konten</label>
                                        <div className="flex gap-6 items-start">
                                            <div className="w-48 h-28 bg-background-dark rounded-lg border border-border-dark overflow-hidden flex-shrink-0 relative">
                                                {formData.pageContent?.teamImage ? (
                                                    <img
                                                        src={formData.pageContent.teamImage}
                                                        alt="Team preview"
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
                                                            onChange={(e) => handleImageUpload('pageContent', 'teamImage', e.target.files[0])}
                                                        />
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Atau masukkan URL gambar..."
                                                        value={formData.pageContent?.teamImage || ''}
                                                        onChange={(e) => handleChange('pageContent', 'teamImage', e.target.value)}
                                                        className="flex-1 bg-[#1a2332] border border-[#324467] rounded-lg px-4 py-2 text-white text-sm focus:ring-primary focus:border-primary"
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    Gambar yang ditampilkan di sebelah bagian sejarah perusahaan.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Sejarah Kami</label>
                                        <textarea
                                            rows={4}
                                            value={formData.pageContent?.history || ''}
                                            onChange={(e) => handleChange('pageContent', 'history', e.target.value)}
                                            className="w-full bg-[#1a2332] border border-[#324467] rounded-lg px-4 py-2.5 text-white focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Misi Kami</label>
                                        <textarea
                                            rows={3}
                                            value={formData.pageContent?.mission || ''}
                                            onChange={(e) => handleChange('pageContent', 'mission', e.target.value)}
                                            className="w-full bg-[#1a2332] border border-[#324467] rounded-lg px-4 py-2.5 text-white focus:ring-primary focus:border-primary"
                                        />
                                    </div>

                                    {/* Bottom Grid Images */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border-dark">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Gambar Bawah 1 (Lebar)</label>
                                            <div className="space-y-3">
                                                <div className="w-full h-32 bg-background-dark rounded-lg border border-border-dark overflow-hidden relative">
                                                    {formData.pageContent?.bottomImage1 ? (
                                                        <img
                                                            src={formData.pageContent.bottomImage1}
                                                            alt="Bottom 1"
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Error' }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs flex-col">
                                                            <span className="material-symbols-outlined text-2xl">image</span>
                                                            Tidak Ada Gambar
                                                        </div>
                                                    )}
                                                </div>
                                                <label className="cursor-pointer bg-[#1a2332] hover:bg-[#253248] text-white w-full py-2 rounded-lg text-sm font-medium transition-colors border border-[#324467] flex items-center justify-center gap-2">
                                                    <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                                                    Unggah
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageUpload('pageContent', 'bottomImage1', e.target.files[0])}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Gambar Bawah 2 (Kotak)</label>
                                            <div className="space-y-3">
                                                <div className="w-full h-32 bg-background-dark rounded-lg border border-border-dark overflow-hidden relative">
                                                    {formData.pageContent?.bottomImage2 ? (
                                                        <img
                                                            src={formData.pageContent.bottomImage2}
                                                            alt="Bottom 2"
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Error' }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs flex-col">
                                                            <span className="material-symbols-outlined text-2xl">image</span>
                                                            Tidak Ada Gambar
                                                        </div>
                                                    )}
                                                </div>
                                                <label className="cursor-pointer bg-[#1a2332] hover:bg-[#253248] text-white w-full py-2 rounded-lg text-sm font-medium transition-colors border border-[#324467] flex items-center justify-center gap-2">
                                                    <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                                                    Unggah
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageUpload('pageContent', 'bottomImage2', e.target.files[0])}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#111722] p-6 rounded-xl border border-[#324467] space-y-6">
                                    <h3 className="text-lg font-bold">Mengapa Memilih Kami (3 Poin)</h3>
                                    {formData.pageContent?.whyChooseUs?.map((point, index) => (
                                        <div key={index} className="p-4 bg-[#1a2332] rounded-lg border border-[#324467]">
                                            <h4 className="text-sm font-bold text-primary mb-3">Poin {index + 1}</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-400 mb-1">Judul</label>
                                                    <input
                                                        type="text"
                                                        value={point.title}
                                                        onChange={(e) => handleWhyChooseUsChange(index, 'title', e.target.value)}
                                                        className="w-full bg-[#111722] border border-[#324467] rounded-lg px-3 py-2 text-white text-sm focus:ring-primary focus:border-primary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-400 mb-1">Deskripsi</label>
                                                    <input
                                                        type="text"
                                                        value={point.description}
                                                        onChange={(e) => handleWhyChooseUsChange(index, 'description', e.target.value)}
                                                        className="w-full bg-[#111722] border border-[#324467] rounded-lg px-3 py-2 text-white text-sm focus:ring-primary focus:border-primary"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/20"
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AboutSettings;
