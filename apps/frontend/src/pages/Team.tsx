import { Search, Bell, ChevronDown, User, Users2, Settings as SettingsIcon, Home, Calendar, Activity, FolderOpen, CheckSquare, ArrowUpDown, MoreHorizontal, Plus, Crown, Shield, Edit, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { authStore } from '@/store/auth'
import { apiClient } from '../utils/api'
import TeamModal from '../components/TeamModal'

interface TeamMember {
  id: number
  user_id: number
  role: string
  user: {
    id: number
    email: string
    role: string
  }
}

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

interface Project {
  id: number
  name: string
  description: string
  status: string
  team_id: number
  task_count: number
  created_at: string
}

export default function Team() {
  const { user } = authStore()
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [teamProjects, setTeamProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'members' | 'projects'>('members')
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Load teams on component mount
  useEffect(() => {
    loadTeams()
  }, [refreshTrigger])

  // Load team details when selected team changes
  useEffect(() => {
    if (selectedTeam) {
      loadTeamDetails()
    }
  }, [selectedTeam, refreshTrigger])

  const loadTeams = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getTeams()
      const teamsData = response.teams || []
      setTeams(teamsData)
      
      // Auto-select first team if none selected
      if (teamsData.length > 0 && !selectedTeam) {
        setSelectedTeam(teamsData[0])
      }
      setError(null)
    } catch (err) {
      console.error('Failed to load teams:', err)
      setError('Failed to load teams')
    } finally {
      setLoading(false)
    }
  }

  const loadTeamDetails = async () => {
    if (!selectedTeam) return

    try {
      const [membersResponse, projectsResponse] = await Promise.all([
        apiClient.getTeamMembers(selectedTeam.id),
        apiClient.getProjects().then(response => ({
          projects: response.projects.filter((p: Project) => p.team_id === selectedTeam.id)
        }))
      ])
      
      setTeamMembers(membersResponse.members || [])
      setTeamProjects(projectsResponse.projects || [])
    } catch (err) {
      console.error('Failed to load team details:', err)
      setError('Failed to load team details')
    }
  }

  const handleTeamSelect = (team: Team) => {
    setSelectedTeam(team)
  }

  const handleEditTeam = () => {
    setShowTeamModal(true)
  }

  const handleTeamUpdated = (updatedTeam: Team) => {
    setShowTeamModal(false)
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

  const canManageTeam = () => {
    if (!selectedTeam || !user) return false
    const userMember = teamMembers.find(m => m.user_id === user.id)
    return selectedTeam.created_by === user.id || userMember?.role === 'owner' || userMember?.role === 'admin'
  }

  if (loading && teams.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF1DD] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#987628]"></div>
          <p className="mt-4 text-[#987628]">Loading teams...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF1DD] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadTeams}
            className="bg-[#987628] text-white px-4 py-2 rounded hover:bg-[#7a5f20]"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (teams.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF1DD] flex items-center justify-center">
        <div className="text-center">
          <Users2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No Teams Found</h2>
          <p className="text-gray-500 mb-4">You're not a member of any teams yet.</p>
          <Link 
            to="/teams"
            className="bg-[#987628] text-white px-4 py-2 rounded hover:bg-[#7a5f20] transition-colors"
          >
            Browse Teams
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF1DD] flex">
      {/* Sidebar */}
      <div className="w-[290px] bg-white border-r border-black/30 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-black/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gold-gradient rounded-full" />
            <span className="text-xl font-semibold">Granula</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-6">
          <nav className="space-y-2">
            {/* Dashboard */}
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-black/50 hover:text-black transition-colors">
              <Home className="w-5 h-5" />
              <span className="text-xs">Dashboard</span>
            </Link>

            {/* Schedule */}
            <Link to="/schedule" className="flex items-center gap-3 px-4 py-3 text-black/50 hover:text-black transition-colors">
              <Calendar className="w-5 h-5" />
              <span className="text-xs">Schedule</span>
            </Link>

            {/* Other nav items */}
            <div className="flex items-center gap-3 px-4 py-3 text-black/50 hover:text-black transition-colors">
              <CheckSquare className="w-5 h-5" />
              <span className="text-xs">Meeting</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 text-black/50 hover:text-black transition-colors">
              <Activity className="w-5 h-5" />
              <span className="text-xs">Activity</span>
            </div>

            {/* Team - Active */}
            <div className="flex items-center gap-3 px-4 py-3 bg-[#E5BB57]/20 rounded-full text-[#987628]">
              <Users2 className="w-5 h-5" />
              <span className="font-medium text-xs">Team</span>
            </div>

            {/* Divider */}
            <div className="h-px bg-black my-6" />

            {/* Teams */}
            <div className="text-black/50 font-medium text-lg mb-4">Teams</div>
            <div className="space-y-1 mb-6">
              {teams.map((team) => (
                <div 
                  key={team.id}
                  onClick={() => handleTeamSelect(team)}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer ${
                    selectedTeam?.id === team.id 
                      ? 'bg-[#E5BB57]/20 text-[#987628] rounded-full' 
                      : 'text-black/50 hover:text-black'
                  }`}
                >
                  <Users2 className="w-5 h-5" />
                  <span className="text-xs flex-1 truncate">{team.name}</span>
                  <span className="text-xs text-gray-400">{team.member_count}</span>
                </div>
              ))}
            </div>

            {/* Projects */}
            <div className="text-black/50 font-medium text-lg mb-4">Projects</div>
            <div className="space-y-1">
              {teamProjects.length === 0 ? (
                <div className="text-gray-500 text-xs p-4">
                  {selectedTeam ? 'No projects in this team' : 'Select a team to view projects'}
                </div>
              ) : (
                teamProjects.slice(0, 3).map((project) => (
                  <div key={project.id} className="flex items-center gap-3 px-4 py-3 text-black/50 hover:text-black transition-colors">
                    <FolderOpen className="w-5 h-5" />
                    <span className="text-xs flex-1 truncate">{project.name}</span>
                    <span className="text-xs text-gray-400">{project.task_count}</span>
                  </div>
                ))
              )}
            </div>
          </nav>
        </div>

        {/* Bottom section */}
        <div className="p-6 space-y-4">
          {/* User Card */}
          <div className="bg-gradient-to-br from-[#E5BB57] to-[#F9F1EB] rounded p-4 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 bg-[#987628] rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full" />
              </div>
              <div>
                <div className="text-[#987628] text-xs">Current user:</div>
                <div className="text-[#987628] font-semibold text-xs">{user?.email || 'Loading...'}</div>
              </div>
            </div>
            <button className="bg-white text-[#987628] px-4 py-1.5 rounded text-xs font-medium">
              Switch Account
            </button>
          </div>

          {/* Settings */}
          <div className="flex items-center gap-3 px-4 py-3 text-black/50 hover:text-black transition-colors">
            <SettingsIcon className="w-5 h-5" />
            <span className="text-xs">Settings</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-black/30 px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Team Actions */}
            <div className="flex items-center gap-4">
              {/* Team Selector */}
              <div className="flex items-center gap-3 bg-[#0041C2]/5 rounded-lg px-3 py-2">
                <Users2 className="w-5 h-5 text-[#987628]" />
                <select 
                  value={selectedTeam?.id || ''} 
                  onChange={(e) => {
                    const team = teams.find(t => t.id === parseInt(e.target.value))
                    if (team) handleTeamSelect(team)
                  }}
                  className="bg-transparent text-sm font-medium text-[#987628] outline-none"
                >
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>

              {/* Manage Team Button */}
              {canManageTeam() && (
                <button 
                  onClick={handleEditTeam}
                  className="flex items-center gap-2 px-3 py-2 bg-[#987628] text-white rounded-lg hover:bg-[#7a5f20] transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-xs">Manage Team</span>
                </button>
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-6">
              <button className="w-8 h-8 border border-black/10 rounded-full flex items-center justify-center shadow-lg">
                <Bell className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-5">
                  <div className="w-8 h-8 bg-gray-300 rounded-full" />
                  <span className="text-xs">{user?.email || 'Loading...'}</span>
                </div>
                <ChevronDown className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Team Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-medium">{selectedTeam?.name || 'Team'}</h1>
              {selectedTeam?.description && (
                <p className="text-gray-600 text-sm mt-1">{selectedTeam.description}</p>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{teamMembers.length} members</span>
              <span>•</span>
              <span>{teamProjects.length} projects</span>
            </div>
          </div>

          {/* Team Table Container */}
          <div className="bg-white rounded-lg p-6">
            {/* Tab Navigation */}
            <div className="flex mb-6">
              <button
                onClick={() => setActiveTab('members')}
                className={`flex items-center gap-3 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === 'members' 
                    ? 'border-[#0041C2] text-[#0041C2]' 
                    : 'border-transparent text-gray-500'
                }`}
              >
                <User className="w-6 h-6" />
                <span className="font-semibold text-xs">Members ({teamMembers.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`flex items-center gap-3 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === 'projects' 
                    ? 'border-[#0041C2] text-[#0041C2]' 
                    : 'border-transparent text-gray-500'
                }`}
              >
                <FolderOpen className="w-6 h-6" />
                <span className="text-xs">Projects ({teamProjects.length})</span>
              </button>
            </div>

            {/* Divider line */}
            <div className="h-px bg-black/20 mb-4" />

            {/* Content based on active tab */}
            {activeTab === 'members' ? (
              // Members Tab
              <div className="overflow-x-auto">
                <div className="min-w-[1000px]">
                  {/* Table Headers */}
                  <div className="bg-black/5 h-[59px] flex items-center mb-6">
                    <div className="flex items-center w-full px-6">
                      {/* Name Header */}
                      <div className="flex items-center gap-3 opacity-60 w-[250px]">
                        <span className="text-xs">Member</span>
                      </div>
                      
                      {/* Role Header */}
                      <div className="flex items-center justify-center gap-2 w-[200px]">
                        <span className="text-xs">Role</span>
                      </div>
                      
                      {/* Email Header */}
                      <div className="flex justify-center w-[300px]">
                        <span className="text-xs">Email</span>
                      </div>
                      
                      {/* Status Header */}
                      <div className="flex justify-center w-[150px]">
                        <span className="text-xs">Status</span>
                      </div>
                      
                      {/* Actions Header */}
                      {canManageTeam() && (
                        <div className="flex justify-center w-[100px]">
                          <span className="text-xs opacity-0">Actions</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Team Members List */}
                  <div className="space-y-0">
                    {teamMembers.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <Users2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-sm">No team members found</p>
                        {canManageTeam() && (
                          <button 
                            onClick={handleEditTeam}
                            className="mt-2 text-[#987628] hover:text-[#7a5f20] text-sm font-medium"
                          >
                            Invite members
                          </button>
                        )}
                      </div>
                    ) : (
                      teamMembers.map((member) => (
                        <div key={member.id} className="flex items-center py-[18px] border-b border-black/10 last:border-b-0">
                          <div className="flex items-center w-full px-6">
                            {/* Name with avatar */}
                            <div className="flex items-center gap-3 w-[250px]">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center">
                                  <User className="w-5 h-5 text-gray-600" />
                                </div>
                                <span className="font-medium text-xs truncate">{member.user.email}</span>
                              </div>
                            </div>
                            
                            {/* Role */}
                            <div className="flex justify-center w-[200px]">
                              <div className={`px-4 py-2 rounded-full flex-shrink-0 flex items-center gap-2 ${getRoleColor(member.role)}`}>
                                {getRoleIcon(member.role)}
                                <span className="text-xs whitespace-nowrap capitalize">{member.role}</span>
                              </div>
                            </div>
                            
                            {/* Email */}
                            <div className="flex justify-center w-[300px]">
                              <span className="text-xs truncate text-center max-w-full">{member.user.email}</span>
                            </div>
                            
                            {/* Status */}
                            <div className="flex items-center justify-center gap-2 w-[150px]">
                              <div className="w-2 h-2 bg-[#04CE00] rounded-full flex-shrink-0" />
                              <span className="text-xs whitespace-nowrap">Active</span>
                            </div>
                            
                            {/* Actions */}
                            {canManageTeam() && (
                              <div className="flex justify-center w-[100px]">
                                <button 
                                  onClick={handleEditTeam}
                                  className="p-1 flex-shrink-0 text-gray-400 hover:text-gray-600"
                                  title="Manage member"
                                >
                                  <MoreHorizontal className="w-6 h-6" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // Projects Tab
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamProjects.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-gray-500">
                    <FolderOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm">No projects found in this team</p>
                    {canManageTeam() && (
                      <Link 
                        to="/projects"
                        className="mt-2 inline-block text-[#987628] hover:text-[#7a5f20] text-sm font-medium"
                      >
                        Create a project
                      </Link>
                    )}
                  </div>
                ) : (
                  teamProjects.map((project) => (
                    <div key={project.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-semibold text-sm text-gray-900 truncate">{project.name}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${
                          project.status === 'active' ? 'bg-green-100 text-green-800' :
                          project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      {project.description && (
                        <p className="text-xs text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{project.task_count} tasks</span>
                        <span>{new Date(project.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Team Modal */}
      <TeamModal
        isOpen={showTeamModal}
        onClose={() => setShowTeamModal(false)}
        onTeamUpdated={handleTeamUpdated}
        team={selectedTeam}
      />
    </div>
  )
}

export const Component = Team