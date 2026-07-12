import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, X, ExternalLink } from 'lucide-react'
import RiskBadge from '../components/RiskBadge.jsx'
import { anomalies as allAnomalies } from '../data/mockData.js'

const STATUS_STYLES = {
  Open: 'text-risk-critical',
  Investigating: 'text-risk-medium',
  Resolved: 'text-signal'
}

export default function Anomalies() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    return allAnomalies.filter((a) =>
      (status === 'All' || a.status === status) &&
      (a.user.toLowerCase().includes(query.toLowerCase()) || a.type.toLowerCase().includes(query.toLowerCase()))
    )
  }, [query, status])

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-grey" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anomalies…"
            className="w-full bg-elevated border border-hairline rounded-lg pl-9 pr-3 py-2.5 text-sm text-ink placeholder:text-grey focus:border-signal transition-colors"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {['All', 'Open', 'Investigating', 'Resolved'].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans border transition-colors ${
                status === s ? 'bg-elevated2 border-signal/40 text-signal' : 'border-hairline text-muted hover:text-ink'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className={`card overflow-hidden ${selected ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hairline text-left">
                <th className="px-5 py-3 text-xs font-medium text-grey togglecase tracking-wide">ID</th>
                <th className="px-5 py-3 text-xs font-medium text-grey togglecase tracking-wide">User</th>
                <th className="px-5 py-3 text-xs font-medium text-grey togglecase tracking-wide">Type</th>
                <th className="px-5 py-3 text-xs font-medium text-grey togglecase tracking-wide">Severity</th>
                <th className="px-5 py-3 text-xs font-medium text-grey togglecase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr
                  key={a.id}
                  onClick={() => setSelected(a)}
                  className={`border-b border-hairline last:border-0 hover:bg-elevated transition-colors cursor-pointer ${selected?.id === a.id ? 'bg-elevated' : ''}`}
                >
                  <td className="px-5 py-3.5 font-sans text-xs text-grey">{a.id}</td>
                  <td className="px-5 py-3.5 text-ink font-medium">{a.user}</td>
                  <td className="px-5 py-3.5 text-grey">{a.type}</td>
                  <td className="px-5 py-3.5"><RiskBadge level={a.severity} /></td>
                  <td className={`px-5 py-3.5 font-medium ${STATUS_STYLES[a.status]}`}>{a.status}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-grey text-sm">No anomalies match this filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {selected && (
          <div className="card p-7 animate-floatIn h-fit sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs text-grey">{selected.id}</span>
              <button onClick={() => setSelected(null)} className="text-grey hover:text-ink"><X size={16} /></button>
            </div>
            <h3 className="font-display font-semibold text-ink mb-1">{selected.type}</h3>
            <div className="flex items-center gap-2 mb-4">
              <RiskBadge level={selected.severity} />
              <span className={`text-xs font-medium ${STATUS_STYLES[selected.status]}`}>{selected.status}</span>
            </div>
            <p className="text-sm text-muted leading-relaxed mb-4">{selected.detail}</p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-4 border-t border-hairline">
                <span className="text-grey">User</span>
                <span className="text-ink">{selected.user}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-hairline">
                <span className="text-grey">Detected</span>
                <span className="text-ink font-sans">{selected.time}</span>
              </div>
            </div>
            <Link
              to={`/risk-analysis/${selected.userId}`}
              className="mt-4 flex items-center justify-center gap-1.5 text-xs font-medium text-void bg-signal rounded-lg py-2.5 hover:bg-signal-dim transition-colors"
            >
              Investigate identity <ExternalLink size={14} />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
