// The brand signature: a behavioral "waveform" line that spikes like a live
// anomaly reading. Used on auth screens and as a quiet motif in the topbar.
export default function SignalWave({ className = '', color = '#6cebda', height = 80 }) {
  return (
    <svg
      viewBox="0 0 600 100"
      preserveAspectRatio="none"
      className={className}
      style={{ height }}
    >
      <polyline
        points="0,50 40,50 55,20 70,80 85,50 140,50 155,30 170,65 185,50 260,50 260,15 300,90 320,50 400,50 415,40 430,60 445,50 520,50 535,25 550,75 565,50 600,50"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.65"
      />
    </svg>
  )
}
