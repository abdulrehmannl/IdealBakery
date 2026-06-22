import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Phone } from 'lucide-react';
import api from '../../utils/api';

function Branches() {
    const [branches, setBranches] = useState([]);
    
    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const res = await api.get('/api/branches');
                if (res.data.success) {
                    setBranches(res.data.branches || res.data.data);
                }
            } catch (err) {
                console.error("Failed to load branches:", err);
            }
        };
        fetchBranches();
    }, []);


    return (
        <section id="branches" className="bg-card-bg py-20 px-8">
            <div className="max-w-5xl mx-auto">
                <h2 className="font-heading text-4xl font-bold text-center text-text-dark">
                    Visit Us
                </h2>
                <div className="w-16 h-1 bg-primary mx-auto mt-4 mb-6"></div>
                <p className="font-body text-text-light text-center max-w-xl mx-auto mb-12">
                    Come experience the warmth of our bakery in person. We are waiting for you.
                </p>

                {/* items-stretch forces equal height on grid children */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
                    {branches.map(branch => (
                        <div 
                            key={branch._id} 
                            className="flex flex-col h-full bg-white border border-border shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
                        >
                            {/* Fixed h-56 image wrapper to normalize card layouts */}
                            <div className="w-full h-56 relative shrink-0">
                                <img 
                                    src={branch.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'} 
                                    alt={`Storefront of ${branch.name}`}
                                    className="w-full h-full object-cover bg-gray-100 border-b border-border"
                                />
                            </div>
                            
                            <div className="p-8 flex flex-col flex-1">
                                <h3 className="font-heading text-2xl font-bold text-primary mb-4">
                                    {branch.name}
                                </h3>
                                
                                <div className="space-y-4 text-text-light font-body text-sm flex-1">
                                    <div className="flex items-start gap-3">
                                        <MapPin size={18} className="shrink-0 mt-0.5 text-text-dark" />
                                        <span>{branch.address}</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Clock size={18} className="shrink-0 mt-0.5 text-text-dark" />
                                        <span>{branch.openingHours}</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Phone size={18} className="shrink-0 mt-0.5 text-text-dark" />
                                        <span>{branch.phone}</span>
                                    </div>
                                </div>

                                {branch.googleMapsLink ? (
                                    <a 
                                        href={branch.googleMapsLink} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="mt-8 w-full block text-center px-6 py-3 bg-text-dark text-white font-bold text-sm tracking-wide hover:bg-primary transition-colors rounded"
                                    >
                                        GET DIRECTIONS
                                    </a>
                                ) : (
                                    <button className="mt-8 w-full px-6 py-3 bg-text-dark text-white font-bold text-sm tracking-wide hover:bg-primary transition-colors rounded">
                                        GET DIRECTIONS
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Branches;
