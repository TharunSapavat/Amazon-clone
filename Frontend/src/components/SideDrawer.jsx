import React, { useEffect, useRef } from 'react';
import { IoCloseOutline, IoChevronForwardOutline, IoPersonCircleOutline } from 'react-icons/io5';
import { HiOutlineGlobeAlt } from 'react-icons/hi';
import { TbTruckDelivery } from 'react-icons/tb';
import { MdOutlineHeadphones, MdOutlineSettings, MdOutlineInventory2 } from 'react-icons/md';
import { BsHeart, BsBoxSeam } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const SideDrawer = ({ isOpen, onClose, categories = [] }) => {
    const drawerRef = useRef(null);
    const navigate = useNavigate();

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden'; 
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    const handleNavigate = (path) => {
        onClose();
        navigate(path);
    };

    const handleCategoryClick = (category) => {
        onClose();
        navigate(`/products?category=${encodeURIComponent(category)}`);
    };

    // Grouped quick-links for the drawer
    const trendingLinks = [
        { label: 'Best Sellers', path: '/products' },
        { label: 'New Releases', path: '/products' },
        { label: 'Movers and Shakers', path: '/products' },
    ];

    const digitalLinks = [
        { label: 'Echo & Alexa', path: '/products?category=Electronics' },
        { label: 'Fire TV', path: '/products?category=Electronics' },
        { label: 'Kindle E-Readers', path: '/products?category=Electronics' },
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/60 transition-opacity duration-300" onClick={onClose}></div>

            {/* Sidebar content */}
            <div 
                ref={drawerRef}
                className={`relative w-[300px] sm:w-[365px] h-full bg-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute -right-12 top-2 text-white text-4xl hover:text-gray-200 transition-colors"
                >
                    <IoCloseOutline />
                </button>

                {/* Header */}
                <div className="bg-[#232f3e] text-white p-4 pl-9 flex items-center gap-3 shrink-0 cursor-pointer hover:bg-[#3a4553] transition-colors"
                     onClick={() => handleNavigate('/')}
                >
                    <IoPersonCircleOutline className="text-3xl" />
                    <span className="text-lg font-bold">Hello, Tharun</span>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    
                    {/* Trending */}
                    <div className="py-3 border-b border-gray-300">
                        <h3 className="px-9 text-[17px] font-bold text-[#111] mb-1">Trending</h3>
                        {trendingLinks.map((link) => (
                            <div 
                                key={link.label} 
                                onClick={() => handleNavigate(link.path)}
                                className="flex items-center justify-between px-9 py-2.5 hover:bg-[#EAEDED] text-[14px] text-[#111] cursor-pointer transition-colors"
                            >
                                <span>{link.label}</span>
                                <IoChevronForwardOutline className="text-gray-400 text-xs" />
                            </div>
                        ))}
                    </div>

                    {/* Digital Content & Devices */}
                    <div className="py-3 border-b border-gray-300">
                        <h3 className="px-9 text-[17px] font-bold text-[#111] mb-1">Digital Content & Devices</h3>
                        {digitalLinks.map((link) => (
                            <div 
                                key={link.label} 
                                onClick={() => handleNavigate(link.path)}
                                className="flex items-center justify-between px-9 py-2.5 hover:bg-[#EAEDED] text-[14px] text-[#111] cursor-pointer transition-colors"
                            >
                                <span>{link.label}</span>
                                <IoChevronForwardOutline className="text-gray-400 text-xs" />
                            </div>
                        ))}
                    </div>

                    {/* Shop By Category */}
                    <div className="py-3 border-b border-gray-300">
                        <h3 className="px-9 text-[17px] font-bold text-[#111] mb-1">Shop By Category</h3>
                        {categories.slice(0, 10).map((cat) => (
                            <div 
                                key={cat.id} 
                                onClick={() => handleCategoryClick(cat.label)}
                                className="flex items-center justify-between px-9 py-2.5 hover:bg-[#EAEDED] text-[14px] text-[#111] cursor-pointer transition-colors"
                            >
                                <span>{cat.label}</span>
                                <IoChevronForwardOutline className="text-gray-400 text-xs" />
                            </div>
                        ))}
                        {categories.length > 10 && (
                            <div 
                                onClick={() => handleNavigate('/products')}
                                className="flex items-center gap-2 px-9 py-2.5 hover:bg-[#EAEDED] text-[14px] text-[#007185] cursor-pointer transition-colors font-medium"
                            >
                                See All Categories
                            </div>
                        )}
                    </div>

                    {/* Programs & Features */}
                    <div className="py-3 border-b border-gray-300">
                        <h3 className="px-9 text-[17px] font-bold text-[#111] mb-1">Programs & Features</h3>
                        {[
                            { label: 'Today\'s Deals', path: '/products' },
                            { label: 'Gift Cards & Mobile Recharges', path: '/products' },
                            { label: 'Amazon Pay', path: '/products' },
                        ].map((link) => (
                            <div 
                                key={link.label} 
                                onClick={() => handleNavigate(link.path)}
                                className="flex items-center justify-between px-9 py-2.5 hover:bg-[#EAEDED] text-[14px] text-[#111] cursor-pointer transition-colors"
                            >
                                <span>{link.label}</span>
                                <IoChevronForwardOutline className="text-gray-400 text-xs" />
                            </div>
                        ))}
                    </div>

                    {/* Quick Links with Icons */}
                    <div className="py-3 border-b border-gray-300">
                        <h3 className="px-9 text-[17px] font-bold text-[#111] mb-1">Your Account</h3>
                        {[
                            { icon: <BsBoxSeam />, label: 'Your Orders', path: '/orders' },
                            { icon: <BsHeart />, label: 'Your Wishlist', path: '/wishlist' },
                            { icon: <MdOutlineInventory2 />, label: 'Your Cart', path: '/cart' },
                        ].map((link) => (
                            <div 
                                key={link.label} 
                                onClick={() => handleNavigate(link.path)}
                                className="flex items-center gap-3 px-9 py-2.5 hover:bg-[#EAEDED] text-[14px] text-[#111] cursor-pointer transition-colors"
                            >
                                <span className="text-lg text-[#565959]">{link.icon}</span>
                                <span>{link.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Help & Settings */}
                    <div className="py-3 pb-10">
                        <h3 className="px-9 text-[17px] font-bold text-[#111] mb-1">Help & Settings</h3>
                        {[
                            { icon: <HiOutlineGlobeAlt />, label: 'English' },
                            { icon: <MdOutlineHeadphones />, label: 'Customer Service' },
                            { icon: <MdOutlineSettings />, label: 'Settings' },
                        ].map((link) => (
                            <div 
                                key={link.label} 
                                onClick={onClose}
                                className="flex items-center gap-3 px-9 py-2.5 hover:bg-[#EAEDED] text-[14px] text-[#111] cursor-pointer transition-colors"
                            >
                                <span className="text-lg text-[#565959]">{link.icon}</span>
                                <span>{link.label}</span>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SideDrawer;
