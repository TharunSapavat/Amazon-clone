import React, { useEffect, useRef } from 'react';
import { IoCloseOutline, IoChevronForwardOutline, IoLogOutOutline, IoPersonCircleOutline } from 'react-icons/io5';
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

    const handleCategoryClick = (category) => {
        onClose();
        navigate(`/products?category=${encodeURIComponent(category)}`);
    };

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
                <div className="bg-[#232f3e] text-white p-4 pl-9 flex items-center gap-3 shrink-0">
                    <IoPersonCircleOutline className="text-3xl" />
                    <span className="text-lg font-bold">Hello, sign in</span>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    
                    {/* Simplified Category Section */}
                    <div className="py-4 border-b border-gray-200">
                        <h3 className="px-9 text-[18px] font-bold text-[#111] mb-2 uppercase tracking-tight">Shop By Category</h3>
                        {categories.map((cat) => (
                            <div 
                                key={cat.id} 
                                onClick={() => handleCategoryClick(cat.label)}
                                className="flex items-center justify-between px-9 py-3 hover:bg-gray-100 text-[14px] text-[#111] cursor-pointer group transition-colors border-l-4 border-transparent hover:border-[#e77600]"
                            >
                                <span className="font-medium">{cat.label}</span>
                                <IoChevronForwardOutline className="text-gray-400 group-hover:text-gray-600" />
                            </div>
                        ))}
                    </div>

                    {/* Simple Footer Settings */}
                    <div className="py-4 pb-10">
                        <h3 className="px-9 text-[18px] font-bold text-[#111] mb-2 uppercase tracking-tight">Help & Settings</h3>
                        <div onClick={onClose} className="flex items-center gap-2 px-9 py-3 hover:bg-gray-100 text-[14px] text-[#111] cursor-pointer transition-colors">
                            <IoLogOutOutline className="text-lg" /> Sign Out
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SideDrawer;
