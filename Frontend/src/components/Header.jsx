import React from "react";

const Header = () => {
  const Logout = () => {
    const cf = confirm("Are you sure you want to logout?");
    if (cf) {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  return (
    <header className="text-white w-full py-4 px-6 flex justify-between items-center shadow-lg">
      <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-400">
        KickZone
      </h1>

      <nav className="space-x-6 text-lg font-medium">
        <a
          href="./Home"
          className="hover:text-yellow-300 hover:underline cursor-pointer transition-all duration-300"
        >
          Home
        </a>
        <a
          href="/store"
          className="hover:text-yellow-300 hover:underline cursor-pointer transition-all duration-300"
        >
          Store
        </a>
        <a
          href="./Meet"
          className="hover:text-yellow-300 hover:underline cursor-pointer transition-all duration-300"
        >
          Meet
        </a>
        <a
          href="./Polls"
          className="hover:text-yellow-300 hover:underline cursor-pointer transition-all duration-300"
        >
          Polls
        </a>
        <a
          href="./quiz"
          className="hover:text-yellow-300 hover:underline cursor-pointer transition-all duration-300"
        >
          Quiz
        </a>
        <a
          onClick={() => Logout()}
          className="hover:text-yellow-300 hover:underline cursor-pointer transition-all duration-300"
        >
          <i className="fa-solid fa-right-from-bracket"></i>
        </a>
      </nav>
    </header>
  );
};

export default Header;
