import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { MessageSquare, Copy, Plus, Search, Filter } from 'lucide-react'

const ResponseTemplates = () => {
  const { templates } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  const templateTypes = [
    { value: 'all', label: 'All Templates' },
    { value: 'response', label: 'Initial Responses' },
    { value: 'followup', label: 'Follow-ups' }
  ]

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || template.type === selectedType
    return matchesSearch && matchesType
  })

  const copyTemplate = (template) => {
    navigator.clipboard.writeText(template.content)
    // Could add a toast notification here
  }

  const useTemplate = (template) => {
    setSelectedTemplate(template)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Response Templates</h1>
          <p className="text-gray-600 mt-1">Pre-written templates for common investor responses</p>
        </div>
        <button className="btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Create Template</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-card p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search templates..."
                className="input pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="select"
            >
              {templateTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Templates List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredTemplates.length} templates
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Filter className="h-4 w-4" />
              <span>Showing: {selectedType === 'all' ? 'All' : templateTypes.find(t => t.value === selectedType)?.label}</span>
            </div>
          </div>

          {filteredTemplates.map((template) => (
            <div
              key={template.templateId}
              className={`bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-card p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedTemplate?.templateId === template.templateId ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => useTemplate(template)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mt-2 capitalize">
                    {template.type}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    copyTemplate(template)
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <p className="text-gray-600 text-sm line-clamp-3">
                {template.content.substring(0, 150)}...
              </p>
            </div>
          ))}

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-600">Try adjusting your search or create a new template.</p>
            </div>
          )}
        </div>

        {/* Template Preview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-card">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Template Preview</span>
            </h3>
          </div>

          {selectedTemplate ? (
            <div className="p-6">
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 text-lg">{selectedTemplate.name}</h4>
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mt-2 capitalize">
                  {selectedTemplate.type}
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                  {selectedTemplate.content}
                </pre>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => copyTemplate(selectedTemplate)}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy Template</span>
                </button>
                <button className="btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Use Template</span>
                </button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Pro tip:</strong> Variables like [COMPANY_NAME], [INVESTOR_NAME], and [FOUNDER_NAME] 
                  will be automatically replaced when you use this template.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a template</h3>
              <p className="text-gray-600">Choose a template from the list to preview its content.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResponseTemplates