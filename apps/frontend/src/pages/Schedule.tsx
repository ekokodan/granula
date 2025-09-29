import { Search, Bell, ChevronDown, Plus, Calendar, ChevronLeft, ChevronRight, Settings as SettingsIcon, Home, Users, Activity, FolderOpen, CheckSquare } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Schedule() {
  const timeSlots = ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM']
  const days = [
    { date: '10', day: 'MON' },
    { date: '11', day: 'TUE' },
    { date: '12', day: 'WED' },
    { date: '13', day: 'THU' },
    { date: '14', day: 'FRI' },
    { date: '15', day: 'SAT' }
  ]

  const meetings = {
    '10': [
      { 
        title: 'Project review meeting', 
        time: '9:00 - 10:00AM', 
        participants: 4, 
        platform: 'on google meet',
        style: 'bg-[#C56E33]/10 border-b border-[#C56E33]',
        height: 'h-28'
      }
    ],
    '11': [
      { 
        title: 'QA Team Session', 
        time: '9:00 - 9:30AM', 
        participants: 0, 
        platform: '',
        style: 'bg-black/6 border-b border-[#C56E33]',
        height: 'h-[71px]'
      },
      { 
        title: 'Team Strategy Block', 
        time: '11:00AM - 1:00PM', 
        participants: 0, 
        platform: '',
        style: 'bg-black/6 border-b border-[#C56E33]',
        height: 'h-[211px]',
        position: 'top-72'
      },
      { 
        title: 'Project review meeting', 
        time: '10:00AM - 12:00PM', 
        participants: 4, 
        platform: 'on google meet',
        style: 'bg-[#C56E33]/10 border-b border-[#C56E33]',
        height: 'h-40',
        position: 'top-[399px]'
      }
    ],
    '12': [
      { 
        title: 'Project review meeting', 
        time: '10:00AM - 12:00PM', 
        participants: 4, 
        platform: 'on google meet',
        style: 'bg-[#C56E33]/10 border-b border-[#C56E33]',
        height: 'h-[246px]',
        position: 'top-[153px]'
      }
    ],
    '13': [
      { 
        title: 'Project review meeting', 
        time: '10:00AM - 12:00PM', 
        participants: 4, 
        platform: 'on google meet',
        style: 'bg-[#C56E33]/10 border-b border-[#C56E33]',
        height: 'h-[246px]',
        position: 'top-[54px]'
      }
    ],
    '14': [
      { 
        title: 'QA Team Session', 
        time: '9:00 - 9:30AM', 
        participants: 0, 
        platform: '',
        style: 'bg-black/6 border-b border-[#C56E33]',
        height: 'h-[71px]',
        position: 'top-[54px]'
      },
      { 
        title: 'Project review meeting', 
        time: '9:00 - 10:00AM', 
        participants: 4, 
        platform: 'on google meet',
        style: 'bg-[#C56E33]/10 border-b border-[#C56E33]',
        height: 'h-28',
        position: 'top-[131px]'
      }
    ]
  }

  const ParticipantAvatars = ({ count }: { count: number }) => {
    if (count === 0) return null
    
    return (
      <div className="flex -space-x-1.5">
        {Array.from({ length: Math.min(count, 4) }, (_, i) => (
          <div key={i} className="w-5 h-5 bg-gray-300 rounded-full border border-white" />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF1DD] flex">
      {/* Sidebar */}
      <div className="w-[290px] bg-white border-r border-black/30 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-black/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gold-gradient rounded-full" />
            <span className="text-xl font-semibold">Granula</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-6">
          <nav className="space-y-2">
            {/* Dashboard */}
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-black/50 hover:text-black transition-colors">
              <Home className="w-5 h-5" />
              <span className="text-xs">Dashboard</span>
            </Link>

            {/* Schedule - Active */}
            <div className="flex items-center gap-3 px-4 py-3 bg-[#FAF1DD] rounded-full text-[#987628]">
              <Calendar className="w-5 h-5" />
              <span className="font-medium text-xs">Schedule</span>
            </div>

            {/* Other nav items */}
            <div className="flex items-center gap-3 px-4 py-3 text-black/50 hover:text-black transition-colors">
              <CheckSquare className="w-5 h-5" />
              <span className="text-xs">Meeting</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 text-black/50 hover:text-black transition-colors">
              <Activity className="w-5 h-5" />
              <span className="text-xs">Activity</span>
            </div>
            <Link to="/team" className="flex items-center gap-3 px-4 py-3 text-black/50 hover:text-black transition-colors">
              <Users className="w-5 h-5" />
              <span className="text-xs">Team</span>
            </Link>

            {/* Divider */}
            <div className="h-px bg-black my-6" />

            {/* Projects */}
            <div className="text-black/50 font-medium text-lg mb-4">Projects</div>
            <div className="space-y-1">
              <div className="flex items-center gap-3 px-4 py-3 text-black/50 hover:text-black transition-colors">
                <FolderOpen className="w-5 h-5" />
                <span className="text-xs flex-1">Apartment 001</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-3 px-4 py-3 text-black/50 hover:text-black transition-colors">
                <FolderOpen className="w-5 h-5" />
                <span className="text-xs flex-1">H. Build</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </nav>
        </div>

        {/* Bottom section */}
        <div className="p-6 space-y-4">
          {/* User Card */}
          <div className="bg-gradient-to-br from-[#E5BB57] to-[#F9F1EB] rounded p-4 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 bg-[#987628] rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full" />
              </div>
              <div>
                <div className="text-[#987628] text-xs">Current user:</div>
                <div className="text-[#987628] font-semibold text-xs">Team Lead</div>
              </div>
            </div>
            <button className="bg-white text-[#987628] px-4 py-1.5 rounded text-xs font-medium">
              Switch Account
            </button>
          </div>

          {/* Settings */}
          <div className="flex items-center gap-3 px-4 py-3 text-black/50 hover:text-black transition-colors">
            <SettingsIcon className="w-5 h-5" />
            <span className="text-xs">Settings</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-black/30 px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Search */}
            <div className="flex items-center gap-3 bg-[#0041C2]/5 rounded-lg px-3 py-4 w-[495px]">
              <Search className="w-6 h-6 text-black/50" />
              <span className="text-black/50 text-xs">Search</span>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-6">
              <button className="w-8 h-8 border border-black/10 rounded-full flex items-center justify-center shadow-lg">
                <Bell className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-5">
                  <div className="w-8 h-8 bg-gray-300 rounded-full" />
                  <span className="text-xs">Benedict Dayas</span>
                </div>
                <ChevronDown className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-medium">Schedule</h1>
            
            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Date Range Selector */}
              <div className="flex items-center gap-3 border border-[#C56E33] rounded-full px-6 py-3">
                <Calendar className="w-5 h-5 text-[#C56E33]" />
                <span className="text-[#C56E33] text-xs">10 Apr 2025 - 15 Apr 2025</span>
                <ChevronDown className="w-5 h-5 text-[#C56E33]" />
              </div>
              
              {/* Create Schedule Button */}
              <button className="bg-[#C56E33] text-white px-6 py-3 rounded-full flex items-center gap-2">
                <Plus className="w-5 h-5" />
                <span className="text-xs">Create a schedule</span>
              </button>
            </div>
          </div>

          {/* Calendar Container */}
          <div className="bg-white rounded-lg p-5 h-[851px] relative overflow-hidden">
            {/* Time Column */}
            <div className="absolute left-5 top-[155px] space-y-14">
              {timeSlots.map((time) => (
                <div key={time} className="text-xs h-12 leading-[48px]">
                  {time}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="flex ml-[93px]">
              {days.map((day, dayIndex) => (
                <div key={day.date} className="w-[206px] border-r border-t border-black/10 relative" style={{ height: '752px' }}>
                  {/* Day Header */}
                  <div className="bg-[#C56E33]/3 h-12 flex items-center justify-center border-b border-black/10">
                    <span className="font-medium text-xs">{day.date} {day.day}</span>
                  </div>

                  {/* Time Slots */}
                  <div className="relative h-full">
                    {/* Hour grid lines */}
                    {Array.from({ length: 13 }, (_, i) => (
                      <div key={i} className="absolute w-full border-b border-black/5" style={{ top: `${56 + i * 56}px` }} />
                    ))}

                    {/* Meeting Blocks */}
                    {meetings[day.date]?.map((meeting, meetingIndex) => (
                      <div
                        key={meetingIndex}
                        className={`absolute left-0 w-full ${meeting.style} ${meeting.height} px-3 py-1 ${meeting.position || ''}`}
                        style={{ 
                          top: meeting.position ? undefined : meetingIndex === 0 && day.date === '10' ? '53px' : 
                                meeting.position ? meeting.position : '54px'
                        }}
                      >
                        <div className="py-1">
                          <div className={`font-medium ${meeting.title.includes('Strategy') ? 'text-xs leading-5' : 'text-xs leading-12'}`}>
                            {meeting.title}
                          </div>
                          <div className="text-xs text-black/60 leading-12">
                            {meeting.time}
                          </div>
                        </div>
                        
                        {meeting.participants > 0 && (
                          <div className="absolute bottom-2 left-3">
                            <ParticipantAvatars count={meeting.participants} />
                          </div>
                        )}
                        
                        {meeting.platform && (
                          <div className="absolute bottom-2 right-3 text-xs text-black/60">
                            {meeting.platform}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Component = Schedule