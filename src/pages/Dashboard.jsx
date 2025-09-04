import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import { 
  Search, 
  PenTool, 
  TrendingUp, 
  Users, 
  Mail, 
  ArrowRight,
  Sparkles
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const { company, outreachMessages } = useData()
  const navigate = useNavigate()

  const stats = [
    {
      title: 'Outreach Messages',
      value: outreachMessages.length.toString(),
      icon: Mail,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Response Rate',
      value: '23%',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Investors Contacted',
      value: outreachMessages.length.toString(),
      icon: Users,
      color: 'from-purple-500 to-purple-600'
    }
  ]

  const quickActions = [
    {
      title: 'Find Investors',
      description: 'Discover investors that match your startup profile',
      icon: Search,
      color: 'from-blue-500 to-blue-600',
      action: () => navigate('/investors')
    },
    {
      title: 'Generate Outreach',
      description: 'Create personalized investor outreach messages',
      icon: PenTool,
      color: 'from-purple-500 to-purple-600',
      action: () => navigate('/outreach')
    }
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Sparkles className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Welcome back!</h1>
        </div>
        <p className="text-blue-100 text-lg mb-6">
          Ready to connect with your next investor? Let's make it happen.
        </p>
        {company && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <h2 className="font-semibold text-xl mb-2">{company.name}</h2>
            <p className="text-blue-100 mb-3">{company.description}</p>
            <div className="flex items-center space-x-4 text-sm">
              <span className="bg-white/20 px-3 py-1 rounded-full">{company.industry}</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">{company.stage}</span>
              {company.funding_ask && (
                <span className="bg-white/20 px-3 py-1 rounded-full">{company.funding_ask}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-card hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group text-left"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{action.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{action.description}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {outreachMessages.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Outreach</h2>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-card overflow-hidden">
            <div className="divide-y divide-gray-100">
              {outreachMessages.slice(0, 5).map((message, index) => (
                <div key={index} className="p-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{message.subject}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Sent {new Date(message.sentAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {message.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subscription Status */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Free Plan</h3>
            <p className="text-gray-600">
              You have {user.subscriptionTier === 'free' ? '5' : 'unlimited'} outreach messages remaining this month
            </p>
          </div>
          <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-colors">
            Upgrade Plan
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard