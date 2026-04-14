import { HiOutlineGlobeAlt, HiOutlineChevronUpDown } from 'react-icons/hi2';
import amazonLogo from '../assets/amazonLogo.png'

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    'Get to Know Us': [
      'About Amazon',
      'Careers',
      'Press Releases',
      'Amazon Science'
    ],
    'Connect with Us': [
      'Facebook',
      'Twitter',
      'Instagram'
    ],
    'Make Money with Us': [
      'Sell on Amazon',
      'Sell under Amazon Accelerator',
      'Protect and Build Your Brand',
      'Amazon Global Selling',
      'Supply to Amazon',
      'Become an Affiliate',
      'Fulfilment by Amazon',
      'Advertise Your Products',
      'Amazon Pay on Merchants'
    ],
    'Let Us Help You': [
      'Your Account',
      'Returns Centre',
      'Recalls and Product Safety Alerts',
      '100% Purchase Protection',
      'Amazon App Download',
      'Help'
    ]
  };

  const services = [
    { name: 'AbeBooks', desc: 'Books, art\n& collectibles' },
    { name: 'Amazon Web Services', desc: 'Scalable Cloud\nComputing Services' },
    { name: 'Audible', desc: 'Download\nAudio Books' },
    { name: 'IMDb', desc: 'Movies, TV\n& Celebrities' },
    { name: 'Shopbop', desc: 'Designer\nFashion Brands' },
    { name: 'Amazon Business', desc: 'Everything For\nYour Business' },
    { name: 'Amazon Prime Music', desc: '100 million songs, ad-free\nOver 15 million podcast\nepisodes' },
  ];

  return (
    <footer className="w-full font-sans text-white">
      {/* Back to top */}
      <button
        onClick={scrollToTop}
        className="w-full bg-[#37475A] hover:bg-[#485769] py-3 text-[13px] font-medium"
      >
        Back to top
      </button>

      {/* Main Footer Links - Section 1 */}
      <div className="bg-[#232F3E] border-b border-[#3a4553]">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="font-bold text-[15px] mb-3">{title}</h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-[13px] text-[#DDD] hover:underline"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Logo + Language/Country - Section 2 */}
      <div className="bg-[#232F3E] border-b border-[#3a4553]">
        <div className="max-w-5xl mx-auto px-4 py-7">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-20">
            <img
              src={amazonLogo}
              alt="Amazon"
              className="h-8 md:mt-2 object-contain"
            />

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 border border-[#848688] rounded px-2 py-1.5 text-[11px] text-[#CCC] hover:border-white">
                <HiOutlineGlobeAlt className="text-sm" />
                <span>English</span>
                <HiOutlineChevronUpDown className="text-gray-400" />
              </button>

              <button className="flex items-center gap-1.5 border border-[#848688] rounded px-2 py-1.5 text-[11px] text-[#CCC] hover:border-white">
                <img src="https://flagcdn.com/w20/in.png" alt="IN" className="h-3" />
                <span>India</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid - Section 3 */}
      <div className="bg-[#131A22] py-7">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-x-6 gap-y-4">
            {services.map((service) => (
              <a
                key={service.name}
                href="#"
                className="hover:underline"
              >
                <p className="text-[11px] text-[#DDD] font-bold leading-tight">
                  {service.name}
                </p>
                <p className="text-[11px] text-[#999] leading-tight whitespace-pre-line">
                  {service.desc}
                </p>
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="mt-6 text-center text-[11px] text-[#DDD] space-y-1">
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
              <a href="#" className="hover:underline">Conditions of Use & Sale</a>
              <a href="#" className="hover:underline">Privacy Notice</a>
              <a href="#" className="hover:underline">Interest-Based Ads</a>
            </div>
            <p className="text-[#999]">© 1996-2026, Amazon.com, Inc. or its affiliates</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;