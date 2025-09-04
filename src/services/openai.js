/**
 * OpenAI Service
 * Handles AI-powered outreach message generation
 */

import OpenAI from 'openai'
import { config } from '../config'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: config.openai.apiKey,
  dangerouslyAllowBrowser: true // Note: In production, API calls should go through a backend
})

/**
 * Generate personalized outreach email
 */
export const generateOutreachMessage = async ({
  investor,
  company,
  customNotes = '',
  messageType = 'initial'
}) => {
  try {
    if (!config.features.aiGeneration) {
      throw new Error('AI generation is disabled')
    }

    const prompt = createOutreachPrompt({
      investor,
      company,
      customNotes,
      messageType
    })

    const completion = await openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert at writing personalized, professional investor outreach emails that get responses. Write compelling, concise emails that highlight relevant connections between the startup and investor.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: config.openai.maxTokens,
      temperature: config.openai.temperature
    })

    const generatedMessage = completion.choices[0]?.message?.content

    if (!generatedMessage) {
      throw new Error('No message generated')
    }

    return {
      message: generatedMessage.trim(),
      subject: generateSubjectLine(company, investor),
      usage: completion.usage
    }
  } catch (error) {
    console.error('OpenAI generation error:', error)
    
    // Fallback to template-based generation
    if (error.code === 'insufficient_quota' || error.code === 'rate_limit_exceeded') {
      return generateFallbackMessage({ investor, company, customNotes })
    }
    
    throw new Error(error.message || 'Failed to generate outreach message')
  }
}

/**
 * Generate follow-up message
 */
export const generateFollowUpMessage = async ({
  investor,
  company,
  previousMessage,
  followUpType = 'gentle'
}) => {
  try {
    const prompt = createFollowUpPrompt({
      investor,
      company,
      previousMessage,
      followUpType
    })

    const completion = await openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert at writing professional follow-up emails to investors. Write concise, value-driven follow-ups that provide updates and maintain engagement without being pushy.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: config.openai.maxTokens,
      temperature: config.openai.temperature
    })

    const generatedMessage = completion.choices[0]?.message?.content

    if (!generatedMessage) {
      throw new Error('No follow-up message generated')
    }

    return {
      message: generatedMessage.trim(),
      subject: `Re: ${generateSubjectLine(company, investor)}`,
      usage: completion.usage
    }
  } catch (error) {
    console.error('OpenAI follow-up generation error:', error)
    throw new Error(error.message || 'Failed to generate follow-up message')
  }
}

/**
 * Create outreach prompt
 */
const createOutreachPrompt = ({ investor, company, customNotes, messageType }) => {
  return `
Write a personalized investor outreach email with the following details:

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

REQUIREMENTS:
- Keep it under 200 words
- Be professional but personable
- Highlight specific connections between the company and investor's thesis
- Include a clear call-to-action for a brief meeting
- Don't use overly salesy language
- Make it feel personal, not templated
- Include specific details that show you've researched the investor

EMAIL FORMAT:
- Start with a personalized greeting
- Brief introduction of yourself and company
- Explain why this investor is a good fit
- Highlight key traction/achievements
- Clear ask for a meeting
- Professional closing

Write only the email body, no subject line.
  `.trim()
}

/**
 * Create follow-up prompt
 */
const createFollowUpPrompt = ({ investor, company, previousMessage, followUpType }) => {
  return `
Write a professional follow-up email to an investor with the following context:

INVESTOR: ${investor.name} at ${investor.firm}
COMPANY: ${company.name}
FOLLOW-UP TYPE: ${followUpType}

PREVIOUS MESSAGE CONTEXT:
${previousMessage}

REQUIREMENTS:
- Keep it brief (under 150 words)
- Provide a meaningful update or new information
- Reference the previous conversation naturally
- Include a soft call-to-action
- Maintain professional tone
- Don't be pushy or desperate

Write only the email body, no subject line.
  `.trim()
}

/**
 * Generate subject line
 */
const generateSubjectLine = (company, investor) => {
  const templates = [
    `${company.name} x ${investor.firm} - Partnership Opportunity`,
    `Quick intro: ${company.name} (${company.industry})`,
    `${company.name} - ${company.stage} ${company.industry} startup`,
    `Partnership opportunity: ${company.name}`,
    `${company.name} - Aligns with your ${investor.stage_focus} focus`
  ]
  
  return templates[Math.floor(Math.random() * templates.length)]
}

/**
 * Fallback message generation when OpenAI is unavailable
 */
const generateFallbackMessage = ({ investor, company, customNotes }) => {
  const message = `Hi ${investor.name},

I hope this email finds you well. My name is [Your Name], and I'm the founder of ${company.name}.

I've been following ${investor.firm}'s work in ${company.industry}, particularly your focus on ${investor.investment_thesis.split(',')[0]}. Your recent investments align perfectly with what we're building.

${company.name} is ${company.description}

What makes us particularly interesting:
• We're operating in the ${company.industry} space at the ${company.stage} stage
• Our approach to solving this problem is unique because [specific differentiator]
• We've achieved [key metric/milestone] in just [timeframe]

${customNotes ? `\nAdditional context: ${customNotes}` : ''}

Given ${investor.firm}'s track record with ${investor.stage_focus} companies and focus on companies like ours, I believe there could be a strong strategic fit.

I'd love to share more about our vision and discuss how we align with your investment thesis. Would you be available for a brief 15-minute call next week?

Best regards,
[Your Name]
Founder, ${company.name}
[your-email@company.com]

P.S. I've attached our latest pitch deck and would be happy to provide additional materials upon request.`

  return {
    message,
    subject: generateSubjectLine(company, investor),
    usage: null
  }
}

/**
 * Validate OpenAI configuration
 */
export const validateOpenAIConfig = () => {
  if (!config.openai.apiKey) {
    throw new Error('OpenAI API key is not configured')
  }
  return true
}

export default {
  generateOutreachMessage,
  generateFollowUpMessage,
  validateOpenAIConfig
}
