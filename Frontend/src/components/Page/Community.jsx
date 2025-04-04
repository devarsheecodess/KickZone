import React, { useState, useEffect } from "react";

const Community = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "FootballFan123",
      title: "Premier League Discussion",
      content: "What do you think about the current Premier League season?",
      likes: 24,
      comments: 8,
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      author: "SoccerExpert",
      title: "Champions League Predictions",
      content: "Who do you think will win the Champions League this year?",
      likes: 42,
      comments: 15,
      timestamp: "5 hours ago"
    },
    {
      id: 3,
      author: "FootballTactician",
      title: "Tactical Analysis: Modern Formations",
      content: "Let's discuss the evolution of football formations in the modern game.",
      likes: 18,
      comments: 6,
      timestamp: "1 day ago"
    }
  ]);
  
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [username, setUsername] = useState("Guest");
  
  useEffect(() => {
    // Get username from localStorage if available
    const user = localStorage.getItem('user');
    if (user) {
      setUsername(user);
    }
  }, []);
  
  const handlePostChange = (e) => {
    const { name, value } = e.target;
    setNewPost(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmitPost = (e) => {
    e.preventDefault();
    
    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert("Please fill in both title and content");
      return;
    }
    
    const post = {
      id: Date.now(),
      author: username,
      title: newPost.title,
      content: newPost.content,
      likes: 0,
      comments: 0,
      timestamp: "Just now"
    };
    
    setPosts([post, ...posts]);
    setNewPost({ title: "", content: "" });
  };
  
  const handleLike = (id) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    ));
  };
  
  return (
    <div className="absolute top-0 left-0 -z-20 w-full min-h-screen bg-[radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] flex flex-col items-center p-4">
      <div className="w-full max-w-4xl mt-20 space-y-8">
        <section className="w-full bg-blue-800 border-4 border-yellow-600 text-center text-white py-8 text-3xl font-bold rounded-lg shadow-lg">
          KickZone Community
        </section>
        
        {/* Create Post Form */}
        <section className="w-full bg-red-800 border-4 border-yellow-600 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Create a Post</h2>
          <form onSubmit={handleSubmitPost}>
            <div className="mb-4">
              <input
                type="text"
                name="title"
                value={newPost.title}
                onChange={handlePostChange}
                placeholder="Post title"
                className="w-full p-2 rounded border-2 border-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                required
              />
            </div>
            <div className="mb-4">
              <textarea
                name="content"
                value={newPost.content}
                onChange={handlePostChange}
                placeholder="What's on your mind?"
                className="w-full p-2 rounded border-2 border-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-600 h-32"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
            >
              Post
            </button>
          </form>
        </section>
        
        {/* Posts List */}
        <section className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="bg-blue-900 border-4 border-yellow-600 p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white">{post.title}</h3>
                <span className="text-sm text-gray-300">{post.timestamp}</span>
              </div>
              <p className="text-white mb-4">{post.content}</p>
              <div className="flex justify-between items-center text-sm text-gray-300">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                  >
                    <span>❤️</span>
                    <span>{post.likes}</span>
                  </button>
                  <div className="flex items-center space-x-1">
                    <span>💬</span>
                    <span>{post.comments}</span>
                  </div>
                </div>
                <div>Posted by: {post.author}</div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Community;