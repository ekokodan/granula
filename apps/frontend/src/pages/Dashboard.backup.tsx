import { Search, Bell, ChevronDown, Plus, BarChart3, Calendar, AlertCircle, Settings as SettingsIcon, Home, Users, Activity, FolderOpen, CheckSquare, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
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
            {/* Dashboard - Active */}
            <div className="flex items-center gap-3 px-4 py-3 bg-[#FAF1DD] rounded-full text-[#987628]">
              <Home className="w-5 h-5" />
              <span className="font-medium text-xs">Dashboard</span>
            </div>

            {/* Other nav items */}
            <Link to="/schedule" className="flex items-center gap-3 px-4 py-3 text-black/50 hover:text-black transition-colors">
              <Calendar className="w-5 h-5" />
              <span className="text-xs">Schedule</span>
            </Link>
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
                <div className="text-[#987628] text-sm">Current user:</div>
                <div className="text-[#987628] font-semibold text-sm">Team Lead</div>
              </div>
            </div>
            <button className="bg-white text-[#987628] px-4 py-1.5 rounded text-sm font-medium">
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
            <div className="flex items-center gap-3 bg-[#FAF1DD]/40 rounded-full px-6 py-4 w-[495px]">
              <Search className="w-6 h-6 text-black/50" />
              <span className="text-black/50 text-sm">Search</span>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-6">
              <button className="w-8 h-8 border border-black/10 rounded-full flex items-center justify-center shadow-lg">
                <Bell className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full" />
                  <span className="text-sm">Benedict Dayas</span>
                </div>
                <ChevronDown className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded p-6 h-full">
            {/* Metrics Cards */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              {/* Tasks Completed */}
              <div className="border border-[#987628] rounded-lg p-6 relative">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-10 h-10 bg-[#987628] rounded-full flex items-center justify-center">
                    <CheckSquare className="w-6 h-6 text-white" />
                  </div>
                  <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-light">
                    +10.5%
                  </div>
                </div>
                <div className="text-5xl font-medium mb-2">202</div>
                <div className="text-[#987628] text-xs font-medium">Task Completed</div>
              </div>

              {/* Tasks Pending */}
              <div className="border border-[#987628] rounded-lg p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-10 h-10 bg-[#987628] rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-light">
                    -5.2%
                  </div>
                </div>
                <div className="text-5xl font-medium mb-2">22</div>
                <div className="text-black/60 text-xs font-light">Task Pending</div>
              </div>

              {/* Task Completion Rate */}
              <div className="border border-[#987628] rounded-lg p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-10 h-10 bg-[#987628] rounded-full flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div className="bg-[#F4B222] text-white px-2 py-1 rounded text-sm font-light">
                    Today
                  </div>
                </div>
                <div className="text-5xl font-medium mb-2">45%</div>
                <div className="text-black/60 text-xs font-light">Task completion rate</div>
              </div>
            </div>

            {/* Task Filters and Add Task */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-8">
                {/* Priority Filter */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#E5ECF9] rounded-full flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-[#987628]" />
                  </div>
                  <span className="font-semibold text-xs">PRIORITY</span>
                  <div className="w-5 h-5 bg-[#987628] rounded-full flex items-center justify-center text-white text-xs font-semibold">22</div>
                </div>

                {/* Date Filter */}
                <div className="flex items-center gap-3 opacity-50">
                  <div className="w-8 h-8 bg-[#E5ECF9] rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-xs">DATE</span>
                  <div className="w-5 h-5 bg-[#987628] rounded-full flex items-center justify-center text-white text-xs font-semibold">12</div>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-3 opacity-50">
                  <div className="w-8 h-8 bg-[#E5ECF9] rounded-full flex items-center justify-center">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-xs">STATUS</span>
                  <div className="w-5 h-5 bg-[#987628] rounded-full flex items-center justify-center text-white text-xs font-semibold">61</div>
                </div>
              </div>

              {/* Add Task */}
              <div className="flex items-center gap-2 text-[#987628]">
                <Plus className="w-5 h-5" />
                <span className="text-sm">Add Task</span>
              </div>
            </div>

            <div className="h-px bg-[#F9F1EB] mb-6" />

            {/* Task Lists */}
            <div className="space-y-6">
              {/* High Priority */}
              <div className="bg-white rounded">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-[#C22121] text-white px-3 py-2 rounded flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-semibold">HIGH PRIORITY(5)</span>
                  </div>
                  <ChevronDown className="w-6 h-6" />
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="bg-[#F7EBE5] border border-red-200 rounded-lg p-4 flex items-center gap-4">
                      <div className="w-3 h-3 bg-[#C22121] rounded-full" />
                      <div>
                        <div className="font-semibold text-xs">Cable wiring plug</div>
                        <div className="text-[#0B7456] text-xs tracking-wide">Electrical</div>
                      </div>
                      <div className="ml-auto">
                        <ChevronDown className="w-6 h-6" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Medium Priority */}
              <div className="bg-white rounded">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-[#F4B222] text-white px-3 py-2 rounded flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-semibold">MEDIUM PRIORITY(6)</span>
                  </div>
                  <ChevronDown className="w-6 h-6" />
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="bg-[#FEF7E9] border border-yellow-200 rounded-lg p-4 flex items-center gap-4">
                      <div className="w-3 h-3 bg-[#F4B222] rounded-full" />
                      <div>
                        <div className="font-semibold text-xs">Cable wiring plug</div>
                        <div className="text-[#0B7456] text-xs tracking-wide">Electrical</div>
                      </div>
                      <div className="ml-auto">
                        <ChevronDown className="w-6 h-6" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Priority */}
              <div className="bg-white rounded">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-[#0041C2] text-white px-3 py-2 rounded flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-semibold">LOW PRIORITY(4)</span>
                  </div>
                  <ChevronDown className="w-6 h-6" />
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="bg-[#E6ECF9] border border-blue-200 rounded-lg p-4 flex items-center gap-4">
                      <div className="w-3 h-3 bg-[#0041C2] rounded-full" />
                      <div>
                        <div className="font-semibold text-xs">Cable wiring plug</div>
                        <div className="text-[#0B7456] text-xs tracking-wide">Electrical</div>
                      </div>
                      <div className="ml-auto">
                        <ChevronDown className="w-6 h-6" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chatbox */}
      <div className="fixed bottom-0 right-0 w-[450px] h-[772px] bg-white shadow-lg rounded-t border translate-y-[660px] hover:translate-y-0 transition-transform duration-300">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-[#E8B145] to-[#C97535] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-300 rounded-full border border-white" />
              <span className="text-white text-xl font-semibold">Aisha AI</span>
            </div>
            <div className="flex gap-2">
              <button className="w-5 h-5 text-white/60">
                <Settings className="w-5 h-5" />
              </button>
              <button className="w-5 h-5 text-white/60">
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Content */}
        <div className="p-4 flex-1">
          {/* AI Message */}
          <div className="flex gap-3 mb-6">
            <div className="w-6 h-6 bg-white border border-[#C56E33] rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-[#C56E33] rounded-full" />
            </div>
            <div className="bg-white shadow-lg rounded p-4 max-w-sm">
              <div className="text-black/60 text-sm mb-1">Hello, Benedict</div>
              <div className="text-black/60 text-sm leading-relaxed">
                My name is Aisha, your AI assistant. I am here to make your daily task easy from scheduling, assigning, notification, updates and completion rating here for you with ease. How can I be of help today?
              </div>
            </div>
          </div>
        </div>

        {/* Quick Suggestions */}
        <div className="p-4 border-t border-[#C56E33]/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 text-[#C56E33]">💡</div>
            <span className="text-[#C56E33] font-medium text-sm">Quick Suggestion</span>
          </div>
          <div className="space-y-2 text-sm opacity-50">
            <div>📊 Analyse recent task</div>
            <div>📅 Schedule meeting based on task</div>
            <div>📈 Check progress report</div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4">
          <div className="border border-black/24 rounded-full px-4 py-3">
            <input
              type="text"
              placeholder="Enter your message"
              className="w-full text-sm text-black/30 bg-transparent outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export const Component = Dashboard