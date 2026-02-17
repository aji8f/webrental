import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { getImageUrl } from '../../utils/imageUtils';
import { useCart } from '../../contexts/CartContext';
import { toast } from 'react-hot-toast';
import API_BASE_URL from '../../config/api';

const ServiceDetail = () => {
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [relatedServices, setRelatedServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState('');
    const [quantity, setQuantity] = useState(1);

    const { addToCart } = useCart();

    useEffect(() => {
        fetchServiceData();
        window.scrollTo(0, 0);
    }, [id]);

    const fetchServiceData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/services/${id}`);
            setService(response.data);
            setActiveImage(response.data.image);

            // Fetch related services if any
            if (response.data.relatedIds && response.data.relatedIds.length > 0) {
                const relatedPromises = response.data.relatedIds.map(rId =>
                    axios.get(`${API_BASE_URL}/services/${rId}`).catch(() => null)
                );
                const relatedResponses = await Promise.all(relatedPromises);
                const validRelated = relatedResponses
                    .filter(res => res && res.data)
                    .map(res => res.data);
                setRelatedServices(validRelated);
            }
        } catch (error) {
            console.error('Error fetching service:', error);
            toast.error('Gagal memuat detail layanan');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!service) return;
        addToCart(service, quantity);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen pt-24 text-center text-white">
                <h2 className="text-2xl font-bold">Layanan tidak ditemukan</h2>
                <Link to="/services" className="text-primary hover:underline mt-4 inline-block">Kembali ke Layanan</Link>
            </div>
        );
    }

    // Default specs for demo if not present
    const specs = service.specs || {
        "Kondisi": "Prima",
        "Ketersediaan": "Ready Stock",
        "Area Layanan": "JABODETABEK",
        "Minimal Sewa": "1 Hari"
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                {/* Breadcrumb */}
                <nav className="flex mb-8 text-sm text-gray-400">
                    <Link to="/services" className="hover:text-primary transition-colors">Layanan</Link>
                    <span className="mx-2 text-gray-600">/</span>
                    <span className="capitalize">{service.category || 'Equipment'}</span>
                    <span className="mx-2 text-gray-600">/</span>
                    <span className="text-white truncate max-w-[200px]">{service.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Images */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-surface-dark border border-border-dark group relative">
                            <img
                                src={getImageUrl(activeImage)}
                                alt={service.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                        </div>

                        {/* Gallery Thumbnails */}
                        {service.gallery && service.gallery.length > 0 && (
                            <div className="grid grid-cols-4 gap-4">
                                <button
                                    onClick={() => setActiveImage(service.image)}
                                    className={`aspect-square rounded-xl overflow-hidden border-2 bg-surface-dark ${activeImage === service.image ? 'border-primary' : 'border-border-dark opacity-60 hover:opacity-100'}`}
                                >
                                    <img src={getImageUrl(service.image)} alt="Main" className="w-full h-full object-cover" />
                                </button>
                                {service.gallery.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(img)}
                                        className={`aspect-square rounded-xl overflow-hidden border-2 bg-surface-dark ${activeImage === img ? 'border-primary' : 'border-border-dark opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={getImageUrl(img)} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Details */}
                    <div className="lg:col-span-5 flex flex-col">
                        <div className="mb-3 inline-flex items-center self-start px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 capitalize">
                            {service.category} Equipment
                        </div>
                        <h1 className="text-4xl font-serif font-bold text-white mb-4 leading-tight">{service.name}</h1>

                        <div className="flex items-end gap-3 mb-6">
                            <div className="flex flex-col">
                                <span className="text-gray-400 text-sm">Mulai dari</span>
                                <span className="text-3xl font-bold text-white leading-none">
                                    Rp {service.price_daily?.toLocaleString('id-ID')}
                                </span>
                            </div>
                            <span className="text-gray-500 text-lg mb-0.5">/{service.unit || 'hari'}</span>
                        </div>

                        <div className="prose prose-invert max-w-none text-gray-400 mb-8 leading-relaxed">
                            <p className="whitespace-pre-line">{service.description}</p>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {Object.entries(specs).map(([key, value]) => (
                                <div key={key} className="flex flex-col p-4 rounded-xl bg-background-dark border border-border-dark">
                                    <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1 camel-case">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </span>
                                    <span className="text-white font-medium text-sm">{value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Action Controls */}
                        <div className="mt-auto space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-border-dark bg-surface-dark rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-3 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">remove</span>
                                    </button>
                                    <input
                                        className="w-12 bg-transparent border-none text-center text-white focus:ring-0 text-sm"
                                        type="number"
                                        value={quantity}
                                        readOnly
                                    />
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="p-3 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">add</span>
                                    </button>
                                </div>
                                <span className="text-gray-500 text-sm">unit (estimasi)</span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-grow bg-primary hover:bg-primary-hover text-white font-bold py-4 px-8 rounded-xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined">add_shopping_cart</span>
                                    Tambah ke Penawaran
                                </button>
                                <a
                                    href="https://wa.me/628123456789"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-surface-dark border border-border-dark hover:border-white/20 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined">chat</span>
                                    Konsultasi
                                </a>
                            </div>
                            <p className="text-[11px] text-gray-500 text-center">Harga dan ketersediaan dapat berubah sewaktu-waktu. Hubungi kami untuk detail pasti.</p>
                        </div>
                    </div>
                </div>

                {/* Additional Details Section */}
                {service.usageGuide && (
                    <div className="mt-20 border-t border-border-dark pt-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4">Aplikasi Event</h3>
                                <ul className="space-y-4 text-gray-400">
                                    {service.usageGuide.applications?.map((app, idx) => (
                                        <li key={idx} className="flex gap-3">
                                            <span className="material-symbols-outlined text-primary">check_circle</span>
                                            <div>
                                                <span className="text-white font-semibold">{app.title}:</span> {app.description}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-surface-dark/50 rounded-2xl p-6 border border-border-dark">
                                <h3 className="text-xl font-bold text-white mb-4">Paket Termasuk</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    {service.usageGuide.included?.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-gray-400">
                                            <span className="material-symbols-outlined text-gray-500 text-sm">inventory_2</span>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Related Services */}
                {relatedServices.length > 0 && (
                    <section className="mt-24">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-serif font-bold text-white">Rekomendasi Lainnya</h2>
                            <Link to="/services" className="text-primary hover:text-primary-hover font-bold text-sm flex items-center gap-1">
                                Lihat Semua
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedServices.map(rel => (
                                <Link key={rel.id} to={`/services/${rel.id}`} className="group bg-surface-dark rounded-xl overflow-hidden border border-border-dark hover:border-primary/50 transition-all duration-300 block">
                                    <div className="aspect-video w-full overflow-hidden">
                                        <img
                                            src={getImageUrl(rel.image)}
                                            alt={rel.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <div className="text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">{rel.category}</div>
                                        <h4 className="text-white font-bold text-sm mb-3 group-hover:text-primary transition-colors truncate">{rel.name}</h4>
                                        <div className="flex items-center justify-between">
                                            <span className="text-white text-sm font-bold">Rp {rel.price_daily?.toLocaleString('id-ID')}</span>
                                            <span className="size-8 rounded-lg bg-border-dark hover:bg-primary transition-colors flex items-center justify-center text-white">
                                                <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ServiceDetail;
