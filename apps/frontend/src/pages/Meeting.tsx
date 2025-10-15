import { useState, useEffect } from 'react'
import AppLayout from '@/components/AppLayout'
import { Video, Clock, Users, Calendar, Plus, ExternalLink, MoreVertical, Edit, Trash2 } from 'lucide-react'

interface Meeting {
  id: number
  title: string
  description?: string
  date: string
  startTime: string
  endTime: string
  platform: 'google_meet' | 'zoom' | 'teams' | 'in_person'
  meetingLink?: string
  location?: string
  participants: string[]
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  organizer: string
}

export default function Meeting() {
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: 1,
      title: 'Project Kickoff Meeting',
      description: 'Initial meeting to discuss project requirements and timeline',
      date: '2024-01-15',
      startTime: '10:00',
      endTime: '11:00',
      platform: 'google_meet',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      participants: ['John Doe', 'Jane Smith', 'Bob Johnson'],
      status: 'upcoming',
      organizer: 'John Doe'
    },
    {
      id: 2,
      title: 'Sprint Planning',
      description: 'Planning for the next sprint',
      date: '2024-01-15',
      startTime: '14:00',
      endTime: '15:30',
      platform: 'zoom',
      meetingLink: 'https://zoom.us/j/1234567890',
      participants: ['Jane Smith', 'Bob Johnson', 'Alice Brown'],
      status: 'upcoming',
      organizer: 'Jane Smith'
    },
    {
      id: 3,
      title: 'Team Standup',
      description: 'Daily standup meeting',
      date: '2024-01-14',
      startTime: '09:00',
      endTime: '09:15',
      platform: 'teams',
      meetingLink: 'https://teams.microsoft.com/l/meetup-join/...',
      participants: ['Entire Team'],
      status: 'completed',
      organizer: 'Bob Johnson'
    }
  ])

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const platformIcons = {
    google_meet: <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">G</div>,
    zoom: <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">Z</div>,
    teams: <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">T</div>,
    in_person: <Users className="w-5 h-5 text-gray-500" />
  }

  const getStatusColor = (status: Meeting['status']) => {
    switch (status) {
      case 'upcoming': return 'text-blue-600 bg-blue-50'
      case 'ongoing': return 'text-green-600 bg-green-50'
      case 'completed': return 'text-gray-600 bg-gray-50'
      case 'cancelled': return 'text-red-600 bg-red-50'
    }
  }

  const upcomingMeetings = meetings.filter(m => m.status === 'upcoming' || m.status === 'ongoing')
  const pastMeetings = meetings.filter(m => m.status === 'completed' || m.status === 'cancelled')

  return (
    <AppLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Meetings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and join your scheduled meetings</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#987628] text-white rounded-lg hover:bg-[#7a5f20] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Meeting</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-lg p-1 border border-black/10">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'upcoming' 
                ? 'bg-[#987628] text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Upcoming ({upcomingMeetings.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'past' 
                ? 'bg-[#987628] text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Past ({pastMeetings.length})
          </button>
        </div>

        {/* Meetings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {(activeTab === 'upcoming' ? upcomingMeetings : pastMeetings).map(meeting => (
            <div key={meeting.id} className="bg-white rounded-lg border border-black/10 p-4">
              {/* Meeting Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  {platformIcons[meeting.platform]}
                  <div>
                    <h3 className="font-medium text-gray-900">{meeting.title}</h3>
                    {meeting.description && (
                      <p className="text-xs text-gray-500 mt-1">{meeting.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(meeting.status)}`}>
                    {meeting.status}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Meeting Details */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{meeting.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{meeting.startTime} - {meeting.endTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{meeting.participants.length} participants</span>
                </div>
              </div>

              {/* Participants */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex -space-x-2">
                  {meeting.participants.slice(0, 3).map((participant, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-medium"
                    >
                      {participant[0]}
                    </div>
                  ))}
                  {meeting.participants.length > 3 && (
                    <div className="w-6 h-6 bg-[#FAF1DD] rounded-full border-2 border-white flex items-center justify-center text-[10px] font-medium text-[#987628]">
                      +{meeting.participants.length - 3}
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  Organized by {meeting.organizer}
                </span>
              </div>

              {/* Actions */}
              {meeting.status === 'upcoming' && meeting.meetingLink && (
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-[#987628] text-white rounded-md hover:bg-[#7a5f20] transition-colors text-sm">
                    <Video className="w-4 h-4" />
                    Join Meeting
                  </button>
                  <button className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                    <ExternalLink className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {((activeTab === 'upcoming' && upcomingMeetings.length === 0) || 
          (activeTab === 'past' && pastMeetings.length === 0)) && (
          <div className="text-center py-12">
            <Video className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-1">No {activeTab} meetings</h3>
            <p className="text-xs text-gray-500">
              {activeTab === 'upcoming' 
                ? 'Schedule a meeting to get started'
                : 'Your past meetings will appear here'}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  )
}