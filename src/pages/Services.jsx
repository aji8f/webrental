import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getImageUrl } from '../utils/imageUtils';
import API_BASE_URL from '../config/api';

const Services = () => {
    const [services, setServices] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/services`);
            setServices(response.data);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus layanan ini?')) {
            try {
                await axios.delete(`${API_BASE_URL}/services/${id}`);
                fetchServices(); // Refresh list
            } catch (error) {
                console.error("Error deleting service:", error);
            }
        }
    };

    return (
        <>
            <header className="h-16 bg-[#111722]/80 backdrop-blur-md border-b border-[#1e293b] flex items-center justify-between px-8 sticky top-0 z-10">
                <h2 className="text-xl font-bold text-white tracking-tight">Manajemen Layanan</h2>
                <div className="flex items-center gap-4">
                    <Link to="/dashboard/services/new" className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-900/20">
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Layanan Baru
                    </Link>
                    <div className="h-8 w-px bg-[#324467] mx-2"></div>
                    <button className="p-2 text-[#92a4c9] hover:text-white transition-colors relative">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#111722]"></span>
                    </button>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Filters - Simplified for now */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#111722] border border-[#324467] p-4 rounded-xl">
                        <div className="relative w-full md:w-96">
                            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#92a4c9]">search</span>
                            <input className="w-full bg-[#1a2332] border border-[#324467] text-white text-sm rounded-lg focus:ring-primary focus:border-primary block pl-10 p-2.5 placeholder-[#64748b]" placeholder="Cari layanan..." type="text" />
                        </div>
                        {/* Additional filters would go here */}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {services.map(service => (
                            <div key={service.id} className="bg-[#111722] border border-[#324467] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
                                <div className="aspect-video w-full overflow-hidden relative">
                                    {service.image ? (
                                        <img src={getImageUrl(service.image)} alt={service.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-[#1a2332]">
                                            <span className="material-symbols-outlined text-[#92a4c9] text-4xl">inventory_2</span>
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm
                                            ${service.status === 'published' ? 'bg-[#0bda5e]/20 text-[#0bda5e] border-[#0bda5e]/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                                            {service.status === 'published' ? 'Diterbitkan' : 'Konsep'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-[10px] font-bold text-primary uppercase tracking-wider">{service.category}</div>
                                        <div className="text-[#92a4c9] text-xs">ID: {service.id}</div>
                                    </div>
                                    <h3 className="text-white font-bold text-lg mb-1 truncate" title={service.name}>{service.name}</h3>
                                    <p className="text-[#64748b] text-sm mb-4 line-clamp-2 min-h-[40px]">{service.description}</p>

                                    <div className="flex items-center justify-between border-t border-[#324467] pt-4 mt-2">
                                        <div>
                                            <div className="text-[#92a4c9] text-xs">Harga / Hari</div>
                                            <div className="text-white font-bold">Rp {service.price_daily?.toLocaleString('id-ID')}</div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => navigate(`/dashboard/services/${service.id}/edit`)} className="p-2 text-[#92a4c9] hover:text-white hover:bg-[#324467] rounded-lg transition-colors" title="Edit">
                                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                            </button>
                                            <button onClick={() => handleDelete(service.id)} className="p-2 text-[#92a4c9] hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
};

export default Services;
