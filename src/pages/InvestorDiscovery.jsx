import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import { Search, Filter, Mail, ExternalLink, MapPin, DollarSign } from 'lucide-react'

const InvestorDiscovery = () => {
  const { searchInvestors } = useData()
  const navigate = useNavigate()
  
  const [filters, setFilters] = useState({
    industry: 'all',
    stage: 'all',
    location: 'all',
    search: ''
  })
  
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const industries = [
    'all', 'SaaS', 'Fintech', 'Healthcare', 'E-commerce', 'AI/ML', 
    'Consumer Tech', 'Enterprise', 'Marketplace', 'Developer Tools',
    'Cloud Infrastructure', 'Crypto'
  ]

  const stages = ['all', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+']
  
  const locations = ['all', 'San Francisco', 'Palo Alto', 'New York', 'Boston', 'Menlo Park']

  const handleSearch = async () => {
    setIsSearching(true)
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const searchResults = searchInvestors(filters)
    setResults(searchResults)
    setIsSearching(false)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleContactInvestor = (investorId) => {
    navigate(`/outreach/${investorId}`)
  }

  React.useEffect(() => {
    // Load initial results
    handleSearch()
  }, [])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Find Investors</h1>
          <p className="text-gray-600 mt-1">Discover investors that match your startup profile</p>
        </div>
      </div>

      {/* Search Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
            <select
              value={filters.industry}
              onChange={(e) => handleFilterChange('industry', e.target.value)}
              className="select"
            >
              {industries.map(industry => (
                <option key={industry} value={industry}>
                  {industry === 'all' ? 'All Industries' : industry}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
            <select
              value={filters.stage}
              onChange={(e) => handleFilterChange('stage', e.target.value)}
              className="select"
            >
              {stages.map(stage => (
                <option key={stage} value={stage}>
                  {stage === 'all' ? 'All Stages' : stage}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="select"
            >
              {locations.map(location => (
                <option key={location} value={location}>
                  {location === 'all' ? 'All Locations' : location}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="w-full btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Search className="h-5 w-5" />
              <span>{isSearching ? 'Searching...' : 'Search'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {results.length} investors found
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Filter className="h-4 w-4" />
            <span>Filtered by: {filters.industry !== 'all' ? filters.industry : 'All'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {results.map((investor) => (
            <div
              key={investor.investorId}
              className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-card p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">{investor.name}</h3>
                  <p className="text-blue-600 font-medium">{investor.firm}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{investor.criteria[0]?.location || 'Various'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4" />
                      <span>{investor.check_size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href={investor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 text-sm leading-relaxed">{investor.investment_thesis}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {investor.stage_focus}
                  </span>
                  {investor.criteria.map((criterion, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {criterion.industry}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleContactInvestor(investor.investorId)}
                  className="btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center space-x-2 text-sm px-4 py-2"
                >
                  <Mail className="h-4 w-4" />
                  <span>Contact</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {results.length === 0 && !isSearching && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No investors found</h3>
            <p className="text-gray-600">Try adjusting your search filters to find more results.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default InvestorDiscovery