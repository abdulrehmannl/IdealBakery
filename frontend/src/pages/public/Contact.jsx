import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import api from '../../utils/api';

function Contact() {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const res = await api.get('/api/branches?isActive=true');
                if (res.data.success) {
                    setBranches(res.data.branches || res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch branches", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBranches();
    }, []);

    return (
        <div className="bg-card-bg min-h-screen py-16 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="font-heading text-4xl font-bold text-text-dark mb-4">
                        Contact Us
                    </h1>
                    <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
                    <p className="font-body text-text-light max-w-lg mx-auto">
                        Have a question about our products or want to place a custom order? 
                        Get in touch with us at any of our branches.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* General Contact Info */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-border">
                        <h2 className="font-heading text-2xl font-bold text-text-dark mb-6">Get in Touch</h2>
                        
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-primary/10 p-3 rounded-full shrink-0">
                                    <Phone className="text-primary" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-dark text-lg">Phone & WhatsApp</h3>
                                    <p className="text-text-light mt-1">0323 4404772</p>
                                    <p className="text-text-light">0323 4404773</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-4">
                                <div className="bg-primary/10 p-3 rounded-full shrink-0">
                                    <Mail className="text-primary" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-dark text-lg">Email Support</h3>
                                    <p className="text-text-light mt-1">contact@idealsweets.com</p>
                                    <p className="text-xs text-text-light mt-1">We aim to respond within 24 hours.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Branch Locations */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-border">
                        <h2 className="font-heading text-2xl font-bold text-text-dark mb-6">Our Locations</h2>
                        
                        {loading ? (
                            <p className="text-text-light animate-pulse">Loading branch locations...</p>
                        ) : branches.length > 0 ? (
                            <div className="space-y-6">
                                {branches.map(branch => (
                                    <div key={branch._id} className="flex items-start gap-4 pb-6 border-b border-border last:border-0 last:pb-0">
                                        <div className="bg-secondary p-3 rounded-full shrink-0">
                                            <MapPin className="text-text-dark" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-primary text-lg">{branch.name}</h3>
                                            <p className="text-text-light mt-1 text-sm">{branch.address}</p>
                                            <p className="text-text-light mt-1 text-sm font-semibold">City: {branch.city}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-text-light">No active branches found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
