# Football API Integration for KickZone

## Overview
This project integrates the Football API (v3.football.api-sports.io) to provide live football data, including:
- Live match scores and updates
- Upcoming fixtures
- League standings
- Player statistics
- Match predictions

## Setup Instructions

### API Key Configuration
1. Sign up for a free API key at [API-Football](https://www.api-football.com/)
2. Create or edit the `.env` file in the project root
3. Add your API key to the `.env` file:
   ```
   VITE_FOOTBALL_API_KEY=your_api_key_here
   ```
4. Restart the development server

### Free Plan Limitations
The free plan includes:
- 100 requests per day
- Limited historical data
- Limited leagues coverage

## Available Features

### Home Page
- Live matches display
- Upcoming fixtures
- Match predictions

### Standings Page
- League tables for major leagues
- Team positions, points, and performance stats

### Fixtures Page
- Upcoming and past matches
- Match details including venue and time

### Players Page
- Player search functionality
- Detailed player statistics
- Player profile information

## Usage Notes
- The application will fall back to local JSON data if the API request limit is reached
- League data is refreshed automatically every 5 minutes when viewing the home page
- You can switch between different leagues using the dropdown selectors

## Troubleshooting
If you encounter issues with the API:
1. Check your API key is correctly set in the `.env` file
2. Verify you haven't exceeded the daily request limit
3. Check the browser console for specific error messages