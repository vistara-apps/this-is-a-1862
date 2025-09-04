import React, { createContext, useContext, useState, useEffect } from 'react'

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
  const [investors, setInvestors] = useState(mockInvestors)
  const [templates, setTemplates] = useState(mockTemplates)
  const [outreachMessages, setOutreachMessages] = useState([])
  const [company, setCompany] = useState(() => {
    const stored = localStorage.getItem('investormatch_company')
    return stored ? JSON.parse(stored) : null
  })

  const saveCompany = (companyData) => {
    const companyInfo = {
      companyId: 'comp_' + Math.random().toString(36).substr(2, 9),
      ...companyData,
      createdAt: new Date().toISOString()
    }
    localStorage.setItem('investormatch_company', JSON.stringify(companyInfo))
    setCompany(companyInfo)
    return companyInfo
  }

  const searchInvestors = (filters) => {
    let filtered = investors

    if (filters.industry && filters.industry !== 'all') {
      filtered = filtered.filter(investor => 
        investor.criteria.some(criterion => 
          criterion.industry.toLowerCase().includes(filters.industry.toLowerCase())
        ) || investor.investment_thesis.toLowerCase().includes(filters.industry.toLowerCase())
      )
    }

    if (filters.stage && filters.stage !== 'all') {
      filtered = filtered.filter(investor => 
        investor.stage_focus.toLowerCase() === filters.stage.toLowerCase()
      )
    }

    if (filters.location && filters.location !== 'all') {
      filtered = filtered.filter(investor =>
        investor.criteria.some(criterion =>
          criterion.location.toLowerCase().includes(filters.location.toLowerCase())
        )
      )
    }

    return filtered
  }

  const saveOutreachMessage = (messageData) => {
    const message = {
      messageId: 'msg_' + Math.random().toString(36).substr(2, 9),
      ...messageData,
      sentAt: new Date().toISOString(),
      status: 'draft'
    }
    setOutreachMessages(prev => [message, ...prev])
    return message
  }

  const getInvestorById = (investorId) => {
    return investors.find(inv => inv.investorId === investorId)
  }

  const value = {
    investors,
    templates,
    outreachMessages,
    company,
    saveCompany,
    searchInvestors,
    saveOutreachMessage,
    getInvestorById
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}