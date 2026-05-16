import React from 'react';

/**
 * MarqueeTicker Component
 * A robust horizontally scrolling ticker.
 * Designed with a black background and white text.
 */
function MarqueeTicker() {
    // The text segment we repeat to ensure it crosses the screen completely
    const textSegment = "FRESH BAKED DAILY • SINCE 1995 • 2 BRANCHES • QUALITY GUARANTEED • ";
    
    // Create an array to repeat the text enough times to fill the bar seamlessly
    const segments = Array(8).fill(textSegment);

    return (
        <section className="bg-text-dark text-white py-4 overflow-hidden border-y border-gray-800 flex whitespace-nowrap select-none">
            {/* 
                We use the same custom .animate-marquee class defined in index.css 
                The key to infinite marquee without JS is having content wider than screen
                and translating exactly half its width
            */}
            <div className="inline-block animate-marquee font-nav font-bold tracking-[0.2em] text-sm pause-animation">
                {segments.map((text, idx) => (
                    <span key={idx} className="mr-4">
                        {text}
                    </span>
                ))}
            </div>
            {/* Duplicate block for seamless endless loop */}
            <div className="inline-block animate-marquee font-nav font-bold tracking-[0.2em] text-sm pause-animation" aria-hidden="true">
                {segments.map((text, idx) => (
                    <span key={idx} className="mr-4">
                        {text}
                    </span>
                ))}
            </div>
        </section>
    );
}

export default MarqueeTicker;

/*
 * END OF FILE SUMMARY
 * =====================
 * 1. Concepts used:
 *    - `aria-hidden` set to true on the duplicate element so screen readers don't read it twice.
 *    - Custom CSS animation applied to multiple blocks.
 * 2. Dummy Data: 
 *    - Hardcoded string variables.
 * 3. Known limitations:
 *    - If viewed on an ultra-wide screen (>4000px), 8 segments might not be enough to hide the loop resetting.
 * 4. Performance considerations:
 *    - Strictly utilizes CSS layer animations, meaning 0 CPU main-thread overhead offloading work to GPU.
 */
