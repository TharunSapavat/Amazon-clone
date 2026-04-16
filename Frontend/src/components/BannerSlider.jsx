import React, { useState, useEffect } from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

/**
 * Reusable BannerSlider component for the Home Screen.
 */
const BannerSlider = ({ images = [] }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (images.length === 0) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [images.length]);

    // Preload next banner image
    useEffect(() => {
        if (images.length === 0) return;
        const nextSlideIdx = (currentSlide + 1) % images.length;
        const img = new Image();
        img.src = images[nextSlideIdx];
    }, [currentSlide, images]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);

    if (images.length === 0) return null;

    return (
        <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden">
            {images.map((img, idx) => {
                const isActive = idx === currentSlide;
                const isAdjacent = idx === (currentSlide + 1) % images.length ||
                                   idx === (currentSlide - 1 + images.length) % images.length;
                if (!isActive && !isAdjacent) return null;

                return (
                    <img
                        key={idx}
                        className={`absolute h-full w-full object-cover object-top transition-opacity duration-700 ${
                            isActive ? 'opacity-100' : 'opacity-0'
                        }`}
                        src={img}
                        alt={`Banner ${idx + 1}`}
                        loading={idx === 0 ? 'eager' : 'lazy'}
                        decoding={idx === 0 ? 'sync' : 'async'}
                        fetchPriority={idx === 0 ? 'high' : 'auto'}
                        style={{
                            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)'
                        }}
                    />
                );
            })}

            {/* Controls */}
            <button 
                onClick={prevSlide} 
                className="absolute left-2 top-1/3 text-3xl md:text-5xl bg-white/30 hover:bg-white/50 p-2 z-30 focus:outline-none transition-colors"
                aria-label="Previous Slide"
            >
                <IoChevronBack />
            </button>
            <button 
                onClick={nextSlide} 
                className="absolute right-2 top-1/3 text-3xl md:text-5xl bg-white/30 hover:bg-white/50 p-2 z-30 focus:outline-none transition-colors"
                aria-label="Next Slide"
            >
                <IoChevronForward />
            </button>
        </div>
    );
};

export default BannerSlider;
