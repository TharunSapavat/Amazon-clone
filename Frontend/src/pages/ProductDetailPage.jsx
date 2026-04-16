import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoStar, IoStarHalf, IoStarOutline, IoShareOutline, IoLocationOutline, IoCheckmarkCircle, IoHeartOutline, IoHeart } from 'react-icons/io5';
import { HiOutlineChevronDown } from 'react-icons/hi';
import { BsShieldCheck } from 'react-icons/bs';
import { TbTruckDelivery, TbCash, TbLock } from 'react-icons/tb';
import { MdOutlineAssignmentReturn, MdOutlineVerifiedUser } from 'react-icons/md';
import axios from '../api/axios';
import OptimizedImage from '../components/OptimizedImage';
import { addToWishlist, removeFromWishlist, isInWishlist } from './WishlistPage';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    // Dummy product for when backend falls through
    const dummyProduct = {
      id,
      name: "Samsung 28 L Convection Microwave Oven (MC28A5013AK/TL, Black, 10 Yr Warranty)",
      brand: "Samsung",
      rating: 4.3,
      review_count: 5430,
      discount: 25,
      price: 11590,
      mrp: 15500,
      specs: { capacity: "28 L" },
      description: [
        "28L Capacity: Suitable for large families",
        "Convection: Can be used for baking along with grilling, reheating, defrosting and cooking",
        "Warranty: 1 year on product, 5 years on magnetron, 10 years on ceramic enamel cavity",
        "Brand does NOT provide starter kit with this product",
        "Control: Touch Key Pad (Membrane) is sensitive to touch and easy to clean"
      ],
      images: [
        "https://m.media-amazon.com/images/I/41WnWm3IjiL._AC_SY200_.jpg",
        "https://m.media-amazon.com/images/I/41WnWm3IjiL._AC_SY200_.jpg", 
        "https://m.media-amazon.com/images/I/41WnWm3IjiL._AC_SY200_.jpg"
      ]
    };

    axios.get(`/api/products/${id}`).then(res => {
      // Check for Vite HTML fallback
      if (typeof res.data === 'object' && res.data.id && !Array.isArray(res.data)) {
        setProduct(res.data);
      } else {
        throw new Error("Missing API");
      }
      setLoading(false);
    }).catch(err => {
      console.log('Mocking product data due to no API:', err.message);
      setProduct(dummyProduct);
      setLoading(false);
    });
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await axios.post('/api/cart', { product_id: product.id, quantity });
      window.dispatchEvent(new Event('cartUpdated'));
      setToastMessage("Added to Cart");
      setTimeout(() => setToastMessage(null), 3000);
    } catch (e) {
      console.log("Mock added to cart", quantity, "units");
      window.dispatchEvent(new Event('cartUpdated'));
      setToastMessage("Added to Cart");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/checkout'); // Needs a checkout component later
  };

  const StarRating = ({ rating, count }) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    return (
      <div className="flex items-center gap-1.5">
        <div className="flex text-[#FFA41C] text-lg">
          {[...Array(5)].map((_, i) => {
            if (i < fullStars) return <IoStar key={i} />;
            if (i === fullStars && hasHalf) return <IoStarHalf key={i} />;
            return <IoStarOutline key={i} />;
          })}
        </div>
        <HiOutlineChevronDown className="text-xs text-gray-500" />
        <span className="text-[15px] text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer ml-1 font-medium">
          {count.toLocaleString()} ratings
        </span>
      </div>
    );
  };

  if (loading) return (
    <div className="bg-white min-h-screen">
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#F2FBFA] border-l-4 border-[#007600] text-[#007600] px-5 py-3 rounded shadow-lg flex items-center gap-3 transition-opacity duration-300">
          <IoCheckmarkCircle className="text-2xl" />
          <span className="font-medium text-[15px]">{toastMessage}</span>
        </div>
      )}
      <div className="max-w-[1500px] mx-auto px-4 py-4 mt-8 animate-pulse">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-[35%] flex gap-3">
             <div className="hidden md:flex flex-col gap-2 shrink-0">
               <div className="w-12 h-12 bg-gray-200 rounded"></div>
               <div className="w-12 h-12 bg-gray-200 rounded"></div>
               <div className="w-12 h-12 bg-gray-200 rounded"></div>
             </div>
             <div className="flex-1 h-[400px] lg:h-[500px] bg-gray-200 rounded"></div>
          </div>
          <div className="lg:w-[40%] flex flex-col pt-2 shrink-0 space-y-4">
             <div className="h-8 bg-gray-200 w-full rounded"></div>
             <div className="h-8 bg-gray-200 w-3/4 rounded"></div>
             <div className="h-4 bg-gray-200 w-1/3 rounded mt-4"></div>
             <div className="h-6 bg-gray-200 w-1/4 rounded mt-4"></div>
             <div className="h-32 bg-gray-200 w-full rounded mt-6"></div>
          </div>
          <div className="lg:w-[25%] shrink-0">
             <div className="border border-gray-200 rounded-lg p-4 h-[350px]">
                <div className="h-8 bg-gray-200 w-1/2 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 w-3/4 rounded mb-6"></div>
                <div className="h-10 bg-gray-200 w-full rounded-full mb-3"></div>
                <div className="h-10 bg-gray-200 w-full rounded-full"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!product) return <div className="h-screen flex items-center justify-center font-bold text-lg">Product not found</div>;

  return (
    <div className="bg-white min-h-screen">
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#F2FBFA] border-l-4 border-[#007600] text-[#007600] px-5 py-3 rounded shadow-lg flex items-center gap-3 transition-opacity duration-300">
          <IoCheckmarkCircle className="text-2xl" />
          <span className="font-medium text-[15px]">{toastMessage}</span>
        </div>
      )}
      <div className="max-w-[1500px] mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* LEFT - IMAGE GALLERY */}
          <div className="lg:w-[35%] flex flex-col md:flex-row gap-3">
            
            {/* Main Image - Top on Mobile, Right on Desktop */}
            <div className="flex-1 relative order-1 md:order-2">
              <button className="absolute top-2 right-2 text-2xl text-gray-600 hover:text-black z-10">
                <IoShareOutline />
              </button>
              <OptimizedImage
                eager={true}
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-contain mix-blend-multiply"
                containerClassName="w-full h-[300px] md:h-[400px] lg:h-[500px]"
              />
              <p className="text-center text-[13px] text-[#565959] mt-2 cursor-pointer hover:underline hidden md:block">
                Click image to open expanded view
              </p>
            </div>

            {/* Thumbnails - Below on Mobile, Left on Desktop */}
            <div className="flex flex-row md:flex-col gap-2 shrink-0 order-2 md:order-1 overflow-x-auto md:overflow-visible pb-1 md:pb-0 scrollbar-hide">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-12 h-12 md:w-[44px] md:h-[44px] border rounded cursor-pointer p-1 overflow-hidden shrink-0 mix-blend-multiply transition-all ${
                    selectedImage === idx? 'border-[#e77600] shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]' : 'border-gray-300 hover:border-[#a2a6ac]'
                  }`}
                >
                  <OptimizedImage eager={true} src={img} alt="" className="w-full h-full object-contain" containerClassName="w-full h-full" />
                </div>
              ))}
            </div>

          </div>

          {/* CENTER - PRODUCT INFO */}
          <div className="lg:w-[40%] flex flex-col pt-2 shrink-0">
            <h1 className="text-2xl leading-8 font-medium text-[#0F1111] mb-1">
              {product.name}
            </h1>

            <a href="#" className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline mt-1 font-medium">
              Brand: {product.brand}
            </a>

            <div className="flex items-center gap-2 mt-2 pb-3 border-b border-gray-300">
              <span className="text-base font-medium">{product.rating}</span>
              <StarRating rating={product.rating} count={product.review_count} />
              <span className="text-sm text-[#007185] hover:underline cursor-pointer ml-3">Search this page</span>
            </div>

            {/* Price */}
            <div className="mt-3 pb-3 border-b border-gray-300">
              <div className="flex items-start gap-3">
                <span className="text-3xl text-[#CC0C39] font-light mt-1">-{product.discount}%</span>
                <span className="text-[32px] text-[#0F1111] font-medium flex items-start">
                  <sup className="text-[15px] mt-[6px] mr-0.5">₹</sup>{product.price.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-sm text-[#565959] mt-1">
                M.R.P.: <span className="line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
              </p>
              <p className="text-sm mt-1 text-[#0F1111]">Inclusive of all taxes</p>
              <p className="text-sm mt-2 text-[#0F1111]">
                <span className="font-bold">EMI</span> starts at ₹556. No Cost EMI available{' '}
                <span className="text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer">EMI options</span>
                <HiOutlineChevronDown className="inline text-xs ml-0.5" />
              </p>
            </div>

            {/* Offers */}
            <div className="mt-4 pb-4 border-b border-gray-300">
              <div className="flex items-center gap-2 mb-3">
                <BsShieldCheck className="text-[#007600] text-xl" />
                <span className="font-bold text-[#0F1111]">Offers</span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {[
                  { title: 'Cashback', desc: 'Upto ₹53.00 cashback as Amazon Pay Balance on ICICI...', link: '3 offers ›' },
                  { title: 'Bank Offer', desc: 'Upto ₹2,500.00 discount on select Credit Cards', link: '39 offers ›' },
                  { title: 'No Cost EMI', desc: 'Upto ₹58.33 EMI interest savings on Amazon Pay ICICI...', link: '2 offers ›' },
                  { title: 'Partner Offers', desc: 'Get GST invoice and save up to 18% on business purchase', link: '1 offer ›' }
                ].map((offer, idx) => (
                  <div key={idx} className="border border-gray-300 rounded-lg p-3 shadow-sm bg-white">
                    <p className="font-bold text-sm mb-1 text-[#0F1111]">{offer.title}</p>
                    <p className="text-xs text-[#0F1111] line-clamp-3 mb-2 leading-snug">{offer.desc}</p>
                    <a href="#" className="text-xs text-[#007185] hover:text-[#C7511F] hover:underline font-medium">{offer.link}</a>
                  </div>
                ))}
              </div>
            </div>

            {/* Icons Row */}
            <div className="flex justify-between py-4 border-b border-gray-300 text-xs text-[#007185]">
               {[
                { icon: <MdOutlineAssignmentReturn className="text-[28px]" />, text: '10 days\nReturnable' },
                { icon: <TbTruckDelivery className="text-[28px]" />, text: 'Free Delivery' },
                { icon: <TbCash className="text-[28px]" />, text: 'Pay on Delivery' },
                { icon: <MdOutlineVerifiedUser className="text-[28px]" />, text: 'Amazon\nDelivered' },
                { icon: <TbLock className="text-[28px]" />, text: 'Secure\ntransaction' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center hover:text-[#C7511F] cursor-pointer w-[60px]">
                  <div className="text-[#067D62] bg-[#F2FBFA] p-2 rounded-full mb-1">{item.icon}</div>
                  <span className="whitespace-pre-line text-[11px] leading-tight font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Product Details Table */}
            <div className="mt-4 text-sm text-[#0F1111]">
              <div className="grid grid-cols-2 gap-y-2 max-w-[400px]">
                <span className="font-bold">Brand</span>
                <span>{product.brand}</span>
                <span className="font-bold">Capacity</span>
                <span>{product.specs?.capacity || '28 L'}</span>
                <span className="font-bold">Special Feature</span>
                <span>Auto Cook</span>
                <span className="font-bold">Product Dimensions</span>
                <span>47.5D x 49.5W x 31H cm</span>
              </div>
            </div>

            {/* About this item */}
            {product.description && (
              <div className="mt-5 border-t border-gray-300 pt-4">
                <h2 className="font-bold text-base text-[#0F1111] mb-2">About this item</h2>
                <ul className="list-disc pl-5 text-sm text-[#0F1111] space-y-1">
                  {Array.isArray(product.description) 
                    ? product.description.map((point, idx) => <li key={idx}>{point}</li>)
                    : <li>{product.description}</li>}
                </ul>
              </div>
            )}
          </div>

          {/* RIGHT - BUY BOX */}
          <div className="lg:w-[25%] shrink-0">

            {/* Price + Add to Cart Box */}
            <div className="border border-gray-300 rounded-lg p-4 shadow-sm text-[#0F1111]">
              <div className="flex items-start gap-0.5">
                <sup className="text-sm mt-1">₹</sup>
                <span className="text-3xl font-medium">{product.price.toLocaleString('en-IN')}</span>
                <sup className="text-sm mt-1">00</sup>
              </div>

              <p className="text-[15px] mt-3">
                FREE delivery <span className="font-bold">Tuesday, 21 April</span>.{' '}
                <a href="#" className="text-[#007185] hover:underline">Details</a>
              </p>

              <div className="flex items-start gap-1 mt-3 text-sm">
                <IoLocationOutline className="text-lg mt-0.5" />
                <a href="#" className="text-[#007185] hover:text-[#C7511F] hover:underline">
                  Deliver to IIIT Sri City 601201
                </a>
              </div>

              <p className="text-lg text-[#007600] font-medium mt-4">In stock</p>

              <ul className="text-sm mt-2 space-y-1 mb-4">
                <li className="flex gap-4"><span className="w-16">Ships from</span> <span>Amazon</span></li>
                <li className="flex gap-4"><span className="w-16">Sold by</span> <a href="#" className="text-[#007185] hover:underline">Galaxy Retail</a></li>
                <li className="flex gap-4"><span className="w-16">Packaging</span> <a href="#" className="text-[#007185] hover:underline truncate w-32 inline-block align-bottom text-left border-b-transparent">Shows what's inside...</a></li>
              </ul>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-bold mb-2">Add a Protection Plan:</p>
                <label className="flex items-start gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input type="checkbox" className="mt-1 accent-[#0F1111]" />
                  <span className="flex-1"><a href="#" className="text-[#007185] hover:underline">Extended Warranty</a> for <span className="text-[#B12704]">₹179.00</span></span>
                </label>
              </div>

              <div className="mt-4 border border-[#D5D9D9] hover:bg-[#F0F2F2] rounded-lg shadow-sm p-[1px] bg-white inline-block w-full cursor-pointer focus-within:shadow-[0_0_3px_2px_rgba(0,113,133,0.5)] focus-within:border-[#007185]">
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-[#F0F2F2] border-none text-[15px] px-2 py-1.5 outline-none rounded-md cursor-pointer"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i+1} value={i+1}>Quantity: {i+1}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-[#FFD814] border border-[#FCD200] hover:bg-[#F7CA00] rounded-full py-2 text-[15px] mt-4 shadow-sm font-medium"
              >
                Add to cart
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full bg-[#FFA41C] border border-[#FF8F00] hover:bg-[#FA8900] rounded-full py-2 text-[15px] mt-2 shadow-sm font-medium"
              >
                Buy Now
              </button>

              {/* Add to Wishlist */}
              <button
                onClick={() => {
                  if (isInWishlist(product.id)) {
                    removeFromWishlist(product.id);
                    setToastMessage('Removed from Wishlist');
                  } else {
                    addToWishlist(product);
                    setToastMessage('Added to Wishlist');
                  }
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                className="w-full border border-[#D5D9D9] hover:bg-[#F7FAFA] rounded-full py-2 text-[13px] mt-2 shadow-sm font-medium text-[#0F1111] flex items-center justify-center gap-2 transition-colors"
              >
                {isInWishlist(product.id)
                  ? <><IoHeart className="text-[#CC0C39] text-lg" /> In your Wishlist</>
                  : <><IoHeartOutline className="text-lg" /> Add to Wishlist</>
                }
              </button>

              <div className="flex items-center justify-center gap-1 mt-4 text-[#007185] text-sm hover:text-[#C7511F] hover:underline cursor-pointer">
                <TbLock className="text-gray-500 text-lg" /> Secure transaction
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
