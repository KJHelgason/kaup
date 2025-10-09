"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, login as apiLogin, register as apiRegister, googleAuth as apiGoogleAuth } from '@/lib/api'

type AuthContextType = {
  user: User | null
  setUser: (user: User) => void
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: {
    username: string
    email: string
    password: string
  }) => Promise<void>
  googleLogin: (data: {
    email: string
    googleId: string
    firstName?: string
    lastName?: string
    profileImageUrl?: string
  }) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Load auth state from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('kaup-token')
    const savedUser = localStorage.getItem('kaup-user')
    
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const response = await apiLogin(email, password)
    if (response) {
      setToken(response.token)
      setUser(response.user)
      localStorage.setItem('kaup-token', response.token)
      localStorage.setItem('kaup-user', JSON.stringify(response.user))
    }
  }

  const register = async (data: {
    username: string
    email: string
    password: string
  }) => {
    const response = await apiRegister(data)
    if (response) {
      setToken(response.token)
      setUser(response.user)
      localStorage.setItem('kaup-token', response.token)
      localStorage.setItem('kaup-user', JSON.stringify(response.user))
    }
  }

  const googleLogin = async (data: {
    email: string
    googleId: string
    firstName?: string
    lastName?: string
    profileImageUrl?: string
  }) => {
    const response = await apiGoogleAuth(data)
    if (response) {
      setToken(response.token)
      setUser(response.user)
      localStorage.setItem('kaup-token', response.token)
      localStorage.setItem('kaup-user', JSON.stringify(response.user))
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('kaup-token')
    localStorage.removeItem('kaup-user')
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem('kaup-user', JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: updateUser,
        token,
        login,
        register,
        googleLogin,
        logout,
        isAuthenticated: !!token && !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
