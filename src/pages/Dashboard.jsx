import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        quoteRequests: 0,
        generalInquiries: 0,
        totalServices: 0,
        totalProjects: 0,
        contactClicks: { total: 0, today: 0, byType: {} }
    });
    const [recentLeads, setRecentLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [leadsRes, servicesRes, projectsRes, clickStatsRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/leads?_sort=createdAt&_order=desc`),
                    axios.get(`${API_BASE_URL}/services`),
                    axios.get(`${API_BASE_URL}/projects`),
                    axios.get(`${API_BASE_URL}/contact-clicks/stats`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
                    }).catch(() => ({ data: { total: 0, today: 0, byType: {} } }))
                ]);

                const leads = leadsRes.data;
                const services = servicesRes.data;
                const projects = projectsRes.data;

                // Calculate Stats
                const quoteRequests = leads.filter(l => l.eventType === 'Quote Request').length;
                const generalInquiries = leads.filter(l => l.eventType !== 'Quote Request').length;

                setStats({
                    quoteRequests,
                    generalInquiries,
                    totalServices: services.length,
                    totalProjects: projects.length,
                    contactClicks: clickStatsRes?.data || { total: 0, today: 0, byType: {} }
                });

                // Get latest 5 leads for Recent Activity
                setRecentLeads(leads.slice(0, 5));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                setLoading(false);
            }
        };

        fetchData();
        // Poll every 10 seconds to keep dashboard fresh
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="p-8 text-white flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <>
            <header className="h-16 bg-[#111722]/80 backdrop-blur-md border-b border-[#1e293b] flex items-center justify-between px-8 sticky top-0 z-10">
                <h2 className="text-xl font-bold text-white tracking-tight">Ikhtisar Dasbor</h2>
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
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Quote Requests */}
                        <div className="bg-[#111722] rounded-xl border border-[#324467] p-6 flex flex-col justify-between h-32 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-symbols-outlined text-6xl text-primary">request_quote</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <p className="text-[#92a4c9] text-sm font-medium">Permintaan Penawaran</p>
                            </div>
                            <div className="flex items-end gap-2">
                                <h3 className="text-white text-3xl font-bold">{stats.quoteRequests}</h3>
                                <span className="text-xs text-[#92a4c9] mb-1">Total Diterima</span>
                            </div>
                        </div>

                        {/* General Inquiries */}
                        <div className="bg-[#111722] rounded-xl border border-[#324467] p-6 flex flex-col justify-between h-32 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-symbols-outlined text-6xl text-purple-500">mail</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <p className="text-[#92a4c9] text-sm font-medium">Pertanyaan Umum</p>
                            </div>
                            <div className="flex items-end gap-2">
                                <h3 className="text-white text-3xl font-bold">{stats.generalInquiries}</h3>
                                <span className="text-xs text-[#92a4c9] mb-1">Pesan</span>
                            </div>
                        </div>

                        {/* Services */}
                        <div className="bg-[#111722] rounded-xl border border-[#324467] p-6 flex flex-col justify-between h-32 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-symbols-outlined text-6xl text-blue-400">inventory_2</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <p className="text-[#92a4c9] text-sm font-medium">Total Layanan</p>
                            </div>
                            <div className="flex items-end gap-2">
                                <h3 className="text-white text-3xl font-bold">{stats.totalServices}</h3>
                                <span className="text-xs text-[#92a4c9] mb-1">Item Aktif</span>
                            </div>
                        </div>

                        {/* Projects */}
                        <div className="bg-[#111722] rounded-xl border border-[#324467] p-6 flex flex-col justify-between h-32 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-symbols-outlined text-6xl text-green-400">collections</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <p className="text-[#92a4c9] text-sm font-medium">Portofolio</p>
                            </div>
                            <div className="flex items-end gap-2">
                                <h3 className="text-white text-3xl font-bold">{stats.totalProjects}</h3>
                                <span className="text-xs text-[#92a4c9] mb-1">Proyek Ditampilkan</span>
                            </div>
                        </div>

                        {/* Contact Clicks */}
                        <div className="bg-[#111722] rounded-xl border border-[#324467] p-6 flex flex-col justify-between h-32 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-symbols-outlined text-6xl text-orange-400">touch_app</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <p className="text-[#92a4c9] text-sm font-medium">Klik Kontak</p>
                                {stats.contactClicks.today > 0 && (
                                    <span className="text-xs bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full">+{stats.contactClicks.today} hari ini</span>
                                )}
                            </div>
                            <div className="flex items-end gap-2">
                                <h3 className="text-white text-3xl font-bold">{stats.contactClicks.total}</h3>
                                <div className="flex gap-2 mb-1">
                                    {stats.contactClicks.byType?.whatsapp > 0 && <span className="text-xs text-green-400">WA: {stats.contactClicks.byType.whatsapp}</span>}
                                    {stats.contactClicks.byType?.email > 0 && <span className="text-xs text-blue-400">Email: {stats.contactClicks.byType.email}</span>}
                                    {stats.contactClicks.byType?.phone > 0 && <span className="text-xs text-purple-400">Tel: {stats.contactClicks.byType.phone}</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white">Aktivitas Terbaru</h3>
                                <Link to="/dashboard/leads" className="text-primary text-sm font-medium hover:text-blue-400">Lihat Semua Prospek</Link>
                            </div>
                            <div className="bg-[#111722] border border-[#324467] rounded-xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-[#192233] border-b border-[#324467]">
                                            <tr>
                                                <th className="px-6 py-4 text-[#92a4c9] text-xs font-semibold uppercase tracking-wider">Tipe</th>
                                                <th className="px-6 py-4 text-[#92a4c9] text-xs font-semibold uppercase tracking-wider">Kontak</th>
                                                <th className="px-6 py-4 text-[#92a4c9] text-xs font-semibold uppercase tracking-wider">Tanggal</th>
                                                <th className="px-6 py-4 text-[#92a4c9] text-xs font-semibold uppercase tracking-wider text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#324467]">
                                            {recentLeads.length > 0 ? (
                                                recentLeads.map(lead => (
                                                    <tr key={lead.id} className="hover:bg-[#1a2332] transition-colors">
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                                ${lead.eventType === 'Quote Request' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                                                                <span className="material-symbols-outlined text-[14px]">
                                                                    {lead.eventType === 'Quote Request' ? 'request_quote' : 'mail'}
                                                                </span>
                                                                {lead.eventType === 'Quote Request' ? 'Penawaran' : 'Pertanyaan'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-white text-sm font-medium">{lead.firstName} {lead.lastName}</span>
                                                                <span className="text-[#92a4c9] text-xs">{lead.email}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-300">
                                                            {formatDate(lead.createdAt)}
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                                                                Baru
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-8 text-center text-[#92a4c9]">
                                                        Tidak ada aktivitas terbaru ditemukan.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions & Status */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-lg font-bold text-white">Aksi Cepat</h3>
                            <div className="bg-[#111722] border border-[#324467] rounded-xl p-6 flex flex-col gap-4">
                                <Link to="/dashboard/services/new" className="flex items-center justify-center gap-2 w-full py-3 bg-primary hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20">
                                    <span className="material-symbols-outlined">add_circle</span>
                                    Tambah Layanan
                                </Link>
                                <div className="grid grid-cols-2 gap-3">
                                    <Link to="/dashboard/portfolio/new" className="flex flex-col items-center justify-center gap-2 p-4 bg-[#1a2332] hover:bg-[#232f48] border border-[#324467] text-white rounded-lg transition-colors">
                                        <span className="material-symbols-outlined text-green-400">image</span>
                                        <span className="text-xs font-medium">Tambah Proyek</span>
                                    </Link>
                                    <Link to="/dashboard/leads" className="flex flex-col items-center justify-center gap-2 p-4 bg-[#1a2332] hover:bg-[#232f48] border border-[#324467] text-white rounded-lg transition-colors">
                                        <span className="material-symbols-outlined text-blue-400">list_alt</span>
                                        <span className="text-xs font-medium">Lihat Prospek</span>
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-[#111722] border border-[#324467] rounded-xl p-5 mt-auto">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <h4 className="text-sm font-semibold text-white">Status Sistem: Operasional</h4>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-[#92a4c9]">
                                        <span>Beban Server</span>
                                        <span>24%</span>
                                    </div>
                                    <div className="w-full bg-[#1a2332] rounded-full h-1.5">
                                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '24%' }}></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-[#92a4c9] mt-2">
                                        <span>Database</span>
                                        <span>Terhubung</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Dashboard;
