import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import useSettings from '../../hooks/useSettings';

const About = () => {
    const { settings } = useSettings();
    const [aboutData, setAboutData] = useState(null);

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/about');
                setAboutData(response.data);
            } catch (error) {
                console.error('Error fetching about data:', error);
            }
        };
        fetchAboutData();
    }, []);

    const whyChooseIcons = ['high_quality', 'inventory_2', 'handshake'];

    return (
        <>
            <section className="relative min-h-[400px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-background-dark/80 via-background-dark/70 to-background-dark z-10"></div>
                    <div
                        className="w-full h-full bg-cover bg-center"
                        data-alt="Backstage view of a large event production with lights and equipment"
                        style={{
                            backgroundImage: `url('${settings?.heroImages?.about || "https://lh3.googleusercontent.com/aida-public/AB6AXuAcL4AI6FrskhNzCFFPeaqbful3bOSRLdl7I9B4YEcILAWYUqu_hlwTe1vWN6h9NC4cEHigxJ6y3mKAcXBjVVXu3ok-yazas2WwGAUq9U0YB4XdqVo-LKx0zB8blFJH3y11nUOMX6Kt2ZiMMfUXm8MBimBGoCkLsiTkEH85_xplnbD_0HDVuNs-Jj_hFtNTGEmx4zoIkhiaoDVVfDyNTUbCv1g_V9AU_K7VEHe2Qz49cZ-uNAgE4Yjc2IuDkJSWi_uTH5tYoqKkRtA"}')`
                        }}
                    >
                    </div>
                </div>
                <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 text-center mt-10">
                    <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 animate-fade-in-up">
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight hero-text-shadow">
                            Menetapkan Standar Visual Acara
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 max-w-2xl font-light leading-relaxed">
                            Kami memadukan teknologi display premium dengan dukungan teknis ahli untuk memastikan acara Anda tampil memukau dan profesional.
                        </p>
                    </div>
                </div>
            </section>
            <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative">
                        <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border-dark">
                            <img alt="Team setting up event barriers" className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700" src={aboutData?.pageContent?.teamImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuAaKe4KMikPm67Wqbg2jfQs1zcceJhFpOOGrAYFS_EMPRShv4CnaVQNo1Dl1Upu-9KZgqJVOzmfRUyhEY45RlyQG8eW29SjvADIgyvKakcet657LbjaRRa70_laK8qdxRNDyk38RPFLD_amLcBNPgFTFF9aoyA6E6wKjajtFG0aG5-dRv1p_1hym4ATk8EskyJEwpFvidSfrjRDrLW3aeTEGcF0uIwm6GirWnbDoog1HY6qBpBBBJ5NV0BL0UeCmD70EbcJCjrEvKg"} />
                        </div>
                        <div className="absolute -bottom-6 -right-6 bg-surface-dark border border-border-dark p-6 rounded-xl shadow-xl hidden md:block">
                            <div className="flex items-center gap-4">
                                <div className="text-4xl font-serif font-bold text-primary">12+</div>
                                <div className="text-sm text-gray-400 font-medium">Tahun<br />Pengalaman Visual</div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-dark border border-border-dark text-xs font-medium text-primary w-fit">
                            Sejarah Kami
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white font-serif">Dari Layanan Lokal ke Standar Visual Nasional</h2>
                        <div className="space-y-4 text-gray-400 leading-relaxed whitespace-pre-line">
                            <p>
                                {aboutData?.pageContent?.history || 'Didirikan pada tahun 2012, EventGuard.av memulai dengan misi sederhana: menyediakan perangkat visual berkualitas tinggi untuk acara lokal. Kami melihat celah di pasar untuk penyedia yang tidak hanya menyewakan alat, tetapi memberikan solusi visual end-to-end.'}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="bg-surface-dark border-y border-border-dark py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-serif">Misi Kami</h2>
                        <p className="text-xl text-gray-300 leading-relaxed font-light">
                            "{aboutData?.pageContent?.mission || 'Untuk menghidupkan setiap acara melalui teknologi visual tanpa kompromi dan dukungan teknis premium, memungkinkan penyelenggara untuk menyampaikan pesan yang berdampak dan tak terlupakan.'}"
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {aboutData?.pageContent?.whyChooseUs && aboutData.pageContent.whyChooseUs.length > 0 ? (
                            aboutData.pageContent.whyChooseUs.map((item, index) => (
                                <div key={index} className="bg-background-dark p-8 rounded-xl border border-border-dark hover:border-primary/50 transition-all duration-300 group">
                                    <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors mx-auto">
                                        <span className="material-symbols-outlined text-3xl">{whyChooseIcons[index] || 'star'}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="bg-background-dark p-8 rounded-xl border border-border-dark hover:border-primary/50 transition-all duration-300 group">
                                    <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors mx-auto">
                                        <span className="material-symbols-outlined text-3xl">high_quality</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">Kualitas Gambar</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        Kami tidak pernah berkompromi dengan kejernihan visual. Setiap panel LED dan TV dikalibrasi warna secara profesional sebelum setiap acara.
                                    </p>
                                </div>
                                <div className="bg-background-dark p-8 rounded-xl border border-border-dark hover:border-primary/50 transition-all duration-300 group">
                                    <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors mx-auto">
                                        <span className="material-symbols-outlined text-3xl">inventory_2</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">Inventaris Terlengkap</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        Acara adalah pengalaman visual. Inventaris kami mencakup teknologi terbaru dari brand terkemuka, memastikan tampilan modern dan sleek.
                                    </p>
                                </div>
                                <div className="bg-background-dark p-8 rounded-xl border border-border-dark hover:border-primary/50 transition-all duration-300 group">
                                    <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors mx-auto">
                                        <span className="material-symbols-outlined text-3xl">handshake</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">Kemitraan Terpercaya</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        Kami tidak hanya mengantar perlengkapan. Kami adalah perpanjangan tim teknis Anda, menyediakan instalasi, operator standby, dan bongkar pasang.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-serif">Mengapa Pemimpin Industri Memilih Kami</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">Bukan hanya tentang peralatan; ini tentang orang-orang dan proses di baliknya.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="flex gap-6 p-6 rounded-2xl bg-surface-dark border border-border-dark">
                        <div className="shrink-0">
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                <span className="material-symbols-outlined">engineering</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Tim Teknis Berpengalaman</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                Teknisi kami menguasai instalasi dan kalibrasi berbagai perangkat visual. Dari setup multiprojector blending hingga konfigurasi videotron custom, kami memastikan tampilan sempurna.
                            </p>
                            <div className="h-1 w-20 bg-primary/50 rounded-full"></div>
                        </div>
                    </div>
                    <div className="flex gap-6 p-6 rounded-2xl bg-surface-dark border border-border-dark">
                        <div className="shrink-0">
                            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                                <span className="material-symbols-outlined">inventory_2</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Stok Ready & Terawat</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                Unit kami selalu dalam kondisi prima dan siap pakai. Kami melakukan maintenance rutin untuk mencegah masalah teknis saat acara berlangsung.
                            </p>
                            <div className="h-1 w-20 bg-purple-500/50 rounded-full"></div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="col-span-2 md:col-span-2 aspect-[16/9] rounded-xl overflow-hidden relative group">
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                        <img alt="VIP Lounge Area" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" src={aboutData?.pageContent?.bottomImage1 || "https://lh3.googleusercontent.com/aida-public/AB6AXuBUFfhOYFHnL0RAsKnds92wdYj8f3XWowp8QC0cY1MRmM5-gcWM5UvjZ97VrOD2Kezp-6eygDsy6BHEJ_9YlztPgLWaak0hAFoSBZize_CFLP2NaOqysYPJX43KnEeMgMS2SysgosjB08UDFOWiT0kjvuVaUQat__WSoKZAFJYr4Zla8xTAVbC-KcFA5iP_jZETPfRZ6uUEiNcCfyP6aV5N0qwDZaeamSEUJvTm_sAqwv4gN7kfnx8a_m1OENe8yJar0HpbBfIpp-A"} />
                        <div className="absolute bottom-4 left-4 z-20">
                            <span className="text-white text-xs font-bold uppercase tracking-wider bg-black/50 backdrop-blur-md px-2 py-1 rounded">Layanan VIP</span>
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-1 aspect-square rounded-xl overflow-hidden relative group">
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                        <img alt="Concert Stage" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" src={aboutData?.pageContent?.bottomImage2 || "https://lh3.googleusercontent.com/aida-public/AB6AXuA923wnQ1Hta8_FZMJguXiPko29-IIiRPkKPsYz5zlPTv8d3Y4bSHD2q11Oo0ONsrwtP2WPkjpK_mrvoxnrQVmZ7oG2bn521JAkW_39H8qmJsylYQi4LZ4KiIC6N1iDqEG40FOWO1XDxDEX_yzyrNVsZ5U9uPDOI6F1jgVdU4bG-ktoTMVy7vp5f7LFnwArAarMIhtYz37ByG4wr-8CFqk17HRah5s4ZZyAwtC3KT0ZR0by3_MksBWxDng1qBEwIPxRkpfllDSAYgg"} />
                    </div>
                    <div className="col-span-1 md:col-span-1 aspect-square rounded-xl overflow-hidden relative group">
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                        <div className="w-full h-full bg-surface-dark flex items-center justify-center border border-border-dark">
                            <div className="text-center p-4">
                                <span className="block text-3xl font-bold text-primary mb-1">500+</span>
                                <span className="text-xs text-gray-400 uppercase">Acara Setiap Tahun</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-16 px-4">
                <div className="max-w-5xl mx-auto bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-10 md:p-16 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-serif relative z-10">Siap bekerja dengan yang terbaik?</h2>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8 relative z-10">Bergabunglah dengan ratusan penyelenggara acara yang mempercayai EventGuard untuk kebutuhan visual dan peralatan mereka.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                        <Link to="/services" className="bg-white text-primary font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors shadow-lg align-middle inline-flex items-center justify-center">
                            Lihat Layanan Kami
                        </Link>
                        <Link to="/contact" className="bg-transparent border border-white/30 text-white font-bold py-3 px-8 rounded-lg hover:bg-white/10 transition-colors align-middle inline-flex items-center justify-center">
                            Hubungi Kami
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
};

export default About;
