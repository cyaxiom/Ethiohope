import React from 'react';

import { DS } from '@/constants/designSystem';
import { ArrowRight, Info, Share } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useTheme } from '@provider/ThemeProvider/ThemeProvider';

function ProfileHeader() {
  return (
    <div className="relative">
      {/* Cover */}
      <div className="h-52 md:h-70 rounded-2xl overflow-hidden">
        <div className="h-full w-full bg-gradient-to-r from-pink-300 via-pink-200 to-orange-100" />
      </div>

      {/* Content */}
      <div
        className={`${DS.containers.xlPadded} -mt-16 flex flex-col md:flex-row items-center md:justify-between gap-6`}
      >
        {/* Avatar + Info */}
        <div className="flex flex-col items-center gap-4">
          <img
            src="/LittleCoder.png"
            alt="Profile"
            className="w-38 h-38 rounded-full border-4 border-background object-cover shadow-lg"
          />

          <div>
            <h1 className={`${DS.typography.h3}`}>Jeremiah A</h1>
            <p className={`${DS.typography.caption}`}>
              @etabebe1 · Joined October 2024
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col w-full md:w-auto  md:flex-row gap-3">
          <button
            className={`${DS.buttons.base} ${DS.buttons.variants.secondary} ${DS.buttons.sizes.sm} flex items-center gap-2 justify-center md:justify-start`}
          >
            Share
            <Share className="w-4 h-4" />
          </button>
          <button className={`${DS.buttons.primaryMd}`}>Edit Profile</button>
        </div>
      </div>
    </div>
  );
}

function StatBadge({ label, value, variant = 'info' }) {
  const colorMap = {
    error: 'border-error text-error',
    warning: 'border-warning text-warning',
    info: 'border-info text-info',
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${colorMap[variant]}`}
    >
      {label} {value}
    </span>
  );
}

function LevelingCard() {
  return (
    <div className={`${DS.cards.standard}`}>
      <h3 className={`${DS.typography.h5} mb-4`}>Leveling</h3>
      <div className="flex justify-between">
        {/* CodeHawks */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center font-bold">
            🦅
          </div>
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            <div className="flex-1">
              <p className="font-semibold">CodeHawks</p>
              <p className="text-sm text-muted-foreground">
                Earnings <span className="font-semibold">$0 USDC</span>
              </p>
            </div>

            {/* Ranking */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-1">Ranking</p>
              <p className="font-semibold">Unranked</p>
            </div>
            {/* Findings */}
            <div className="">
              <p className="text-sm text-muted-foreground mb-1">
                Total Findings
              </p>
              <div className="flex items-center gap-2">
                <StatBadge label="High" value={0} variant="error" />
                <StatBadge label="Med" value={0} variant="warning" />
                <StatBadge label="Low" value={0} variant="info" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses */}
      <div className="mt-6 flex items-center gap-4 ">
        <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center font-bold">
          🦅
        </div>
        <div className="">
          <p className="font-semibold mb-2">Updraft</p>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full w-[4%] bg-primary rounded-full" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            1 / 23 courses completed
          </p>
        </div>
      </div>
    </div>
  );
}

function AchievementsCard() {
  const navigate = useNavigate();
  return (
    <div className={`${DS.cards.standard} flex flex-col justify-between`}>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`${DS.typography.h5} mb-2`}>Achievements</h3>
          <Info className="h-6 w-6" />
        </div>
        <p className={`${DS.typography.caption}`}>
          You have no pinned achievements.
        </p>
        <p className={`${DS.typography.caption}`}>
          Pin an achievement to get started.
        </p>
      </div>

      <button
        onClick={() => navigate('/dashboard/achievements')}
        className={`${DS.buttons.base} ${DS.buttons.variants.ghost} ${DS.buttons.sizes.sm} self-start mt-6`}
      >
        View all achievements <ArrowRight className="h-6 w-6 ml-4" />
      </button>
    </div>
  );
}

function Profile() {
  const { theme } = useTheme();

  return (
    <div
      className={`space-y-10 min-h-screen ${
        theme === 'dark' ? 'bg-black' : 'bg-light'
      }`}
    >
      <ProfileHeader />

      <section className={`${DS.containers.xlPadded}`}>
        <div className={`${DS.grids.cards2} gap-6`}>
          <LevelingCard />
          <AchievementsCard />
        </div>
      </section>
    </div>
  );
}

export default Profile;
