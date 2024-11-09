import React from "react";
const Header = () => {
  return (
    <header className="bg-transparent w-full max-w-24xl p-4 flex justify-between items-center">
      <h1 className="text-red-600 font-bold text-lg">KickZone</h1>
      <nav className="space-x-4 text-sm text-white">
        <a href="./Home" className="hover:text-red-600 hover:underline">Home</a>
        <a href="/store" className="hover:text-red-600 hover:underline">Store</a>
        <a href="./Meet" className="hover:text-red-600 hover:underline">Meet</a>
        <a href="./Polls" className="hover:text-red-600 hover:underline">Polls</a>
        <a href="./quiz" className="hover:text-red-600 hover:underline">Quiz</a>
      </nav>
    </header>
  );
};

export default Header;