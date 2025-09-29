import React, { useState } from 'react'
import { apiClient } from '../utils/api'

export const ApiTest: React.FC = () => {
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('testpassword123')
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiClient.login(email, password)
      setResponse(result)
      console.log('Login successful:', result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleGetDashboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiClient.getDashboardMetrics()
      setResponse(result)
      console.log('Dashboard data:', result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get dashboard data')
      console.error('Dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTeam = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiClient.createTeam({
        name: 'Test Team',
        description: 'A test team created from the frontend'
      })
      setResponse(result)
      console.log('Team created:', result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create team')
      console.error('Create team error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleGetProjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiClient.getProjects()
      setResponse(result)
      console.log('Projects:', result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get projects')
      console.error('Projects error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Integration Test</h1>
      
      {/* Login Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Login Test</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-3 py-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-3 py-2 border rounded"
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </div>

      {/* API Test Buttons */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">API Tests</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleGetDashboard}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Get Dashboard Data
          </button>
          <button
            onClick={handleCreateTeam}
            disabled={loading}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            Create Test Team
          </button>
          <button
            onClick={handleGetProjects}
            disabled={loading}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
          >
            Get Projects
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Response Display */}
      {response && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">API Response</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default ApiTest