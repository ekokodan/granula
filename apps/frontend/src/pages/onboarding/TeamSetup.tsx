import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, ArrowLeft, Plus, X } from 'lucide-react'

export default function TeamSetup() {
  const navigate = useNavigate()
  const [teamLead, setTeamLead] = useState('benedictdayas@zike.com')
  const [collaborators, setCollaborators] = useState<string[]>([])
  const [newCollaborator, setNewCollaborator] = useState('')

  const addCollaborator = () => {
    if (newCollaborator && !collaborators.includes(newCollaborator)) {
      setCollaborators([...collaborators, newCollaborator])
      setNewCollaborator('')
    }
  }

  const removeCollaborator = (email: string) => {
    setCollaborators(collaborators.filter(c => c !== email))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addCollaborator()
    }
  }

  const handleNext = () => {
    // Store team setup data in localStorage
    localStorage.setItem('teamSetup', JSON.stringify({
      teamLead,
      collaborators
    }))
    navigate('/onboarding/welcome')
  }

  const handleBack = () => {
    navigate('/onboarding/team-preference')
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#987628] font-medium">Team</span>
            <span className="text-sm text-gray-400">5/5</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[#987628] h-2 rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-12">
          <p className="text-[#987628] text-sm font-medium mb-2">The Team</p>
          <h1 className="text-2xl font-semibold text-black mb-12 font-body">
            Explore team<br />collaboration
          </h1>

          {/* Team Lead */}
          <div className="mb-6">
            <p className="text-left text-[#987628] text-sm font-medium mb-3">Team Lead (YOU)</p>
            <Input
              type="email"
              value={teamLead}
              onChange={(e) => setTeamLead(e.target.value)}
              className="w-full h-14 bg-white border border-gray-300 rounded-3xl px-6 text-base focus:border-[#987628] focus:ring-[#987628]"
            />
          </div>

          {/* Add Collaborators Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <p className="text-left text-[#987628] text-sm font-medium">Add Collaborators</p>
              <button
                onClick={addCollaborator}
                className="w-6 h-6 bg-[#987628] text-white rounded-full flex items-center justify-center hover:bg-[#7a5e20] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <Input
              type="email"
              placeholder="+ Add team members"
              value={newCollaborator}
              onChange={(e) => setNewCollaborator(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full h-14 bg-white border border-gray-300 rounded-3xl px-6 text-base placeholder:text-gray-500 focus:border-[#987628] focus:ring-[#987628]"
            />

            {/* Display added collaborators */}
            {collaborators.length > 0 && (
              <div className="mt-4 space-y-2">
                {collaborators.map((email, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 rounded-3xl px-4 py-3">
                    <span className="text-sm text-gray-700">{email}</span>
                    <button
                      onClick={() => removeCollaborator(email)}
                      className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="space-y-4">
            <Button
              onClick={handleNext}
              className="w-full h-14 bg-[#987628] hover:bg-[#7a5e20] text-white rounded-3xl text-lg font-medium"
            >
              <span>Complete setup</span>
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

export const Component = TeamSetup