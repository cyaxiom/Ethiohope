import React, { useMemo } from 'react';
import { Globe2 } from 'lucide-react';
import {
  PARENT_TIMEZONE_OPTIONS,
  detectBrowserTimeZone,
  timeZoneLabel,
  timeZoneOffsetLabel,
} from '../../lib/timezone';

interface TimeZonePickerProps {
  value: string;
  onChange: (tz: string) => void;
  /** light = parent dashboard; dark = public enroll modal */
  variant?: 'light' | 'dark';
  className?: string;
  helperText?: string;
  title?: string;
}

export const TimeZonePicker: React.FC<TimeZonePickerProps> = ({
  value,
  onChange,
  variant = 'light',
  className = '',
  helperText,
  title,
}) => {
  const groups = useMemo(() => {
    const map = new Map<string, typeof PARENT_TIMEZONE_OPTIONS>();
    for (const opt of PARENT_TIMEZONE_OPTIONS) {
      if (!map.has(opt.group)) map.set(opt.group, []);
      map.get(opt.group)!.push(opt);
    }
    return Array.from(map.entries());
  }, []);

  const detected = detectBrowserTimeZone();
  const offset = timeZoneOffsetLabel(value || detected);
  const isDark = variant === 'dark';

  return (
    <div
      className={`rounded-2xl border p-4 space-y-3 ${
        isDark ? 'border-white/10 bg-white/[0.03]' : 'border-blue-100 bg-blue-50/40'
      } ${className}`}
    >
      <div className="flex items-start gap-2">
        <Globe2
          className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
        />
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {title || 'Your timezone'}
          </p>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
            {helperText || 'Enter session times in your local time.'}
          </p>
        </div>
      </div>

      <select
        value={value || detected}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/30 ${
          isDark
            ? 'bg-[#070b16] border border-white/10 text-slate-100'
            : 'bg-white border border-gray-200 text-gray-800'
        }`}
      >
        {!PARENT_TIMEZONE_OPTIONS.some((o) => o.value === (value || detected)) && (
          <option value={value || detected}>{value || detected} (detected)</option>
        )}
        {groups.map(([group, opts]) => (
          <optgroup key={group} label={group}>
            {opts.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      <p className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
        Selected: <span className="font-semibold">{timeZoneLabel(value || detected)}</span>
        {offset ? ` · ${offset}` : ''}
      </p>
    </div>
  );
};

export default TimeZonePicker;
