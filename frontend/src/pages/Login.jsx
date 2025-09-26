import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NotificationModal from '../components/NotificationModal';

const API_BASE_URL = 'http://localhost:3001/api';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [modal, setModal] = useState({
        isOpen: false,
        type: 'info',
        title: '',
        message: '',
        onConfirm: null,
    });

    const showModal = (type, title, message, onConfirm = null) => {
        setModal({ isOpen: true, type, title, message, onConfirm });
    };

    const closeModal = () => {
        setModal(prev => ({ ...prev, isOpen: false }));
        if (modal.onConfirm) {
            modal.onConfirm();
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/users/login`, formData);
            localStorage.setItem('token', response.data.token);
            showModal('success', 'Login Berhasil', 'Anda akan diarahkan ke halaman utama.', () => navigate('/dashboard'));
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            showModal('error', 'Login Gagal', 'Username atau password salah.');
        }
    };

    return (
        <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full">
                <div className="card bg-base-100 shadow-xl">
                    <form onSubmit={handleLogin}>
                        <div className="card-body">
                            <h3 className="text-2xl font-bold text-center mb-4">Login</h3>
                            <label className="form-control w-full">
                                <div className="label">
                                    <span className="label-text">Username</span>
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </label>
                            <label className="form-control w-full">
                                <div className="label">
                                    <span className="label-text">Password</span>
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </label>
                            <div className="card-actions justify-center mt-6">
                                <button type="submit" className="btn btn-primary w-full">
                                    Login
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <NotificationModal
                isOpen={modal.isOpen}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                onClose={closeModal}
            />
        </div>
    );
};

export default Login;
