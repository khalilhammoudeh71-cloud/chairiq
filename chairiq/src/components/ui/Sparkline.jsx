import React, { useId, useMemo } from 'react';

/**
 * Sparkline — tiny SVG trend line with gradient fill, mockup-style.
 * Pass `data` (array of numbers) or a `seed` string to render a
 * deterministic ambient waveform when no real series exists yet.
 */
export default function Sparkline({
  data,
  seed = 'chairiq',
  color = 'var(--accent)',
  width = 120,
  height = 32,
  strokeWidth = 1.5,
  className = '',
}) {
  const gradientId = useId();

  const points = useMemo(() => {
    if (data && data.length > 1) return data;
    // Deterministic pseudo-random waveform from seed
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    const pts = [];
    for (let i = 0; i < 16; i++) {
      h = (h * 1103515245 + 12345) >>> 0;
      const noise = (h % 1000) / 1000;
      pts.push(0.35 + 0.28 * Math.sin(i * 0.7 + (h % 7)) + 0.25 * noise);
    }
    return pts;
  }, [data, seed]);

  const { linePath, areaPath } = useMemo(() => {
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const pad = 3;
    const coords = points.map((v, i) => [
      (i / (points.length - 1)) * width,
      pad + (1 - (v - min) / range) * (height - pad * 2),
    ]);
    const line = coords
      .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
      .join(' ');
    const area = `${line} L${width},${height} L0,${height} Z`;
    return { linePath: line, areaPath: area };
  }, [points, width, height]);

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
