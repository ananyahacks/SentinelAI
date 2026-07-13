import { useState } from 'react'
import { Check } from 'lucide-react'

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-10 h-6 rounded-full relative transition-colors ${checked ? 'bg-signal' : 'bg-elevated2 border border-hairline'}`}
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-void transition-transform"
        style={{ transform: checked ? 'translateX(16px)' : 'translateX(0)' }}
      />
    </button>
  )
}

export default function Settings() {
  const [sensitivity, setSensitivity] = useState(65)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [slackAlerts, setSlackAlerts] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(true)
  const [autoBaseline, setAutoBaseline] = useState(true)
  const [saved, setSaved] = useState(false)

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="card p-8">
        <h3 className="font-display font-sans text-white mb-1">Detection sensitivity</h3>
        <p className="text-xs text-grey mb-3">Controls how far behavior must drift from baseline before it's flagged as anomalous.</p>
        <div className="flex items-center gap-4">
          <span className="text-xs text-faint w-10">Lenient</span>
          <input
            type="range"
            min={0}
            max={100}
            value={sensitivity}
            onChange={(e) => setSensitivity(Number(e.target.value))}
            className="flex-1 accent-signal-dim"
          />
          <span className="text-xs text-faint w-10 text-right">Strict</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-muted">Current threshold</span>
          <span className="font-sans text-sm text-signal font-semibold">{sensitivity}%</span>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-display font-sans text-ink mb-1">Notification channels</h3>
        <p className="text-xs text-muted mb-5">Choose how your team is notified when new risk alerts are generated.</p>
        <div className="space-y-4">
          {[
            ['Email alerts', 'Send critical and high severity alerts to registered emails', emailAlerts, setEmailAlerts],
            ['Slack integration', 'Post alerts to your #security-ops channel in real time', slackAlerts, setSlackAlerts],
            ['Weekly digest', 'Summarized risk report sent every Monday morning', weeklyDigest, setWeeklyDigest],
            ['Auto-refresh baselines', 'Retrain behavior baselines automatically every 24 hours', autoBaseline, setAutoBaseline]
          ].map(([label, desc, val, setter]) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-hairline last:border-0">
              <div>
                <p className="text-sm text-ink font-sans">{label}</p>
                <p className="text-xs text-muted">{desc}</p>
              </div>
              <Toggle checked={val} onChange={setter} />
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-display font-sans text-grey mb-2">Data retention</h3>
        <p className="text-xs text-muted mb-4">How long raw activity logs and anomaly records are stored.</p>
        <select className="w-full sm:w-64 bg-elevated border border-dashed rounded-lg px-3.5 py-1.5 text-sm text-ink focus:border-signal transition-colors">
          <option>45 days</option>
          <option>90 days</option>
          <option>180 days</option>
          <option>1 year</option>
          <option>Indefinite </option>
        </select>
      </div>

      <button
        onClick={save}
        className="flex items-center gap-2 bg-[#0D9488] text-white font-sans text-sm rounded-lg px-5 py-3 hover:bg-[#0F766E] transition-colors"
      >
        {saved ? <><Check size={14} /> Saved</> : 'Save changes'}
      </button>
    </div>
  )
}
