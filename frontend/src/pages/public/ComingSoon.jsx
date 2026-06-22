import React from 'react';

function ComingSoon({ title }) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-text-dark mb-4">
                {title}
            </h1>
            <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
            <p className="font-body text-lg text-text-light max-w-md mx-auto mb-8">
                We're working on it. Check back soon! 🚧
            </p>
            <a 
                href="/"
                className="bg-primary text-white px-8 py-3 rounded font-bold tracking-widest text-sm hover:bg-[#6A1414] transition-colors"
            >
                BACK TO HOME
            </a>
        </div>
    );
}

export default ComingSoon;
