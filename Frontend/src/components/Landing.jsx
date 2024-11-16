import React from 'react';
import Typewriter from 'react-typewriter-effect';

const Landing = () => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Background Image */}
      <img
        src="https://digitalhub.fifa.com/transform/74918d4a-51cb-43e6-94d4-101644bf4a1a/2010_F_Iniesta_0-1_NED_ESP?&io=transform:fill,aspectratio:16x9,width:1536&quality=75"
        alt="Background"
        className="absolute top-0 left-0 w-full h-full object-cover -z-20"
      />
      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 -z-10"></div>

      {/* Black Gradient Overlays for Header and Footer Fade */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black via-transparent to-transparent -z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black via-transparent to-transparent -z-10"></div>

      {/* Header */}
      <header className="relative z-30 flex justify-between items-center w-full p-6">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
          KickZone
        </h1>
        <nav className="space-x-6 text-lg text-white">
          <a
            href="./login"
            className="hover:text-yellow-400 transition duration-300 font-semibold"
          >
            Login
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-8 px-4">
        <h1 className="text-6xl md:text-8xl font-extrabold text-white tracking-wider leading-tight drop-shadow-md">
          Let's Football!!
        </h1>

        {/* Typewriter Effect */}
        <div className="text-lg md:text-2xl text-white opacity-90 drop-shadow-md">
          <Typewriter
            textStyle={{
              fontSize: "1.5rem",
              color: "white",
            }}
            startDelay={500}
            cursorColor="white"
            multiText={[
              "Welcome to KickZone – Your Ultimate Football Hub",
              "Stay updated with the latest football news!",
            ]}
            multiTextDelay={2000}
            typeSpeed={50}
            hideCursorAfterText
          />
        </div>

        <a
          href="./signup"
          className="bg-[radial-gradient(ellipse_at_center,_#FFD700,_#FFA500)] text-black font-bold py-4 px-10 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_#FFD700]"
        >
          Get Started
        </a>
      </div>
    </div>
  );
};

export default Landing;
