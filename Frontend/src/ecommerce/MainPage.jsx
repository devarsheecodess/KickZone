import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const TicketSkeleton = () => (
  <div className="w-80 mx-auto">
    <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl">
      <div className="relative overflow-hidden rounded-xl mb-6">
        <div className="w-full h-52 bg-white/5 animate-pulse rounded-xl" />
        <div className="absolute top-3 right-3 w-24 h-7 bg-white/5 animate-pulse rounded-full" />
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="w-20 h-4 bg-white/5 animate-pulse rounded" />
            <div className="w-24 h-6 bg-white/5 animate-pulse rounded" />
          </div>
          <div className="w-24 h-8 bg-white/5 animate-pulse rounded-lg" />
        </div>
        <div className="w-full h-12 bg-white/5 animate-pulse rounded-xl" />
      </div>
    </div>
  </div>
);

const MerchSkeleton = () => (
  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-xl">
    <div className="relative">
      <div className="w-full h-48 bg-white/5 animate-pulse rounded-lg mb-4" />
      <div className="absolute top-2 right-2 w-16 h-6 bg-white/5 animate-pulse rounded-full" />
    </div>
    <div className="w-2/3 h-6 bg-white/5 animate-pulse rounded mb-2" />
    <div className="w-1/3 h-5 bg-white/5 animate-pulse rounded mb-4" />
    <div className="w-full h-10 bg-white/5 animate-pulse rounded-lg" />
  </div>
);

const MainPage = () => {
  const [tickets, setTickets] = useState([]);
  const [merch, setMerch] = useState([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);
  const [isLoadingMerch, setIsLoadingMerch] = useState(true);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchTickets = async () => {
    setIsLoadingTickets(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/products`, { params: { type: 'ticket' } });
      setTickets(response.data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setIsLoadingTickets(false);
    }
  }

  const fetchMerch = async () => {
    setIsLoadingMerch(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/products`, { params: { type: 'merch' } });
      setMerch(response.data);
    } catch (err) {
      console.error('Error fetching merch:', err);
    } finally {
      setIsLoadingMerch(false);
    }
  }

  const addToCart = async (productId) => {
    try {
      const productDetailsResponse = await axios.get(`${BACKEND_URL}/products-id`, { params: { id: productId } });
      const productDetails = productDetailsResponse.data;

      if (!productDetails) {
        throw new Error("Product not found.");
      }

      const newCartItem = {
        id: uuidv4(),
        productId,
        userId: localStorage.getItem('id'),
        quantity: 1,
        name: productDetails.name,
        price: productDetails.price,
        image: productDetails.image,
      };

      const response = await axios.post(`${BACKEND_URL}/cart`, newCartItem);

      if (response.status === 201 || response.status === 200) {
        alert("Product added to the cart!");
      }
    } catch (err) {
      console.error("Error:", err.response ? err.response.data : err.message);
      alert("Failed to add product to cart. Please try again.");
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchMerch();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center">
      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-full z-[-2] bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      {/* Main Content */}
      <main className="w-full max-w-7xl mt-20 px-4 py-6 flex flex-col items-center">
        {/* Hero Section */}
        <section className="relative w-full text-center py-24 px-4 mb-12 overflow-hidden rounded-2xl">
          {/* SVG Background Pattern */}
          <div className="absolute inset-0 z-0">
            <svg className="w-full h-full" viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Stadium Background */}
              <rect width="1920" height="1080" fill="#1a1a1a" />

              {/* Stadium Field */}
              <rect x="160" y="200" width="1600" height="800" fill="#2d572c" />

              {/* Field Lines */}
              <path d="M960 200 L960 1000" stroke="white" strokeWidth="4" strokeDasharray="10,10" />
              <circle cx="960" cy="600" r="150" stroke="white" strokeWidth="4" fill="none" />
              <rect x="260" y="400" width="200" height="400" stroke="white" strokeWidth="4" fill="none" />
              <rect x="1460" y="400" width="200" height="400" stroke="white" strokeWidth="4" fill="none" />

              {/* Stadium Seats - Multiple Layers */}
              <path d="M0 0 L160 200 L1760 200 L1920 0 Z" fill="#3d3d3d" />
              <path d="M0 1080 L160 1000 L1760 1000 L1920 1080 Z" fill="#3d3d3d" />

              {/* Stadium Lights */}
              <circle cx="200" cy="150" r="30" fill="#ffd700" opacity="0.8">
                <animate attributeName="opacity" values="0.8;0.4;0.8" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx="1720" cy="150" r="30" fill="#ffd700" opacity="0.8">
                <animate attributeName="opacity" values="0.8;0.4;0.8" dur="4s" repeatCount="indefinite" />
              </circle>

              {/* Crowd Pattern */}
              <pattern id="crowdPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="2" fill="#4a4a4a" />
              </pattern>
              <rect x="160" y="50" width="1600" height="150" fill="url(#crowdPattern)" />

              {/* Animated Spotlight Effects */}
              <circle cx="200" cy="150" r="100" fill="url(#spotlight1)" opacity="0.3">
                <animate attributeName="opacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="1720" cy="150" r="100" fill="url(#spotlight2)" opacity="0.3">
                <animate attributeName="opacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite" />
              </circle>

              {/* Gradient Definitions */}
              <defs>
                <radialGradient id="spotlight1">
                  <stop offset="0%" stopColor="white" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                <radialGradient id="spotlight2">
                  <stop offset="0%" stopColor="white" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
            </svg>
          </div>

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-purple-900/80 to-black/90" />
          <div className="absolute inset-0 backdrop-blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70" />

          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto">
            {/* Decorative elements */}
            <div className="absolute -left-4 -top-4 w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-20" />
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20" />

            {/* Main heading */}
            <h1 className="relative">
              <span className="block text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x">
                Welcome to KickStore
              </span>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-3xl text-gray-200 mt-8 mb-6 font-light tracking-wide">
              Your premier destination for
              <span className="relative mx-2 inline-block">
                <span className="relative z-10 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  football tickets
                </span>
                <span className="absolute inset-0 bg-blue-400/20 blur-lg" />
              </span>
              and
              <span className="relative mx-2 inline-block">
                <span className="relative z-10 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  merchandise
                </span>
                <span className="absolute inset-0 bg-purple-400/20 blur-lg" />
              </span>
            </p>
          </div>

          {/* Bottom decorative elements */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-1/2 h-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-3xl opacity-10" />
        </section>

        {/* Tickets Carousel Section */}
        <section className="w-full py-12 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-center mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              Featured Tickets
            </h2>
          </div>

          <Swiper
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={window.innerWidth < 768 ? 1 : 3}
            spaceBetween={30}
            coverflowEffect={{
              rotate: 35,
              stretch: 0,
              depth: 100,
              modifier: 1.5,
              slideShadows: true,
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            modules={[Autoplay, Navigation, Pagination, EffectCoverflow]}
            className="w-full py-12 px-4 relative group"
          >
            {isLoadingTickets ? (
              Array(3).fill(null).map((_, index) => (
                <SwiperSlide key={`skeleton-${index}`}>
                  <TicketSkeleton />
                </SwiperSlide>
              ))
            ) : (
              tickets.map((ticket) => (
                <SwiperSlide key={ticket.id} className="w-80 mx-auto">
                  <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/20">
                    <div className="relative overflow-hidden rounded-xl mb-6">
                      <img
                        src={ticket.image}
                        alt={ticket.name}
                        className="w-full h-52 object-cover transform transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                        Match Day
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <h3 className="text-xl font-bold text-white mb-1">{ticket.name}</h3>
                        <div className="flex items-center gap-2 text-gray-200">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                          </svg>
                          <span className="text-sm">Coming Soon</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="text-gray-300">
                          <span className="text-sm">Starting from</span>
                          <div className="text-2xl font-bold text-white">₹{ticket.price.toFixed(2)}</div>
                        </div>
                        <div className="bg-white/10 px-3 py-1 rounded-lg">
                          <span className="text-sm text-gray-300">Limited Seats</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span>Stadium Location</span>
                      </div>

                      <button
                        onClick={() => addToCart(ticket.id)}
                        className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-500 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transform transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Add to Cart
                        </span>
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))
            )}

            {/* Custom Navigation Buttons */}
            <div className="hidden md:block">
              <button className="swiper-button-prev absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white z-10 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-white/20">
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="swiper-button-next absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white z-10 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-white/20">
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </Swiper>
        </section>

        {/* Merchandise Grid Section */}
        <section className="w-full py-8">
          <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Official Merchandise
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoadingMerch ? (
              // Show 6 skeleton loaders while loading
              Array(6).fill(null).map((_, index) => (
                <MerchSkeleton key={`merch-skeleton-${index}`} />
              ))
            ) : (
              merch.map((product) => (
                <div
                  key={product.id}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-xl transform transition-all duration-300 hover:scale-105"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg mb-4 shadow-lg"
                    />
                    <div className="absolute top-2 right-2 bg-purple-500 text-white px-3 py-1 rounded-full text-sm">
                      Official
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-gray-300 mb-4">Price: ₹{product.price.toFixed(2)}</p>
                  <button
                    onClick={() => addToCart(product.id)}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Add to Cart
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MainPage;