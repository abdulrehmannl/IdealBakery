import React from 'react';
import { MapPin, Clock, Phone } from 'lucide-react';

function Branches() {
    const branches = [
        {
            id: 1,
            name: 'Dawood Chowk Branch',
            address: 'Dawood Chowk، Karbala Road, Madina Colony, Sahiwal, 57000',
            phone: '0323 4404773',
            timing: 'Mon - Sun: 7:00 AM - 11:00 PM',
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 2,
            name: 'Arra Tulla Road Branch',
            address: 'Arra Tulla Rd, Sahiwal',
            phone: '0323 4404772',
            timing: 'Mon - Sun: 8:00 AM - 10:00 PM',
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'
        }
    ];

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
                            key={branch.id} 
                            className="flex flex-col h-full bg-white border border-border shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
                        >
                            {/* Fixed h-56 image wrapper to normalize card layouts */}
                            <div className="w-full h-56 relative shrink-0">
                                <img 
                                    src={branch.image} 
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
                                        <span>{branch.timing}</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Phone size={18} className="shrink-0 mt-0.5 text-text-dark" />
                                        <span>{branch.phone}</span>
                                    </div>
                                </div>

                                <button className="mt-8 w-full px-6 py-3 bg-text-dark text-white font-bold text-sm tracking-wide hover:bg-primary transition-colors rounded">
                                    GET DIRECTIONS
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Branches;
