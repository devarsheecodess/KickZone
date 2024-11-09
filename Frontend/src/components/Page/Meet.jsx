import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const Meet = () => {
  const [stream, setStream] = useState(null);
  const [peers, setPeers] = useState([]);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [roomId, setRoomId] = useState(""); // State for room ID
  const [joined, setJoined] = useState(false); // Whether user has joined the call
  const [availableRooms, setAvailableRooms] = useState([
    "Room 1",
    "Room 2",
    "Room 3",
    "Room 4"
  ]);

  const socket = io("http://localhost:3000");

  useEffect(() => {
    if (joined) {
      async function init() {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setStream(mediaStream);

        socket.emit("join-room", roomId);

        socket.on("user-connected", (userId) => {
          const peer = createPeer(userId, socket.id, mediaStream);
          setPeers((prevPeers) => [...prevPeers, peer]);
        });

        socket.on("user-disconnected", (userId) => {
          setPeers((prevPeers) => prevPeers.filter((peer) => peer.id !== userId));
        });
      }

      init();

      return () => {
        socket.disconnect();
      };
    }
  }, [joined, roomId]);

  function createPeer(userId, socketId, stream) {
    // Logic for creating peer connection (use peerjs or simple-peer)
  }

  function toggleAudio() {
    setMuted((prev) => !prev);
    stream.getAudioTracks()[0].enabled = !muted;
  }

  function toggleVideo() {
    setVideoOff((prev) => !prev);
    stream.getVideoTracks()[0].enabled = !videoOff;
  }

  function endCall() {
    socket.emit("leave-room", roomId);
    stream.getTracks().forEach((track) => track.stop());
    setStream(null);
    setPeers([]);
    setJoined(false); // User has left the call
  }

  function joinRoom(selectedRoom) {
    setRoomId(selectedRoom);
    setJoined(true);
  }

  return (
    <div className=" absolute inset-0 -z-20 w-full min-h-screen bg-transparent bg-[radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] flex flex-col items-center p-4">
      {/* Room Join Section (when not joined) */}
      {!joined && (
        <div className="flex flex-col items-center justify-center space-y-4 mt-16">
          <div className="text-lg font-semibold text-gray-300 mb-4">
            Choose a room to join:
          </div>
          <div className="space-y-4 flex flex-col gap-10 items-center">
            {availableRooms.map((room, index) => (
              <button
                key={index}
                onClick={() => joinRoom(room)}
                className="bg-blue-600 text-white p-6 w-72 rounded-lg shadow-xl hover:bg-blue-700 transform hover:scale-105 hover:shadow-2xl focus:outline-none transition-all duration-300 ease-in-out"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{room}</span>
                  <i className="fas fa-arrow-right text-xl"></i>
                </div>
              </button>
            ))}
          </div>

        </div>
      )}

      {/* Video Grid (only visible after joining) */}
      {joined && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 w-full">
            {/* Display Local Video */}
            <div className="relative bg-black rounded-lg border-4 border-blue-500 overflow-hidden">
              <video
                ref={(ref) => {
                  if (ref && stream) {
                    ref.srcObject = stream;
                  }
                }}
                autoPlay
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 text-white bg-blue-500 p-2 rounded-full text-sm">
                You
              </div>
            </div>

            {/* Display Remote Videos */}
            {peers.map((peer) => (
              <div
                key={peer.id}
                className="relative bg-black rounded-lg border-4 border-blue-500 overflow-hidden"
              >
                <video
                  ref={(ref) => {
                    if (ref && peer.stream) {
                      ref.srcObject = peer.stream;
                    }
                  }}
                  autoPlay
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 text-white bg-blue-500 p-2 rounded-full text-sm">
                  {peer.id}
                </div>
              </div>
            ))}
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center items-center gap-8 mt-6">
            {/* Mute Audio Button */}
            <button
              onClick={toggleAudio}
              className={`p-4 rounded-full shadow-lg transition duration-200 ${muted ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                }`}
            >
              {muted ? (
                <i className="fas fa-microphone-slash text-white text-2xl"></i>
              ) : (
                <i className="fas fa-microphone text-white text-2xl"></i>
              )}
            </button>

            {/* End Call Button */}
            <button
              onClick={endCall}
              className="p-4 rounded-full shadow-lg bg-red-600 hover:bg-red-700 transition duration-200"
            >
              <i className="fas fa-phone-alt text-white text-2xl"></i>
            </button>

            {/* Toggle Video Button */}
            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full shadow-lg transition duration-200 ${videoOff ? "bg-gray-600 hover:bg-gray-700" : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {videoOff ? (
                <i className="fas fa-video-slash text-white text-2xl"></i>
              ) : (
                <i className="fas fa-video text-white text-2xl"></i>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Meet;
