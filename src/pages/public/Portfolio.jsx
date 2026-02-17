import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import useSettings from '../../hooks/useSettings';
import { getImageUrl } from '../../utils/imageUtils';
import API_BASE_URL from '../../config/api';

const Portfolio = () => {
    const { settings } = useSettings();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All Projects');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/projects`);
                setProjects(response.data.filter(p => p.visible !== false)); // Only show visible projects
                setLoading(false);
            } catch (error) {
                console.error('Error fetching projects:', error);
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const categories = ['All Projects', 'LED Screens', 'Smart TVs', 'Projectors', 'Digital Signage'];

    const categoryMapping = {
        'All Projects': 'all',
        'LED Screens': 'Layar LED / Videotron',
        'Smart TVs': 'Smart TV & Display',
        'Projectors': 'Proyektor & Screen',
        'Digital Signage': 'Digital Signage'
    };

    const filteredProjects = projects.filter(project => {
        const mappedCategory = categoryMapping[filter];
        const matchesFilter = filter === 'All Projects' || project.category === mappedCategory;
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.location?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <>
            <section className="relative min-h-[400px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-background-dark/90 via-background-dark/70 to-background-dark z-10"></div>
                    <div
                        className="w-full h-full bg-cover bg-center"
                        data-alt="Event setup background"
                        style={{
                            backgroundImage: `url('${settings?.heroImages?.portfolio || "https://lh3.googleusercontent.com/aida-public/AB6AXuAaKe4KMikPm67Wqbg2jfQs1zcceJhFpOOGrAYFS_EMPRShv4CnaVQNo1Dl1Upu-9KZgqJVOzmfRUyhEY45RlyQG8eW29SjvADIgyvKakcet657LbjaRRa70_laK8qdxRNDyk38RPFLD_amLcBNPgFTFF9aoyA6E6wKjajtFG0aG5-dRv1p_1hym4ATk8EskyJEwpFvidSfrjRDrLW3aeTEGcF0uIwm6GirWnbDoog1HY6qBpBBBJ5NV0BL0UeCmD70EbcJCjrEvKg"}')`
                        }}
                    >
                    </div>
                </div>
                <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 text-center mt-8">
                    <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-dark border border-border-dark text-xs font-medium text-primary mb-2">
                            <span className="material-symbols-outlined text-sm">photo_camera</span>
                            Kesuksesan Masa Lalu Kami
                        </div>
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight hero-text-shadow">
                            Portofolio Proyek
                        </h1>
                        <p className="text-lg text-gray-300 max-w-2xl font-light leading-relaxed">
                            Jelajahi galeri acara kami yang telah terlaksana, mulai dari pertemuan perusahaan yang intim hingga festival publik berskala besar.
                        </p>
                    </div>
                </div>
            </section>
            <section className="pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-10 relative z-30">
                <div className="flex flex-col md:flex-row justify-between items-center bg-surface-dark/80 backdrop-blur-md border border-border-dark rounded-xl p-4 mb-12 shadow-2xl">
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto mb-4 md:mb-0">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${filter === cat ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-transparent hover:bg-white/5 text-gray-300 hover:text-white'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-64">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-gray-500 text-sm">search</span>
                        </span>
                        <input
                            className="block w-full pl-10 pr-3 py-2 border border-border-dark rounded-lg leading-5 bg-background-dark text-gray-300 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
                            placeholder="Cari proyek..."
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center text-white py-12">Memuat proyek...</div>
                ) : (
                    <div className="columns-1 md:columns-2 lg:columns-4 gap-8 space-y-8">
                        {filteredProjects.map((project) => (
                            <div key={project.id} className="break-inside-avoid mb-8 group relative bg-surface-dark rounded-xl overflow-hidden border border-border-dark hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 cursor-pointer">
                                <Link to={`/portfolio/${project.id}`} className="block relative w-full overflow-hidden">
                                    <div className="absolute top-4 right-4 z-10">
                                        <span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-white/10 capitalize">{project.category}</span>
                                    </div>
                                    <img
                                        alt={project.title}
                                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 min-h-[300px]"
                                        src={getImageUrl(project.coverImage || project.image) || 'https://via.placeholder.com/400x300'}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark to-transparent opacity-60"></div>
                                    <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                                            <span className="capitalize">{project.category}</span>
                                        </div>
                                        <h3 className="text-2xl font-serif font-bold text-white mb-1 group-hover:text-primary transition-colors">{project.title}</h3>
                                        <div className="flex items-center text-gray-300 text-sm">
                                            <span className="material-symbols-outlined text-sm mr-1">location_on</span>
                                            {project.location || 'Lokasi Tidak Diketahui'}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-center mt-12">
                    <button className="flex items-center justify-center gap-2 bg-transparent border border-border-dark hover:bg-surface-dark text-gray-300 hover:text-white text-sm font-bold py-3 px-8 rounded-lg transition-all duration-200">
                        <span className="material-symbols-outlined text-base">refresh</span>
                        Muat Lebih Banyak Proyek
                    </button>
                </div>
            </section>
            <section className="py-16 px-4 border-t border-border-dark bg-surface-dark/30">
                <div className="max-w-5xl mx-auto bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-10 md:p-16 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-serif relative z-10">Terkesan dengan pekerjaan kami?</h2>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8 relative z-10">Mari ciptakan sesuatu yang spektakuler untuk acara Anda berikutnya. Tim kami siap mewujudkan visi Anda.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                        <button className="bg-white text-primary font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
                            Minta Penawaran
                        </button>
                        <button className="bg-transparent border border-white/30 text-white font-bold py-3 px-8 rounded-lg hover:bg-white/10 transition-colors">
                            Unduh PDF Portofolio
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Portfolio;
