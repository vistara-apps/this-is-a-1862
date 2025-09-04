import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService, dbService } from '../services/supabase'
import toast from 'react-hot-toast'

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
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const session = await authService.getSession()
        setSession(session)
        
        if (session?.user) {
          // Get or create user profile
          await handleUserSession(session.user)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      setSession(session)
      
      if (session?.user) {
        await handleUserSession(session.user)
      } else {
        setUser(null)
      }
      
      setLoading(false)
    })

    return () => subscription?.unsubscribe()
  }, [])

  const handleUserSession = async (authUser) => {
    try {
      // Try to get existing user profile
      let userProfile = await dbService.users.getById(authUser.id)
      
      // If no profile exists, create one
      if (!userProfile) {
        userProfile = await dbService.users.create({
          user_id: authUser.id,
          email: authUser.email,
          subscription_tier: 'free'
        })
      }
      
      setUser({
        ...userProfile,
        userId: userProfile.user_id // Keep compatibility with existing code
      })
    } catch (error) {
      console.error('Error handling user session:', error)
      // Fallback to basic user data
      setUser({
        userId: authUser.id,
        email: authUser.email,
        subscription_tier: 'free'
      })
    }
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      const { user: authUser, session } = await authService.signIn(email, password)
      
      if (authUser) {
        toast.success('Successfully signed in!')
        return authUser
      }
    } catch (error) {
      toast.error(error.message || 'Failed to sign in')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true)
      const { user: authUser, session } = await authService.signUp(email, password, userData)
      
      if (authUser) {
        toast.success('Account created successfully! Please check your email to verify your account.')
        return authUser
      }
    } catch (error) {
      toast.error(error.message || 'Failed to create account')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await authService.signOut()
      setUser(null)
      setSession(null)
      toast.success('Successfully signed out')
    } catch (error) {
      toast.error('Error signing out')
      console.error('Sign out error:', error)
    }
  }

  const updateProfile = async (updates) => {
    try {
      if (!user?.userId) throw new Error('No user logged in')
      
      const updatedUser = await dbService.users.update(user.userId, updates)
      setUser({ ...updatedUser, userId: updatedUser.user_id })
      toast.success('Profile updated successfully')
      return updatedUser
    } catch (error) {
      toast.error('Failed to update profile')
      throw error
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
