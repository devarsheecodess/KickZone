import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay"; // Ensure styles load
import { useNavigate } from "react-router-dom";
import { getUpcomingFixtures, getLiveMatches, getPredictions } from "../../services/footballApiService";

import { Navigation, Pagination, Autoplay } from "swiper/modules"; // Import directly from modules

const Home = () => {
  // State for upcoming matches and predictions
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLeague, setActiveLeague] = useState('39'); // Default to Premier League

  // Loading state for UI feedback
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

  //handle parameteres from Google login
  const navigate = useNavigate();
  useEffect(() => {
    // Extract query parameters from URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const username = params.get("username");

    if (id && username) {
      // Save user details in localStorage
      localStorage.setItem("id", id);
      localStorage.setItem("user", username);

      alert(`Welcome, ${username}!`);
    }
  }, [navigate]);

  const handleChatClick = () => {
    window.location.href = '/livechat'; // Replace with your live chat URL
  };

  // Fetch data from Football API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch upcoming fixtures from Football API
        const upcomingResponse = await getUpcomingFixtures(activeLeague);
        const liveResponse = await getLiveMatches();
        
        if (upcomingResponse.response && liveResponse.response) {
          // Format upcoming matches data
          const formattedUpcoming = upcomingResponse.response.map(fixture => {
            const match = fixture.fixture;
            const teams = fixture.teams;
            const date = new Date(match.date);
            
            return {
              id: match.id,
              teams: `${teams.home.name} vs ${teams.away.name}`,
              date: date.toLocaleDateString(),
              time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              venue: match.venue?.name || 'TBD',
              league: fixture.league.name,
              round: fixture.league.round
            };
          });
          
          // Format live matches data
          const formattedLive = liveResponse.response.map(fixture => {
            const match = fixture.fixture;
            const teams = fixture.teams;
            const goals = fixture.goals;
            
            return {
              id: match.id,
              teams: `${teams.home.name} vs ${teams.away.name}`,
              score: `${goals.home} - ${goals.away}`,
              status: match.status.short,
              elapsed: match.status.elapsed,
              league: fixture.league.name
            };
          });
          
          // Generate predictions based on upcoming fixtures
          const predictionPromises = upcomingResponse.response
            .slice(0, 5) // Limit to first 5 fixtures to avoid API rate limits
            .map(fixture => getPredictions(fixture.fixture.id));
          
          const predictionResponses = await Promise.allSettled(predictionPromises);
          const formattedPredictions = predictionResponses
            .filter(result => result.status === 'fulfilled' && result.value.response.length > 0)
            .map((result, index) => {
              const prediction = result.value.response[0];
              const fixture = upcomingResponse.response[index];
              const homeTeam = fixture.teams.home.name;
              const awayTeam = fixture.teams.away.name;
              
              // Calculate win probability based on API prediction
              const homeChance = parseInt(prediction.predictions.percent.home) || 33;
              const drawChance = parseInt(prediction.predictions.percent.draw) || 33;
              const awayChance = parseInt(prediction.predictions.percent.away) || 34;
              
              let predictionText = '';
              let winProbability = 0;
              
              if (homeChance > drawChance && homeChance > awayChance) {
                predictionText = `${homeTeam} likely to win against ${awayTeam}`;
                winProbability = homeChance;
              } else if (awayChance > drawChance && awayChance > homeChance) {
                predictionText = `${awayTeam} likely to win against ${homeTeam}`;
                winProbability = awayChance;
              } else {
                predictionText = `${homeTeam} vs ${awayTeam} likely to end in a draw`;
                winProbability = drawChance;
              }
              
              return {
                id: fixture.fixture.id,
                prediction: predictionText,
                accuracy: `${winProbability}%`,
                winProbability: winProbability,
                advice: prediction.predictions.advice || 'No advice available'
              };
            });
          
          setUpcomingMatches(formattedUpcoming);
          setLiveMatches(formattedLive);
          setPredictions(formattedPredictions.length > 0 ? formattedPredictions : [
            // Fallback predictions if API fails
            { id: 1, prediction: "API limit reached. Try again later.", accuracy: "N/A", winProbability: 50 }
          ]);
          setLoading(false);
        } else {
          throw new Error('Failed to load match data from API');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load match data. Please try again later.');
        setLoading(false);
        
        // Fallback to local data if API fails
        try {
          const matchesResponse = await fetch("/upcomingMatches.json");
          const predictionsResponse = await fetch("/predictions.json");
          
          if (matchesResponse.ok && predictionsResponse.ok) {
            const matchesData = await matchesResponse.json();
            const predictionsData = await predictionsResponse.json();
            
            setUpcomingMatches(matchesData);
            setPredictions(predictionsData);
            setError('Using offline data. Live updates unavailable.');
          }
        } catch (fallbackErr) {
          console.error('Fallback data loading failed:', fallbackErr);
        }
      }
    };
    
    fetchData();
    
    // Set up interval to refresh data every 5 minutes
    const refreshInterval = setInterval(fetchData, 5 * 60 * 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval);
  }, [activeLeague]);

  return (
    <div className="absolute top-0 left-0 -z-20 w-full min-h-screen bg-[radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] flex flex-col items-center p-4">

    {/* Red background container */}
      <div className="w-full max-w-5xl mt-20 space-y-10 flex-1">
        {/* League Selector */}
        <div className="flex justify-center mb-4">
          <select 
            className="bg-blue-800 text-white border-2 border-yellow-600 rounded-lg px-4 py-2"
            value={activeLeague}
            onChange={(e) => setActiveLeague(e.target.value)}
          >
            <option value="39">Premier League</option>
            <option value="140">La Liga</option>
            <option value="135">Serie A</option>
            <option value="78">Bundesliga</option>
            <option value="61">Ligue 1</option>
          </select>
        </div>
        
        {/* Live Matches Section */}
        <section className="w-full bg-green-800 border-4 border-yellow-600 text-center text-white py-20 text-3xl font-bold rounded-lg shadow-lg">
          <h2 className="mb-5">Live Matches</h2>
          {loading ? (
            <div className="text-white text-xl">Loading live matches...</div>
          ) : error ? (
            <div className="text-red-300 text-xl">{error}</div>
          ) : (
            <Swiper {...swiperSettings}>
              {liveMatches.length > 0 ? (
                liveMatches.map((match) => (
                  <SwiperSlide key={match.id}>
                    <div className="bg-white border-4 border-yellow-600 text-black p-6 rounded-lg shadow-lg transition-transform transform hover:-translate-y-2 bg-transparent">
                      <div className="bg-red-600 text-white px-2 py-1 rounded-full text-sm inline-block mb-2">
                        LIVE {match.elapsed}'
                      </div>
                      <h3 className="text-xl font-semibold">{match.teams}</h3>
                      <p className="mt-2 text-2xl font-bold">{match.score}</p>
                      <p className="text-sm text-gray-600">{match.league}</p>
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <div className="bg-white border-4 border-yellow-600 text-black p-6 rounded-lg shadow-lg">
                    <p>No live matches currently</p>
                  </div>
                </SwiperSlide>
              )}
            </Swiper>
          )}
        </section>

        {/* Upcoming Matches Slider */}
        <section className="w-full bg-blue-800 border-4 border-yellow-600 text-center text-white py-20 text-3xl font-bold rounded-lg shadow-lg">
          <h2 className="mb-5">Upcoming Matches</h2>
          {loading ? (
            <div className="text-white text-xl">Loading matches...</div>
          ) : error ? (
            <div className="text-red-300 text-xl">{error}</div>
          ) : (
            <Swiper {...swiperSettings}>
              {upcomingMatches.length > 0 ? (
                upcomingMatches.map((match) => (
                  <SwiperSlide key={match.id}>
                    <div className="bg-white border-4 border-yellow-600 text-black p-6 rounded-lg shadow-lg transition-transform transform hover:-translate-y-2 bg-transparent">
                      <h3 className="text-xl font-semibold">{match.teams}</h3>
                      <p className="mt-2">{match.date}</p>
                      <p>{match.time}</p>
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <div className="bg-white border-4 border-yellow-600 text-black p-6 rounded-lg shadow-lg">
                    <p>No upcoming matches available</p>
                  </div>
                </SwiperSlide>
              )}
            </Swiper>
          )}
        </section>

        {/* Predictions Slider */}
        <section className="w-full bg-red-800 border-4 border-yellow-600 text-center text-black py-20 text-3xl font-bold rounded-lg shadow-lg justify-between h-auto">
          <h2 className="mb-5 text-white">Live Predictions</h2>
          {loading ? (
            <div className="text-white text-xl">Loading predictions...</div>
          ) : error ? (
            <div className="text-red-300 text-xl">{error}</div>
          ) : (
            <Swiper {...swiperSettings}>
              {predictions.length > 0 ? (
                predictions.map((prediction) => (
                  <SwiperSlide key={prediction.id}>
                    <div className="bg-white border-4 border-yellow-600 text-black p-6 rounded-lg shadow-lg transition-transform transform Stranslate-y-2">
                      <h3 className="text-xl font-semibold">Prediction</h3>
                      <p className="mt-2">{prediction.prediction}</p>
                      <p className="text-sm text-gray-600">Accuracy: {prediction.accuracy}</p>
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div
                            className="bg-green-500 h-4 rounded-full"
                            style={{ width: `${prediction.winProbability}%` }}
                          ></div>
                        </div>
                        <p className="mt-2 text-gray-700">Win Probability: {prediction.winProbability}%</p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <div className="bg-white border-4 border-yellow-600 text-black p-6 rounded-lg shadow-lg">
                    <p>No predictions available</p>
                  </div>
                </SwiperSlide>
              )}
            </Swiper>
          )}
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