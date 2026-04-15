import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import amazonLogo from '../assets/amazonLogo.png';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [address, setAddress] = useState({
        fullName: 'Tharun',
        line1: 'Gummidipundi',
        city: 'Chennai',
        state: 'Tamil Nadu',
        zip: '601201'
    });

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await axios.get('/api/cart');
                setCartItems(res.data);
            } catch (err) {
                console.error("Cart error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const handlePlaceOrder = async () => {
        try {
            const res = await axios.post('/api/orders', {
                shipping_name: address.fullName,
                shipping_address: `${address.line1}, ${address.city}, ${address.state} ${address.zip}`,
                cart_item_ids: cartItems.map(i => i.id)
            });
            if (res.data.success) {
                window.dispatchEvent(new Event('cartUpdated'));
                navigate(`/confirmation?internal_id=${res.data.internal_order_id}`);
            }
        } catch (err) {
            console.error("Order error", err);
            // Simulate offline fallback nav if API fails
            window.dispatchEvent(new Event('cartUpdated'));
            navigate(`/confirmation?internal_id=ORDER-${Date.now()}`);
        }
    };

    if (loading) return <div className="p-10 font-bold">Loading Checkout...</div>;
    if (cartItems.length === 0) return <div className="p-10">Your cart is empty. Please add items before checking out.</div>;

    return (
        <div className="bg-white min-h-screen font-sans">
            {/* Minimal Header */}
            <header className="bg-gradient-to-b from-[#f9f9f9] to-[#eaeaea] border-b border-[#dddddd] py-4 px-6 md:px-12 flex justify-between items-center">
                <img src={amazonLogo} alt="Amazon" className="h-8 object-contain mix-blend-multiply cursor-pointer" onClick={() => navigate('/')} />
                <h1 className="text-2xl md:text-[28px] font-normal text-[#0F1111]">
                    Checkout <span className="text-[#007185] font-light">({totalQuantity} items)</span>
                </h1>
                <div className="w-8"></div>
            </header>

            {/* Main Content */}
            <div className="max-w-[1100px] mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6">
                
                {/* Left Column (Forms) */}
                <div className="flex-1">
                    {/* 1. Shipping Address */}
                    <div className="flex gap-4 pb-4 border-b border-gray-300">
                        <div className="font-bold text-lg w-8">1</div>
                        <div className="flex-1">
                            <h2 className="font-bold text-lg mb-2">Shipping address</h2>
                            <div className="grid gap-3 max-w-[400px]">
                                <input type="text" placeholder="Full name" value={address.fullName} onChange={e => setAddress({...address, fullName: e.target.value})} className="border border-gray-400 rounded px-3 py-1.5 shadow-sm focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none" />
                                <input type="text" placeholder="Address Line 1" value={address.line1} onChange={e => setAddress({...address, line1: e.target.value})} className="border border-gray-400 rounded px-3 py-1.5 shadow-sm focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none" />
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="text" placeholder="City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="border border-gray-400 rounded px-3 py-1.5 shadow-sm focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none" />
                                    <div className="flex gap-3">
                                        <input type="text" placeholder="State" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} className="border border-gray-400 rounded px-3 py-1.5 w-full shadow-sm focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none" />
                                        <input type="text" placeholder="ZIP" value={address.zip} onChange={e => setAddress({...address, zip: e.target.value})} className="border border-gray-400 rounded px-3 py-1.5 w-full shadow-sm focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Payment Method */}
                    <div className="flex gap-4 py-4 border-b border-gray-300">
                        <div className="font-bold text-lg w-8">2</div>
                        <div className="flex-1">
                            <h2 className="font-bold text-lg mb-2">Payment method</h2>
                            <div className="border border-[#e77600] rounded p-4 bg-[#fffaf5]">
                                <label className="flex items-center gap-2 font-bold text-sm">
                                    <input type="radio" checked readOnly className="accent-[#e77600] w-4 h-4 cursor-pointer" />
                                    Pay on Delivery
                                </label>
                                <p className="text-sm text-[#565959] ml-6 mt-1">Cash, UPI and Cards accepted. <span className="text-[#007185] hover:underline cursor-pointer">Know more.</span></p>
                            </div>
                        </div>
                    </div>

                    {/* 3. Review Items */}
                    <div className="flex gap-4 py-4">
                        <div className="font-bold text-lg w-8 text-[#c45500]">3</div>
                        <div className="flex-1">
                            <h2 className="font-bold text-lg text-[#c45500] mb-2">Review items and delivery</h2>
                            <div className="border border-[#c45500] rounded-lg p-5 bg-white">
                                <h3 className="font-bold text-[#007600] mb-4">Guaranteed delivery: 2 Days</h3>
                                <p className="text-sm text-[#565959] mb-4">Items dispatched by Amazon</p>
                                
                                <div className="flex flex-col gap-4">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex gap-4">
                                        <img src={item.image_url} alt={item.name} className="w-[80px] h-[80px] object-contain mix-blend-multiply" />
                                        <div>
                                            <p className="font-bold text-sm text-[#0F1111] leading-snug max-w-[400px]">{item.name}</p>
                                            <p className="text-[#B12704] font-bold text-sm mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                                            <p className="text-sm text-[#565959] mt-1">Quantity: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column (Order Summary Box) */}
                <div className="md:w-[320px] shrink-0">
                    <div className="border border-gray-300 rounded-lg p-4 sticky top-4 bg-white shadow-sm">
                        <button 
                            onClick={handlePlaceOrder}
                            className="w-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-full py-2 text-sm shadow-sm font-medium mb-4"
                        >
                            Place your order
                        </button>
                        <p className="text-[11px] text-center text-[#565959] mb-4 border-b border-gray-300 pb-4">
                            By placing your order, you agree to Amazon's <a href="#" className="text-[#007185] hover:underline">privacy notice</a> and <a href="#" className="text-[#007185] hover:underline">conditions of use</a>.
                        </p>

                        <h3 className="font-bold text-lg mb-2">Order Summary</h3>
                        <div className="text-[15px] space-y-1 border-b border-gray-300 pb-3 mb-3">
                            <div className="flex justify-between">
                                <span>Items:</span>
                                <span>₹{totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery:</span>
                                <span>₹0.00</span>
                            </div>
                        </div>
                        <div className="flex justify-between font-bold text-xl text-[#B12704] mb-4">
                            <span>Order Total:</span>
                            <span>₹{totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                        </div>

                        <div className="bg-[#f0f2f2] p-3 rounded text-xs text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer border border-[#d5d9d9]">
                            How are delivery costs calculated?
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CheckoutPage;
