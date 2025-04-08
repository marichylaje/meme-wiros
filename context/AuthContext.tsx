import { createContext, useContext, useEffect, useState } from 'react'
import {jwtDecode} from 'jwt-decode'

type User = {
  id: string
  email: string
  admin: boolean // 👈 nuevo campo
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded: any = jwtDecode(token)
        setUser({
          id: decoded.id,
          email: decoded.email,
          admin: decoded.admin || false, // 👈 asegura fallback a false
        })
      } catch (err) {
        localStorage.removeItem('token')
        setUser(null)
      }
    }
  }, [])
  
  const login = (token: string) => {
    localStorage.setItem('token', token)
    const decoded: any = jwtDecode(token)
    setUser({
      id: decoded.id,
      email: decoded.email,
      admin: decoded.admin || false,
    })
  }
  

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
