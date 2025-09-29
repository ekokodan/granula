import { Search, Plus, Users, Settings, ChevronDown, Crown, Shield, User, Calendar, FolderOpen, Activity } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { authStore } from '@/store/auth'
import { apiClient } from '../utils/api'
import TeamModal from '../components/TeamModal'

interface Team {
  id: number
  name: string
  description: string
  created_by: number
  member_count: number
  department_count: number
  created_at: string
  updated_at: string
}

interface TeamWithRole extends Team {
  userRole?: string
}

export default function Teams() {
  const { user } = authStore()
  const [teams, setTeams] = useState<TeamWithRole[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    loadTeams()
  }, [refreshTrigger])

  const loadTeams = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getTeams()
      const teamsData = response.teams || []
      
      // Get user roles for each team
      const teamsWithRoles = await Promise.all(
        teamsData.map(async (team: Team) => {
          try {
            const membersResponse = await apiClient.getTeamMembers(team.id)
            const userMember = membersResponse.members?.find((m: any) => m.user_id === user?.id)
            return {
              ...team,
              userRole: userMember?.role || (team.created_by === user?.id ? 'owner' : 'member')
            }
          } catch (err) {
            return { ...team, userRole: 'member' }
          }
        })
      )
      
      setTeams(teamsWithRoles)
      setError(null)
    } catch (err) {
      console.error('Failed to load teams:', err)
      setError('Failed to load teams')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTeam = () => {
    setEditingTeam(null)
    setShowTeamModal(true)
  }

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team)
    setShowTeamModal(true)
  }

  const handleTeamCreated = () => {
    setShowTeamModal(false)
    setRefreshTrigger(prev => prev + 1)
  }

  const handleTeamUpdated = () => {
    setShowTeamModal(false)
    setEditingTeam(null)
    setRefreshTrigger(prev => prev + 1)
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="w-4 h-4 text-yellow-600" />
      case 'admin': return <Shield className="w-4 h-4 text-blue-600" />
      default: return <User className="w-4 h-4 text-gray-600" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-yellow-100 text-yellow-800'
      case 'admin': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading teams...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadTeams}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
              <p className="mt-2 text-gray-600">Manage and collaborate with your teams</p>
            </div>
            <button
              onClick={handleCreateTeam}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Team
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Teams Grid */}
        {filteredTeams.length === 0 ? (
          <div className="text-center py-12">
            {teams.length === 0 ? (
              // No teams at all
              <div>
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No teams yet</h3>
                <p className="text-gray-500 mb-6">Create your first team to start collaborating</p>
                <button
                  onClick={handleCreateTeam}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Team
                </button>
              </div>
            ) : (
              // No teams match search
              <div>
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No teams found</h3>
                <p className="text-gray-500">Try adjusting your search terms</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
              <div key={team.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                {/* Team Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{team.name}</h3>
                    {team.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{team.description}</p>
                    )}
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getRoleColor(team.userRole || 'member')}`}>
                      {getRoleIcon(team.userRole || 'member')}
                      <span className="capitalize">{team.userRole}</span>
                    </div>
                  </div>
                </div>

                {/* Team Stats */}
                <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{team.member_count} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FolderOpen className="w-4 h-4" />
                    <span>{team.department_count} departments</span>
                  </div>
                </div>

                {/* Team Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Created {new Date(team.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to="/team"
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
                    >
                      <Activity className="w-4 h-4" />
                      View
                    </Link>
                    {(team.userRole === 'owner' || team.userRole === 'admin') && (
                      <button
                        onClick={() => handleEditTeam(team)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm"
                      >
                        <Settings className="w-4 h-4" />
                        Manage
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Team Modal */}
        <TeamModal
          isOpen={showTeamModal}
          onClose={() => {
            setShowTeamModal(false)
            setEditingTeam(null)
          }}
          onTeamCreated={handleTeamCreated}
          onTeamUpdated={handleTeamUpdated}
          team={editingTeam}
        />
      </div>
    </div>
  )
}

export const Component = Teams
