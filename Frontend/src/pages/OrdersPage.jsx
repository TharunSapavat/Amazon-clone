import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoSearch } from 'react-icons/io5';
import { HiOutlineChevronDown } from 'react-icons/hi';
import axios from '../api/axios';
import OptimizedImage from '../components/OptimizedImage';
import { useDebounce } from '../hooks/useDebounce';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('Orders');
  const [timeFilter, setTimeFilter] = useState('past 3 months');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [loading, setLoading] = useState(true);

  const tabs = ['Orders', 'Buy Again', 'Not Yet Shipped'];
  const timeFilters = ['past 30 days', 'past 3 months', '2025', '2024', 'Archived orders'];

  useEffect(() => {
    fetchOrders();
  }, [timeFilter, debouncedSearchQuery]);

  const fetchOrders = async (q = debouncedSearchQuery) => {
    setLoading(true);
    try {
      const res = await axios.get('/api/orders', {
        params: { timeframe: timeFilter, search: q }
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (orderId, itemId) => {
    if (!window.confirm("Are you sure you want to return this item?")) return;
    try {
        await axios.post('/api/returns', { order_id: orderId, order_item_id: itemId });
        fetchOrders();
    } catch (e) {
        console.error("Return failed:", e);
        alert("Failed to process return. Please try again.");
    }
  };

  const OrderCard = ({ order }) => {
    const isDelivered = order.status === 'DELIVERED';
    const isShipped = order.status === 'SHIPPED';
    const canReturn = isDelivered && order.delivered_date &&
      new Date() - new Date(order.delivered_date) < 10 * 24 * 60 * 60 * 1000;

    return (
      <div className="border border-gray-300 rounded-lg mb-5 overflow-hidden font-sans shadow-sm">
        {/* Order Header */}
        <div className="bg-[#F0F2F2] px-5 py-3.5 text-sm border-b border-gray-300 text-[#565959]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <div>
              <p className="text-xs">ORDER PLACED</p>
              <p className="text-sm font-medium text-[#0F1111]">
                {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-xs">TOTAL</p>
              <p className="text-sm font-medium text-[#0F1111]">₹{order.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-xs">SHIP TO</p>
              <button className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline flex items-center gap-0.5">
                {order.shipping_name} <HiOutlineChevronDown className="text-xs" />
              </button>
            </div>
            <div className="lg:text-right">
              <p className="text-xs">ORDER # {order.internal_order_id || order.id}</p>
              <div className="flex lg:justify-end gap-2 text-sm mt-0.5">
                <a href="#" className="text-[#007185] hover:text-[#C7511F] hover:underline">View order details</a>
                <span className="text-gray-300">|</span>
                <button className="text-[#007185] hover:text-[#C7511F] hover:underline flex items-center gap-0.5">
                  Invoice <HiOutlineChevronDown className="text-xs" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Order Body */}
        <div className="p-5 bg-white">
          {order.items.map((item, idx) => (
            <div key={item.id} className={`flex flex-col lg:flex-row gap-5 ${idx > 0? 'mt-5 pt-5 border-t border-gray-200' : ''}`}>

              {/* Delivery Status + Product */}
              <div className="flex-1">
                <p className={`text-lg font-bold mb-1 ${isDelivered? 'text-[#0F1111]' : 'text-[#007600]'}`}>
                  {isDelivered? `Delivered ${new Date(order.delivered_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}`
                    : isShipped? `Arriving ${new Date(order.estimated_delivery).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}`
                    : 'Processing'}
                </p>
                {isDelivered && <p className="text-[13px] mb-3 text-[#0F1111]">Package was handed to resident</p>}
                {order.subscription && <p className="text-[13px] mb-3">Auto-delivered: {order.subscription}</p>}

                <div className="flex gap-4 mt-3">
                  <Link to={`/product/${item.product_id}`} className="w-[90px] h-[90px] shrink-0 border border-gray-200 p-1 flex items-center justify-center rounded">
                    <OptimizedImage
                      src={item.image_url}
                      alt={item.name}
                      className="max-w-full max-h-full object-contain mix-blend-multiply"
                      containerClassName="w-full h-full"
                    />
                  </Link>
                  <div>
                    <Link
                      to={`/product/${item.product_id}`}
                      className="text-sm font-medium text-[#007185] hover:text-[#C7511F] hover:underline line-clamp-3 leading-snug"
                    >
                      {item.name}
                    </Link>
                    {item.is_returned && (
                      <p className="text-sm text-[#CC0C39] mt-2 font-bold">Return completed</p>
                    )}
                    <button className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-full py-1 px-3 text-[13px] shadow-sm mt-3 flex items-center gap-1">
                        <span className="text-[#0F1111] font-medium min-w-[max-content]">Buy it again</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="lg:w-[250px] flex flex-col gap-1.5 shrink-0">
                {isShipped &&!isDelivered && (
                  <button className="w-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-full py-1.5 px-4 text-sm shadow-sm font-medium">
                    Track package
                  </button>
                )}
                {isDelivered && canReturn &&!item.is_returned && (
                  <button
                    onClick={() => handleReturn(order.id, item.id)}
                    className="w-full border border-[#D5D9D9] bg-white hover:bg-[#F0F2F2] rounded-full py-1.5 px-4 text-sm shadow-sm font-medium"
                  >
                    Return or replace items
                  </button>
                )}
                <button className="w-full border border-[#D5D9D9] bg-white hover:bg-[#F0F2F2] rounded-full py-1.5 px-4 text-sm shadow-sm font-medium">
                  View or edit order
                </button>
                <button className="w-full border border-[#D5D9D9] bg-white hover:bg-[#F0F2F2] rounded-full py-1.5 px-4 text-sm shadow-sm font-medium">
                  View your Subscribe & Save
                </button>
                <button className="w-full border border-[#D5D9D9] bg-white hover:bg-[#F0F2F2] rounded-full py-1.5 px-4 text-sm shadow-sm font-medium">
                  Share gift receipt
                </button>
                <button className="w-full border border-[#D5D9D9] bg-white hover:bg-[#F0F2F2] rounded-full py-1.5 px-4 text-sm shadow-sm font-medium">
                  Write a product review
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1000px] mx-auto px-4 py-4">

        {/* Breadcrumb */}
        <div className="text-sm mb-3 font-medium">
          <span className="text-[#007185] hover:text-[#C7511F] cursor-pointer">Your Account</span>  
          <span className="text-[#565959] mx-1">›</span>
          <span className="text-[#C7511F]">Your Orders</span>
        </div>

        {/* Header + Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h1 className="text-[28px] font-medium text-[#0F1111]">Your Orders</h1>
          <div className="flex gap-2">
            <div className="relative">
              <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
              <input
                type="text"
                placeholder="Search all orders"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-[#888C8C] rounded shadow-[0_1px_2px_rgba(15,17,17,0.15)_inset] pl-9 pr-3 py-1.5 text-[15px] w-[300px] focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none"
              />
            </div>
            <button
              onClick={() => fetchOrders(searchQuery)}
              className="bg-[#0F1111] hover:bg-[#232F3E] text-white rounded-full px-6 py-1.5 text-[15px] font-medium shadow-sm transition-colors border border-transparent"
            >
              Search Orders
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-300 mb-4 mt-6">
          <div className="flex gap-8 text-[15px]">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-1 border-b-2 font-medium transition-colors ${
                  activeTab === tab
                  ? 'border-[#e77600] text-[#0F1111]'
                    : 'border-transparent text-[#007185] hover:text-[#C7511F] hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Time Filter */}
        <div className="flex items-center gap-2 text-sm mb-5 text-[#0F1111]">
          <span className="font-bold">{orders.length} orders</span>
          <span>placed in</span>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="border border-[#D5D9D9] bg-[#F0F2F2] hover:bg-[#E3E6E6] rounded-[8px] px-3 py-1.5 shadow-sm focus:ring-2 focus:ring-[#007185] font-medium outline-none cursor-pointer text-[#0F1111]"
          >
            {timeFilters.map(filter => (
              <option key={filter} value={filter}>{filter}</option>
            ))}
          </select>
        </div>

        {/* Orders List */}
        {loading? (
          <p className="font-bold py-10">Loading orders...</p>
        ) : orders.length === 0? (
          <p className="text-center py-10 text-[#0F1111]">No orders found for the selected timeframe or search query.</p>
        ) : (
          orders.map(order => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
