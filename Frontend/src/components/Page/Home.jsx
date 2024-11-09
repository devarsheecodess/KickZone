import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay"; // Ensure styles load

import { Navigation, Pagination, Autoplay } from "swiper/modules"; // Import directly from modules

// Data for upcoming matches
const upcomingMatches = [
  { id: 1, teams: "Team A vs Team B", date: "Nov 15, 2024", time: "6:00 PM" },
  { id: 2, teams: "Team C vs Team D", date: "Nov 16, 2024", time: "8:00 PM" },
  { id: 3, teams: "Team E vs Team F", date: "Nov 18, 2024", time: "5:00 PM" },
  { id: 4, teams: "Team G vs Team H", date: "Nov 20, 2024", time: "7:00 PM" },
];

// Data for predictions with win probabilities
const predictions = [
  { id: 1, prediction: "Team A will win by 2 goals", accuracy: "75%", winProbability: 75 },
  { id: 2, prediction: "Team D has a strong chance to win", accuracy: "82%", winProbability: 82 },
  { id: 3, prediction: "Team E likely to lead in first half", accuracy: "60%", winProbability: 60 },
  { id: 4, prediction: "High probability of a draw between Team G and H", accuracy: "68%", winProbability: 68 },
];

const Home = () => {
  // Swiper settings for both sliders
  const swiperSettings = {
    modules: [Autoplay, Navigation, Pagination],
    spaceBetween: 20,
    slidesPerView: 1,
    loop: true,
    autoplay: { delay: 3000, disableOnInteraction: false },
    pagination: { clickable: true },
    navigation: true,
    breakpoints: {
      // Responsive settings for different screen sizes
      640: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  };

  const handleChatClick = () => {
    window.location.href = '/livechat'; // Replace with your live chat URL
  };

  return (
    <div className="absolute inset-0 -z-20 w-full min-h-screen bg-transparent bg-[radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] flex flex-col items-center p-4">
      <div className="w-full max-w-5xl mt-20 space-y-10 flex-1">

        {/* Upcoming Matches Slider */}
        <section className="w-full bg-blue-600 text-center text-white py-20 text-3xl font-bold rounded-lg shadow-lg">
          <h2 className="mb-5">Upcoming Matches</h2>
          <Swiper {...swiperSettings}>
            {upcomingMatches.map((match) => (
              <SwiperSlide key={match.id}>
                <div className="bg-white text-black p-6 rounded-lg shadow-lg transition-transform transform hover:-translate-y-2">
                  <h3 className="text-xl font-semibold">{match.teams}</h3>
                  <p className="mt-2">{match.date}</p>
                  <p>{match.time}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* Predictions Slider */}
        <section className="w-full bg-red-600 text-center text-black py-20 text-3xl font-bold rounded-lg shadow-lg justify-between h-auto">
          <h2 className="mb-5">Predictions</h2>
          <Swiper {...swiperSettings}>
            {predictions.map((prediction) => (
              <SwiperSlide key={prediction.id}>
                <div className="bg-white text-black p-6 rounded-lg shadow-lg transition-transform transform  Stranslate-y-2">
                  <h3 className="text-xl font-semibold">Prediction</h3>
                  <p className="mt-2">{prediction.prediction}</p>
                  <p className="text-sm text-gray-600">Accuracy: {prediction.accuracy}</p>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-green-500 h-4 rounded-full"
                        style={{ width: `₹{prediction.winProbability}%` }}
                      ></div>
                    </div>
                    <p className="mt-2 text-gray-700">Win Probability: {prediction.winProbability}%</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </div>

      {/* Live Chat Circle Button */}
      <div
        onClick={handleChatClick}
        className="fixed bottom-10 right-10 w-16 h-16 bg-black text-red-600 flex items-center justify-center rounded-full cursor-pointer text-sm hover: font-bold">
        Live Chat
      </div>
    </div>
  );
};

export default Home;