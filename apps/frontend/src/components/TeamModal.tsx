import React, { useState, useEffect } from 'react'
import { X, Users, Mail, UserPlus, Crown, Shield, User, Trash2, FileText, Clock, RefreshCw } from 'lucide-react'
import { apiClient, Team } from '../utils/api'
import { authStore } from '@/store/auth'

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

interface TeamInvitation {
  id: number
  email: string
  role: string
  status: string
  created_at: string
  expires_at: string
  inviter: {
    email: string
  }
}

interface TeamModalProps {
  isOpen: boolean
  onClose: () => void
  onTeamCreated?: (team: Team) => void
  onTeamUpdated?: (team: Team) => void
  team?: Team | null
}

export const TeamModal: React.FC<TeamModalProps> = ({
  isOpen,
  onClose,
  onTeamCreated,
  onTeamUpdated,
  team
}) => {
  const { user } = authStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'details' | 'members'>('details')
  const [members, setMembers] = useState<TeamMember[]>([])
  const [invitations, setInvitations] = useState<TeamInvitation[]>([])
  const [inviteLoading, setInviteLoading] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  // Invite form state
  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'member' as 'admin' | 'member'
  })

  // Initialize form data when team prop changes
  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name || '',
        description: team.description || ''
      })
      setActiveTab('details')
      loadTeamMembers()
    } else {
      // Reset form for new team
      setFormData({
        name: '',
        description: ''
      })
      setMembers([])
      setInvitations([])
      setActiveTab('details')
    }
  }, [team, isOpen])

  const loadTeamMembers = async () => {
    if (!team) return
    
    try {
      const [membersResponse, invitationsResponse] = await Promise.all([
        apiClient.getTeamMembers(team.id),
        apiClient.getTeamInvitations(team.id)
      ])
      setMembers(membersResponse.members || [])
      setInvitations(invitationsResponse.invitations || [])
    } catch (err) {
      console.error('Failed to load team data:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const teamData = {
        name: formData.name.trim(),
        description: formData.description.trim()
      }

      if (team) {
        // Update existing team
        const updatedTeam = await apiClient.updateTeam(team.id, teamData)
        onTeamUpdated?.(updatedTeam)
      } else {
        // Create new team
        const newTeam = await apiClient.createTeam(teamData)
        onTeamCreated?.(newTeam)
      }
      
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save team')
    } finally {
      setLoading(false)
    }
  }

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!team) return

    setInviteLoading(true)
    setError(null)

    try {
      // Try to send email invitation first
      try {
        await apiClient.inviteToTeam(team.id, inviteData.email, inviteData.role)
        setInviteData({ email: '', role: 'member' })
        setError(null)
        // Show success message for email invitation
        alert(`Invitation sent to ${inviteData.email}`)
        // Refresh members/invitations list
        await loadTeamMembers()
      } catch (inviteError: any) {
        // If invitation fails but user exists, try direct addition
        if (inviteError.message?.includes('User not found') || inviteError.response?.data?.suggestion?.includes('Use /invite endpoint')) {
          // The API suggests using invitation for non-existing users
          throw new Error(`User not found. An invitation email has been sent to ${inviteData.email} to join Granula and this team.`)
        } else if (inviteError.message?.includes('already a team member')) {
          throw new Error('This user is already a member of the team.')
        } else if (inviteError.message?.includes('Invitation already sent')) {
          throw new Error('An invitation has already been sent to this email address.')
        } else {
          // Try direct member addition as fallback
          await apiClient.addTeamMember(team.id, inviteData.email, inviteData.role)
          setInviteData({ email: '', role: 'member' })
          await loadTeamMembers() // Refresh member list
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to invite member')
    } finally {
      setInviteLoading(false)
    }
  }

  const handleRemoveMember = async (memberId: number) => {
    if (!team) return

    try {
      await apiClient.removeTeamMember(team.id, memberId)
      await loadTeamMembers() // Refresh member list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove member')
    }
  }

  const handleUpdateRole = async (memberId: number, newRole: string) => {
    if (!team) return

    try {
      await apiClient.updateMemberRole(team.id, memberId, newRole)
      await loadTeamMembers() // Refresh member list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role')
    }
  }

  const handleResendInvitation = async (invitationId: number) => {
    try {
      await apiClient.resendInvitation(invitationId)
      alert('Invitation resent successfully')
      await loadTeamMembers() // Refresh invitations list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend invitation')
    }
  }

  const handleRevokeInvitation = async (invitationId: number) => {
    try {
      await apiClient.revokeInvitation(invitationId)
      await loadTeamMembers() // Refresh invitations list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revoke invitation')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleInviteInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setInviteData(prev => ({ ...prev, [name]: value }))
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="w-4 h-4 text-yellow-600" />
      case 'admin': return <Shield className="w-4 h-4 text-blue-600" />
      default: return <User className="w-4 h-4 text-gray-600" />
    }
  }

  const canManageTeam = () => {
    if (!team || !user) return false
    const userMember = members.find(m => m.user_id === user.id)
    return team.created_by === user.id || userMember?.role === 'owner' || userMember?.role === 'admin'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {team ? `Manage Team: ${team.name}` : 'Create New Team'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        {team && (
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'details'
                  ? 'text-[#987628] border-b-2 border-[#987628]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Team Details
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'members'
                  ? 'text-[#987628] border-b-2 border-[#987628]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Members ({members.length + invitations.length})
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="m-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Team Details Tab */}
        {activeTab === 'details' && (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Team Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Team Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#987628] focus:border-transparent"
                placeholder="Enter team name..."
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
                placeholder="Enter team description..."
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
                disabled={loading || !formData.name.trim()}
                className="px-6 py-2 bg-[#987628] text-white rounded-md hover:bg-[#7a5f20] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Saving...' : team ? 'Update Team' : 'Create Team'}
              </button>
            </div>
          </form>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && team && (
          <div className="p-6 space-y-6">
            {/* Invite Member Form */}
            {canManageTeam() && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  <UserPlus className="w-5 h-5 inline mr-2" />
                  Invite Team Member
                </h3>
                <form onSubmit={handleInviteMember} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={inviteData.email}
                        onChange={handleInviteInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#987628] focus:border-transparent"
                        placeholder="Enter email address..."
                      />
                    </div>
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <select
                        id="role"
                        name="role"
                        value={inviteData.role}
                        onChange={handleInviteInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#987628] focus:border-transparent"
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={inviteLoading || !inviteData.email.trim()}
                    className="px-4 py-2 bg-[#987628] text-white rounded-md hover:bg-[#7a5f20] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {inviteLoading ? 'Inviting...' : 'Send Invitation'}
                  </button>
                </form>
              </div>
            )}

            {/* Members List */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Team Members</h3>
              <div className="space-y-3">
                {members.length === 0 ? (
                  <div className="text-gray-500 text-center py-8">
                    No team members found
                  </div>
                ) : (
                  members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{member.user.email}</div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            {getRoleIcon(member.role)}
                            <span className="capitalize">{member.role}</span>
                          </div>
                        </div>
                      </div>
                      
                      {canManageTeam() && member.user_id !== user?.id && team.created_by !== member.user_id && (
                        <div className="flex items-center gap-2">
                          <select
                            value={member.role}
                            onChange={(e) => handleUpdateRole(member.user_id, e.target.value)}
                            className="text-sm px-2 py-1 border border-gray-300 rounded"
                          >
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button
                            onClick={() => handleRemoveMember(member.user_id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                            title="Remove member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Pending Invitations */}
            {canManageTeam() && invitations.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Pending Invitations</h3>
                <div className="space-y-3">
                  {invitations.map((invitation) => (
                    <div key={invitation.id} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Clock className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{invitation.email}</div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            {getRoleIcon(invitation.role)}
                            <span className="capitalize">{invitation.role}</span>
                            <span>•</span>
                            <span>Invited by {invitation.inviter.email}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Expires: {new Date(invitation.expires_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleResendInvitation(invitation.id)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          title="Resend invitation"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRevokeInvitation(invitation.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                          title="Revoke invitation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TeamModal