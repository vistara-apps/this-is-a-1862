/**
 * Stripe Service
 * Handles subscription payments and billing management
 */

import { loadStripe } from '@stripe/stripe-js'
import { config } from '../config'

// Initialize Stripe
let stripePromise
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(config.stripe.publishableKey)
  }
  return stripePromise
}

/**
 * Subscription Plans Configuration
 */
export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      '5 outreach messages per month',
      '10 investor searches',
      '3 response templates',
      'Basic analytics'
    ],
    limits: config.limits.free
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 29,
    interval: 'month',
    stripePriceId: 'price_pro_monthly', // Replace with actual Stripe price ID
    features: [
      '50 outreach messages per month',
      '100 investor searches',
      '10 response templates',
      'Advanced analytics',
      'Follow-up scheduling',
      'Email support'
    ],
    limits: config.limits.pro
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 79,
    interval: 'month',
    stripePriceId: 'price_premium_monthly', // Replace with actual Stripe price ID
    features: [
      'Unlimited outreach messages',
      'Unlimited investor searches',
      'Unlimited response templates',
      'Advanced analytics & insights',
      'Follow-up scheduling',
      'CRM integration',
      'Priority support',
      'Custom templates'
    ],
    limits: config.limits.premium
  }
}

/**
 * Stripe Service Functions
 */
export const stripeService = {
  /**
   * Create checkout session for subscription
   */
  async createCheckoutSession(planId, userId, successUrl, cancelUrl) {
    try {
      const plan = SUBSCRIPTION_PLANS[planId]
      if (!plan || !plan.stripePriceId) {
        throw new Error('Invalid subscription plan')
      }

      // In a real implementation, this would call your backend API
      // which would create the Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.stripePriceId,
          userId,
          successUrl,
          cancelUrl
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { sessionId } = await response.json()
      
      const stripe = await getStripe()
      const { error } = await stripe.redirectToCheckout({ sessionId })
      
      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Checkout session error:', error)
      throw new Error(error.message || 'Failed to start checkout process')
    }
  },

  /**
   * Create customer portal session
   */
  async createPortalSession(customerId, returnUrl) {
    try {
      // In a real implementation, this would call your backend API
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create portal session')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Portal session error:', error)
      throw new Error(error.message || 'Failed to access billing portal')
    }
  },

  /**
   * Get subscription status
   */
  async getSubscriptionStatus(userId) {
    try {
      // In a real implementation, this would call your backend API
      const response = await fetch(`/api/subscription-status/${userId}`)
      
      if (!response.ok) {
        throw new Error('Failed to get subscription status')
      }

      return await response.json()
    } catch (error) {
      console.error('Subscription status error:', error)
      // Return default free plan status
      return {
        plan: 'free',
        status: 'active',
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false
      }
    }
  },

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId) {
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId })
      })

      if (!response.ok) {
        throw new Error('Failed to cancel subscription')
      }

      return await response.json()
    } catch (error) {
      console.error('Cancel subscription error:', error)
      throw new Error(error.message || 'Failed to cancel subscription')
    }
  },

  /**
   * Update subscription
   */
  async updateSubscription(subscriptionId, newPriceId) {
    try {
      const response = await fetch('/api/update-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
          newPriceId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update subscription')
      }

      return await response.json()
    } catch (error) {
      console.error('Update subscription error:', error)
      throw new Error(error.message || 'Failed to update subscription')
    }
  }
}

/**
 * Usage Tracking Functions
 */
export const usageService = {
  /**
   * Check if user can perform action based on their plan limits
   */
  canPerformAction(userPlan, actionType, currentUsage) {
    const plan = SUBSCRIPTION_PLANS[userPlan] || SUBSCRIPTION_PLANS.free
    const limits = plan.limits

    switch (actionType) {
      case 'outreach':
        return currentUsage.outreachThisMonth < limits.outreachPerMonth
      case 'search':
        return currentUsage.searchesToday < limits.investorSearches
      case 'template':
        return currentUsage.templatesCreated < limits.templates
      default:
        return false
    }
  },

  /**
   * Get usage limits for a plan
   */
  getPlanLimits(planId) {
    const plan = SUBSCRIPTION_PLANS[planId] || SUBSCRIPTION_PLANS.free
    return plan.limits
  },

  /**
   * Calculate usage percentage
   */
  getUsagePercentage(current, limit) {
    if (limit === 999999) return 0 // Unlimited
    return Math.min((current / limit) * 100, 100)
  }
}

/**
 * Pricing Helper Functions
 */
export const pricingHelpers = {
  /**
   * Format price for display
   */
  formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price)
  },

  /**
   * Get plan comparison data
   */
  getPlanComparison() {
    return Object.values(SUBSCRIPTION_PLANS).map(plan => ({
      ...plan,
      formattedPrice: plan.price === 0 ? 'Free' : this.formatPrice(plan.price)
    }))
  },

  /**
   * Get recommended plan based on usage
   */
  getRecommendedPlan(monthlyOutreach) {
    if (monthlyOutreach <= 5) return 'free'
    if (monthlyOutreach <= 50) return 'pro'
    return 'premium'
  }
}

export default {
  stripeService,
  usageService,
  pricingHelpers,
  SUBSCRIPTION_PLANS
}
