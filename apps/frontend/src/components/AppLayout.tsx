import { ReactNode, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Calendar, 
  CheckSquare, 
  Activity, 
  Users, 
  FolderOpen, 
  ChevronDown,
  Plus,
  Bell,
  Search,
  Settings
} from 'lucide-react'
import { authStore } from '@/store/auth'
import { apiClient } from '@/utils/api'
import { Project } from '@/utils/api'

interface AppLayoutProps {
  children: ReactNode
}

interface NavItem {
  path: string
  label: string
  icon: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation()
  const { user } = authStore()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  
  const navItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
    { path: '/schedule', label: 'Schedule', icon: <Calendar className="w-4 h-4" /> },
    { path: '/meeting', label: 'Meeting', icon: <CheckSquare className="w-4 h-4" /> },
    { path: '/activity', label: 'Activity', icon: <Activity className="w-4 h-4" /> },
    { path: '/team', label: 'Team', icon: <Users className="w-4 h-4" /> },
  ]

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const projectsData = await apiClient.getProjects()
      setProjects(projectsData.projects || [])
    } catch (error) {
      console.error('Failed to load projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-[#FAF1DD] flex">
      {/* Sidebar */}
      <div className="w-[260px] bg-white border-r border-black/30 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-black/30">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gradient-to-br from-[#C56E33] to-[#987628] rounded-full" />
            <span className="text-lg font-semibold">Granula</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <nav className="space-y-1.5">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-2.5 px-3 py-2 rounded-full transition-colors text-xs
                    ${isActive(item.path) 
                      ? 'bg-[#FAF1DD] text-[#987628] font-medium' 
                      : 'text-black/50 hover:text-black'
                    }
                  `}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Projects Section */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3 px-3">
                <span className="text-xs font-medium text-black/70">Projects</span>
                <button className="text-black/50 hover:text-black transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-1">
                {loading ? (
                  <div className="px-3 py-2">
                    <div className="h-2 bg-gray-200 rounded animate-pulse" />
                  </div>
                ) : projects.length === 0 ? (
                  <div className="px-3 py-2 text-[11px] text-black/40">
                    No projects yet
                  </div>
                ) : (
                  projects.slice(0, 5).map(project => (
                    <Link
                      key={project.id}
                      to={`/project/${project.id}`}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs text-black/60 hover:text-black transition-colors"
                    >
                      <div className="w-1.5 h-1.5 bg-[#C56E33] rounded-full" />
                      <span className="truncate">{project.name}</span>
                      {project.status === 'active' && (
                        <span className="text-[10px] text-green-600">●</span>
                      )}
                    </Link>
                  ))
                )}
                {projects.length > 5 && (
                  <Link
                    to="/projects"
                    className="flex items-center gap-2 px-3 py-1.5 text-[11px] text-[#987628] hover:text-[#7a5f20] transition-colors"
                  >
                    View all projects →
                  </Link>
                )}
              </div>
            </div>

            {/* Active Members */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3 px-3">
                <span className="text-xs font-medium text-black/70">Active Members</span>
              </div>
              <div className="flex -space-x-2 px-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-7 h-7 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-medium text-gray-600"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
                <div className="w-7 h-7 bg-[#FAF1DD] rounded-full border-2 border-white flex items-center justify-center text-[10px] font-medium text-[#987628]">
                  +2
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-black/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">{user?.username || 'User'}</div>
              <div className="text-[10px] text-black/50 truncate">{user?.email}</div>
            </div>
            <button className="text-black/50 hover:text-black transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-black/30 px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-1.5 bg-[#FAF1DD] rounded-full text-sm outline-none focus:ring-2 focus:ring-[#987628]/30"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="relative">
                <Bell className="w-5 h-5 text-black/50 hover:text-black transition-colors" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#C22121] rounded-full" />
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}