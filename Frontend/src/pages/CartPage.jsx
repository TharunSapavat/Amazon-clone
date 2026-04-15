import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoTrashOutline } from 'react-icons/io5';
import { BsCheckCircleFill } from 'react-icons/bs';
import axios from 'axios';
import OptimizedImage from '../components/OptimizedImage';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const FREE_SHIPPING_THRESHOLD = 499;

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get('/api/cart');
      if (Array.isArray(res.data)) {
        setCartItems(res.data);
        setSelectedItems(res.data.map(item => item.id));
      } else {
        throw new Error("Missing API");
      }
      setLoading(false);
    } catch (err) {
      console.log('Mocking Cart Response API.', err.message);
      const mockData = [
        { id: 101, product_id: 1, name: "Samsung 28 L Convection Microwave Oven (MC28A5013AK/TL, Black, 10 Yr Warranty)", image_url: "https://m.media-amazon.com/images/I/41WnWm3IjiL._AC_SY200_.jpg", price: 11590, mrp: 15500, discount: 25, quantity: 1, color: "Black", badge: "Best seller" },
        { id: 102, product_id: 3, name: "IFB 30 L Convection Microwave Oven (30BRC2, Black)", image_url: "https://m.media-amazon.com/images/I/41WnWm3IjiL._AC_SY200_.jpg", price: 13990, mrp: 18490, discount: 24, quantity: 2, color: "Black" }
      ];
      setCartItems(mockData);
      setSelectedItems(mockData.map(item => item.id));
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQty) => {
    if (newQty < 1) {
      deleteItem(cartItemId);
      return;
    }
    
    try {
        await axios.put(`/api/cart/${cartItemId}`, { quantity: newQty });
        fetchCart();
        window.dispatchEvent(new Event('cartUpdated'));
    } catch(err) {
        console.log("Mock Quantity Update");
        setCartItems(prev => prev.map(item => item.id === cartItemId ? { ...item, quantity: newQty } : item));
        window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const deleteItem = async (cartItemId) => {
    try {
        await axios.delete(`/api/cart/${cartItemId}`);
        fetchCart();
        window.dispatchEvent(new Event('cartUpdated'));
    } catch(err) {
        console.log("Mock delete");
        setCartItems(prev => prev.filter(item => item.id !== cartItemId));
        window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const toggleSelectItem = (cartItemId) => {
    setSelectedItems(prev =>
      prev.includes(cartItemId)
       ? prev.filter(id => id!== cartItemId)
        : [...prev, cartItemId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.id));
    }
  };

  const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));
  const subtotal = selectedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = selectedCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const isEligibleForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const amountForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  if (loading) return <div className="h-screen bg-[#EAEDED] flex items-center justify-center font-bold">Loading...</div>;

  return (
    <div className="bg-[#EAEDED] min-h-screen pb-10">
      <div className="max-w-[1500px] mx-auto p-4 md:p-6">
        <div className="flex flex-col lg:flex-row gap-5">

          {/* LEFT - CART ITEMS */}
          <div className="flex-1">
            <div className="bg-white p-5 w-full">
              <h1 className="text-[28px] font-normal text-[#0F1111] mb-1">Shopping Cart</h1>

              {cartItems.length === 0? (
                <div className="py-10 text-center">
                  <p className="text-xl mb-4">Your Amazon Cart is empty</p>
                  <Link to="/" className="text-[#007185] hover:text-[#C7511F] hover:underline">
                    Continue shopping
                  </Link>
                </div>
              ) : (
                <>
                  <button
                    onClick={toggleSelectAll}
                    className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline mb-2"
                  >
                    {selectedItems.length === cartItems.length? 'Deselect all items' : 'Select all items'}
                  </button>

                  <div className="border-t border-gray-300 mb-4">
                    <div className="text-right text-sm text-[#565959] mt-1">Price</div>
                  </div>

                  {/* Cart Items */}
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row gap-4 py-4 border-b border-gray-200">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                        className="mt-2 sm:mt-12 w-4 h-4 accent-[#0F1111] cursor-pointer"
                      />

                      <Link to={`/product/${item.product_id}`} className="w-[180px] h-[180px] shrink-0 mx-auto sm:mx-0">
                        <OptimizedImage
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-contain mix-blend-multiply"
                          containerClassName="w-full h-full"
                        />
                      </Link>

                      <div className="flex-1 pt-2">
                        <Link
                          to={`/product/${item.product_id}`}
                          className="text-lg text-[#0F1111] font-medium hover:text-[#C7511F] line-clamp-2 leading-snug"
                        >
                          {item.name}
                        </Link>

                        <p className="text-sm text-[#007600] font-medium mt-1">In stock</p>
                        <p className="text-xs mt-1 text-[#0F1111]">
                          FREE delivery <span className="font-bold">Sat, 18 Apr</span> available at checkout
                        </p>

                        <div className="flex items-center gap-1 mt-1.5">
                          <img
                            src="https://m.media-amazon.com/images/G/31/marketing/fba/fba-badge_18px._CB485936079_.png"
                            alt="Fulfilled"
                            className="h-4"
                          />
                        </div>

                        <label className="flex items-center gap-2 mt-2 text-xs cursor-pointer text-[#0F1111]">
                          <input type="checkbox" className="accent-[#0F1111]" />
                          <span>This will be a gift <a href="#" className="text-[#007185] hover:underline">Learn more</a></span>
                        </label>

                        <p className="text-xs mt-1 text-[#0F1111]">
                          <span className="font-bold">Colour:</span> {item.color || 'Blue'}
                        </p>

                        {/* Quantity + Actions */}
                        <div className="flex items-center gap-4 mt-3 text-sm text-[#007185]">
                          <div className="flex items-center border border-[#D5D9D9] bg-[#F0F2F2] rounded-[8px] overflow-hidden shadow-sm h-7">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-3 hover:bg-[#E3E6E6] h-full flex items-center justify-center transition-colors"
                            >
                              <IoTrashOutline className="text-lg text-[#0F1111]" />
                            </button>
                            <span className="px-3 bg-white h-full flex items-center text-[#0F1111] text-[15px]">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 hover:bg-[#E3E6E6] h-full flex items-center justify-center text-lg leading-none transition-colors border-l border-[#D5D9D9]"
                            >
                              +
                            </button>
                          </div>

                          <button onClick={() => deleteItem(item.id)} className="hover:text-[#C7511F] hover:underline">
                            Delete
                          </button>
                          <span className="text-gray-300">|</span>
                          <button className="hover:text-[#C7511F] hover:underline">Save for later</button>
                          <span className="text-gray-300">|</span>
                          <button className="hover:text-[#C7511F] hover:underline">See more like this</button>
                          <span className="text-gray-300">|</span>
                          <button className="hover:text-[#C7511F] hover:underline">Share</button>
                        </div>
                      </div>

                      {/* Price Column */}
                      <div className="text-right w-full sm:w-[120px] shrink-0 pt-2">
                        {item.badge && (
                          <p className="text-[11px] text-[#CC0C39] font-bold mb-1">{item.badge}</p>
                        )}
                        {item.discount && (
                          <span className="bg-[#CC0C39] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-sm">
                            -{item.discount}%
                          </span>
                        )}
                        <div className="flex items-baseline justify-end gap-0.5 mt-1">
                          <span className="text-[18px] font-bold text-[#0F1111]">
                            <sup className="text-[11px] mr-0.5">₹</sup>{item.price.toLocaleString('en-IN')}
                            <sup className="text-[11px] ml-0.5">00</sup>
                          </span>
                        </div>
                        {item.mrp && (
                          <p className="text-xs text-[#565959] mt-0.5">
                            M.R.P.: <span className="line-through">₹{item.mrp.toLocaleString('en-IN')}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Subtotal */}
                  <div className="text-right text-lg mt-4 pt-4 border-t border-gray-300">
                    Subtotal ({totalItems} {totalItems === 1? 'item' : 'items'}):{' '}
                    <span className="font-bold text-[#0F1111]">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </>
              )}
            </div>

            {/* Your Items Section */}
            <div className="bg-white p-5 mt-5">
              <h2 className="text-[24px] font-bold mb-4 text-[#0F1111]">Your Items</h2>
              <div className="border-b border-gray-300 mb-4">
                <div className="flex gap-6 text-sm">
                  <button className="pb-2 border-b-2 border-transparent hover:text-[#C7511F]">No items saved for later</button>
                  <button className="pb-2 border-b-2 border-[#007185] text-[#007185] font-bold">Buy it again</button>
                </div>
              </div>
              <div className="border border-gray-300 rounded p-6 text-sm text-[#565959] text-center">
                No items
              </div>
            </div>
          </div>

          {/* RIGHT - SUBTOTAL BOX */}
          <div className="lg:w-[300px] shrink-0">
            <div className="bg-white p-5 sticky top-20 shadow-sm border border-gray-200">
              {isEligibleForFreeShipping? (
                <div className="mb-4">
                  <div className="flex items-start gap-2 text-xs">
                    <BsCheckCircleFill className="text-[#067D62] text-xl mt-0.5 shrink-0" />
                    <p className="text-[#067D62] leading-snug">
                      <span className="font-bold block text-sm">Your order is eligible for FREE Delivery.</span>
                      <span className="text-[#0F1111]">Choose <a href="#" className="text-[#007185] hover:underline">FREE Delivery</a> option at checkout.</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="w-full bg-gray-200 h-2 rounded-full mb-2 overflow-hidden">
                    <div
                      className="bg-[#067D62] h-2 rounded-full"
                      style={{ width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-[#0F1111] leading-snug">
                    Add <span className="text-[#B12704]">₹{amountForFreeShipping.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span> of eligible items to your order to qualify for FREE Delivery.
                  </p>
                </div>
              )}

              <div className="text-[18px] mb-4 text-[#0F1111]">
                Subtotal ({totalItems} {totalItems === 1? 'item' : 'items'}):{' '}
                <span className="font-bold block">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>

              <label className="flex items-start gap-2 text-sm mb-4 cursor-pointer">
                <input type="checkbox" className="mt-1 accent-[#0F1111]" />
                <span className="text-[#0F1111]">This order contains a gift</span>
              </label>

              <button
                onClick={() => navigate('/checkout')}
                disabled={selectedItems.length === 0}
                className="w-full bg-[#FFD814] hover:bg-[#F7CA00] disabled:bg-[#EEEEE] border border-[#FCD200] disabled:border-none disabled:text-gray-400 disabled:cursor-not-allowed rounded-full py-2 text-sm shadow-sm font-medium transition-colors"
              >
                Proceed to Buy
              </button>
            </div>

            {/* Ignoring Prime promo div as requested */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
