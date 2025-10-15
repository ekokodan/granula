import { useState, useEffect } from 'react'
import AppLayout from '@/components/AppLayout'
import { ChevronLeft, ChevronRight, Plus, Clock, Users, Video, MapPin, X, UserPlus } from 'lucide-react'
import { apiClient, Schedule as ScheduleType, ScheduleParticipant } from '@/utils/api'
import { toast } from 'sonner'

interface ScheduleEvent {
  id: number
  title: string
  time: string
  duration: string
  participants: number
  platform?: string
  location?: string
  color: string
  day: string
  hour: number
}

export default function Schedule() {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; hour: number } | null>(null)
  const [schedules, setSchedules] = useState<ScheduleType[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const timeSlots = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM']
  
  // Generate week days
  const getWeekDays = () => {
    const days = []
    const startOfWeek = new Date(currentWeek)
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1) // Start from Monday
    
    for (let i = 0; i < 6; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      days.push({
        date: date.getDate().toString(),
        day: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][i],
        fullDate: date
      })
    }
    return days
  }

  const days = getWeekDays()

  // Load schedules for the current week
  useEffect(() => {
    loadSchedules()
  }, [currentWeek])

  const loadSchedules = async () => {
    try {
      setLoading(true)
      
      // Get start and end dates for the current week
      const startOfWeek = new Date(currentWeek)
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1)
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)
      
      const response = await apiClient.getSchedules({
        start_date: startOfWeek.toISOString().split('T')[0],
        end_date: endOfWeek.toISOString().split('T')[0]
      })
      
      setSchedules(response.schedules)
    } catch (error) {
      console.error('Failed to load schedules:', error)
      toast.error('Failed to load schedules')
    } finally {
      setLoading(false)
    }
  }

  // Convert API schedules to display events
  const convertToEvents = (): ScheduleEvent[] => {
    return schedules.map(schedule => {
      const date = new Date(schedule.date)
      const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
      const dayAbbr = dayNames[date.getDay()]
      
      const startHour = parseInt(schedule.start_time.split(':')[0])
      const endHour = parseInt(schedule.end_time.split(':')[0])
      const duration = `${endHour - startHour}h`
      
      const colors = [
        'bg-orange-100 border-orange-300',
        'bg-blue-100 border-blue-300',
        'bg-green-100 border-green-300',
        'bg-purple-100 border-purple-300',
        'bg-red-100 border-red-300'
      ]
      
      return {
        id: schedule.id,
        title: schedule.title,
        time: `${schedule.start_time} - ${schedule.end_time}`,
        duration,
        participants: schedule.participants.length,
        platform: schedule.meeting_link ? schedule.meeting_type : undefined,
        location: schedule.location,
        color: colors[schedule.id % colors.length],
        day: dayAbbr,
        hour: startHour
      }
    })
  }

  const events = convertToEvents()

  const handlePreviousWeek = () => {
    const newWeek = new Date(currentWeek)
    newWeek.setDate(newWeek.getDate() - 7)
    setCurrentWeek(newWeek)
  }

  const handleNextWeek = () => {
    const newWeek = new Date(currentWeek)
    newWeek.setDate(newWeek.getDate() + 7)
    setCurrentWeek(newWeek)
  }

  const handleTimeSlotClick = (day: string, hour: number) => {
    setSelectedSlot({ day, hour })
    setShowCreateModal(true)
  }

  const getEventForSlot = (day: string, hour: number) => {
    return events.find(event => event.day === day && event.hour === hour)
  }

  const getEventHeight = (duration: string) => {
    const hours = parseInt(duration)
    return hours * 64 // 64px per hour slot
  }

  const handleCreateSchedule = async (formData: FormData) => {
    try {
      setCreating(true)
      
      const scheduleData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        date: formData.get('date') as string,
        start_time: formData.get('start_time') as string,
        end_time: formData.get('end_time') as string,
        meeting_type: formData.get('meeting_type') as any,
        location: formData.get('location') as string,
        // Add participants logic here if needed
      }
      
      await apiClient.createSchedule(scheduleData)
      toast.success('Schedule created successfully!')
      setShowCreateModal(false)
      setSelectedSlot(null)
      loadSchedules() // Reload schedules
    } catch (error: any) {
      console.error('Failed to create schedule:', error)
      toast.error(error.message || 'Failed to create schedule')
    } finally {
      setCreating(false)
    }
  }

  return (
    <AppLayout>
      <div className="p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Schedule</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your weekly schedule and meetings</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#987628] text-white rounded-lg hover:bg-[#7a5f20] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-4 bg-white rounded-lg p-3 border border-black/10">
          <button
            onClick={handlePreviousWeek}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h2 className="font-semibold text-gray-900">
              {days[0].fullDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <p className="text-xs text-gray-500">
              Week {Math.ceil(days[0].fullDate.getDate() / 7)}
            </p>
          </div>
          <button
            onClick={handleNextWeek}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 bg-white rounded-lg border border-black/10 overflow-hidden">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#987628] mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Loading schedules...</p>
              </div>
            </div>
          )}
          
          {!loading && (
          <div className="grid grid-cols-7 h-full">
            {/* Time Column */}
            <div className="border-r border-gray-200">
              <div className="h-12 border-b border-gray-200 bg-gray-50"></div>
              {timeSlots.map((time) => (
                <div
                  key={time}
                  className="h-16 border-b border-gray-100 px-3 py-2 text-xs text-gray-500 text-right"
                >
                  {time}
                </div>
              ))}
            </div>

            {/* Day Columns */}
            {days.map((day) => (
              <div key={day.day} className="border-r border-gray-200 last:border-r-0 relative">
                {/* Day Header */}
                <div className="h-12 border-b border-gray-200 bg-gray-50 p-2 text-center">
                  <div className="text-xs font-medium text-gray-600">{day.day}</div>
                  <div className="text-sm font-semibold">{day.date}</div>
                </div>

                {/* Time Slots */}
                <div className="relative">
                  {timeSlots.map((_, index) => {
                    const hour = 9 + index
                    const event = getEventForSlot(day.day, hour)
                    
                    return (
                      <div
                        key={index}
                        className="h-16 border-b border-gray-100 relative hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => !event && handleTimeSlotClick(day.day, hour)}
                      >
                        {event && (
                          <div
                            className={`absolute inset-x-1 top-1 p-2 rounded ${event.color} border cursor-pointer hover:shadow-md transition-shadow z-10`}
                            style={{ 
                              height: `${getEventHeight(event.duration) - 8}px`,
                              maxHeight: `${getEventHeight(event.duration) - 8}px`
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              // Handle event click
                            }}
                          >
                            <div className="flex flex-col h-full">
                              <h4 className="text-xs font-medium text-gray-900 truncate">
                                {event.title}
                              </h4>
                              <p className="text-[10px] text-gray-600 mt-0.5">{event.time}</p>
                              {event.participants > 0 && (
                                <div className="mt-auto pt-1">
                                  <div className="flex items-center gap-1">
                                    <Users className="w-3 h-3 text-gray-400" />
                                    <span className="text-[10px] text-gray-500">
                                      {event.participants}
                                    </span>
                                    {event.platform && (
                                      <>
                                        <Video className="w-3 h-3 text-gray-400 ml-1" />
                                        <span className="text-[10px] text-gray-500 truncate">
                                          {event.platform}
                                        </span>
                                      </>
                                    )}
                                    {event.location && (
                                      <>
                                        <MapPin className="w-3 h-3 text-gray-400 ml-1" />
                                        <span className="text-[10px] text-gray-500 truncate">
                                          {event.location}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          )}
        </div>

        {/* Create Event Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Schedule New Event</h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setSelectedSlot(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form className="space-y-4" onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                await handleCreateSchedule(formData)
              }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#987628]"
                    placeholder="e.g., Team Meeting"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#987628]"
                      defaultValue={selectedSlot ? days.find(d => d.day === selectedSlot.day)?.fullDate.toISOString().split('T')[0] : ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      name="start_time"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#987628]"
                      defaultValue={selectedSlot ? `${selectedSlot.hour.toString().padStart(2, '0')}:00` : ''}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="end_time"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#987628]"
                    defaultValue={selectedSlot ? `${(selectedSlot.hour + 1).toString().padStart(2, '0')}:00` : ''}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meeting Type
                  </label>
                  <select name="meeting_type" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#987628]">
                    <option value="in_person">In Person</option>
                    <option value="google_meet">Google Meet</option>
                    <option value="zoom">Zoom</option>
                    <option value="teams">Microsoft Teams</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invite Team Members
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#987628]"
                      placeholder="Enter email or username"
                    />
                    <button
                      type="button"
                      className="px-3 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {/* Added team members will appear here */}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#987628]"
                    rows={3}
                    placeholder="Add meeting agenda or notes..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false)
                      setSelectedSlot(null)
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 px-4 py-2 bg-[#987628] text-white rounded-md hover:bg-[#7a5f20] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creating ? 'Creating...' : 'Create Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}