import React from 'react';

const Profile = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      {/* Full-screen background */}
      <div className="fixed top-0 left-0 w-full h-full z-[-1] bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      {/* Profile card with glassmorphism effect */}
      <div className="bg-white/30 backdrop-blur-lg p-8 rounded-lg shadow-lg max-w-lg w-full text-center border border-white/20">
        {/* Profile Image */}
        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-blue-500">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Information */}
        <h2 className="mt-4 text-2xl font-bold text-white">John Doe</h2>
        <p className="text-white">johndoe@example.com</p>

        {/* Profile Details */}
        <div className="mt-6 text-left">
          <h3 className="text-xl font-semibold text-white mb-4">Profile Details</h3>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span className="font-medium text-white">Member Since:</span>
              <span className="text-white">January 2021</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium text-white">Total Purchases:</span>
              <span className="text-white">15 items</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium text-white">Last Active:</span>
              <span className="text-white">2 days ago</span>
            </li>
          </ul>
        </div>

        {/* Recent Activities */}
        <div className="mt-6 text-left">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Activities</h3>
          <ul className="space-y-2">
            <li className="text-white">• Purchased Football Ticket - Oct 20, 2024</li>
            <li className="text-white">• Updated Profile Information - Oct 15, 2024</li>
            <li className="text-white">• Bought Football Jersey - Oct 1, 2024</li>
          </ul>
        </div>

        {/* Edit Profile Button */}
        <button className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
