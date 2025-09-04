/**
 * Supabase Service
 * Handles all Supabase database operations and authentication
 */

import { createClient } from '@supabase/supabase-js'
import { config } from '../config'

// Initialize Supabase client
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey
)

/**
 * Authentication Services
 */
export const authService = {
  // Sign up new user
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            subscription_tier: 'free',
            ...userData
          }
        }
      })

      if (error) throw error
      return { user: data.user, session: data.session }
    } catch (error) {
      console.error('Sign up error:', error)
      throw new Error(error.message || 'Failed to create account')
    }
  },

  // Sign in existing user
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      return { user: data.user, session: data.session }
    } catch (error) {
      console.error('Sign in error:', error)
      throw new Error(error.message || 'Failed to sign in')
    }
  },

  // Sign out user
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Sign out error:', error)
      throw new Error('Failed to sign out')
    }
  },

  // Get current session
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return session
    } catch (error) {
      console.error('Get session error:', error)
      return null
    }
  },

  // Get current user
  async getUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return user
    } catch (error) {
      console.error('Get user error:', error)
      return null
    }
  },

  // Listen to auth changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

/**
 * Database Services
 */
export const dbService = {
  // Users table operations
  users: {
    async create(userData) {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single()

      if (error) throw error
      return data
    },

    async getById(userId) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) throw error
      return data
    },

    async update(userId, updates) {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    }
  },

  // Companies table operations
  companies: {
    async create(companyData) {
      const { data, error } = await supabase
        .from('companies')
        .insert([companyData])
        .select()
        .single()

      if (error) throw error
      return data
    },

    async getByUserId(userId) {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data
    },

    async update(companyId, updates) {
      const { data, error } = await supabase
        .from('companies')
        .update(updates)
        .eq('company_id', companyId)
        .select()
        .single()

      if (error) throw error
      return data
    }
  },

  // Investors table operations
  investors: {
    async getAll(filters = {}) {
      let query = supabase
        .from('investors')
        .select(`
          *,
          investment_criteria (*)
        `)

      // Apply filters
      if (filters.industry) {
        query = query.ilike('investment_thesis', `%${filters.industry}%`)
      }
      if (filters.stage) {
        query = query.eq('stage_focus', filters.stage)
      }
      if (filters.location) {
        query = query.contains('investment_criteria', [{ location: filters.location }])
      }

      const { data, error } = await query

      if (error) throw error
      return data
    },

    async getById(investorId) {
      const { data, error } = await supabase
        .from('investors')
        .select(`
          *,
          investment_criteria (*)
        `)
        .eq('investor_id', investorId)
        .single()

      if (error) throw error
      return data
    },

    async search(searchTerm) {
      const { data, error } = await supabase
        .from('investors')
        .select(`
          *,
          investment_criteria (*)
        `)
        .or(`name.ilike.%${searchTerm}%,firm.ilike.%${searchTerm}%,investment_thesis.ilike.%${searchTerm}%`)

      if (error) throw error
      return data
    }
  },

  // Outreach messages table operations
  outreachMessages: {
    async create(messageData) {
      const { data, error } = await supabase
        .from('outreach_messages')
        .insert([messageData])
        .select()
        .single()

      if (error) throw error
      return data
    },

    async getByUserId(userId) {
      const { data, error } = await supabase
        .from('outreach_messages')
        .select(`
          *,
          investors (name, firm)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },

    async update(messageId, updates) {
      const { data, error } = await supabase
        .from('outreach_messages')
        .update(updates)
        .eq('message_id', messageId)
        .select()
        .single()

      if (error) throw error
      return data
    }
  },

  // Response templates table operations
  responseTemplates: {
    async getAll() {
      const { data, error } = await supabase
        .from('response_templates')
        .select('*')
        .order('name')

      if (error) throw error
      return data
    },

    async create(templateData) {
      const { data, error } = await supabase
        .from('response_templates')
        .insert([templateData])
        .select()
        .single()

      if (error) throw error
      return data
    }
  }
}

export default supabase
