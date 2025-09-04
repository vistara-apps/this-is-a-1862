import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'
import { PenTool, Sparkles, Send, Copy, ArrowLeft, User, Building } from 'lucide-react'
import OpenAI from 'openai'

const OutreachGenerator = () => {
  const { investorId } = useParams()
  const navigate = useNavigate()
  const { getInvestorById, company, saveOutreachMessage, trackUsage } = useData()
  const { user } = useAuth()
  
  const [selectedInvestor, setSelectedInvestor] = useState(null)
  const [generatedMessage, setGeneratedMessage] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [subject, setSubject] = useState('')
  const [customNotes, setCustomNotes] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (investorId) {
      const investor = getInvestorById(investorId)
      setSelectedInvestor(investor)
    }
  }, [investorId, getInvestorById])

  const generateOutreach = async () => {
    if (!selectedInvestor || !company) return

    setIsGenerating(true)
    setError('')

    try {
      // Import OpenAI service dynamically to avoid issues if not configured
      const { generateOutreachMessage } = await import('../services/openai')
      
      const result = await generateOutreachMessage({
        investor: selectedInvestor,
        company,
        customNotes,
        messageType: 'initial'
      })
      
      setGeneratedMessage(result.message)
      setSubject(result.subject)
      
      // Track usage
      if (trackUsage) {
        await trackUsage('ai_generation')
      }
    } catch (err) {
      setError(err.message || 'Failed to generate outreach message. Please try again.')
      console.error('Error generating message:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    const fullMessage = `Subject: ${subject}\n\n${generatedMessage}`
    navigator.clipboard.writeText(fullMessage)
  }

  const saveMessage = async () => {
    if (!generatedMessage || !selectedInvestor) return

    try {
      const messageData = {
        investor_id: selectedInvestor.investor_id,
        subject,
        body: generatedMessage
      }

      await saveOutreachMessage(messageData)
      await trackUsage('outreach')
      navigate('/')
    } catch (error) {
      console.error('Error saving message:', error)
    }
  }

  if (!company) {
    return (
      <div className="text-center py-12">
        <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Complete your company profile</h3>
        <p className="text-gray-600 mb-4">You need to set up your company information before generating outreach.</p>
        <button
          onClick={() => navigate('/onboarding')}
          className="btn-primary"
        >
          Complete Setup
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/investors')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Generate Outreach</h1>
          <p className="text-gray-600 mt-1">Create personalized investor outreach messages</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Target Investor */}
          {selectedInvestor && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-card p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Target Investor</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">{selectedInvestor.name}</p>
                  <p className="text-blue-600">{selectedInvestor.firm}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Investment Focus:</p>
                  <p className="text-sm text-gray-700">{selectedInvestor.investment_thesis}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedInvestor.stage_focus}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {selectedInvestor.check_size}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Company Info */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-card p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Your Company</span>
            </h3>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-gray-900">{company.name}</p>
                <p className="text-sm text-gray-600 capitalize">{company.stage} • {company.industry}</p>
              </div>
              <p className="text-sm text-gray-700">{company.description}</p>
              {company.funding_ask && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Seeking:</span> {company.funding_ask}
                </p>
              )}
            </div>
          </div>

          {/* Custom Notes */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Additional Context</h3>
            <textarea
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Add any specific details you want to highlight (recent achievements, partnerships, metrics, etc.)"
              rows={4}
              className="input resize-none"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={generateOutreach}
            disabled={isGenerating || !selectedInvestor}
            className="w-full btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <Sparkles className="h-5 w-5" />
            <span>{isGenerating ? 'Generating...' : 'Generate AI Outreach'}</span>
          </button>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-card">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                <PenTool className="h-5 w-5" />
                <span>Generated Outreach Message</span>
              </h3>
            </div>

            {error && (
              <div className="p-6 border-b border-gray-100">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <div className="p-6 space-y-4">
              {/* Subject Line */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="input"
                  placeholder="Enter email subject..."
                />
              </div>

              {/* Message Body */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                {isGenerating ? (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">AI is crafting your personalized message...</p>
                  </div>
                ) : generatedMessage ? (
                  <textarea
                    value={generatedMessage}
                    onChange={(e) => setGeneratedMessage(e.target.value)}
                    rows={16}
                    className="input resize-none font-mono text-sm"
                  />
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <PenTool className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Your AI-generated message will appear here</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {generatedMessage && (
                <div className="flex items-center space-x-4 pt-4">
                  <button
                    onClick={copyToClipboard}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copy Message</span>
                  </button>
                  <button
                    onClick={saveMessage}
                    className="btn-primary bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 flex items-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Save & Send</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OutreachGenerator
