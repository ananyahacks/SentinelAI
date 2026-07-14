import { createContext, useContext, useState, useCallback } from 'react'
import axiosClient from '../api/axiosClient.js'

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
    try {
      const response = await axiosClient.post('/auth/login', {
        useremail: email,
        userpassword: password
      })
      const { token, user: backendUser } = response.data

      let mappedRole = 'security_analyst'
      if (backendUser.role === 'ADMIN') {
        mappedRole = 'company_admin'
      } else if (backendUser.role === 'SECURITY_ANALYST') {
        mappedRole = 'security_analyst'
      } else {
        mappedRole = backendUser.role?.toLowerCase()
      }

      const sessionUser = {
        email: backendUser.email,
        name: backendUser.username,
        role: mappedRole,
        company: backendUser.companyName,
        initials: backendUser.username.split(' ').map((s) => s[0]).join('').slice(0, 2).toUpperCase()
      }
      localStorage.setItem('sentinelai_user', JSON.stringify(sessionUser))
      localStorage.setItem('sentinelai_token', token)
      setUser(sessionUser)
      return sessionUser
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Unable to sign in.'
      throw new Error(msg)
    }
  }, [])

  const registerCompany = useCallback(async (payload) => {
    try {
      const response = await axiosClient.post('/auth/register', {
        companyname: payload.companyName,
        companyemail: payload.companyEmail,
        username: payload.fullName,
        useremail: payload.email,
        userpassword: payload.password
      })
      const { token, user: backendUser } = response.data

      let mappedRole = 'security_analyst'
      if (backendUser.role === 'ADMIN') {
        mappedRole = 'company_admin'
      } else if (backendUser.role === 'SECURITY_ANALYST') {
        mappedRole = 'security_analyst'
      } else {
        mappedRole = backendUser.role?.toLowerCase()
      }

      const sessionUser = {
        email: backendUser.email,
        name: backendUser.username,
        role: mappedRole,
        company: payload.companyName || backendUser.companyName,
        initials: backendUser.username.split(' ').map((s) => s[0]).join('').slice(0, 2).toUpperCase()
      }
      localStorage.setItem('sentinelai_user', JSON.stringify(sessionUser))
      localStorage.setItem('sentinelai_token', token)
      setUser(sessionUser)
      return sessionUser
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed.'
      throw new Error(msg)
    }
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
