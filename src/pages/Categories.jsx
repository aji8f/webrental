import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({ name: '', slug: '', description: '', count: 0, type: 'service' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/categories`);
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
            try {
                await axios.delete(`${API_BASE_URL}/categories/${id}`);
                fetchCategories();
            } catch (error) {
                console.error("Error deleting category:", error);
            }
        }
    };

    const handleEdit = (category) => {
        setCurrentCategory(category);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setCurrentCategory({ name: '', slug: '', description: '', count: 0, type: 'service' });
        setIsEditMode(false);
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await axios.put(`${API_BASE_URL}/categories/${currentCategory.id}`, currentCategory);
            } else {
                const newCategory = { ...currentCategory, id: `CAT-${Math.floor(Math.random() * 10000)}` };
                await axios.post(`${API_BASE_URL}/categories`, newCategory);
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            console.error("Error saving category:", error);
        }
    };

    const filteredCategories = categories;

    return (
        <>
            <header className="h-16 bg-[#111722]/80 backdrop-blur-md border-b border-[#1e293b] flex items-center justify-between px-8 sticky top-0 z-10">
                <h2 className="text-xl font-bold text-white tracking-tight">Manajemen Kategori</h2>
                <div className="flex items-center gap-4">
                    <button onClick={handleAddNew} className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-900/20">
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Kategori Baru
                    </button>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto space-y-6">

                    <div className="bg-[#111722] border border-[#324467] rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#192233] border-b border-[#324467]">
                                    <tr>
                                        <th className="px-6 py-4 text-[#92a4c9] text-xs font-semibold uppercase tracking-wider">Nama</th>
                                        <th className="px-6 py-4 text-[#92a4c9] text-xs font-semibold uppercase tracking-wider">Slug</th>
                                        <th className="px-6 py-4 text-[#92a4c9] text-xs font-semibold uppercase tracking-wider">Deskripsi</th>
                                        <th className="px-6 py-4 text-[#92a4c9] text-xs font-semibold uppercase tracking-wider">Jumlah</th>
                                        <th className="px-6 py-4 text-[#92a4c9] text-xs font-semibold uppercase tracking-wider text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#324467]">
                                    {filteredCategories.length > 0 ? (
                                        filteredCategories.map(category => (
                                            <tr key={category.id} className="hover:bg-[#1a2332] transition-colors group">
                                                <td className="px-6 py-4 text-white font-medium">{category.name}</td>
                                                <td className="px-6 py-4 text-[#92a4c9] text-sm">{category.slug}</td>
                                                <td className="px-6 py-4 text-[#92a4c9] text-sm max-w-xs truncate">{category.description}</td>
                                                <td className="px-6 py-4 text-white text-sm">{category.count}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleEdit(category)} className="p-1.5 text-[#92a4c9] hover:text-white hover:bg-[#324467] rounded transition-colors" title="Edit">
                                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                                        </button>
                                                        <button onClick={() => handleDelete(category.id)} className="p-1.5 text-[#92a4c9] hover:text-red-400 hover:bg-red-900/20 rounded transition-colors" title="Delete">
                                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-[#92a4c9]">
                                                Tidak ada kategori ditemukan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-[#111722] border border-[#324467] rounded-xl p-6 w-full max-w-md m-4 shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">{isEditMode ? 'Edit Kategori' : 'Tambah Kategori Baru'}</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            {/* Type field removed as requested - defaulting to 'service' internally or just ignored */}
                            <input type="hidden" value="service" />
                            <div>
                                <label className="block text-sm font-medium text-[#92a4c9] mb-1">Nama</label>
                                <input
                                    type="text"
                                    value={currentCategory.name}
                                    onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                                    className="w-full bg-[#1a2332] border border-[#324467] text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#92a4c9] mb-1">Slug</label>
                                <input
                                    type="text"
                                    value={currentCategory.slug}
                                    onChange={(e) => setCurrentCategory({ ...currentCategory, slug: e.target.value })}
                                    className="w-full bg-[#1a2332] border border-[#324467] text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#92a4c9] mb-1">Deskripsi</label>
                                <textarea
                                    value={currentCategory.description}
                                    onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                                    className="w-full bg-[#1a2332] border border-[#324467] text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5"
                                    rows="3"
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-[#92a4c9] hover:text-white transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Categories;
