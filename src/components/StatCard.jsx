export default function StatCard({ icon: Icon, label, value, delta, deltaTone = 'signal', sublabel }) {
  const toneClasses = {
    signal: 'text-signal',
    risk: 'text-risk-critical',
    muted: 'text-muted'
  }
  return (
    <div className="card p-5 flex flex-col gap-3 animate-floatIn">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted font-sans">{label}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-elevated2 flex items-center justify-center">
            <Icon size={16} className="text-signal" strokeWidth={2} />
          </div>
        )}
      </div>
      <div className="flex items-end gap-2">
        <span className="font-display text-3xl font-sans text-ink">{value}</span>
        {delta && <span className={`text-xs font-mono mb-1 ${toneClasses[deltaTone]}`}>{delta}</span>}
      </div>
      {sublabel && <span className="text-xs text-muted mt-1">{sublabel}</span>}
    </div>
  )
}
