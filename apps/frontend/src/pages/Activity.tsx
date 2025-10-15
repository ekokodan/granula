import { useState } from 'react'
import AppLayout from '@/components/AppLayout'
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  UserPlus,
  FolderPlus,
  Edit3,
  Trash2,
  TrendingUp,
  Calendar,
  Users,
  FileText
} from 'lucide-react'

interface ActivityItem {
  id: number
  type: 'task_created' | 'task_completed' | 'task_updated' | 'comment_added' | 
        'user_joined' | 'project_created' | 'meeting_scheduled' | 'task_assigned'
  title: string
  description: string
  user: string
  userAvatar?: string
  timestamp: string
  relatedItem?: {
    id: number
    name: string
    type: string
  }
}

export default function Activity() {
  const [activities] = useState<ActivityItem[]>([
    {
      id: 1,
      type: 'task_completed',
      title: 'Task Completed',
      description: 'Completed "Design homepage mockup"',
      user: 'John Doe',
      timestamp: '2 hours ago',
      relatedItem: { id: 1, name: 'Design homepage mockup', type: 'task' }
    },
    {
      id: 2,
      type: 'comment_added',
      title: 'New Comment',
      description: 'Commented on "API Integration"',
      user: 'Jane Smith',
      timestamp: '3 hours ago',
      relatedItem: { id: 2, name: 'API Integration', type: 'task' }
    },
    {
      id: 3,
      type: 'user_joined',
      title: 'Team Member Joined',
      description: 'Bob Johnson joined the Development team',
      user: 'Bob Johnson',
      timestamp: '5 hours ago',
      relatedItem: { id: 1, name: 'Development', type: 'team' }
    },
    {
      id: 4,
      type: 'project_created',
      title: 'New Project',
      description: 'Created project "Mobile App v2.0"',
      user: 'Alice Brown',
      timestamp: '1 day ago',
      relatedItem: { id: 3, name: 'Mobile App v2.0', type: 'project' }
    },
    {
      id: 5,
      type: 'meeting_scheduled',
      title: 'Meeting Scheduled',
      description: 'Scheduled "Sprint Planning" for tomorrow',
      user: 'John Doe',
      timestamp: '1 day ago',
      relatedItem: { id: 4, name: 'Sprint Planning', type: 'meeting' }
    },
    {
      id: 6,
      type: 'task_assigned',
      title: 'Task Assigned',
      description: 'Assigned "Database Migration" to Jane Smith',
      user: 'John Doe',
      timestamp: '2 days ago',
      relatedItem: { id: 5, name: 'Database Migration', type: 'task' }
    },
    {
      id: 7,
      type: 'task_created',
      title: 'Task Created',
      description: 'Created "Update documentation"',
      user: 'Jane Smith',
      timestamp: '2 days ago',
      relatedItem: { id: 6, name: 'Update documentation', type: 'task' }
    },
    {
      id: 8,
      type: 'task_updated',
      title: 'Task Updated',
      description: 'Updated priority of "Bug fixes" to High',
      user: 'Bob Johnson',
      timestamp: '3 days ago',
      relatedItem: { id: 7, name: 'Bug fixes', type: 'task' }
    }
  ])

  const [filter, setFilter] = useState<'all' | ActivityItem['type']>('all')

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'task_created': return <FileText className="w-4 h-4" />
      case 'task_completed': return <CheckCircle2 className="w-4 h-4" />
      case 'task_updated': return <Edit3 className="w-4 h-4" />
      case 'task_assigned': return <Users className="w-4 h-4" />
      case 'comment_added': return <MessageSquare className="w-4 h-4" />
      case 'user_joined': return <UserPlus className="w-4 h-4" />
      case 'project_created': return <FolderPlus className="w-4 h-4" />
      case 'meeting_scheduled': return <Calendar className="w-4 h-4" />
    }
  }

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'task_completed': return 'bg-green-100 text-green-600'
      case 'task_created': return 'bg-blue-100 text-blue-600'
      case 'task_updated': return 'bg-yellow-100 text-yellow-600'
      case 'task_assigned': return 'bg-purple-100 text-purple-600'
      case 'comment_added': return 'bg-gray-100 text-gray-600'
      case 'user_joined': return 'bg-indigo-100 text-indigo-600'
      case 'project_created': return 'bg-orange-100 text-orange-600'
      case 'meeting_scheduled': return 'bg-pink-100 text-pink-600'
    }
  }

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(a => a.type === filter)

  // Group activities by date
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = activity.timestamp.includes('hour') ? 'Today' : 
                 activity.timestamp.includes('1 day') ? 'Yesterday' : 
                 'Earlier'
    
    if (!groups[date]) groups[date] = []
    groups[date].push(activity)
    return groups
  }, {} as Record<string, ActivityItem[]>)

  return (
    <AppLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Activity</h1>
            <p className="text-sm text-gray-500 mt-1">Track all team activities and updates</p>
          </div>
          
          {/* Stats */}
          <div className="flex gap-4">
            <div className="bg-white rounded-lg border border-black/10 px-4 py-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-xs text-gray-500">Today's Activities</p>
                  <p className="text-lg font-semibold">12</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-black/10 px-4 py-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-xs text-gray-500">Active Users</p>
                  <p className="text-lg font-semibold">8</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-[#987628] text-white' 
                : 'bg-white text-gray-600 hover:text-gray-900 border border-black/10'
            }`}
          >
            All Activities
          </button>
          <button
            onClick={() => setFilter('task_completed')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === 'task_completed' 
                ? 'bg-green-500 text-white' 
                : 'bg-white text-gray-600 hover:text-gray-900 border border-black/10'
            }`}
          >
            Completed Tasks
          </button>
          <button
            onClick={() => setFilter('task_created')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === 'task_created' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-600 hover:text-gray-900 border border-black/10'
            }`}
          >
            New Tasks
          </button>
          <button
            onClick={() => setFilter('comment_added')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === 'comment_added' 
                ? 'bg-gray-500 text-white' 
                : 'bg-white text-gray-600 hover:text-gray-900 border border-black/10'
            }`}
          >
            Comments
          </button>
        </div>

        {/* Activity Timeline */}
        <div className="space-y-6">
          {Object.entries(groupedActivities).map(([date, activities]) => (
            <div key={date}>
              <h3 className="text-sm font-medium text-gray-500 mb-3">{date}</h3>
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="bg-white rounded-lg border border-black/10 p-4">
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                            <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                            {activity.relatedItem && (
                              <button className="text-xs text-[#987628] hover:text-[#7a5f20] mt-2 font-medium">
                                View {activity.relatedItem.type} →
                              </button>
                            )}
                          </div>
                          <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                            {activity.timestamp}
                          </span>
                        </div>
                        
                        {/* User Info */}
                        <div className="flex items-center gap-2 mt-3">
                          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-[10px] font-medium">
                            {activity.user[0]}
                          </div>
                          <span className="text-xs text-gray-500">{activity.user}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredActivities.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-black/10">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-1">No activities found</h3>
            <p className="text-xs text-gray-500">
              {filter === 'all' 
                ? 'Activities will appear here as your team works'
                : `No ${filter.replace('_', ' ')} activities yet`}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  )
}