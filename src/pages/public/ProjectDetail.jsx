import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { getImageUrl } from '../../utils/imageUtils';
import API_BASE_URL from '../../config/api';
import SEO from '../../components/SEO';

const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/projects/${id}`);
                setProject(response.data);
                setLoading(false);

                // Increment views silently
                try {
                    const currentViews = response.data.views || 0;
                    await axios.patch(`${API_BASE_URL}/projects/${id}`, {
                        views: currentViews + 1
                    });
                } catch (viewError) {
                    console.error('Error incrementing views:', viewError);
                }
            } catch (error) {
                console.error('Error fetching project:', error);
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="text-white text-xl">Memuat detail proyek...</div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center flex-col gap-4">
                <div className="text-white text-xl">Proyek tidak ditemukan</div>
                <Link to="/portfolio" className="text-primary hover:text-primary-hover">Kembali ke Portofolio</Link>
            </div>
        );
    }

    return (
        <React.Fragment>
            <SEO
                title={`Proyek: ${project.title}`}
                description={`${project.description?.substring(0, 150) || `Portofolio proyek acara ${project.title} oleh Vendor Visual.`}`}
                image={getImageUrl(project.coverImage || project.image)}
            />
            {/* Added top padding to account for fixed navbar */}
            <main className="flex-grow pt-28 pb-20 bg-background-dark min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative w-full h-[60vh] min-h-[500px] rounded-2xl overflow-hidden mb-16 group">
                        <img
                            src={getImageUrl(project.coverImage || project.image) || 'https://via.placeholder.com/1920x1080'}
                            alt={project.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent"></div>
                        <div className="absolute inset-0 bg-black/30"></div>

                        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                            <Link to="/portfolio" className="absolute top-8 left-8 inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 hover:bg-black/40">
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                                Kembali ke Portofolio
                            </Link>

                            <div className="max-w-4xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-xs font-bold text-primary mb-6 backdrop-blur-md">
                                    <span className="material-symbols-outlined text-sm">category</span>
                                    <span className="capitalize">Acara {project.category}</span>
                                </div>
                                <h1 className="font-serif text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6 drop-shadow-lg">
                                    {project.title}
                                </h1>
                                {project.description && (
                                    <p className="text-lg md:text-xl text-gray-200 font-light leading-relaxed max-w-2xl mb-8 drop-shadow-md">
                                        {project.description}
                                    </p>
                                )}

                                <div className="flex flex-wrap gap-6 text-sm text-gray-300">
                                    {project.date && (
                                        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                                            <span className="material-symbols-outlined text-primary text-base">calendar_today</span>
                                            <span>{new Date(project.date).toLocaleDateString('id-ID', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                    )}
                                    {project.location && (
                                        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                                            <span className="material-symbols-outlined text-primary text-base">location_on</span>
                                            <span>{project.location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gallery Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                        {/* Gallery Images */}
                        {project.gallery && project.gallery.length > 0 ? (
                            project.gallery.map((item, index) => {
                                const isObject = typeof item === 'object' && item !== null;
                                const imgUrl = isObject ? item.url : item;
                                const title = isObject ? (item.caption1 || `Foto Acara ${index + 1}`) : `Foto Acara ${index + 1}`;
                                const subtitle = isObject ? (item.caption2 || 'Galeri') : 'Galeri';

                                return (
                                    <div key={index} className="group">
                                        <div className="relative overflow-hidden rounded-xl bg-surface-dark border border-border-dark mb-4 aspect-[4/3] cursor-pointer">
                                            <img
                                                alt={title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                src={getImageUrl(imgUrl)}
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                        </div>
                                        <div className="text-center px-4">
                                            <h3 className="text-white font-serif font-medium text-xl mb-1 group-hover:text-primary transition-colors">{title}</h3>
                                            <p className="text-gray-500 text-sm tracking-wide uppercase">{subtitle}</p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full text-center py-20 text-gray-500">
                                <span className="material-symbols-outlined text-5xl mb-4 opacity-50">photo_library</span>
                                <p>Tidak ada gambar galeri tambahan yang tersedia.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <section className="py-16 px-4 border-t border-border-dark bg-surface-dark/30">
                <div className="max-w-5xl mx-auto bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-10 md:p-16 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-serif relative z-10">Suka dengan apa yang Anda lihat?</h2>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8 relative z-10">Mari diskusikan bagaimana kami dapat membawa tingkat profesionalisme ini ke acara Anda berikutnya.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                        <button className="bg-white text-primary font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
                            Mulai Proyek Anda
                        </button>
                        <button className="bg-transparent border border-white/30 text-white font-bold py-3 px-8 rounded-lg hover:bg-white/10 transition-colors">
                            Lihat Lebih Banyak Proyek
                        </button>
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
};

export default ProjectDetail;
