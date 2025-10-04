import { useState } from 'react';
import React from 'react';
const sampleUsers = [
  {
    name: 'Alice Johnson',
    username: 'alice_dev',
    avatar: 'https://i.pravatar.cc/150?img=1',
    reputation: 1200,
    answers: 150,
  },
  {
    name: 'Bob Smith',
    username: 'bob_codes',
    avatar: 'https://i.pravatar.cc/150?img=2',
    reputation: 950,
    answers: 100,
  },
  {
    name: 'Charlie Green',
    username: 'charlie_g',
    avatar: 'https://i.pravatar.cc/150?img=3',
    reputation: 700,
    answers: 80,
  },
  {
    name: 'Diana Prince',
    username: 'diana_p',
    avatar: 'https://i.pravatar.cc/150?img=4',
    reputation: 500,
    answers: 60,
  },
];

export default function Ranking() {
  const [sort, setSort] = useState('reputation');

  const sortedUsers = [...sampleUsers].sort((a, b) => {
    if (sort === 'reputation') return b.reputation - a.reputation;
    if (sort === 'answers') return b.answers - a.answers;
    return 0;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Top Users</h1>

        {/* Sort options */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="reputation">By Reputation</option>
          <option value="answers">By Answers</option>
        </select>
      </div>

      {/* Ranking List */}
      <div className="space-y-4 rounded-xl shadow-md overflow-hidden">
        {sortedUsers.map((user, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 border-b last:border-0"
          >
            {/* Rank Number */}
            <span className="text-lg font-bold  w-8">#{index + 1}</span>

            {/* Avatar */}
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-full border"
            />

            {/* Info */}
            <div className="flex-1">
              <p className="font-mediu">{user.name}</p>
              <p className="text-sm">@{user.username}</p>
            </div>

            {/* Stats */}
            <div className="text-right">
              <p className="text-sm">{user.reputation} rep</p>
              <p className="text-xs">{user.answers} answers</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
