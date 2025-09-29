import React, { useState, useEffect } from 'react'
import { X, Calendar, Users, FolderOpen, FileText } from 'lucide-react'
import { apiClient, Project, Team } from '../utils/api'

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onProjectCreated?: (project: Project) => void
  onProjectUpdated?: (project: Project) => void
  project?: Project | null
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onProjectCreated,
  onProjectUpdated,
  project
}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    team_id: '',
    due_date: '',
    status: 'active' as 'active' | 'completed' | 'on_hold'
  })

  // Load teams on mount
  useEffect(() => {
    const loadTeams = async () => {
      try {
        const response = await apiClient.getTeams()
        setTeams(response.teams || [])
      } catch (err) {
        console.error('Failed to load teams:', err)
        setError('Failed to load teams. Please create a team first.')
      }
    }

    if (isOpen) {
      loadTeams()
    }
  }, [isOpen])

  // Initialize form data when project prop changes
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        team_id: project.team_id?.toString() || '',
        due_date: project.due_date ? project.due_date.split('T')[0] : '',
        status: project.status || 'active'
      })
    } else {
      // Reset form for new project
      setFormData({
        name: '',
        description: '',
        team_id: teams[0]?.id?.toString() || '',
        due_date: '',
        status: 'active'
      })
    }
  }, [project, teams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const projectData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        team_id: parseInt(formData.team_id),
        status: formData.status,
        due_date: formData.due_date || undefined
      }

      if (project) {
        // Update existing project
        const updatedProject = await apiClient.updateProject(project.id, projectData)
        onProjectUpdated?.(updatedProject)
      } else {
        // Create new project
        const newProject = await apiClient.createProject(projectData)
        onProjectCreated?.(newProject)
      }
      
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project')
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
            {project ? 'Edit Project' : 'Create New Project'}
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

          {/* No Teams Warning */}
          {teams.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <div>
                  <p className="font-medium">No teams found</p>
                  <p className="text-sm">You need to be a member of at least one team to create projects.</p>
                </div>
              </div>
            </div>
          )}

          {/* Project Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              <FolderOpen className="w-4 h-4 inline mr-1" />
              Project Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#987628] focus:border-transparent"
              placeholder="Enter project name..."
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
              placeholder="Enter project description..."
            />
          </div>

          {/* Team and Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Team */}
            <div>
              <label htmlFor="team_id" className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Team *
              </label>
              <select
                id="team_id"
                name="team_id"
                value={formData.team_id}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#987628] focus:border-transparent"
              >
                <option value="">Select a team</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

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
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>
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
              disabled={loading || !formData.name.trim() || !formData.team_id || teams.length === 0}
              className="px-6 py-2 bg-[#987628] text-white rounded-md hover:bg-[#7a5f20] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProjectModal