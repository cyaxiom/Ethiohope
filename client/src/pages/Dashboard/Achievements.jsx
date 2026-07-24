import React from 'react';

import { DS } from '@/constants/designSystem';
import { ArrowRight, Lock, MessageCircle } from 'lucide-react';

function AchievementBadge({ image, label, locked = false }) {
  return (
    <div className="relative w-24 h-24 md:w-32 md:h-32">
      {/* OUTER HEX — frame */}
      <div
        className="absolute inset-0 bg-slate-800 shadow-xl"
        style={{
          clipPath:
            'polygon(0% 25%, 50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%)',
        }}
      />

      {/* MIDDLE HEX — accent ring */}
      <div
        className="absolute inset-[6px] bg-amber-500/90"
        style={{
          clipPath:
            'polygon(0% 25%, 50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%)',
        }}
      />

      {/* INNER HEX — content */}
      <div
        className="absolute inset-[10px] bg-slate-900 flex items-center justify-center overflow-hidden"
        style={{
          clipPath:
            'polygon(0% 25%, 50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%)',
        }}
      >
        {!locked && image && (
          <img
            src={image}
            alt={label || 'Achievement'}
            className="w-full h-full object-contain"
          />
        )}

        {locked && (
          <div className="relative flex items-center justify-center w-full h-full text-gray-400 z-50">
            <Lock className="w-12 h-12 fill-gray-400 z-0" />
            <span className="absolute text-5xl font-bold opacity-90 z-10 text-white">
              ?
            </span>
          </div>
        )}
      </div>

      {/* LABEL / RIBBON */}
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-[88%]">
        {/* Underside */}
        <div
          className="absolute inset-0 translate-y-1 bg-black/40 shadow-lg"
          style={{
            clipPath: 'polygon(0% 0%,100% 0%,90% 60%,50% 100%,10% 60%)',
          }}
        />

        {/* Front */}
        <div
          className="relative bg-black/90 text-slate-100 text-[9px] md:text-xs font-semibold tracking-wide text-center py-1 px-2 shadow-md"
          style={{
            clipPath: 'polygon(0% 0%,100% 0%,90% 60%,50% 100%,10% 60%)',
          }}
        >
          {label || 'Solidity 101 Course'}
        </div>
      </div>
    </div>
  );
}

function PinnedAchievement() {
  return (
    <div className={DS.cards.standard}>
      <h2 className={`${DS.typography.h5} mb-4`}>Pinned achievements</h2>

      <div className="flex items-center gap-6">
        <AchievementBadge image="/solidity.webp" locked={false} />

        <div>
          <p className="font-semibold">Solidity Smart Contract Development</p>
          <p className="text-sm text-muted-foreground">Completed: 03/11/2024</p>
        </div>
      </div>
    </div>
  );
}

function CourseProgressCard({ title, progress = 0, completed = false }) {
  return (
    <div className="min-w-[180px] flex flex-col items-center gap-4">
      <AchievementBadge
        image={completed ? '/solidity.png' : undefined}
        locked={!completed && progress === 0}
      />

      <p className="text-sm font-semibold text-center">{title}</p>

      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {progress > 0 && (
        <span className="text-xs text-muted-foreground">{progress}%</span>
      )}
    </div>
  );
}

function StreakBadge({ days, progress }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <AchievementBadge locked size="sm" />

      <p className="text-sm font-semibold">{days} day streak</p>

      <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
      </div>

      <span className="text-xs text-muted-foreground">{progress}%</span>
    </div>
  );
}

function AchievementSection({ title, subtitle, action, children }) {
  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold">{title}</h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {action && (
          <button className="text-sm text-primary hover:underline">
            {action} →
          </button>
        )}
      </div>

      {children}
    </section>
  );
}

function Achievements() {
  const breadcrumbs = [
    { label: 'My profile', href: '/dashboard/profile' },
    { label: 'Achievements', href: '/dashboard/achievements' },
  ];

  return (
    <div className={`${DS.containers.xlPadded} space-y-12 pt-30`}>
      {/* Header */}
      <div>
        <p className="text-md text-muted-foreground mb-2">
          {breadcrumbs.map((bc, idx) => (
            <span key={bc.href}>
              <a href={bc.href} className="hover:underline">
                {bc.label}
              </a>
              {idx < breadcrumbs.length - 1 && (
                <ArrowRight className="inline mx-2 h-4 w-4" />
              )}
            </span>
          ))}
        </p>
        <h1 className={`${DS.typography.h2}`}>Achievements</h1>
      </div>

      {/* Pinned */}
      <PinnedAchievement />

      {/* Completed Courses */}
      <AchievementSection
        title="Completed courses"
        subtitle="1 of 23 unlocked"
        action="View All"
      >
        <div className="flex gap-10 overflow-x-auto pb-4">
          <CourseProgressCard
            title="Solidity Smart Contract Development"
            completed
            progress={100}
          />
          <CourseProgressCard title="Uniswap V3" />
          <CourseProgressCard title="Formal Verification" />
          <CourseProgressCard title="Blockchain Basics" progress={38} />
          <CourseProgressCard title="Noir & ZK Circuits" />
        </div>
      </AchievementSection>

      {/* Other Badges */}
      <AchievementSection
        title="Other badges"
        subtitle="0 of 8 unlocked"
        action="View All"
      >
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {[7, 10, 20, 30, 50].map((days) => (
            <StreakBadge key={days} days={days} progress={0} />
          ))}
        </div>
      </AchievementSection>
      {/*//TODO feedback button,  Should be placed in layout later on*/}
      <button
        className={`${DS.buttons.base} ${DS.buttons.variants.primary} ${DS.buttons.sizes.md} self-start mt-6
       fixed
       bottom-12
       right-12
      `}
      >
        <MessageCircle className="w-6 h-6 mr-4" />
        Give us feedback
      </button>
    </div>
  );
}

export default Achievements;
