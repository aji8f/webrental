import React, { useState, useEffect } from 'react';
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import useSettings from '../hooks/useSettings';
import { getImageUrl } from '../utils/imageUtils';
import { useCart } from '../contexts/CartContext';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

const PublicLayout = () => {
    const { settings } = useSettings();
    const { cartCount } = useCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-900 dark:text-white antialiased flex flex-col font-display">
            <nav className="fixed top-0 w-full z-50 glass-header border-b border-border-dark transition-all duration-300 bg-[#101622]/85 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <Link to="/" className="flex items-center gap-3">
                            {settings?.logo ? (
                                <img
                                    src={getImageUrl(settings.logo)}
                                    alt="EventGuard.av"
                                    className="h-10 w-auto object-contain"
                                />
                            ) : (
                                <>
                                    <div className="size-8 text-primary">
                                        <span className="material-symbols-outlined text-3xl">videocam</span>
                                    </div>
                                    <h2 className="text-white text-xl font-bold tracking-tight">EventGuard<span className="text-primary">.av</span></h2>
                                </>
                            )}
                        </Link>
                        <div className="hidden md:flex items-center space-x-8">
                            <NavLink to="/" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-white border-b-2 border-primary pb-0.5' : 'text-gray-300 hover:text-white'}`} end>Beranda</NavLink>
                            <NavLink to="/services" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-white border-b-2 border-primary pb-0.5' : 'text-gray-300 hover:text-white'}`}>Layanan</NavLink>
                            <NavLink to="/portfolio" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-white border-b-2 border-primary pb-0.5' : 'text-gray-300 hover:text-white'}`}>Portofolio</NavLink>
                            <NavLink to="/about" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-white border-b-2 border-primary pb-0.5' : 'text-gray-300 hover:text-white'}`}>Tentang Kami</NavLink>
                            <NavLink to="/contact" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-white border-b-2 border-primary pb-0.5' : 'text-gray-300 hover:text-white'}`}>Hubungi Kami</NavLink>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <Link to="/cart" className="text-gray-300 hover:text-white flex items-center gap-1 text-sm font-medium px-2 relative group transition-colors">
                                <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
                                {cartCount > 0 && (
                                    <span className="bg-primary text-white text-[10px] size-5 rounded-full flex items-center justify-center -mt-4 -ml-2 border-2 border-[#101622] absolute top-1 right-0">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                            <Link to="/contact" className="bg-primary hover:bg-primary-hover text-white text-sm font-bold py-2.5 px-6 rounded-lg transition-all duration-200 transform hover:translate-y-[-1px] shadow-lg shadow-primary/20">
                                Dapatkan Penawaran
                            </Link>
                        </div>
                        <div className="md:hidden flex items-center gap-4">
                            <Link to="/cart" className="text-gray-300 hover:text-white relative">
                                <span className="material-symbols-outlined">shopping_cart</span>
                                {cartCount > 0 && (
                                    <span className="bg-primary text-white text-[10px] size-4 rounded-full flex items-center justify-center absolute -top-1 -right-1">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-300 hover:text-white">
                                <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
                            </button>
                        </div>
                    </div>
                </div>
                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-[#101622]/95 backdrop-blur-md border-t border-border-dark">
                        <div className="px-4 py-4 space-y-2">
                            <NavLink to="/" className={({ isActive }) => `block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`} end>Beranda</NavLink>
                            <NavLink to="/services" className={({ isActive }) => `block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>Layanan</NavLink>
                            <NavLink to="/portfolio" className={({ isActive }) => `block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>Portofolio</NavLink>
                            <NavLink to="/about" className={({ isActive }) => `block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>Tentang Kami</NavLink>
                            <NavLink to="/contact" className={({ isActive }) => `block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>Hubungi Kami</NavLink>
                            <div className="pt-2 border-t border-border-dark">
                                <Link to="/contact" className="block w-full text-center bg-primary hover:bg-primary-hover text-white text-sm font-bold py-3 px-6 rounded-lg transition-all">Dapatkan Penawaran</Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
            <main className="flex-grow pt-20">
                <Outlet />
            </main>
            <footer className="bg-surface-dark border-t border-border-dark pt-16 pb-8 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                {settings?.logo ? (
                                    <img
                                        src={getImageUrl(settings.logo)}
                                        alt="EventGuard.av"
                                        className="h-10 w-auto object-contain"
                                    />
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-primary text-3xl">videocam</span>
                                        <h3 className="text-xl font-bold text-white">EventGuard<span className="text-primary">.av</span></h3>
                                    </>
                                )}
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Spesialis penyewaan peralatan event support: Layar LED, Smart TV, Proyektor, dan Digital Signage. Mengutamakan kualitas visual untuk kesuksesan acara Anda.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Layanan</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a className="hover:text-primary transition-colors" href="#">Layar LED / Videotron</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Smart TV & Display</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Proyektor & Screen</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Digital Signage</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Perusahaan</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><NavLink to="/about" className="hover:text-primary transition-colors">Tentang Kami</NavLink></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Karir</a></li>
                                <li><NavLink to="/portfolio" className="hover:text-primary transition-colors">Portofolio</NavLink></li>
                                <li><NavLink to="/contact" className="hover:text-primary transition-colors">Hubungi Kami</NavLink></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Kontak</h4>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                                    {settings?.contact?.headquarters?.street ?
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${settings.contact.headquarters.street}, ${settings.contact.headquarters.city}`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-white transition-colors text-left"
                                        >
                                            {settings.contact.headquarters.street}, {settings.contact.headquarters.city}
                                        </a>
                                        : '123 Event Horizon Blvd, LA'}
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-lg">call</span>
                                    <a
                                        href={`https://wa.me/${settings?.contact?.phone?.replace(/\+/g, '').replace(/\s/g, '') || '628123456789'}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-white transition-colors"
                                    >
                                        {settings?.contact?.phone || '+62 8123456789'}
                                    </a>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-lg">mail</span>
                                    <a href={`mailto:${settings?.contact?.email?.sales}`} className="hover:text-white transition-colors">
                                        {settings?.contact?.email?.sales || 'hello@eventguard.com'}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-border-dark pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-sm">© 2024 EventGuard Services. All rights reserved.</p>
                        <div className="flex gap-4">
                            <a className="text-gray-500 hover:text-white transition-colors" href="#"><span className="sr-only">Twitter</span><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg></a>
                            <a className="text-gray-500 hover:text-white transition-colors" href="#"><span className="sr-only">LinkedIn</span><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg></a>
                        </div>
                    </div>
                </div>
            </footer>

            <FloatingWhatsApp />
        </div>
    );
};

export default PublicLayout;
