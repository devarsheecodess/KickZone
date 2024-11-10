import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay"; // Ensure styles load

import { Navigation, Pagination, Autoplay } from "swiper/modules"; // Import directly from modules

// Data for upcoming matches
const upcomingMatches = [
  { id: 1, teams: "Nottingham Forest vs Newcastle", date: "Nov 11, 2024", time: "6:00 PM" },
  { id: 2, teams: "Chelsea vs FC Noah", date: "Nov 11, 2024", time: "1:30 AM" },
  { id: 3, teams: "Bodo/Glimt vs FK Qarabag", date: "Nov 10, 2024", time: "11:15 PM" },
  { id: 4, teams: "Eintracht Frankfurt vs Slavia Prague", date: "Nov 10, 2024", time: "11:15 PM" },
  { id: 5, teams: "FCSB vs FC Midtjylland", date: "Nov 10, 2024", time: "11:15 PM" },
  { id: 6, teams: "Galatasaray vs Tottenham Hotspur", date: "Nov 10, 2024", time: "11:15 PM" },
  { id: 7, teams: "Betis vs Celta Vigo", date: "Nov 16, 2024", time: "8:00 PM" },
  { id: 8, teams: "M.City vs Man Utd", date: "Nov 18, 2024", time: "5:00 PM" },
  { id: 9, teams: "Roma vs Inter Milan", date: "Nov 20, 2024", time: "7:00 PM" }
];

// Data for predictions with win probabilities
const predictions = [
  { id: 1, prediction: "Nottingham Forest will win by 1 goal", accuracy: "70%", winProbability: 70 },
  { id: 2, prediction: "Chelsea has a strong chance to win against FC Noah", accuracy: "75%", winProbability: 75 },
  { id: 3, prediction: "Bodo/Glimt likely to win against FK Qarabag", accuracy: "65%", winProbability: 65 },
  { id: 4, prediction: "Eintracht Frankfurt expected to win against Slavia Prague", accuracy: "68%", winProbability: 68 },
  { id: 5, prediction: "FCSB vs FC Midtjylland is likely to end in a draw", accuracy: "60%", winProbability: 60 },
  { id: 6, prediction: "Galatasaray will likely defeat Tottenham Hotspur", accuracy: "72%", winProbability: 72 },
  { id: 7, prediction: "Betis will win against Celta Vigo", accuracy: "78%", winProbability: 78 },
  { id: 8, prediction: "M.City favored to lead against Man Utd", accuracy: "80%", winProbability: 80 },
  { id: 9, prediction: "Roma vs Inter is likely to end in a draw", accuracy: "65%", winProbability: 65 }
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
    <div className="absolute top-0 left-0 -z-20 w-full min-h-screen bg-[radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] flex flex-col items-center p-4">

    {/* Red background container */}
      <div className="w-full max-w-5xl mt-20 space-y-10 flex-1">

        {/* Upcoming Matches Slider */}
        <section className="w-full bg-blue-800 border-4 border-yellow-600 text-center text-white py-20 text-3xl font-bold rounded-lg shadow-lg">
          <h2 className="mb-5">Upcoming Matches</h2>
          <Swiper {...swiperSettings}>
            {upcomingMatches.map((match) => (
              <SwiperSlide key={match.id}>
               <div className="bg-white border-4 border-yellow-600 text-black p-6 rounded-lg shadow-lg transition-transform transform hover:-translate-y-2 bg-transparent">
                  <h3 className="text-xl font-semibold">{match.teams}</h3>
                  <p className="mt-2">{match.date}</p>
                  <p>{match.time}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* Predictions Slider */}
        <section className="w-full bg-red-800 border-4 border-yellow-600 text-center text-black py-20 text-3xl font-bold rounded-lg shadow-lg justify-between h-auto">
          <h2 className="mb-5 text-white">Predictions</h2>
          <Swiper {...swiperSettings}>
            {predictions.map((prediction) => (
              <SwiperSlide key={prediction.id}>
                <div className="bg-white border-4 border-yellow-600 text-black p-6 rounded-lg shadow-lg transition-transform transform  Stranslate-y-2 ">
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
        className="fixed bottom-10 right-10 w-16 h-16 bg-black text-red-600  border-4 border-yellow-600 flex items-center justify-center rounded-full cursor-pointer text-sm hover: font-bold">
        LC
      </div>
    </div>
  );
};

export default Home;