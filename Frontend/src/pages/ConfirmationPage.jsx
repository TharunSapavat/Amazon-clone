import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { BsCheckCircleFill } from 'react-icons/bs';

const ConfirmationPage = () => {
    const [searchParams] = useSearchParams();
    const internalId = searchParams.get('internal_id');

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-[800px] mx-auto pt-10 px-4 pb-20">
                <div className="flex items-start gap-4 p-6 border-[3px] border-[#067D62] rounded bg-[#F2FBFA] mb-6 shadow-sm">
                    <BsCheckCircleFill className="text-[#067D62] text-3xl shrink-0 mt-0.5" />
                    <div>
                        <h1 className="text-[22px] font-bold text-[#067D62] mb-1">Order placed, thank you!</h1>
                        <p className="text-[15px] mb-2 text-[#0F1111]">Confirmation will be sent to your email.</p>
                        <p className="text-[15px] text-[#0F1111]">
                            <span className="font-bold">Shipping to:</span> John Doe, 123 Amazon Street, Metropolis, NY 10001
                        </p>
                    </div>
                </div>

                <div className="px-2">
                    <div className="flex flex-col sm:flex-row gap-6 sm:gap-16 border-b border-gray-300 pb-5 mb-4">
                        <div>
                            <p className="font-bold text-[#0F1111]">Order identifier</p>
                            <p className="text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer mt-0.5">{internalId || 'ORDER-PENDING'}</p>
                        </div>
                        <div>
                            <p className="font-bold text-[#0F1111]">Delivery estimate</p>
                            <p className="text-[#007600] font-bold text-[17px] mt-0.5">Tuesday, 21 April</p>
                        </div>
                    </div>
                    
                    <p className="text-[15px] text-[#0F1111] mb-6">
                        Thank you for shopping with us. You can review your order details in <Link to="/orders" className="text-[#007185] hover:text-[#C7511F] hover:underline font-medium">Your Orders</Link>.
                    </p>

                    <Link to="/" className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-lg px-6 py-2 text-sm shadow-sm font-medium inline-block text-[#0F1111]">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPage;
