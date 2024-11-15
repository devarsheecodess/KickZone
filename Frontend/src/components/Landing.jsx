import React from 'react';

const Landing = () => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <img
        src="https://media.gettyimages.com/id/1471955239/photo/london-england-raheem-sterling-of-chelsea-celebrates-with-teammates-after-scoring-the-teams.jpg?s=612x612&w=0&k=20&c=OoCpnjVzh4yOA9m-ySSuaOZkWCbxXWxuoV0kdIqKj2s="
        alt="Background"
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      />
      <div className="absolute top-0 left-0 w-full min-h-screen bg-[radial-gradient(125%_125%_at_50%_10%,rgba(0,0,139,0.7),rgba(0,0,255,0.7))] -z-20"></div>

      {/* Black Gradient Overlays for Header and Footer Fade */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black via-transparent to-transparent -z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black via-transparent to-transparent -z-10"></div>

      {/* Header with Logo and Navigation */}
      <header className="relative z-30 flex justify-between items-center w-full p-6">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-400">
          KickZone
        </h1>
        <nav className="space-x-6 text-lg text-white">
          <a href="./login" className="hover:text-yellow-400 transition duration-300 font-semibold">
            Login
          </a>
        </nav>
      </header>

      {/* Centered Heading Text with Get Started Button */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-8">
        <h1
          className="text-6xl md:text-8xl font-extrabold text-white tracking-wider leading-tight"
        >
          Let's Football!!
        </h1>
        <p className="text-lg md:text-2xl text-white opacity-90">
          Welcome to KickZone – Your Ultimate Football Hub
        </p>
        <a
          href="./signup"
          className="bg-[radial-gradient(125%_100%_at_50%_50%,#1E90FF_70%,#4169E1_100%)] hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
        >
          Get Started
        </a>
      </div>
    </div>
  );
};

export default Landing;
