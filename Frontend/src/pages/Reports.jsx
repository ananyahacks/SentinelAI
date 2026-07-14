import { useState } from 'react'
import { FileBarChart2, Download, Loader2, Plus } from 'lucide-react'
import { reports as initialReports } from '../data/mockData.js'

const REPORT_TYPES = ['Weekly Digest', 'Departmental', 'Incident Report', 'Compliance']

export default function Reports() {
  const [reports, setReports] = useState(initialReports)
  const [generating, setGenerating] = useState(false)
  const [type, setType] = useState(REPORT_TYPES[0])
  const user = JSON.parse(localStorage.getItem('sentinelai_user'))
  const isSecurityAnalyst = user?.role === 'security_analyst'
  console.log(user)
  console.log(user?.role)
  console.log(isSecurityAnalyst)

  const generate = async () => {
    setGenerating(true)
    // Replace with: await axiosClient.post('/reports/generate', { type })
    await new Promise((r) => setTimeout(r, 1200))
    const newReport = {
      id: `R-${Math.floor(Math.random() * 900 + 100)}`,
      name: `${type} — ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`,
      type,
      generated: new Date().toISOString().slice(0, 10),
      size: `${(Math.random() * 1.5 + 0.4).toFixed(1)} MB`
    }
    setReports((prev) => [newReport, ...prev])
    setGenerating(false)
  }

  return (
    <div className="space-y-6">
      {isSecurityAnalyst && (
      <div className="card p-6 flex flex-col sm:flex-row sm:items-end gap-4">
         <div className="flex-1">
           <h3 className="font-display font-semibold text-ink mb-1">
               Generate a new report
            </h3>

              <p className="text-sm text-muted mb-3">
                  Compile the current risk and anomaly data into a shareable document.
              </p>

          <select
               value={type}
               onChange={(e) => setType(e.target.value)}
                className="w-full sm:w-64 bg-elevated border border-hairline rounded-lg px-3.5 py-2.5 text-sm text-ink focus:border-signal transition-colors"
            >
               {REPORT_TYPES.map((t) => (
                 <option key={t}>{t}</option>
              ))}
          </select>
    </div>

    <button
      onClick={generate}
      disabled={generating}
      className="flex items-center gap-2 bg-signal text-void font-semibold text-sm rounded-lg px-5 py-2.5 hover:bg-signal-dim transition-colors disabled:opacity-60"
    >
      {generating ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Plus size={16} />
      )}

      {generating ? 'Generating…' : 'Generate report'}
    </button>
  </div>
)}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-hairline text-left">
              <th className="px-5 py-3 text-xs font-medium text-grey uppercase tracking-wide">Report</th>
              <th className="px-5 py-3 text-xs font-medium text-grey uppercase tracking-wide hidden sm:table-cell">Type</th>
              <th className="px-5 py-3 text-xs font-medium text-grey uppercase tracking-wide hidden md:table-cell">Generated</th>
              <th className="px-5 py-3 text-xs font-medium text-grey uppercase tracking-wide hidden md:table-cell">Size</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id} className="border-b border-hairline last:border-0 hover:bg-elevated transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-elevated2 flex items-center justify-center shrink-0">
                      <FileBarChart2 size={14} className="text-signal" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-ink font-medium truncate">{r.name}</p>
                      <p className="text-xs text-faint font-mono">{r.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-muted hidden sm:table-cell">{r.type}</td>
                <td className="px-5 py-3.5 text-muted font-mono hidden md:table-cell">{r.generated}</td>
                <td className="px-5 py-3.5 text-muted font-mono hidden md:table-cell">{r.size}</td>
                <td className="px-5 py-3.5 text-right">
                  <button className="inline-flex items-center gap-1.5 text-xs font-medium text-signal hover:underline">
                    <Download size={13} /> Export
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
