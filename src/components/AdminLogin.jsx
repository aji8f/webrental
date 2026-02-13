import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Credential Check
        if (email === 'alfa@gmail.com' && password === 'YMedia88') {
            toast.success('Login successful');
            navigate('/dashboard');
        } else {
            toast.error('Invalid email or password');
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display antialiased text-slate-900 dark:text-white transition-colors duration-300">
            <div className="relative flex min-h-screen w-full flex-col justify-center items-center overflow-hidden">
                {/* Abstract Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 10%, rgba(19, 91, 236, 0.15), transparent 40%), radial-gradient(circle at 90% 90%, rgba(19, 91, 236, 0.05), transparent 40%)' }}>
                </div>
                {/* Main Content Container */}
                <div className="layout-container flex w-full max-w-md flex-col z-10 px-4">
                    {/* Login Card */}
                    <div className="w-full rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark shadow-xl overflow-hidden">
                        {/* Card Header with Image/Branding */}
                        <div className="relative w-full h-32 bg-cover bg-center" data-alt="Abstract server room lights" style={{ backgroundImage: "linear-gradient(rgba(19, 34, 51, 0.8), rgba(25, 34, 51, 1)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuDMlu6MxGyBhoxmOH-dt70BMngt_dC4ruHgrv5pqzeYUfuA3-Hh90GI1LB_dnNkf9hBiFG1KCixuIdLE_iC_4zQIXBEu-pQyANxwvtBXh-wIR0E955qJyeMhN8L3W_hLvJFqxTFPXd0bA3nVhz4lFVivUb-Gtyuz3m18L8NrWml7OHRNioxCFYa_M0smfUQ9GUTf-VYUfvEd-WqhCRQykEd_jWdQi2YbsQciNpjI4ZkNo8DycdN3PgxKdfzdEYiJRdR8Ohkk6TiME0')" }}>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="bg-primary/20 p-2 rounded-lg mb-2 backdrop-blur-sm border border-primary/30">
                                    <span className="material-symbols-outlined text-primary text-3xl">admin_panel_settings</span>
                                </div>
                                <h1 className="text-white text-xl font-bold tracking-wide">Admin Portal</h1>
                                <p className="text-slate-300 text-xs font-medium uppercase tracking-widest mt-1">Authorized Personnel Only</p>
                            </div>
                        </div>
                        {/* Form Section */}
                        <div className="p-8 pt-6">
                            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                                {/* Email Input */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-normal" htmlFor="email">Email Address</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                            <span className="material-symbols-outlined text-[20px]">mail</span>
                                        </span>
                                        <input
                                            className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg bg-slate-50 dark:bg-[#111722] border border-slate-300 dark:border-border-dark text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-0 focus:ring-2 focus:ring-primary/50 focus:border-primary h-12 pl-10 pr-4 text-sm font-normal transition-all"
                                            id="email"
                                            placeholder="admin@eventgear.com"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                {/* Password Input */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-normal" htmlFor="password">Password</label>
                                    <div className="relative group">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                            <span className="material-symbols-outlined text-[20px]">lock</span>
                                        </span>
                                        <input
                                            className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg bg-slate-50 dark:bg-[#111722] border border-slate-300 dark:border-border-dark text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-0 focus:ring-2 focus:ring-primary/50 focus:border-primary h-12 pl-10 pr-12 text-sm font-normal transition-all"
                                            id="password"
                                            placeholder="••••••••••••"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-primary transition-colors cursor-pointer outline-none"
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                        </button>
                                    </div>
                                </div>
                                {/* Actions: Remember Me & Forgot Password */}
                                <div className="flex flex-wrap items-center justify-between gap-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            className="custom-checkbox h-4 w-4 rounded border-slate-300 dark:border-border-dark bg-slate-50 dark:bg-[#111722] text-primary focus:ring-primary/50 focus:ring-offset-0 transition-colors cursor-pointer group-hover:border-primary"
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                        />
                                        <span className="text-slate-600 dark:text-slate-300 text-sm font-normal select-none group-hover:text-primary transition-colors">Remember me</span>
                                    </label>
                                    <a className="text-primary hover:text-primary-hover text-sm font-medium hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-1" href="#">Forgot Password?</a>
                                </div>
                                {/* Submit Button */}
                                <button className="mt-2 flex w-full items-center justify-center rounded-lg bg-primary hover:bg-primary-hover h-11 px-4 text-white text-sm font-bold leading-normal tracking-wide shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-surface-dark" type="submit">
                                    Secure Login
                                </button>
                            </form>
                        </div>
                        {/* Footer / SSL Badge */}
                        <div className="bg-slate-50 dark:bg-[#0d121c] px-8 py-4 border-t border-slate-200 dark:border-border-dark">
                            <div className="flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500 opacity-80">
                                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                                <span className="text-xs font-medium tracking-wide">256-bit SSL Encrypted Connection</span>
                            </div>
                        </div>
                    </div>
                    {/* Copyright / Legal (Subtle) */}
                    <div className="mt-8 text-center">
                        <p className="text-slate-500 dark:text-slate-600 text-xs">
                            © 2024 EventGear Systems. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
