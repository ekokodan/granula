import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

type PlanType = 'individual' | 'team' | null

export default function PlanSelection() {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(null)

  const handleNext = () => {
    if (selectedPlan) {
      // Store plan selection in localStorage or context
      localStorage.setItem('selectedPlan', selectedPlan)
      navigate('/onboarding/profile-setup')
    }
  }

  // No back navigation needed since account is already created

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#987628] font-medium">Plan</span>
            <span className="text-sm text-gray-400">1/5</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[#987628] h-2 rounded-full" style={{ width: '20%' }} />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-12">
          <p className="text-[#987628] text-sm font-medium mb-2">Plan Type</p>
          <h1 className="text-2xl font-semibold text-black mb-12 font-body">
            Select your project<br />best fit
          </h1>

          {/* Plan Options */}
          <div className="space-y-4 mb-12">
            {/* Individual Plan */}
            <div 
              onClick={() => setSelectedPlan('individual')}
              className={`w-full p-6 rounded-3xl border-2 cursor-pointer transition-all ${
                selectedPlan === 'individual' 
                  ? 'border-[#987628] bg-[#987628]/5' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                  selectedPlan === 'individual' 
                    ? 'border-[#987628] bg-[#987628]' 
                    : 'border-gray-300'
                }`}>
                  {selectedPlan === 'individual' && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-black mb-1">INDIVIDUAL</h3>
                  <p className="text-gray-600 text-sm">A solo user plan</p>
                </div>
              </div>
            </div>

            {/* Team Plan */}
            <div 
              onClick={() => setSelectedPlan('team')}
              className={`w-full p-6 rounded-3xl border-2 cursor-pointer transition-all ${
                selectedPlan === 'team' 
                  ? 'border-[#987628] bg-[#987628]/5' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                  selectedPlan === 'team' 
                    ? 'border-[#987628] bg-[#987628]' 
                    : 'border-gray-300'
                }`}>
                  {selectedPlan === 'team' && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-black mb-1">TEAM</h3>
                  <p className="text-gray-600 text-sm">A collaborative plan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Button */}
          <Button
            onClick={handleNext}
            disabled={!selectedPlan}
            className="w-full h-14 bg-[#987628] hover:bg-[#7a5e20] text-white rounded-3xl text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export const Component = PlanSelection