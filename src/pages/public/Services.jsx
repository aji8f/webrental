import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getImageUrl } from '../../utils/imageUtils';
import useSettings from '../../hooks/useSettings';
import { useCart } from '../../contexts/CartContext';
import { toast } from 'react-hot-toast';
import API_BASE_URL from '../../config/api';
import SEO from '../../components/SEO';

const ITEMS_PER_PAGE = 15;

const Services = () => {
    const { settings } = useSettings();
    const { addToCart } = useCart();
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('Semua Peralatan');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchServices();
        fetchCategories();
    }, []);

    // Reset page when category changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory]);

    const fetchServices = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/services`);
            setServices(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching services:", error);
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/categories`);
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const filteredServices = selectedCategory === 'Semua Peralatan'
        ? services
        : services.filter(service => service.category === selectedCategory);

    const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedServices = filteredServices.slice(startIndex, endIndex);

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (currentPage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <>
            <SEO
                title="Katalog Rental Visual Lengkap"
                description="Telusuri inventaris lengkap peralatan event support kami, mulai dari TV LED berbagai ukuran, Videotron indoor/outdoor, hingga proyektor resolusi tinggi."
            />
            <section className="relative min-h-[400px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-background-dark/90 via-background-dark/70 to-background-dark z-10"></div>
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{
                            backgroundImage: `url('${settings?.heroImages?.services || "https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=2062&auto=format&fit=crop"}')`
                        }}
                    >
                    </div>
                </div>
                <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 text-center mt-10">
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">Katalog Rental Visual</h1>
                    <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">Telusuri inventaris lengkap peralatan event support kami: Videotron, TV, dan Proyektor.</p>
                </div>
            </section>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="w-full lg:w-64 flex-shrink-0">
                        <div className="sticky top-24 bg-surface-dark rounded-xl border border-border-dark p-5">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-white text-lg">Filter</h3>
                                <button className="text-xs text-primary hover:text-primary-hover font-medium">Atur Ulang</button>
                            </div>
                            <div className="mb-6">
                                <div className="relative">
                                    <input className="w-full bg-background-dark border border-border-dark text-white text-sm rounded-lg pl-9 pr-3 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-500 outline-none transition-colors" placeholder="Cari item..." type="text" />
                                    <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-gray-500 text-[18px]">search</span>
                                </div>
                            </div>
                            <div className="mb-8">
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Kategori</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            checked={selectedCategory === 'Semua Peralatan'}
                                            onChange={() => setSelectedCategory('Semua Peralatan')}
                                            className="form-checkbox rounded bg-background-dark border-border-dark text-primary focus:ring-primary focus:ring-offset-background-dark h-4 w-4"
                                            type="checkbox"
                                        />
                                        <span className={`text-sm group-hover:text-primary transition-colors ${selectedCategory === 'Semua Peralatan' ? 'text-white' : 'text-gray-400'}`}>Semua Peralatan</span>
                                    </label>
                                    {categories.map((cat) => (
                                        <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                checked={selectedCategory === cat.slug}
                                                onChange={() => setSelectedCategory(cat.slug)}
                                                className="form-checkbox rounded bg-background-dark border-border-dark text-primary focus:ring-primary focus:ring-offset-background-dark h-4 w-4"
                                                type="checkbox"
                                            />
                                            <span className={`text-sm group-hover:text-white transition-colors capitalize ${selectedCategory === cat.slug ? 'text-white' : 'text-gray-400'}`}>{cat.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Rentang Harga</h4>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="relative w-full">
                                        <span className="absolute left-2 top-2 text-gray-500 text-xs">Rp</span>
                                        <input className="w-full bg-background-dark border border-border-dark text-white text-xs rounded-md pl-6 py-2 focus:border-primary focus:ring-0 outline-none" placeholder="Min" type="number" />
                                    </div>
                                    <span className="text-gray-500">-</span>
                                    <div className="relative w-full">
                                        <span className="absolute left-2 top-2 text-gray-500 text-xs">Rp</span>
                                        <input className="w-full bg-background-dark border border-border-dark text-white text-xs rounded-md pl-6 py-2 focus:border-primary focus:ring-0 outline-none" placeholder="Maks" type="number" />
                                    </div>
                                </div>
                                <button className="w-full bg-surface-dark border border-border-dark hover:border-primary text-gray-300 hover:text-white text-xs font-semibold py-2 rounded-lg transition-colors">
                                    Terapkan Filter
                                </button>
                            </div>
                        </div>
                    </aside>
                    <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <p className="text-sm text-gray-400">
                                Menampilkan <span className="text-white font-semibold">{filteredServices.length > 0 ? `${startIndex + 1}-${Math.min(endIndex, filteredServices.length)}` : '0'}</span> dari <span className="text-white font-semibold">{filteredServices.length}</span> hasil
                            </p>
                            <div className="flex items-center gap-3">
                                <label className="text-sm text-gray-400 whitespace-nowrap">Urutkan berdasarkan:</label>
                                <select className="bg-surface-dark border border-border-dark text-white text-sm rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer">
                                    <option>Paling Populer</option>
                                    <option>Harga: Rendah ke Tinggi</option>
                                    <option>Harga: Tinggi ke Rendah</option>
                                    <option>Terbaru</option>
                                </select>
                            </div>
                        </div>
                        {loading ? (
                            <div className="text-white text-center py-20">Memuat layanan...</div>
                        ) : filteredServices.length === 0 ? (
                            <div className="text-gray-400 text-center py-20">Tidak ada layanan ditemukan dalam kategori ini.</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {paginatedServices.map(service => (
                                    <Link to={`/services/${service.id}`} key={service.id} className="group bg-surface-dark rounded-xl overflow-hidden border border-border-dark hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 flex flex-col h-full cursor-pointer">
                                        <div className="aspect-video w-full overflow-hidden relative">
                                            <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${service.image || 'https://via.placeholder.com/400x300?text=No+Image'}'` }}></div>
                                            {service.featured && (
                                                <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded">
                                                    HOT
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5 flex flex-col flex-grow">
                                            <div className="mb-1 text-xs font-medium text-primary capitalize">{service.category}</div>
                                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">{service.name}</h3>
                                            <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">{service.description}</p>
                                            <div className="pt-4 border-t border-border-dark mt-auto">
                                                <div className="flex items-end justify-between">
                                                    <div>
                                                        <span className="text-gray-500 text-xs block mb-0.5">Mulai dari</span>
                                                        <span className="text-white font-bold text-lg">
                                                            Rp {parseInt(service.price_daily).toLocaleString('id-ID')}
                                                            <span className="text-xs font-normal text-gray-500">/{service.service_type || service.unit || 'hari'}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-12 flex justify-center">
                                <nav className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className={`p-2 rounded-lg bg-surface-dark border border-border-dark transition-colors ${currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:border-primary'}`}
                                    >
                                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                                    </button>
                                    {getPageNumbers().map((page, idx) =>
                                        page === '...' ? (
                                            <span key={`ellipsis-${idx}`} className="text-gray-500 px-2">...</span>
                                        ) : (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`w-10 h-10 rounded-lg font-medium text-sm flex items-center justify-center transition-colors ${currentPage === page
                                                        ? 'bg-primary text-white'
                                                        : 'bg-surface-dark border border-border-dark text-gray-400 hover:text-white hover:border-primary'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    )}
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className={`p-2 rounded-lg bg-surface-dark border border-border-dark transition-colors ${currentPage === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:border-primary'}`}
                                    >
                                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                                    </button>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Services;
