import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../contexts/CartContext';
import { getImageUrl } from '../../utils/imageUtils';
import { toast } from 'react-hot-toast';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        location: '',
        notes: ''
    });

    const handleQuantityChange = (id, value) => {
        const newQty = parseInt(value);
        if (newQty > 0) {
            updateQuantity(id, newQty);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            toast.error('Keranjang kosong');
            return;
        }

        try {
            const loadingToast = toast.loading('Mengirim permintaan...');

            // Split name into first and last name for the leads format
            const names = formData.name.trim().split(' ');
            const firstName = names[0];
            const lastName = names.slice(1).join(' ') || '';

            const leadData = {
                firstName,
                lastName,
                email: formData.email,
                phone: formData.phone,
                company: formData.location || 'N/A', // Mapping location to company or just storing it
                eventType: 'Quote Request',
                attendees: 'N/A',
                message: `${formData.notes}\n\nEvent Date: ${formData.date}\nLocation: ${formData.location}`,
                services: cart.map(item => `${item.name} (${item.quantity} ${item.unit})`),
                createdAt: new Date().toISOString(),
                status: 'new'
            };

            await axios.post('http://localhost:3001/leads', leadData);

            toast.dismiss(loadingToast);
            toast.success('Permintaan penawaran terkirim! Tim kami akan segera menghubungi Anda.');
            clearCart();
            navigate('/');
        } catch (error) {
            console.error('Error submitting quote:', error);
            toast.dismiss();
            toast.error('Gagal mengirim permintaan. Silakan coba lagi.');
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-background-light dark:bg-background-dark">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <span className="material-symbols-outlined text-6xl text-gray-500 mb-4">shopping_cart_off</span>
                    <h2 className="text-2xl font-bold text-white mb-2">Keranjang Penawaran Kosong</h2>
                    <p className="text-gray-400 mb-8">Anda belum menambahkan layanan apapun ke dalam daftar penawaran.</p>
                    <Link to="/services" className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-lg transition-colors inline-block">
                        Jelajahi Layanan
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 pb-20 bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-8">Keranjang Penawaran</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-[#192233] border-b border-[#324467]">
                                        <tr>
                                            <th className="px-6 py-4 text-gray-400 text-xs font-semibold uppercase">Produk</th>
                                            <th className="px-6 py-4 text-gray-400 text-xs font-semibold uppercase text-center">Harga</th>
                                            <th className="px-6 py-4 text-gray-400 text-xs font-semibold uppercase text-center">Jumlah</th>
                                            <th className="px-6 py-4 text-gray-400 text-xs font-semibold uppercase text-right">Subtotal</th>
                                            <th className="px-6 py-4"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#324467]">
                                        {cart.map((item) => (
                                            <tr key={item.id} className="hover:bg-[#1a2332] transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-16 w-24 bg-background-dark rounded border border-border-dark overflow-hidden flex-shrink-0">
                                                            <img src={getImageUrl(item.image)} alt={item.name} className="h-full w-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <Link to={`/services/${item.id}`} className="text-white font-medium hover:text-primary transition-colors block max-w-[200px] truncate">
                                                                {item.name}
                                                            </Link>
                                                            <span className="text-xs text-gray-500 capitalize">{item.category}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="text-gray-300 text-sm">Rp {item.price_daily?.toLocaleString('id-ID')}</div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="inline-flex items-center border border-border-dark rounded-lg overflow-hidden">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="px-2 py-1 text-gray-400 hover:text-white hover:bg-surface-dark-hover transition-colors"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            -
                                                        </button>
                                                        <input
                                                            type="text"
                                                            value={item.quantity}
                                                            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                            className="w-10 bg-transparent border-none text-center text-white text-sm p-1 focus:ring-0"
                                                        />
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="px-2 py-1 text-gray-400 hover:text-white hover:bg-surface-dark-hover transition-colors"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="text-white font-medium">Rp {(item.price_daily * item.quantity).toLocaleString('id-ID')}</div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-gray-500 hover:text-red-400 transition-colors"
                                                        title="Hapus item"
                                                    >
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="flex justify-between items-center px-4">
                            <Link to="/services" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm">
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                Lanjut Belanja
                            </Link>
                            <button onClick={clearCart} className="text-red-400 hover:text-red-300 text-sm">
                                Kosongkan Keranjang
                            </button>
                        </div>
                    </div>

                    {/* Checkout Form */}
                    <div className="lg:col-span-4">
                        <div className="bg-surface-dark border border-border-dark rounded-xl p-6 sticky top-24">
                            <h3 className="text-xl font-bold text-white mb-6">Informasi Pemesanan</h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder-gray-600"
                                        placeholder="Nama Anda / Perusahaan"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder-gray-600"
                                        placeholder="email@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Nomor Telepon (WhatsApp)</label>
                                    <input
                                        type="tel"
                                        required
                                        className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder-gray-600"
                                        placeholder="+62 8..."
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Tanggal Acara</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder-gray-600"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Lokasi / Venue</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder-gray-600"
                                        placeholder="Nama Gedung / Alamat"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Catatan Tambahan</label>
                                    <textarea
                                        rows="3"
                                        className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder-gray-600"
                                        placeholder="Kebutuhan khusus, loading dock, dll."
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="border-t border-border-dark pt-4 mt-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-400">Total Estimasi</span>
                                        <span className="text-xl font-bold text-white">Rp {cartTotal.toLocaleString('id-ID')}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-4">*Harga belum termasuk biaya operasional, crew, dan transportasi.</p>

                                    <button
                                        type="submit"
                                        className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">send</span>
                                        Kirim Permintaan Penawaran
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
