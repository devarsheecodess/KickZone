import React from 'react';

const Header = () => {
  return (
    <header className="bg-transparent text-white p-4 flex items-center justify-between">
      {/* Logo */}
      <div className="text-lg font-bold">
        <a href="/">KickStore</a>
      </div>

      {/* Navigation Links */}
      <nav className="flex gap-4">
        <a href="/home" className="hover:underline">Back to KickZone</a>
        <a href="/store" className="hover:underline">Shop</a>
        <a href="/cart" className="hover:underline">Cart</a>
      </nav>
    </header>
  );
};

export default Header;
