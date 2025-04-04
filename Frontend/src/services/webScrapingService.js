/**
 * Web Scraping Service
 * This service handles web scraping from football websites to supplement API data
 * It provides fallback data when API limits are reached or when more detailed stats are needed
 */

import axios from 'axios';

// Cache to store scraped data and minimize repeated requests
const cache = {
  fbref: {},
  soccerstats: {},
  footystats: {}
};

/**
 * Get player statistics from FBref
 * @param {string} playerName - Name of the player to search for
 * @returns {Promise} - Promise with player statistics
 */
export async function getPlayerStatsFromFBref(playerName) {
  // Check cache first
  if (cache.fbref[playerName] && (Date.now() - cache.fbref[playerName].timestamp) < 86400000) { // 24 hours cache
    console.log(`Using cached FBref data for ${playerName}`);
    return cache.fbref[playerName];
  }
  
  try {
    // Make a request to our backend scraper service
    const response = await axios.get(`/api/scrape/fbref/player?name=${encodeURIComponent(playerName)}`);
    
    if (!response.data || response.status !== 200) {
      throw new Error('Failed to fetch player stats from backend');
    }
    
    // Cache the result
    cache.fbref[playerName] = { stats: response.data, timestamp: Date.now() };
    
    return cache.fbref[playerName];
  } catch (error) {
    console.error('Error fetching data from FBref:', error);
    throw new Error('Failed to fetch player stats from FBref');
  }
}

/**
 * Get player career statistics from SoccerSTATS
 * @param {string} playerName - Name of the player to search for
 * @returns {Promise} - Promise with player career statistics
 */
export async function getPlayerCareerStats(playerName) {
  // Check cache first
  if (cache.soccerstats[playerName] && (Date.now() - cache.soccerstats[playerName].timestamp) < 86400000) { // 24 hours cache
    console.log(`Using cached SoccerSTATS data for ${playerName}`);
    return cache.soccerstats[playerName];
  }
  
  try {
    // Make a request to our backend scraper service
    const response = await axios.get(`/api/scrape/soccerstats/player?name=${encodeURIComponent(playerName)}`);
    
    if (!response.data || response.status !== 200) {
      throw new Error('Failed to fetch career stats from backend');
    }
    
    // Cache the result
    cache.soccerstats[playerName] = { careerStats: response.data, timestamp: Date.now() };
    
    return cache.soccerstats[playerName];
  } catch (error) {
    console.error('Error fetching data from SoccerSTATS:', error);
    throw new Error('Failed to fetch career stats from SoccerSTATS');
  }
}

/**
 * Get league standings from FootyStats
 * @param {string} leagueId - League ID to fetch standings for
 * @returns {Promise} - Promise with detailed league standings
 */
export async function getDetailedLeagueStandings(leagueId) {
  // Check cache first
  const cacheKey = `league_${leagueId}`;
  if (cache.footystats[cacheKey]) {
    // Check if cache is less than 1 hour old
    const cacheAge = Date.now() - cache.footystats[cacheKey].timestamp;
    if (cacheAge < 3600000) { // 1 hour in milliseconds
      console.log(`Using cached FootyStats data for league ${leagueId}`);
      return cache.footystats[cacheKey];
    }
  }
  
  try {
    // Make a request to our backend scraper service
    const response = await axios.get(`/api/scrape/footystats/standings?leagueId=${leagueId}`);
    
    if (!response.data || response.status !== 200) {
      throw new Error('Failed to fetch standings from backend');
    }
    
    // Cache the result
    cache.footystats[cacheKey] = { standings: response.data, timestamp: Date.now() };
    
    return cache.footystats[cacheKey];
  } catch (error) {
    console.error('Error fetching data from FootyStats:', error);
    throw new Error('Failed to fetch detailed standings from FootyStats');
  }
}

/**
 * Get upcoming fixtures with detailed stats from FootyStats
 * @param {string} leagueId - League ID to fetch fixtures for
 * @param {number} count - Number of fixtures to fetch
 * @returns {Promise} - Promise with detailed fixtures data
 */
export async function getDetailedFixtures(leagueId, count = 10) {
  const cacheKey = `fixtures_${leagueId}_${count}`;
  if (cache.footystats[cacheKey]) {
    // Check if cache is less than 3 hours old
    const cacheAge = Date.now() - cache.footystats[cacheKey].timestamp;
    if (cacheAge < 10800000) { // 3 hours in milliseconds
      console.log(`Using cached FootyStats fixtures data for league ${leagueId}`);
      return cache.footystats[cacheKey];
    }
  }
  
  try {
    // Make a request to our backend scraper service
    const response = await axios.get(`/api/scrape/footystats/fixtures?leagueId=${leagueId}&count=${count}`);
    
    if (!response.data || response.status !== 200) {
      throw new Error('Failed to fetch fixtures from backend');
    }
    
    // Cache the result
    cache.footystats[cacheKey] = { fixtures: response.data, timestamp: Date.now() };
    
    return cache.footystats[cacheKey];
  } catch (error) {
    console.error('Error fetching fixtures from FootyStats:', error);
    throw new Error('Failed to fetch detailed fixtures from FootyStats');
  }
}

// Helper functions to generate realistic data
// In a real implementation, these would be replaced with actual web scraping logic

function generateFbrefStats(playerName) {
  // Generate random but realistic-looking advanced stats
  const randomInRange = (min, max) => Math.round((Math.random() * (max - min) + min) * 10) / 10;
  
  return {
    xG: randomInRange(3, 15),
    xA: randomInRange(2, 10),
    passCompletionRate: `${randomInRange(70, 92)}%`,
    progressivePasses: randomInRange(30, 120),
    progressiveCarries: randomInRange(20, 100),
    tackles: randomInRange(10, 80),
    interceptions: randomInRange(5, 50),
    pressures: randomInRange(100, 300),
    blocks: randomInRange(10, 40),
    aerialDuelsWon: randomInRange(10, 100),
    shotCreatingActions: randomInRange(20, 100)
  };
}

function generateCareerStats(playerName) {
  // Generate career stats with multiple seasons
  const seasons = [];
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - Math.floor(Math.random() * 10) - 5; // Random career length
  
  for (let year = startYear; year < currentYear; year++) {
    const season = `${year}/${year+1}`;
    const team = getRandomTeam();
    const apps = Math.floor(Math.random() * 30) + 10;
    const goals = Math.floor(Math.random() * 20);
    const assists = Math.floor(Math.random() * 15);
    
    seasons.push({
      season,
      team,
      appearances: apps,
      goals,
      assists,
      yellowCards: Math.floor(Math.random() * 10),
      redCards: Math.floor(Math.random() * 2)
    });
  }
  
  return {
    seasons,
    careerGoals: seasons.reduce((sum, season) => sum + season.goals, 0),
    careerAssists: seasons.reduce((sum, season) => sum + season.assists, 0),
    careerAppearances: seasons.reduce((sum, season) => sum + season.appearances, 0)
  };
}

function generateDetailedStandings(leagueId) {
  // Map league IDs to league names
  const leagueNames = {
    '39': 'Premier League',
    '140': 'La Liga',
    '135': 'Serie A',
    '78': 'Bundesliga',
    '61': 'Ligue 1'
  };
  
  const leagueName = leagueNames[leagueId] || 'Unknown League';
  const teams = getTeamsForLeague(leagueId);
  
  // Generate standings with additional stats
  return teams.map((team, index) => {
    const played = 38;
    const wins = Math.floor(Math.random() * 25) + (20 - index); // Better teams win more
    const draws = Math.floor(Math.random() * 10);
    const losses = played - wins - draws;
    const goalsFor = wins * 2 + draws + Math.floor(Math.random() * 20);
    const goalsAgainst = losses * 2 + draws + Math.floor(Math.random() * 10);
    
    return {
      position: index + 1,
      team: team,
      played,
      wins,
      draws,
      losses,
      goalsFor,
      goalsAgainst,
      goalDifference: goalsFor - goalsAgainst,
      points: wins * 3 + draws,
      form: generateForm(),
      xG: Math.round((goalsFor * 0.9 + Math.random() * 10) * 10) / 10,
      xGA: Math.round((goalsAgainst * 0.9 + Math.random() * 10) * 10) / 10,
      ppg: Math.round(((wins * 3 + draws) / played) * 100) / 100,
      cleanSheets: Math.floor(wins * 0.4),
      failedToScore: Math.floor(losses * 0.6)
    };
  });
}

function generateDetailedFixtures(leagueId, count) {
  const teams = getTeamsForLeague(leagueId);
  const fixtures = [];
  
  // Generate future dates
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    // Random teams (ensure they're different)
    let homeIndex = Math.floor(Math.random() * teams.length);
    let awayIndex;
    do {
      awayIndex = Math.floor(Math.random() * teams.length);
    } while (awayIndex === homeIndex);
    
    const homeTeam = teams[homeIndex];
    const awayTeam = teams[awayIndex];
    
    // Random future date within next 30 days
    const fixtureDate = new Date(now);
    fixtureDate.setDate(now.getDate() + Math.floor(Math.random() * 30) + 1);
    
    fixtures.push({
      id: i + 1,
      homeTeam,
      awayTeam,
      date: fixtureDate.toISOString().split('T')[0],
      time: `${Math.floor(Math.random() * 12) + 12}:${Math.random() > 0.5 ? '00' : '30'}`,
      venue: `${homeTeam.name} Stadium`,
      // Additional stats from web scraping
      headToHead: {
        homeWins: Math.floor(Math.random() * 5),
        draws: Math.floor(Math.random() * 3),
        awayWins: Math.floor(Math.random() * 5)
      },
      odds: {
        home: (Math.random() * 3 + 1).toFixed(2),
        draw: (Math.random() * 3 + 2).toFixed(2),
        away: (Math.random() * 4 + 1.5).toFixed(2)
      },
      stats: {
        homeXG: (Math.random() * 2 + 0.5).toFixed(2),
        awayXG: (Math.random() * 2 + 0.3).toFixed(2),
        homePossession: Math.floor(Math.random() * 30) + 35,
        awayPossession: 100 - (Math.floor(Math.random() * 30) + 35)
      }
    });
  }
  
  return fixtures;
}

// Helper functions
function getRandomTeam() {
  const teams = [
    'Manchester United', 'Liverpool', 'Chelsea', 'Arsenal', 'Manchester City',
    'Barcelona', 'Real Madrid', 'Atletico Madrid', 'Bayern Munich', 'Borussia Dortmund',
    'PSG', 'Juventus', 'AC Milan', 'Inter Milan', 'Ajax'
  ];
  
  return teams[Math.floor(Math.random() * teams.length)];
}

function getTeamsForLeague(leagueId) {
  const leagueTeams = {
    '39': [ // Premier League
      { name: 'Manchester City', logo: 'https://media.api-sports.io/football/teams/50.png' },
      { name: 'Arsenal', logo: 'https://media.api-sports.io/football/teams/42.png' },
      { name: 'Liverpool', logo: 'https://media.api-sports.io/football/teams/40.png' },
      { name: 'Aston Villa', logo: 'https://media.api-sports.io/football/teams/66.png' },
      { name: 'Tottenham', logo: 'https://media.api-sports.io/football/teams/47.png' },
      { name: 'Manchester United', logo: 'https://media.api-sports.io/football/teams/33.png' },
      { name: 'Newcastle', logo: 'https://media.api-sports.io/football/teams/34.png' },
      { name: 'Chelsea', logo: 'https://media.api-sports.io/football/teams/49.png' },
      { name: 'West Ham', logo: 'https://media.api-sports.io/football/teams/48.png' },
      { name: 'Brighton', logo: 'https://media.api-sports.io/football/teams/51.png' }
    ],
    '140': [ // La Liga
      { name: 'Real Madrid', logo: 'https://media.api-sports.io/football/teams/541.png' },
      { name: 'Barcelona', logo: 'https://media.api-sports.io/football/teams/529.png' },
      { name: 'Atletico Madrid', logo: 'https://media.api-sports.io/football/teams/530.png' },
      { name: 'Athletic Club', logo: 'https://media.api-sports.io/football/teams/531.png' },
      { name: 'Girona', logo: 'https://media.api-sports.io/football/teams/547.png' },
      { name: 'Real Sociedad', logo: 'https://media.api-sports.io/football/teams/548.png' },
      { name: 'Real Betis', logo: 'https://media.api-sports.io/football/teams/543.png' },
      { name: 'Valencia', logo: 'https://media.api-sports.io/football/teams/532.png' },
      { name: 'Villarreal', logo: 'https://media.api-sports.io/football/teams/533.png' },
      { name: 'Sevilla', logo: 'https://media.api-sports.io/football/teams/536.png' }
    ],
    '135': [ // Serie A
      { name: 'Inter', logo: 'https://media.api-sports.io/football/teams/505.png' },
      { name: 'Milan', logo: 'https://media.api-sports.io/football/teams/489.png' },
      { name: 'Juventus', logo: 'https://media.api-sports.io/football/teams/496.png' },
      { name: 'Atalanta', logo: 'https://media.api-sports.io/football/teams/499.png' },
      { name: 'Roma', logo: 'https://media.api-sports.io/football/teams/497.png' },
      { name: 'Lazio', logo: 'https://media.api-sports.io/football/teams/487.png' },
      { name: 'Napoli', logo: 'https://media.api-sports.io/football/teams/492.png' },
      { name: 'Fiorentina', logo: 'https://media.api-sports.io/football/teams/502.png' },
      { name: 'Bologna', logo: 'https://media.api-sports.io/football/teams/500.png' },
      { name: 'Torino', logo: 'https://media.api-sports.io/football/teams/503.png' }
    ],
    '78': [ // Bundesliga
      { name: 'Bayern Munich', logo: 'https://media.api-sports.io/football/teams/157.png' },
      { name: 'Bayer Leverkusen', logo: 'https://media.api-sports.io/football/teams/168.png' },
      { name: 'RB Leipzig', logo: 'https://media.api-sports.io/football/teams/173.png' },
      { name: 'Borussia Dortmund', logo: 'https://media.api-sports.io/football/teams/165.png' },
      { name: 'Stuttgart', logo: 'https://media.api-sports.io/football/teams/172.png' },
      { name: 'Eintracht Frankfurt', logo: 'https://media.api-sports.io/football/teams/169.png' },
      { name: 'Hoffenheim', logo: 'https://media.api-sports.io/football/teams/167.png' },
      { name: 'Wolfsburg', logo: 'https://media.api-sports.io/football/teams/161.png' },
      { name: 'Freiburg', logo: 'https://media.api-sports.io/football/teams/160.png' },
      { name: 'Werder Bremen', logo: 'https://media.api-sports.io/football/teams/162.png' }
    ],
    '61': [ // Ligue 1
      { name: 'PSG', logo: 'https://media.api-sports.io/football/teams/85.png' },
      { name: 'Marseille', logo: 'https://media.api-sports.io/football/teams/81.png' },
      { name: 'Monaco', logo: 'https://media.api-sports.io/football/teams/91.png' },
      { name: 'Lille', logo: 'https://media.api-sports.io/football/teams/79.png' },
      { name: 'Lyon', logo: 'https://media.api-sports.io/football/teams/80.png' },
      { name: 'Rennes', logo: 'https://media.api-sports.io/football/teams/94.png' },
      { name: 'Nice', logo: 'https://media.api-sports.io/football/teams/84.png' },
      { name: 'Lens', logo: 'https://media.api-sports.io/football/teams/116.png' },
      { name: 'Strasbourg', logo: 'https://media.api-sports.io/football/teams/95.png' },
      { name: 'Reims', logo: 'https://media.api-sports.io/football/teams/93.png' }
    ]
  };
  
  return leagueTeams[leagueId] || leagueTeams['39']; // Default to Premier League if not found
}

function generateForm() {
  const results = ['W', 'D', 'L'];
  let form = '';
  
  for (let i = 0; i < 5; i++) {
    form += results[Math.floor(Math.random() * 3)];
  }
  
  return form;
}