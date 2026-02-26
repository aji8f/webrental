import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import AdminLogin from './components/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import DynamicHead from './components/DynamicHead';
import DashboardLayout from './layouts/DashboardLayout';
import PublicLayout from './layouts/PublicLayout';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import ServiceForm from './pages/ServiceForm';
import Categories from './pages/Categories';
import Home from './pages/public/Home';
import PublicServices from './pages/public/Services';
import ServiceDetail from './pages/public/ServiceDetail';
import Portfolio from './pages/public/Portfolio';
import ProjectDetail from './pages/public/ProjectDetail';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Cart from './pages/public/Cart';
import AdminPortfolio from './pages/admin/Portfolio';
import ProjectAdd from './pages/admin/ProjectAdd';
import ProjectEdit from './pages/admin/ProjectEdit';
import Leads from './pages/admin/Leads';
import Settings from './pages/admin/Settings';
import AboutSettings from './pages/admin/AboutSettings';
import { Toaster } from 'react-hot-toast';

import { CartProvider } from './contexts/CartContext';

// Setup Axios Interceptor for JWT Token
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Global interceptor for 401/403 errors across the app
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Only clear token and redirect if we are in the admin area
            if (window.location.pathname.startsWith('/dashboard')) {
                localStorage.removeItem('adminToken');
                window.location.href = '/admin';
            }
        }
        return Promise.reject(error);
    }
);

function App() {
    return (
        <CartProvider>
            <DynamicHead />
            <BrowserRouter>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: '#1a2332',
                            color: '#fff',
                            border: '1px solid #324467',
                        },
                        success: {
                            iconTheme: {
                                primary: '#22c55e',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<PublicLayout />}>
                        <Route index element={<Home />} />
                        <Route path="services" element={<PublicServices />} />
                        <Route path="services/:id" element={<ServiceDetail />} />
                        <Route path="portfolio" element={<Portfolio />} />
                        <Route path="portfolio/:id" element={<ProjectDetail />} />
                        <Route path="about" element={<About />} />
                        <Route path="contact" element={<Contact />} />
                        <Route path="cart" element={<Cart />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminLogin />} />

                    {/* Protected Dashboard Routes */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Dashboard />} />
                        <Route path="services" element={<Services />} />
                        <Route path="services/new" element={<ServiceForm />} />
                        <Route path="services/:id/edit" element={<ServiceForm />} />
                        <Route path="categories" element={<Categories />} />
                        <Route path="portfolio" element={<AdminPortfolio />} />
                        <Route path="portfolio/new" element={<ProjectAdd />} />
                        <Route path="portfolio/:id/edit" element={<ProjectEdit />} />
                        <Route path="leads" element={<Leads />} />
                        <Route path="about" element={<AboutSettings />} />
                        <Route path="settings" element={<Settings />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </CartProvider>
    );
}

export default App;
