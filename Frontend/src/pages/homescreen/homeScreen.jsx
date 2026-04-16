import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import OptimizedImage from '../../components/OptimizedImage';
import BannerSlider from '../../components/BannerSlider';
import banner1 from '../../assets/banner1.jpg';
import banner2 from '../../assets/banner2.jpg';
import banner3 from '../../assets/banner3.png'; 

const HomeScreen = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('/api/products');
                setProducts(res.data);
            } catch (err) {
                console.error("Failed to load products dynamically:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Create 4 category blocks dynamically by mapping to what the User actually included in seed
    const electronicsDeals = products.filter(p => p.category === 'Electronics').slice(0, 4);
    const appliancesDeals = products.filter(p => p.category === 'Appliances').slice(0, 4);
    const fashionDeals = products.filter(p => p.category === 'Fashion').slice(0, 4);
    const homeDeals = products.filter(p => p.category === 'Home').slice(0, 4);

    const homeBannerItemProduct = [
        { id: 1, itemTitle: "Latest Electronics | Up to 40% off", categoryParam: "Electronics", items: electronicsDeals.length > 0 ? electronicsDeals : products.slice(0, 4) },
        { id: 2, itemTitle: "Major Appliances | Exchange Offers", categoryParam: "Appliances", items: appliancesDeals.length > 0 ? appliancesDeals : products.slice(4, 8) },
        { id: 3, itemTitle: "Festival Fashion | Trending Now", categoryParam: "Fashion", items: fashionDeals.length > 0 ? fashionDeals : products.slice(8, 12) },
        { id: 4, itemTitle: "Home Upgrades", categoryParam: "Home", items: homeDeals.length > 0 ? homeDeals : products.slice(12, 16) }
    ];

    const bannerImages = [
        banner1, banner2, banner3 
    ];

    return (
        <div className="flex flex-col w-full bg-[#EAEDED]">

            {/* --- HOME BANNER SECTION --- */}
            <div className="w-full relative bg-[#EAEDED] pb-4">

                <BannerSlider images={bannerImages} />

                {/* Cards */}
                <div className="w-full px-5 -mt-20 md:-mt-32 lg:-mt-40 relative z-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {homeBannerItemProduct.map((block) => (
                            <div key={block.id} className="flex flex-col bg-white p-5 w-full shadow-sm">
                                <h2 className="text-lg font-bold text-[#0F1111] mb-2">{block.itemTitle}</h2>

                                <div className="grid grid-cols-2 gap-x-4 gap-y-6 flex-1 mt-2">
                                    {loading ? (
                                        Array.from({ length: 4 }).map((_, i) => (
                                            <div key={i} className="flex flex-col items-start animate-pulse">
                                                <div className="w-full h-24 bg-gray-200 rounded-sm mb-2"></div>
                                                <div className="h-3 bg-gray-200 w-3/4 rounded-sm"></div>
                                            </div>
                                        ))
                                    ) : block.items.map((prod, ind) => (
                                        <Link to={`/product/${prod.id}`} key={ind} className="flex flex-col items-start hover:opacity-90 transition-opacity">
                                            <div className="w-full h-24 flex items-center justify-center p-2">
                                                <OptimizedImage
                                                    src={prod.image_url}
                                                    alt={prod.name}
                                                    className="max-w-full max-h-full object-contain mix-blend-multiply"
                                                    containerClassName="w-full h-full flex items-center justify-center"
                                                />
                                            </div>
                                            <span className="text-[13px] text-[#0F1111] leading-snug line-clamp-1 mt-1">{prod.name}</span>
                                        </Link>
                                    ))}
                                </div>

                                <Link to={`/products?category=${encodeURIComponent(block.categoryParam)}`} className="text-[13px] font-medium text-[#007185] hover:text-[#C7511F] mt-4">
                                    See all offers
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- DEALS SECTION --- */}
            <div className="w-full px-5 py-5 pb-10">
                <div className="bg-white p-5 shadow-sm relative">
                    <div className="flex items-center gap-4 mb-4">
                        <h2 className="text-[20px] font-bold text-[#0F1111]">Today's Deals</h2>
                        <Link to="/products" className="text-[13px] font-medium text-[#007185] hover:text-[#C7511F] hover:underline">See all deals</Link>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {loading ? (
                            Array.from({ length: 7 }).map((_, i) => (
                                <div key={i} className="min-w-[200px] flex flex-col animate-pulse">
                                    <div className="h-[200px] bg-gray-200 rounded mb-3"></div>
                                    <div className="h-4 bg-gray-200 w-1/2 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
                                </div>
                            ))
                        ) : products.map((deal) => (
                            <Link to={`/product/${deal.id}`} key={deal.id} className="min-w-[200px] flex flex-col group cursor-pointer transition-all">
                                <div className="h-[200px] bg-[#F7F7F7] flex items-center justify-center p-4 rounded mb-2 group-hover:bg-[#f0f0f0] transition-colors">
                                    <OptimizedImage
                                        src={deal.image_url}
                                        alt={deal.name}
                                        className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                                        containerClassName="w-full h-full flex items-center justify-center"
                                    />
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="bg-[#CC0C39] text-white text-[12px] font-bold px-1.5 py-1 rounded-sm">Up to {deal.discount}% off</span>
                                    <span className="text-[#CC0C39] text-[12px] font-bold">Great Indian Festival</span>
                                </div>
                                <p className="text-[15px] font-medium text-[#0F1111] line-clamp-2 leading-snug">{deal.name}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default HomeScreen;