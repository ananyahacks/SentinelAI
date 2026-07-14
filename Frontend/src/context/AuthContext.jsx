import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

const DEMO_USERS = {
  'admin@sentinelai.io': {
    password: 'sentinel123',
    name: 'Ravi Menon',
    role: 'company_admin',
    company: 'Northbridge Financial',
    initials: 'RM'
  },
  'analyst@sentinelai.io': {
    password: 'sentinel123',
    name: 'Priya Nair',
    role: 'security_analyst',
    company: 'Northbridge Financial',
    initials: 'PN'
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('sentinelai_user')
    return cached ? JSON.parse(cached) : null
  })

  const login = useCallback(async (email, password) => {
    // Swap this block for: await axiosClient.post('/auth/login', { email, password })
    const record = DEMO_USERS[email.trim().toLowerCase()]
    await new Promise((r) => setTimeout(r, 650))
    if (!record || record.password !== password) {
      throw new Error('Invalid email or password.')
    }
    const sessionUser = { email, name: record.name, role: record.role, company: record.company, initials: record.initials }
    localStorage.setItem('sentinelai_user', JSON.stringify(sessionUser))
    localStorage.setItem('sentinelai_token', 'demo-jwt-token')
    setUser(sessionUser)
    return sessionUser
  }, [])

  const registerCompany = useCallback(async (payload) => {
    // Swap this block for: await axiosClient.post('/auth/register-company', payload)
    await new Promise((r) => setTimeout(r, 900))
    const sessionUser = {
      email: payload.email,
      name: payload.fullName,
      role: 'company_admin',
      company: payload.companyName,
      initials: payload.fullName.split(' ').map((s) => s[0]).join('').slice(0, 2).toUpperCase()
    }
    localStorage.setItem('sentinelai_user', JSON.stringify(sessionUser))
    localStorage.setItem('sentinelai_token', 'demo-jwt-token')
    setUser(sessionUser)
    return sessionUser
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('sentinelai_user')
    localStorage.removeItem('sentinelai_token')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, registerCompany }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
