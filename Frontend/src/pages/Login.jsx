import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import SignalWave from '../components/SignalWave.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@sentinelai.io')
  const [password, setPassword] = useState('sentinel123')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Unable to sign in.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-void bg-grid bg-[length:32px_32px] flex">
      {/* Left: brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 border-r border-hairline relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-signal/5 via-transparent to-violet/5" />
        <div className="relative flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-elevated2 border border-hairline flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 13 L8 13 L10 8 L13 17 L15 13 L20 13" stroke="#33D6C0" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="font-display font-semibold text-lg text-ink">Sentinel<span className="text-signal">AI</span></span>
        </div>

        <div className="relative">
          <p className="text-xs font-mono text-signal togglecase tracking-widest mb-4">Insider Threat Detection</p>
          <h2 className="font-display text-4xl font-semibold text-ink leading-tight mb-4 max-w-md">
            Every identity has a rhythm. <span className="text-gradient">We watch for the beat that breaks.</span>
          </h2>
          <p className="text-muted text-sm max-w-sm leading-relaxed">
            SentinelAI learns each user's normal behaviour, then flags the deviations before they become breaches,turning raw activity logs into a live risk score.
          </p>

          <div className="mt-10 card p-5 max-w-md">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-[11px] text-signal font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulseLine" /> live
              </span>
            </div>
            <SignalWave className="w-full" height={70} />
          </div>
        </div>

        <div className="relative flex items-center gap-2 text-xs text-faint">
          <ShieldCheck size={16} className="text-signal" />
           Encrypted at rest and in transit
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm animate-floatIn">
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <div className="w-8 h-8 rounded-lg bg-elevated2 border border-hairline flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M4 13 L8 13 L10 8 L13 17 L15 13 L20 13" stroke="#33D6C0" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-display font-semibold text-lg text-ink">Sentinel<span className="text-signal">AI</span></span>
          </div>

          <h2 className="font-display text-2xl font-semibold text-ink mb-1">Welcome back</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Work email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-elevated border border-hairline rounded-lg px-3.5 py-2.5 text-sm text-ink placeholder:text-faint focus:border-signal transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-muted">Password</label>
                <button type="button" className="text-xs text-signal hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full bg-elevated border border-hairline rounded-lg px-3.5 py-2.5 text-sm text-ink placeholder:text-faint focus:border-signal transition-colors pr-10"
                />
                <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-muted">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-xs text-risk-critical bg-risk-critical/10 border border-risk-critical/30 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-signal text-void font-semibold text-sm rounded-lg py-2.5 hover:bg-signal-dim transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <>Sign in <ArrowRight size={15} /></>}
            </button>
          </form>

          <div className="mt-6 p-3.5 rounded-lg bg-elevated border border-hairline">
            <p className="text-xs text-faint mt-1 font-mono">password: sentinel123</p>
          </div>

          <p className="text-sm text-muted text-center mt-6">
            New company? <Link to="/register" className="text-signal hover:underline font-medium">Register your organization</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
