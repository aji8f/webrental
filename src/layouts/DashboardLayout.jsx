import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import useSettings from '../hooks/useSettings';
import { getImageUrl } from '../utils/imageUtils';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const DashboardLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { settings, updateSettings } = useSettings();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin');
    };

    const handleEditName = async () => {
        const currentName = settings?.profile?.name || 'Marcus Reed';
        const newName = window.prompt('Enter new admin name:', currentName);

        if (newName && newName.trim() !== '' && newName !== currentName) {
            try {
                const updatedSettings = {
                    ...settings,
                    profile: {
                        ...settings.profile,
                        name: newName
                    }
                };

                const success = await updateSettings(updatedSettings);
                if (!success) {
                    // Fallback if hook update fails
                }
            } catch (error) {
                console.error('Error updating name:', error);
                toast.error('Failed to update name');
            }
        }
    };

    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg group transition-colors ${isActive ? 'bg-primary text-white' : 'text-[#92a4c9] hover:bg-surface-dark-hover hover:text-white'}`;

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white overflow-hidden flex h-screen w-full font-display">
            <aside className="w-64 h-full bg-[#111722] border-r border-[#1e293b] flex flex-col flex-shrink-0 z-20">
                <div className="h-16 flex items-center px-6 border-b border-[#1e293b]">
                    {settings?.logo ? (
                        <img
                            src={getImageUrl(settings.logo)}
                            alt="Admin Logo"
                            className="max-h-10 max-w-full object-contain"
                        />
                    ) : (
                        <div className="flex items-center gap-2 text-primary">
                            <span className="material-symbols-outlined text-3xl">shield_lock</span>
                            <span className="text-white text-lg font-bold tracking-tight">SecureRent<span className="text-primary">.admin</span></span>
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-dark border border-[#324467]">
                        <div className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10 shrink-0" data-alt="Profile picture of a male admin user" style={{ backgroundImage: `url("${settings?.profile?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDE14Zsz1GwixLuJvClY9GCboxkC_YZbT15kIraqsDmS8zXnff8KVgCiep6UGZ2cKfTXDz1fGj81gkb5Qpf4vW13tB-PgiJ-suA8YS590nBJ_HSuaYQx8XwthUE9zseItNKAOQvm-fxKDhLoITKyUWWFz7xA7Q_KDeh89TVfOnhODXtaRcGlgjPYysIxtfhcFZZ4xeHlkGEXi3TGN_57ZmsVCd8GIy9tf_nTHlC1pf3Rda3ZCiX6Zc2zprLq_S0rUBUuHsPS4tR0ZU'}")` }}></div>
                        <div className="flex flex-col overflow-hidden flex-1">
                            <div className="flex items-center gap-1">
                                <h1 className="text-white text-sm font-medium leading-none truncate">{settings?.profile?.name || 'Marcus Reed'}</h1>
                                <button
                                    onClick={handleEditName}
                                    className="text-gray-500 hover:text-white transition-colors p-0.5 rounded hover:bg-white/10"
                                    title="Edit Name"
                                >
                                    <span className="material-symbols-outlined text-[14px]">edit</span>
                                </button>
                            </div>
                            <p className="text-[#92a4c9] text-xs font-normal mt-1 truncate">{settings?.profile?.role || 'Event Admin'}</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 overflow-y-auto px-4 pb-4">
                    {/* Main Menu */}
                    <div className="mb-6">
                        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">Menu</p>
                        <div className="space-y-1">
                            <NavLink to="/dashboard" end className={navLinkClass}>
                                <span className="material-symbols-outlined text-[20px]">dashboard</span>
                                <span className="text-sm font-medium">Dashboard</span>
                            </NavLink>
                            <NavLink to="/dashboard/services" className={navLinkClass}>
                                <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                                <span className="text-sm font-medium">Layanan</span>
                            </NavLink>
                            <NavLink to="/dashboard/categories" className={navLinkClass}>
                                <span className="material-symbols-outlined text-[20px]">category</span>
                                <span className="text-sm font-medium">Kategori</span>
                            </NavLink>
                            <NavLink to="/dashboard/portfolio" className={navLinkClass}>
                                <span className="material-symbols-outlined text-[20px]">work</span>
                                <span className="text-sm font-medium">Portofolio</span>
                            </NavLink>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="mb-6">
                        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">Konten</p>
                        <div className="space-y-1">
                            <NavLink to="/dashboard/about" className={navLinkClass}>
                                <span className="material-symbols-outlined text-[20px]">info</span>
                                <span className="text-sm font-medium">Tentang</span>
                            </NavLink>
                            <NavLink
                                to="/dashboard/leads"
                                className={({ isActive }) =>
                                    `flex items-center justify-between px-3 py-2.5 rounded-lg group transition-colors ${isActive ? 'bg-primary text-white' : 'text-[#92a4c9] hover:bg-surface-dark-hover hover:text-white'}`
                                }
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[20px]">inbox</span>
                                    <span className="text-sm font-medium">Prospek</span>
                                </div>
                            </NavLink>
                        </div>
                    </div>

                    {/* Settings */}
                    <div>
                        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">Pengaturan</p>
                        <div className="space-y-1">
                            <NavLink to="/dashboard/settings" className={navLinkClass}>
                                <span className="material-symbols-outlined text-[20px]">settings</span>
                                <span className="text-sm font-medium">Pengaturan</span>
                            </NavLink>
                        </div>
                    </div>
                </nav>
                <div className="p-4 border-t border-[#1e293b]">
                    <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-lg h-10 px-4 bg-surface-dark hover:bg-red-900/20 text-red-400 hover:text-red-300 border border-[#324467] hover:border-red-900/50 transition-all text-sm font-medium">
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        <span>Keluar Aman</span>
                    </button>
                </div>
            </aside>
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardLayout;
