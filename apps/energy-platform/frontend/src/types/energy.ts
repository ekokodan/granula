export interface EnergySystem {
  id: string
  name: string
  type: 'residential' | 'commercial' | 'grid-scale'
  batteryCapacity: number // kWh
  inverterSize: number // kW
  solarPanels?: number // kW
  price: number
  estimatedSavings: number
  gridIndependence: number // percentage
  installationTime: number // days
  warranty: number // years
}

export interface SystemConfiguration {
  energyUsage: number // kWh per month
  peakLoad: number // kW
  budget: number
  location: string
  roofType?: string
  propertyType: 'residential' | 'commercial' | 'industrial'
  currentEnergyBill: number
  backupRequirement: number // hours
}

export interface Product {
  id: string
  name: string
  category: 'battery' | 'inverter' | 'solar-panel' | 'bundle'
  specifications: Record<string, any>
  price: number
  inStock: boolean
  stockLevel: number
  estimatedDelivery: string
  warranty: number
  certification: string[]
}

export interface Bundle {
  id: string
  name: string
  description: string
  products: Product[]
  totalPrice: number
  discountPercentage: number
  savings: number
  suitableFor: ('residential' | 'commercial' | 'grid-scale')[]
  estimatedInstallationDays: number
}

export interface QuoteRequest {
  customerInfo: {
    name: string
    email: string
    phone: string
    address: string
  }
  systemConfiguration: SystemConfiguration
  selectedProducts: string[]
  additionalNotes?: string
}

export interface Calculator {
  monthlyUsage: number
  peakDemand: number
  backupHours: number
  budgetRange: [number, number]
  incentives: boolean
}

export interface CalculatorResult {
  recommendedSystem: EnergySystem
  alternatives: EnergySystem[]
  estimatedROI: number // years
  annualSavings: number
  totalCost: number
  incentivesApplied: number
}