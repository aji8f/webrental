import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/imageUtils';
import API_BASE_URL from '../../config/api';

const ProjectAdd = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        date: '',
        location: '',
        description: '',
        visible: true,
        featured: false,
        access: 'public',
        coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop',
        gallery: []
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/categories`);
                // Use all categories (master category list)
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { type, name, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const uploadFormData = new FormData();
            uploadFormData.append('image', file);

            try {
                const response = await axios.post(`${API_BASE_URL}/upload`, uploadFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                setFormData(prev => ({
                    ...prev,
                    coverImage: response.data.url
                }));
            } catch (error) {
                console.error('Error uploading cover image:', error);
                toast.error('Gagal mengunggah gambar sampul');
            }
        }
    };

    const handleGalleryUpload = async (e) => {
        const files = Array.from(e.target.files);

        for (const file of files) {
            const uploadFormData = new FormData();
            uploadFormData.append('image', file);

            try {
                const response = await axios.post(`${API_BASE_URL}/upload`, uploadFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                setFormData(prev => ({
                    ...prev,
                    gallery: [...prev.gallery, { url: response.data.url, caption1: '', caption2: '' }]
                }));
            } catch (error) {
                console.error('Error uploading gallery image:', error);
                toast.error(`Gagal mengunggah ${file.name}`);
            }
        }
    };

    const handleGalleryCaptionChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            gallery: prev.gallery.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    const removeGalleryImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            gallery: prev.gallery.filter((_, index) => index !== indexToRemove)
        }));
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/projects`, {
                ...formData,
                id: `PRJ-${Date.now()}`,
                galleryCount: formData.gallery.length
            });
            setLoading(false);
            toast.success('Proyek berhasil dibuat!');
            navigate('/dashboard/portfolio');
        } catch (error) {
            console.error('Error adding project:', error);
            toast.error('Gagal menyimpan proyek. Silakan periksa konsol.');
            setLoading(false);
        }
    };

    return (
        <React.Fragment>
            <header className="h-16 bg-[#111722]/80 backdrop-blur-md border-b border-[#1e293b] flex items-center justify-between px-8 sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard/portfolio" className="text-[#92a4c9] hover:text-white transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <h2 className="text-xl font-bold text-white tracking-tight">Tambah Proyek Baru</h2>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 text-[#92a4c9] hover:text-white transition-colors relative">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#111722]"></span>
                    </button>
                    <div className="h-8 w-px bg-[#324467]"></div>
                    <div className="flex items-center gap-2 text-sm text-[#92a4c9]">
                        <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                        <span>{new Date().toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-8">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Detail Proyek</h1>
                            <p className="text-[#92a4c9] text-sm mt-1">Isi informasi di bawah ini untuk menambahkan acara baru ke portofolio.</p>
                        </div>
                        <div className="flex gap-3">
                            <Link to="/dashboard/portfolio" className="px-4 py-2.5 rounded-lg border border-[#324467] text-[#92a4c9] hover:text-white hover:bg-[#1a2332] text-sm font-medium transition-colors">
                                Batal
                            </Link>
                            <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50">
                                <span className="material-symbols-outlined text-[20px]">save</span>
                                {loading ? 'Menyimpan...' : 'Simpan Proyek'}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-[#111722] rounded-xl border border-[#324467] p-6">
                                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">feed</span>
                                    Informasi Dasar
                                </h3>
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-[#92a4c9] mb-1.5">Judul Proyek</label>
                                        <input
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-[#1a2332] border border-[#324467] rounded-lg px-4 py-2.5 text-white placeholder-[#64748b] focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                            placeholder="e.g. Annual Tech Summit 2024"
                                            type="text"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#92a4c9] mb-1.5">Kategori</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-[#1a2332] border border-[#324467] rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="">Pilih Kategori</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-[#92a4c9] mb-1.5">Tanggal Acara <span className="text-xs font-normal text-gray-500">(Opsional)</span></label>
                                            <div className="relative">
                                                <input
                                                    name="date"
                                                    value={formData.date}
                                                    onChange={handleChange}
                                                    className="w-full bg-[#1a2332] border border-[#324467] rounded-lg px-4 py-2.5 text-white placeholder-[#64748b] focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                                    type="date"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] pointer-events-none">
                                                    <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#92a4c9] mb-1.5">Lokasi <span className="text-xs font-normal text-gray-500">(Opsional)</span></label>
                                            <div className="relative">
                                                <input
                                                    name="location"
                                                    value={formData.location}
                                                    onChange={handleChange}
                                                    className="w-full bg-[#1a2332] border border-[#324467] rounded-lg px-4 py-2.5 pl-10 text-white placeholder-[#64748b] focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                                    placeholder="cth. Jakarta, Indonesia"
                                                    type="text"
                                                />
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]">
                                                    <span className="material-symbols-outlined text-[20px]">location_on</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#92a4c9] mb-1.5">Deskripsi <span className="text-xs font-normal text-gray-500">(Opsional)</span></label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="w-full bg-[#1a2332] border border-[#324467] rounded-lg px-4 py-2.5 text-white placeholder-[#64748b] focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none h-32 resize-none"
                                            placeholder="Jelaskan acara, peralatan yang digunakan, dan sorotan utama..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#111722] rounded-xl border border-[#324467] p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-white font-semibold flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">imagesmode</span>
                                        Galeri Proyek
                                    </h3>
                                    <span className="text-xs text-[#92a4c9] bg-[#1a2332] px-2 py-1 rounded border border-[#324467]">{formData.gallery.length} gambar</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    {formData.gallery.map((item, index) => (
                                        <div key={index} className="bg-[#1a2332] rounded-lg border border-[#324467] p-2 relative group">
                                            <div className="flex gap-3">
                                                <div className="w-24 h-24 flex-shrink-0 bg-black/50 rounded overflow-hidden">
                                                    <div className="w-24 h-24 flex-shrink-0 bg-black/50 rounded overflow-hidden">
                                                        <img src={getImageUrl(item.url || item)} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Description 1"
                                                        value={item.caption1 || ''}
                                                        onChange={(e) => handleGalleryCaptionChange(index, 'caption1', e.target.value)}
                                                        className="w-full bg-[#0b0f17] border border-[#324467] rounded px-2 py-1 text-xs text-white placeholder-[#64748b] focus:ring-1 focus:ring-primary focus:border-transparent"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Description 2"
                                                        value={item.caption2 || ''}
                                                        onChange={(e) => handleGalleryCaptionChange(index, 'caption2', e.target.value)}
                                                        className="w-full bg-[#0b0f17] border border-[#324467] rounded px-2 py-1 text-xs text-white placeholder-[#64748b] focus:ring-1 focus:ring-primary focus:border-transparent"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeGalleryImage(index)}
                                                className="absolute top-1 right-1 p-1 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <span className="material-symbols-outlined text-[14px]">close</span>
                                            </button>
                                        </div>
                                    ))}
                                    <label className="border-2 border-dashed border-[#324467] hover:border-primary/50 bg-[#1a2332]/30 rounded-lg h-28 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                                        <div className="w-8 h-8 bg-[#1a2332] rounded-full flex items-center justify-center border border-[#324467] group-hover:scale-110 transition-transform duration-300">
                                            <span className="material-symbols-outlined text-lg text-primary">add_photo_alternate</span>
                                        </div>
                                        <span className="text-xs text-[#92a4c9] mt-2 font-medium">Tambah Foto</span>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleGalleryUpload}
                                        />
                                    </label>
                                </div>
                                <p className="text-center text-xs text-[#64748b]">Didukung: JPG, PNG, WEBP (Maks 1920x1080px)</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-[#111722] rounded-xl border border-[#324467] p-6">
                                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">image</span>
                                    Gambar Sampul
                                </h3>
                                <div className="space-y-4">
                                    <div className="aspect-video bg-[#1a2332] rounded-lg border border-[#324467] flex items-center justify-center relative overflow-hidden group">
                                        <img
                                            alt="Cover Preview"
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                                            src={getImageUrl(formData.coverImage)}
                                        />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                accept="image/*"
                                            />
                                            <button
                                                type="button"
                                                onClick={triggerFileInput}
                                                className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg"
                                            >
                                                Ganti Sampul
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-[#64748b]">
                                        Resolusi yang disarankan: 1920x1080. Ukuran maks: 5MB.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-[#111722] rounded-xl border border-[#324467] p-6">
                                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">visibility</span>
                                    Pengaturan Visibilitas
                                </h3>
                                <div className="space-y-4">
                                    <label className="flex items-center justify-between p-3 rounded-lg border border-[#324467] bg-[#1a2332]/50 cursor-pointer hover:bg-[#1a2332] transition-colors">
                                        <span className="text-sm text-white font-medium">Terlihat oleh Publik</span>
                                        <div className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="visible"
                                                checked={formData.visible}
                                                onChange={handleChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </div>
                                    </label>
                                    <label className="flex items-center justify-between p-3 rounded-lg border border-[#324467] bg-[#1a2332]/50 cursor-pointer hover:bg-[#1a2332] transition-colors">
                                        <span className="text-sm text-white font-medium">Proyek Unggulan</span>
                                        <div className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="featured"
                                                checked={formData.featured}
                                                onChange={handleChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </div>
                                    </label>
                                    <div className="pt-4 border-t border-[#324467]">
                                        <p className="text-xs text-[#92a4c9] mb-2">Kontrol Akses</p>
                                        <select
                                            name="access"
                                            value={formData.access}
                                            onChange={handleChange}
                                            className="w-full bg-[#1a2332] border border-[#324467] rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                        >
                                            <option value="public">Publik (Semua Orang)</option>
                                            <option value="client">Khusus Klien (Kata Sandi)</option>
                                            <option value="internal">Hanya Internal</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </React.Fragment>
    );
};

export default ProjectAdd;
