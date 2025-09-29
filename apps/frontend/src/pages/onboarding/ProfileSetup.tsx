import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, ArrowLeft } from 'lucide-react'

export default function ProfileSetup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    contactNumber: ''
  })

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (formData.fullName && formData.companyName && formData.contactNumber) {
      // Store profile data in localStorage
      localStorage.setItem('profileData', JSON.stringify(formData))
      navigate('/onboarding/project-details')
    }
  }

  const handleBack = () => {
    navigate('/onboarding/plan-selection')
  }

  const isFormValid = formData.fullName && formData.companyName && formData.contactNumber

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#987628] font-medium">Profile setup</span>
            <span className="text-sm text-gray-400">2/5</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[#987628] h-2 rounded-full" style={{ width: '40%' }} />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-12">
          <p className="text-[#987628] text-sm font-medium mb-2">User Profile</p>
          <h1 className="text-2xl font-semibold text-black mb-12 font-body">
            Ensure personal<br />information are valid
          </h1>

          {/* Form Fields */}
          <div className="space-y-4 mb-12">
            <Input
              type="text"
              placeholder="Full name"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="w-full h-14 bg-white border border-gray-300 rounded-3xl px-6 text-base placeholder:text-gray-500 focus:border-[#987628] focus:ring-[#987628]"
            />
            
            <Input
              type="text"
              placeholder="Company name"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              className="w-full h-14 bg-white border border-gray-300 rounded-3xl px-6 text-base placeholder:text-gray-500 focus:border-[#987628] focus:ring-[#987628]"
            />
            
            <Input
              type="tel"
              placeholder="Contact number"
              value={formData.contactNumber}
              onChange={(e) => handleInputChange('contactNumber', e.target.value)}
              className="w-full h-14 bg-white border border-gray-300 rounded-3xl px-6 text-base placeholder:text-gray-500 focus:border-[#987628] focus:ring-[#987628]"
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
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Component = ProfileSetup