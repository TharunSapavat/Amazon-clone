import React from 'react';
import { IoStar, IoStarHalf, IoStarOutline } from 'react-icons/io5';
import { HiOutlineChevronDown } from 'react-icons/hi';

/**
 * Reusable StarRating component for Amazon-clone.
 * 
 * @param {number} rating - The numerical rating (e.g., 4.3)
 * @param {number} count - The number of reviews
 * @param {boolean} showChevron - Whether to show the dropdown chevron
 * @param {string} size - 'sm' or 'lg' for icon sizing
 * @param {boolean} showCount - Whether to show the review count text
 * @param {boolean} isCompact - Whether to use compact listing style for count
 */
const StarRating = ({ 
    rating, 
    count, 
    showChevron = false, 
    size = 'sm', 
    showCount = true,
    isCompact = false 
}) => {
    const fullStars = Math.floor(rating || 0);
    const hasHalf = (rating || 0) % 1 >= 0.5;
    const starColor = "#FFA41C";
    
    const iconSizeClass = size === 'lg' ? 'text-lg' : 'text-sm';
    const textClass = size === 'lg' 
        ? 'text-[15px] text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer ml-1 font-medium' 
        : 'text-xs text-[#007185] hover:text-[#C7511F] cursor-pointer';

    return (
        <div className={`flex items-center ${size === 'lg' ? 'gap-1.5' : 'gap-1'}`}>
            <div className={`flex text-[${starColor}] ${iconSizeClass}`}>
                {[...Array(5)].map((_, i) => {
                    if (i < fullStars) return <IoStar key={i} />;
                    if (i === fullStars && hasHalf) return <IoStarHalf key={i} />;
                    return <IoStarOutline key={i} />;
                })}
            </div>
            
            {showChevron && <HiOutlineChevronDown className="text-xs text-gray-500" />}
            
            {showCount && count !== undefined && (
                <span className={textClass}>
                    {isCompact ? `(${count})` : `${count.toLocaleString()} ratings`}
                </span>
            )}
        </div>
    );
};

export default StarRating;
