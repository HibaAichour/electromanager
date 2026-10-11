import { LucideIcon } from "lucide-react";
import { useTiltEffect } from "../hooks/useTiltEffect";
import { useCountUp } from "../hooks/useCountUp";
import { useEffect, useState } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  trend?: string;
  neonColor?: 'blue' | 'purple' | 'indigo';
}

export function StatsCard({ title, value, icon: Icon, color, trend, neonColor = 'blue' }: StatsCardProps) {
  const { elementRef, transform } = useTiltEffect({ maxTilt: 10, scale: 1.02 });
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'number' ? value : parseFloat(value.toString().replace(/[^0-9.-]/g, '')) || 0;
  const { count } = useCountUp(numericValue, 2000);

  useEffect(() => {
    setDisplayValue(count);
  }, [count]);

  const getNeonClass = () => {
    switch (neonColor) {
      case 'purple': return 'neon-glow-purple';
      case 'indigo': return 'neon-glow-indigo';
      default: return 'neon-glow-blue';
    }
  };

  const formatValue = (val: number) => {
    if (typeof value === 'string' && value.includes('€')) {
      return `${val.toLocaleString()}€`;
    }
    if (typeof value === 'string' && value.includes(',')) {
      return val.toLocaleString();
    }
    return val.toString();
  };

  return (
    <div
      ref={elementRef}
      className="glass stats-card card-3d p-6 cursor-pointer border border-white/20"
      style={{ transform }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-300 text-sm mb-2 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
            {title}
          </p>
          <p className="text-3xl font-bold text-white count-up font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
            {formatValue(displayValue)}
          </p>
          {trend && (
            <p className="text-sm text-green-400 mt-2 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
              {trend}
            </p>
          )}
        </div>
        <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center ${getNeonClass()}`}>
          <Icon size={28} className="text-white" />
        </div>
      </div>
    </div>
  );
}
