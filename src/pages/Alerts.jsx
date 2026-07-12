import { useState } from 'react'
import { BellRing, CheckCheck, Circle } from 'lucide-react'
import RiskBadge from '../components/RiskBadge.jsx'
import { alerts as initialAlerts } from '../data/mockData.js'

export default function Alerts() {
  const [alerts, setAlerts] = useState(initialAlerts)
  const unreadCount = alerts.filter((a) => !a.read).length

  const markRead = (id) => setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)))
  const markAllRead = () => setAlerts((prev) => prev.map((a) => ({ ...a, read: true })))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted">
          <BellRing size={15} className="text-signal" />
          {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
        </div>
        <button onClick={markAllRead} className="flex items-center gap-1.5 text-xs font-medium text-signal hover:underline">
          <CheckCheck size={12} /> Mark all as read
        </button>
      </div>

      <div className="card divide-y divide-hairline">
        {alerts.map((a) => (
          <button
            key={a.id}
            onClick={() => markRead(a.id)}
            className={`w-full flex items-start gap-4 px-5 py-4 text-left hover:bg-elevated transition-colors ${!a.read ? 'bg-elevated/50' : ''}`}
          >
            <div className="mt-1">
              {!a.read ? <Circle size={7} className="fill-signal text-signal" /> : <Circle size={7} className="text-hairline fill-hairline" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className={`text-sm font-medium ${a.read ? 'text-grey' : 'text-ink'}`}>{a.title}</p>
                <RiskBadge level={a.severity} />
              </div>
              <p className="text-xs text-grey mt-1">{a.user} · {a.channel}</p>
            </div>
            <span className="text-xs text-grey font-mono whitespace-nowrap">{a.time}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
