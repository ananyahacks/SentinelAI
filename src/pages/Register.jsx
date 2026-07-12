import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Loader2, Building2, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const steps = ['Company', 'Admin account', 'Confirm']

export default function Register() {
  const { registerCompany } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    companyName: '',
    industry: 'Financial Services',
    orgSize: '51–200 employees',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const next = () => {
    setError('')
    if (step === 0 && !form.companyName.trim()) return setError('Enter your company name to continue.')
    if (step === 1) {
      if (!form.fullName.trim() || !form.email.trim() || !form.password) return setError('Fill in all admin account fields.')
      if (form.password !== form.confirmPassword) return setError('Passwords do not match.')
    }
    setStep((s) => Math.min(s + 1, steps.length - 1))
  }
  const back = () => setStep((s) => Math.max(s - 1, 0))

  const handleFinish = async () => {
    setLoading(true)
    setError('')
    try {
      await registerCompany(form)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-void bg-grid bg-[length:32px_32px] flex items-center justify-center p-6">
      <div className="w-full max-w-lg animate-floatIn">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-8 h-8 rounded-lg bg-elevated2 border border-hairline flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M4 13 L8 13 L10 8 L13 17 L15 13 L20 13" stroke="#33D6C0" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="font-display font-semibold text-lg text-ink">Sentinel<span className="text-signal">AI</span></span>
        </div>

        <div className="card p-8">
          <h2 className="font-display text-2xl font-semibold text-ink mb-1">Register your organization</h2>
          <p className="text-sm text-muted mb-6">Set up a SentinelAI workspace for your security team.</p>

          {/* Stepper */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className={`flex items-center gap-2 ${i <= step ? 'text-signal' : 'text-faint'}`}>
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[11px] font-mono ${i < step ? 'bg-signal border-signal text-void' : i === step ? 'border-signal' : 'border-hairline'}`}>
                    {i < step ? <CheckCircle2 size={14} /> : i + 1}
                  </div>
                  <span className="text-xs hidden sm:inline">{s}</span>
                </div>
                {i < steps.length - 1 && <div className={`flex-1 h-px mx-3 ${i < step ? 'bg-signal' : 'bg-hairline'}`} />}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {step === 0 && (
              <>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Company name</label>
                  <div className="relative">
                    <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
                    <input
                      value={form.companyName}
                      onChange={update('companyName')}
                      placeholder="Northbridge Financial"
                      className="w-full bg-elevated border border-hairline rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-ink placeholder:text-faint focus:border-signal transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Industry</label>
                  <select value={form.industry} onChange={update('industry')} className="w-full bg-elevated border border-hairline rounded-lg px-3.5 py-2.5 text-sm text-ink focus:border-signal transition-colors">
                    {['Financial Services', 'Healthcare', 'SaaS / Technology', 'Retail', 'Manufacturing', 'Government'].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Organization size</label>
                  <select value={form.orgSize} onChange={update('orgSize')} className="w-full bg-elevated border border-hairline rounded-lg px-3.5 py-2.5 text-sm text-ink focus:border-signal transition-colors">
                    {['1–50 employees', '51–200 employees', '201–1000 employees', '1000+ employees'].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Full name</label>
                  <input value={form.fullName} onChange={update('fullName')} placeholder="Ravi Menon" className="w-full bg-elevated border border-hairline rounded-lg px-3.5 py-2.5 text-sm text-ink placeholder:text-faint focus:border-signal transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Work email</label>
                  <input type="email" value={form.email} onChange={update('email')} placeholder="ravi@northbridge.com" className="w-full bg-elevated border border-hairline rounded-lg px-3.5 py-2.5 text-sm text-ink placeholder:text-faint focus:border-signal transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1.5">Password</label>
                    <input type="password" value={form.password} onChange={update('password')} placeholder="••••••••" className="w-full bg-elevated border border-hairline rounded-lg px-3.5 py-2.5 text-sm text-ink placeholder:text-faint focus:border-signal transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1.5">Confirm</label>
                    <input type="password" value={form.confirmPassword} onChange={update('confirmPassword')} placeholder="••••••••" className="w-full bg-elevated border border-hairline rounded-lg px-3.5 py-2.5 text-sm text-ink placeholder:text-faint focus:border-signal transition-colors" />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <p className="text-xs text-muted mb-2">Review your details before creating the workspace.</p>
                {[['Company', form.companyName], ['Industry', form.industry], ['Size', form.orgSize], ['Admin', form.fullName], ['Email', form.email]].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between py-2 border-b border-hairline last:border-0">
                    <span className="text-xs text-faint">{k}</span>
                    <span className="text-sm text-ink font-medium">{v || '—'}</span>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="text-xs text-risk-critical bg-risk-critical/10 border border-risk-critical/30 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              {step > 0 && (
                <button onClick={back} className="px-4 py-2.5 rounded-lg border border-hairline text-sm text-muted hover:text-ink transition-colors">
                  Back
                </button>
              )}
              {step < steps.length - 1 ? (
                <button onClick={next} className="flex-1 flex items-center justify-center gap-2 bg-signal text-void font-semibold text-sm rounded-lg py-2.5 hover:bg-signal-dim transition-colors">
                  Continue <ArrowRight size={15} />
                </button>
              ) : (
                <button onClick={handleFinish} disabled={loading} className="flex-1 flex items-center justify-center gap-2 bg-signal text-void font-semibold text-sm rounded-lg py-2.5 hover:bg-signal-dim transition-colors disabled:opacity-60">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : 'Create workspace'}
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm text-muted text-center mt-6">
          Already have a workspace? <Link to="/login" className="text-signal hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
