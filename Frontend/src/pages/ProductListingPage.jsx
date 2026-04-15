import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { IoStar, IoStarHalf, IoStarOutline, IoCheckmarkCircle } from 'react-icons/io5';
import axios from 'axios';

const ProductListingPage = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    freeShipping: false,
    brands: [],
    rating: 0,
    priceMin: 0,
    priceMax: 50000
  });
  const [toastMessage, setToastMessage] = useState(null);

  const category = searchParams.get('category') || 'All';
  const query = searchParams.get('q') || '';

  useEffect(() => {
    // Dummy Data Fallback for when backend is completely offline
    const dummyProducts = [
      { id: 1, name: "Samsung 28 L Convection Microwave Oven (MC28A5013AK/TL, Black, 10 Yr Warranty)", image_url: "https://m.media-amazon.com/images/I/41WnWm3IjiL._AC_SY200_.jpg", rating: 4.3, review_count: 5430, bought_count: "2K", badge: "Best seller", price: 11590, mrp: 15500, discount: 25 },
      { id: 2, name: "LG 28 L Convection Microwave Oven (MC2846SL, Silver)", image_url: "https://m.media-amazon.com/images/I/41WnWm3IjiL._AC_SY200_.jpg", rating: 4.5, review_count: 8200, bought_count: "3K", badge: "Amazon's Choice", price: 12490, mrp: 16990, discount: 26 },
      { id: 3, name: "IFB 30 L Convection Microwave Oven (30BRC2, Black)", image_url: "https://m.media-amazon.com/images/I/41WnWm3IjiL._AC_SY200_.jpg", rating: 4.1, review_count: 3100, bought_count: "1K", price: 13990, mrp: 18490, discount: 24 },
      { id: 4, name: "Voltas Beko 20 L Solo Microwave Oven (MS20MPW10, White)", image_url: "https://m.media-amazon.com/images/I/41WnWm3IjiL._AC_SY200_.jpg", rating: 4.0, review_count: 1500, bought_count: "500", price: 5490, mrp: 7490, discount: 26 },
      { id: 5, name: "Panasonic 23L Convection Microwave Oven (NN-CT353BFDG, Black Mirror)", image_url: "https://m.media-amazon.com/images/I/41WnWm3IjiL._AC_SY200_.jpg", rating: 3.9, review_count: 1244, bought_count: "800", badge: "Limited Deal", price: 10490, mrp: 12490, discount: 16 },
    ];

    setLoading(true);
    axios.get('/api/products', {
      params: { category, search: query, ...filters }
    }).then(res => {
      // Vite SPA fallback returns index.html (string) instead of 404 if no backend exists!
      if (Array.isArray(res.data)) {
        setProducts(res.data);
      } else {
        throw new Error("API returned non-array (likely Vite SPA fallback). Falling back to mock data.");
      }
      setLoading(false);
    }).catch(err => {
      console.log('Backend API override: populating with fallback dummy products.', err.message);
      setProducts(dummyProducts);
      setLoading(false);
    });
  }, [category, query, filters]);

  const handleAddToCart = async (productId) => {
    try {
        await axios.post('/api/cart', { product_id: productId, quantity: 1 });
        window.dispatchEvent(new Event('cartUpdated'));
        setToastMessage("Added to Cart");
        setTimeout(() => setToastMessage(null), 3000);
    } catch(err) {
        console.log("Mocked add to cart!", productId);
        window.dispatchEvent(new Event('cartUpdated'));
        setToastMessage("Added to Cart");
        setTimeout(() => setToastMessage(null), 3000);
    }
  };

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
        <span className="text-xs text-[#007185] hover:text-[#C7511F] cursor-pointer">({count})</span>
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1500px] mx-auto flex border-t border-gray-200">

        {/* Global Toast */}
        {toastMessage && (
          <div className="fixed top-4 right-4 z-50 bg-[#F2FBFA] border-l-4 border-[#007600] text-[#007600] px-5 py-3 rounded shadow-lg flex items-center gap-3 transition-opacity duration-300">
            <IoCheckmarkCircle className="text-2xl" />
            <span className="font-medium text-[15px]">{toastMessage}</span>
          </div>
        )}

        {/* LEFT SIDEBAR - FILTERS */}
        <aside className="hidden lg:block w-[280px] shrink-0 p-5 border-r border-gray-200">
          <div className="space-y-6 text-sm">

            {/* Free Shipping */}
            <div>
              <h3 className="font-bold text-sm mb-2">Eligible for Free Shipping</h3>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="mt-1 accent-[#0F1111]" />
                <span>Free Shipping<br/><span className="text-xs text-[#565959]">Get FREE Shipping on eligible orders shipped by Amazon</span></span>
              </label>
            </div>

            {/* Category */}
            <div>
              <h3 className="font-bold text-sm mb-2">Category</h3>
              <p className="text-[#0F1111] hover:text-[#C7511F] cursor-pointer">‹ Home & Kitchen</p>
              <p className="font-bold ml-2">Microwaves</p>
              <p className="ml-4 text-[#0F1111] hover:text-[#C7511F] cursor-pointer">Large Appliances</p>
            </div>

            {/* Brands */}
            <div>
              <h3 className="font-bold text-sm mb-2">Brands</h3>
              {['Samsung', 'LG', 'IFB', 'Voltas Beko'].map(brand => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer mb-1 hover:text-[#C7511F]">
                  <input type="checkbox" className="accent-[#0F1111]" />
                  <span>{brand}</span>
                </label>
              ))}
            </div>

            {/* Reviews */}
            <div>
              <h3 className="font-bold text-sm mb-2">Customer Reviews</h3>
              {[4, 3, 2, 1].map(star => (
                <div key={star} className="flex items-center gap-1 cursor-pointer hover:text-[#C7511F] mb-1">
                  <div className="flex text-[#FFA41C]">
                    {[...Array(star)].map((_, i) => <IoStar key={i} />)}
                    {[...Array(5-star)].map((_, i) => <IoStarOutline key={i} />)}
                  </div>
                  <span>& Up</span>
                </div>
              ))}
            </div>

            {/* Price */}
            <div>
              <h3 className="font-bold text-sm mb-2">Price</h3>
              <p className="mb-2 text-[#0F1111]">₹6,400 – ₹17,900+</p>
              <input type="range" className="w-full accent-[#007185] cursor-pointer" />
              <div className="mt-2 space-y-1 text-[#0F1111]">
                <p className="cursor-pointer hover:text-[#C7511F]">Up to ₹8,700</p>
                <p className="cursor-pointer hover:text-[#C7511F]">₹8,700 - ₹10,500</p>
                <p className="cursor-pointer hover:text-[#C7511F]">₹10,500 - ₹13,500</p>
                <p className="cursor-pointer hover:text-[#C7511F]">Over ₹13,500</p>
              </div>
            </div>

          </div>
        </aside>

        {/* RIGHT - RESULTS */}
        <main className="flex-1 p-5 pb-12">
          <h1 className="text-2xl font-bold mb-1">Results</h1>
          <p className="text-sm text-[#565959] mb-6">Check each product page for other buying options.</p>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                 <div key={i} className="border border-[#F5F5F5] p-3 flex flex-col rounded bg-white h-full animate-pulse shadow-sm">
                    <div className="bg-gray-200 h-[180px] w-full mb-3 rounded"></div>
                    <div className="h-4 bg-gray-200 w-full mb-2 rounded"></div>
                    <div className="h-4 bg-gray-200 w-3/4 mb-4 rounded"></div>
                    <div className="h-3 bg-gray-200 w-1/2 mb-6 rounded"></div>
                    <div className="h-8 bg-gray-200 w-full rounded-full mt-auto"></div>
                 </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <div key={product.id} className="border border-[#F5F5F5] hover:shadow-lg p-3 flex flex-col rounded bg-white h-full">

                  <Link to={`/product/${product.id}`} className="bg-[#F7F7F7] p-5 mb-3 flex items-center justify-center rounded cursor-pointer group">
                    <img loading="lazy" decoding="async" src={product.image_url} alt={product.name} className="w-[180px] h-[180px] object-contain mix-blend-multiply group-hover:scale-105 transition-transform" />
                  </Link>

                  <Link to={`/product/${product.id}`} className="text-[15px] text-[#0F1111] hover:text-[#C7511F] line-clamp-3 mb-1 font-medium leading-snug">
                    {product.name}
                  </Link>

                  <StarRating rating={product.rating} count={product.review_count} />

                  <p className="text-xs text-[#565959] mt-1 mb-2">{product.bought_count}+ bought in past month</p>

                  <div className="mt-auto">
                    {product.badge && (
                        <span className="bg-[#CC0C39] text-white text-[11px] font-bold px-2 py-0.5 w-fit block mb-2 rounded-sm">
                        {product.badge.toUpperCase()}
                        </span>
                    )}

                    <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-[28px] font-medium leading-none text-[#0F1111]">
                            <span className="text-sm align-super mr-0.5">₹</span>
                            {product.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-sm text-[#565959]">
                        M.R.P: <span className="line-through">₹{product.mrp.toLocaleString('en-IN')}</span> ({product.discount}% off)
                        </span>
                    </div>

                    <p className="text-xs mt-2 text-[#0F1111]">Up to 5% back with Amazon Pay I...</p>
                    <p className="text-xs mt-1 text-[#0F1111]">
                        FREE delivery as soon as <span className="font-bold">Sat, 25 Apr, 7am - 10pm</span>
                    </p>

                    <button
                        onClick={() => handleAddToCart(product.id)}
                        className="bg-[#FFD814] border border-[#FCD200] hover:bg-[#F7CA00] rounded-full py-2 px-4 text-sm mt-4 w-full shadow-sm"
                    >
                        Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductListingPage;
