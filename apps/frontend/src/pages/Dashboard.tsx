import { Search, Bell, ChevronDown, Plus, BarChart3, Calendar, AlertCircle, Settings as SettingsIcon, Home, Users, Activity, FolderOpen, CheckSquare, Settings, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { authStore } from '@/store/auth'
import TaskModal from '../components/TaskModal'
import TaskCard from '../components/TaskCard'
import ConfirmDialog from '../components/ConfirmDialog'
import ProjectModal from '../components/ProjectModal'
import TeamModal from '../components/TeamModal'
import { Task, Project, Team, DashboardMetrics } from '@/utils/api'

import { apiClient } from '../utils/api'

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [deleteTask, setDeleteTask] = useState<Task | null>(null)
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set())
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { user, accessToken } = authStore()

  useEffect(() => {
    if (accessToken) {
      loadDashboardData()
    } else {
      setLoading(false)
      setError('Please log in to access the dashboard')
    }
  }, [accessToken, refreshTrigger])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [dashboardData, projectsData, teamsData] = await Promise.all([
        apiClient.getDashboardMetrics(),
        apiClient.getProjects(),
        apiClient.getTeams()
      ])
      setMetrics(dashboardData)
      setProjects(projectsData.projects || [])
      setTeams(teamsData.teams || [])
      setError(null)
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
      setError('Failed to load dashboard data. Please check if you are logged in.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = () => {
    setEditingTask(null)
    setShowTaskModal(true)
  }

  const handleAddProject = () => {
    setEditingProject(null)
    setShowProjectModal(true)
  }

  const handleAddTeam = () => {
    setEditingTeam(null)
    setShowTeamModal(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setShowTaskModal(true)
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setShowProjectModal(true)
  }

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team)
    setShowTeamModal(true)
  }

  const handleDeleteTask = (task: Task) => {
    setDeleteTask(task)
  }

  const confirmDeleteTask = async () => {
    if (!deleteTask) return
    
    try {
      await apiClient.deleteTask(deleteTask.id)
      setDeleteTask(null)
      setRefreshTrigger(prev => prev + 1) // Refresh dashboard
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const handleStatusChange = async (task: Task, newStatus: string) => {
    try {
      await apiClient.updateTaskStatus(task.id, newStatus)
      setRefreshTrigger(prev => prev + 1) // Refresh dashboard
    } catch (error) {
      console.error('Failed to update task status:', error)
    }
  }

  const handleAssignToMe = async (task: Task) => {
    if (!user) return
    
    try {
      await apiClient.assignTask(task.id, user.id)
      setRefreshTrigger(prev => prev + 1) // Refresh dashboard
    } catch (error) {
      console.error('Failed to assign task:', error)
    }
  }

  const handleTaskCreated = (task: Task) => {
    setShowTaskModal(false)
    setRefreshTrigger(prev => prev + 1) // Refresh dashboard
  }

  const handleTaskUpdated = (task: Task) => {
    setShowTaskModal(false)
    setEditingTask(null)
    setRefreshTrigger(prev => prev + 1) // Refresh dashboard
  }

  const handleProjectCreated = (project: Project) => {
    setShowProjectModal(false)
    setRefreshTrigger(prev => prev + 1) // Refresh dashboard
  }

  const handleProjectUpdated = (project: Project) => {
    setShowProjectModal(false)
    setEditingProject(null)
    setRefreshTrigger(prev => prev + 1) // Refresh dashboard
  }

  const handleTeamCreated = (team: Team) => {
    setShowTeamModal(false)
    setRefreshTrigger(prev => prev + 1) // Refresh dashboard
  }

  const handleTeamUpdated = (team: Team) => {
    setShowTeamModal(false)
    setEditingTeam(null)
    setRefreshTrigger(prev => prev + 1) // Refresh dashboard
  }

  const toggleTaskExpansion = (taskId: number) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev)
      if (newSet.has(taskId)) {
        newSet.delete(taskId)
      } else {
        newSet.add(taskId)
      }
      return newSet
    })
  }

  const renderTaskList = (tasks: Task[], priority: string) => {
    const priorityColors = {
      high: { badge: 'bg-[#C22121]' },
      medium: { badge: 'bg-[#F4B222]' },
      low: { badge: 'bg-[#0041C2]' }
    }

    const colors = priorityColors[priority as keyof typeof priorityColors]

    return (
      <div className="bg-white rounded">
        <div className="flex items-center gap-2 mb-3">
          <div className={`${colors.badge} text-white px-2 py-1 rounded flex items-center gap-1.5`}>
            <AlertCircle className="w-3.5 h-3.5" />
            <span className="font-semibold text-xs">{priority.toUpperCase()} PRIORITY ({tasks.length})</span>
          </div>
          <ChevronDown className="w-4 h-4" />
        </div>
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <div className="text-gray-500 text-xs p-3 text-center">
              No {priority} priority tasks
              <div className="mt-2">
                {projects.length === 0 ? (
                  <div className="space-y-2">
                    <p className="text-[11px] text-gray-400">Create a team and project first</p>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={handleAddTeam}
                        className="text-[#987628] hover:text-[#7a5f20] text-xs font-medium"
                      >
                        Create Team
                      </button>
                      <span className="text-gray-400">•</span>
                      <button
                        onClick={handleAddProject}
                        className="text-[#987628] hover:text-[#7a5f20] text-xs font-medium"
                      >
                        Create Project
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleAddTask}
                    className="text-[#987628] hover:text-[#7a5f20] text-xs font-medium"
                  >
                    Create your first task
                  </button>
                )}
              </div>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                expanded={expandedTasks.has(task.id)}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
                onAssign={handleAssignToMe}
                onToggleExpand={() => toggleTaskExpansion(task.id)}
              />
            ))
          )}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF1DD] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#987628]"></div>
          <p className="mt-4 text-[#987628]">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF1DD] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="bg-[#987628] text-white px-4 py-2 rounded hover:bg-[#7a5f20]"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF1DD] flex">
      {/* Sidebar */}
      <div className="w-[260px] bg-white border-r border-black/30 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-black/30">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gold-gradient rounded-full" />
            <span className="text-lg font-semibold">Granula</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <nav className="space-y-1.5">
            {/* Dashboard - Active */}
            <div className="flex items-center gap-2.5 px-3 py-2 bg-[#FAF1DD] rounded-full text-[#987628]">
              <Home className="w-4 h-4" />
              <span className="font-medium text-xs">Dashboard</span>
            </div>

            {/* Other nav items */}
            <Link to="/schedule" className="flex items-center gap-2.5 px-3 py-2 text-black/50 hover:text-black transition-colors">
              <Calendar className="w-4 h-4" />
              <span className="text-xs">Schedule</span>
            </Link>
            <div className="flex items-center gap-2.5 px-3 py-2 text-black/50 hover:text-black transition-colors">
              <CheckSquare className="w-4 h-4" />
              <span className="text-xs">Meeting</span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 text-black/50 hover:text-black transition-colors">
              <Activity className="w-4 h-4" />
              <span className="text-xs">Activity</span>
            </div>
            <Link to="/team" className="flex items-center gap-2.5 px-3 py-2 text-black/50 hover:text-black transition-colors">
              <Users className="w-4 h-4" />
              <span className="text-xs">Team</span>
            </Link>

            {/* Divider */}
            <div className="h-px bg-black my-4" />

            {/* Teams */}
            <div className="flex items-center justify-between mb-3">
              <div className="text-black/60 font-medium text-sm">Teams</div>
              <button
                onClick={handleAddTeam}
                className="p-1 text-[#987628] hover:text-[#7a5f20] transition-colors"
                title="Create team"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-1 mb-4">
              {teams.length === 0 ? (
                <div className="text-gray-500 text-[11px] p-3">
                  No teams found
                  <div className="mt-2">
                    <button
                      onClick={handleAddTeam}
                      className="text-[#987628] hover:text-[#7a5f20] text-xs font-medium"
                    >
                      Create your first team
                    </button>
                  </div>
                </div>
              ) : (
                teams.slice(0, 3).map((team) => (
                  <div 
                    key={team.id} 
                    className="flex items-center gap-2.5 px-3 py-2 text-black/50 hover:text-black transition-colors cursor-pointer"
                    onClick={() => handleEditTeam(team)}
                  >
                    <Users className="w-4 h-4" />
                    <span className="text-[11px] flex-1">{team.name}</span>
                    <span className="text-[11px] text-gray-400">{team.member_count}</span>
                  </div>
                ))
              )}
            </div>

            {/* Projects */}
            <div className="flex items-center justify-between mb-3">
              <div className="text-black/60 font-medium text-sm">Projects</div>
              <button
                onClick={handleAddProject}
                className="p-1 text-[#987628] hover:text-[#7a5f20] transition-colors"
                title="Create project"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-1">
              {projects.length === 0 ? (
                <div className="text-gray-500 text-[11px] p-3">
                  No projects found
                  <div className="mt-2">
                    <button
                      onClick={handleAddProject}
                      className="text-[#987628] hover:text-[#7a5f20] text-xs font-medium"
                    >
                      Create your first project
                    </button>
                  </div>
                </div>
              ) : (
                projects.slice(0, 3).map((project) => (
                  <div 
                    key={project.id} 
                    className="flex items-center gap-2.5 px-3 py-2 text-black/50 hover:text-black transition-colors cursor-pointer"
                    onClick={() => handleEditProject(project)}
                  >
                    <FolderOpen className="w-4 h-4" />
                    <span className="text-[11px] flex-1">{project.name}</span>
                    <span className="text-[11px] text-gray-400">{project.task_count}</span>
                  </div>
                ))
              )}
            </div>
          </nav>
        </div>

        {/* Bottom section */}
        <div className="p-4 space-y-3">
          {/* User Card */}
          <div className="bg-gradient-to-br from-[#E5BB57] to-[#F9F1EB] rounded p-3 relative overflow-hidden">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-6 h-6 bg-[#987628] rounded-full flex items-center justify-center">
                <div className="w-3.5 h-3.5 bg-white rounded-full" />
              </div>
              <div>
                <div className="text-[#987628] text-xs">Current user:</div>
                <div className="text-[#987628] font-semibold text-xs">{user?.email || 'Loading...'}</div>
              </div>
            </div>
            <button className="bg-white text-[#987628] px-3 py-1.5 rounded text-xs font-medium">
              Switch Account
            </button>
          </div>

          {/* Settings */}
          <div className="flex items-center gap-2.5 px-3 py-2 text-black/50 hover:text-black transition-colors">
            <SettingsIcon className="w-4 h-4" />
            <span className="text-[11px]">Settings</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-black/30 px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Search */}
            <div className="flex items-center gap-2.5 bg-[#FAF1DD]/40 rounded-full px-3 py-2 w-[320px] md:w-[420px]">
              <Search className="w-4 h-4 text-black/50" />
              <span className="text-black/50 text-xs">Search</span>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-4">
              <button className="w-7 h-7 border border-black/10 rounded-full flex items-center justify-center shadow-lg">
                <Bell className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-gray-300 rounded-full" />
                  <span className="text-xs">{user?.email || 'Loading...'}</span>
                </div>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-4">
          <div className="bg-white rounded p-4 h-full">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Tasks Completed */}
              <div className="border border-[#987628] rounded-lg p-4 relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-8 h-8 bg-[#987628] rounded-full flex items-center justify-center">
                    <CheckSquare className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-light">
                    +10.5%
                  </div>
                </div>
                <div className="text-3xl font-medium mb-1">{metrics?.tasks_completed || 0}</div>
                <div className="text-[#987628] text-[11px] font-medium">Tasks Completed</div>
              </div>

              {/* Tasks Pending */}
              <div className="border border-[#987628] rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-8 h-8 bg-[#987628] rounded-full flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-light">
                    -5.2%
                  </div>
                </div>
                <div className="text-3xl font-medium mb-1">{metrics?.tasks_pending || 0}</div>
                <div className="text-black/60 text-[11px] font-light">Tasks Pending</div>
              </div>

              {/* Task Completion Rate */}
              <div className="border border-[#987628] rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-8 h-8 bg-[#987628] rounded-full flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-[#F4B222] text-white px-2 py-0.5 rounded text-xs font-light">
                    Today
                  </div>
                </div>
                <div className="text-3xl font-medium mb-1">{metrics?.completion_rate || 0}%</div>
                <div className="text-black/60 text-[11px] font-light">Task completion rate</div>
              </div>
            </div>

            {/* Task Filters and Add Task */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-6">
                {/* Priority Filter */}
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 bg-[#E5ECF9] rounded-full flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-[#987628]" />
                  </div>
                  <span className="font-semibold text-[11px]">PRIORITY</span>
                  <div className="w-4 h-4 bg-[#987628] rounded-full flex items-center justify-center text-white text-[10px] font-semibold">
                    {metrics?.high_priority_count || 0}
                  </div>
                </div>

                {/* Date Filter */}
                <div className="flex items-center gap-2.5 opacity-50">
                  <div className="w-6 h-6 bg-[#E5ECF9] rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-[11px]">DATE</span>
                  <div className="w-4 h-4 bg-[#987628] rounded-full flex items-center justify-center text-white text-[10px] font-semibold">
                    {metrics?.medium_priority_count || 0}
                  </div>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2.5 opacity-50">
                  <div className="w-6 h-6 bg-[#E5ECF9] rounded-full flex items-center justify-center">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-[11px]">STATUS</span>
                  <div className="w-4 h-4 bg-[#987628] rounded-full flex items-center justify-center text-white text-[10px] font-semibold">
                    {(metrics?.tasks_completed || 0) + (metrics?.tasks_pending || 0)}
                  </div>
                </div>
              </div>

              {/* Add Task */}
              <button 
                onClick={handleAddTask}
                disabled={projects.length === 0}
                className="flex items-center gap-1.5 text-[#987628] hover:text-[#7a5f20] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={projects.length === 0 ? "Create a project first to add tasks" : "Add Task"}
              >
                <Plus className="w-4 h-4" />
                <span className="text-xs">Add Task</span>
              </button>
            </div>

            <div className="h-px bg-[#F9F1EB] mb-4" />

            {/* Task Lists */}
            <div className="space-y-4">
              {/* High Priority */}
              {renderTaskList(metrics?.tasks_by_priority?.high || [], 'high')}

              {/* Medium Priority */}
              {renderTaskList(metrics?.tasks_by_priority?.medium || [], 'medium')}

              {/* Low Priority */}
              {renderTaskList(metrics?.tasks_by_priority?.low || [], 'low')}
            </div>
          </div>
        </div>
      </div>

      {/* AI Chatbox */}
      <div className="fixed bottom-0 right-0 w-[360px] h-[560px] bg-white shadow-lg rounded-t border translate-y-[500px] hover:translate-y-0 transition-transform duration-300">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-[#E8B145] to-[#C97535] p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-gray-300 rounded-full border border-white" />
              <span className="text-white text-sm font-semibold">Aisha AI</span>
            </div>
            <div className="flex gap-2">
              <button className="w-4 h-4 text-white/60">
                <Settings className="w-4 h-4" />
              </button>
              <button className="w-4 h-4 text-white/60">
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Content */}
        <div className="p-3 flex-1">
          {/* AI Message */}
          <div className="flex gap-2.5 mb-4">
            <div className="w-6 h-6 bg-white border border-[#C56E33] rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-[#C56E33] rounded-full" />
            </div>
            <div className="bg-white shadow-lg rounded p-3 max-w-sm">
              <div className="text-black/60 text-xs mb-0.5">Hello, Benedict</div>
              <div className="text-black/60 text-xs leading-relaxed">
                I can see you have {metrics?.tasks_pending || 0} pending tasks with {metrics?.high_priority_count || 0} high priority items. 
                Would you like me to help you prioritize them or schedule some time to work on them?
              </div>
            </div>
          </div>
        </div>

        {/* Quick Suggestions */}
        <div className="p-3 border-t border-[#C56E33]/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 text-[#C56E33]">💡</div>
            <span className="text-[#C56E33] font-medium text-xs">Quick Suggestion</span>
          </div>
          <div className="space-y-1.5 text-xs opacity-50">
            <div>📊 Analyse recent task completion</div>
            <div>📅 Schedule meeting based on high priority tasks</div>
            <div>📈 Check team performance report</div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-3">
          <div className="border border-black/24 rounded-full px-3 py-2">
            <input
              type="text"
              placeholder="Ask about your tasks or team..."
              className="w-full text-xs text-black/30 bg-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false)
          setEditingTask(null)
        }}
        onTaskCreated={handleTaskCreated}
        onTaskUpdated={handleTaskUpdated}
        task={editingTask}
        projects={projects}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTask}
        onClose={() => setDeleteTask(null)}
        onConfirm={confirmDeleteTask}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteTask?.title}"?\n\nThis action cannot be undone.`}
        confirmText="Delete Task"
        type="danger"
      />

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
  )
}

export const Component = Dashboard
