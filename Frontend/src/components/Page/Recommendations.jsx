import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Recommendations() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // State for error handling

    useEffect(() => {
        // Fetch recommendations from the backend
        const fetchRecommendations = async () => {
            try {
                const userID = localStorage.getItem('id')
                const response = await axios.get('http://localhost:3000/recommendations', { params: { userId: userID } });
                setVideos(response.data.youtubeVideos);
            } catch (error) {
                console.error("Error fetching recommendations:", error);
                setError("Failed to load recommendations."); // Set error message
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (loading) return <div style={loadingStyle}>Loading recommendations...</div>;
    if (error) return <div style={errorStyle}>{error}</div>; // Display error message

    return (
        <div className="recommendations-container" style={containerStyle}>
            <h2>Recommended Videos</h2>
            <div style={gridStyle}>
                {videos.map((video) => (
                    <div key={video.content.id.videoId} style={cardStyle}>
                        <h3>{video.content.snippet.title}</h3>
                        <p>{video.content.snippet.description}</p>
                        <a 
                            href={`https://www.youtube.com/watch?v=${video.content.id.videoId}`} // Corrected string interpolation
                            target="_blank"
                            rel="noopener noreferrer"
                            style={linkStyle}
                        >
                            Watch Video
                        </a>
                        <p>Similarity Score: {video.similarityScore.toFixed(2)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Simple inline styling for UI
const containerStyle = {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
};

const cardStyle = {
    border: '1px solid #ddd',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const linkStyle = {
    color: '#1a73e8',
    textDecoration: 'none',
    fontWeight: 'bold',
};

// Styles for loading and error messages
const loadingStyle = {
    textAlign: 'center',
    fontSize: '18px',
};

const errorStyle = {
    color: 'red',
    textAlign: 'center',
};

export default Recommendations;