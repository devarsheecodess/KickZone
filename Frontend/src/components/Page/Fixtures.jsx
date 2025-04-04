import React, { useState, useEffect } from 'react';
import { getUpcomingFixtures } from '../../services/footballApiService';

const Fixtures = () => {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLeague, setActiveLeague] = useState('39'); // Default to Premier League
  const [timeframe, setTimeframe] = useState('next'); // 'next' or 'last'

  useEffect(() => {
    const fetchFixtures = async () => {
      setLoading(true);
      try {
        // Fetch fixtures from Football API
        const response = await getUpcomingFixtures(activeLeague, '2023', timeframe === 'next' ? 20 : undefined);
        
        if (response.response) {
          // Format fixtures data
          const formattedFixtures = response.response.map(fixture => {
            const match = fixture.fixture;
            const teams = fixture.teams;
            const goals = fixture.goals;
            const date = new Date(match.date);
            
            return {
              id: match.id,
              teams: {
                home: {
                  name: teams.home.name,
                  logo: teams.home.logo
                },
                away: {
                  name: teams.away.name,
                  logo: teams.away.logo
                }
              },
              score: goals.home !== null ? `${goals.home} - ${goals.away}` : 'vs',
              date: date.toLocaleDateString(),
              time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              venue: match.venue?.name || 'TBD',
              status: match.status.short,
              round: fixture.league.round
            };
          });
          
          setFixtures(formattedFixtures);
          setLoading(false);
        } else {
          throw new Error('Failed to load fixtures data');
        }
      } catch (err) {
        console.error('Error fetching fixtures:', err);
        setError('Failed to load fixtures. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchFixtures();
  }, [activeLeague, timeframe]);

  return (
    <div className="absolute top-0 left-0 -z-20 w-full min-h-screen bg-[radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] flex flex-col items-center p-4">
      <div className="w-full max-w-5xl mt-20 space-y-10 flex-1">
        {/* Controls */}
        <div className="flex justify-between items-center mb-4">
          {/* League Selector */}
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
          
          {/* Timeframe Toggle */}
          <div className="flex bg-blue-900 rounded-lg overflow-hidden">
            <button
              className={`px-4 py-2 ${timeframe === 'next' ? 'bg-red-600 text-white' : 'text-gray-300'}`}
              onClick={() => setTimeframe('next')}
            >
              Upcoming
            </button>
            <button
              className={`px-4 py-2 ${timeframe === 'last' ? 'bg-red-600 text-white' : 'text-gray-300'}`}
              onClick={() => setTimeframe('last')}
            >
              Past
            </button>
          </div>
        </div>
        
        {/* Fixtures List */}
        <section className="w-full bg-blue-800 border-4 border-yellow-600 text-center text-white py-8 text-3xl font-bold rounded-lg shadow-lg">
          <h2 className="mb-5">{timeframe === 'next' ? 'Upcoming' : 'Past'} Fixtures</h2>
          {loading ? (
            <div className="text-white text-xl">Loading fixtures...</div>
          ) : error ? (
            <div className="text-red-300 text-xl">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {fixtures.length > 0 ? (
                fixtures.map((fixture) => (
                  <div 
                    key={fixture.id} 
                    className="bg-blue-900 border-2 border-yellow-600 rounded-lg p-4 flex flex-col items-center"
                  >
                    <div className="text-sm text-gray-300 mb-2">{fixture.round}</div>
                    
                    <div className="flex justify-between items-center w-full mb-4">
                      <div className="flex flex-col items-center w-2/5">
                        <img 
                          src={fixture.teams.home.logo} 
                          alt={fixture.teams.home.name} 
                          className="w-12 h-12 mb-2" 
                        />
                        <div className="text-sm text-center">{fixture.teams.home.name}</div>
                      </div>
                      
                      <div className="text-xl font-bold">{fixture.score}</div>
                      
                      <div className="flex flex-col items-center w-2/5">
                        <img 
                          src={fixture.teams.away.logo} 
                          alt={fixture.teams.away.name} 
                          className="w-12 h-12 mb-2" 
                        />
                        <div className="text-sm text-center">{fixture.teams.away.name}</div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-300">
                      {fixture.date} • {fixture.time}
                    </div>
                    {fixture.venue !== 'TBD' && (
                      <div className="text-xs text-gray-400 mt-1">{fixture.venue}</div>
                    )}
                    
                    {/* Detailed Stats Section */}
                    {showDetailedStats && fixture.headToHead && (
                      <div className="mt-3 pt-3 border-t border-blue-700 w-full">
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="text-center">
                            <div className="font-bold text-white">{fixture.headToHead.homeWins}</div>
                            <div className="text-xs text-gray-300">Home Wins</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-white">{fixture.headToHead.draws}</div>
                            <div className="text-xs text-gray-300">Draws</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-white">{fixture.headToHead.awayWins}</div>
                            <div className="text-xs text-gray-300">Away Wins</div>
                          </div>
                        </div>
                        
                        {fixture.odds && (
                          <div className="mt-2">
                            <div className="text-xs text-gray-300 mb-1">Match Odds</div>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                              <div className="bg-blue-900 rounded p-1 text-center">
                                <div className="font-bold">{fixture.odds.home}</div>
                                <div className="text-xs text-gray-300">Home</div>
                              </div>
                              <div className="bg-blue-900 rounded p-1 text-center">
                                <div className="font-bold">{fixture.odds.draw}</div>
                                <div className="text-xs text-gray-300">Draw</div>
                              </div>
                              <div className="bg-blue-900 rounded p-1 text-center">
                                <div className="font-bold">{fixture.odds.away}</div>
                                <div className="text-xs text-gray-300">Away</div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {fixture.stats && (
                          <div className="mt-2">
                            <div className="text-xs text-gray-300 mb-1">Expected Stats</div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="bg-blue-900 rounded p-1 text-center">
                                <div className="font-bold">{fixture.stats.homeXG}</div>
                                <div className="text-xs text-gray-300">Home xG</div>
                              </div>
                              <div className="bg-blue-900 rounded p-1 text-center">
                                <div className="font-bold">{fixture.stats.awayXG}</div>
                                <div className="text-xs text-gray-300">Away xG</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-xl p-8">No fixtures available</div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Fixtures;