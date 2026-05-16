import React from 'react';
import { Croissant, Leaf, Truck, Tag } from 'lucide-react';

function WhyChooseUs() {
    const features = [
        {
            id: 1,
            icon: <Croissant size={56} strokeWidth={1.5} />,
            title: 'Baked Fresh Daily',
            description: 'Out of the oven and into your hands.'
        },
        {
            id: 2,
            icon: <Leaf size={56} strokeWidth={1.5} />,
            title: 'Quality Ingredients',
            description: 'No compromises, ever.'
        },
        {
            id: 3,
            icon: <Truck size={56} strokeWidth={1.5} />,
            title: 'Fast Delivery',
            description: 'Straight to your front door.'
        },
        {
            id: 4,
            icon: <Tag size={56} strokeWidth={1.5} />,
            title: 'Best Prices',
            description: 'Premium taste, affordable joy.'
        }
    ];

    return (
        <section className="bg-secondary py-20 px-8 border-y-2 border-border/50">
            <div className="max-w-7xl mx-auto">
                <h2 className="font-heading text-4xl font-bold text-center text-text-dark">
                    Why Super Ideal?
                </h2>
                <div className="w-16 h-1 bg-primary mx-auto mt-4 mb-6"></div>
                <p className="font-body text-text-light text-center max-w-xl mx-auto mb-12">
                    More than a bakery — we are a promise of quality, freshness, and taste.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                    {features.map((feature) => (
                        <div key={feature.id} className="flex flex-col items-center group cursor-pointer hover:-translate-y-1 transition-transform">
                            {/* Icon with circular maroon background overlay */}
                            <div className="text-primary mb-6 rounded-full bg-primary/10 p-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="font-heading font-bold text-xl text-text-dark mb-3">
                                {feature.title}
                            </h3>
                            <p className="font-body text-text-light text-sm">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default WhyChooseUs;
