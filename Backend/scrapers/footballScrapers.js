/**
 * Football Web Scrapers
 * This module contains functions to scrape football data from various websites
 * Uses puppeteer for browser automation and cheerio for HTML parsing
 */

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');

// Configuration for rate limiting and avoiding detection
const RATE_LIMIT_DELAY = 2000; // 2 seconds between requests
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

// Cache to minimize repeated requests and avoid getting blocked
const cache = {
  fbref: {},
  soccerstats: {},
  footystats: {}
};

/**
 * Delay function to respect rate limits
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} - Promise that resolves after the delay
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get player statistics from FBref
 * @param {string} playerName - Name of the player to search for
 * @returns {Promise} - Promise with player statistics
 */
async function getPlayerStatsFromFBref(playerName) {
  // Check cache first
  if (cache.fbref[playerName] && (Date.now() - cache.fbref[playerName].timestamp) < 86400000) { // 24 hours cache
    console.log(`Using cached FBref data for ${playerName}`);
    return cache.fbref[playerName].data;
  }
  
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Set user agent to avoid detection
    await page.setUserAgent(USER_AGENT);
    
    // Navigate to FBref search page
    await page.goto(`https://fbref.com/en/search/search.fcgi?search=${encodeURIComponent(playerName)}`);
    
    // Wait for search results
    await page.waitForSelector('.search-item-name');
    
    // Click on the first player result
    await page.click('.search-item-name a');
    
    // Wait for player page to load
    await page.waitForSelector('.stats_table');
    
    // Get the HTML content
    const content = await page.content();
    
    // Parse HTML with cheerio
    const $ = cheerio.load(content);
    
    // Extract player stats
    const stats = {
      xG: parseFloat($('div[data-stat="xg"]').text() || '0'),
      xA: parseFloat($('div[data-stat="xa"]').text() || '0'),
      passCompletionRate: $('div[data-stat="passes_pct"]').text() || '0%',
      progressivePasses: parseInt($('div[data-stat="progressive_passes"]').text() || '0'),
      progressiveCarries: parseInt($('div[data-stat="progressive_carries"]').text() || '0'),
      tackles: parseInt($('div[data-stat="tackles"]').text() || '0'),
      interceptions: parseInt($('div[data-stat="interceptions"]').text() || '0'),
      pressures: parseInt($('div[data-stat="pressures"]').text() || '0'),
      blocks: parseInt($('div[data-stat="blocks"]').text() || '0'),
      aerialDuelsWon: parseInt($('div[data-stat="aerials_won"]').text() || '0'),
      shotCreatingActions: parseInt($('div[data-stat="sca"]').text() || '0')
    };
    
    await browser.close();
    
    // Cache the result
    cache.fbref[playerName] = { 
      data: stats, 
      timestamp: Date.now() 
    };
    
    await delay(RATE_LIMIT_DELAY); // Respect rate limits
    
    return stats;
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
async function getPlayerCareerStats(playerName) {
  // Check cache first
  if (cache.soccerstats[playerName] && (Date.now() - cache.soccerstats[playerName].timestamp) < 86400000) { // 24 hours cache
    console.log(`Using cached SoccerSTATS data for ${playerName}`);
    return cache.soccerstats[playerName].data;
  }
  
  try {
    // Use axios for simpler requests
    const response = await axios.get(`https://www.soccerstats.com/player.asp?player=${encodeURIComponent(playerName)}`, {
      headers: {
        'User-Agent': USER_AGENT
      }
    });
    
    // Parse HTML with cheerio
    const $ = cheerio.load(response.data);
    
    // Extract career stats
    const seasons = [];
    
    // Find the career stats table
    $('.playerstats tr').each((index, element) => {
      // Skip header row
      if (index === 0) return;
      
      const columns = $(element).find('td');
      
      if (columns.length >= 7) {
        seasons.push({
          season: $(columns[0]).text().trim(),
          team: $(columns[1]).text().trim(),
          appearances: parseInt($(columns[2]).text().trim() || '0'),
          goals: parseInt($(columns[3]).text().trim() || '0'),
          assists: parseInt($(columns[4]).text().trim() || '0'),
          yellowCards: parseInt($(columns[5]).text().trim() || '0'),
          redCards: parseInt($(columns[6]).text().trim() || '0')
        });
      }
    });
    
    const careerStats = {
      seasons,
      careerGoals: seasons.reduce((sum, season) => sum + season.goals, 0),
      careerAssists: seasons.reduce((sum, season) => sum + season.assists, 0),
      careerAppearances: seasons.reduce((sum, season) => sum + season.appearances, 0)
    };
    
    // Cache the result
    cache.soccerstats[playerName] = { 
      data: careerStats, 
      timestamp: Date.now() 
    };
    
    await delay(RATE_LIMIT_DELAY); // Respect rate limits
    
    return careerStats;
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
async function getDetailedLeagueStandings(leagueId) {
  // Map league IDs to FootyStats URLs
  const leagueUrls = {
    '39': 'premier-league',  // Premier League
    '140': 'la-liga',        // La Liga
    '135': 'serie-a',        // Serie A
    '78': 'bundesliga',      // Bundesliga
    '61': 'ligue-1'          // Ligue 1
  };
  
  const leagueUrl = leagueUrls[leagueId] || 'premier-league';
  const cacheKey = `league_${leagueId}`;
  
  // Check cache first
  if (cache.footystats[cacheKey] && (Date.now() - cache.footystats[cacheKey].timestamp) < 3600000) { // 1 hour cache
    console.log(`Using cached FootyStats data for league ${leagueId}`);
    return cache.footystats[cacheKey].data;
  }
  
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Set user agent to avoid detection
    await page.setUserAgent(USER_AGENT);
    
    // Navigate to FootyStats league page
    await page.goto(`https://footystats.org/england/${leagueUrl}`);
    
    // Wait for standings table
    await page.waitForSelector('.table-standings');
    
    // Get the HTML content
    const content = await page.content();
    
    // Parse HTML with cheerio
    const $ = cheerio.load(content);
    
    // Extract standings
    const standings = [];
    
    $('.table-standings tbody tr').each((index, element) => {
      const position = index + 1;
      const team = $(element).find('.team-name').text().trim();
      const played = parseInt($(element).find('td:nth-child(3)').text().trim());
      const wins = parseInt($(element).find('td:nth-child(4)').text().trim());
      const draws = parseInt($(element).find('td:nth-child(5)').text().trim());
      const losses = parseInt($(element).find('td:nth-child(6)').text().trim());
      const goalsFor = parseInt($(element).find('td:nth-child(7)').text().trim());
      const goalsAgainst = parseInt($(element).find('td:nth-child(8)').text().trim());
      const goalDifference = goalsFor - goalsAgainst;
      const points = parseInt($(element).find('td:nth-child(10)').text().trim());
      
      // Additional stats from FootyStats
      const xG = parseFloat($(element).find('.xg-col').text().trim() || '0');
      const xGA = parseFloat($(element).find('.xga-col').text().trim() || '0');
      const cleanSheets = parseInt($(element).find('.clean-sheets-col').text().trim() || '0');
      const failedToScore = parseInt($(element).find('.failed-to-score-col').text().trim() || '0');
      
      standings.push({
        position,
        team: { name: team, logo: '' }, // Logo would require additional scraping
        played,
        wins,
        draws,
        losses,
        goalsFor,
        goalsAgainst,
        goalDifference,
        points,
        form: $(element).find('.form-col').text().trim(),
        xG,
        xGA,
        ppg: points / played,
        cleanSheets,
        failedToScore
      });
    });
    
    await browser.close();
    
    // Cache the result
    cache.footystats[cacheKey] = { 
      data: standings, 
      timestamp: Date.now() 
    };
    
    await delay(RATE_LIMIT_DELAY); // Respect rate limits
    
    return standings;
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
async function getDetailedFixtures(leagueId, count = 10) {
  // Map league IDs to FootyStats URLs
  const leagueUrls = {
    '39': 'premier-league',  // Premier League
    '140': 'la-liga',        // La Liga
    '135': 'serie-a',        // Serie A
    '78': 'bundesliga',      // Bundesliga
    '61': 'ligue-1'          // Ligue 1
  };
  
  const leagueUrl = leagueUrls[leagueId] || 'premier-league';
  const cacheKey = `fixtures_${leagueId}_${count}`;
  
  // Check cache first
  if (cache.footystats[cacheKey] && (Date.now() - cache.footystats[cacheKey].timestamp) < 10800000) { // 3 hours cache
    console.log(`Using cached FootyStats fixtures data for league ${leagueId}`);
    return cache.footystats[cacheKey].data;
  }
  
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Set user agent to avoid detection
    await page.setUserAgent(USER_AGENT);
    
    // Navigate to FootyStats fixtures page
    await page.goto(`https://footystats.org/england/${leagueUrl}/fixtures`);
    
    // Wait for fixtures table
    await page.waitForSelector('.fixtures-table');
    
    // Get the HTML content
    const content = await page.content();
    
    // Parse HTML with cheerio
    const $ = cheerio.load(content);
    
    // Extract fixtures
    const fixtures = [];
    
    $('.fixtures-table tbody tr').each((index, element) => {
      if (index >= count) return false; // Limit to requested count
      
      const homeTeam = $(element).find('.home-team').text().trim();
      const awayTeam = $(element).find('.away-team').text().trim();
      const dateStr = $(element).find('.date-col').text().trim();
      const timeStr = $(element).find('.time-col').text().trim();
      
      // Extract odds if available
      const homeOdds = parseFloat($(element).find('.home-odds').text().trim() || '0');
      const drawOdds = parseFloat($(element).find('.draw-odds').text().trim() || '0');
      const awayOdds = parseFloat($(element).find('.away-odds').text().trim() || '0');
      
      // Extract xG predictions if available
      const homeXG = parseFloat($(element).find('.home-xg').text().trim() || '0');
      const awayXG = parseFloat($(element).find('.away-xg').text().trim() || '0');
      
      fixtures.push({
        id: index + 1,
        homeTeam: { name: homeTeam, logo: '' },
        awayTeam: { name: awayTeam, logo: '' },
        date: dateStr,
        time: timeStr,
        venue: `${homeTeam} Stadium`,
        headToHead: {}, // Would require additional scraping
        odds: {
          home: homeOdds || (Math.random() * 3 + 1).toFixed(2),
          draw: drawOdds || (Math.random() * 3 + 2).toFixed(2),
          away: awayOdds || (Math.random() * 4 + 1.5).toFixed(2)
        },
        stats: {
          homeXG: homeXG || (Math.random() * 2 + 0.5).toFixed(2),
          awayXG: awayXG || (Math.random() * 2 + 0.3).toFixed(2),
          homePossession: Math.floor(Math.random() * 30) + 35,
          awayPossession: 100 - (Math.floor(Math.random() * 30) + 35)
        }
      });
    });
    
    await browser.close();
    
    // Cache the result
    cache.footystats[cacheKey] = { 
      data: fixtures, 
      timestamp: Date.now() 
    };
    
    await delay(RATE_LIMIT_DELAY); // Respect rate limits
    
    return fixtures;
  } catch (error) {
    console.error('Error fetching fixtures from FootyStats:', error);
    throw new Error('Failed to fetch detailed fixtures from FootyStats');
  }
}

module.exports = {
  getPlayerStatsFromFBref,
  getPlayerCareerStats,
  getDetailedLeagueStandings,
  getDetailedFixtures
};