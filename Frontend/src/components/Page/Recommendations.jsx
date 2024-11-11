import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Recommendations() {
    const [videos, setVideos] = useState([]); // Initialize as an empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const userID = localStorage.getItem('id');
                if (!userID) {
                    throw new Error("User ID not found in localStorage.");
                }

                const response = await axios.get(`${BACKEND_URL}/recommendations`, { params: { userId: userID } });

                // Check if response contains youtubeVideos
                if (response.data?.youtubeVideos) {
                    setVideos(response.data.youtubeVideos);
                } else {
                    throw new Error("No videos found in response.");
                }
            } catch (error) {
                console.error("Error fetching recommendations:", error);
                setError(error.message || "Failed to load recommendations.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (loading) return <div style={loadingStyle}>Loading recommendations...</div>;
    if (error) return <div style={errorStyle}>{error}</div>;

    return (
        <div className=" absolute inset-0 -z-20 w-full min-h-screen bg-transparent bg-[radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] flex flex-col items-center p-4 justify-center" style={containerStyle}>
            <h2>Recommended Videos</h2>
            {videos.length === 0 ? (
                <p>No recommendations available at this time.</p>
            ) : (
                <div style={gridStyle}>
                    {videos.map((video) => (
                        <div key={video.content?.id?.videoId} style={cardStyle}>
                            <h3>{video.content?.snippet?.title}</h3>
                            <p>{video.content?.snippet?.description}</p>
                            <a
                                href={`https://www.youtube.com/watch?v=${video.content?.id?.videoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={linkStyle}
                            >
                                Watch Video
                            </a>
                            <p>Similarity Score: {video.similarityScore?.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Inline styles for UI components
const containerStyle = { padding: '20px', fontFamily: 'Arial, sans-serif' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' };
const cardStyle = { border: '1px solid #ddd', padding: '15px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' };
const linkStyle = { color: '#1a73e8', textDecoration: 'none', fontWeight: 'bold' };
const loadingStyle = { textAlign: 'center', fontSize: '18px' };
const errorStyle = { color: 'red', textAlign: 'center' };

export default Recommendations;