import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate checking for existing session
    const storedUser = localStorage.getItem('investormatch_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const signIn = async (email, password) => {
    // Simulate authentication
    const userData = {
      userId: 'user_123',
      email,
      subscriptionTier: 'free',
      createdAt: new Date().toISOString()
    }
    localStorage.setItem('investormatch_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const signUp = async (email, password) => {
    // Simulate registration
    const userData = {
      userId: 'user_' + Math.random().toString(36).substr(2, 9),
      email,
      subscriptionTier: 'free',
      createdAt: new Date().toISOString()
    }
    localStorage.setItem('investormatch_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const signOut = () => {
    localStorage.removeItem('investormatch_user')
    localStorage.removeItem('investormatch_company')
    setUser(null)
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}