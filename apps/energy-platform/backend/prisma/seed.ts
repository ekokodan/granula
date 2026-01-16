import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create sample products
  const products = await Promise.all([
    // Batteries
    prisma.product.create({
      data: {
        name: 'PowerVault Pro 10kWh',
        category: 'BATTERY',
        type: 'RESIDENTIAL',
        description: 'High-performance lithium battery system for residential use with advanced BMS',
        specifications: {
          capacity: 10,
          voltage: 48,
          cycles: 6000,
          efficiency: 95,
          dimensions: '600x400x200mm',
          weight: '85kg',
          operatingTemp: '-10°C to 50°C',
          certification: ['UL1973', 'IEC62619']
        },
        price: 8500,
        inStock: true,
        stockLevel: 25,
        warranty: 10,
        certification: ['UL1973', 'IEC62619'],
        manufacturer: 'PowerVault',
        model: 'PV-10000',
        images: ['/images/battery-powervault-10.jpg'],
        documents: ['/docs/powervault-10-manual.pdf']
      }
    }),
    
    prisma.product.create({
      data: {
        name: 'EnergyMax Commercial 50kWh',
        category: 'BATTERY',
        type: 'COMMERCIAL',
        description: 'Industrial-grade lithium battery system for commercial applications',
        specifications: {
          capacity: 50,
          voltage: 400,
          cycles: 8000,
          efficiency: 96,
          dimensions: '1200x800x600mm',
          weight: '420kg',
          operatingTemp: '-20°C to 60°C',
          certification: ['UL1973', 'IEC62619', 'IEEE1547']
        },
        price: 35000,
        inStock: true,
        stockLevel: 8,
        warranty: 15,
        certification: ['UL1973', 'IEC62619', 'IEEE1547'],
        manufacturer: 'EnergyMax',
        model: 'EM-50000',
        images: ['/images/battery-energymax-50.jpg'],
        documents: ['/docs/energymax-50-manual.pdf']
      }
    }),

    // Inverters
    prisma.product.create({
      data: {
        name: 'SolarEdge 5kW Inverter',
        category: 'INVERTER',
        type: 'RESIDENTIAL',
        description: 'High-efficiency string inverter with built-in monitoring',
        specifications: {
          power: 5000,
          efficiency: 97.6,
          inputVoltage: '125-440V',
          outputVoltage: '230V',
          frequency: '50/60Hz',
          dimensions: '375x665x222mm',
          weight: '22.5kg',
          certification: ['UL1741', 'IEEE1547']
        },
        price: 1200,
        inStock: true,
        stockLevel: 15,
        warranty: 12,
        certification: ['UL1741', 'IEEE1547'],
        manufacturer: 'SolarEdge',
        model: 'SE5000H',
        images: ['/images/inverter-solaredge-5.jpg'],
        documents: ['/docs/solaredge-5-manual.pdf']
      }
    }),

    // Solar Panels
    prisma.product.create({
      data: {
        name: 'SunPower 400W Panel',
        category: 'SOLAR_PANEL',
        type: 'RESIDENTIAL',
        description: 'High-efficiency monocrystalline solar panel',
        specifications: {
          power: 400,
          efficiency: 22.3,
          voltage: 40.5,
          current: 9.88,
          dimensions: '1690x1046x40mm',
          weight: '20.6kg',
          cellType: 'Monocrystalline',
          warranty: 25
        },
        price: 300,
        inStock: true,
        stockLevel: 100,
        warranty: 25,
        certification: ['IEC61215', 'IEC61730', 'UL1703'],
        manufacturer: 'SunPower',
        model: 'SPR-400-COM',
        images: ['/images/panel-sunpower-400.jpg'],
        documents: ['/docs/sunpower-400-datasheet.pdf']
      }
    }),

    // Monitoring System
    prisma.product.create({
      data: {
        name: 'Smart Energy Monitor Pro',
        category: 'MONITORING',
        type: 'RESIDENTIAL',
        description: 'Advanced energy monitoring system with real-time analytics',
        specifications: {
          connectivity: ['WiFi', 'Ethernet', '4G'],
          channels: 16,
          accuracy: '±1%',
          dataLogging: 'Cloud-based',
          dimensions: '150x100x50mm',
          weight: '0.5kg',
          display: '5-inch touchscreen'
        },
        price: 299,
        inStock: true,
        stockLevel: 30,
        warranty: 5,
        certification: ['FCC', 'CE'],
        manufacturer: 'EnergyTech',
        model: 'ET-MON-PRO',
        images: ['/images/monitor-energytech.jpg'],
        documents: ['/docs/energytech-monitor-manual.pdf']
      }
    })
  ])

  console.log(`✅ Created ${products.length} products`)

  // Create bundles
  const residentialBundle = await prisma.bundle.create({
    data: {
      name: 'Residential Energy Independence Kit',
      description: 'Complete system for 70% grid independence including battery, inverter, and monitoring',
      suitableFor: ['RESIDENTIAL'],
      totalPrice: 15000,
      discountPercent: 15,
      estimatedInstallDays: 2,
      items: {
        create: [
          { productId: products[0].id, quantity: 1 }, // PowerVault Pro 10kWh
          { productId: products[2].id, quantity: 1 }, // SolarEdge 5kW Inverter
          { productId: products[4].id, quantity: 1 }  // Smart Energy Monitor Pro
        ]
      }
    }
  })

  console.log(`✅ Created residential bundle: ${residentialBundle.name}`)

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@energyplatform.com',
      name: 'Admin User',
      password: '$2a$10$example.hash.here', // This would be properly hashed
      role: 'ADMIN',
      verified: true,
      profile: {
        create: {
          propertyType: 'COMMERCIAL',
          notifications: true,
          newsletter: false
        }
      },
      addresses: {
        create: {
          type: 'BUSINESS',
          street: '123 Energy Street',
          city: 'Solar City',
          state: 'CA',
          zipCode: '12345',
          primary: true
        }
      }
    }
  })

  console.log(`✅ Created admin user: ${adminUser.email}`)

  // Create sample customer
  const customer = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      name: 'John Doe',
      phone: '+1234567890',
      password: '$2a$10$example.hash.here', // This would be properly hashed
      role: 'CUSTOMER',
      verified: true,
      profile: {
        create: {
          propertyType: 'RESIDENTIAL',
          roofType: 'Asphalt Shingle',
          lotSize: 8000,
          monthlyBudget: 300,
          energyGoals: ['reduce_bill', 'backup_power', 'environmental'],
          currentProvider: 'Pacific Gas & Electric',
          averageMonthlyBill: 250,
          notifications: true,
          newsletter: true
        }
      },
      addresses: {
        create: {
          type: 'HOME',
          street: '456 Residential Ave',
          city: 'Sunnydale',
          state: 'CA',
          zipCode: '54321',
          primary: true
        }
      }
    }
  })

  console.log(`✅ Created customer: ${customer.email}`)

  // Create sample quote
  const quote = await prisma.quote.create({
    data: {
      userId: customer.id,
      status: 'PENDING',
      systemConfig: {
        monthlyUsage: 1200,
        peakDemand: 8,
        backupHours: 12,
        budgetRange: [15000, 20000],
        propertyType: 'residential',
        location: 'california'
      },
      subtotal: 12750,
      tax: 1020,
      total: 13770,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      notes: 'Customer interested in maximizing energy independence',
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 1,
            unitPrice: 8500,
            total: 8500
          },
          {
            productId: products[2].id,
            quantity: 1,
            unitPrice: 1200,
            total: 1200
          },
          {
            productId: products[3].id,
            quantity: 8,
            unitPrice: 300,
            total: 2400
          },
          {
            productId: products[4].id,
            quantity: 1,
            unitPrice: 299,
            total: 299
          }
        ]
      }
    }
  })

  console.log(`✅ Created sample quote: ${quote.id}`)

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })