import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-void bg-grid bg-[length:32px_32px] flex items-center justify-center p-6 text-center">
      <div>
        <p className="font-mono text-signal text-sm mb-2">404_SIGNAL_LOST</p>
        <h1 className="font-display text-3xl font-semibold text-ink mb-3">This page isn't on the map.</h1>
        <p className="text-muted text-sm mb-6">The route you're looking for doesn't exist in this workspace.</p>
        <Link to="/login" className="inline-block bg-signal text-void font-semibold text-sm rounded-lg px-5 py-2.5 hover:bg-signal-dim transition-colors">
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
