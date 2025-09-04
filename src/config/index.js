/**
 * Application Configuration
 * Centralized configuration management for InvestorMatch AI
 */

// Validate required environment variables
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_OPENAI_API_KEY',
  'VITE_STRIPE_PUBLISHABLE_KEY'
]

const missingEnvVars = requiredEnvVars.filter(envVar => !import.meta.env[envVar])

if (missingEnvVars.length > 0 && import.meta.env.PROD) {
  console.error('Missing required environment variables:', missingEnvVars)
}

export const config = {
  // Supabase Configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  },

  // OpenAI Configuration
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    model: 'gpt-4',
    maxTokens: 1000,
    temperature: 0.7
  },

  // Stripe Configuration
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
  },

  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'InvestorMatch AI',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    url: import.meta.env.VITE_APP_URL || 'http://localhost:5173'
  },

  // Feature Flags
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    payments: import.meta.env.VITE_ENABLE_PAYMENTS === 'true',
    aiGeneration: import.meta.env.VITE_ENABLE_AI_GENERATION === 'true'
  },

  // Subscription Limits
  limits: {
    free: {
      outreachPerMonth: parseInt(import.meta.env.VITE_MAX_OUTREACH_PER_MONTH_FREE) || 5,
      investorSearches: 10,
      templates: 3
    },
    pro: {
      outreachPerMonth: parseInt(import.meta.env.VITE_MAX_OUTREACH_PER_MONTH_PRO) || 50,
      investorSearches: 100,
      templates: 10
    },
    premium: {
      outreachPerMonth: parseInt(import.meta.env.VITE_MAX_OUTREACH_PER_MONTH_PREMIUM) || 999999,
      investorSearches: 999999,
      templates: 999999
    }
  },

  // API Configuration
  api: {
    timeout: 30000,
    retries: 3,
    retryDelay: 1000
  }
}

export default config
