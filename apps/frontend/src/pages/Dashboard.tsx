import { Plus, AlertCircle, UserPlus, CheckSquare, FolderOpen, Users, ChevronDown, Edit3, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { authStore } from '@/store/auth'
import AppLayout from '@/components/AppLayout'
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
      <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
        <div className="flex items-center gap-2 p-4 border-b border-gray-100">
          <div className={`${colors.badge} text-white px-3 py-1 rounded-full flex items-center gap-1.5`}>
            <AlertCircle className="w-3.5 h-3.5" />
            <span className="font-semibold text-xs">{priority.toUpperCase()} PRIORITY ({tasks.length})</span>
          </div>
        </div>
        <div className="flex-1 p-4 overflow-hidden">
          {tasks.length === 0 ? (
            <div className="text-gray-500 text-xs text-center h-full flex flex-col justify-center">
              <div className="space-y-3">
                <p>No {priority} priority tasks</p>
                {projects.length === 0 ? (
                  <div className="space-y-2">
                    <p className="text-[11px] text-gray-400">Create a team and project first</p>
                    <div className="flex gap-2 justify-center flex-wrap">
                      <button
                        onClick={handleAddTeam}
                        className="text-[#987628] hover:text-[#7a5f20] text-xs font-medium px-2 py-1 bg-[#FAF1DD] rounded"
                      >
                        Create Team
                      </button>
                      <button
                        onClick={handleAddProject}
                        className="text-[#987628] hover:text-[#7a5f20] text-xs font-medium px-2 py-1 bg-[#FAF1DD] rounded"
                      >
                        Create Project
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleAddTask}
                    className="text-[#987628] hover:text-[#7a5f20] text-xs font-medium px-3 py-2 bg-[#FAF1DD] rounded"
                  >
                    Create your first task
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {tasks.slice(0, 8).map((task) => (
                <div key={task.id} className="group">
                  <TaskCard
                    task={task}
                    expanded={expandedTasks.has(task.id)}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                    onAssign={handleAssignToMe}
                    onToggleExpand={() => toggleTaskExpansion(task.id)}
                  />
                </div>
              ))}
              {tasks.length > 8 && (
                <div className="text-center py-2">
                  <button className="text-sm text-[#987628] hover:text-[#7a5f20] font-medium">
                    View {tasks.length - 8} more tasks
                  </button>
                </div>
              )}
            </div>
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
    <AppLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening with your projects.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddTeam}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-black/10 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Team</span>
            </button>
            <button
              onClick={handleAddProject}
              className="flex items-center gap-2 px-3 py-2 bg-[#987628] text-white rounded-lg hover:bg-[#7a5f20] transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-black/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Tasks</p>
                <p className="text-2xl font-semibold">
                  {metrics ? metrics.tasks_completed + metrics.tasks_pending : 0}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckSquare className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-black/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-semibold">{metrics?.tasks_completed || 0}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckSquare className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-black/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Projects</p>
                <p className="text-2xl font-semibold">{projects.length}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-black/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Team Members</p>
                <p className="text-2xl font-semibold">{teams.length}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Overdue Tasks Section */}
        {metrics && metrics.tasks_by_priority && (
          (() => {
            const allTasks = [
              ...metrics.tasks_by_priority.high,
              ...metrics.tasks_by_priority.medium,
              ...metrics.tasks_by_priority.low
            ]
            const overdueTasks = allTasks.filter(task => {
              if (!task.due_date || task.status === 'completed') return false
              return new Date(task.due_date) < new Date()
            })
            
            return overdueTasks.length > 0 ? (
              <div className="mb-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-semibold text-sm">OVERDUE ({overdueTasks.length})</span>
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {overdueTasks.slice(0, 5).map((task) => (
                      <div key={task.id} className="bg-white rounded-lg border border-red-200 p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-gray-900 truncate">
                              {task.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-red-600">
                                Due: {new Date(task.due_date!).toLocaleDateString()}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                task.priority === 'high' ? 'bg-red-100 text-red-700' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {task.priority.toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            <button
                              onClick={() => handleEditTask(task)}
                              className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                              title="Edit task"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(task, 'completed')}
                              className="p-1 text-green-600 hover:bg-green-100 rounded"
                              title="Mark complete"
                            >
                              <CheckCircle className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {overdueTasks.length > 5 && (
                      <div className="text-center text-sm text-gray-500 py-2">
                        +{overdueTasks.length - 5} more overdue tasks
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null
          })()
        )}

        {/* Task Priorities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xl:gap-6 min-h-0">
          {metrics && (
            <>
              {renderTaskList(metrics.tasks_by_priority.high, 'high')}
              {renderTaskList(metrics.tasks_by_priority.medium, 'medium')}
              {renderTaskList(metrics.tasks_by_priority.low, 'low')}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {showTaskModal && (
        <TaskModal
          task={editingTask}
          projects={projects}
          onSave={editingTask ? handleTaskUpdated : handleTaskCreated}
          onClose={() => {
            setShowTaskModal(false)
            setEditingTask(null)
          }}
        />
      )}

      {showProjectModal && (
        <ProjectModal
          project={editingProject}
          teams={teams}
          onSave={editingProject ? handleProjectUpdated : handleProjectCreated}
          onClose={() => {
            setShowProjectModal(false)
            setEditingProject(null)
          }}
        />
      )}

      {showTeamModal && (
        <TeamModal
          team={editingTeam}
          onSave={editingTeam ? handleTeamUpdated : handleTeamCreated}
          onClose={() => {
            setShowTeamModal(false)
            setEditingTeam(null)
          }}
        />
      )}

      {deleteTask && (
        <ConfirmDialog
          title="Delete Task"
          message={`Are you sure you want to delete "${deleteTask.title}"?`}
          onConfirm={confirmDeleteTask}
          onCancel={() => setDeleteTask(null)}
        />
      )}
    </AppLayout>
  )
}

export const Component = Dashboard
