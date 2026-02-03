'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { ScrollReveal } from '@/components/ScrollAnimations'
import { Zap, Battery, Sun, Fan, Tv, Monitor, Lightbulb, Wifi, Plus, Minus, RotateCcw, ArrowRight } from 'lucide-react'

// Appliance Data
const initialAppliances = [
    { id: 'fan', name: 'Ceiling Fan', watts: 75, icon: Fan },
    { id: 'tv', name: 'LED TV (55")', watts: 100, icon: Tv },
    { id: 'fridge', name: 'Refrigerator', watts: 200, icon: Zap }, // Simplified
    { id: 'freezer', name: 'Deep Freezer', watts: 250, icon: Zap },
    { id: 'ac1', name: '1HP Inverter AC', watts: 900, icon: Sun },
    { id: 'ac15', name: '1.5HP Inverter AC', watts: 1300, icon: Sun },
    { id: 'pump', name: 'Water Pump (1HP)', watts: 750, icon: Zap },
    { id: 'laptop', name: 'Laptop', watts: 65, icon: Monitor },
    { id: 'lights', name: 'LED Bulbs (x5)', watts: 50, icon: Lightbulb },
    { id: 'wifi', name: 'WiFi Router', watts: 15, icon: Wifi },
]

export default function BuilderPage() {
    // State
    const [selectedAppliances, setSelectedAppliances] = useState<Record<string, number>>({})
    const [customWattages, setCustomWattages] = useState<Record<string, number>>({})
    const [backupHours, setBackupHours] = useState([4])
    const [energyGoal, setEnergyGoal] = useState('backup') // backup, hybrid, offgrid
    const [applicationType, setApplicationType] = useState('residential') // residential, commercial
    const [showEmailModal, setShowEmailModal] = useState(false)
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Calculations
    const [totalLoad, setTotalLoad] = useState(0)
    const [recommendedInverter, setRecommendedInverter] = useState(0)
    const [recommendedBattery, setRecommendedBattery] = useState(0)
    const [recommendedSolar, setRecommendedSolar] = useState(0)
    const [estimatedCost, setEstimatedCost] = useState(0)

    useEffect(() => {
        let load = 0
        Object.entries(selectedAppliances).forEach(([id, qty]) => {
            const appliance = initialAppliances.find(a => a.id === id)
            if (appliance) {
                // Use custom wattage if available, otherwise default
                const watts = customWattages[id] || appliance.watts
                load += watts * qty
            }
        })
        setTotalLoad(load)

        const loadKW = load / 1000

        // Toju's Logic Integration
        
        // 1. Inverter Sizing
        // Safety factor: 1.5 for off-grid, 1.25 for others
        const safetyFactor = energyGoal === 'offgrid' ? 1.5 : 1.25
        const invSizeKVA = Math.ceil(loadKW * safetyFactor)
        setRecommendedInverter(Math.max(invSizeKVA * 1000, 1000)) // Store in VA

        // 2. Battery Sizing
        // Battery kWh = (Load kW * Backup Hours) / (DOD * Efficiency)
        // DOD = 0.8 (Lithium), Efficiency = 0.95
        const battKWh = (loadKW * backupHours[0]) / (0.8 * 0.95)
        setRecommendedBattery(Math.ceil(battKWh))

        // 3. Solar Sizing (Optional/Estimate)
        // Solar kW = (Daily Energy Needs) / (Peak Sun Hours * Efficiency)
        // Assume 8 hours daily usage for simple calc
        const dailyEnergy = loadKW * 8
        const peakSun = 5 // Average Nigeria
        const solarKW = dailyEnergy / (peakSun * 0.8)
        setRecommendedSolar(Math.ceil(solarKW))

        // Cost Estimation (Rough mock)
        // Inverter: ~150k per kVA
        // Battery: ~250k per kWh
        // Solar: ~100k per kW
        const cost = (invSizeKVA * 150000) + (battKWh * 250000) + (solarKW * 100000)
        setEstimatedCost(cost)

    }, [selectedAppliances, backupHours, energyGoal, customWattages])

    const updateQuantity = (id: string, delta: number) => {
        setSelectedAppliances(prev => {
            const current = prev[id] || 0
            const next = Math.max(0, current + delta)
            if (next === 0) {
                const { [id]: _, ...rest } = prev
                return rest
            }
            return { ...prev, [id]: next }
        })
    }

    const updateWattage = (id: string, watts: number) => {
        setCustomWattages(prev => ({ ...prev, [id]: watts }))
    }

    const handleDownloadReport = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate API call and Download
        setTimeout(() => {
            setIsSubmitting(false)
            setShowEmailModal(false)

            // Create a mock file download
            const element = document.createElement("a");
            const file = new Blob([`GridCo System Report\n\nTotal Load: ${totalLoad}W\nRecommended Inverter: ${recommendedInverter / 1000}kVA\nRequired Battery: ${recommendedBattery.toFixed(1)}kWh\nRecommended Solar: ${recommendedSolar}kW\nEstimated Cost: ₦${estimatedCost.toLocaleString()}\n\nPrepared for:\nEmail: ${email}\nPhone: ${phone}`], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);
            element.download = "GridCo_System_Report.txt";
            document.body.appendChild(element); // Required for this to work in FireFox
            element.click();

            alert(`Report sent to ${email}!`)
            setEmail('')
            setPhone('')
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-gray-warm-50 flex flex-col relative">
            <Navbar />

            <div className="flex-grow flex flex-col lg:flex-row pt-20">

                {/* Main Content - Appliance Selection */}
                <main className="flex-grow p-6 lg:p-12 pb-32 lg:pb-12">
                    <div className="max-w-4xl mx-auto">
                        <ScrollReveal>
                            <div className="mb-12">
                                <h1 className="text-h2 font-bold text-gray-cool-900 mb-4">
                                    Design Your Power System
                                </h1>
                                <p className="text-body-lg text-gray-cool-600">
                                    Select your appliances to calculate your load. We'll recommend the perfect inverter and battery setup.
                                </p>
                            </div>
                        </ScrollReveal>

                        {/* Application Type Toggle */}
                        <div className="mb-12">
                            <h3 className="text-h5 font-semibold text-gray-cool-900 mb-4">Application Type</h3>
                            <div className="flex p-1 bg-gray-cool-100 rounded-xl w-fit">
                                {['residential', 'commercial'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setApplicationType(type)}
                                        className={`px-6 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-normal relative overflow-hidden group ${applicationType === type
                                            ? 'text-primary-700 shadow-sm ring-1 ring-black/5'
                                            : 'text-gray-cool-500 hover:text-gray-cool-900'
                                            }`}
                                    >
                                        {applicationType === type && (
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-white opacity-100 z-0" />
                                        )}
                                        <span className="relative z-10">{type}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Energy Goal Selection */}
                        <div className="mb-12">
                            <h3 className="text-h5 font-semibold text-gray-cool-900 mb-4">System Goal</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { id: 'backup', label: 'Power Backup', desc: 'Keep essentials running during outages' },
                                    { id: 'hybrid', label: 'Hybrid Solar', desc: 'Reduce bills and backup power' },
                                    { id: 'offgrid', label: 'Total Off-Grid', desc: 'Complete independence from NEPA' }
                                ].map((goal) => (
                                    <button
                                        key={goal.id}
                                        onClick={() => setEnergyGoal(goal.id)}
                                        className={`p-4 rounded-xl border text-left transition-all duration-normal relative overflow-hidden group ${energyGoal === goal.id
                                            ? 'border-primary-500 ring-1 ring-primary-500'
                                            : 'bg-white border-gray-cool-200 hover:border-primary-300'
                                            }`}
                                    >
                                        {/* Gradient Background for Active State */}
                                        {energyGoal === goal.id && (
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-white opacity-100 z-0" />
                                        )}

                                        <div className="relative z-10">
                                            <div className={`font-semibold mb-1 ${energyGoal === goal.id ? 'text-primary-900' : 'text-gray-cool-900'}`}>
                                                {goal.label}
                                            </div>
                                            <div className="text-sm text-gray-cool-500">{goal.desc}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Appliance Grid */}
                        <h3 className="text-h5 font-semibold text-gray-cool-900 mb-4">Select Appliances</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-12">
                            {initialAppliances.map((appliance) => (
                                <div
                                    key={appliance.id}
                                    className={`p-4 rounded-xl border bg-white transition-all duration-fast flex items-center justify-between ${selectedAppliances[appliance.id]
                                        ? 'border-primary-500 shadow-md ring-1 ring-primary-500/20'
                                        : 'border-gray-cool-100 hover:border-primary-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${selectedAppliances[appliance.id] ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'}`}>
                                            <appliance.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-cool-900">{appliance.name}</div>
                                            <div className="flex items-center gap-1 text-xs text-gray-cool-500">
                                                <input 
                                                    type="number" 
                                                    value={customWattages[appliance.id] || appliance.watts}
                                                    onChange={(e) => updateWattage(appliance.id, parseInt(e.target.value) || 0)}
                                                    className="w-12 bg-transparent border-b border-dashed border-gray-300 focus:border-primary-500 outline-none text-center"
                                                />
                                                <span>W</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {selectedAppliances[appliance.id] ? (
                                            <>
                                                <button
                                                    onClick={() => updateQuantity(appliance.id, -1)}
                                                    className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="font-semibold w-4 text-center">{selectedAppliances[appliance.id]}</span>
                                                <button
                                                    onClick={() => updateQuantity(appliance.id, 1)}
                                                    className="p-1 rounded-full hover:bg-primary-50 text-primary-600"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => updateQuantity(appliance.id, 1)}
                                                className="p-2 rounded-full hover:bg-primary-50 text-primary-600"
                                            >
                                                <Plus className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>

                {/* Sidebar - Calculator Results */}
                <aside className="w-full lg:w-[400px] bg-white border-t lg:border-t-0 lg:border-l border-gray-cool-200 p-6 lg:p-8 flex flex-col shadow-2xl lg:shadow-none z-20 lg:sticky lg:top-20 lg:h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="mb-8">
                        <h3 className="text-h4 font-bold text-gray-cool-900 mb-6">System Summary</h3>

                        {/* Load Meter */}
                        <div className="mb-8">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-cool-600">Total Load</span>
                                <span className="font-bold text-gray-cool-900">{totalLoad} Watts</span>
                            </div>
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary-500 transition-all duration-normal"
                                    style={{ width: `${Math.min((totalLoad / 10000) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Backup Slider */}
                        <div className="mb-8">
                            <div className="flex justify-between text-sm mb-4">
                                <span className="text-gray-cool-600">Desired Backup Time</span>
                                <span className="font-bold text-primary-700">{backupHours[0]} Hours</span>
                            </div>
                            <Slider
                                value={backupHours}
                                onValueChange={setBackupHours}
                                max={24}
                                min={1}
                                step={1}
                                className="py-4"
                            />
                        </div>

                        {/* Recommendations */}
                        <div className="space-y-4 mb-8">
                            <div className="p-4 bg-gray-warm-50 rounded-xl border border-gray-cool-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <Zap className="h-5 w-5 text-yellow-500" />
                                    <span className="font-medium text-gray-cool-900">Recommended Inverter</span>
                                </div>
                                <div className="text-2xl font-bold text-gray-cool-900 ml-8">
                                    {recommendedInverter / 1000} kVA
                                </div>
                            </div>

                            <div className="p-4 bg-gray-warm-50 rounded-xl border border-gray-cool-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <Battery className="h-5 w-5 text-green-500" />
                                    <span className="font-medium text-gray-cool-900">Required Battery</span>
                                </div>
                                <div className="text-2xl font-bold text-gray-cool-900 ml-8">
                                    {recommendedBattery.toFixed(1)} kWh
                                </div>
                            </div>

                            <div className="p-4 bg-gray-warm-50 rounded-xl border border-gray-cool-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <Sun className="h-5 w-5 text-orange-500" />
                                    <span className="font-medium text-gray-cool-900">Recommended Solar</span>
                                </div>
                                <div className="text-2xl font-bold text-gray-cool-900 ml-8">
                                    {recommendedSolar} kW
                                </div>
                            </div>
                        </div>

                        {/* Estimated Cost */}
                        <div className="pt-6 border-t border-gray-cool-100 mb-8">
                            <div className="text-sm text-gray-cool-500 mb-1">Estimated System Cost</div>
                            <div className="text-3xl font-bold text-gray-cool-900">
                                ₦{estimatedCost.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-cool-400 mt-2">
                                *Estimate only. Installation not included.
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto space-y-3">
                        <Button size="lg" className="w-full bg-primary-600 hover:bg-primary-700 text-white shadow-lg">
                            Get Detailed Quote
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full border-primary-200 text-primary-700 hover:bg-primary-50"
                            onClick={() => setShowEmailModal(true)}
                        >
                            Get Your Report
                        </Button>
                        <Button variant="ghost" className="w-full text-gray-cool-500" onClick={() => {
                            setSelectedAppliances({})
                            setTotalLoad(0)
                        }}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset Calculator
                        </Button>
                    </div>
                </aside>
            </div>

            {/* Email Capture Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setShowEmailModal(false)}
                            className="absolute top-4 right-4 text-gray-cool-400 hover:text-gray-cool-600"
                        >
                            <RotateCcw className="h-5 w-5 rotate-45" /> {/* Using RotateCcw as X icon substitute or just use X from lucide if imported, checking imports... X is not imported, using RotateCcw rotated for now or adding X import */}
                        </button>

                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 mb-4">
                                <Zap className="h-6 w-6 text-primary-600" />
                            </div>
                            <h3 className="text-h4 font-bold text-gray-cool-900">Save Your Design</h3>
                            <p className="text-body text-gray-cool-600 mt-2">
                                Enter your contact details to download your system report and get a copy sent to your inbox.
                            </p>
                        </div>

                        <form onSubmit={handleDownloadReport} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-cool-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-cool-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-cool-700 mb-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-cool-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                    placeholder="+234..."
                                />
                            </div>
                            <div className="flex flex-col gap-3 pt-6 border-t border-gray-cool-200">
                                <Button
                                    className="w-full bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/25"
                                    onClick={() => {
                                        // In a real app, this would add to cart context
                                        window.location.href = '/checkout?source=builder'
                                    }}
                                >
                                    Buy This System
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full border-primary-200 text-primary-700 hover:bg-primary-50"
                                    onClick={handleDownloadReport}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Sending...' : 'Get Your Report'}
                                </Button>
                            </div>
                            <p className="text-xs text-center text-gray-cool-400">
                                We respect your privacy. No spam.
                            </p>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
