import React, { useState, useEffect } from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import banner1 from '../../assets/banner1.jpg';
import banner2 from '../../assets/banner2.jpg';
import banner3 from '../../assets/banner3.png'; 

const HomeScreen = () => {
    // Shared data
    const homeBannerItemProduct = {
        product: [
            { id: 1, itemTitle: "Revamp your home in style", imgs: ["https://m.media-amazon.com/images/I/41WnWm3IjiL._AC_SY200_.jpg","https://m.media-amazon.com/images/I/41WnWm3IjiL._AC_SY200_.jpg","https://m.media-amazon.com/images/I/41WnWm3IjiL._AC_SY200_.jpg","https://m.media-amazon.com/images/I/41WnWm3IjiL._AC_SY200_.jpg"] },
            { id: 2, itemTitle: "Appliances for your home", imgs: ["https://m.media-amazon.com/images/I/41WnWm3IjiL._AC_SY200_.jpg","https://m.media-amazon.com/images/I/41WnWm3IjiL._AC_SY200_.jpg","https://m.media-amazon.com/images/I/41WnWm3IjiL._AC_SY200_.jpg","https://m.media-amazon.com/images/I/41WnWm3IjiL._AC_SY200_.jpg"] },
            { id: 3, itemTitle: "Automotive essentials", imgs: ["https://m.media-amazon.com/images/I/41WnWm3IjiL._AC_SY200_.jpg","https://m.media-amazon.com/images/I/41WnWm3IjiL._AC_SY200_.jpg","https://m.media-amazon.com/images/I/41WnWm3IjiL._AC_SY200_.jpg","https://m.media-amazon.com/images/I/41WnWm3IjiL._AC_SY200_.jpg"] },
            { id: 4, itemTitle: "Up to 60% off | Styles for men", imgs: ["https://m.media-amazon.com/images/I/41WnWm3IjiL._AC_SY200_.jpg","https://m.media-amazon.com/images/I/41WnWm3IjiL._AC_SY200_.jpg","https://m.media-amazon.com/images/I/41WnWm3IjiL._AC_SY200_.jpg","https://m.media-amazon.com/images/I/41WnWm3IjiL._AC_SY200_.jpg"] }
        ]
    };

    const deals = Array.from({ length: 8 }, (_, i) => ({ id: i }));

    // Banner slider state
    const [currentSlide, setCurrentSlide] = useState(0);
    const bannerImages = [
        banner1, banner2, banner3 
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [bannerImages.length]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);

    return (
        <div className="flex flex-col w-full bg-[#EAEDED]">

            {/* --- HOME BANNER SECTION --- */}
            <div className="w-full relative bg-[#EAEDED] pb-4">

                {/* Banner Slider */}
                <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden">
                    {bannerImages.map((img, idx) => (
                        <img
                            key={idx}
                            className={`absolute h-full w-full object-cover object-top transition-opacity duration-700 ${
                                idx === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                            src={img}
                            alt={`Banner ${idx + 1}`}
                            style={{
                                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)'
                            }}
                        />
                    ))}

                    {/* Controls */}
                    <button onClick={prevSlide} className="absolute left-2 top-1/3 text-3xl md:text-5xl bg-white/30 hover:bg-white/50 p-2 z-30">
                        <IoChevronBack />
                    </button>
                    <button onClick={nextSlide} className="absolute right-2 top-1/3 text-3xl md:text-5xl bg-white/30 hover:bg-white/50 p-2 z-30">
                        <IoChevronForward />
                    </button>
                </div>

                {/* Cards */}
                <div className="w-full px-5 -mt-20 md:-mt-32 lg:-mt-40 relative z-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {homeBannerItemProduct.product.map((item) => (
                            <div key={item.id} className="flex flex-col bg-white p-5 w-full shadow-sm">
                                <h2 className="text-lg font-bold text-[#0F1111] mb-2">{item.itemTitle}</h2>

                                <div className="grid grid-cols-2 gap-4 flex-1 mt-2">
                                    {item.imgs.map((imgUrl, ind) => (
                                        <div key={ind}>
                                            <img className="w-full h-24 object-contain" src={imgUrl} alt="Product" />
                                            <span className="text-sm">boAt Stone 1800</span>
                                        </div>
                                    ))}
                                </div>

                                <a href="#" className="text-sm text-[#007185] hover:text-[#C7511F] mt-4">
                                    See More
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- DEALS SECTION --- */}
            <div className="w-full px-5 py-5">
                <div className="bg-white p-4">
                    <h2 className="text-lg font-bold mb-4">Today’s Deals</h2>

                    <div className="flex gap-4 overflow-x-auto">
                        {deals.map((deal) => (
                            <div key={deal.id} className="min-w-[150px] p-2 bg-gray-100">
                                <img src="https://m.media-amazon.com/images/I/41WnWm3IjiL._AC_SY200_.jpg" alt="deal" />
                                <p className="text-sm mt-2">Limited Deal</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default HomeScreen;