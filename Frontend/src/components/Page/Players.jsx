import React, { useState, useEffect } from 'react';
import { getPlayerStats, getTeamInfo } from '../../services/footballApiService';
import { getPlayerStatsFromFBref, getPlayerCareerStats } from '../../services/webScrapingService';

const Players = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [playerDetails, setPlayerDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [advancedStats, setAdvancedStats] = useState(null);
  const [careerStats, setCareerStats] = useState(null);
  const [dataSource, setDataSource] = useState('api'); // 'api' or 'scraping'
  
  // Top players to display by default (using player IDs from the API)
  const topPlayerIds = [
    276, // Neymar
    278, // Messi
    874, // Ronaldo
    1, // Mbappé
    521, // Haaland
    627, // Salah
  ];
  
  useEffect(() => {
    // Load top players on initial render
    const loadTopPlayers = async () => {
      setLoading(true);
      try {
        // Process players in batches to avoid API rate limits
        const playerPromises = topPlayerIds.map(id => getPlayerStats(id));
        const results = await Promise.allSettled(playerPromises);
        
        const players = results
          .filter(result => result.status === 'fulfilled' && result.value.response && result.value.response.length > 0)
          .map(result => {
            const playerData = result.value.response[0];
            return {
              id: playerData.player.id,
              name: playerData.player.name,
              age: playerData.player.age,
              nationality: playerData.player.nationality,
              photo: playerData.player.photo,
              position: playerData.statistics[0]?.games.position || 'Unknown',
              team: playerData.statistics[0]?.team.name || 'Unknown',
              teamLogo: playerData.statistics[0]?.team.logo || ''
            };
          });
        
        // Make sure we're displaying all available players
        console.log(`Loaded ${players.length} players out of ${topPlayerIds.length} requested`);
        setSearchResults(players);
        
        // If we couldn't load all players from the API, add fallback data
        if (players.length < topPlayerIds.length) {
          const fallbackPlayers = [
            {
              id: 276,
              name: "Neymar Jr",
              age: 31,
              nationality: "Brazil",
              photo: "https://media.api-sports.io/football/players/276.png",
              position: "Attacker",
              team: "Al Hilal",
              teamLogo: "https://media.api-sports.io/football/teams/2932.png"
            },
            {
              id: 278,
              name: "Lionel Messi",
              age: 36,
              nationality: "Argentina",
              photo: "https://media.api-sports.io/football/players/278.png",
              position: "Attacker",
              team: "Inter Miami",
              teamLogo: "https://media.api-sports.io/football/teams/1616.png"
            },
            {
              id: 874,
              name: "Cristiano Ronaldo",
              age: 38,
              nationality: "Portugal",
              photo: "https://media.api-sports.io/football/players/874.png",
              position: "Attacker",
              team: "Al Nassr",
              teamLogo: "https://media.api-sports.io/football/teams/1616.png"
            },
            {
              id: 1,
              name: "Kylian Mbappé",
              age: 24,
              nationality: "France",
              photo: "https://media.api-sports.io/football/players/1.png",
              position: "Attacker",
              team: "Real Madrid",
              teamLogo: "https://media.api-sports.io/football/teams/541.png"
            },
            {
              id: 521,
              name: "Erling Haaland",
              age: 23,
              nationality: "Norway",
              photo: "https://media.api-sports.io/football/players/521.png",
              position: "Attacker",
              team: "Manchester City",
              teamLogo: "https://media.api-sports.io/football/teams/50.png"
            },
            {
              id: 627,
              name: "Mohamed Salah",
              age: 31,
              nationality: "Egypt",
              photo: "https://media.api-sports.io/football/players/627.png",
              position: "Attacker",
              team: "Liverpool",
              teamLogo: "https://media.api-sports.io/football/teams/40.png"
            }
          ];
          
          // Merge API results with fallback data, avoiding duplicates
          const existingIds = new Set(players.map(p => p.id));
          const missingPlayers = fallbackPlayers.filter(p => !existingIds.has(p.id));
          
          setSearchResults([...players, ...missingPlayers]);
        }
      } catch (err) {
        console.error('Error loading top players:', err);
        setError('Failed to load player data. Please try again later.');
        
        // Provide fallback data if API fails completely
        const fallbackPlayers = [
          {
            id: 276,
            name: "Neymar Jr",
            age: 31,
            nationality: "Brazil",
            photo: "https://media.api-sports.io/football/players/276.png",
            position: "Attacker",
            team: "Al Hilal",
            teamLogo: "https://media.api-sports.io/football/teams/2932.png"
          },
          {
            id: 278,
            name: "Lionel Messi",
            age: 36,
            nationality: "Argentina",
            photo: "https://media.api-sports.io/football/players/278.png",
            position: "Attacker",
            team: "Inter Miami",
            teamLogo: "https://media.api-sports.io/football/teams/1616.png"
          },
          {
            id: 874,
            name: "Cristiano Ronaldo",
            age: 38,
            nationality: "Portugal",
            photo: "https://media.api-sports.io/football/players/874.png",
            position: "Attacker",
            team: "Al Nassr",
            teamLogo: "https://media.api-sports.io/football/teams/1616.png"
          },
          {
            id: 1,
            name: "Kylian Mbappé",
            age: 24,
            nationality: "France",
            photo: "https://media.api-sports.io/football/players/1.png",
            position: "Attacker",
            team: "Real Madrid",
            teamLogo: "https://media.api-sports.io/football/teams/541.png"
          },
          {
            id: 521,
            name: "Erling Haaland",
            age: 23,
            nationality: "Norway",
            photo: "https://media.api-sports.io/football/players/521.png",
            position: "Attacker",
            team: "Manchester City",
            teamLogo: "https://media.api-sports.io/football/teams/50.png"
          },
          {
            id: 627,
            name: "Mohamed Salah",
            age: 31,
            nationality: "Egypt",
            photo: "https://media.api-sports.io/football/players/627.png",
            position: "Attacker",
            team: "Liverpool",
            teamLogo: "https://media.api-sports.io/football/teams/40.png"
          }
        ];
        
        setSearchResults(fallbackPlayers);
      } finally {
        setLoading(false);
      }
    };
    
    loadTopPlayers();
  }, []);
  
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Note: In a real app, we would search players by name
      // For demo purposes, we'll just filter our top players list
      // as the free API tier has limited endpoints
      const filteredPlayers = searchResults.filter(player => 
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.team.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setSearchResults(filteredPlayers.length > 0 ? filteredPlayers : []);
    } catch (err) {
      console.error('Error searching players:', err);
      setError('Failed to search players. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const viewPlayerDetails = async (playerId) => {
    setLoading(true);
    setError(null);
    setAdvancedStats(null);
    setCareerStats(null);
    
    try {
      const response = await getPlayerStats(playerId);
      
      if (response.response && response.response.length > 0) {
        const playerData = response.response[0];
        const stats = playerData.statistics[0];
        
        const playerDetails = {
          id: playerData.player.id,
          name: playerData.player.name,
          firstname: playerData.player.firstname,
          lastname: playerData.player.lastname,
          age: playerData.player.age,
          birthdate: playerData.player.birth.date,
          nationality: playerData.player.nationality,
          height: playerData.player.height,
          weight: playerData.player.weight,
          photo: playerData.player.photo,
          position: stats?.games.position || 'Unknown',
          team: stats?.team.name || 'Unknown',
          teamLogo: stats?.team.logo || '',
          appearances: stats?.games.appearences || 0,
          minutes: stats?.games.minutes || 0,
          goals: stats?.goals.total || 0,
          assists: stats?.goals.assists || 0,
          yellowCards: stats?.cards.yellow || 0,
          redCards: stats?.cards.red || 0
        };
        
        setPlayerDetails(playerDetails);
        
        // Fetch additional data from web scraping services
        try {
          const fbrefStats = await getPlayerStatsFromFBref(playerDetails.name);
          setAdvancedStats(fbrefStats.stats);
          
          const careerData = await getPlayerCareerStats(playerDetails.name);
          setCareerStats(careerData.careerStats);
          
          setDataSource('both'); // Data from both API and web scraping
        } catch (scrapingErr) {
          console.error('Error fetching scraped data:', scrapingErr);
          // Continue with API data only
          setDataSource('api');
        }
      } else {
        throw new Error('Player data not found');
      }
    } catch (err) {
      console.error('Error fetching player details:', err);
      setError('Failed to load player details. Please try again later.');
      
      // Try to get data from web scraping as fallback
      if (searchResults.length > 0) {
        const player = searchResults.find(p => p.id === playerId);
        if (player) {
          try {
            const fbrefStats = await getPlayerStatsFromFBref(player.name);
            const careerData = await getPlayerCareerStats(player.name);
            
            setPlayerDetails({
              id: player.id,
              name: player.name,
              firstname: player.name.split(' ')[0],
              lastname: player.name.split(' ').slice(1).join(' '),
              age: player.age,
              nationality: player.nationality,
              photo: player.photo,
              position: player.position,
              team: player.team,
              teamLogo: player.teamLogo
            });
            
            setAdvancedStats(fbrefStats.stats);
            setCareerStats(careerData.careerStats);
            setDataSource('scraping'); // Data from web scraping only
            setError(null); // Clear error since we got data from scraping
          } catch (scrapingErr) {
            console.error('Error fetching scraped data as fallback:', scrapingErr);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };
  
  const closePlayerDetails = () => {
    setPlayerDetails(null);
  };
  
  return (
    <div className="absolute top-0 left-0 z-0 w-full min-h-screen bg-[radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] flex flex-col items-center p-4">
      <div className="w-full max-w-5xl mt-20 space-y-10 flex-1">
        {/* Search Bar */}
        <div className="w-full max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search players or teams..."
              className="flex-1 px-4 py-2 rounded-l-lg border-2 border-yellow-600 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-red-600 text-white px-6 py-2 rounded-r-lg hover:bg-red-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
        
        {/* Players Grid */}
        <section className="w-full bg-blue-800 border-4 border-yellow-600 text-center text-white py-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-5">Football Players</h2>
          
          {loading ? (
            <div className="text-white text-xl p-8">Loading players...</div>
          ) : error ? (
            <div className="text-red-300 text-xl p-8">{error}</div>
          ) : searchResults.length === 0 ? (
            <div className="text-white text-xl p-8">No players found. Try a different search.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
              {searchResults.map((player) => (
                <div 
                  key={player.id} 
                  className="bg-blue-900 border-2 border-yellow-600 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-blue-700 transition-colors"
                  onClick={() => viewPlayerDetails(player.id)}
                >
                  <img 
                    src={player.photo} 
                    alt={player.name} 
                    className="w-32 h-32 object-cover rounded-full mb-4 border-2 border-yellow-600" 
                  />
                  <h3 className="text-xl font-semibold">{player.name}</h3>
                  <div className="text-sm text-gray-300 mt-1">{player.position}</div>
                  <div className="flex items-center mt-2">
                    {player.teamLogo && (
                      <img 
                        src={player.teamLogo} 
                        alt={player.team} 
                        className="w-6 h-6 mr-2" 
                      />
                    )}
                    <span>{player.team}</span>
                  </div>
                  <div className="text-sm text-gray-300 mt-1">{player.nationality}</div>
                </div>
              ))}
            </div>
          )}
        </section>
        
        {/* Player Details Modal */}
        {playerDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-blue-900 border-4 border-yellow-600 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-white">{playerDetails.name}</h2>
                  <button 
                    onClick={closePlayerDetails}
                    className="text-gray-300 hover:text-white text-xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 flex flex-col items-center mb-4 md:mb-0">
                    <img 
                      src={playerDetails.photo} 
                      alt={playerDetails.name} 
                      className="w-40 h-40 object-cover rounded-full border-2 border-yellow-600" 
                    />
                    <div className="flex items-center mt-4">
                      {playerDetails.teamLogo && (
                        <img 
                          src={playerDetails.teamLogo} 
                          alt={playerDetails.team} 
                          className="w-8 h-8 mr-2" 
                        />
                      )}
                      <span className="text-white">{playerDetails.team}</span>
                    </div>
                    <div className="text-gray-300 mt-2">{playerDetails.position}</div>
                  </div>
                  
                  <div className="md:w-2/3 md:pl-6">
                    <div className="grid grid-cols-2 gap-4 text-white">
                      <div>
                        <h3 className="text-gray-400 text-sm">Full Name</h3>
                        <p>{playerDetails.firstname} {playerDetails.lastname}</p>
                      </div>
                      <div>
                        <h3 className="text-gray-400 text-sm">Age</h3>
                        <p>{playerDetails.age}</p>
                      </div>
                      <div>
                        <h3 className="text-gray-400 text-sm">Nationality</h3>
                        <p>{playerDetails.nationality}</p>
                      </div>
                      <div>
                        <h3 className="text-gray-400 text-sm">Birth Date</h3>
                        <p>{playerDetails.birthdate}</p>
                      </div>
                      <div>
                        <h3 className="text-gray-400 text-sm">Height</h3>
                        <p>{playerDetails.height}</p>
                      </div>
                      <div>
                        <h3 className="text-gray-400 text-sm">Weight</h3>
                        <p>{playerDetails.weight}</p>
                      </div>
                    </div>
                    
                    {/* Data source indicator */}
                    <div className="mt-4 mb-2">
                      <span className="text-xs bg-blue-700 text-white px-2 py-1 rounded">
                        Data source: {dataSource === 'api' ? 'Football API' : dataSource === 'scraping' ? 'Web Scraping' : 'Football API + Web Scraping'}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-white mt-6 mb-3">Season Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-blue-800 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-white">{playerDetails.appearances}</div>
                        <div className="text-xs text-gray-300">Appearances</div>
                      </div>
                      <div className="bg-blue-800 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-white">{playerDetails.goals}</div>
                        <div className="text-xs text-gray-300">Goals</div>
                      </div>
                      <div className="bg-blue-800 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-white">{playerDetails.assists}</div>
                        <div className="text-xs text-gray-300">Assists</div>
                      </div>
                      <div className="bg-blue-800 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-white">{playerDetails.minutes}</div>
                        <div className="text-xs text-gray-300">Minutes Played</div>
                      </div>
                      <div className="bg-blue-800 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-white">{playerDetails.yellowCards}</div>
                        <div className="text-xs text-gray-300">Yellow Cards</div>
                      </div>
                      <div className="bg-blue-800 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-white">{playerDetails.redCards}</div>
                        <div className="text-xs text-gray-300">Red Cards</div>
                      </div>
                    </div>
                    
                    {/* Advanced Stats from FBref */}
                    {advancedStats && (
                      <>
                        <h3 className="text-xl font-semibold text-white mt-6 mb-3">Advanced Statistics</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="bg-blue-800 p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold text-white">{advancedStats.xG}</div>
                            <div className="text-xs text-gray-300">Expected Goals (xG)</div>
                          </div>
                          <div className="bg-blue-800 p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold text-white">{advancedStats.passCompletionRate}</div>
                            <div className="text-xs text-gray-300">Pass Completion</div>
                          </div>
                          <div className="bg-blue-800 p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold text-white">{advancedStats.progressivePasses}</div>
                            <div className="text-xs text-gray-300">Progressive Passes</div>
                          </div>
                          <div className="bg-blue-800 p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold text-white">{advancedStats.progressiveCarries}</div>
                            <div className="text-xs text-gray-300">Progressive Carries</div>
                          </div>
                          <div className="bg-blue-800 p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold text-white">{advancedStats.tackles}</div>
                            <div className="text-xs text-gray-300">Tackles</div>
                          </div>
                          <div className="bg-blue-800 p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold text-white">{advancedStats.interceptions}</div>
                            <div className="text-xs text-gray-300">Interceptions</div>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {/* Career Stats */}
                    {careerStats && (
                      <>
                        <h3 className="text-xl font-semibold text-white mt-6 mb-3">Career Overview</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="bg-blue-800 p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold text-white">{careerStats.careerGoals}</div>
                            <div className="text-xs text-gray-300">Career Goals</div>
                          </div>
                          <div className="bg-blue-800 p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold text-white">{careerStats.careerAssists}</div>
                            <div className="text-xs text-gray-300">Career Assists</div>
                          </div>
                          <div className="bg-blue-800 p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold text-white">{careerStats.careerAppearances}</div>
                            <div className="text-xs text-gray-300">Career Appearances</div>
                          </div>
                          <div className="bg-blue-800 p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold text-white">{careerStats.seasons.length}</div>
                            <div className="text-xs text-gray-300">Seasons</div>
                          </div>
                        </div>
                        
                        <div className="mt-4 overflow-x-auto">
                          <table className="w-full text-sm text-white">
                            <thead className="bg-blue-700">
                              <tr>
                                <th className="px-2 py-2">Season</th>
                                <th className="px-2 py-2">Team</th>
                                <th className="px-2 py-2">Apps</th>
                                <th className="px-2 py-2">Goals</th>
                                <th className="px-2 py-2">Assists</th>
                              </tr>
                            </thead>
                            <tbody>
                              {careerStats.seasons.map((season, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-blue-900' : 'bg-blue-800'}>
                                  <td className="px-2 py-2">{season.season}</td>
                                  <td className="px-2 py-2">{season.team}</td>
                                  <td className="px-2 py-2">{season.appearances}</td>
                                  <td className="px-2 py-2">{season.goals}</td>
                                  <td className="px-2 py-2">{season.assists}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Players;