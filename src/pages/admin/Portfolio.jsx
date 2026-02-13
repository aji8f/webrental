import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Portfolio = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All Projects');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProjects();
        // Poll for updates every 3 seconds for "almost realtime" feel
        const interval = setInterval(fetchProjects, 3000);
        return () => clearInterval(interval);
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:3001/projects');
            setProjects(response.data);
            if (loading) setLoading(false);
        } catch (error) {
            console.error('Error fetching projects:', error);
            if (loading) setLoading(false);
        }
    };

    const toggleVisibility = async (id, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            await axios.patch(`http://localhost:3001/projects/${id}`, { visible: newStatus });
            setProjects(projects.map(project =>
                project.id === id ? { ...project, visible: newStatus } : project
            ));
        } catch (error) {
            console.error('Error toggling visibility:', error);
            alert('Failed to update visibility status');
        }
    };

    const filteredProjects = projects.filter(project => {
        const matchesFilter = filter === 'All Projects' || project.category.toLowerCase() === filter.toLowerCase();
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.location?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const categories = ['All Projects', 'Corporate', 'Wedding', 'Concert'];

    return (
        <React.Fragment>
            <header className="h-16 bg-[#111722]/80 backdrop-blur-md border-b border-[#1e293b] flex items-center justify-between px-8 sticky top-0 z-10">
                <h2 className="text-xl font-bold text-white tracking-tight">Manajemen Portofolio</h2>
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
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Daftar Proyek</h1>
                            <p className="text-[#92a4c9] text-sm mt-1">Kelola visibilitas proyek dan perbarui aset galeri untuk tampilan publik.</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#92a4c9]">
                                    <span className="material-symbols-outlined text-[20px]">search</span>
                                </span>
                                <input
                                    className="bg-[#111722] border border-[#324467] text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:ring-primary focus:border-primary w-full sm:w-64 placeholder-[#64748b]"
                                    placeholder="Cari proyek..."
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Link to="/dashboard/portfolio/new" className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-900/20">
                                <span className="material-symbols-outlined text-[20px]">add</span>
                                Tambah Proyek
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 border-b border-[#324467] pb-4 overflow-x-auto">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${filter === cat ? 'bg-[#1a2332] text-white border border-[#324467] hover:border-primary' : 'text-[#92a4c9] hover:text-white hover:bg-[#1a2332]'}`}
                            >
                                {cat === 'All Projects' ? 'Semua Proyek' : cat}
                            </button>
                        ))}
                        <button className="ml-auto text-[#92a4c9] hover:text-white text-sm flex items-center gap-1">
                            <span className="material-symbols-outlined text-[18px]">filter_list</span> Filter
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project) => (
                            <div key={project.id} className="group bg-[#111722] rounded-xl border border-[#324467] overflow-hidden hover:border-primary/50 transition-all duration-300">
                                <div className="h-48 bg-gray-800 relative overflow-hidden">
                                    <img
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        src={project.coverImage || project.image || 'https://via.placeholder.com/400x300'}
                                    />
                                    <div className="absolute top-3 right-3 flex gap-2">
                                        <span className="bg-[#111722]/80 backdrop-blur text-white text-xs px-2 py-1 rounded border border-[#324467]">
                                            {project.galleryCount || 0} Foto
                                        </span>
                                    </div>
                                    <div className="absolute top-3 left-3">
                                        <span className={`bg-primary/90 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm`}>
                                            {project.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="text-white font-bold text-lg leading-tight group-hover:text-primary transition-colors">{project.title}</h3>
                                            <div className="flex items-center gap-2 mt-1 text-[#92a4c9] text-xs">
                                                <span className="material-symbols-outlined text-[14px]">location_on</span>
                                                <span>{project.location || 'Lokasi Tidak Diketahui'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#1e293b]">
                                        <div className="flex items-center gap-4">
                                            <label className="inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={project.visible !== false} // Default to true if undefined
                                                    onChange={() => toggleVisibility(project.id, project.visible)}
                                                />
                                                <div className="relative w-9 h-5 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                                <span className="ms-2 text-xs font-medium text-[#92a4c9]">{project.visible !== false ? 'Terlihat' : 'Tersembunyi'}</span>
                                            </label>
                                            <div className="flex items-center gap-1.5 text-[#92a4c9] bg-[#1a2332] px-2 py-1 rounded border border-[#324467]/50" title="Total Views">
                                                <span className="material-symbols-outlined text-[16px]">visibility</span>
                                                <span className="text-xs font-mono font-medium">{String(project.views || 0)}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">

                                            <Link to={`/dashboard/portfolio/${project.id}/edit`} className="p-1.5 text-[#92a4c9] hover:text-white hover:bg-[#1a2332] rounded transition-colors" title="Edit Details">
                                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination - Static for now as per HTML */}
                    <div className="flex items-center justify-between border-t border-[#324467] pt-4">
                        <p className="text-sm text-[#92a4c9]">
                            Menampilkan <span className="font-medium text-white">1</span> sampai <span className="font-medium text-white">{filteredProjects.length}</span> dari <span className="font-medium text-white">{filteredProjects.length}</span> hasil
                        </p>
                        <nav className="flex items-center gap-1">
                            <button className="p-2 rounded hover:bg-[#1a2332] text-[#92a4c9] disabled:opacity-50">
                                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                            </button>
                            <button className="px-3 py-1 rounded bg-primary text-white text-sm font-medium">1</button>
                            <button className="p-2 rounded hover:bg-[#1a2332] text-[#92a4c9]">
                                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                            </button>
                        </nav>
                    </div>
                </div>
            </main>
        </React.Fragment>
    );
};

export default Portfolio;
