// API utility functions for the task management system
import { authStore } from '@/store/auth'

const API_BASE_URL = 'http://localhost:5002/api'

// Types
export interface User {
  id: number
  email: string
  role: string
  is_verified: boolean
  onboarding_complete: boolean
}

export interface LoginResponse {
  access_token: string
  user: User
}

export interface Task {
  id: number
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  due_date?: string
  assigned_to?: number
  project_id: number
  department_id?: number
  created_at: string
  updated_at: string
  completed_at?: string
  assignee?: User
  creator?: User
}

export interface Team {
  id: number
  name: string
  description: string
  created_by: number
  created_at: string
  updated_at: string
  member_count: number
  department_count: number
}

export interface Project {
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

export interface DashboardMetrics {
  tasks_completed: number
  tasks_pending: number
  completion_rate: number
  high_priority_count: number
  medium_priority_count: number
  low_priority_count: number
  tasks_by_priority: {
    high: Task[]
    medium: Task[]
    low: Task[]
  }
}

// API Client Class
export class ApiClient {
  private getAuthHeaders(): HeadersInit {
    const token = authStore.getState().accessToken
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options
    }

    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(errorData.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Auth methods
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
    
    // Store token and user in authStore
    authStore.getState().setAccessToken(response.access_token)
    authStore.getState().setUser(response.user)
    return response
  }

  async register(email: string, password: string): Promise<{ message: string }> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' })
    } finally {
      authStore.getState().logout()
    }
  }

  async getCurrentUser(): Promise<{ user: User }> {
    return this.request('/auth/me')
  }

  // Dashboard methods
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return this.request('/insights/dashboard')
  }

  async getTeamActivity(): Promise<any> {
    return this.request('/insights/team-activity')
  }

  async getPerformanceSummary(): Promise<any> {
    return this.request('/insights/performance-summary')
  }

  // Task methods
  async getTasks(filters?: {
    priority?: string
    status?: string
    assigned_to_me?: boolean
    project_id?: number
    department_id?: number
  }): Promise<{ tasks: Task[], total: number }> {
    const queryParams = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }
    const endpoint = `/tasks/${queryParams.toString() ? '?' + queryParams.toString() : ''}`
    return this.request(endpoint)
  }

  async createTask(taskData: Partial<Task>): Promise<Task> {
    return this.request('/tasks/', {
      method: 'POST',
      body: JSON.stringify(taskData)
    })
  }

  async updateTask(id: number, taskData: Partial<Task>): Promise<Task> {
    return this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData)
    })
  }

  async deleteTask(id: number): Promise<{ message: string }> {
    return this.request(`/tasks/${id}`, { method: 'DELETE' })
  }

  async assignTask(id: number, userId: number): Promise<Task> {
    return this.request(`/tasks/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ assigned_to: userId })
    })
  }

  async updateTaskStatus(id: number, status: string): Promise<Task> {
    return this.request(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    })
  }

  async getTask(id: number): Promise<Task> {
    return this.request(`/tasks/${id}`)
  }

  async getTeamMembers(teamId: number): Promise<{ members: any[] }> {
    return this.request(`/teams/${teamId}/members`)
  }

  // Team methods
  async getTeams(): Promise<{ teams: Team[] }> {
    return this.request('/teams/')
  }

  async createTeam(teamData: { name: string, description?: string }): Promise<Team> {
    return this.request('/teams/', {
      method: 'POST',
      body: JSON.stringify(teamData)
    })
  }

  async getTeam(id: number): Promise<Team> {
    return this.request(`/teams/${id}`)
  }

  async addTeamMember(teamId: number, email: string, role: string = 'member'): Promise<any> {
    return this.request(`/teams/${teamId}/members`, {
      method: 'POST',
      body: JSON.stringify({ email, role })
    })
  }

  async updateTeam(id: number, teamData: { name?: string, description?: string }): Promise<Team> {
    return this.request(`/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(teamData)
    })
  }

  async removeTeamMember(teamId: number, userId: number): Promise<{ message: string }> {
    return this.request(`/teams/${teamId}/members/${userId}`, { method: 'DELETE' })
  }

  async updateMemberRole(teamId: number, userId: number, role: string): Promise<any> {
    return this.request(`/teams/${teamId}/members/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role })
    })
  }

  // Team invitation methods
  async inviteToTeam(teamId: number, email: string, role: string = 'member'): Promise<any> {
    return this.request(`/teams/${teamId}/invite`, {
      method: 'POST',
      body: JSON.stringify({ email, role })
    })
  }

  async getTeamInvitations(teamId: number): Promise<{ invitations: any[] }> {
    return this.request(`/teams/${teamId}/invitations`)
  }

  async resendInvitation(invitationId: number): Promise<any> {
    return this.request(`/teams/invitations/${invitationId}/resend`, {
      method: 'POST'
    })
  }

  async revokeInvitation(invitationId: number): Promise<{ message: string }> {
    return this.request(`/teams/invitations/${invitationId}/revoke`, {
      method: 'DELETE'
    })
  }

  // Project methods
  async getProjects(): Promise<{ projects: Project[] }> {
    return this.request('/projects/')
  }

  async createProject(projectData: { 
    name: string
    team_id: number
    description?: string 
    due_date?: string
  }): Promise<Project> {
    return this.request('/projects/', {
      method: 'POST',
      body: JSON.stringify(projectData)
    })
  }

  async getProject(id: number): Promise<Project> {
    return this.request(`/projects/${id}`)
  }

  async updateProject(id: number, projectData: Partial<Project>): Promise<Project> {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData)
    })
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Helper functions
export const isAuthenticated = (): boolean => {
  return !!authStore.getState().accessToken
}

export const getToken = (): string | null => {
  return authStore.getState().accessToken
}

export const clearAuth = (): void => {
  authStore.getState().logout()
}