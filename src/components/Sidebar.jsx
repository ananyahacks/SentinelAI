import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  UploadCloud,
  ShieldAlert,
  Radar,
  BellRing,
  FileBarChart2,
  Users,
  Settings,
  Search
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const adminLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/upload', label: 'Upload Activity Logs', icon: UploadCloud },
  { to: '/risk-analysis', label: 'Risk Analysis', icon: ShieldAlert },
  { to: '/anomalies', label: 'Anomalies', icon: Radar },
  { to: '/alerts', label: 'Alerts', icon: BellRing },
  { to: '/reports', label: 'Reports', icon: FileBarChart2 },
  { to: '/users', label: 'Manage Users', icon: Users },
  { to: '/settings', label: 'Settings', icon: Settings }
]

const analystLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/anomalies', label: 'Anomalies', icon: Radar },
  { to: '/risk-analysis', label: 'Investigate Users', icon: ShieldAlert },
  { to: '/alerts', label: 'Alerts', icon: BellRing },
  { to: '/reports', label: 'Reports', icon: FileBarChart2 }
]

export default function Sidebar() {
  const { user } = useAuth()
  const links = user?.role === 'security_analyst' ? analystLinks : adminLinks

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-2 border-r border-hairline bg-surface">
      <div className="flex items-center gap-3.5 px-6 h-16 border-b border-hairline">
        <div className="w-8 h-8 rounded-lg bg-elevated2 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M4 13 L8 13 L10 8 L13 17 L15 13 L20 13" stroke="#4df1db" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="font-display font-bold text-ink tracking-tight text-[23px]">Sentinel<span className="text-signal">AI</span></span>
      </div>

      <div className="px-4 pt-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-elevated border border-hairline text-white">
          <Search size={14} />
          <span className="text-sm">Quick search…</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 pb-2 text-[17px] togglecase tracking-wider text-white font-bold">
          {user?.role === 'security_analyst' ? 'Analyst workspace' : 'Admin workspace'}
        </p>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-elevated2 text-ink border border-hairline'
                  : 'text-white hover:text-ink hover:bg-elevated'
              }`
            }
          >
            <Icon size={20} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-hairline">
        <div className="rounded-xl bg-elevated border border-hairline p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-signal animate-pulseLine" />
            <span className="text-[11px] font-mono text-white">Model live</span>
          </div>
          <p className="text-[11px] text-muted leading-relaxed">Baselines refreshed 6 min ago across 224 monitored identities.</p>
        </div>
      </div>
    </aside>
  )
}
