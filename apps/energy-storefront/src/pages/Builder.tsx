import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Home, Building2, Factory, TreePine,
  Lightbulb, Fan, Tv, Refrigerator, AirVent, Waves,
  Plus, Minus, Trash2, ArrowRight, ArrowLeft,
  Zap, Battery, Sun, Download, Check, Mail
} from 'lucide-react'
import { useSystemBuilderStore, defaultAppliances, type PropertyType, type EnergyObjective } from '@/store/systemBuilderStore'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { bundleProducts } from '@/data/products'

const propertyTypes: { id: PropertyType; name: string; icon: typeof Home; description: string }[] = [
  { id: 'residential', name: 'Residential', icon: Home, description: 'Homes & apartments' },
  { id: 'commercial', name: 'Commercial', icon: Building2, description: 'Offices & retail' },
  { id: 'industrial', name: 'Industrial', icon: Factory, description: 'Factories & warehouses' },
  { id: 'estate', name: 'Estate/Mini-Grid', icon: TreePine, description: 'Multiple buildings' },
]

const energyObjectives: { id: EnergyObjective; name: string; description: string; hours: number }[] = [
  { id: 'standard', name: 'Standard Backup', description: '4-6 hours backup for essential loads', hours: 6 },
  { id: 'extended', name: 'Extended Backup', description: '8-12 hours backup for comfort', hours: 10 },
  { id: 'near-off-grid', name: 'Near Off-Grid', description: 'Minimal grid dependency (70%+ solar)', hours: 16 },
  { id: 'off-grid', name: 'Fully Off-Grid', description: 'Complete energy independence', hours: 24 },
]

const applianceIcons: Record<string, typeof Lightbulb> = {
  lighting: Lightbulb,
  cooling: Fan,
  entertainment: Tv,
  kitchen: Refrigerator,
  other: Zap,
}

export function Builder() {
  const store = useSystemBuilderStore()
  const [selectedAppliances, setSelectedAppliances] = useState<Record<string, { quantity: number; hours: number }>>({})

  const addAppliance = (applianceId: string) => {
    const appliance = defaultAppliances.find(a => a.id === applianceId)
    if (appliance) {
      setSelectedAppliances(prev => ({
        ...prev,
        [applianceId]: { quantity: (prev[applianceId]?.quantity || 0) + 1, hours: prev[applianceId]?.hours || 8 }
      }))
    }
  }

  const updateApplianceQuantity = (applianceId: string, delta: number) => {
    setSelectedAppliances(prev => {
      const current = prev[applianceId]?.quantity || 0
      const newQuantity = Math.max(0, current + delta)
      if (newQuantity === 0) {
        const { [applianceId]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [applianceId]: { ...prev[applianceId], quantity: newQuantity } }
    })
  }

  const updateApplianceHours = (applianceId: string, hours: number) => {
    setSelectedAppliances(prev => ({
      ...prev,
      [applianceId]: { ...prev[applianceId], hours }
    }))
  }

  const calculateResults = () => {
    // Calculate total load and consumption
    let totalLoad = 0
    let dailyConsumption = 0

    Object.entries(selectedAppliances).forEach(([id, { quantity, hours }]) => {
      const appliance = defaultAppliances.find(a => a.id === id)
      if (appliance) {
        totalLoad += appliance.wattage * quantity
        dailyConsumption += appliance.wattage * quantity * hours
      }
    })

    const backupHours = energyObjectives.find(o => o.id === store.energyObjective)?.hours || 6
    const recommendedInverterKva = Math.ceil((totalLoad * 1.3) / 1000)
    const recommendedBatteryKwh = Math.ceil((totalLoad * backupHours) / 1000 / 0.8 / 5) * 5

    let solarMultiplier = 0.5
    if (store.energyObjective === 'extended') solarMultiplier = 0.8
    if (store.energyObjective === 'near-off-grid') solarMultiplier = 1.2
    if (store.energyObjective === 'off-grid') solarMultiplier = 1.5

    const recommendedSolarKw = Math.ceil(((dailyConsumption / 1000) * solarMultiplier) / 4)

    const baseCost = (recommendedInverterKva * 250) + (recommendedBatteryKwh * 350) + (recommendedSolarKw * 800)
    const estimatedCost = { min: Math.round(baseCost * 0.9), max: Math.round(baseCost * 1.1) }
    const estimatedMonthlySavings = Math.round((dailyConsumption / 1000) * 30 * 150 * solarMultiplier / 1500)

    store.calculateResults()

    return {
      totalLoad,
      dailyConsumption,
      recommendedInverterKva: Math.max(5, recommendedInverterKva),
      recommendedBatteryKwh: Math.max(5, recommendedBatteryKwh),
      recommendedSolarKw: Math.max(2, recommendedSolarKw),
      estimatedCost,
      estimatedMonthlySavings
    }
  }

  const [calculatedResults, setCalculatedResults] = useState<ReturnType<typeof calculateResults> | null>(null)

  const handleNext = () => {
    if (store.currentStep === 3) {
      setCalculatedResults(calculateResults())
    }
    store.nextStep()
  }

  const matchingBundles = calculatedResults
    ? bundleProducts.filter(b =>
        b.specifications?.inverterKva &&
        b.specifications.inverterKva >= (calculatedResults.recommendedInverterKva - 2)
      ).slice(0, 3)
    : []

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="bg-navy py-12">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              System <span className="gradient-text">Builder</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Get a personalized energy system recommendation in minutes. Free, no obligation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Progress Steps */}
      <div className="bg-white border-b border-surface-300">
        <div className="container-custom py-4">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            {['Property', 'Appliances', 'Goals', 'Results'].map((step, i) => (
              <div key={step} className="flex items-center gap-2 md:gap-4">
                <div className={cn(
                  "flex items-center gap-2",
                  i + 1 <= store.currentStep ? "text-secondary" : "text-navy/40"
                )}>
                  <span className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                    i + 1 < store.currentStep ? "bg-secondary text-navy" :
                    i + 1 === store.currentStep ? "bg-secondary/20 text-secondary border-2 border-secondary" :
                    "bg-surface-200 text-navy/40"
                  )}>
                    {i + 1 < store.currentStep ? <Check className="w-4 h-4" /> : i + 1}
                  </span>
                  <span className="hidden sm:inline font-medium">{step}</span>
                </div>
                {i < 3 && (
                  <div className={cn(
                    "w-8 md:w-16 h-0.5",
                    i + 1 < store.currentStep ? "bg-secondary" : "bg-surface-300"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Property Type */}
            {store.currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="font-display text-2xl font-bold text-navy mb-2">
                  What type of property?
                </h2>
                <p className="text-navy/60 mb-8">
                  Select the type of property you want to power.
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {propertyTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => store.setPropertyType(type.id)}
                      className={cn(
                        "p-6 rounded-2xl text-left transition-all",
                        store.propertyType === type.id
                          ? "bg-secondary/10 border-2 border-secondary shadow-glow-teal"
                          : "bg-white border-2 border-transparent hover:border-secondary/30"
                      )}
                    >
                      <type.icon className={cn(
                        "w-10 h-10 mb-4",
                        store.propertyType === type.id ? "text-secondary" : "text-navy/40"
                      )} />
                      <h3 className="font-semibold text-lg text-navy">{type.name}</h3>
                      <p className="text-navy/60 text-sm">{type.description}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Appliances */}
            {store.currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="font-display text-2xl font-bold text-navy mb-2">
                  What do you want to power?
                </h2>
                <p className="text-navy/60 mb-8">
                  Add appliances and set how many hours per day you use them.
                </p>

                {/* Selected Appliances */}
                {Object.keys(selectedAppliances).length > 0 && (
                  <div className="bg-secondary/10 rounded-2xl p-4 mb-6">
                    <h3 className="font-semibold text-navy mb-3">Your Appliances</h3>
                    <div className="space-y-3">
                      {Object.entries(selectedAppliances).map(([id, { quantity, hours }]) => {
                        const appliance = defaultAppliances.find(a => a.id === id)!
                        return (
                          <div key={id} className="flex items-center gap-4 bg-white rounded-xl p-3">
                            <span className="flex-1 font-medium text-navy">{appliance.name}</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateApplianceQuantity(id, -1)}
                                className="p-1 rounded bg-surface-200 hover:bg-surface-300"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-semibold">{quantity}</span>
                              <button
                                onClick={() => updateApplianceQuantity(id, 1)}
                                className="p-1 rounded bg-surface-200 hover:bg-surface-300"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <select
                              value={hours}
                              onChange={(e) => updateApplianceHours(id, parseInt(e.target.value))}
                              className="px-2 py-1 rounded border border-surface-300 text-sm"
                            >
                              {[2, 4, 6, 8, 10, 12, 16, 24].map(h => (
                                <option key={h} value={h}>{h}h/day</option>
                              ))}
                            </select>
                            <span className="text-navy/60 text-sm w-20">
                              {appliance.wattage * quantity}W
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Appliance Categories */}
                {['lighting', 'cooling', 'entertainment', 'kitchen', 'other'].map((category) => {
                  const Icon = applianceIcons[category]
                  const categoryAppliances = defaultAppliances.filter(a => a.category === category)
                  return (
                    <div key={category} className="mb-6">
                      <h3 className="flex items-center gap-2 font-semibold text-navy capitalize mb-3">
                        <Icon className="w-5 h-5 text-secondary" />
                        {category}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {categoryAppliances.map((appliance) => (
                          <button
                            key={appliance.id}
                            onClick={() => addAppliance(appliance.id)}
                            className={cn(
                              "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                              selectedAppliances[appliance.id]
                                ? "bg-secondary text-navy"
                                : "bg-white hover:bg-secondary/10 text-navy/70"
                            )}
                          >
                            {appliance.name}
                            <span className="ml-2 opacity-60">{appliance.wattage}W</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            )}

            {/* Step 3: Energy Objectives */}
            {store.currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="font-display text-2xl font-bold text-navy mb-2">
                  What's your energy goal?
                </h2>
                <p className="text-navy/60 mb-8">
                  Choose how independent you want to be from the grid.
                </p>

                <div className="space-y-4 mb-8">
                  {energyObjectives.map((objective) => (
                    <button
                      key={objective.id}
                      onClick={() => store.setEnergyObjective(objective.id)}
                      className={cn(
                        "w-full p-6 rounded-2xl text-left transition-all",
                        store.energyObjective === objective.id
                          ? "bg-secondary/10 border-2 border-secondary"
                          : "bg-white border-2 border-transparent hover:border-secondary/30"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg text-navy">{objective.name}</h3>
                          <p className="text-navy/60">{objective.description}</p>
                        </div>
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                          store.energyObjective === objective.id
                            ? "border-secondary bg-secondary"
                            : "border-navy/30"
                        )}>
                          {store.energyObjective === objective.id && (
                            <Check className="w-4 h-4 text-navy" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: Results */}
            {store.currentStep === 4 && calculatedResults && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="font-display text-2xl font-bold text-navy mb-2">
                  Your Recommended System
                </h2>
                <p className="text-navy/60 mb-8">
                  Based on your inputs, here's what we recommend for your property.
                </p>

                {/* Results Cards */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white rounded-2xl p-6 text-center">
                    <Zap className="w-10 h-10 text-secondary mx-auto mb-3" />
                    <p className="text-navy/60 text-sm">Inverter Size</p>
                    <p className="font-display text-3xl font-bold text-navy">
                      {calculatedResults.recommendedInverterKva} KVA
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 text-center">
                    <Battery className="w-10 h-10 text-accent mx-auto mb-3" />
                    <p className="text-navy/60 text-sm">Battery Capacity</p>
                    <p className="font-display text-3xl font-bold text-navy">
                      {calculatedResults.recommendedBatteryKwh} kWh
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 text-center">
                    <Sun className="w-10 h-10 text-accent mx-auto mb-3" />
                    <p className="text-navy/60 text-sm">Solar Array</p>
                    <p className="font-display text-3xl font-bold text-navy">
                      {calculatedResults.recommendedSolarKw} kW
                    </p>
                  </div>
                </div>

                {/* Cost Estimate */}
                <div className="bg-secondary/10 rounded-2xl p-6 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-navy/60">Estimated Investment</p>
                      <p className="font-display text-2xl font-bold text-navy">
                        {formatCurrency(calculatedResults.estimatedCost.min)} - {formatCurrency(calculatedResults.estimatedCost.max)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-navy/60">Est. Monthly Savings</p>
                      <p className="font-display text-2xl font-bold text-secondary">
                        {formatCurrency(calculatedResults.estimatedMonthlySavings)}/mo
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-navy/60">
                    * Estimates based on average energy prices. Actual savings may vary.
                  </p>
                </div>

                {/* Matching Bundles */}
                {matchingBundles.length > 0 && (
                  <div className="mb-8">
                    <h3 className="font-semibold text-lg text-navy mb-4">Recommended Bundles</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {matchingBundles.map((bundle) => (
                        <Link
                          key={bundle.id}
                          to={`/product/${bundle.slug}`}
                          className="bg-white rounded-xl p-4 hover:shadow-card-hover transition-all"
                        >
                          <img
                            src={bundle.image}
                            alt={bundle.name}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <h4 className="font-semibold text-navy">{bundle.name}</h4>
                          <p className="font-display font-bold text-secondary">
                            {formatCurrency(bundle.price)}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lead Capture */}
                <div className="bg-navy rounded-2xl p-6">
                  <h3 className="font-semibold text-lg text-white mb-2">
                    Get Your Detailed Report
                  </h3>
                  <p className="text-white/70 mb-4">
                    Enter your email to receive a PDF report with full system specifications and recommendations.
                  </p>
                  <form className="flex gap-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-secondary/50"
                    />
                    <Button variant="primary">
                      <Download className="w-4 h-4" />
                      Get Report
                    </Button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="ghost"
              onClick={store.prevStep}
              disabled={store.currentStep === 1}
              className="text-navy"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            {store.currentStep < 4 ? (
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={
                  (store.currentStep === 1 && !store.propertyType) ||
                  (store.currentStep === 2 && Object.keys(selectedAppliances).length === 0) ||
                  (store.currentStep === 3 && !store.energyObjective)
                }
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Link to="/store">
                <Button variant="primary">
                  Browse Solutions
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
