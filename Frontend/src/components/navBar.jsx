import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { IoLocationOutline, IoSearch, IoCartOutline, IoMenu, IoCloseOutline } from 'react-icons/io5';
import { HiOutlineChevronDown } from 'react-icons/hi';
import amazonLogo from '../assets/amazonLogo.png';
import axios from '../api/axios';
import { useDebounce } from '../hooks/useDebounce';
import OptimizedImage from './OptimizedImage';
import SideDrawer from './SideDrawer';

const Navbar = ({ cartCount = 0, deliveryLocation = "Gummidipundi 601201" }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 400); 
    const [searchCategory, setSearchCategory] = useState('All');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [localCartCount, setLocalCartCount] = useState(cartCount);
    
    // Side Drawer State
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    
    // Dynamic Categories
    const [dbCategories, setDbCategories] = useState([]);
    const [userName, setUserName] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const suggestionsRef = useRef(null);
    const searchInputRef = useRef(null);

    // Fetch categories, cart count, and user profile on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, cartRes, userRes] = await Promise.all([
                    axios.get('/api/categories'),
                    axios.get('/api/cart'),
                    axios.get('/api/user/profile')
                ]);
                setDbCategories(catRes.data);
                const total = cartRes.data.reduce((sum, item) => sum + item.quantity, 0);
                setLocalCartCount(total);
                if (userRes.data) {
                    setUserName(userRes.data.name.split(' ')[0]);
                }
            } catch (err) {
                console.error("Failed to fetch initial navbar data", err);
            }
        };
        fetchData();
    }, []);

    // Fetch suggestions when user types
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (debouncedSearchQuery.trim().length < 2) {
                setSuggestions([]);
                return;
            }
            try {
                const res = await axios.get('/api/products/suggestions', {
                    params: { q: debouncedSearchQuery, category: searchCategory }
                });
                setSuggestions(res.data);
                setShowSuggestions(true);
            } catch (err) {
                console.error("Failed to fetch search suggestions", err);
            }
        };
        fetchSuggestions();
    }, [debouncedSearchQuery, searchCategory]);

    // Handle click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
                searchInputRef.current && !searchInputRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 30);
        window.addEventListener('scroll', handleScroll);
        
        const fetchCart = async () => {
            try {
                const res = await axios.get('/api/cart');
                const total = res.data.reduce((sum, item) => sum + item.quantity, 0);
                setLocalCartCount(total);
            } catch(e) {}
        };
        window.addEventListener('cartUpdated', fetchCart);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('cartUpdated', fetchCart);
        };
    }, []);

    const subNavItems = dbCategories.length > 0 
        ? dbCategories.slice(0, 10).map(c => c.label) 
        : ['Mobiles', "Today's Deals", 'Fashion', 'Electronics', 'Prime', 'Home & Kitchen', 'Computers', 'Books'];

    const handleSearch = (e) => {
        e?.preventDefault();
        setShowSuggestions(false);
        if (searchQuery.trim()) {
            navigate(`/products?category=${encodeURIComponent(searchCategory)}&q=${encodeURIComponent(searchQuery)}`);
        } else {
            navigate(`/products`);
        }
    };

    const handleSelectSuggestion = (productId) => {
        setShowSuggestions(false);
        setSearchQuery('');
        navigate(`/product/${productId}`);
    };

    const handleCategoryClick = (category) => {
        navigate(`/products?category=${encodeURIComponent(category)}`);
    };

    return (
        <header className="w-full font-sans sticky top-0 z-50">
            {/* --- Side Drawer --- */}
            <SideDrawer 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)} 
                categories={dbCategories}
            />

            <div className="bg-[#131921] text-white">
                <div className="flex flex-wrap md:flex-nowrap items-center min-h-[60px] pl-[11px] pr-[15px] pb-1 w-full">

                    {/* nav-left */}
                    <div className="flex items-center shrink-0 min-w-[min-content] overflow-visible h-[60px]">
                        <Link to="/" className="flex items-center justify-center border border-transparent hover:border-white cursor-pointer m-[1px] pt-[1px] pr-[8px] pb-0 pl-[6px] w-[129.73px] h-[50px] box-border">
                            <img src={amazonLogo} alt="Amazon" className="h-[30px] mt-2 object-contain" />
                            <span className="text-sm mb-3">.in</span>
                        </Link>

                        <div className="hidden xl:flex flex-col justify-center border border-transparent hover:border-white px-2 py-1 cursor-pointer text-sm">
                            <p className="text-xs text-[#ccc] leading-none ml-5">Delivering to {deliveryLocation.split(' ')[0]}</p>
                            <div className="flex items-end">
                                <IoLocationOutline className="text-lg" />
                                <p className="text-sm font-bold leading-none ml-0.5">Update location</p>
                            </div>
                        </div>
                    </div>

                    {/* nav-fill (Search Bar) */}
                    <div className="flex-1 min-w-0 order-3 md:order-none basis-full md:basis-auto mt-2 md:mt-0 relative">
                        <div className="mx-[6px] pt-[10px] pr-[4px] pb-[10px] pl-[3px] h-[60px] box-border">
                            <form 
                                onSubmit={handleSearch} 
                                className={`flex h-[40px] w-full min-w-0 rounded overflow-hidden transition-shadow ${showSuggestions && suggestions.length > 0 ? 'ring-2 ring-[#f90] shadow-[0_0_8px_rgba(255,153,0,0.5)]' : ''}`}
                            >
                                <div className="relative">
                                    <select
                                        value={searchCategory}
                                        onChange={(e) => setSearchCategory(e.target.value)}
                                        className="bg-[#e6e6e6] text-[#0f1111] text-[14px] pl-[10px] pr-7 h-[40px] border-r border-gray-300 hover:bg-[#d4d4d4] focus:outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="All">All Categories</option>
                                        {dbCategories.map(cat => (
                                            <option key={cat.id} value={cat.label}>{cat.label}</option>
                                        ))}
                                    </select>
                                    <HiOutlineChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                                </div>

                                <div className="flex-1 relative bg-white">
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => {if (suggestions.length > 0) setShowSuggestions(true)}}
                                        placeholder="Search Amazon.in"
                                        className="w-full h-full px-3 text-[#0f1111] text-[15px] focus:outline-none"
                                    />
                                    {searchQuery && (
                                        <button 
                                            type="button"
                                            onClick={() => {setSearchQuery(''); setSuggestions([]);}}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-xl text-gray-400 hover:text-gray-600"
                                        >
                                            <IoCloseOutline />
                                        </button>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="bg-[#febd69] hover:bg-[#f3a847] px-3 flex items-center justify-center w-[45px] focus:outline-none"
                                >
                                    <IoSearch className="text-xl text-[#131921]" />
                                </button>
                            </form>
                        </div>

                        {/* Search Suggestions Dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div 
                                ref={suggestionsRef}
                                className="absolute left-[6px] right-[4px] top-[50px] bg-white border border-gray-300 shadow-xl z-[100] rounded-b-sm overflow-hidden"
                            >
                                {suggestions.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => handleSelectSuggestion(item.id)}
                                        className="flex items-center gap-3 px-4 py-2 hover:bg-[#f3f3f3] cursor-pointer border-b last:border-none border-gray-100 group"
                                    >
                                        <div className="w-10 h-10 shrink-0 bg-[#f7f7f7] rounded p-1 flex items-center justify-center">
                                            <OptimizedImage 
                                                src={item.image_url} 
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[14px] text-[#0f1111] line-clamp-1 group-hover:text-[#c7511f]">
                                                {item.name}
                                            </p>
                                            <p className="text-[11px] text-[#565959]">in {item.category}</p>
                                        </div>
                                        <IoSearch className="text-gray-300 text-lg group-hover:text-gray-500" />
                                    </div>
                                ))}
                                <div 
                                    onClick={handleSearch}
                                    className="bg-[#f3f3f3] px-4 py-2 text-[13px] text-[#007185] hover:underline cursor-pointer font-medium italic"
                                >
                                    See all results for "{searchQuery}"
                                </div>
                            </div>
                        )}
                        {showSuggestions && (
                            <div className="fixed inset-0 bg-black/50 z-[-1] pointer-events-none mt-[60px]" />
                        )}
                    </div>

                    {/* nav-right */}
                    <div className="flex items-center justify-end shrink-0 min-w-[min-content] h-[60px] ml-auto md:ml-0">
                        <div className="hidden lg:flex items-end border border-transparent hover:border-white px-2 py-1 cursor-pointer pb-1">
                            <img src="https://flagcdn.com/w20/in.png" alt="IN" className="h-3.5 mb-1" />
                            <span className="text-sm font-bold ml-1 flex items-end">EN <HiOutlineChevronDown className="text-gray-400 text-xs ml-0.5 mb-0.5" /></span>
                        </div>

                        <div className="hidden lg:block border border-transparent hover:border-white px-2 py-1 cursor-pointer">
                            <p className="text-xs leading-none text-white">Hello, {userName || 'sign in'}</p>
                            <p className="text-sm font-bold leading-none flex items-center">
                                Account & Lists <HiOutlineChevronDown className="text-gray-400 ml-0.5" />
                            </p>
                        </div>

                        <Link to="/orders" className="hidden xl:block border border-transparent hover:border-white px-2 py-1 cursor-pointer">
                            <p className="text-xs leading-none text-white">Returns</p>
                            <p className="text-sm font-bold leading-none">& Orders</p>
                        </Link>

                        <Link to="/cart" className="flex items-end border border-transparent hover:border-white px-2 py-1 cursor-pointer relative pb-0">
                            <div className="relative">
                                <span className="absolute left-[16px] -top-1 text-[#f08804] font-bold text-base leading-none">
                                    {localCartCount}
                                </span>
                                <IoCartOutline className="text-[38px] h-[38px] w-[38px]" />
                            </div>
                            <span className="text-sm font-bold mb-1 ml-0.5 hidden md:block">Cart</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Sub Nav Belt */}
            <div className={`bg-[#232f3e] text-white transition-all duration-300 origin-top overflow-hidden ${isScrolled ? 'h-0' : 'h-[39px]'}`}>
                <div className="flex items-center h-[39px] pl-[11px] w-full text-[14px] leading-[28px] overflow-x-auto scrollbar-hide">
                    {/* Burger Menu Button */}
                    <button
                        className="flex items-center border border-transparent hover:border-white px-2 mb-1 mr-1 font-bold flex-shrink-0 h-[30px]"
                        onClick={() => setIsDrawerOpen(true)}
                    >
                        <IoMenu className="text-2xl mr-1" /> All
                    </button>

                    {/* Dynamic Category Links */}
                    {subNavItems.map((item) => (
                        <button
                            key={item}
                            onClick={() => handleCategoryClick(item)}
                            className="border border-transparent hover:border-white px-2 mb-1 whitespace-nowrap flex-shrink-0 h-[30px] flex items-center"
                        >
                            {item}
                            {item === 'Prime' && <HiOutlineChevronDown className="inline text-gray-400 ml-0.5" />}
                        </button>
                    ))}
                    <button onClick={() => navigate('/products')} className="border border-transparent hover:border-white px-2 mb-1 whitespace-nowrap flex-shrink-0 h-[30px] flex items-center">Amazon Pay</button>
                    <button onClick={() => navigate('/products')} className="border border-transparent hover:border-white px-2 mb-1 whitespace-nowrap flex-shrink-0 h-[30px] flex items-center">Gift Cards</button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;