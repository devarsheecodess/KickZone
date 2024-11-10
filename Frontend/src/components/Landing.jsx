import React from 'react';

const Landing = () => {
  return (
    <div className="absolute top-0 left-0 -z-20 w-full min-h-screen bg-[radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] flex flex-col">
      {/* Header */}
      <header className="bg-transparent w-full flex justify-end p-4">
        <nav className="space-x-4 text-lg text-white">
          <a href="./login" className="hover:text-red-600 hover:underline">Login</a>
          <a href="./signup" className="hover:text-red-600 hover:underline">Signup</a>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center">
        <h1 className="text-5xl font-bold underline text-yellow-600 text-center">
          WELCOME TO KICK ZONE
        </h1>
      </div>
    </div>
  );
}

export default Landing;