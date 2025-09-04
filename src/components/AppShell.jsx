import React from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import { 
  Search, 
  PenTool, 
  MessageSquare, 
  BarChart3, 
  User, 
  LogOut,
  Crown
} from 'lucide-react'

const AppShell = () => {
  const { user, signOut } = useAuth()
  const { company } = useData()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }
    
    if (user && !company) {
      navigate('/onboarding')
    }
  }, [user, company, navigate])

  if (!user) return null

  const handleSignOut = () => {
    signOut()
    navigate('/auth')
  }

  const navItems = [
    { path: '/', icon: BarChart3, label: 'Dashboard' },
    { path: '/investors', icon: Search, label: 'Find Investors' },
    { path: '/outreach', icon: PenTool, label: 'Generate Outreach' },
    { path: '/templates', icon: MessageSquare, label: 'Templates' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">IM</span>
                </div>
                <span className="font-bold text-xl text-gray-900">InvestorMatch AI</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <Crown className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-700 capitalize">
                  {user.subscriptionTier} Plan
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-sm text-gray-700">{user.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white/60 backdrop-blur-sm border-r border-gray-200/50 min-h-[calc(100vh-4rem)] p-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-white/80 hover:shadow-sm'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>

          {company && (
            <div className="mt-8 p-4 bg-white/80 rounded-lg border border-gray-200/50">
              <h3 className="font-semibold text-sm text-gray-900 mb-2">Your Company</h3>
              <p className="font-medium text-gray-800">{company.name}</p>
              <p className="text-sm text-gray-600 capitalize">{company.stage} • {company.industry}</p>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AppShell