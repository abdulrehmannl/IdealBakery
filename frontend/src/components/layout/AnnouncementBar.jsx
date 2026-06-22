import React, { useState, useEffect } from 'react';

function AnnouncementBar() {
    const messages = [
        "Free Delivery on orders above Rs. 1000!",
        "Fresh Baked Daily — Order Before 6PM",
        "Now Delivering to Both Branches!"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
        }, 3000); // 3 seconds interval

        return () => clearInterval(timer);
    }, [messages.length]);

    return (
        <div className="bg-primary text-white py-2 overflow-hidden flex justify-center items-center h-8">
            <div className="relative w-full text-center">
                {messages.map((message, index) => (
                    <span 
                        key={index} 
                        // Use text-[12.6px] to reduce font size by ~10% from standard 14px (text-sm)
                        className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 font-medium text-[12.6px] tracking-wide transition-all duration-500 ease-in-out ${
                            index === currentIndex 
                                ? 'opacity-100 transform translate-y-[-50%]' 
                                : 'opacity-0 transform translate-y-full'
                        }`}
                        aria-hidden={index !== currentIndex}
                    >
                        {message}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default AnnouncementBar;

/*
 * END OF FILE SUMMARY
 * =====================
 * 1. Concepts used:
 *    - `useState` + `useEffect` for interval rotation.
 *    - Absolute positioning with CSS transitions to create a slide-up/fade effect.
 * 2. Known limitations:
 *    - Height is fixed to `h-8`. Multi-line strings not supported without height increase.
 * 3. Performance considerations:
 *    - Proper cleanup in useEffect timer.
 */
