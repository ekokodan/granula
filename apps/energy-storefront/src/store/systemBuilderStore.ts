import { create } from 'zustand'

export interface Appliance {
  id: string
  name: string
  wattage: number
  quantity: number
  hoursPerDay: number
  category: 'lighting' | 'cooling' | 'entertainment' | 'kitchen' | 'other'
}

export const defaultAppliances: Omit<Appliance, 'quantity' | 'hoursPerDay'>[] = [
  { id: 'led-light', name: 'LED Light Bulb', wattage: 10, category: 'lighting' },
  { id: 'ceiling-fan', name: 'Ceiling Fan', wattage: 75, category: 'cooling' },
  { id: 'standing-fan', name: 'Standing Fan', wattage: 60, category: 'cooling' },
  { id: 'ac-1hp', name: 'Air Conditioner (1HP)', wattage: 1000, category: 'cooling' },
  { id: 'ac-1.5hp', name: 'Air Conditioner (1.5HP)', wattage: 1500, category: 'cooling' },
  { id: 'ac-2hp', name: 'Air Conditioner (2HP)', wattage: 2000, category: 'cooling' },
  { id: 'tv-led', name: 'LED TV (42")', wattage: 100, category: 'entertainment' },
  { id: 'tv-large', name: 'LED TV (55"+)', wattage: 150, category: 'entertainment' },
  { id: 'decoder', name: 'Satellite Decoder', wattage: 30, category: 'entertainment' },
  { id: 'sound-system', name: 'Sound System', wattage: 200, category: 'entertainment' },
  { id: 'refrigerator', name: 'Refrigerator', wattage: 150, category: 'kitchen' },
  { id: 'freezer', name: 'Deep Freezer', wattage: 200, category: 'kitchen' },
  { id: 'microwave', name: 'Microwave', wattage: 1200, category: 'kitchen' },
  { id: 'blender', name: 'Blender', wattage: 400, category: 'kitchen' },
  { id: 'water-pump', name: 'Water Pump', wattage: 750, category: 'other' },
  { id: 'laptop', name: 'Laptop', wattage: 65, category: 'other' },
  { id: 'desktop', name: 'Desktop Computer', wattage: 200, category: 'other' },
  { id: 'router', name: 'WiFi Router', wattage: 15, category: 'other' },
  { id: 'washing-machine', name: 'Washing Machine', wattage: 500, category: 'other' },
  { id: 'iron', name: 'Pressing Iron', wattage: 1000, category: 'other' },
]

export type PropertyType = 'residential' | 'commercial' | 'industrial' | 'estate'
export type EnergyObjective = 'standard' | 'extended' | 'near-off-grid' | 'off-grid'
export type BudgetRange = 'under-5k' | '5k-10k' | '10k-25k' | 'above-25k' | 'open'

interface SystemBuilderStore {
  // Step tracking
  currentStep: number

  // Step 1: Property Type
  propertyType: PropertyType | null

  // Step 2: Appliances
  appliances: Appliance[]

  // Step 3: Energy Objective
  energyObjective: EnergyObjective | null
  backupHours: number

  // Step 4: Budget
  budgetRange: BudgetRange | null

  // Step 5: Contact (for lead capture)
  email: string
  phone: string
  name: string

  // Calculated results
  results: {
    totalLoad: number
    dailyConsumption: number
    recommendedInverterKva: number
    recommendedBatteryKwh: number
    recommendedSolarKw: number
    estimatedCost: { min: number; max: number }
    estimatedMonthlySavings: number
  } | null

  // Actions
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  setPropertyType: (type: PropertyType) => void
  addAppliance: (appliance: Appliance) => void
  updateAppliance: (id: string, updates: Partial<Appliance>) => void
  removeAppliance: (id: string) => void
  setEnergyObjective: (objective: EnergyObjective) => void
  setBackupHours: (hours: number) => void
  setBudgetRange: (range: BudgetRange) => void
  setContactInfo: (info: { email?: string; phone?: string; name?: string }) => void
  calculateResults: () => void
  reset: () => void
}

export const useSystemBuilderStore = create<SystemBuilderStore>((set, get) => ({
  currentStep: 1,
  propertyType: null,
  appliances: [],
  energyObjective: null,
  backupHours: 6,
  budgetRange: null,
  email: '',
  phone: '',
  name: '',
  results: null,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 6) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

  setPropertyType: (type) => set({ propertyType: type }),

  addAppliance: (appliance) =>
    set((state) => ({
      appliances: [...state.appliances, appliance],
    })),

  updateAppliance: (id, updates) =>
    set((state) => ({
      appliances: state.appliances.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    })),

  removeAppliance: (id) =>
    set((state) => ({
      appliances: state.appliances.filter((a) => a.id !== id),
    })),

  setEnergyObjective: (objective) => set({ energyObjective: objective }),
  setBackupHours: (hours) => set({ backupHours: hours }),
  setBudgetRange: (range) => set({ budgetRange: range }),

  setContactInfo: (info) =>
    set((state) => ({
      email: info.email ?? state.email,
      phone: info.phone ?? state.phone,
      name: info.name ?? state.name,
    })),

  calculateResults: () => {
    const { appliances, backupHours, energyObjective } = get()

    // Calculate total load (peak watts)
    const totalLoad = appliances.reduce(
      (sum, a) => sum + a.wattage * a.quantity,
      0
    )

    // Calculate daily consumption (Wh)
    const dailyConsumption = appliances.reduce(
      (sum, a) => sum + a.wattage * a.quantity * a.hoursPerDay,
      0
    )

    // Inverter sizing (with 30% headroom for surge)
    const recommendedInverterKva = Math.ceil((totalLoad * 1.3) / 1000)

    // Battery sizing based on backup hours and 80% DoD
    const batteryForBackup = (totalLoad * backupHours) / 1000 / 0.8

    // Adjust for energy objective
    let batteryMultiplier = 1
    if (energyObjective === 'extended') batteryMultiplier = 1.5
    if (energyObjective === 'near-off-grid') batteryMultiplier = 2
    if (energyObjective === 'off-grid') batteryMultiplier = 2.5

    const recommendedBatteryKwh = Math.ceil(batteryForBackup * batteryMultiplier / 5) * 5

    // Solar sizing (assuming 4 peak sun hours in Nigeria)
    const dailyKwh = dailyConsumption / 1000
    let solarMultiplier = 0.5 // Standard backup
    if (energyObjective === 'extended') solarMultiplier = 0.8
    if (energyObjective === 'near-off-grid') solarMultiplier = 1.2
    if (energyObjective === 'off-grid') solarMultiplier = 1.5

    const recommendedSolarKw = Math.ceil((dailyKwh * solarMultiplier) / 4)

    // Cost estimation
    const inverterCost = recommendedInverterKva * 250 // ~$250 per kVA
    const batteryCost = recommendedBatteryKwh * 350 // ~$350 per kWh
    const solarCost = recommendedSolarKw * 800 // ~$800 per kW
    const installationCost = (inverterCost + batteryCost + solarCost) * 0.15

    const baseCost = inverterCost + batteryCost + solarCost + installationCost
    const estimatedCost = {
      min: Math.round(baseCost * 0.9),
      max: Math.round(baseCost * 1.1),
    }

    // Monthly savings estimate (assuming 200 NGN/kWh grid cost vs 50 NGN/kWh solar)
    const monthlySavingsNGN = dailyKwh * 30 * (200 - 50) * solarMultiplier
    const estimatedMonthlySavings = Math.round(monthlySavingsNGN / 1500) // Convert to USD

    set({
      results: {
        totalLoad,
        dailyConsumption,
        recommendedInverterKva: Math.max(5, recommendedInverterKva),
        recommendedBatteryKwh: Math.max(5, recommendedBatteryKwh),
        recommendedSolarKw: Math.max(2, recommendedSolarKw),
        estimatedCost,
        estimatedMonthlySavings,
      },
    })
  },

  reset: () =>
    set({
      currentStep: 1,
      propertyType: null,
      appliances: [],
      energyObjective: null,
      backupHours: 6,
      budgetRange: null,
      email: '',
      phone: '',
      name: '',
      results: null,
    }),
}))
