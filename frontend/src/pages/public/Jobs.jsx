import React, { useState } from 'react';
import { CheckCircle, Briefcase } from 'lucide-react';
import api from '../../utils/api';

function Jobs() {
    const [form, setForm] = useState({
        fullName: '',
        phone: '',
        whatsapp: '',
        position: 'Baker',
        experience: '',
        city: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const POSITIONS = ['Baker', 'Cashier', 'Delivery Rider', 'Cleaner', 'Manager'];

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const res = await api.post('/api/jobs', form);
            if (res.data.success) {
                setSuccess(true);
                setForm({
                    fullName: '',
                    phone: '',
                    whatsapp: '',
                    position: 'Baker',
                    experience: '',
                    city: ''
                });
            }
        } catch (err) {
            console.error('Job application failed', err);
            setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-card-bg min-h-[70vh] flex items-center justify-center px-4">
                <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm border border-border text-center max-w-md w-full">
                    <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-6" />
                    <h2 className="font-heading text-3xl font-bold text-text-dark mb-4">Application Sent!</h2>
                    <p className="text-text-light font-body mb-8">
                        Thank you for applying to join the Ideal Bakery team. We will review your application and contact you via WhatsApp if your profile matches our requirements.
                    </p>
                    <button 
                        onClick={() => setSuccess(false)}
                        className="bg-primary text-white px-8 py-3 rounded font-bold text-sm tracking-widest hover:bg-[#6A1414] transition-colors w-full"
                    >
                        SUBMIT ANOTHER
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card-bg min-h-screen py-16 px-4">
            <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-sm border border-border">
                <div className="text-center mb-10">
                    <div className="bg-primary/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                        <Briefcase className="text-primary" size={28} />
                    </div>
                    <h1 className="font-heading text-4xl font-bold text-text-dark mb-4">
                        Join Our Team
                    </h1>
                    <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
                    <p className="font-body text-text-light">
                        Fill out the form below to apply for a position at Ideal Bakery.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm font-semibold border border-red-100 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-text-dark mb-2">Full Name *</label>
                            <input 
                                required type="text" name="fullName" value={form.fullName} onChange={handleChange}
                                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                                placeholder="Ali Khan"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-text-dark mb-2">City *</label>
                            <input 
                                required type="text" name="city" value={form.city} onChange={handleChange}
                                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                                placeholder="e.g. Sahiwal"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-text-dark mb-2">Phone Number *</label>
                            <input 
                                required type="text" name="phone" value={form.phone} onChange={handleChange}
                                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                                placeholder="03xx xxxxxxx"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-text-dark mb-2">WhatsApp Number *</label>
                            <input 
                                required type="text" name="whatsapp" value={form.whatsapp} onChange={handleChange}
                                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                                placeholder="03xx xxxxxxx"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-text-dark mb-2">Position Applied For *</label>
                        <select 
                            required name="position" value={form.position} onChange={handleChange}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm bg-white"
                        >
                            {POSITIONS.map(pos => (
                                <option key={pos} value={pos}>{pos}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-text-dark mb-2">Relevant Experience *</label>
                        <textarea 
                            required name="experience" value={form.experience} onChange={handleChange} rows={4}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none"
                            placeholder="Tell us about your previous work experience..."
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-primary text-white py-4 rounded-lg font-bold tracking-widest text-sm hover:bg-[#6A1414] transition-colors disabled:opacity-70 flex justify-center items-center"
                    >
                        {loading ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Jobs;
