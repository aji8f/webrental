import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import GalleryModal from '../../components/admin/GalleryModal';
import { getImageUrl } from '../../utils/imageUtils';

const ProjectEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const galleryInputRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showGalleryModal, setShowGalleryModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        visible: true,
        featured: false,
        access: 'public',
        coverImage: '',
        gallery: []
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:3001/categories');
                // Use all categories (master category list)
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProject();
    }, [id]);

    const fetchProject = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/projects/${id}`);
            // Ensure gallery is an array and items are objects
            const gallery = (response.data.gallery || []).map(item =>
                typeof item === 'string' ? { url: item, caption1: '', caption2: '' } : item
            );

            const projectData = {
                ...response.data,
                gallery: gallery
            };
            setFormData(projectData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching project:', error);
            setLoading(false);
            // Handle not found or error
        }
    };

    const handleChange = (e) => {
        const { type, name, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put(`http://localhost:3001/projects/${id}`, formData);
            setSaving(false);
            toast.success('Proyek berhasil diperbarui!');
            navigate('/dashboard/portfolio');
        } catch (error) {
            console.error('Error updating project:', error);
            setSaving(false);
            toast.error('Gagal memperbarui proyek.');
        }
    };

    const handleImageUpload = async (e) => {
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
                const response = await axios.post('http://localhost:3001/upload', uploadFormData, {
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

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleSetCover = (imgUrl) => {
        setFormData(prev => ({
            ...prev,
            coverImage: imgUrl
        }));
    };

    const handleDeleteGalleryImage = (indexToDelete) => {
        if (window.confirm('Hapus gambar ini dari galeri?')) {
            setFormData(prev => ({
                ...prev,
                gallery: prev.gallery.filter((_, index) => index !== indexToDelete)
            }));
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Apakah Anda yakin ingin menghapus proyek ini? Tindakan ini tidak dapat dibatalkan.')) {
            try {
                await axios.delete(`http://localhost:3001/projects/${id}`);
                navigate('/dashboard/portfolio');
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    if (loading) return <div className="p-8 text-white">Memuat proyek...</div>;

    return (
        <React.Fragment>
            <header className="h-16 bg-[#111722]/80 backdrop-blur-md border-b border-[#1e293b] flex items-center justify-between px-8 sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard/portfolio" className="flex items-center gap-2 text-[#92a4c9] hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                        <span className="text-sm font-medium">Kembali ke Portofolio</span>
                    </Link>
                    <div className="h-6 w-px bg-[#324467]"></div>
                    <h2 className="text-lg font-bold text-white tracking-tight">Edit Proyek</h2>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-[#92a4c9] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">history</span>
                        Terakhir diperbarui: Baru saja
                    </span>
                    <button className="px-4 py-1.5 bg-surface-dark hover:bg-surface-dark-hover border border-[#324467] rounded-lg text-sm text-white font-medium transition-colors">
                        Pratinjau
                    </button>
                    <button onClick={handleSubmit} disabled={saving} className="px-4 py-1.5 bg-primary hover:bg-blue-600 rounded-lg text-sm text-white font-medium transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-50">
                        {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-5xl mx-auto space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-[#111722] rounded-xl border border-[#324467] p-6">
                                <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">edit_document</span>
                                    Metadata Proyek
                                </h3>
                                <div className="space-y-4">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-medium text-[#92a4c9] mb-1.5">Judul Proyek</label>
                                            <input
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                className="w-full bg-[#0b0f17] border border-[#324467] rounded-lg px-4 py-2.5 text-white placeholder-[#64748b] focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                                                type="text"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-medium text-[#92a4c9] mb-1.5">Kategori</label>
                                                <select
                                                    name="category"
                                                    value={formData.category}
                                                    onChange={handleChange}
                                                    className="w-full bg-[#0b0f17] border border-[#324467] rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                                                >
                                                    <option value="">Pilih Kategori</option>
                                                    {categories.map(cat => (
                                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-xs font-medium text-[#92a4c9] mb-1.5">Tanggal Acara <span className="text-xs font-normal text-gray-500">(Opsional)</span></label>
                                                    <input
                                                        name="date"
                                                        value={formData.date || ''}
                                                        onChange={handleChange}
                                                        className="w-full bg-[#0b0f17] border border-[#324467] rounded-lg px-4 py-2.5 text-white placeholder-[#64748b] focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                                                        type="date"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-[#92a4c9] mb-1.5">Lokasi <span className="text-xs font-normal text-gray-500">(Opsional)</span></label>
                                                    <div className="relative">
                                                        <input
                                                            name="location"
                                                            value={formData.location || ''}
                                                            onChange={handleChange}
                                                            className="w-full bg-[#0b0f17] border border-[#324467] rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-[#64748b] focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                                                            type="text"
                                                        />
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]">
                                                            <span className="material-symbols-outlined text-[18px]">location_on</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-[#92a4c9] mb-1.5">Deskripsi <span className="text-xs font-normal text-gray-500">(Opsional)</span></label>
                                                <textarea
                                                    name="description"
                                                    value={formData.description || ''}
                                                    onChange={handleChange}
                                                    className="w-full bg-[#0b0f17] border border-[#324467] rounded-lg px-4 py-2.5 text-white placeholder-[#64748b] focus:ring-1 focus:ring-primary focus:border-primary text-sm h-32 resize-none"
                                                    placeholder="Jelaskan acara, peralatan yang digunakan, dan sorotan utama..."
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#111722] rounded-xl border border-[#324467] p-6">
                                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">image</span>
                                    Gambar Sampul
                                </h3>
                                <div className="space-y-4">
                                    <div className="aspect-video bg-[#1a2332] rounded-lg border border-[#324467] flex items-center justify-center relative overflow-hidden group">
                                        {formData.coverImage ? (
                                            <img
                                                alt="Cover Preview"
                                                className="w-full h-full object-cover opacity-100 group-hover:opacity-40 transition-opacity"
                                                src={getImageUrl(formData.coverImage)}
                                            />
                                        ) : (
                                            <div className="text-[#64748b] flex flex-col items-center">
                                                <span className="material-symbols-outlined text-4xl mb-2">image</span>
                                                <span className="text-sm">Tidak ada gambar sampul</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-[#111722] rounded-xl border border-[#324467] p-6">
                                <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">visibility</span>
                                    Pengaturan Visibilitas
                                </h3>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-[#1a2332] border border-[#324467]">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-white font-medium">Akses Publik</span>
                                        <span className="text-xs text-[#92a4c9]">Terlihat di situs web publik</span>
                                    </div>
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            name="visible"
                                            type="checkbox"
                                            checked={formData.visible}
                                            onChange={handleChange}
                                            className="sr-only peer"
                                        />
                                        <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                                <div className="mt-4 pt-4 border-t border-[#1e293b]">
                                    <div className="flex justify-between items-center text-sm mb-2">
                                        <span className="text-[#92a4c9]">Dilihat</span>
                                        <span className="text-white font-mono">1,248</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-[#92a4c9]">Item Galeri</span>
                                        <span className="text-white font-mono">{formData.gallery.length}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[#111722] rounded-xl border border-[#324467] p-6">
                                <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-red-500">delete_forever</span>
                                    Zona Bahaya
                                </h3>
                                <p className="text-xs text-[#92a4c9] mb-4">Setelah Anda menghapus proyek, tidak ada jalan kembali. Harap pastikan.</p>
                                <button onClick={handleDelete} className="w-full py-2 border border-red-900/50 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg text-sm font-medium transition-colors">
                                    Hapus Proyek
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#111722] rounded-xl border border-[#324467] overflow-hidden">
                        <div className="p-6 border-b border-[#324467] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">photo_library</span>
                                    Gambar Galeri
                                </h3>
                                <p className="text-[#92a4c9] text-xs mt-1">Kelola foto untuk acara ini. Seret untuk mengurutkan ulang.</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 bg-[#1a2332] hover:bg-[#232f48] text-[#92a4c9] hover:text-white border border-[#324467] rounded-lg text-sm font-medium transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">select_all</span>
                                    Pilih Semua
                                </button>
                                <button onClick={() => setShowGalleryModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20">
                                    <span className="material-symbols-outlined text-[18px]">upload</span>
                                    Unggah Baru
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                {formData.gallery.map((item, index) => (
                                    <div key={index} className="bg-[#1a2332] rounded-lg border border-[#324467] p-2 relative group">
                                        <div className="flex gap-3">
                                            <div className="w-20 h-20 flex-shrink-0 bg-black/50 rounded overflow-hidden">
                                                <img src={getImageUrl(item.url || item)} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <input
                                                    type="text"
                                                    placeholder="Deskripsi 1"
                                                    value={item.caption1 || ''}
                                                    onChange={(e) => handleGalleryCaptionChange(index, 'caption1', e.target.value)}
                                                    className="w-full bg-[#0b0f17] border border-[#324467] rounded px-2 py-1 text-xs text-white placeholder-[#64748b] focus:ring-1 focus:ring-primary focus:border-transparent"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Deskripsi 2"
                                                    value={item.caption2 || ''}
                                                    onChange={(e) => handleGalleryCaptionChange(index, 'caption2', e.target.value)}
                                                    className="w-full bg-[#0b0f17] border border-[#324467] rounded px-2 py-1 text-xs text-white placeholder-[#64748b] focus:ring-1 focus:ring-primary focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteGalleryImage(index)}
                                            className="absolute top-1 right-1 p-1 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <span className="material-symbols-outlined text-[14px]">close</span>
                                        </button>
                                    </div>
                                ))}
                                <label className="border-2 border-dashed border-[#324467] hover:border-primary/50 bg-[#1a2332]/30 rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer transition-colors group">
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
                        </div>
                        <div className="px-6 py-4 border-t border-[#324467] bg-[#111722]">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-[#92a4c9]">
                                    {formData.gallery.length} gambar di galeri. Ukuran maks: 5MB.
                                </span>
                                <div className="flex items-center gap-2">
                                    <button className="p-1 rounded text-[#92a4c9] hover:text-white hover:bg-[#1a2332] disabled:opacity-50">
                                        <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                    </button>
                                    <span className="text-xs text-white font-medium">Halaman 1 dari 1</span>
                                    <button className="p-1 rounded text-[#92a4c9] hover:text-white hover:bg-[#1a2332] disabled:opacity-50" disabled>
                                        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <GalleryModal
                isOpen={showGalleryModal}
                onClose={() => setShowGalleryModal(false)}
                project={formData}
            />
        </React.Fragment >
    );
};

export default ProjectEdit;
