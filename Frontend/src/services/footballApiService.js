/**
 * Football API Service
 * This service handles all API calls to the football-api-sports.io API
 */

const API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY || 'YOUR_API_KEY'; // Replace with your actual API key
const API_BASE_URL = 'https://v3.football.api-sports.io';

/**
 * Make a request to the Football API
 * @param {string} endpoint - API endpoint to call
 * @param {Object} params - Query parameters
 * @returns {Promise} - Promise with the API response
 */
async function makeApiRequest(endpoint, params = {}) {
  try {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    
    // Add query parameters
    Object.keys(params).forEach(key => {
      url.searchParams.append(key, params[key]);
    });
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Football API request failed:', error);
    throw error;
  }
}

/**
 * Get live matches
 * @returns {Promise} - Promise with live matches data
 */
export async function getLiveMatches() {
  return makeApiRequest('/fixtures', { live: 'all' });
}

/**
 * Get upcoming fixtures
 * @param {string} league - League ID
 * @param {string} season - Season year
 * @param {number} next - Number of upcoming matches to fetch
 * @returns {Promise} - Promise with upcoming fixtures data
 */
export async function getUpcomingFixtures(league = '39', season = '2023', next = 10) {
  return makeApiRequest('/fixtures', { league, season, next });
}

/**
 * Get league standings
 * @param {string} league - League ID
 * @param {string} season - Season year
 * @returns {Promise} - Promise with standings data
 */
export async function getLeagueStandings(league = '39', season = '2023') {
  return makeApiRequest('/standings', { league, season });
}

/**
 * Get team information
 * @param {string} teamId - Team ID
 * @returns {Promise} - Promise with team data
 */
export async function getTeamInfo(teamId) {
  return makeApiRequest('/teams', { id: teamId });
}

/**
 * Get player statistics
 * @param {string} playerId - Player ID
 * @param {string} season - Season year
 * @returns {Promise} - Promise with player statistics
 */
export async function getPlayerStats(playerId, season = '2023') {
  return makeApiRequest('/players', { id: playerId, season });
}

/**
 * Get head-to-head statistics between two teams
 * @param {string} team1 - First team ID
 * @param {string} team2 - Second team ID
 * @param {number} last - Number of last matches to consider
 * @returns {Promise} - Promise with head-to-head data
 */
export async function getHeadToHead(team1, team2, last = 5) {
  return makeApiRequest('/fixtures/headtohead', { h2h: `${team1}-${team2}`, last });
}

/**
 * Get predictions for a fixture
 * @param {string} fixtureId - Fixture ID
 * @returns {Promise} - Promise with prediction data
 */
export async function getPredictions(fixtureId) {
  return makeApiRequest('/predictions', { fixture: fixtureId });
}

/**
 * Get league information
 * @param {string} country - Country name (optional)
 * @returns {Promise} - Promise with leagues data
 */
export async function getLeagues(country = null) {
  const params = country ? { country } : {};
  return makeApiRequest('/leagues', params);
}

/**
 * Get fixture statistics
 * @param {string} fixtureId - Fixture ID
 * @returns {Promise} - Promise with fixture statistics
 */
export async function getFixtureStatistics(fixtureId) {
  return makeApiRequest('/fixtures/statistics', { fixture: fixtureId });
}

/**
 * Get fixture events (goals, cards, etc.)
 * @param {string} fixtureId - Fixture ID
 * @returns {Promise} - Promise with fixture events
 */
export async function getFixtureEvents(fixtureId) {
  return makeApiRequest('/fixtures/events', { fixture: fixtureId });
}

export default {
  getLiveMatches,
  getUpcomingFixtures,
  getLeagueStandings,
  getTeamInfo,
  getPlayerStats,
  getHeadToHead,
  getPredictions,
  getLeagues,
  getFixtureStatistics,
  getFixtureEvents
};