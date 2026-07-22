import React from 'react';

interface RankingEntry {
  name: string;
  rank: string;
  avatarSrc?: string;
  isCurrentUser?: boolean;
}

interface RankingCardProps {
  rankings: RankingEntry[];
  className?: string;
}

export const RankingCard: React.FC<RankingCardProps> = ({ rankings, className }) => {
  return (
    <div className={`bg-white rounded-3xl p-6 shadow-sm border border-gray-50 flex flex-col h-full ${className}`}>
      <h2 className="text-lg font-bold text-gray-800 mb-6">My ranking</h2>
      <div className="space-y-4 flex-1">
        {rankings.map((user, idx) => (
          <div 
            key={idx} 
            className={`flex items-center justify-between p-3 rounded-2xl transition-all duration-300 ${user.isCurrentUser ? 'bg-blue-50/50 ring-1 ring-blue-100' : 'hover:bg-gray-50'}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gray-100 to-gray-200 border border-white shadow-sm flex items-center justify-center text-sm font-bold text-gray-500 overflow-hidden">
                {user.avatarSrc ? <img src={user.avatarSrc} alt={user.name} className="w-full h-full object-cover" /> : user.name.charAt(0)}
              </div>
              <p className={`text-sm font-bold ${user.isCurrentUser ? 'text-blue-600' : 'text-gray-700'}`}>
                {user.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
               {user.isCurrentUser && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
               <span className={`text-sm font-black ${user.isCurrentUser ? 'text-blue-600' : 'text-gray-400'}`}>
                {user.rank}
              </span>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 text-blue-500 text-sm font-bold hover:text-blue-600 transition-all text-center w-full py-2 hover:bg-blue-50 rounded-xl">
        View All
      </button>
    </div>
  );
};

export default RankingCard;
