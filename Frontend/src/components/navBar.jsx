import { useState, useEffect } from 'react';
import { IoLocationOutline, IoSearch, IoCartOutline, IoMenu } from 'react-icons/io5';
import { HiOutlineChevronDown } from 'react-icons/hi';
import amazonLogo from '../assets/amazonLogo.png';

const Navbar = ({ cartCount = 0, deliveryLocation = "Tirupati 517520", onSearch, onCategorySelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCategory, setSearchCategory] = useState('All');
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 30);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const categories = [
        'All', 'All Categories', 'Alexa Skills', 'Amazon Devices', 'Amazon Fashion',
        'Amazon Fresh', 'Amazon Pharmacy', 'Appliances', 'Apps & Games', 'Baby',
        'Beauty', 'Books', 'Car & Motorbike', 'Clothing & Accessories', 'Collectibles',
        'Computers & Accessories', 'Electronics', 'Furniture', 'Garden & Outdoors'
    ];

    const subNavItems = [
        'Fresh', 'MX Player', 'Sell', 'Bestsellers', 'Mobiles', "Today's Deals",
        'Customer Service', 'New Releases', 'Prime', 'Fashion', 'Electronics',
        'Amazon Pay', 'Home & Kitchen', 'Computers', 'Books', 'Toys & Games'
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch?.(searchQuery, searchCategory);
    };

    return (
        <header className="w-full font-sans sticky top-0 z-50">
            {/* Top Nav */}
            <div className="bg-[#131921] text-white">
                <div className="flex flex-wrap md:flex-nowrap items-center min-h-[60px] pl-[11px] pr-[15px] pb-1 w-full">

                    {/* nav-left */}
                    <div className="flex items-center shrink-0 min-w-[min-content] overflow-visible h-[60px]">
                        {/* Logo.in */}
                        <div className="flex items-center justify-center border border-transparent hover:border-white cursor-pointer m-[1px] pt-[1px] pr-[8px] pb-0 pl-[6px] w-[129.73px] h-[50px] box-border">
                            <img
                                src={amazonLogo}
                                alt="Amazon"
                                className="h-[30px] mt-2 object-contain"
                            />
                            <span className="text-sm mb-3">.in</span>
                        </div>

                        {/* Delivering to */}
                        <div className="hidden xl:flex flex-col justify-center border border-transparent hover:border-white px-2 py-1 cursor-pointer text-sm">
                            <p className="text-xs text-[#ccc] leading-none ml-5">Delivering to {deliveryLocation.split(' ')[0]}</p>
                            <div className="flex items-end">
                                <IoLocationOutline className="text-lg" />
                                <p className="text-sm font-bold leading-none ml-0.5">Update location</p>
                            </div>
                        </div>
                    </div>

                    {/* nav-fill */}
                    <div className="flex-1 min-w-0 order-3 md:order-none basis-full md:basis-auto mt-2 md:mt-0">
                        {/* nav-search */}
                        <div className="mx-[6px] pt-[10px] pr-[4px] pb-[10px] pl-[3px] h-[60px] box-border">
                            <form onSubmit={handleSearch} className="flex h-[40px] w-full min-w-0 rounded overflow-hidden">
                                <div className="relative">
                                    <select
                                        value={searchCategory}
                                        onChange={(e) => setSearchCategory(e.target.value)}
                                        className="bg-[#e6e6e6] text-[#0f1111] text-[14px] pl-[5px] pr-7 h-[40px] border-r border-gray-300 hover:bg-[#d4d4d4] focus:outline-none focus:ring-2 focus:ring-[#f90] appearance-none w-auto"
                                    >
                                        {categories.slice(0, 8).map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <HiOutlineChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                                </div>

                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search Amazon.in"
                                    className="flex-1 bg-white px-3 text-[#0f1111] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#f90] w-full"
                                />

                                <button
                                    type="submit"
                                    className="bg-[#febd69] hover:bg-[#f3a847] px-3 flex items-center justify-center w-[45px] focus:outline-none focus:ring-2 focus:ring-[#f90]"
                                >
                                    <IoSearch className="text-xl text-[#131921]" />
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* nav-right */}
                    <div className="flex items-center justify-end shrink-0 min-w-[min-content] h-[60px] ml-auto md:ml-0">
                        {/* Language */}
                        <div className="hidden lg:flex items-end border border-transparent hover:border-white px-2 py-1 cursor-pointer pb-1">
                            <img src="https://flagcdn.com/w20/in.png" alt="IN" className="h-3.5 mb-1" />
                            <span className="text-sm font-bold ml-1 flex items-end">EN <HiOutlineChevronDown className="text-gray-400 text-xs ml-0.5 mb-0.5" /></span>
                        </div>

                        {/* Account & Lists */}
                        <div className="hidden lg:block border border-transparent hover:border-white px-2 py-1 cursor-pointer">
                            <p className="text-xs leading-none text-white">Hello, sign in</p>
                            <p className="text-sm font-bold leading-none flex items-center">
                                Account & Lists <HiOutlineChevronDown className="text-gray-400 ml-0.5" />
                            </p>
                        </div>

                        {/* Returns & Orders */}
                        <div className="hidden xl:block border border-transparent hover:border-white px-2 py-1 cursor-pointer">
                            <p className="text-xs leading-none text-white">Returns</p>
                            <p className="text-sm font-bold leading-none">& Orders</p>
                        </div>

                        {/* Cart */}
                        <div className="flex items-end border border-transparent hover:border-white px-2 py-1 cursor-pointer relative pb-0">
                            <div className="relative">
                                <span className="absolute left-[16px] -top-1 text-[#f08804] font-bold text-base leading-none">
                                    {cartCount}
                                </span>
                                <IoCartOutline className="text-[38px] h-[38px] w-[38px]" />
                            </div>
                            <span className="text-sm font-bold mb-1 ml-0.5 hidden md:block">Cart</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Sub Nav */}
            <div className={`bg-[#232f3e] text-white transition-all duration-300 origin-top overflow-hidden ${isScrolled ? 'h-0' : 'h-[39px]'}`}>
                <div className="flex items-center h-[39px] pl-[11px] w-full text-[14px] leading-[28px] overflow-x-auto scrollbar-hide">

                    <button
                        className="flex items-center border border-transparent hover:border-white px-2 mb-1 mr-1 font-bold flex-shrink-0"
                        onClick={() => onCategorySelect?.('all')}
                    >
                        <IoMenu className="text-xl mr-1" />
                        All
                    </button>

                    {subNavItems.map((item, idx) => (
                        <button
                            key={item}
                            className="border border-transparent hover:border-white px-2 mb-1 whitespace-nowrap flex-shrink-0"
                            onClick={() => onCategorySelect?.(item)}
                        >
                            {item}
                            {item === 'Prime' && <HiOutlineChevronDown className="inline text-gray-400 ml-0.5" />}
                        </button>
                    ))}
                </div>
            </div>
        </header>
    );
};

export default Navbar;