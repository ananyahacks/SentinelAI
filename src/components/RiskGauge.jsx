const tierColor = (score) => {
  if (score >= 80) return '#f94355'
  if (score >= 60) return '#e47d54'
  if (score >= 35) return '#f0b94d'
  return '#4fea9c'
}

// Recurring signature element: a radial "risk dial" instead of a plain bar.
// size in px, score 0-100.
export default function RiskGauge({ score, size = 120, label, strokeWidth = 5 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.max(0, Math.min(100, score))
  const offset = circumference - (pct / 100) * circumference
  const color = tierColor(pct)

  return (
    <div className="relative flex flex-col items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1b2737"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.7s ease, stroke 0.5s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-2 overflow-visible">
        <span className="font-sans font-bold text-lg text-ink">
          {Math.round(pct)}
        </span>
        {label && <span className="mt-1 whitespace-nowrap text-[9px] font-sans uppercase tracking-[0.18em] text-white">{label}</span>}
      </div>
    </div>
  )
}
