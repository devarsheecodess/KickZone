import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const Meet = () => {
  const [stream, setStream] = useState(null);
  const [peers, setPeers] = useState(new Map());
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [userId] = useState(localStorage.getItem("user") || "user_" + Math.random().toString(36).substr(2, 9));
  const socketRef = useRef();
  const peersRef = useRef(new Map());
  const user = localStorage.getItem("user");
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
  
  const availableRooms = [
    "Room 1",
    "Room 2",
    "Room 3",
    "Room 4",
    "Room 5"
  ];

  useEffect(() => {
    // Store userId in localStorage if not present
    if (!localStorage.getItem("userId")) {
      localStorage.setItem("userId", userId);
    }
  }, [userId]);

  useEffect(() => {
    if (joined) {
      socketRef.current = io(`${SOCKET_URL}/meet`);
      
      async function initializeMedia() {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          setStream(mediaStream);
          
          socketRef.current.emit("joinRoom", roomId, userId, user);
          
          // Handle incoming users
          socketRef.current.on("userJoined", ({ userId: newUserId, participants }) => {
            createPeerConnection(newUserId, mediaStream);
          });

          // Handle user disconnect
          socketRef.current.on("userLeft", ({ userId: leftUserId }) => {
            removePeerConnection(leftUserId);
          });

          // Handle WebRTC signaling
          socketRef.current.on("offer", async ({ offer, userId: fromUserId }) => {
            const pc = createPeerConnection(fromUserId, mediaStream);
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socketRef.current.emit("answer", {
              answer,
              roomId,
              userId: fromUserId
            });
          });

          socketRef.current.on("answer", ({ answer, userId: fromUserId }) => {
            const pc = peersRef.current.get(fromUserId);
            if (pc) {
              pc.setRemoteDescription(new RTCSessionDescription(answer));
            }
          });

          socketRef.current.on("iceCandidate", ({ candidate, userId: fromUserId }) => {
            const pc = peersRef.current.get(fromUserId);
            if (pc) {
              pc.addIceCandidate(new RTCIceCandidate(candidate));
            }
          });
        } catch (err) {
          console.error("Error accessing media devices:", err);
        }
      }

      initializeMedia();

      return () => {
        stream?.getTracks().forEach(track => track.stop());
        socketRef.current?.disconnect();
        peersRef.current.forEach(pc => pc.close());
        peersRef.current.clear();
      };
    }
  }, [joined, roomId, userId]);

  const createPeerConnection = (remoteUserId, mediaStream) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    });

    // Add local tracks to peer connection
    mediaStream.getTracks().forEach(track => {
      pc.addTrack(track, mediaStream);
    });

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("iceCandidate", {
          candidate: event.candidate,
          roomId,
          userId: remoteUserId
        });
      }
    };

    // Handle incoming streams
    pc.ontrack = (event) => {
      setPeers(prevPeers => {
        const newPeers = new Map(prevPeers);
        newPeers.set(remoteUserId, {
          stream: event.streams[0],
          userId: remoteUserId
        });
        return newPeers;
      });
    };

    peersRef.current.set(remoteUserId, pc);

    // Create and send offer if we're the initiator
    if (socketRef.current.id < remoteUserId) {
      pc.createOffer()
        .then(offer => pc.setLocalDescription(offer))
        .then(() => {
          socketRef.current.emit("offer", {
            offer: pc.localDescription,
            roomId,
            userId: remoteUserId
          });
        });
    }

    return pc;
  };

  const removePeerConnection = (userId) => {
    const pc = peersRef.current.get(userId);
    if (pc) {
      pc.close();
      peersRef.current.delete(userId);
      setPeers(prevPeers => {
        const newPeers = new Map(prevPeers);
        newPeers.delete(userId);
        return newPeers;
      });
    }
  };

  function toggleAudio() {
    if (stream) {
      setMuted(prev => !prev);
      stream.getAudioTracks()[0].enabled = muted;
    }
  }

  function toggleVideo() {
    if (stream) {
      setVideoOff(prev => !prev);
      stream.getVideoTracks()[0].enabled = videoOff;
    }
  }

  function endCall() {
    socketRef.current?.emit("leaveRoom", roomId, userId);
    stream?.getTracks().forEach(track => track.stop());
    setStream(null);
    setPeers(new Map());
    setJoined(false);
  }

  function joinRoom(selectedRoom) {
    setRoomId(selectedRoom);
    setJoined(true);
  }

  return (
    <div className="absolute top-0 left-0 -z-20 w-full min-h-screen bg-[radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] flex flex-col items-center p-4">
      {!joined ? (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6">
          <div className="bg-gray-900/60 p-8 rounded-2xl backdrop-blur-lg shadow-2xl max-w-2xl w-[500px]">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Choose a Meeting Room
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableRooms.map((room, index) => (
                <button
                  key={index}
                  onClick={() => joinRoom(room)}
                  className="group relative bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-200 group-hover:text-blue-400 transition-colors">
                      {room}
                    </span>
                    <span className="text-gray-400 group-hover:text-blue-400 transition-colors">
                      →
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
            {/* Local Video */}
            <div className="relative aspect-video bg-gray-900 rounded-xl border-2 border-gray-800 overflow-hidden shadow-xl">
              <video
                ref={ref => {
                  if (ref && stream) {
                    ref.srcObject = stream;
                    ref.play().catch(err => console.error("Error playing local video:", err));
                  }
                }}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-blue-500/80 backdrop-blur-sm text-white text-sm rounded-full">
                You ({userId})
              </div>
            </div>

            {/* Remote Videos */}
            {Array.from(peers.values()).map(peer => (
              <div
                key={peer.userId}
                className="relative aspect-video bg-gray-900 rounded-xl border-2 border-gray-800 overflow-hidden shadow-xl"
              >
                <video
                  ref={ref => {
                    if (ref && peer.stream) {
                      ref.srcObject = peer.stream;
                      ref.play().catch(err => console.error("Error playing remote video:", err));
                    }
                  }}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-3 py-1 bg-blue-500/80 backdrop-blur-sm text-white text-sm rounded-full">
                  {peer.userId}
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 p-4 bg-gray-900/80 backdrop-blur-md rounded-full shadow-xl border border-gray-800">
            <button
              onClick={toggleAudio}
              className={`p-4 rounded-full transition-all duration-300 ${
                muted
                  ? "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                  : "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"
              }`}
            >
              <i className={`fas fa-microphone${muted ? '-slash' : ''} text-xl`} />
            </button>

            <button
              onClick={endCall}
              className="p-4 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500/30 transition-all duration-300"
            >
              <i className="fas fa-phone-alt text-xl" />
            </button>

            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full transition-all duration-300 ${
                videoOff
                  ? "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                  : "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"
              }`}
            >
              <i className={`fas fa-video${videoOff ? '-slash' : ''} text-xl`} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Meet;