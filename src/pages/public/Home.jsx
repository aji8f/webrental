import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import useSettings from '../../hooks/useSettings';
import { getImageUrl } from '../../utils/imageUtils';
import API_BASE_URL from '../../config/api';
import SEO from '../../components/SEO';
import { trackContactClick } from '../../utils/trackClick';

const Home = () => {
    const { settings } = useSettings();
    const [recentProjects, setRecentProjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [aboutData, setAboutData] = useState(null);

    useEffect(() => {
        const fetchRecentProjects = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/projects?_limit=4&_sort=date&_order=desc`);
                setRecentProjects(response.data.filter(p => p.visible !== false));
            } catch (error) {
                console.error('Error fetching recent projects:', error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/categories`);
                setCategories(response.data.filter(c => c.type === 'service'));
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchAboutData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/about`);
                setAboutData(response.data);
            } catch (error) {
                console.error('Error fetching about data:', error);
            }
        };

        fetchRecentProjects();
        fetchCategories();
        fetchAboutData();
    }, []);

    return (
        <>
            <SEO
                title="Sewa LED Screen & Smart TV"
                description="Hadirkan visual memukau di setiap momen dengan sewa LED Videotron, Smart TV, dan Proyektor terbaik di Jakarta. Konsultasi gratis untuk event Anda."
            />
            <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-background-dark/80 via-background-dark/50 to-background-dark z-10"></div>
                    <div
                        className="w-full h-full bg-cover bg-center"
                        data-alt="Grand ballroom setup for a wedding with chandeliers and stage"
                        style={{
                            backgroundImage: `url('${getImageUrl(settings?.heroImages?.home) || "https://lh3.googleusercontent.com/aida-public/AB6AXuA923wnQ1Hta8_FZMJguXiPko29-IIiRPkKPsYz5zlPTv8d3Y4bSHD2q11Oo0ONsrwtP2WPkjpK_mrvoxnrQVmZ7oG2bn521JAkW_39H8qmJsylYQi4LZ4KiIC6N1iDqEG40FOWO1XDxDEX_yzyrNVsZ5U9uPDOI6F1jgVdU4bG-ktoTMVy7vp5f7LFnwArAarMIhtYz37ByG4wr-8CFqk17HRah5s4ZZyAwtC3KT0ZR0by3_MksBWxDng1qBEwIPxRkpfllDSAYgg"}')`
                        }}
                    >
                    </div>
                </div>
                <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 text-center mt-10">
                    <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-dark border border-border-dark text-xs font-medium text-primary mb-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Penyewaan Multimedia & Peralatan Event Terlengkap
                        </div>
                        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight hero-text-shadow">
                            Hadirkan Visual Memukau di Setiap Momen
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 max-w-2xl font-light leading-relaxed">
                            Mitra terbaik untuk sewa LED Videotron, Smart TV, Proyektor, dan Digital Signage. Kami menjamin kualitas visual terbaik untuk pameran, konferensi, dan acara spesial Anda.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center">
                            <Link to="/services" className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white text-base font-bold h-12 px-8 rounded-lg transition-all duration-200 shadow-[0_0_20px_rgba(19,91,236,0.3)] hover:shadow-[0_0_30px_rgba(19,91,236,0.5)]">
                                Lihat Katalog Alat
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                            <a href={`https://wa.me/${settings?.contact?.phone?.replace(/\+/g, '').replace(/\s/g, '') || ''}`} target="_blank" rel="noreferrer" onClick={() => trackContactClick('whatsapp', 'home')} className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 text-white text-base font-bold h-12 px-8 rounded-lg transition-all duration-200">
                                Konsultasi Gratis
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Summary Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-border-dark">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-dark border border-border-dark text-xs font-medium text-primary w-fit">
                            {aboutData?.homeSummary?.tagline || 'Tentang Kami'}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white font-serif">
                            {aboutData?.homeSummary?.title || 'Solusi Visual Terintegrasi untuk Event Anda'}
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            {aboutData?.homeSummary?.description1 || 'Kami adalah penyedia layanan penyewaan peralatan multimedia yang berfokus pada kualitas dan keandalan. Dengan pengalaman menangani ratusan event, kami mengerti betapa pentingnya aspek visual dalam kesuksesan sebuah acara.'}
                        </p>
                        <p className="text-gray-400 leading-relaxed">
                            {aboutData?.homeSummary?.description2 || 'Layanan kami mencakup instalasi profesional, dukungan teknis di lokasi, dan peralatan teknologi terkini. Mulai dari Videotron P2.9 yang tajam untuk backdrop panggung, hingga Kiosk Digital interaktif untuk registrasi tamu, kami siap mendukung kebutuhan Anda.'}
                        </p>
                        <div className="pt-4">
                            <Link to="/about" className="inline-flex items-center text-primary hover:text-primary-hover font-semibold transition-colors group">
                                Pelajari Lebih Lanjut
                                <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border-dark aspect-video">
                            <img
                                alt="Crew setting up LED Videotron"
                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                                src={aboutData?.homeSummary?.image || getImageUrl(settings?.heroImages?.about) || "https://lh3.googleusercontent.com/aida-public/AB6AXuAaKe4KMikPm67Wqbg2jfQs1zcceJhFpOOGrAYFS_EMPRShv4CnaVQNo1Dl1Upu-9KZgqJVOzmfRUyhEY45RlyQG8eW29SjvADIgyvKakcet657LbjaRRa70_laK8qdxRNDyk38RPFLD_amLcBNPgFTFF9aoyA6E6wKjajtFG0aG5-dRv1p_1hym4ATk8EskyJEwpFvidSfrjRDrLW3aeTEGcF0uIwm6GirWnbDoog1HY6qBpBBBJ5NV0BL0UeCmD70EbcJCjrEvKg"}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {settings?.clientLogos && settings.clientLogos.length > 0 && (
                <section className="border-y border-border-dark bg-surface-dark/50">
                    <div className="max-w-7xl mx-auto px-4 py-8">
                        <p className="text-center text-sm font-medium text-gray-500 mb-6 uppercase tracking-wider">Dipercaya oleh penyelenggara acara terkemuka</p>
                        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                            {settings.clientLogos.map((logo, index) => (
                                <div key={index} className="flex items-center justify-center h-12">
                                    <img
                                        src={getImageUrl(logo.image)}
                                        alt={logo.name}
                                        className="max-h-12 max-w-[160px] object-contain"
                                        title={logo.name}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-serif">Penyewaan Peralatan Visual</h2>
                        <p className="text-gray-400 text-lg">Kami menyediakan teknologi tampilan visual terkini untuk memastikan konten acara Anda terlihat tajam dan profesional.</p>
                    </div>
                    <Link to="/services" className="text-primary hover:text-primary-hover font-medium flex items-center gap-1 group whitespace-nowrap">
                        Lihat daftar harga lengkap
                        <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {categories.filter(c => c.image).slice(0, 4).length > 0 ? (
                        categories.filter(c => c.image).slice(0, 4).map((category) => (
                            <div key={category.id} className="group relative bg-surface-dark rounded-xl overflow-hidden border border-border-dark hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
                                <div className="aspect-video w-full overflow-hidden">
                                    <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110" data-alt={category.name} style={{ backgroundImage: `url('${category.image}')` }}></div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <span className="material-symbols-outlined">{category.icon || 'category'}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white">{category.name}</h3>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-2">
                                        {category.description}
                                    </p>
                                    <div className="mb-6 pt-4 border-t border-white/5">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Mulai Dari</p>
                                        <p className="text-lg font-bold text-white">{category.startingPrice || 'Hubungi Kami'} </p>
                                    </div>
                                    <Link to="/services" className="inline-flex items-center text-sm font-semibold text-white group-hover:text-primary transition-colors">
                                        Lihat Detail
                                        <span className="material-symbols-outlined text-base ml-1">chevron_right</span>
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 text-center text-gray-400">Loading services...</div>
                    )}
                </div>
            </section>

            {/* Recent Projects Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border-dark">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-dark border border-border-dark text-xs font-medium text-primary mb-4">
                            Kesuksesan Terbaru
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-serif">Proyek Unggulan</h2>
                        <p className="text-gray-400 text-lg">Lihat bagaimana kami mewujudkan visi dengan keahlian teknis dan peralatan premium kami.</p>
                    </div>
                    <Link to="/portfolio" className="text-primary hover:text-primary-hover font-medium flex items-center gap-1 group whitespace-nowrap">
                        Lihat semua proyek
                        <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {recentProjects.length > 0 ? (
                        recentProjects.map((project) => (
                            <div key={project.id} className="group relative bg-surface-dark rounded-xl overflow-hidden border border-border-dark hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 cursor-pointer">
                                <Link to={`/portfolio/${project.id}`} className="block relative w-full overflow-hidden">
                                    <div className="absolute top-4 right-4 z-10">
                                        <span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-white/10 capitalize">{project.category}</span>
                                    </div>
                                    <div className="aspect-[4/3] w-full overflow-hidden">
                                        <img
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            src={getImageUrl(project.coverImage || project.image) || 'https://via.placeholder.com/400x300'}
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark to-transparent opacity-80"></div>
                                    <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                                            <span className="material-symbols-outlined text-sm">calendar_today</span> {new Date(project.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                        <h3 className="text-xl font-serif font-bold text-white mb-1 group-hover:text-primary transition-colors">{project.title}</h3>
                                        <div className="flex items-center text-gray-300 text-sm">
                                            <span className="material-symbols-outlined text-sm mr-1">location_on</span>
                                            {project.location || 'Unknown Location'}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-4 text-center py-12 text-gray-500">
                            Memuat proyek terbaru...
                        </div>
                    )}
                </div>
            </section>

            <section className="py-16 px-4">
                <div className="max-w-5xl mx-auto bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-10 md:p-16 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-serif relative z-10">Merencanakan Pameran atau Konferensi?</h2>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8 relative z-10">Dapatkan penawaran komprehensif untuk kebutuhan sewa Smart TV, LED Screen, dan Proyektor Anda. Kami menyediakan instalasi dan dukungan teknis penuh.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                        <Link to="/services" className="bg-white text-primary font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors shadow-lg align-middle inline-flex items-center justify-center">
                            Dapatkan Daftar Harga
                        </Link>
                        <Link to="/contact" className="bg-transparent border border-white/30 text-white font-bold py-3 px-8 rounded-lg hover:bg-white/10 transition-colors align-middle inline-flex items-center justify-center">
                            Konsultasi dengan Ahli
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
