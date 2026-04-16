import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { IoStar, IoStarHalf, IoStarOutline, IoTrashOutline, IoCheckmarkCircle, IoSearch, IoCartOutline } from 'react-icons/io5';
import { HiOutlineChevronDown } from 'react-icons/hi';
import axios from '../api/axios';
import OptimizedImage from '../components/OptimizedImage';

const WISHLIST_KEY = 'amazon_clone_wishlist';

// Helper to read wishlist from localStorage
export const getWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
  } catch {
    return [];
  }
};

// Helper to save wishlist to localStorage
export const saveWishlist = (items) => {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('wishlistUpdated'));
};

// Helper to add item to wishlist
export const addToWishlist = (product) => {
  const list = getWishlist();
  if (list.find(item => item.id === product.id)) return false; // already exists
  const wishlistItem = {
    id: product.id,
    name: product.name,
    image_url: product.image_url || (product.images && product.images[0]) || '',
    price: product.price,
    mrp: product.mrp,
    discount: product.discount,
    rating: product.rating,
    review_count: product.review_count,
    brand: product.brand || '',
    badge: product.badge || '',
    addedAt: new Date().toISOString()
  };
  list.unshift(wishlistItem);
  saveWishlist(list);
  return true;
};

// Helper to remove item from wishlist
export const removeFromWishlist = (productId) => {
  const list = getWishlist().filter(item => item.id !== productId);
  saveWishlist(list);
};

// Helper to check if item is in wishlist
export const isInWishlist = (productId) => {
  return getWishlist().some(item => item.id === productId);
};

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [toastMessage, setToastMessage] = useState(null);

  // Load wishlist from localStorage
  useEffect(() => {
    setWishlistItems(getWishlist());

    const handleUpdate = () => setWishlistItems(getWishlist());
    window.addEventListener('wishlistUpdated', handleUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleUpdate);
  }, []);

  const handleDelete = (productId) => {
    removeFromWishlist(productId);
    setToastMessage('Item removed from your list');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddToCart = async (item) => {
    try {
      await axios.post('/api/cart', { product_id: item.id, quantity: 1 });
      window.dispatchEvent(new Event('cartUpdated'));
    } catch {
      console.log('Mock: added to cart', item.id);
      window.dispatchEvent(new Event('cartUpdated'));
    }
    setToastMessage('Added to Cart');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter + Sort
  const displayedItems = useMemo(() => {
    let items = [...wishlistItems];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(item => item.name.toLowerCase().includes(q) || (item.brand && item.brand.toLowerCase().includes(q)));
    }

    // Sort
    switch (sortBy) {
      case 'recent':
        items.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
        break;
      case 'price-low':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        items.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return items;
  }, [wishlistItems, searchQuery, sortBy]);

  const StarRating = ({ rating, count }) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    return (
      <div className="flex items-center gap-1">
        <div className="flex text-[#FFA41C] text-sm">
          {[...Array(5)].map((_, i) => {
            if (i < fullStars) return <IoStar key={i} />;
            if (i === fullStars && hasHalf) return <IoStarHalf key={i} />;
            return <IoStarOutline key={i} />;
          })}
        </div>
        {count && <span className="text-xs text-[#007185] hover:text-[#C7511F] cursor-pointer ml-0.5">{count.toLocaleString()}</span>}
      </div>
    );
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#F2FBFA] border-l-4 border-[#007600] text-[#007600] px-5 py-3 rounded shadow-lg flex items-center gap-3 transition-opacity duration-300">
          <IoCheckmarkCircle className="text-2xl" />
          <span className="font-medium text-[15px]">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-[1100px] mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-1">
          <div>
            <h1 className="text-2xl font-bold text-[#0F1111] mb-0">Your Lists</h1>
          </div>
        </div>

        {/* Tab - Only "Your Lists" */}
        <div className="border-b-2 border-gray-200 mb-6">
          <button className="pb-2 border-b-[3px] border-[#E77600] text-[#0F1111] font-bold text-[15px] mr-6">
            Your Lists
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* LEFT SIDEBAR */}
          <div className="lg:w-[220px] shrink-0">
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-[#F7F7F7] px-4 py-3 border-b border-gray-300">
                <p className="font-bold text-sm text-[#0F1111]">Shopping List</p>
                <p className="text-[11px] text-[#565959]">Default List</p>
              </div>
              <div className="px-4 py-2 text-xs text-[#565959]">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
              </div>
            </div>
          </div>

          {/* RIGHT - LIST CONTENT */}
          <div className="flex-1">

            {/* List Title Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h2 className="text-xl font-bold text-[#0F1111]">
                Shopping List <span className="text-sm font-normal text-[#565959] ml-2">Private</span>
              </h2>
            </div>

            {/* Toolbar: Search + Sort */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
              <div className="relative flex-1 max-w-[300px]">
                <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Search this list"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 pl-9 pr-3 text-sm text-[#0F1111] focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.3)]"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-[#565959] whitespace-nowrap">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm text-[#0F1111] focus:outline-none focus:border-[#e77600] bg-[#F0F2F2] appearance-none cursor-pointer"
                  >
                    <option value="recent">Most recently added</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name</option>
                  </select>
                  <HiOutlineChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Items */}
            {displayedItems.length === 0 ? (
              <div className="border border-gray-200 rounded-lg p-10 text-center">
                {wishlistItems.length === 0 ? (
                  <>
                    <div className="text-6xl mb-4">📋</div>
                    <p className="text-lg font-medium text-[#0F1111] mb-2">Your list is empty</p>
                    <p className="text-sm text-[#565959] mb-4">
                      Add items you'd like to keep track of by clicking the heart icon on any product.
                    </p>
                    <Link
                      to="/"
                      className="inline-block bg-[#FFD814] border border-[#FCD200] hover:bg-[#F7CA00] rounded-full py-2 px-6 text-sm font-medium shadow-sm"
                    >
                      Continue shopping
                    </Link>
                  </>
                ) : (
                  <p className="text-sm text-[#565959]">No items match your search.</p>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200 border-t border-gray-200">
                {displayedItems.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-4 py-5">

                    {/* Image */}
                    <Link to={`/product/${item.id}`} className="w-[180px] h-[180px] shrink-0 mx-auto sm:mx-0 bg-[#F7F7F7] p-3 rounded flex items-center justify-center">
                      <OptimizedImage
                        src={item.image_url}
                        alt={item.name}
                        className="max-w-full max-h-full object-contain mix-blend-multiply"
                        containerClassName="w-full h-full flex items-center justify-center"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.id}`}
                        className="text-[15px] text-[#007185] hover:text-[#C7511F] hover:underline line-clamp-2 leading-snug font-medium"
                      >
                        {item.name}
                      </Link>

                      {item.brand && (
                        <p className="text-xs text-[#565959] mt-1">by {item.brand}</p>
                      )}

                      <StarRating rating={item.rating || 0} count={item.review_count} />

                      {item.badge && (
                        <span className="inline-block bg-[#CC0C39] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm mt-1.5">
                          {item.badge}
                        </span>
                      )}

                      {/* Price */}
                      <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-[22px] font-medium leading-none text-[#0F1111]">
                          <span className="text-xs align-super mr-0.5">₹</span>
                          {item.price?.toLocaleString('en-IN')}
                        </span>
                        {item.mrp && (
                          <span className="text-sm text-[#565959]">
                            M.R.P: <span className="line-through">₹{item.mrp.toLocaleString('en-IN')}</span>
                          </span>
                        )}
                        {item.discount && (
                          <span className="bg-[#CC0C39] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-sm ml-1">
                            {item.discount}% off
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#565959] mt-2">
                        Item added {formatDate(item.addedAt)}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center gap-3 mt-3 flex-wrap">
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="bg-[#FFD814] border border-[#FCD200] hover:bg-[#F7CA00] rounded-full py-1.5 px-5 text-[13px] font-medium shadow-sm flex items-center gap-1.5"
                        >
                          <IoCartOutline className="text-base" />
                          Add to Cart
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="flex items-center gap-1 text-[13px] text-[#565959] hover:text-[#CC0C39] transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <IoTrashOutline className="text-base" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
