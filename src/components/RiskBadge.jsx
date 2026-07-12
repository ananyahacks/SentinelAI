const styles = {
  Critical:
    'bg-risk-critical/10 text-risk-critical border border-risk-critical/30 rounded-md',

  High:
    'bg-risk-high/10 text-risk-high border border-risk-high/30 rounded-lg',

  Medium:
    'bg-risk-medium/10 text-risk-medium border border-risk-medium/30 rounded-full',

  Low:
    'bg-risk-low/10 text-risk-low border border-risk-low/30 rounded-full',

  Info:
    'bg-violet/10 text-violet border border-violet/30 rounded-lg',
}

export default function RiskBadge({ level }) {
  const cls = styles[level] || styles.Low

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium ${cls}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {level}
    </span>
  )
}