import type { Payload } from 'payload'

export const seedRoutes = async (payload: Payload): Promise<Record<string, any>> => {
  const existingDocs = await payload.find({
    collection: 'routes' as any,
    limit: 1,
  })

  // Return map of route names to IDs for reference in other seed functions
  const routeMap: Record<string, any> = {}

  if (existingDocs.docs.length === 0) {
    // Argentina to USA Route
    const argentinaToUSA = await payload.create({
      collection: 'routes' as any,
      data: {
        name: 'Argentina to USA - Main Shipping Lane',
        description:
          'Primary shipping route for agricultural products from Buenos Aires to Los Angeles',
        originCountry: 'Argentina',
        originPort: 'Puerto de Buenos Aires',
        destinationCountry: 'United States',
        destinationPort: 'Port of Los Angeles',
        transitPorts: [
          {
            portName: 'Puerto de Callao',
            country: 'Peru',
            estimatedDaysFromOrigin: 7,
            services: ['transshipment'],
          },
          {
            portName: 'Puerto de Manzanillo',
            country: 'Mexico',
            estimatedDaysFromOrigin: 18,
            services: ['customs', 'container-handling'],
          },
        ],
        estimatedTransitTime: 26,
        distance: 7840,
        transportMode: 'ocean',
        carriers: [
          {
            name: 'Maersk Line',
            service: 'South America Express',
            frequency: 'Weekly',
          },
          {
            name: 'MSC',
            service: 'Andean Service',
            frequency: 'Bi-weekly',
          },
        ],
        frequencyOfService: 'Weekly',
        averageCost: 3250,
        riskLevel: 'medium',
        slug: 'argentina-to-usa-main-shipping-lane',
      } as any,
    })
    routeMap['Argentina to USA - Main Shipping Lane'] = argentinaToUSA.id

    // Colombia to Japan Route
    const colombiaToJapan = await payload.create({
      collection: 'routes' as any,
      data: {
        name: 'Colombia to Japan - Trans-Pacific Route',
        description:
          'Efficient shipping route for coffee and agricultural exports from Colombia to Japan',
        originCountry: 'Colombia',
        originPort: 'Puerto de Cartagena',
        destinationCountry: 'Japan',
        destinationPort: 'Port of Tokyo',
        transitPorts: [
          {
            portName: 'Panama Canal',
            country: 'Panama',
            estimatedDaysFromOrigin: 3,
            services: ['transshipment'],
          },
          {
            portName: 'Port of Long Beach',
            country: 'United States',
            estimatedDaysFromOrigin: 12,
            services: ['transshipment', 'container-handling'],
          },
        ],
        estimatedTransitTime: 32,
        distance: 9650,
        transportMode: 'ocean',
        carriers: [
          {
            name: 'ONE (Ocean Network Express)',
            service: 'Pacific South Express',
            frequency: 'Weekly',
          },
          {
            name: 'Evergreen Marine',
            service: 'Asia-America Service',
            frequency: 'Weekly',
          },
        ],
        frequencyOfService: 'Weekly',
        averageCost: 4150,
        riskLevel: 'medium',
        slug: 'colombia-to-japan-trans-pacific-route',
      } as any,
    })
    routeMap['Colombia to Japan - Trans-Pacific Route'] = colombiaToJapan.id

    // Brazil to Europe Route
    const brazilToEurope = await payload.create({
      collection: 'routes' as any,
      data: {
        name: 'Brazil to Rotterdam - Atlantic Crossing',
        description: 'Direct shipping route for Brazilian exports to European markets',
        originCountry: 'Brazil',
        originPort: 'Port of Santos',
        destinationCountry: 'Netherlands',
        destinationPort: 'Port of Rotterdam',
        transitPorts: [],
        estimatedTransitTime: 16,
        distance: 5420,
        transportMode: 'ocean',
        carriers: [
          {
            name: 'CMA CGM',
            service: 'South America Express',
            frequency: 'Weekly',
          },
          {
            name: 'Hamburg Süd',
            service: 'Brazil Europe Service',
            frequency: 'Weekly',
          },
        ],
        frequencyOfService: 'Weekly',
        averageCost: 2950,
        riskLevel: 'low',
        slug: 'brazil-to-rotterdam-atlantic-crossing',
      } as any,
    })
    routeMap['Brazil to Rotterdam - Atlantic Crossing'] = brazilToEurope.id

    // Mexico to China Route
    const mexicoToChina = await payload.create({
      collection: 'routes' as any,
      data: {
        name: 'Mexico to Shanghai - Trans-Pacific Express',
        description: 'Primary route for Mexican exports to Chinese markets',
        originCountry: 'Mexico',
        originPort: 'Port of Manzanillo',
        destinationCountry: 'China',
        destinationPort: 'Port of Shanghai',
        transitPorts: [
          {
            portName: 'Port of Busan',
            country: 'South Korea',
            estimatedDaysFromOrigin: 22,
            services: ['transshipment', 'container-handling'],
          },
        ],
        estimatedTransitTime: 27,
        distance: 8790,
        transportMode: 'ocean',
        carriers: [
          {
            name: 'COSCO Shipping',
            service: 'Trans-Pacific Service',
            frequency: 'Weekly',
          },
          {
            name: 'APL',
            service: 'Eagle Express X',
            frequency: 'Bi-weekly',
          },
        ],
        frequencyOfService: 'Weekly',
        averageCost: 3850,
        riskLevel: 'medium',
        slug: 'mexico-to-shanghai-trans-pacific-express',
      } as any,
    })
    routeMap['Mexico to Shanghai - Trans-Pacific Express'] = mexicoToChina.id

    // Multimodal Route - Chile to Canada
    const chileToCanada = await payload.create({
      collection: 'routes' as any,
      data: {
        name: 'Chile to Canada - Multimodal Route',
        description: 'Multimodal shipping route combining ocean and rail transport',
        originCountry: 'Chile',
        originPort: 'Port of Valparaíso',
        destinationCountry: 'Canada',
        destinationPort: 'Port of Vancouver',
        transitPorts: [
          {
            portName: 'Port of San Diego',
            country: 'United States',
            estimatedDaysFromOrigin: 16,
            services: ['customs', 'transshipment'],
          },
        ],
        estimatedTransitTime: 24,
        distance: 6320,
        transportMode: 'multimodal',
        carriers: [
          {
            name: 'Hapag-Lloyd',
            service: 'Andean Service',
            frequency: 'Weekly',
          },
          {
            name: 'Canadian Pacific Railway',
            service: 'Vancouver Inland Service',
            frequency: 'Daily',
          },
        ],
        frequencyOfService: 'Weekly',
        averageCost: 4250,
        riskLevel: 'low',
        slug: 'chile-to-canada-multimodal-route',
      } as any,
    })
    routeMap['Chile to Canada - Multimodal Route'] = chileToCanada.id

    console.log('✅ Seed routes completed')
  } else {
    // If routes already exist, get their IDs for the map
    const allRoutes = await payload.find({
      collection: 'routes' as any,
      limit: 100,
    })

    allRoutes.docs.forEach((route: any) => {
      routeMap[route.name] = route.id
    })

    console.log('🌱 Routes already exist, using existing data')
  }

  return routeMap
}
