import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts'
import { Users, ShieldAlert, Radar, TrendingUp, ArrowUpRight } from 'lucide-react'
import StatCard from '../components/StatCard.jsx'
import RiskBadge from '../components/RiskBadge.jsx'
import RiskGauge from '../components/RiskGauge.jsx'
import { riskTrend, riskDistribution, anomalies, alerts, users } from '../data/mockData.js'
import { useAuth } from '../context/AuthContext.jsx'
import axiosClient from '../api/axiosClient.js'

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-elevated2 border border-hairline rounded-lg px-3 py-2 text-xs font-sans shadow-panel">
      <p className="text-white mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color || p.fill }}>{p.name}: {p.value}</p>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    avgRisk: 52,
    monitoredIdentities: 224,
    criticalRiskUsers: 12,
    anomaliesToday: 17
  })
  const [trendData, setTrendData] = useState(riskTrend)
  const [distData, setDistData] = useState(riskDistribution)
  const [topUsers, setTopUsers] = useState([])
  const [recentAlerts, setRecentAlerts] = useState([])
  const [anomList, setAnomList] = useState(anomalies)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const isAdminUser = user?.role === 'company_admin'
        const summaryUrl = isAdminUser ? '/dashboard/admin/summary' : '/dashboard/analyst/summary'
        const summaryRes = await axiosClient.get(summaryUrl)
        
        const riskScoresRes = await axiosClient.get('/anomaly/scores')
        
        const s = summaryRes.data
        if (s && (s.totalUsers > 0 || s.totalLogs > 0 || s.totalAnomalies > 0)) {
          setStats({
            avgRisk: s.avgRisk || 52,
            monitoredIdentities: s.totalUsers ?? 224,
            criticalRiskUsers: s.highRiskUsers ?? 12,
            anomaliesToday: s.totalAnomalies ?? 17
          })
        }

        const scores = riskScoresRes.data
        if (scores && scores.length > 0) {
          const mappedUsers = scores.map((sc, idx) => ({
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
          setTopUsers(mappedUsers.slice(0, 5))
          
          const anomaliesOnly = scores.filter(sc => sc.isAnomaly)
          const mappedAlerts = anomaliesOnly.map((a, idx) => ({
            id: `AL-${4000 + idx}`,
            title: `Critical risk threshold breached`,
            user: a.employeeName,
            severity: a.riskLevel === 'CRITICAL' ? 'Critical' : a.riskLevel === 'HIGH' ? 'High' : 'Medium',
            time: 'Just now',
            read: false,
            channel: 'Risk Engine'
          }))
          setRecentAlerts(mappedAlerts.length > 0 ? mappedAlerts : alerts.slice(0, 5))

          const mappedAnoms = anomaliesOnly.map((a, idx) => ({
            id: `A-${9000 + idx}`,
            user: a.employeeName,
            userId: a.userId,
            type: a.riskLevel === 'CRITICAL' ? 'Bulk file download' : 'Off-hours access',
            severity: a.riskLevel === 'CRITICAL' ? 'Critical' : a.riskLevel === 'HIGH' ? 'High' : 'Medium',
            time: new Date(a.analyzedAt).toLocaleDateString(),
            detail: `${a.employeeName} has anomaly score of ${Math.round(a.riskScore * 100)}`,
            status: 'Open'
          }))
          setAnomList(mappedAnoms.length > 0 ? mappedAnoms : anomalies)
        } else {
          const topRiskMock = [...users].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5)
          setTopUsers(topRiskMock)
          setRecentAlerts(alerts.slice(0, 5))
          setAnomList(anomalies)
        }

        if (isAdminUser) {
          try {
            const trendRes = await axiosClient.get('/dashboard/admin/activity-trend')
            if (trendRes.data && trendRes.data.length > 0) {
              const mappedTrend = trendRes.data.map(t => ({
                day: t._id,
                avgRisk: 50,
                incidents: t.totalActivities
              }))
              setTrendData(mappedTrend)
            }
            
            const distRes = await axiosClient.get('/dashboard/admin/risk-distribution')
            if (distRes.data && distRes.data.length > 0) {
              const colorMap = { 'CRITICAL': '#FF5D6C', 'HIGH': '#FF8A5B', 'MEDIUM': '#F5B942', 'LOW': '#33D6C0' }
              const labelMap = { 'CRITICAL': 'Critical', 'HIGH': 'High', 'MEDIUM': 'Medium', 'LOW': 'Low' }
              const mappedDist = distRes.data.map(d => ({
                name: labelMap[d._id] || d._id,
                value: d.count,
                color: colorMap[d._id] || '#33D6C0'
              }))
              setDistData(mappedDist)
            }
          } catch (e) {
            console.error('Failed to load detailed admin charts, using mock', e)
          }
        }
      } catch (err) {
        console.error('Dashboard load failed, using mock data fallback', err)
        const topRiskMock = [...users].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5)
        setTopUsers(topRiskMock)
        setRecentAlerts(alerts.slice(0, 5))
        setAnomList(anomalies)
      }
    }

    loadDashboard()
  }, [user])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-muted">
          Welcome back, <span className="text-ink font-medium">{user?.name?.split(' ')[0]}</span>. Here's the current risk posture for {user?.company}.
        </p>
        <Link to="/upload" className="inline-flex items-center gap-1.5 text-xs font-medium text-signal border border-signal/30 bg-signal/10 rounded-lg px-3 py-1.5 hover:bg-signal/20 transition-colors">
          Upload new logs <ArrowUpRight size={15} />
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="card p-9 flex items-center gap-5 xl:col-span-1">
          <RiskGauge score={stats.avgRisk} size={97} strokeWidth={7} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Avg. org risk score</p>
            <div className="flex items-baseline gap-2">
              <span className="font-sans text-3xl font-sans text-muted">{stats.avgRisk}</span>
              <span className="text-xs font-sans text-ink">↑ from 38</span>
            </div>
            <p className="text-xs text-muted mt-1">7-day rolling average</p>
          </div>
        </div>

        <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard icon={Users} label="Monitored identities" value={String(stats.monitoredIdentities)} delta="+12 this week" deltaTone="signal" sublabel="Across 6 departments" />
          <StatCard icon={ShieldAlert} label="Critical risk users" value={String(stats.criticalRiskUsers)} delta="+3 vs last week" deltaTone="risk" sublabel="Score ≥ 80" />
          <StatCard icon={Radar} label="Anomalies today" value={String(stats.anomaliesToday)} delta="+5 vs yesterday" deltaTone="risk" sublabel="6 anomaly types tracked" />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="card p-6 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold text-ink text-sm">Risk trend (7 days)</h3>
              <p className="text-xs text-faint">Average risk score vs. incident count</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trendData}>
              <CartesianGrid stroke="#1E2836" vertical={false} />
              <XAxis dataKey="day" stroke="#5C6980" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#5C6980" fontSize={11} tickLine={false} axisLine={false} width={28} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="avgRisk" name="Avg risk" stroke="#33D6C0" strokeWidth={2} dot={false} activeDot={{r:5}} fill="none" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-7">
          <h3 className="font-display font-semibold text-ink text-sm mb-1">Identity risk distribution</h3>
          <p className="text-xs text-muted mb-4">{stats.monitoredIdentities} identities by tier</p>
          <ResponsiveContainer width="90%" height={200}>
            <PieChart>
              <Pie data={distData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={78} paddingAngle={3}>
                {distData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2">
            {distData.map((r) => (
              <div key={r.name} className="grid grid-cols-[10px_1fr_36px] items-center text-xs">
                <span className="w-1 h-5 rounded-full" style={{ backgroundColor: r.color }} />
                <span className="text-muted ml-2">{r.name}</span>
                <span className="text-right font-mono text-ink">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="card p-4 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-ink text-sm">Users requiring attention</h3>
            <Link to="/risk-analysis" className="text-xs text-signal hover:underline">View all</Link>
          </div>
          <div className="space-y-1">
            {topUsers.map((u) => (
              <Link
                to={`/risk-analysis/${u.id}`}
                key={u.id}
                className="flex items-center gap-4 py-2.5 px-2 rounded-lg hover:bg-elevated transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-elevated2 flex items-center justify-center text-xs font-semibold text-ink shrink-0">
                  {u.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-ink font-medium truncate">{u.name}</p>
                  <p className="text-xs text-faint">{u.dept} · {u.role}</p>
                </div>
                <RiskBadge level={u.tier} />
                <span className="font-mono text-sm text-ink w-8 text-right">{u.riskScore}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {recentAlerts.slice(0, 5).map((a) => (
            <div key={a.id} className="flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 shrink-0">
                <RiskGauge
                  score={a.severity === 'Critical' ? 95 : a.severity === 'High' ? 74 : a.severity === 'Medium' ? 49 : 15}
                  size={52}
                  strokeWidth={4}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink leading-tight">{a.title}</p>
                <p className="text-sm text-faint mt-1">{a.user} · {a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-7">
        <h3 className="font-display font-semibold text-ink text-sm mb-1">Detection categories</h3>
        <p className="text-xs text-white mb-4">Count by detection category</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={anomList.reduce((acc, a) => {
            const found = acc.find((x) => x.type === a.type)
            if (found) found.count += 1
            else acc.push({ type: a.type, count: 1 })
            return acc
          }, [])} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid stroke="#98adca" horizontal={false} />
            <XAxis type="number" stroke="#aebed8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="type" stroke="#e9f1fc" fontSize={11} tickLine={false} axisLine={false} width={120} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: '#6d7b90' }} />
            <Bar dataKey="count" name="Anomalies" fill="#6b93e2" radius={[0, 4, 4, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
