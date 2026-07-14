import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ArrowLeft, Mail, Building2, Clock, AlertTriangle } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import RiskGauge from '../components/RiskGauge.jsx'
import RiskBadge from '../components/RiskBadge.jsx'
import { users, anomalies } from '../data/mockData.js'
import axiosClient from '../api/axiosClient.js'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function InvestigateUser() {
  const { userId } = useParams()
  const [currentUser, setCurrentUser] = useState(null)
  const [userAnoms, setUserAnoms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUserDetail() {
      try {
        const response = await axiosClient.get('/anomaly/scores')
        const allScores = response.data
        
        let found = null
        if (allScores && allScores.length > 0) {
          found = allScores.find(sc => sc.userId === userId || sc.employeeName === userId)
          if (!found) {
            found = allScores.find(sc => sc.employeeName.toLowerCase().replace(/\s+/g, '-') === userId)
          }
        }
        
        if (found) {
          const mappedUser = {
            id: found.userId || userId,
            name: found.employeeName,
            dept: 'Operations',
            role: 'Staff',
            riskScore: Math.round(found.riskScore * 100),
            tier: found.riskLevel === 'CRITICAL' ? 'Critical' : found.riskLevel === 'HIGH' ? 'High' : found.riskLevel === 'MEDIUM' ? 'Medium' : 'Low',
            lastActive: 'Just now',
            anomalies: found.isAnomaly ? 1 : 0,
            trend: [20, 25, 30, found.riskScore * 100]
          }
          setCurrentUser(mappedUser)
          
          if (found.isAnomaly) {
            setUserAnoms([{
              id: `A-${9001}`,
              user: found.employeeName,
              userId: found.userId || userId,
              type: found.riskLevel === 'CRITICAL' ? 'Bulk file download' : 'Off-hours access',
              severity: found.riskLevel === 'CRITICAL' ? 'Critical' : found.riskLevel === 'HIGH' ? 'High' : 'Medium',
              time: new Date(found.analyzedAt).toLocaleString(),
              detail: `${found.employeeName} has anomaly score of ${Math.round(found.riskScore * 100)}`,
              status: 'Open'
            }])
          } else {
            setUserAnoms([])
          }
        } else {
          const mockUser = users.find(u => u.id === userId) || users[0]
          setCurrentUser(mockUser)
          setUserAnoms(anomalies.filter(a => a.userId === mockUser.id))
        }
      } catch (err) {
        console.error('Failed to load user detail, using mock', err)
        const mockUser = users.find(u => u.id === userId) || users[0]
        setCurrentUser(mockUser)
        setUserAnoms(anomalies.filter(a => a.userId === mockUser.id))
      } finally {
        setLoading(false)
      }
    }
    loadUserDetail()
  }, [userId])

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-sm text-grey font-mono animate-pulse">Loading identity profile...</p>
      </div>
    )
  }

  const user = currentUser
  const userAnomalies = userAnoms
  const trendData = user.trend.map((v, i) => ({ day: DAYS[i] || `Day ${i + 1}`, score: v, baseline: Math.round(v * 0.35) }))

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
