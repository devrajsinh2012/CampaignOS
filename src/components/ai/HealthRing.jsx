import React, { useMemo } from 'react';
import { getScoreColor } from '../../lib/utils';

/**
 * Animated ring gauge for health score display.
 */
export default function HealthRing({ score, size = 120, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = score != null ? (score / 100) * circumference : 0;
  const offset = circumference - progress;
  const colorClass = getScoreColor(score || 0);

  const strokeColor = useMemo(() => {
    if (score >= 81) return '#2dd4a8';
    if (score >= 61) return '#00C896';
    if (score >= 31) return '#F59E0B';
    return '#EF4444';
  }, [score]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(51, 65, 85, 0.5)"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 1s ease-out',
            filter: `drop-shadow(0 0 6px ${strokeColor}40)`,
          }}
        />
      </svg>
      {/* Score text */}
      <div className="absolute flex flex-col items-center">
        <span className={`font-display font-bold text-2xl ${colorClass}`}>
          {score != null ? score : '—'}
        </span>
        <span className="text-slate-500 text-xs font-mono">/100</span>
      </div>
    </div>
  );
}
