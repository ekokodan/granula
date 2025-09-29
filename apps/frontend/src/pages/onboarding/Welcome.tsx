import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import api from '@/lib/api'
import { Input } from '@/components/ui/input'
import { ArrowRight, ArrowLeft } from 'lucide-react'

export default function Welcome() {
  const navigate = useNavigate()
  const [firstProjectName, setFirstProjectName] = useState('')

  const handleStartProject = async () => {
    if (firstProjectName) {
      // Store first project name and complete onboarding
      localStorage.setItem('firstProject', firstProjectName)
      localStorage.setItem('onboardingCompleted', 'true')
      
      try {
        await api.patch('/users/me', { onboarding_complete: true })
      } catch (_) {}
      
      // Navigate to dashboard
      navigate('/dashboard')
    }
  }

  const handleBack = () => {
    // Check if user came from team setup or project details
    const selectedPlan = localStorage.getItem('selectedPlan')
    if (selectedPlan === 'team') {
      navigate('/onboarding/team-setup')
    } else {
      navigate('/onboarding/project-details')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* Welcome Message */}
        <div className="mb-16">
          <h1 className="text-3xl font-semibold text-black mb-4 font-body">
            Let's work on your first<br />project.
          </h1>
          
          <p className="text-gray-600 text-base mb-8">
            Start with your project name: e.g Construction site, engineering<br />
            ring, sequence board
          </p>

          {/* First Project Input */}
          <div className="mb-8">
            <Input
              type="text"
              placeholder="Your first project"
              value={firstProjectName}
              onChange={(e) => setFirstProjectName(e.target.value)}
              className="w-full h-14 bg-white border border-gray-300 rounded-3xl px-6 text-base placeholder:text-gray-500 focus:border-[#987628] focus:ring-[#987628] shadow-sm"
            />
          </div>

          {/* Navigation Buttons */}
          <div className="space-y-4">
            <Button
              onClick={handleStartProject}
              disabled={!firstProjectName}
              className="w-full h-14 bg-[#987628] hover:bg-[#7a5e20] text-white rounded-3xl text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
            >
              <span>Start project</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <button
              onClick={handleBack}
              className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
            >
              Go back
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-30 animate-float" />
          <div className="absolute top-40 right-16 w-16 h-16 bg-purple-200 rounded-full opacity-40 animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-32 left-20 w-12 h-12 bg-yellow-200 rounded-full opacity-35 animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-green-200 rounded-full opacity-25 animate-float" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>
    </div>
  )
}

export const Component = Welcome
