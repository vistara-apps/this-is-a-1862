import React, { createContext, useContext, useState, useEffect } from 'react'
import { dbService } from '../services/supabase'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const DataContext = createContext({})

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

// Mock investor data
const mockInvestors = [
  {
    investorId: 'inv_1',
    name: 'Sarah Chen',
    firm: 'Accel Partners',
    website: 'https://accel.com',
    investment_thesis: 'B2B SaaS, fintech, and developer tools with strong product-market fit',
    stage_focus: 'Series A',
    check_size: '$2M - $10M',
    contact_email: 'sarah@accel.com',
    linkedin_profile: 'https://linkedin.com/in/sarahchen',
    criteria: [
      { industry: 'SaaS', stage: 'Series A', location: 'San Francisco' },
      { industry: 'Fintech', stage: 'Series A', location: 'San Francisco' }
    ]
  },
  {
    investorId: 'inv_2',
    name: 'Michael Rodriguez',
    firm: 'Sequoia Capital',
    website: 'https://sequoiacap.com',
    investment_thesis: 'Early-stage consumer and enterprise technology companies',
    stage_focus: 'Seed',
    check_size: '$500K - $3M',
    contact_email: 'michael@sequoiacap.com',
    linkedin_profile: 'https://linkedin.com/in/michaelrodriguez',
    criteria: [
      { industry: 'Consumer Tech', stage: 'Seed', location: 'Palo Alto' },
      { industry: 'Enterprise', stage: 'Seed', location: 'Palo Alto' }
    ]
  },
  {
    investorId: 'inv_3',
    name: 'Emily Johnson',
    firm: 'Bessemer Venture Partners',
    website: 'https://bvp.com',
    investment_thesis: 'Cloud infrastructure, developer tools, and vertical SaaS',
    stage_focus: 'Series B',
    check_size: '$5M - $25M',
    contact_email: 'emily@bvp.com',
    linkedin_profile: 'https://linkedin.com/in/emilyjohnson',
    criteria: [
      { industry: 'Cloud Infrastructure', stage: 'Series B', location: 'New York' },
      { industry: 'Developer Tools', stage: 'Series B', location: 'New York' }
    ]
  },
  {
    investorId: 'inv_4',
    name: 'David Kim',
    firm: 'Andreessen Horowitz',
    website: 'https://a16z.com',
    investment_thesis: 'AI/ML, crypto, and consumer applications with network effects',
    stage_focus: 'Series A',
    check_size: '$3M - $15M',
    contact_email: 'david@a16z.com',
    linkedin_profile: 'https://linkedin.com/in/davidkim',
    criteria: [
      { industry: 'AI/ML', stage: 'Series A', location: 'Menlo Park' },
      { industry: 'Crypto', stage: 'Series A', location: 'Menlo Park' }
    ]
  },
  {
    investorId: 'inv_5',
    name: 'Lisa Wang',
    firm: 'General Catalyst',
    website: 'https://generalcatalyst.com',
    investment_thesis: 'Healthcare technology and B2B marketplaces',
    stage_focus: 'Seed',
    check_size: '$1M - $5M',
    contact_email: 'lisa@generalcatalyst.com',
    linkedin_profile: 'https://linkedin.com/in/lisawang',
    criteria: [
      { industry: 'Healthcare', stage: 'Seed', location: 'Boston' },
      { industry: 'Marketplace', stage: 'Seed', location: 'Boston' }
    ]
  }
]

const mockTemplates = [
  {
    templateId: 'template_1',
    name: 'Initial Interest Response',
    type: 'response',
    content: `Thank you for your interest in [COMPANY_NAME]. I'm excited to share more details about our progress.

Here are some key updates since our last conversation:
- [KEY_METRIC_1]
- [KEY_METRIC_2] 
- [KEY_ACHIEVEMENT]

I'd love to schedule a call to discuss how we align with your investment thesis. Are you available for a 30-minute call next week?

Best regards,
[FOUNDER_NAME]`
  },
  {
    templateId: 'template_2',
    name: 'Follow-up After Meeting',
    type: 'followup',
    content: `Hi [INVESTOR_NAME],

Thank you for taking the time to meet with our team yesterday. It was great to discuss [SPECIFIC_TOPIC] and learn more about [FIRM_NAME]'s approach to [INVESTMENT_AREA].

As promised, I'm attaching:
- Updated pitch deck with the financial projections we discussed
- Customer testimonials and case studies
- Technical architecture overview

I'm happy to arrange introductions to our key customers or advisors if that would be helpful for your due diligence process.

Looking forward to your feedback!

Best,
[FOUNDER_NAME]`
  },
  {
    templateId: 'template_3',
    name: 'Due Diligence Information',
    type: 'response',
    content: `Hi [INVESTOR_NAME],

Thanks for moving forward with due diligence. I've prepared the information you requested:

Financial Information:
- 3-year financial projections
- Current burn rate and runway
- Revenue breakdown by customer segment

Legal & Corporate:
- Cap table and employee equity breakdown
- IP portfolio and pending patents
- Key contracts and partnerships

I'll have our legal team share the data room access shortly. Please let me know if you need any additional information.

Best regards,
[FOUNDER_NAME]`
  }
]

export const DataProvider = ({ children }) => {
  const { user } = useAuth()
  const [investors, setInvestors] = useState([])
  const [templates, setTemplates] = useState([])
  const [outreachMessages, setOutreachMessages] = useState([])
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(false)

  // Load initial data when user is authenticated
  useEffect(() => {
    if (user?.userId) {
      loadUserData()
    } else {
      // Clear data when user logs out
      setCompany(null)
      setOutreachMessages([])
    }
  }, [user])

  // Load investors and templates on mount
  useEffect(() => {
    loadPublicData()
  }, [])

  const loadPublicData = async () => {
    try {
      setLoading(true)
      
      // Load investors and templates in parallel
      const [investorsData, templatesData] = await Promise.all([
        dbService.investors.getAll(),
        dbService.responseTemplates.getAll()
      ])
      
      setInvestors(investorsData || [])
      setTemplates(templatesData || [])
    } catch (error) {
      console.error('Error loading public data:', error)
      // Fallback to mock data if database fails
      setInvestors(mockInvestors)
      setTemplates(mockTemplates)
    } finally {
      setLoading(false)
    }
  }

  const loadUserData = async () => {
    try {
      setLoading(true)
      
      // Load user-specific data
      const [companyData, messagesData] = await Promise.all([
        dbService.companies.getByUserId(user.userId),
        dbService.outreachMessages.getByUserId(user.userId)
      ])
      
      setCompany(companyData)
      setOutreachMessages(messagesData || [])
    } catch (error) {
      console.error('Error loading user data:', error)
      toast.error('Failed to load your data')
    } finally {
      setLoading(false)
    }
  }

  const saveCompany = async (companyData) => {
    try {
      if (!user?.userId) throw new Error('User not authenticated')
      
      let savedCompany
      if (company?.company_id) {
        // Update existing company
        savedCompany = await dbService.companies.update(company.company_id, companyData)
      } else {
        // Create new company
        savedCompany = await dbService.companies.create({
          ...companyData,
          user_id: user.userId
        })
      }
      
      setCompany(savedCompany)
      toast.success('Company information saved successfully')
      return savedCompany
    } catch (error) {
      console.error('Error saving company:', error)
      toast.error('Failed to save company information')
      throw error
    }
  }

  const searchInvestors = async (filters = {}) => {
    try {
      const results = await dbService.investors.getAll(filters)
      return results || []
    } catch (error) {
      console.error('Error searching investors:', error)
      toast.error('Failed to search investors')
      return investors // Return cached data as fallback
    }
  }

  const saveOutreachMessage = async (messageData) => {
    try {
      if (!user?.userId) throw new Error('User not authenticated')
      
      const message = await dbService.outreachMessages.create({
        ...messageData,
        user_id: user.userId
      })
      
      setOutreachMessages(prev => [message, ...prev])
      toast.success('Outreach message saved')
      return message
    } catch (error) {
      console.error('Error saving outreach message:', error)
      toast.error('Failed to save outreach message')
      throw error
    }
  }

  const updateOutreachMessage = async (messageId, updates) => {
    try {
      const updatedMessage = await dbService.outreachMessages.update(messageId, updates)
      
      setOutreachMessages(prev => 
        prev.map(msg => msg.message_id === messageId ? updatedMessage : msg)
      )
      
      return updatedMessage
    } catch (error) {
      console.error('Error updating outreach message:', error)
      toast.error('Failed to update message')
      throw error
    }
  }

  const getInvestorById = (investorId) => {
    return investors.find(inv => inv.investor_id === investorId)
  }

  const createTemplate = async (templateData) => {
    try {
      const template = await dbService.responseTemplates.create({
        ...templateData,
        created_by: user?.userId,
        is_public: false
      })
      
      setTemplates(prev => [template, ...prev])
      toast.success('Template created successfully')
      return template
    } catch (error) {
      console.error('Error creating template:', error)
      toast.error('Failed to create template')
      throw error
    }
  }

  // Usage tracking functions
  const trackUsage = async (actionType) => {
    try {
      if (!user?.userId) return
      
      const monthYear = new Date().toISOString().slice(0, 7) // YYYY-MM format
      
      // This would typically be handled by a backend function
      // For now, we'll just track it locally
      console.log(`Tracking usage: ${actionType} for ${monthYear}`)
    } catch (error) {
      console.error('Error tracking usage:', error)
    }
  }

  const value = {
    investors,
    templates,
    outreachMessages,
    company,
    loading,
    saveCompany,
    searchInvestors,
    saveOutreachMessage,
    updateOutreachMessage,
    getInvestorById,
    createTemplate,
    trackUsage,
    refreshData: loadUserData
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}
