import { Search, Plus, FolderOpen, Settings, Users, Calendar, BarChart3, Clock, Filter, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { authStore } from '@/store/auth'
import { apiClient } from '../utils/api'
import ProjectModal from '../components/ProjectModal'

interface Team {
  id: number
  name: string
  description: string
  created_by: number
  member_count: number
  department_count: number
}

interface Project {
  id: number
  name: string
  description: string
  status: string
  team_id: number
  created_by: number
  created_at: string
  updated_at: string
  due_date?: string
  completed_at?: string
  task_count: number
}

interface ProjectWithTeam extends Project {
  team?: Team
  userCanManage?: boolean
}

export default function Projects() {
  const { user } = authStore()
  const [projects, setProjects] = useState<ProjectWithTeam[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [teamFilter, setTeamFilter] = useState<string>('all')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    loadData()
  }, [refreshTrigger])

  const loadData = async () => {
    try {
      setLoading(true)
      const [projectsResponse, teamsResponse] = await Promise.all([
        apiClient.getProjects(),
        apiClient.getTeams()
      ])
      
      const projectsData = projectsResponse.projects || []
      const teamsData = teamsResponse.teams || []
      setTeams(teamsData)
      
      // Enrich projects with team data and permissions
      const projectsWithTeams = await Promise.all(
        projectsData.map(async (project: Project) => {
          const team = teamsData.find((t: Team) => t.id === project.team_id)
          
          // Check if user can manage this project
          let userCanManage = false
          if (team && user) {
            try {
              const membersResponse = await apiClient.getTeamMembers(team.id)
              const userMember = membersResponse.members?.find((m: any) => m.user_id === user.id)
              userCanManage = team.created_by === user.id || userMember?.role === 'owner' || userMember?.role === 'admin'
            } catch (err) {
              userCanManage = false
            }
          }
          
          return {
            ...project,
            team,
            userCanManage
          }
        })
      )
      
      setProjects(projectsWithTeams)
      setError(null)
    } catch (err) {
      console.error('Failed to load projects:', err)
      setError('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = () => {
    setEditingProject(null)
    setShowProjectModal(true)
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setShowProjectModal(true)
  }

  const handleProjectCreated = () => {
    setShowProjectModal(false)
    setRefreshTrigger(prev => prev + 1)
  }

  const handleProjectUpdated = () => {
    setShowProjectModal(false)
    setEditingProject(null)
    setRefreshTrigger(prev => prev + 1)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'on_hold': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '🟢'
      case 'completed': return '✅'
      case 'on_hold': return '⏸️'
      default: return '⚪'
    }
  }

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date() && projects.find(p => p.due_date === dueDate)?.status !== 'completed'
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.team?.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    const matchesTeam = teamFilter === 'all' || project.team_id.toString() === teamFilter
    
    return matchesSearch && matchesStatus && matchesTeam
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
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
            onClick={loadData}
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
              <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
              <p className="mt-2 text-gray-600">Organize and track your team projects</p>
            </div>
            <button
              onClick={handleCreateProject}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Project
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          {/* Team Filter */}
          <div className="relative">
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Teams</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            {projects.length === 0 ? (
              // No projects at all
              <div>
                <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                <p className="text-gray-500 mb-6">Create your first project to start organizing tasks</p>
                <button
                  onClick={handleCreateProject}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Project
                </button>
              </div>
            ) : (
              // No projects match filters
              <div>
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-500">Try adjusting your search terms or filters</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                {/* Project Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{project.name}</h3>
                    {project.team && (
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {project.team.name}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(project.status)}`}>
                      <span>{getStatusIcon(project.status)}</span>
                      <span className="capitalize">{project.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>

                {/* Project Description */}
                {project.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                )}

                {/* Project Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <BarChart3 className="w-4 h-4" />
                    <span>{project.task_count} tasks</span>
                  </div>
                  {project.due_date && (
                    <div className={`flex items-center gap-1 ${isOverdue(project.due_date) ? 'text-red-600' : ''}`}>
                      <Calendar className="w-4 h-4" />
                      <span>
                        Due {new Date(project.due_date).toLocaleDateString()}
                        {isOverdue(project.due_date) && ' (Overdue)'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Progress Bar (if has tasks) */}
                {project.task_count > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{project.status === 'completed' ? '100%' : '0%'}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          project.status === 'completed' ? 'bg-green-500 w-full' : 'bg-blue-500 w-0'
                        }`}
                      />
                    </div>
                  </div>
                )}

                {/* Project Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Created {new Date(project.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/dashboard`}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
                    >
                      <BarChart3 className="w-4 h-4" />
                      View Tasks
                    </Link>
                    {project.userCanManage && (
                      <button
                        onClick={() => handleEditProject(project)}
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

        {/* Project Modal */}
        <ProjectModal
          isOpen={showProjectModal}
          onClose={() => {
            setShowProjectModal(false)
            setEditingProject(null)
          }}
          onProjectCreated={handleProjectCreated}
          onProjectUpdated={handleProjectUpdated}
          project={editingProject}
        />
      </div>
    </div>
  )
}

export const Component = Projects
