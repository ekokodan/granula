import React, { useState } from 'react'
import { 
  ChevronDown, 
  Edit3, 
  Trash2, 
  User, 
  Calendar, 
  Clock,
  CheckCircle,
  Circle,
  PlayCircle,
  XCircle,
  Flag
} from 'lucide-react'
import { Task } from '../utils/api'

interface TaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
  onDelete?: (task: Task) => void
  onStatusChange?: (task: Task, newStatus: string) => void
  onAssign?: (task: Task) => void
  expanded?: boolean
  onToggleExpand?: () => void
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  onAssign,
  expanded = false,
  onToggleExpand
}) => {
  const [showActions, setShowActions] = useState(false)

  const priorityColors = {
    high: { 
      bg: 'bg-red-50', 
      border: 'border-red-200', 
      dot: 'bg-red-500', 
      text: 'text-red-700',
      badge: 'bg-red-500'
    },
    medium: { 
      bg: 'bg-yellow-50', 
      border: 'border-yellow-200', 
      dot: 'bg-yellow-500', 
      text: 'text-yellow-700',
      badge: 'bg-yellow-500'
    },
    low: { 
      bg: 'bg-blue-50', 
      border: 'border-blue-200', 
      dot: 'bg-blue-500', 
      text: 'text-blue-700',
      badge: 'bg-blue-500'
    }
  }

  const statusConfig = {
    pending: { icon: Circle, color: 'text-gray-500', bg: 'bg-gray-100', label: 'Pending' },
    in_progress: { icon: PlayCircle, color: 'text-blue-500', bg: 'bg-blue-100', label: 'In Progress' },
    completed: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100', label: 'Completed' },
    cancelled: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100', label: 'Cancelled' }
  }

  const colors = priorityColors[task.priority as keyof typeof priorityColors]
  const statusInfo = statusConfig[task.status as keyof typeof statusConfig]
  const StatusIcon = statusInfo.icon

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    const now = new Date()
    const isOverdue = date < now && task.status !== 'completed'
    
    return {
      formatted: date.toLocaleDateString(),
      isOverdue,
      isToday: date.toDateString() === now.toDateString(),
      isTomorrow: date.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString()
    }
  }

  const dueDateInfo = formatDate(task.due_date)

  const getNextStatus = () => {
    switch (task.status) {
      case 'pending': return 'in_progress'
      case 'in_progress': return 'completed'
      default: return null
    }
  }

  const getStatusActionLabel = () => {
    switch (task.status) {
      case 'pending': return 'Start Work'
      case 'in_progress': return 'Mark Complete'
      default: return null
    }
  }

  return (
    <div 
      className={`${colors.bg} ${colors.border} border rounded-lg p-4 transition-all duration-200 hover:shadow-md group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start gap-4">
        {/* Priority Dot */}
        <div className={`w-3 h-3 ${colors.dot} rounded-full mt-1 flex-shrink-0`} />

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">
                {task.title}
              </h4>
              
              {/* Tags Row */}
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {/* Priority Badge */}
                <span className={`${colors.badge} text-white px-2 py-0.5 rounded text-xs font-medium`}>
                  {task.priority.toUpperCase()}
                </span>
                
                {/* Status Badge */}
                <span className={`${statusInfo.bg} ${statusInfo.color} px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1`}>
                  <StatusIcon className="w-3 h-3" />
                  {statusInfo.label}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className={`flex items-center gap-1 transition-opacity ${showActions ? 'opacity-100' : 'opacity-0'}`}>
              {/* Status Action */}
              {getNextStatus() && (
                <button
                  onClick={() => onStatusChange?.(task, getNextStatus()!)}
                  className="p-1.5 text-green-600 hover:bg-green-100 rounded transition-colors"
                  title={getStatusActionLabel() || ''}
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}
              
              {/* Edit */}
              <button
                onClick={() => onEdit?.(task)}
                className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                title="Edit task"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              
              {/* Delete */}
              <button
                onClick={() => onDelete?.(task)}
                className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              {/* Expand */}
              <button
                onClick={onToggleExpand}
                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                title={expanded ? "Collapse" : "Expand"}
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Quick Info Row */}
          <div className="flex items-center gap-4 text-xs text-gray-600">
            {/* Assignment */}
            {task.assignee ? (
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{task.assignee.email}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-gray-400">
                <User className="w-3 h-3" />
                <span>Unassigned</span>
              </div>
            )}

            {/* Due Date */}
            {dueDateInfo && (
              <div className={`flex items-center gap-1 ${
                dueDateInfo.isOverdue ? 'text-red-600' : 
                dueDateInfo.isToday ? 'text-orange-600' : 
                dueDateInfo.isTomorrow ? 'text-yellow-600' : 'text-gray-600'
              }`}>
                <Calendar className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">
                  {dueDateInfo.isOverdue ? '🚨 ' : ''}
                  {dueDateInfo.isToday ? 'Today' :
                   dueDateInfo.isTomorrow ? 'Tomorrow' :
                   dueDateInfo.formatted}
                  {dueDateInfo.isOverdue && ' (Overdue)'}
                </span>
              </div>
            )}

            {/* Created Date */}
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Created {new Date(task.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Expanded Content */}
          {expanded && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              {/* Description */}
              {task.description && (
                <div className="mb-3">
                  <h5 className="text-xs font-medium text-gray-700 mb-1">Description</h5>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {task.description}
                  </p>
                </div>
              )}

              {/* Additional Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="font-medium text-gray-700">Created by:</span>
                  <div className="text-gray-600">{task.creator?.email || 'Unknown'}</div>
                </div>
                
                {task.completed_at && (
                  <div>
                    <span className="font-medium text-gray-700">Completed:</span>
                    <div className="text-gray-600">
                      {new Date(task.completed_at).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                <button
                  onClick={() => onEdit?.(task)}
                  className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200 transition-colors"
                >
                  Edit Details
                </button>
                
                {!task.assigned_to && (
                  <button
                    onClick={() => onAssign?.(task)}
                    className="px-3 py-1.5 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200 transition-colors"
                  >
                    Assign to Me
                  </button>
                )}
                
                {getNextStatus() && (
                  <button
                    onClick={() => onStatusChange?.(task, getNextStatus()!)}
                    className="px-3 py-1.5 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200 transition-colors"
                  >
                    {getStatusActionLabel()}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskCard