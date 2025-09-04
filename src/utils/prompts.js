/**
 * AI Prompt Templates
 * Centralized prompt management for OpenAI integration
 */

/**
 * System prompts for different message types
 */
export const SYSTEM_PROMPTS = {
  outreach: `You are an expert at writing personalized, professional investor outreach emails that get responses. 

Key principles:
- Write compelling, concise emails that highlight relevant connections between the startup and investor
- Be professional but personable
- Include specific details that show research was done
- Keep under 200 words
- Include clear call-to-action for a brief meeting
- Avoid overly salesy language
- Make it feel personal, not templated`,

  followUp: `You are an expert at writing professional follow-up emails to investors.

Key principles:
- Write concise, value-driven follow-ups that provide updates and maintain engagement
- Keep under 150 words
- Provide meaningful updates or new information
- Reference previous conversations naturally
- Include soft call-to-action
- Maintain professional tone without being pushy`,

  response: `You are an expert at writing professional responses to investor inquiries.

Key principles:
- Be responsive and helpful
- Provide requested information clearly
- Maintain professional tone
- Show enthusiasm without being desperate
- Include next steps or calls-to-action`
}

/**
 * Generate outreach email prompt
 */
export const createOutreachPrompt = ({
  investor,
  company,
  customNotes = '',
  messageType = 'initial'
}) => {
  const basePrompt = `Write a personalized investor outreach email with the following details:

INVESTOR INFORMATION:
- Name: ${investor.name}
- Firm: ${investor.firm}
- Investment Thesis: ${investor.investment_thesis}
- Stage Focus: ${investor.stage_focus}
- Check Size: ${investor.check_size}

COMPANY INFORMATION:
- Name: ${company.name}
- Industry: ${company.industry}
- Stage: ${company.stage}
- Description: ${company.description}
- Funding Ask: ${company.funding_ask || 'Not specified'}

${customNotes ? `ADDITIONAL CONTEXT:\n${customNotes}` : ''}

EMAIL STRUCTURE:
1. Personalized greeting
2. Brief introduction of yourself and company
3. Explain why this investor is a good fit (reference their thesis/portfolio)
4. Highlight key traction/achievements
5. Clear ask for a meeting
6. Professional closing

Write only the email body, no subject line.`

  return basePrompt.trim()
}

/**
 * Generate follow-up email prompt
 */
export const createFollowUpPrompt = ({
  investor,
  company,
  previousMessage,
  followUpType = 'gentle',
  newUpdates = ''
}) => {
  const typeInstructions = {
    gentle: 'Write a gentle follow-up that provides value and maintains interest',
    urgent: 'Write a more direct follow-up with time-sensitive information',
    update: 'Write a follow-up focused on sharing important company updates',
    meeting: 'Write a follow-up to schedule or reschedule a meeting'
  }

  return `Write a professional follow-up email to an investor with the following context:

INVESTOR: ${investor.name} at ${investor.firm}
COMPANY: ${company.name}
FOLLOW-UP TYPE: ${followUpType} - ${typeInstructions[followUpType]}

PREVIOUS MESSAGE CONTEXT:
${previousMessage}

${newUpdates ? `NEW UPDATES TO SHARE:\n${newUpdates}` : ''}

REQUIREMENTS:
- Keep it brief (under 150 words)
- ${followUpType === 'update' ? 'Focus on sharing meaningful updates' : 'Provide value without being pushy'}
- Reference the previous conversation naturally
- Include appropriate call-to-action
- Maintain professional tone

Write only the email body, no subject line.`.trim()
}

/**
 * Generate response email prompt
 */
export const createResponsePrompt = ({
  investor,
  company,
  inquiryType,
  specificQuestions = [],
  attachments = []
}) => {
  return `Write a professional response email to an investor inquiry with the following details:

INVESTOR: ${investor.name} at ${investor.firm}
COMPANY: ${company.name}
INQUIRY TYPE: ${inquiryType}

${specificQuestions.length > 0 ? `SPECIFIC QUESTIONS TO ADDRESS:\n${specificQuestions.map(q => `- ${q}`).join('\n')}` : ''}

${attachments.length > 0 ? `ATTACHMENTS TO MENTION:\n${attachments.map(a => `- ${a}`).join('\n')}` : ''}

REQUIREMENTS:
- Address all questions thoroughly but concisely
- Show enthusiasm and professionalism
- Provide clear next steps
- Mention any attachments naturally
- Keep under 250 words

Write only the email body, no subject line.`.trim()
}

/**
 * Subject line generation prompts
 */
export const SUBJECT_LINE_TEMPLATES = {
  initial: [
    '{company} x {firm} - Partnership Opportunity',
    'Quick intro: {company} ({industry})',
    '{company} - {stage} {industry} startup',
    'Partnership opportunity: {company}',
    '{company} - Aligns with your {stage} focus',
    'Introduction: {company} founder',
    '{company} - {industry} solution you might find interesting'
  ],
  followUp: [
    'Re: {company} partnership opportunity',
    'Following up: {company} updates',
    '{company} - Quick update',
    'Re: Our conversation about {company}',
    '{company} - New developments'
  ],
  response: [
    'Re: {company} information request',
    '{company} - Additional details',
    'Re: Due diligence materials',
    '{company} - Requested information'
  ]
}

/**
 * Generate subject line
 */
export const generateSubjectLine = (company, investor, messageType = 'initial') => {
  const templates = SUBJECT_LINE_TEMPLATES[messageType] || SUBJECT_LINE_TEMPLATES.initial
  const template = templates[Math.floor(Math.random() * templates.length)]
  
  return template
    .replace('{company}', company.name)
    .replace('{firm}', investor.firm)
    .replace('{industry}', company.industry)
    .replace('{stage}', company.stage)
}

/**
 * Validate prompt inputs
 */
export const validatePromptInputs = (inputs) => {
  const { investor, company } = inputs
  
  const errors = []
  
  if (!investor?.name) errors.push('Investor name is required')
  if (!investor?.firm) errors.push('Investor firm is required')
  if (!investor?.investment_thesis) errors.push('Investor thesis is required')
  
  if (!company?.name) errors.push('Company name is required')
  if (!company?.description) errors.push('Company description is required')
  if (!company?.industry) errors.push('Company industry is required')
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export default {
  SYSTEM_PROMPTS,
  createOutreachPrompt,
  createFollowUpPrompt,
  createResponsePrompt,
  generateSubjectLine,
  validatePromptInputs
}
