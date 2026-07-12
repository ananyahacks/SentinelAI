import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'

const PAGE_META = {
  '/dashboard': { title: 'Overview', subtitle: 'Real-time behavioral risk across your organization' },
  '/upload': { title: 'Upload Activity Logs', subtitle: 'Feed raw logs into the detection pipeline' },
  '/risk-analysis': { title: 'Risk Analysis', subtitle: 'Per-identity risk scoring and breakdown' },
  '/anomalies': { title: 'Anomalies', subtitle: 'Deviations detected against user baselines' },
  '/alerts': { title: 'Alerts', subtitle: 'Notifications raised above risk threshold' },
  '/reports': { title: 'Reports', subtitle: 'Generate and export compliance-ready summaries' },
  '/users': { title: 'Manage Users', subtitle: 'Team access and role administration' },
  '/settings': { title: 'Settings', subtitle: 'Configure detection sensitivity and integrations' }
}

export default function Layout() {
  const location = useLocation()
  const base = '/' + location.pathname.split('/')[1]
  const meta = PAGE_META[base] || { title: 'SentinelAI' }
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-void bg-grid bg-[length:32px_32px]">
      <Sidebar />
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="w-64 h-full" onClick={(e) => e.stopPropagation()}>
            <Sidebar />
          </div>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <Topbar title={meta.title} subtitle={meta.subtitle} onMenuClick={() => setMobileOpen(true)} />
        <main className="p-4 lg:p-8 max-w-[1600px]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
