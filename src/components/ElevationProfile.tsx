'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface ElevationProfileProps {
  startElevation: number;
  endElevation: number;
  elevationGain: number;
  elevationLoss: number;
  distanceKm: number;
}

function buildProfile(
  startElev: number,
  endElev: number,
  gain: number,
  loss: number,
  km: number
) {
  const peak = startElev + gain;
  const total = gain + loss;
  // When does the peak occur? Proportional to gain ratio
  const peakRatio = total > 0 ? gain / total : 0.5;
  const peakKm = km * Math.max(0.15, Math.min(0.85, peakRatio * 0.9 + 0.05));

  return [
    { km: 0, elev: startElev },
    { km: +(peakKm * 0.4).toFixed(1), elev: +(startElev + gain * 0.35).toFixed(0) },
    { km: +(peakKm * 0.75).toFixed(1), elev: +(startElev + gain * 0.8).toFixed(0) },
    { km: +peakKm.toFixed(1), elev: +peak.toFixed(0) },
    { km: +(peakKm + (km - peakKm) * 0.35).toFixed(1), elev: +(peak - loss * 0.4).toFixed(0) },
    { km: +(peakKm + (km - peakKm) * 0.7).toFixed(1), elev: +(peak - loss * 0.75).toFixed(0) },
    { km: +km.toFixed(1), elev: +endElev.toFixed(0) },
  ];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-ink border border-white/10 rounded-lg px-3 py-2 text-xs shadow-xl">
        <p className="text-alpenglow font-mono">{payload[0].payload.km} km</p>
        <p className="text-snow font-display text-sm">{payload[0].value} m</p>
      </div>
    );
  }
  return null;
};

export default function ElevationProfile({
  startElevation,
  endElevation,
  elevationGain,
  elevationLoss,
  distanceKm,
}: ElevationProfileProps) {
  const data = buildProfile(startElevation, endElevation, elevationGain, elevationLoss, distanceKm);
  const minElev = Math.min(...data.map((d) => d.elev));
  const maxElev = Math.max(...data.map((d) => d.elev));
  const pad = Math.round((maxElev - minElev) * 0.12) || 50;

  return (
    <div className="w-full h-44 select-none">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D4A574" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#D4A574" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="km"
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'rgba(250,250,247,0.4)', fontSize: 10, fontFamily: 'monospace' }}
            tickFormatter={(v) => `${v} km`}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[minElev - pad, maxElev + pad]}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'rgba(250,250,247,0.4)', fontSize: 10, fontFamily: 'monospace' }}
            tickFormatter={(v) => `${v}m`}
            width={52}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(212,165,116,0.3)', strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="elev"
            stroke="#D4A574"
            strokeWidth={2}
            fill="url(#elevGrad)"
            dot={false}
            activeDot={{ r: 4, fill: '#D4A574', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
