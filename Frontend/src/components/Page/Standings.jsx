import React, { useState, useEffect } from 'react';
import { getLeagueStandings } from '../../services/footballApiService';
import { getDetailedLeagueStandings } from '../../services/webScrapingService';

const Standings = () => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLeague, setActiveLeague] = useState('39'); // Default to Premier League
  const [dataSource, setDataSource] = useState('api'); // 'api', 'scraping', or 'both'
  const [detailedStats, setDetailedStats] = useState(false); // Toggle for detailed stats view

  useEffect(() => {
    const fetchStandings = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // First try to get data from the Football API
        const response = await getLeagueStandings(activeLeague);
        
        if (response.response && response.response.length > 0) {
          // API returns standings in league -> standings -> 0 -> table format
          const standingsData = response.response[0].league.standings[0];
          setStandings(standingsData);
          setDataSource('api');
          
          // Also fetch detailed stats from web scraping
          try {
            const scrapedData = await getDetailedLeagueStandings(activeLeague);
            
            // Merge API data with scraped data
            const enhancedStandings = standingsData.map(team => {
              const scrapedTeam = scrapedData.standings.find(t => t.team.name === team.team.name);
              if (scrapedTeam) {
                return {
                  ...team,
                  // Add additional stats from web scraping
                  xG: scrapedTeam.xG,
                  xGA: scrapedTeam.xGA,
                  ppg: scrapedTeam.ppg,
                  form: scrapedTeam.form,
                  cleanSheets: scrapedTeam.cleanSheets,
                  failedToScore: scrapedTeam.failedToScore
                };
              }
              return team;
            });
            
            setStandings(enhancedStandings);
            setDataSource('both');
          } catch (scrapingErr) {
            console.error('Error fetching scraped standings data:', scrapingErr);
            // Continue with API data only
          }
        } else {
          throw new Error('Failed to load standings data from API');
        }
      } catch (apiErr) {
        console.error('Error fetching standings from API:', apiErr);
        
        // Try to get data from web scraping as fallback
        try {
          const scrapedData = await getDetailedLeagueStandings(activeLeague);
          setStandings(scrapedData.standings.map(team => ({
            rank: team.position,
            team: {
              id: team.team.name.replace(/\s+/g, '').toLowerCase(),
              name: team.team.name,
              logo: team.team.logo
            },
            points: team.points,
            goalsDiff: team.goalDifference,
            all: {
              played: team.played,
              win: team.wins,
              draw: team.draws,
              lose: team.losses,
              goals: {
                for: team.goalsFor,
                against: team.goalsAgainst
              }
            },
            // Additional stats from web scraping
            xG: team.xG,
            xGA: team.xGA,
            ppg: team.ppg,
            form: team.form,
            cleanSheets: team.cleanSheets,
            failedToScore: team.failedToScore
          })));
          setDataSource('scraping');
          setError(null); // Clear error since we got data from scraping
        } catch (scrapingErr) {
          console.error('Error fetching scraped standings as fallback:', scrapingErr);
          setError('Failed to load standings. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchStandings();
  }, [activeLeague]);

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
          
          {/* Data Source Indicator */}
          <div className="flex items-center">
            <span className="text-xs bg-blue-700 text-white px-2 py-1 rounded mr-2">
              Data source: {dataSource === 'api' ? 'Football API' : dataSource === 'scraping' ? 'Web Scraping' : 'Football API + Web Scraping'}
            </span>
            
            {/* Detailed Stats Toggle */}
            <button
              className={`px-4 py-2 rounded-lg ${detailedStats ? 'bg-red-600 text-white' : 'bg-blue-900 text-gray-300'}`}
              onClick={() => setDetailedStats(!detailedStats)}
            >
              {detailedStats ? 'Basic View' : 'Detailed View'}
            </button>
          </div>
        </div>
        
        {/* Standings Table */}
        <section className="w-full bg-blue-800 border-4 border-yellow-600 text-center text-white py-8 text-3xl font-bold rounded-lg shadow-lg">
          <h2 className="mb-5">League Standings</h2>
          {loading ? (
            <div className="text-white text-xl">Loading standings...</div>
          ) : error ? (
            <div className="text-red-300 text-xl">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-white">
                <thead className="text-xs uppercase bg-blue-900">
                  <tr>
                    <th scope="col" className="px-6 py-3">Pos</th>
                    <th scope="col" className="px-6 py-3">Team</th>
                    <th scope="col" className="px-6 py-3">P</th>
                    <th scope="col" className="px-6 py-3">W</th>
                    <th scope="col" className="px-6 py-3">D</th>
                    <th scope="col" className="px-6 py-3">L</th>
                    <th scope="col" className="px-6 py-3">GF</th>
                    <th scope="col" className="px-6 py-3">GA</th>
                    <th scope="col" className="px-6 py-3">GD</th>
                    <th scope="col" className="px-6 py-3">Pts</th>
                    {detailedStats && (
                      <>
                        <th scope="col" className="px-6 py-3">Form</th>
                        <th scope="col" className="px-6 py-3">xG</th>
                        <th scope="col" className="px-6 py-3">xGA</th>
                        <th scope="col" className="px-6 py-3">PPG</th>
                        <th scope="col" className="px-6 py-3">CS</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {standings.map((team) => (
                    <tr key={team.team.id} className="border-b bg-blue-800 border-blue-700 hover:bg-blue-700">
                      <td className="px-6 py-4">{team.rank}</td>
                      <td className="px-6 py-4 flex items-center">
                        <img 
                          src={team.team.logo} 
                          alt={team.team.name} 
                          className="w-6 h-6 mr-2" 
                        />
                        {team.team.name}
                      </td>
                      <td className="px-6 py-4">{team.all.played}</td>
                      <td className="px-6 py-4">{team.all.win}</td>
                      <td className="px-6 py-4">{team.all.draw}</td>
                      <td className="px-6 py-4">{team.all.lose}</td>
                      <td className="px-6 py-4">{team.all.goals.for}</td>
                      <td className="px-6 py-4">{team.all.goals.against}</td>
                      <td className="px-6 py-4">{team.goalsDiff}</td>
                      <td className="px-6 py-4 font-bold">{team.points}</td>
                      {detailedStats && (
                        <>
                          <td className="px-6 py-4">{team.form || '-'}</td>
                          <td className="px-6 py-4">{team.xG || '-'}</td>
                          <td className="px-6 py-4">{team.xGA || '-'}</td>
                          <td className="px-6 py-4">{team.ppg || '-'}</td>
                          <td className="px-6 py-4">{team.cleanSheets || '-'}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Standings;