import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { getImageUrl } from '../utils/imageUtils';
import API_BASE_URL from '../config/api';

const ServiceForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        inventory_count: 0,
        price_daily: 0,
        service_type: 'per/hari',
        description: '',
        status: 'published',
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
        if (isEditMode) {
            fetchServiceDetails();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/categories`);
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchServiceDetails = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/services/${id}`);
            setFormData(response.data);
            if (response.data.image) {
                setImagePreview(response.data.image);
            }
        } catch (error) {
            console.error("Error fetching service details:", error);
        }
    };

    const handleChange = (e) => {
        const { id, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'number' ? parseFloat(value) : value
        }));
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (file) => {
        if (file.size > 5 * 1024 * 1024) {
            setError('Ukuran file melebihi batas 5MB.');
            return;
        }
        setError('');

        const uploadFormData = new FormData();
        uploadFormData.append('image', file);

        try {
            const response = await axios.post(`${API_BASE_URL}/upload`, uploadFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const imageUrl = response.data.url;
            setImagePreview(imageUrl);
            setFormData(prev => ({ ...prev, image: imageUrl }));
        } catch (error) {
            console.error('Error uploading image:', error);
            setError('Gagal mengunggah gambar. Silakan coba lagi.');
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        setFormData(prev => ({ ...prev, image: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await axios.put(`${API_BASE_URL}/services/${id}`, formData);
            } else {
                const newService = { ...formData, id: `SR-2023-${Math.floor(Math.random() * 1000)}` };
                await axios.post(`${API_BASE_URL}/services`, newService);
            }
            navigate('/dashboard/services');
        } catch (error) {
            console.error("Error saving service:", error);
        }
    };

    return (
        <>
            <header className="h-16 bg-[#111722]/80 backdrop-blur-md border-b border-[#1e293b] flex items-center justify-between px-8 sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-[#92a4c9] hover:text-white transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h2 className="text-xl font-bold text-white tracking-tight">{isEditMode ? 'Edit Detail Layanan' : 'Tambah Layanan Baru'}</h2>
                    {isEditMode && <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">{id}</span>}
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="bg-[#111722] border border-[#324467] rounded-xl p-6">
                            <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">edit_note</span>
                                Detail Item
                            </h3>

                            {/* Image Upload Section */}
                            <div className="mb-8">
                                <label className="block text-sm font-medium text-[#92a4c9] mb-2">Gambar Layanan</label>
                                <div
                                    className={`relative border-2 border-dashed rounded-xl p-8 transition-colors text-center ${dragActive ? 'border-primary bg-primary/5' : 'border-[#324467] bg-[#1a2332]/50 hover:bg-[#1a2332]'}`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        type="file"
                                        id="image-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />

                                    {imagePreview ? (
                                        <div className="relative inline-block">
                                            <img src={getImageUrl(imagePreview)} alt="Preview" className="h-48 rounded-lg object-cover shadow-lg border border-[#324467]" />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">close</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                                            <div className="bg-[#111722] p-3 rounded-full border border-[#324467] mb-2">
                                                <span className="material-symbols-outlined text-[#92a4c9] text-3xl">cloud_upload</span>
                                            </div>
                                            <p className="text-white text-sm font-medium">Klik untuk unggah atau seret dan lepas</p>
                                            <p className="text-[#64748b] text-xs">SVG, PNG, JPG, atau GIF (maks. 5MB)</p>
                                        </label>
                                    )}

                                    {dragActive && (
                                        <div className="absolute inset-0 bg-primary/10 rounded-xl pointer-events-none flex items-center justify-center backdrop-blur-[1px]">
                                            <p className="text-primary font-bold">Lepas gambar di sini</p>
                                        </div>
                                    )}
                                </div>
                                {error && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span> {error}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-sm font-medium text-[#92a4c9]" htmlFor="name">Nama Item</label>
                                    <input
                                        className="w-full bg-[#1a2332] border border-[#324467] text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 placeholder-[#64748b]"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="cth. JBL VRX932 Line Array"
                                        type="text"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#92a4c9]" htmlFor="category">Kategori</label>
                                    <div className="relative">
                                        <select
                                            className="w-full bg-[#1a2332] border border-[#324467] text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 appearance-none"
                                            id="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option disabled value="">Pilih kategori</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.slug}>{category.name}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#92a4c9]">
                                            <span className="material-symbols-outlined">expand_more</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#92a4c9]" htmlFor="inventory_count">Jumlah Inventaris</label>
                                    <input
                                        className="w-full bg-[#1a2332] border border-[#324467] text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 placeholder-[#64748b]"
                                        id="inventory_count"
                                        value={formData.inventory_count}
                                        onChange={handleChange}
                                        min="0"
                                        placeholder="0"
                                        type="number"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#92a4c9]" htmlFor="price_daily">Harga (IDR)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-[#92a4c9]">Rp</span>
                                        </div>
                                        <input
                                            className="w-full bg-[#1a2332] border border-[#324467] text-white text-sm rounded-lg focus:ring-primary focus:border-primary block pl-10 p-2.5 placeholder-[#64748b]"
                                            id="price_daily"
                                            value={formData.price_daily}
                                            onChange={handleChange}
                                            placeholder="0.00"
                                            type="number"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#92a4c9]" htmlFor="service_type">Tipe Layanan</label>
                                    <div className="relative">
                                        <select
                                            className="w-full bg-[#1a2332] border border-[#324467] text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 appearance-none"
                                            id="service_type"
                                            value={formData.service_type || 'per/hari'}
                                            onChange={handleChange}
                                        >
                                            <option value="per/unit">per/unit</option>
                                            <option value="per/hari">per/hari</option>
                                            <option value="per/meter">per/meter</option>
                                            <option value="per/paket">per/paket</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#92a4c9]">
                                            <span className="material-symbols-outlined">expand_more</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-sm font-medium text-[#92a4c9]" htmlFor="description">Deskripsi</label>
                                    <textarea
                                        className="w-full bg-[#1a2332] border border-[#324467] text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 placeholder-[#64748b]"
                                        id="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Spesifikasi teknis detail dan deskripsi..."
                                        rows="4"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#324467] mt-8">
                            <button onClick={() => navigate(-1)} className="px-6 py-2.5 rounded-lg border border-[#324467] bg-[#1a2332] text-[#92a4c9] font-medium hover:text-white hover:bg-[#232f48] transition-colors" type="button">
                                Batal
                            </button>
                            <button className="px-6 py-2.5 rounded-lg bg-primary hover:bg-blue-600 text-white font-medium shadow-lg shadow-blue-900/20 transition-all flex items-center gap-2" type="submit">
                                <span className="material-symbols-outlined text-[20px]">check</span>
                                {isEditMode ? 'Simpan Perubahan' : 'Simpan dan Terbitkan'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
};

export default ServiceForm;
