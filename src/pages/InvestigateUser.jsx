import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Mail, Building2, Clock, AlertTriangle } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import RiskGauge from '../components/RiskGauge.jsx'
import RiskBadge from '../components/RiskBadge.jsx'
import { users, anomalies } from '../data/mockData.js'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function InvestigateUser() {
  const { userId } = useParams()
  const user = users.find((u) => u.id === userId) || users[0]
  const userAnomalies = anomalies.filter((a) => a.userId === user.id)
  const trendData = user.trend.map((v, i) => ({ day: DAYS[i], score: v, baseline: Math.round(v * 0.35) }))

  return (
    <div className="space-y-8">
      <Link to="/risk-analysis" className="inline-flex items-center gap-2.5 text-xs text-grey hover:text-ink transition-colors">
        <ArrowLeft size={12} /> Back to risk analysis
      </Link>

      <div className="card p-6 flex flex-col lg:flex-row lg:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-elevated2 flex items-center justify-center text-lg font-semibold text-ink shrink-0">
            {user.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">{user.name}</h2>
            <p className="text-sm text-faint">{user.role} · {user.id}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted">
              <span className="flex items-center gap-1"><Building2 size={11} /> {user.dept}</span>
              <span className="flex items-center gap-1"><Mail size={11} /> {user.name.toLowerCase().replace(' ', '.')}@northbridge.com</span>
              <span className="flex items-center gap-1"><Clock size={11} /> Active {user.lastActive}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 lg:ml-auto">
          <RiskGauge score={user.riskScore} size={95} label="risk score" />
          <div>
            <RiskBadge level={user.tier} />
            <p className="text-xs text-grey mt-2">{user.anomalies} anomalies in 7 days</p>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-display font-semibold text-ink text-sm mb-1">Behavior drift vs. baseline</h3>
        <p className="text-xs text-faint mb-4">Current risk trajectory compared to this user's learned normal range</p>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f4723f" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#f5723f" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1E2836" vertical={false} />
            <XAxis dataKey="day" stroke="#5C6980" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#5C6980" fontSize={11} tickLine={false} axisLine={false} width={28} />
            <Tooltip contentStyle={{ background: '#171F2B', border: '1px solid #26303F', borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="baseline" name="Baseline" stroke="#5C6980" strokeDasharray="4 4" fill="none" strokeWidth={1.5} />
            <Area type="monotone" dataKey="score" name="Risk score" stroke="#FF8A5B" strokeWidth={2} fill="none" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="card p-5">
        <h3 className="font-display font-sans text-white text-lg mb-4">Flagged activity</h3>
        {userAnomalies.length === 0 ? (
          <p className="text-sm text-grey">No anomalies recorded for this identity in the current window.</p>
        ) : (
          <div className="space-y-3">
            {userAnomalies.map((a) => (
              <div key={a.id} className="flex items-start gap-3 p-3.5 rounded-lg bg-elevated border border-hairline">
                <div className="w-8 h-8 rounded-lg bg-elevated2 flex items-center justify-center shrink-0">
                  <AlertTriangle size={14} className="text-risk-high" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm text-ink font-medium">{a.type}</p>
                    <RiskBadge level={a.severity} />
                  </div>
                  <p className="text-xs text-muted mt-1">{a.detail}</p>
                  <p className="text-[11px] text-grey font-sans mt-1">{a.time} · {a.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
