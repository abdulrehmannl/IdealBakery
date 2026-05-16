import React from 'react';
import { Link } from 'react-router-dom';

function SpecialOrders() {
    const specialOrders = [
        {
            id: 1,
            title: 'Birthday Cakes',
            image: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=600&q=80',
            description: 'Customized to your theme and flavors.',
            // Link to the dedicated Birthday Cakes special order page
            link: '/special/birthday-cakes',
        },
        {
            id: 2,
            title: 'Gift Boxes',
            image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
            description: 'The perfect sweet surprise for loved ones.',
            // Link to the dedicated Gift Boxes special order page
            link: '/special/gift-boxes',
        },
        {
            id: 3,
            title: 'Event Orders',
            image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
            description: 'Bulk orders catering for your large parties.',
            // Link to the dedicated Event Orders special order page
            link: '/special/event-orders',
        }
    ];

    return (
        <section className="bg-primary text-white py-20 px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="font-heading text-4xl font-bold text-center">
                    Made For Your Moments
                </h2>
                <div className="w-16 h-1 bg-white mx-auto mt-4 mb-6"></div>
                <p className="font-body text-white/80 text-center max-w-xl mx-auto mb-12">
                    Celebrate life's sweetest moments with our custom creations, crafted just for you.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {specialOrders.map((order) => (
                        <div key={order.id} className="flex flex-col group cursor-pointer hover:-translate-y-1 transition-transform">
                            <div className="aspect-[4/3] rounded-lg overflow-hidden border-2 border-white/20 group-hover:border-white/60 shadow-md bg-secondary/10 mb-6 relative">
                                <img 
                                    src={order.image} 
                                    alt={order.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 bg-gray-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            
                            <h3 className="font-heading text-2xl font-bold mb-2 group-hover:text-secondary transition-colors">
                                {order.title}
                            </h3>
                            <p className="font-body text-white/80 mb-6">
                                {order.description}
                            </p>
                            
                            {/* ORDER NOW button — navigates to the dedicated special page for this item */}
                            <Link
                                to={order.link}
                                className="self-start px-6 py-2 border border-white text-white font-bold text-sm tracking-wide group-hover:bg-white group-hover:text-primary transition-colors"
                            >
                                ORDER NOW
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default SpecialOrders;
