import React from 'react';
import { Link } from 'react-router-dom';
import { IoHeartOutline, IoHeart } from 'react-icons/io5';
import StarRating from './StarRating';
import OptimizedImage from './OptimizedImage';

/**
 * Reusable ProductCard component for listing pages.
 */
const ProductCard = ({ 
    product, 
    onAddToCart, 
    isInWishlist, 
    onToggleWishlist 
}) => {
    return (
        <div className="border border-[#F5F5F5] hover:shadow-lg p-3 flex flex-col rounded bg-white h-full relative group/card">
            
            {/* Wishlist Heart */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    onToggleWishlist(product);
                }}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-gray-200 hover:shadow-md transition-all hover:scale-110"
                title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
                {isInWishlist
                    ? <IoHeart className="text-[#CC0C39] text-lg" />
                    : <IoHeartOutline className="text-gray-500 text-lg" />
                }
            </button>

            {/* Product Image */}
            <Link to={`/product/${product.id}`} className="bg-[#F7F7F7] p-5 mb-3 flex items-center justify-center rounded cursor-pointer group h-[220px]">
                <OptimizedImage 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-[180px] h-[180px] object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                    containerClassName="w-full h-full flex items-center justify-center"
                />
            </Link>

            {/* Product Title */}
            <Link to={`/product/${product.id}`} className="text-[15px] text-[#0F1111] hover:text-[#C7511F] line-clamp-3 mb-1 font-medium leading-snug">
                {product.name}
            </Link>

            {/* Rating */}
            <StarRating 
                rating={product.rating} 
                count={product.review_count} 
                isCompact={true}
            />

            {/* Bought count */}
            {product.bought_count && (
                <p className="text-xs text-[#565959] mt-1 mb-2">
                    {product.bought_count}+ bought in past month
                </p>
            )}

            <div className="mt-auto">
                {/* Badge (Best Seller, etc.) */}
                {product.badge && (
                    <span className="bg-[#CC0C39] text-white text-[11px] font-bold px-2 py-0.5 w-fit block mb-2 rounded-sm uppercase">
                        {product.badge}
                    </span>
                )}

                {/* Price Information */}
                <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-[28px] font-medium leading-none text-[#0F1111]">
                        <span className="text-sm align-super mr-0.5">₹</span>
                        {product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm text-[#565959]">
                        M.R.P: <span className="line-through">₹{(product.mrp || 0).toLocaleString('en-IN')}</span> ({product.discount}% off)
                    </span>
                </div>

                <p className="text-xs mt-2 text-[#0F1111]">Up to 5% back with Amazon Pay I...</p>
                <p className="text-xs mt-1 text-[#0F1111]">
                    FREE delivery as soon as <span className="font-bold">Sat, 25 Apr, 7am - 10pm</span>
                </p>

                {/* Add to Cart Button */}
                <button
                    onClick={() => onAddToCart(product.id)}
                    className="bg-[#FFD814] border border-[#FCD200] hover:bg-[#F7CA00] rounded-full py-2 px-4 text-sm mt-4 w-full shadow-sm font-medium"
                >
                    Add to cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
