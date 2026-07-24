import React from 'react';
import {
  Mic,
  MicOff,
  PhoneOff,
  Video,
  Plus,
  MessageSquare,
  User,
} from 'lucide-react';

const participants = [
  { name: 'Freda', muted: true },
  { name: 'Barbara', muted: true },
  { name: 'Linnea', muted: true },
  { name: 'Richard', muted: false },
];

const VideoCall = () => {
  //volume position state
  // const [volumePosition, setVolumePosition] = React.useState(12);

  //handle drag event for volume control

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-semibold text-lg">
            2023 Stock Conference Meeting
          </h2>
          <p className="text-sm text-gray-500">Thursday, 19 January 2023</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            <Plus size={16} />
            Add Participants
          </button>
          <button className="w-9 h-9 border rounded-lg flex items-center justify-center">
            <MessageSquare size={16} />
          </button>
          <button className="w-9 h-9 border rounded-lg flex items-center justify-center">
            <User size={16} />
          </button>
        </div>
      </div>

      {/* Main Video */}
      <div className="relative bg-gray-300 rounded-xl h-[360px] md:h-[420px] flex items-center justify-center mb-4">
        <span className="text-gray-400 text-5xl font-semibold">830 × 504</span>

        {/* Timer */}
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/70 px-3 py-1 rounded-full text-sm">
          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          40:12
        </div>

        {/* Volume bar (left) */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
          <div className="w-4 h-24 bg-white rounded-full relative overflow-hidden">
            <div
              className={`w-4 h-4 rounded-full bg-blue-700 cursor-pointer absolute left-0 right-0 mx-auto bottom-0`}
            />
          </div>
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <Mic size={14} className="text-gray-600" />
          </div>
        </div>
      </div>

      {/* Participants */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {participants.map((p, i) => (
          <div
            key={i}
            className="relative bg-gray-300 rounded-xl h-[180px] flex items-center justify-center"
          >
            <span className="text-gray-400 text-2xl">300 × 300</span>

            {/* Name */}
            <span className="absolute bottom-3 left-3 bg-white px-3 py-1 rounded-full text-xs">
              {p.name}
            </span>

            {/* Mic status */}
            <div className="absolute bottom-3 right-3 w-7 h-7 bg-white rounded-full flex items-center justify-center">
              {p.muted ? (
                <MicOff size={14} className="text-red-500" />
              ) : (
                <Mic size={14} className="text-green-600" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Call Controls */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <ControlButton>
          <Mic size={18} />
        </ControlButton>

        <button className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg">
          <PhoneOff size={22} />
        </button>

        <ControlButton>
          <Video size={18} />
        </ControlButton>
      </div>
    </div>
  );
};

export default VideoCall;

/* ---------- Reusable Control Button ---------- */
function ControlButton({ children }) {
  return (
    <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow hover:bg-gray-100 transition">
      {children}
    </button>
  );
}
