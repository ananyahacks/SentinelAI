import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowUpDown, ChevronRight } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line } from 'recharts'
import RiskBadge from '../components/RiskBadge.jsx'
import RiskGauge from '../components/RiskGauge.jsx'
import { users } from '../data/mockData.js'
import axiosClient from '../api/axiosClient.js'

const TIERS = ['All', 'Critical', 'High', 'Medium', 'Low']

export default function RiskAnalysis() {
  const [query, setQuery] = useState('')
  const [tier, setTier] = useState('All')
  const [sortDesc, setSortDesc] = useState(true)
  const [usersList, setUsersList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRiskScores() {
      try {
        const response = await axiosClient.get('/anomaly/scores')
        if (response.data && response.data.length > 0) {
          const mapped = response.data.map((sc, idx) => ({
            id: sc.userId || `U-${1000 + idx}`,
            name: sc.employeeName,
            dept: 'Operations',
            role: 'Staff',
            riskScore: Math.round(sc.riskScore * 100),
            tier: sc.riskLevel === 'CRITICAL' ? 'Critical' : sc.riskLevel === 'HIGH' ? 'High' : sc.riskLevel === 'MEDIUM' ? 'Medium' : 'Low',
            lastActive: 'Active',
            anomalies: sc.isAnomaly ? 1 : 0,
            trend: [20, 25, 30, sc.riskScore * 100]
          }))
          setUsersList(mapped)
        } else {
          setUsersList(users)
        }
      } catch (err) {
        console.error('Failed to load risk scores, using mock users', err)
        setUsersList(users)
      } finally {
        setLoading(false)
      }
    }
    loadRiskScores()
  }, [])

  const filtered = useMemo(() => {
    let list = usersList.filter((u) =>
      (tier === 'All' || u.tier === tier) &&
      (u.name.toLowerCase().includes(query.toLowerCase()) || u.dept.toLowerCase().includes(query.toLowerCase()))
    )
    list = list.sort((a, b) => (sortDesc ? b.riskScore - a.riskScore : a.riskScore - b.riskScore))
    return list
  }, [query, tier, sortDesc, usersList])

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-grey" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or department…"
            className="w-full bg-elevated border border-hairline rounded-lg pl-7 pr-3 py-2.5 text-sm text-white placeholder:text-white focus:border-blue transition-colors"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {TIERS.map((t) => (
            <button
              key={t}
              onClick={() => setTier(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                tier === t ? 'bg-elevated2 border-signal/40 text-signal' : 'border-hairline text-grey hover:text-ink'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-hairline text-left">
              <th className="px-5 py-3 text-xs font-medium text-grey uppercase tracking-wide">Identity</th>
              <th className="px-5 py-3 text-xs font-medium text-grey uppercase tracking-wide hidden md:table-cell">Department</th>
              <th className="px-5 py-3 text-xs font-medium text-grey uppercase tracking-wide hidden lg:table-cell">7-day trend</th>
              <th className="px-5 py-3 text-xs font-medium text-grey uppercase tracking-wide">Tier</th>
              <th className="px-5 py-3 text-xs font-medium text-grey uppercase tracking-wide">
                <button onClick={() => setSortDesc((s) => !s)} className="inline-flex items-center gap-1 hover:text-ink">
                  Risk score 
                </button>
              </th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-hairline last:border-0 hover:bg-elevated transition-colors">
                <td className="px-5 py-3.5">
                  <Link to={`/risk-analysis/${u.id}`} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-elevated2 flex items-center justify-center text-[11px] font-sans text-ink shrink-0">
                      {u.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <p className="text-ink font-medium truncate">{u.name}</p>
                      <p className="text-xs text-grey font-mono">{u.id}</p>
                    </div>
                  </Link>
                </td>
                <td className="px-5 py-3.5 text-grey hidden md:table-cell">{u.dept} · {u.role}</td>
                <td className="px-5 py-3.5 hidden lg:table-cell">
                  <ResponsiveContainer width={90} height={28}>
                    <LineChart data={u.trend.map((v, i) => ({ i, v }))}>
                      <Line type="monotone" dataKey="v" stroke={u.riskScore >= 80 ? '#f52a2a' : u.riskScore >=60 ? '#e77519' : u.riskScore >=35 ? '#f5be0b' : '#38f07c'} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </td>
                <td className="px-5 py-3.5"><RiskBadge level={u.tier} /></td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <RiskGauge score={u.riskScore} size={38} strokeWidth={4} />
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Link to={`/risk-analysis/${u.id}`} className="text-grey hover:text-signal">
                    <ChevronRight size={16} />
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-grey text-sm">No identities match this filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
