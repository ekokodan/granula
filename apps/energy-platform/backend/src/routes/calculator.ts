import { Router } from 'express'
import { asyncHandler } from '@/middleware/errorMiddleware'

const router = Router()

// POST /api/calculator/estimate - Calculate system requirements
router.post('/estimate', asyncHandler(async (req, res) => {
  const {
    monthlyUsage,
    peakDemand,
    backupHours,
    budgetRange,
    propertyType,
    location
  } = req.body

  // Energy calculation algorithm
  const dailyUsage = monthlyUsage / 30
  const requiredBatteryCapacity = Math.ceil((dailyUsage * backupHours) / 24)
  const recommendedInverterSize = Math.ceil(peakDemand * 1.2) // 20% safety margin
  const solarRecommendation = Math.ceil(dailyUsage * 1.3) // 30% overhead for weather

  // System recommendations based on calculations
  const systemRecommendations = {
    primary: {
      id: 'system-optimal',
      name: 'Optimal Energy System',
      type: propertyType,
      batteryCapacity: requiredBatteryCapacity,
      inverterSize: recommendedInverterSize,
      solarPanels: solarRecommendation,
      price: calculateSystemPrice(requiredBatteryCapacity, recommendedInverterSize, solarRecommendation),
      estimatedSavings: monthlyUsage * 0.15 * 12, // 15% monthly savings
      gridIndependence: Math.min(90, (requiredBatteryCapacity / dailyUsage) * 100),
      installationTime: propertyType === 'residential' ? 2 : 5,
      warranty: 10
    },
    alternatives: [
      {
        id: 'system-budget',
        name: 'Budget-Friendly System',
        type: propertyType,
        batteryCapacity: Math.ceil(requiredBatteryCapacity * 0.7),
        inverterSize: recommendedInverterSize,
        solarPanels: Math.ceil(solarRecommendation * 0.8),
        price: calculateSystemPrice(requiredBatteryCapacity * 0.7, recommendedInverterSize, solarRecommendation * 0.8),
        estimatedSavings: monthlyUsage * 0.10 * 12,
        gridIndependence: 60,
        installationTime: propertyType === 'residential' ? 1 : 3,
        warranty: 8
      },
      {
        id: 'system-premium',
        name: 'Premium Energy System',
        type: propertyType,
        batteryCapacity: Math.ceil(requiredBatteryCapacity * 1.5),
        inverterSize: Math.ceil(recommendedInverterSize * 1.2),
        solarPanels: Math.ceil(solarRecommendation * 1.4),
        price: calculateSystemPrice(requiredBatteryCapacity * 1.5, recommendedInverterSize * 1.2, solarRecommendation * 1.4),
        estimatedSavings: monthlyUsage * 0.25 * 12,
        gridIndependence: 95,
        installationTime: propertyType === 'residential' ? 3 : 7,
        warranty: 15
      }
    ]
  }

  // Calculate ROI and financial metrics
  const primarySystem = systemRecommendations.primary
  const annualSavings = primarySystem.estimatedSavings
  const estimatedROI = primarySystem.price / annualSavings

  res.json({
    success: true,
    data: {
      recommendation: systemRecommendations,
      financials: {
        estimatedROI,
        annualSavings,
        monthlyBillReduction: annualSavings / 12,
        paybackPeriod: estimatedROI,
        twentyYearSavings: annualSavings * 20 - primarySystem.price
      },
      nextSteps: [
        'Review system specifications',
        'Schedule site assessment',
        'Get detailed quote',
        'Explore financing options'
      ]
    }
  })
}))

// Helper function to calculate system price
function calculateSystemPrice(batteryCapacity: number, inverterSize: number, solarPanels: number): number {
  const batteryPrice = batteryCapacity * 800 // $800 per kWh
  const inverterPrice = inverterSize * 200 // $200 per kW
  const solarPrice = solarPanels * 1000 // $1000 per kW
  const installationCost = (batteryPrice + inverterPrice + solarPrice) * 0.3 // 30% installation cost
  
  return Math.round(batteryPrice + inverterPrice + solarPrice + installationCost)
}

// POST /api/calculator/components - Get component recommendations
router.post('/components', asyncHandler(async (req, res) => {
  const { systemType, batteryCapacity, inverterSize } = req.body

  const components = {
    batteries: [
      {
        id: 'battery-1',
        name: `PowerVault Pro ${batteryCapacity}kWh`,
        capacity: batteryCapacity,
        price: batteryCapacity * 800,
        recommended: true
      }
    ],
    inverters: [
      {
        id: 'inverter-1',
        name: `SolarEdge ${inverterSize}kW Inverter`,
        power: inverterSize,
        price: inverterSize * 200,
        recommended: true
      }
    ],
    accessories: [
      {
        id: 'monitoring-1',
        name: 'Smart Energy Monitor',
        price: 299,
        required: true
      },
      {
        id: 'surge-protection',
        name: 'Surge Protection System',
        price: 450,
        required: true
      }
    ]
  }

  res.json({
    success: true,
    data: components
  })
}))

// GET /api/calculator/savings/:location - Get savings estimate by location
router.get('/savings/:location', asyncHandler(async (req, res) => {
  const { location } = req.params
  const { usage } = req.query

  if (!location) {
    throw new Error('Location parameter is required')
  }

  // Mock savings data by location (would come from utility rate database)
  const locationData: Record<string, { avgRate: number; solarIncentive: number; gridReliability: number }> = {
    'california': { avgRate: 0.28, solarIncentive: 0.26, gridReliability: 0.85 },
    'texas': { avgRate: 0.12, solarIncentive: 0.15, gridReliability: 0.92 },
    'florida': { avgRate: 0.11, solarIncentive: 0.20, gridReliability: 0.88 },
    'default': { avgRate: 0.16, solarIncentive: 0.18, gridReliability: 0.90 }
  }

  const locationKey = location.toLowerCase()
  const data = locationData[locationKey] ?? locationData.default
  
  // TypeScript guard: ensure data is always defined
  if (!data) {
    throw new Error('Invalid location data')
  }
  
  const monthlyUsage = Number(usage) || 1000

  const savingsEstimate = {
    currentBill: monthlyUsage * data.avgRate,
    projectedBill: monthlyUsage * data.avgRate * 0.3, // 70% reduction
    monthlySavings: monthlyUsage * data.avgRate * 0.7,
    annualSavings: monthlyUsage * data.avgRate * 0.7 * 12,
    incentives: {
      federal: 0.30, // 30% federal tax credit
      state: data.solarIncentive,
      utility: 0.05
    },
    gridReliability: data.gridReliability
  }

  res.json({
    success: true,
    data: savingsEstimate
  })
}))

export { router as calculatorRouter }