import { useState } from 'react'
import { UserPlus, MoreVertical, X } from 'lucide-react'
import { teamUsers as initialTeam } from '../data/mockData.js'

const STATUS_STYLES = {
  Active: 'bg-signal/10 text-signal border-signal/30',
  Invited: 'bg-violet/10 text-violet border-violet/30',
  Suspended: 'bg-risk-critical/10 text-risk-critical border-risk-critical/30'
}

export default function Users() {
  const [team, setTeam] = useState(initialTeam)
  const [showInvite, setShowInvite] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', role: 'Security Analyst' })

  const invite = (e) => {
    e.preventDefault()
    setTeam((prev) => [{ id: Date.now(), ...form, status: 'Invited', lastLogin: '—' }, ...prev])
    setForm({ name: '', email: '', role: 'Security Analyst' })
    setShowInvite(false)
  }

  const cycleStatus = (id) => {
    setTeam((prev) => prev.map((u) => {
      if (u.id !== id) return u
      const next = u.status === 'Active' ? 'Suspended' : 'Active'
      return { ...u, status: next }
    }))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{team.length} team members with workspace access</p>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 bg-signal text-void font-bold text-sm rounded-lg px-4 py-2.5 hover:bg-signal-dim transition-colors"
        >
          <UserPlus size={16} /> Invite user
        </button>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-hairline text-left">
              <th className="px-5 py-3 text-sm font-medium text-muted uppercase tracking-wide">Name</th>
              <th className="px-5 py-3 text-sm font-medium text-muted uppercase tracking-wide hidden sm:table-cell">Email</th>
              <th className="px-5 py-3 text-sm font-medium text-muted uppercase tracking-wide">Role</th>
              <th className="px-5 py-3 text-sm font-medium text-muted uppercase tracking-wide">Status</th>
              <th className="px-5 py-3 text-sm font-medium text-muted uppercase tracking-wide hidden md:table-cell">Last login</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {team.map((u) => (
              <tr key={u.id} className="border-b border-hairline last:border-0 hover:bg-elevated transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-elevated2 flex items-center justify-center text-[11px] font-semibold text-ink shrink-0">
                      {u.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <span className="text-ink font-medium">{u.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-muted hidden sm:table-cell">{u.email}</td>
                <td className="px-5 py-3.5 text-muted">{u.role}</td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => cycleStatus(u.id)}
                    className={`px-2.5 py-1 rounded-md border text-xs font-medium ${STATUS_STYLES[u.status]}`}
                  >
                    {u.status}
                  </button>
                </td>
                <td className="px-5 py-3.5 text-muted font-sans hidden md:table-cell">{u.lastLogin}</td>
                <td className="px-5 py-3.5 text-right">
                  <button className="text-faint hover:text-ink"><MoreVertical size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showInvite && (
        <div className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowInvite(false)}>
          <div className="card w-full max-w-sm p-6 animate-floatIn" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-ink">Invite team member</h3>
              <button onClick={() => setShowInvite(false)} className="text-faint hover:text-ink"><X size={16} /></button>
            </div>
            <form onSubmit={invite} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Full name</label>
                <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full bg-elevated border border-hairline rounded-lg px-3.5 py-2.5 text-sm text-ink focus:border-signal transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Work email</label>
                <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full bg-elevated border border-hairline rounded-lg px-3.5 py-2.5 text-sm text-ink focus:border-signal transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Role</label>
                <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className="w-full bg-elevated border border-hairline rounded-lg px-3.5 py-2.5 text-sm text-ink focus:border-signal transition-colors">
                  <option>Company Admin</option>
                  <option>Security Analyst</option>
                  <option>Viewer</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-signal text-void font-semibold text-sm rounded-lg py-2.5 hover:bg-signal-dim transition-colors mt-2">
                Send invite
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
