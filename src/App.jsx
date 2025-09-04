import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import AppShell from './components/AppShell'
import Dashboard from './pages/Dashboard'
import InvestorDiscovery from './pages/InvestorDiscovery'
import OutreachGenerator from './pages/OutreachGenerator'
import ResponseTemplates from './pages/ResponseTemplates'
import AuthPage from './pages/AuthPage'
import Onboarding from './pages/Onboarding'

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<AppShell />}>
            <Route index element={<Dashboard />} />
            <Route path="onboarding" element={<Onboarding />} />
            <Route path="investors" element={<InvestorDiscovery />} />
            <Route path="outreach/:investorId?" element={<OutreachGenerator />} />
            <Route path="templates" element={<ResponseTemplates />} />
          </Route>
        </Routes>
      </DataProvider>
    </AuthProvider>
  )
}

export default App