import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowRight, ArrowLeft } from 'lucide-react'

export default function TeamPreference() {
  const navigate = useNavigate()
  const [preferenceType, setPreferenceType] = useState<'select' | 'input'>('select')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [customDepartment, setCustomDepartment] = useState('')

  const departments = [
    'Engineering',
    'Marketing',
    'Sales',
    'Human Resources',
    'Finance',
    'Operations',
    'Design',
    'Product Management'
  ]

  const handleNext = () => {
    const departmentValue = preferenceType === 'select' ? selectedDepartment : customDepartment
    if (departmentValue) {
      // Store team preference data in localStorage
      localStorage.setItem('teamPreference', JSON.stringify({
        department: departmentValue,
        type: preferenceType
      }))
      navigate('/onboarding/team-setup')
    }
  }

  const handleBack = () => {
    navigate('/onboarding/project-details')
  }

  const isFormValid = preferenceType === 'select' ? selectedDepartment : customDepartment

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#987628] font-medium">Preference</span>
            <span className="text-sm text-gray-400">4/5</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[#987628] h-2 rounded-full" style={{ width: '80%' }} />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-12">
          <p className="text-[#987628] text-sm font-medium mb-2">Team Preference</p>
          <h1 className="text-2xl font-semibold text-black mb-12 font-body">
            Better organise your<br />project
          </h1>

          {/* Toggle between select and input */}
          <div className="mb-8">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setPreferenceType('select')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  preferenceType === 'select'
                    ? 'bg-[#987628] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Select Department
              </button>
              <button
                onClick={() => setPreferenceType('input')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  preferenceType === 'input'
                    ? 'bg-[#987628] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Custom Department
              </button>
            </div>

            {/* Department Selection/Input */}
            {preferenceType === 'select' ? (
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-full h-14 bg-white border border-gray-300 rounded-3xl px-6 text-base focus:border-[#987628] focus:ring-[#987628]">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                type="text"
                placeholder="What's the name of your department?"
                value={customDepartment}
                onChange={(e) => setCustomDepartment(e.target.value)}
                className="w-full h-14 bg-white border border-gray-300 rounded-3xl px-6 text-base placeholder:text-gray-500 focus:border-[#987628] focus:ring-[#987628]"
              />
            )}
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

export const Component = TeamPreference