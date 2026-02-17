import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import API_BASE_URL from '../../config/api';

const Leads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('quotes'); // 'quotes' or 'inquiries'
    const [expandedMessageId, setExpandedMessageId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [leadToDelete, setLeadToDelete] = useState(null);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/leads?_sort=createdAt&_order=desc`);
            setLeads(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching leads:', error);
            toast.error('Failed to load leads');
            setLoading(false);
        }
    };

    const confirmDelete = (id) => {
        setLeadToDelete(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!leadToDelete) return;

        try {
            await axios.delete(`${API_BASE_URL}/leads/${leadToDelete}`);
            setLeads(leads.filter(lead => lead.id !== leadToDelete));
            toast.success('Prospek berhasil dihapus');
            setShowDeleteModal(false);
            setLeadToDelete(null);
        } catch (error) {
            console.error('Error deleting lead:', error);
            toast.error('Gagal menghapus prospek');
        }
    };

    const handleCopy = (text, type) => {
        navigator.clipboard.writeText(text);
        toast.success(`${type} disalin ke papan klip`);
    };

    const toggleMessage = (id) => {
        setExpandedMessageId(expandedMessageId === id ? null : id);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(date);
    };

    const filteredLeads = leads.filter(lead => {
        if (activeTab === 'quotes') return lead.eventType === 'Quote Request';
        return lead.eventType !== 'Quote Request';
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <React.Fragment>
            <header className="h-16 bg-[#111722]/80 backdrop-blur-md border-b border-[#1e293b] flex items-center justify-between px-8 sticky top-0 z-10">
                <h2 className="text-xl font-bold text-white tracking-tight">Manajemen Prospek</h2>
                <div className="flex items-center gap-4">
                    <button className="p-2 text-[#92a4c9] hover:text-white transition-colors relative">
                        <span className="material-symbols-outlined">notifications</span>
                        {/* <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#111722]"></span> */}
                    </button>
                    <div className="h-8 w-px bg-[#324467]"></div>
                    <div className="flex items-center gap-2 text-sm text-[#92a4c9]">
                        <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                        <span>{new Date().toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-8 relative">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h1 className="text-2xl font-bold text-white">Manajemen Prospek</h1>
                        <button
                            onClick={fetchLeads}
                            className="p-2 bg-surface-dark border border-border-dark rounded-lg hover:bg-surface-dark-hover transition-colors text-gray-400 hover:text-white"
                            title="Refresh"
                        >
                            <span className="material-symbols-outlined">refresh</span>
                        </button>
                    </div>

                    <div className="flex space-x-1 bg-surface-dark p-1 rounded-xl border border-border-dark w-fit">
                        <button
                            onClick={() => setActiveTab('quotes')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'quotes'
                                ? 'bg-primary text-white shadow-lg'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            Permintaan Penawaran
                            <span className={`ml-2 text-xs py-0.5 px-2 rounded-full ${activeTab === 'quotes' ? 'bg-white/20' : 'bg-white/10'}`}>
                                {leads.filter(l => l.eventType === 'Quote Request').length}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('inquiries')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'inquiries'
                                ? 'bg-primary text-white shadow-lg'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            Pertanyaan Umum
                            <span className={`ml-2 text-xs py-0.5 px-2 rounded-full ${activeTab === 'inquiries' ? 'bg-white/20' : 'bg-white/10'}`}>
                                {leads.filter(l => l.eventType !== 'Quote Request').length}
                            </span>
                        </button>
                    </div>

                    <div className="bg-surface-dark rounded-xl border border-border-dark overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#192233] border-b border-[#324467]">
                                    {activeTab === 'quotes' ? (
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Terkirim</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tanggal Acara</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Info Kontak</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Lokasi / Tempat</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-1/3">Layanan Diminta</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-40">Tanggal</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Nama</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Kontak</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-1/3">Pesan</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
                                        </tr>
                                    )}
                                </thead>
                                <tbody className="divide-y divide-[#324467]">
                                    {filteredLeads.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                                Tidak ada {activeTab === 'quotes' ? 'permintaan penawaran' : 'pertanyaan'} ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredLeads.map((lead) => (
                                            <tr key={lead.id} className="hover:bg-[#1a2332] transition-colors group">
                                                {/* Common Date Column */}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 align-top">
                                                    {formatDate(lead.createdAt)}
                                                </td>

                                                {activeTab === 'quotes' ? (
                                                    <>
                                                        {/* Event Date (Parsed from message if possible) */}
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white align-top font-medium">
                                                            {(() => {
                                                                const dateMatch = lead.message?.match(/Event Date: (.*?)(\n|$)/);
                                                                return dateMatch ? dateMatch[1] : 'N/A';
                                                            })()}
                                                        </td>
                                                        {/* Contact Info (Name + Phone copy) */}
                                                        <td className="px-6 py-4 whitespace-nowrap align-top">
                                                            <div className="text-sm font-medium text-white mb-1">{lead.firstName} {lead.lastName}</div>
                                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                                <span className="material-symbols-outlined text-[14px]">call</span>
                                                                {lead.phone}
                                                                <button
                                                                    onClick={() => handleCopy(lead.phone, 'Phone')}
                                                                    className="text-gray-500 hover:text-primary transition-colors"
                                                                    title="Copy Phone"
                                                                >
                                                                    <span className="material-symbols-outlined text-[14px]">content_copy</span>
                                                                </button>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                                                                <span className="material-symbols-outlined text-[14px]">mail</span>
                                                                {lead.email}
                                                                <button
                                                                    onClick={() => handleCopy(lead.email, 'Email')}
                                                                    className="text-gray-500 hover:text-primary transition-colors"
                                                                    title="Copy Email"
                                                                >
                                                                    <span className="material-symbols-outlined text-[14px]">content_copy</span>
                                                                </button>
                                                            </div>
                                                        </td>
                                                        {/* Location / Venue */}
                                                        <td className="px-6 py-4 text-sm text-gray-300 align-top">
                                                            <div className="flex items-start gap-2">
                                                                <span className="material-symbols-outlined text-gray-500 text-[18px] mt-0.5">location_on</span>
                                                                <span>{lead.company && lead.company !== 'N/A' ? lead.company : 'N/A'}</span>
                                                            </div>
                                                        </td>
                                                        {/* Services Requested */}
                                                        <td className="px-6 py-4 text-sm text-gray-300 align-top">
                                                            <div className="flex flex-col gap-1">
                                                                {lead.services && lead.services.length > 0 ? (
                                                                    lead.services.map((service, idx) => (
                                                                        <div key={idx} className="flex items-start gap-2">
                                                                            <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">check_circle</span>
                                                                            <span>{service}</span>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <span className="text-gray-500 italic">Tidak ada layanan terdaftar</span>
                                                                )}
                                                            </div>
                                                            {/* Show Notes expandable if needed */}
                                                            {lead.message && (
                                                                <div className="mt-2 pt-2 border-t border-gray-700/50">
                                                                    <div className="text-xs text-gray-500 mb-1 font-medium">Catatan:</div>
                                                                    <div className={`text-xs text-gray-400 whitespace-pre-line ${expandedMessageId === lead.id ? '' : 'line-clamp-2'}`}>
                                                                        {lead.message.replace(/Event Date:.*(\n|$)/, '').replace(/Location:.*(\n|$)/, '').trim()}
                                                                    </div>
                                                                    {lead.message.length > 50 && (
                                                                        <button
                                                                            onClick={() => toggleMessage(lead.id)}
                                                                            className="text-primary text-xs hover:underline mt-1 focus:outline-none"
                                                                        >
                                                                            {expandedMessageId === lead.id ? 'Tampilkan lebih sedikit' : 'Tampilkan lebih banyak'}
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        {/* General Inquiry Columns */}
                                                        <td className="px-6 py-4 whitespace-nowrap align-top">
                                                            <div className="text-sm font-medium text-white">{lead.firstName} {lead.lastName}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap align-top">
                                                            <div className="flex flex-col gap-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm text-gray-300">{lead.email}</span>
                                                                    <button
                                                                        onClick={() => handleCopy(lead.email, 'Email')}
                                                                        className="text-gray-500 hover:text-primary transition-colors"
                                                                        title="Copy Email"
                                                                    >
                                                                        <span className="material-symbols-outlined text-[16px]">content_copy</span>
                                                                    </button>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm text-gray-300">{lead.phone}</span>
                                                                    <button
                                                                        onClick={() => handleCopy(lead.phone, 'Phone')}
                                                                        className="text-gray-500 hover:text-primary transition-colors"
                                                                        title="Copy Phone"
                                                                    >
                                                                        <span className="material-symbols-outlined text-[16px]">content_copy</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-300 align-top">
                                                            <div className="relative">
                                                                <div className={`text-sm text-gray-400 whitespace-pre-line ${expandedMessageId === lead.id ? '' : 'line-clamp-3'}`}>
                                                                    {lead.message}
                                                                </div>
                                                                {lead.message && lead.message.length > 150 && (
                                                                    <button
                                                                        onClick={() => toggleMessage(lead.id)}
                                                                        className="text-primary text-xs hover:underline mt-2 focus:outline-none"
                                                                    >
                                                                        {expandedMessageId === lead.id ? 'Tampilkan lebih sedikit' : 'Baca selengkapnya'}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </>
                                                )}

                                                {/* Common Actions Column */}
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-top">
                                                    <button
                                                        onClick={() => confirmDelete(lead.id)}
                                                        className="text-red-500 hover:text-red-400 opacity-60 hover:opacity-100 transition-opacity p-2 hover:bg-red-500/10 rounded-lg"
                                                        title="Delete Lead"
                                                    >
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-surface-dark border border-border-dark rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all scale-100">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-red-500/10 rounded-full text-red-500">
                                    <span className="material-symbols-outlined text-2xl">warning</span>
                                </div>
                                <h3 className="text-xl font-bold text-white">Hapus Prospek</h3>
                            </div>
                            <p className="text-gray-400 mb-6">
                                Apakah Anda yakin ingin menghapus prospek ini? Tindakan ini tidak dapat dibatalkan.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors shadow-lg shadow-red-600/20"
                                >
                                    Hapus Prospek
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </React.Fragment>
    );
};

export default Leads;
