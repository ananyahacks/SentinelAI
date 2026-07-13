import { useState } from 'react'
import { Bell, ChevronDown, LogOut, Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { alerts } from '../data/mockData.js'

export default function Topbar({ title, subtitle, onMenuClick }) {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const unread = alerts.filter((a) => !a.read).length

  return (
    <header className="sticky top-2 z-20 h-16 border-b border-hairline bg-void/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden text-white hover:text-ink">
          <Menu size={25} />
        </button>
        <div>
          <h1 className="font-display text-lg font-semibold text-ink leading-tight">{title}</h1>
          {subtitle && <p className="text-xs text-grey">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative w-9 h-9 rounded-lg border border-hairline bg-elevated flex items-center justify-center text-white hover:text-ink transition-colors">
          <Bell size={16} />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-risk-critical text-[10px] flex items-center justify-center text-void font-semibold">
              {unread}
            </span>
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-lg border border-hairline bg-elevated hover:bg-elevated2 transition-colors"
          >
            <div className="w-7 h-7 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-[14px] font-semibold text-void">
              {user?.initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-medium text-bold leading-tight">{user?.name}</p>
              <p className="text-[10px] text-bold leading-tight">{user?.role === 'security_analyst' ? 'Security Analyst' : 'Company Admin'}</p>
            </div>
            <ChevronDown size={14} className="text-white" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-52 card shadow-panel p-1.5 animate-floatIn">
              <div className="px-3 py-2 border-b border-hairline mb-1">
                <p className="text-xs text-ink font-medium">{user?.company}</p>
                <p className="text-[11px] text-white">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-risk-critical hover:bg-risk-critical/10 transition-colours"
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
