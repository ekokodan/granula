import React, { useState, useEffect } from 'react'
import { X, Calendar, Users, Flag, FileText, FolderOpen } from 'lucide-react'
import { apiClient, Task, Project } from '../utils/api'
import { authStore } from '@/store/auth'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onTaskCreated?: (task: Task) => void
  onTaskUpdated?: (task: Task) => void
  task?: Task | null
  projects: Project[]
}

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

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onTaskCreated,
  onTaskUpdated,
  task,
  projects
}) => {
  const { user } = authStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    status: 'pending' as 'pending' | 'in_progress' | 'completed' | 'cancelled',
    due_date: '',
    project_id: '',
    assigned_to: '',
    department_id: ''
  })

  // Initialize form data when task prop changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status || 'pending',
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
        project_id: task.project_id?.toString() || '',
        assigned_to: task.assigned_to?.toString() || '',
        department_id: task.department_id?.toString() || ''
      })
    } else {
      // Reset form for new task
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        due_date: '',
        project_id: projects[0]?.id?.toString() || '',
        assigned_to: '',
        department_id: ''
      })
    }
  }, [task, projects])

  // Load team members when project changes
  useEffect(() => {
    const loadTeamMembers = async () => {
      if (formData.project_id) {
        try {
          const project = projects.find(p => p.id.toString() === formData.project_id)
          if (project) {
            const response = await apiClient.getTeamMembers(project.team_id)
            setTeamMembers(response.members || [])
          }
        } catch (err) {
          console.error('Failed to load team members:', err)
          setTeamMembers([])
        }
      }
    }

    if (formData.project_id) {
      loadTeamMembers()
    }
  }, [formData.project_id, projects])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        status: formData.status,
        project_id: parseInt(formData.project_id),
        assigned_to: formData.assigned_to ? parseInt(formData.assigned_to) : undefined,
        department_id: formData.department_id ? parseInt(formData.department_id) : undefined,
        due_date: formData.due_date || undefined
      }

      if (task) {
        // Update existing task
        const updatedTask = await apiClient.updateTask(task.id, taskData)
        onTaskUpdated?.(updatedTask)
      } else {
        // Create new task
        const newTask = await apiClient.createTask(taskData)
        onTaskCreated?.(newTask)
      }
      
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save task')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* No Projects Warning */}
          {projects.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                <div>
                  <p className="font-medium">No projects found</p>
                  <p className="text-sm">You need to create a project before you can create tasks. Projects help organize your tasks within teams.</p>
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#987628] focus:border-transparent"
              placeholder="Enter task title..."
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#987628] focus:border-transparent"
              placeholder="Enter task description..."
            />
          </div>

          {/* Project and Priority Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Project */}
            <div>
              <label htmlFor="project_id" className="block text-sm font-medium text-gray-700 mb-2">
                Project *
              </label>
              <select
                id="project_id"
                name="project_id"
                value={formData.project_id}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#987628] focus:border-transparent"
              >
                <option value="">Select a project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                <Flag className="w-4 h-4 inline mr-1" />
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#987628] focus:border-transparent"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          {/* Status and Due Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#987628] focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Due Date
              </label>
              <input
                type="date"
                id="due_date"
                name="due_date"
                value={formData.due_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#987628] focus:border-transparent"
              />
            </div>
          </div>

          {/* Assigned To */}
          <div>
            <label htmlFor="assigned_to" className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Assign To
            </label>
            <select
              id="assigned_to"
              name="assigned_to"
              value={formData.assigned_to}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#987628] focus:border-transparent"
            >
              <option value="">Unassigned</option>
              {teamMembers.map(member => (
                <option key={member.user_id} value={member.user_id}>
                  {member.user.email} ({member.role})
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim() || !formData.project_id}
              className="px-6 py-2 bg-[#987628] text-white rounded-md hover:bg-[#7a5f20] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskModal