/**
 * Scraper API Routes
 * This module provides API endpoints for web scraping operations
 */

const express = require('express');
const router = express.Router();
const scrapers = require('../scrapers/footballScrapers');

// Rate limiting middleware to prevent abuse
const rateLimit = require('express-rate-limit');

const scraperLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 requests per windowMs
  message: 'Too many scraper requests from this IP, please try again after 15 minutes'
});

// Apply rate limiting to all scraper routes
router.use(scraperLimiter);

/**
 * @route   GET /api/scrape/fbref/player
 * @desc    Get player statistics from FBref
 * @access  Public
 */
router.get('/fbref/player', async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({ message: 'Player name is required' });
    }
    
    const stats = await scrapers.getPlayerStatsFromFBref(name);
    res.json(stats);
  } catch (error) {
    console.error('Error in FBref scraper route:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   GET /api/scrape/soccerstats/player
 * @desc    Get player career statistics from SoccerSTATS
 * @access  Public
 */
router.get('/soccerstats/player', async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({ message: 'Player name is required' });
    }
    
    const careerStats = await scrapers.getPlayerCareerStats(name);
    res.json(careerStats);
  } catch (error) {
    console.error('Error in SoccerSTATS scraper route:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   GET /api/scrape/footystats/standings
 * @desc    Get league standings from FootyStats
 * @access  Public
 */
router.get('/footystats/standings', async (req, res) => {
  try {
    const { leagueId } = req.query;
    
    if (!leagueId) {
      return res.status(400).json({ message: 'League ID is required' });
    }
    
    const standings = await scrapers.getDetailedLeagueStandings(leagueId);
    res.json(standings);
  } catch (error) {
    console.error('Error in FootyStats standings scraper route:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   GET /api/scrape/footystats/fixtures
 * @desc    Get upcoming fixtures with detailed stats from FootyStats
 * @access  Public
 */
router.get('/footystats/fixtures', async (req, res) => {
  try {
    const { leagueId, count = 10 } = req.query;
    
    if (!leagueId) {
      return res.status(400).json({ message: 'League ID is required' });
    }
    
    const fixtures = await scrapers.getDetailedFixtures(leagueId, count);
    res.json(fixtures);
  } catch (error) {
    console.error('Error in FootyStats fixtures scraper route:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;