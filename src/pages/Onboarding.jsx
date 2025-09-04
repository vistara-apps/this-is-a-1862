import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import { ArrowRight, Building2 } from 'lucide-react'

const Onboarding = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    stage: '',
    funding_ask: ''
  })
  const [loading, setLoading] = useState(false)
  
  const { saveCompany } = useData()
  const navigate = useNavigate()

  const industries = [
    'SaaS', 'Fintech', 'Healthcare', 'E-commerce', 'AI/ML', 
    'Consumer Tech', 'Enterprise', 'Marketplace', 'Developer Tools',
    'Cloud Infrastructure', 'Crypto', 'Gaming', 'Education', 'Other'
  ]

  const stages = [
    'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Growth'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await saveCompany(formData)
      navigate('/')
    } catch (error) {
      console.error('Error saving company:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tell us about your company</h1>
          <p className="text-gray-600">This information helps us match you with the right investors</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input"
                placeholder="Acme Corp"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="input resize-none"
                placeholder="Describe what your company does, the problem you're solving, and your unique value proposition..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry *
                </label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="select"
                  required
                >
                  <option value="">Select industry</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Funding Stage *
                </label>
                <select
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                  className="select"
                  required
                >
                  <option value="">Select stage</option>
                  {stages.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Funding Amount Seeking
              </label>
              <input
                type="text"
                name="funding_ask"
                value={formData.funding_ask}
                onChange={handleChange}
                className="input"
                placeholder="e.g., $2M"
              />
              <p className="text-sm text-gray-500 mt-1">Optional: This helps us find investors with matching check sizes</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Setting up your profile...' : 'Complete Setup'}</span>
              {!loading && <ArrowRight className="h-5 w-5" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Onboarding