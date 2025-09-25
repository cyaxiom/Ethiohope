import React from 'react';

function KidsProgramming() {
  return (
    <div className="min-h-screen bg-purple-950 text-purple-200 pt-16 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-purple-100 mb-2">Kids Programming</h1>
          <p className="text-sm text-purple-400">
            Learn to code through games, creativity, and fun challenges!
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-purple-900 rounded-lg p-5 shadow-md border border-purple-700">
            <div className="text-3xl mb-3">🎮</div>
            <h3 className="text-lg font-semibold text-purple-100 mb-1">Game-Based Learning</h3>
            <p className="text-sm text-purple-300">
              Learn coding by playing and creating your own games.
            </p>
          </div>

          <div className="bg-purple-900 rounded-lg p-5 shadow-md border border-purple-700">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="text-lg font-semibold text-purple-100 mb-1">Creative Projects</h3>
            <p className="text-sm text-purple-300">
              Build stories, animations, and digital art while coding.
            </p>
          </div>

          <div className="bg-purple-900 rounded-lg p-5 shadow-md border border-purple-700">
            <div className="text-3xl mb-3">👨‍🏫</div>
            <h3 className="text-lg font-semibold text-purple-100 mb-1">Guided Lessons</h3>
            <p className="text-sm text-purple-300">
              Expert instructors to guide and support young learners.
            </p>
          </div>
        </div>

        {/* Programming Languages */}
        <div className="bg-purple-900 rounded-lg p-6 mb-10 border border-purple-700">
          <h2 className="text-xl font-bold text-purple-100 text-center mb-4">Learn These Tools</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl mb-1">🐍</div>
              <p className="text-sm">Python</p>
            </div>
            <div>
              <div className="text-3xl mb-1">🧩</div>
              <p className="text-sm">Scratch</p>
            </div>
            <div>
              <div className="text-3xl mb-1">🌐</div>
              <p className="text-sm">HTML/CSS</p>
            </div>
            <div>
              <div className="text-3xl mb-1">⚡</div>
              <p className="text-sm">JavaScript</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button className="bg-purple-700 hover:bg-purple-600 text-white font-medium px-6 py-2 rounded transition">
            Start Trial
          </button>
        </div>
      </div>
    </div>
  );
}

export default KidsProgramming;
