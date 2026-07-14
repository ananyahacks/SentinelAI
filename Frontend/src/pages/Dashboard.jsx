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
  const topRisk = [...users].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5)
  const criticalCount = riskDistribution.find((r) => r.name === 'Critical')?.value ?? 0

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

      {/* KPI row */}
<div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
  {/* Featured card — avg. org risk score, now the visual anchor of the row */}
  <div className="card p-9 flex items-center gap-5 xl:col-span-1">
    <RiskGauge score={55} size={97} strokeWidth={7} />
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Avg. org risk score</p>
      <div className="flex items-baseline gap-2">
        <span className="font-sans text-3xl font-sans text-muted">52</span>
        <span className="text-xs font-sans text-ink">↑ from 38</span>
      </div>
      <p className="text-xs text-muted mt-1">7-day rolling average</p>
    </div>
  </div>

  {/* Remaining three, smaller, stacked beside it */}
  <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-5">
    <StatCard icon={Users} label="Monitored identities" value="224" delta="+12 this week" deltaTone="signal" sublabel="Across 6 departments" />
    <StatCard icon={ShieldAlert} label="Critical risk users" value={criticalCount} delta="+3 vs last week" deltaTone="risk" sublabel="Score ≥ 80" />
    <StatCard icon={Radar} label="Anomalies today" value="17" delta="+5 vs yesterday" deltaTone="risk" sublabel="6 anomaly types tracked" />
  </div>
</div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="card p-6 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold text-ink text-sm">Risk trend (7 days)
              </h3>
              <p className="text-xs text-faint">Average risk score vs. incident count</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={riskTrend}>
              <CartesianGrid stroke="#1E2836" vertical={false} />
              <XAxis dataKey="day" stroke="#5C6980" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#5C6980" fontSize={11} tickLine={false} axisLine={false} width={28} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="avgRisk" name="Avg risk" stroke="#33D6C0" strokeWidth={2} dot={false} activeDot={{r:5}}fill="none" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-7">
          <h3 className="font-display font-semibold text-ink text-sm mb-1">Identity risk distribution</h3>
          <p className="text-xs text-muted mb-4">224 identities by tier</p>
          <ResponsiveContainer width="90%" height={200}>
            <PieChart>
              <Pie data={riskDistribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={78} paddingAngle={3}>
                {riskDistribution.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
         <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2">
          {riskDistribution.map((r) => (
           <div
               key={r.name}
               className="grid grid-cols-[10px_1fr_36px] items-center text-xs"
               >
              <span
                  className="w-1 h-5 rounded-full"
                    style={{ backgroundColor: r.color }}
              />
               <span className="text-muted ml-2">{r.name}</span>
               <span className="text-right font-mono text-ink">
                 {r.value}
                </span>
            </div>
           ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Top risk users */}
        <div className="card p-4 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-ink text-sm">Users requiring attention</h3>
            <Link to="/risk-analysis" className="text-xs text-signal hover:underline">View all</Link>
          </div>
          <div className="space-y-1">
            {topRisk.map((u) => (
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

        {/* Alerts feed */}
          <div className="space-y-4">
              {alerts.slice(0, 5).map((a) => (
               <div key={a.id} className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-14 h-14 shrink-0">
                    <RiskGauge
                    score={a.severity === 'Critical'? 95 : a.severity === 'High'? 74 : a.severity === 'Medium'  ? 49 : 15 } size={52} strokeWidth={4} />
                 </div>

                  <div className="flex-1">
                     <p className="text-sm font-semibold text-ink leading-tight">
                         {a.title}
                    </p>
                       <p className="text-sm text-faint mt-1">
                           {a.user} · {a.time}
                      </p>
              </div>
             </div>
             ))}
           </div>
          </div>

      {/* Anomaly type breakdown */}
      <div className="card p-7">
        <h3 className="font-display font-semibold text-ink text-sm mb-1">Detection categories</h3>
        <p className="text-xs text-white mb-4">Count by detection category</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={anomalies.reduce((acc, a) => {
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
