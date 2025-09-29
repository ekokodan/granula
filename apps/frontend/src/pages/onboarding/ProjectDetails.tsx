import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, ArrowLeft } from 'lucide-react'

export default function ProjectDetails() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    projectName: '',
    industry: '',
    description: ''
  })

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (formData.projectName && formData.industry && formData.description) {
      // Store project data in localStorage
      localStorage.setItem('projectData', JSON.stringify(formData))
      
      // Check if user selected team plan to determine next step
      const selectedPlan = localStorage.getItem('selectedPlan')
      if (selectedPlan === 'team') {
        navigate('/onboarding/team-preference')
      } else {
        navigate('/onboarding/welcome')
      }
    }
  }

  const handleBack = () => {
    navigate('/onboarding/profile-setup')
  }

  const isFormValid = formData.projectName && formData.industry && formData.description

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#987628] font-medium">Project</span>
            <span className="text-sm text-gray-400">3/5</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[#987628] h-2 rounded-full" style={{ width: '60%' }} />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-12">
          <p className="text-[#987628] text-sm font-medium mb-2">Project Details</p>
          <h1 className="text-2xl font-semibold text-black mb-12 font-body">
            Tell us about this<br />project
          </h1>

          {/* Form Fields */}
          <div className="space-y-4 mb-12">
            <Input
              type="text"
              placeholder="Project name"
              value={formData.projectName}
              onChange={(e) => handleInputChange('projectName', e.target.value)}
              className="w-full h-14 bg-white border border-gray-300 rounded-3xl px-6 text-base placeholder:text-gray-500 focus:border-[#987628] focus:ring-[#987628]"
            />
            
            <Input
              type="text"
              placeholder="What industry?"
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              className="w-full h-14 bg-white border border-gray-300 rounded-3xl px-6 text-base placeholder:text-gray-500 focus:border-[#987628] focus:ring-[#987628]"
            />
            
            <Textarea
              placeholder="Tell us about this project"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full h-14 bg-white border border-gray-300 rounded-3xl px-6 py-4 text-base placeholder:text-gray-500 focus:border-[#987628] focus:ring-[#987628] resize-none"
              rows={1}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="space-y-4">
            <Button
              onClick={handleNext}
              disabled={!isFormValid}
              className="w-full h-14 bg-[#987628] hover:bg-[#7a5e20] text-white rounded-3xl text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Next</span>
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
      </div>
    </div>
  )
}

export const Component = ProjectDetails