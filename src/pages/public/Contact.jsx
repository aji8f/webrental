import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import useSettings from '../../hooks/useSettings';
import { getImageUrl } from '../../utils/imageUtils';
import API_BASE_URL from '../../config/api';
import SEO from '../../components/SEO';


// Memoized Map Component to prevent re-renders on form input
const MapDisplay = React.memo(({ mapUrl }) => {
    return (
        <div className="bg-surface-dark rounded-2xl border border-border-dark overflow-hidden shadow-lg h-64 relative group">
            {mapUrl ? (
                <div dangerouslySetInnerHTML={{ __html: mapUrl }} className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0" />
            ) : (
                <>
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAaKe4KMikPm67Wqbg2jfQs1zcceJhFpOOGrAYFS_EMPRShv4CnaVQNo1Dl1Upu-9KZgqJVOzmfRUyhEY45RlyQG8eW29SjvADIgyvKakcet657LbjaRRa70_laK8qdxRNDyk38RPFLD_amLcBNPgFTFF9aoyA6E6wKjajtFG0aG5-dRv1p_1hym4ATk8EskyJEwpFvidSfrjRDrLW3aeTEGcF0uIwm6GirWnbDoog1HY6qBpBBBJ5NV0BL0UeCmD70EbcJCjrEvKg')", filter: "grayscale(100%) opacity(0.3)" }}></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <div className="p-3 bg-surface-dark rounded-full border border-border-dark shadow-xl text-primary animate-bounce">
                            <span className="material-symbols-outlined text-2xl">location_on</span>
                        </div>
                        <a className="bg-surface-dark/90 hover:bg-primary hover:text-white hover:border-primary text-gray-300 text-xs font-medium py-2 px-4 rounded-full border border-border-dark transition-all backdrop-blur-sm" href="#">
                            Buka di Google Maps
                        </a>
                    </div>
                </>
            )}
        </div>
    );
});

const Contact = () => {
    const { settings } = useSettings();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        message: '',
        bot_check: '' // Honeypot field
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const validateForm = () => {
        // Name validation: Letters, spaces, hyphens only
        const nameRegex = /^[a-zA-Z\s\-]+$/;
        if (!nameRegex.test(formData.fullName)) {
            toast.error('Nama mengandung karakter yang tidak valid.');
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Silakan masukkan alamat email yang valid.');
            return false;
        }

        // Phone validation: Digits, spaces, dashes, parens, plus
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(formData.phone)) {
            toast.error('Silakan masukkan nomor telepon yang valid.');
            return false;
        }

        return true;
    };

    const checkRateLimit = () => {
        const lastSubmit = localStorage.getItem('lastContactSubmit');
        if (lastSubmit) {
            const timeDiff = Date.now() - parseInt(lastSubmit);
            // 2 minutes cooldown
            if (timeDiff < 2 * 60 * 1000) {
                toast.error('Harap tunggu beberapa saat sebelum mengirim pesan lain.');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Honeypot check
        if (formData.bot_check) {

            setLoading(true);
            // Fake success for bot
            setTimeout(() => {
                setLoading(false);
                toast.success('Permintaan konsultasi berhasil dikirim!');
                setFormData({ fullName: '', email: '', phone: '', message: '', bot_check: '' });
            }, 1000);
            return;
        }

        // 2. Rate Limit check
        if (!checkRateLimit()) return;

        // 3. Validation
        if (!validateForm()) return;

        setLoading(true);

        try {
            // Adapt the simple form data to the backend schema
            const leadData = {
                firstName: formData.fullName.split(' ')[0] || formData.fullName,
                lastName: formData.fullName.split(' ').slice(1).join(' ') || '',
                email: formData.email,
                phone: formData.phone,
                message: formData.message.trim(), // Sanitize: trim whitespace
                company: 'N/A', // Default
                eventType: 'General Inquiry', // Default
                attendees: 'N/A', // Default
                services: [], // Default
                createdAt: new Date().toISOString(),
                status: 'new'
            };

            await axios.post(`${API_BASE_URL}/leads`, leadData);

            // Set rate limit timestamp
            localStorage.setItem('lastContactSubmit', Date.now().toString());

            toast.success('Permintaan konsultasi berhasil dikirim!');

            // Reset form
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                message: '',
                bot_check: ''
            });

        } catch (error) {
            console.error('Error sending quote request:', error);
            toast.error('Gagal mengirim permintaan. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SEO
                title="Hubungi Kami - Konsultasi & Pemesanan"
                description="Hubungi tim ahli kami untuk mendiskusikan kebutuhan sewa alat visual acara Anda. Dapatkan penawaran harga terbaik dan konsultasi teknis gratis."
            />
            <section className="relative min-h-[400px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-background-dark/80 via-background-dark/70 to-background-dark z-10"></div>
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{
                            backgroundImage: `url('${getImageUrl(settings?.heroImages?.contact) || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop"}')`
                        }}
                    >
                    </div>
                </div>
                <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 text-center mt-10">
                    <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 animate-fade-in-up">
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight hero-text-shadow">
                            Mulai Konsultasi Anda
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 max-w-2xl font-light leading-relaxed">
                            Hubungi ahli keamanan kami untuk mendiskusikan kebutuhan acara Anda. Kami di sini untuk membantu Anda merencanakan acara yang aman dan sukses.
                        </p>
                    </div>
                </div>
            </section>
            <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8">
                        <div className="bg-surface-dark rounded-2xl border border-border-dark p-6 md:p-8 shadow-xl">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-6">
                                        <span className="material-symbols-outlined text-primary">chat_bubble</span>
                                        Kirim Pesan Kepada Kami
                                    </h3>

                                    {/* Honeypot Field - Hidden from humans, visible to bots */}
                                    <div className="hidden">
                                        <label htmlFor="bot_check">Jangan diisi jika Anda manusia</label>
                                        <input
                                            type="text"
                                            id="bot_check"
                                            name="bot_check"
                                            value={formData.bot_check}
                                            onChange={handleChange}
                                            tabIndex="-1"
                                            autoComplete="off"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1.5" htmlFor="fullName">Full Name</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="material-symbols-outlined text-gray-500 text-lg">person</span>
                                                </div>
                                                <input
                                                    className="w-full bg-background-dark border border-border-dark rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-600"
                                                    id="fullName"
                                                    placeholder="John Doe"
                                                    type="text"
                                                    value={formData.fullName}
                                                    onChange={handleChange}
                                                    required
                                                    maxLength={100}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1.5" htmlFor="email">Alamat Email</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="material-symbols-outlined text-gray-500 text-lg">mail</span>
                                                </div>
                                                <input
                                                    className="w-full bg-background-dark border border-border-dark rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-600"
                                                    id="email"
                                                    placeholder="john@company.com"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    maxLength={100}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1.5" htmlFor="phone">Nomor Telepon</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="material-symbols-outlined text-gray-500 text-lg">call</span>
                                                </div>
                                                <input
                                                    className="w-full bg-background-dark border border-border-dark rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-600"
                                                    id="phone"
                                                    placeholder="+1 (555) 000-0000"
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    required
                                                    maxLength={20}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1.5" htmlFor="message">Pesan / Kebutuhan</label>
                                            <textarea
                                                className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-600 min-h-[160px]"
                                                id="message"
                                                placeholder="Ceritakan kebutuhan acara Anda atau pertanyaan yang Anda miliki..."
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                maxLength={1000}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 bg-blue-900/10 border border-blue-900/30 p-4 rounded-lg mt-2">
                                    <span className="material-symbols-outlined text-primary text-xl mt-0.5">lock_person</span>
                                    <div className="text-xs text-gray-400 leading-relaxed">
                                        <strong className="text-primary block mb-1">Privasi Anda Terlindungi</strong>
                                        Kami menggunakan enkripsi tingkat bank untuk menangani pertanyaan Anda. Informasi yang dikirimkan hanya dibagikan dengan konsultan resmi. Lihat <a className="text-primary hover:underline" href="#">Kebijakan Privasi</a> kami.
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button
                                        className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? 'Mengirim...' : 'Minta Konsultasi'}
                                        {!loading && <span className="material-symbols-outlined text-lg">send</span>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-surface-dark rounded-2xl border border-border-dark p-6 shadow-lg">
                            <h3 className="text-xl font-bold text-white mb-6 font-serif">Informasi Kontak</h3>
                            <ul className="space-y-6">
                                <li className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-lg text-primary shrink-0">
                                        <span className="material-symbols-outlined">location_on</span>
                                    </div>
                                    <div>
                                        <p className="text-white font-medium mb-1">Kantor Pusat</p>
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${settings?.contact?.headquarters?.street}, ${settings?.contact?.headquarters?.city}`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 text-sm leading-relaxed hover:text-white transition-colors block"
                                        >
                                            {settings?.contact?.headquarters?.street && (
                                                <>
                                                    {settings.contact.headquarters.street}<br />
                                                    {settings.contact.headquarters.city}{settings?.contact?.headquarters?.zip ? `, ${settings.contact.headquarters.zip}` : ''}
                                                </>
                                            )}
                                        </a>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-lg text-primary shrink-0">
                                        <span className="material-symbols-outlined">call</span>
                                    </div>
                                    <div>
                                        <p className="text-white font-medium mb-1">Telepon (WhatsApp)</p>
                                        <a
                                            href={`https://wa.me/${settings?.contact?.phone?.replace(/\+/g, '').replace(/\s/g, '') || ''}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 text-sm hover:text-white transition-colors"
                                        >
                                            {settings?.contact?.phone || ''}
                                        </a>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-lg text-primary shrink-0">
                                        <span className="material-symbols-outlined">mail</span>
                                    </div>
                                    <div>
                                        <p className="text-white font-medium mb-1">Email</p>
                                        <a href={`mailto:${settings?.contact?.email?.sales}`} className="text-gray-400 text-sm hover:text-white transition-colors">{settings?.contact?.email?.sales || ''}</a>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-lg text-primary shrink-0">
                                        <span className="material-symbols-outlined">schedule</span>
                                    </div>
                                    <div>
                                        <p className="text-white font-medium mb-1">Jam Kantor</p>
                                        <p className="text-gray-400 text-sm">{settings?.contact?.businessHours?.weekday || ''}</p>
                                        <p className="text-gray-400 text-sm">{settings?.contact?.businessHours?.emergency || ''}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <MapDisplay mapUrl={settings?.contact?.mapUrl} />
                        <div className="bg-gradient-to-br from-surface-dark to-background-dark rounded-2xl border border-border-dark p-6 text-center">
                            <span className="material-symbols-outlined text-4xl text-gray-500 mb-3">verified_user</span>
                            <h4 className="text-white font-bold mb-2">Aman & Rahasia</h4>
                            <p className="text-gray-500 text-sm">
                                Kami menandatangani NDA untuk semua acara profil tinggi. Detail operasional Anda aman bersama kami.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Contact;
