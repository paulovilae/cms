import type { Payload } from 'payload'

export const seedCompanies = async (payload: Payload): Promise<Record<string, any>> => {
  const existingDocs = await payload.find({
    collection: 'companies',
    limit: 1,
  })

  // Return map of company names to IDs for reference in other seed functions
  const companyMap: Record<string, any> = {}

  if (existingDocs.docs.length === 0) {
    // Helper function to create a company with proper type casting to avoid TypeScript errors
    const createCompany = async (companyData: any) => {
      return await payload.create({
        collection: 'companies',
        data: companyData as any,
      })
    }

    // Create exporters
    const donHugo = await createCompany({
      name: 'Don Hugo Farms',
      type: 'exporter',
      description:
        'Premium peanut producer from Argentina specializing in high-quality peanut cultivation using sustainable farming practices.',
      country: 'Argentina',
      slug: 'don-hugo-farms',
      address: {
        streetAddress: 'Ruta Provincial 18, Km 15',
        city: 'Córdoba',
        stateProvince: 'Córdoba',
        postalCode: '5000',
        country: 'Argentina',
        gpsCoordinates: '-31.4201,-64.1888',
      },
      contactInfo: {
        primaryPhone: '+54 351 555 7890',
        alternatePhone: '+54 351 555 7891',
        email: 'info@donhugofarms.com',
        contactPerson: 'Hugo Martínez',
        contactPosition: 'Export Manager',
      },
      businessDetails: {
        registrationNumber: 'ARG-2010-45678',
        taxId: '30-71234567-8',
        yearEstablished: 1995,
        industrySector: 'agriculture',
        employeeCount: 120,
        annualRevenue: 3500000,
        certifications: [
          {
            name: 'Global GAP',
            issuingBody: 'FoodPLUS GmbH',
            issueDate: '2024-01-15',
            expiryDate: '2026-01-14',
          },
          {
            name: 'Organic Certification',
            issuingBody: 'Argentina Organic',
            issueDate: '2024-02-10',
            expiryDate: '2025-02-09',
          },
        ],
      },
      website: 'https://www.donhugofarms.com',
    })
    companyMap['Don Hugo Farms'] = donHugo.id

    const colombianCoffee = await createCompany({
      name: 'Colombian Coffee Cooperative',
      type: 'exporter',
      description:
        'Farmer-owned cooperative producing premium Arabica coffee beans using traditional growing methods.',
      country: 'Colombia',
      slug: 'colombian-coffee-cooperative',
      address: {
        streetAddress: 'Carrera 12 #85-34',
        city: 'Medellín',
        stateProvince: 'Antioquia',
        postalCode: '050022',
        country: 'Colombia',
        gpsCoordinates: '6.2476,-75.5658',
      },
      contactInfo: {
        primaryPhone: '+57 4 555 1234',
        alternatePhone: '+57 4 555 5678',
        email: 'exports@colombiancoffee.co',
        contactPerson: 'Sofia Restrepo',
        contactPosition: 'General Manager',
      },
      businessDetails: {
        registrationNumber: 'COL-2005-98765',
        taxId: '901.234.567-8',
        yearEstablished: 2005,
        industrySector: 'agriculture',
        employeeCount: 340,
        annualRevenue: 4200000,
        certifications: [
          {
            name: 'Fair Trade Certified',
            issuingBody: 'Fair Trade International',
            issueDate: '2023-12-01',
            expiryDate: '2025-12-01',
          },
          {
            name: 'Rainforest Alliance',
            issuingBody: 'Rainforest Alliance',
            issueDate: '2024-03-15',
            expiryDate: '2026-03-15',
          },
          {
            name: 'USDA Organic',
            issuingBody: 'USDA',
            issueDate: '2024-01-30',
            expiryDate: '2026-01-30',
          },
        ],
      },
      website: 'https://www.colombiancoffee.co',
    })
    companyMap['Colombian Coffee Cooperative'] = colombianCoffee.id

    // Create importers
    const globalNut = await createCompany({
      name: 'Global Nut Distributors Ltd.',
      type: 'importer',
      description:
        'International distributor of premium nuts and dried fruits with distribution centers across North America and Europe.',
      country: 'United States',
      slug: 'global-nut-distributors',
      address: {
        streetAddress: '1200 Food Processing Blvd',
        city: 'Sacramento',
        stateProvince: 'California',
        postalCode: '95814',
        country: 'United States',
        gpsCoordinates: '38.5816,-121.4944',
      },
      contactInfo: {
        primaryPhone: '+1 916 555 2020',
        alternatePhone: '+1 916 555 2021',
        email: 'procurement@globalnut.com',
        contactPerson: 'Sarah Johnson',
        contactPosition: 'Import Manager',
      },
      businessDetails: {
        registrationNumber: 'US-CA-2000-123456',
        taxId: '12-3456789',
        yearEstablished: 2000,
        industrySector: 'food-processing',
        employeeCount: 450,
        annualRevenue: 75000000,
        certifications: [
          {
            name: 'ISO 22000:2018',
            issuingBody: 'International Organization for Standardization',
            issueDate: '2023-09-15',
            expiryDate: '2026-09-15',
          },
          {
            name: 'HACCP Certification',
            issuingBody: 'FSSC',
            issueDate: '2024-02-20',
            expiryDate: '2026-02-20',
          },
        ],
      },
      website: 'https://www.globalnutdistributors.com',
    })
    companyMap['Global Nut Distributors Ltd.'] = globalNut.id

    const tokyoBean = await createCompany({
      name: 'Tokyo Bean Trading Co.',
      type: 'importer',
      description:
        'Specialty coffee importer supplying high-end cafés and roasters throughout Japan with rare and premium coffee varieties.',
      country: 'Japan',
      slug: 'tokyo-bean-trading',
      address: {
        streetAddress: '3-7-1 Nishi-Shinjuku',
        city: 'Tokyo',
        stateProvince: 'Tokyo',
        postalCode: '163-0570',
        country: 'Japan',
        gpsCoordinates: '35.6894,139.6917',
      },
      contactInfo: {
        primaryPhone: '+81 3 5555 1234',
        alternatePhone: '+81 3 5555 1235',
        email: 'imports@tokyobean.jp',
        contactPerson: 'Takashi Yamamoto',
        contactPosition: 'Sourcing Director',
      },
      businessDetails: {
        registrationNumber: 'JP-TKY-2008-987654',
        taxId: '1234-56-7890',
        yearEstablished: 2008,
        industrySector: 'retail',
        employeeCount: 85,
        annualRevenue: 25000000,
        certifications: [
          {
            name: 'SCA Certified',
            issuingBody: 'Specialty Coffee Association',
            issueDate: '2023-11-01',
            expiryDate: '2025-11-01',
          },
          {
            name: 'Direct Trade Verified',
            issuingBody: 'Japan Coffee Association',
            issueDate: '2024-04-10',
            expiryDate: '2026-04-10',
          },
        ],
      },
      website: 'https://www.tokyobean.jp',
    })
    companyMap['Tokyo Bean Trading Co.'] = tokyoBean.id

    // Create additional exporter
    const brazilianSoy = await createCompany({
      name: 'Brazilian Soy Enterprises',
      type: 'exporter',
      description:
        'Leading producer and exporter of non-GMO soybeans and soy products from the Mato Grosso region of Brazil, with a focus on sustainable farming practices and rainforest preservation.',
      country: 'Brazil',
      slug: 'brazilian-soy-enterprises',
      address: {
        streetAddress: 'Rodovia BR-163, Km 742',
        city: 'Sorriso',
        stateProvince: 'Mato Grosso',
        postalCode: '78890-000',
        country: 'Brazil',
        gpsCoordinates: '-12.5452,-55.7211',
      },
      contactInfo: {
        primaryPhone: '+55 65 3555 7123',
        alternatePhone: '+55 65 3555 7124',
        email: 'exports@braziliansoy.com.br',
        contactPerson: 'Paulo Fernandes',
        contactPosition: 'International Trade Director',
      },
      businessDetails: {
        registrationNumber: 'BR-MT-1998-123456',
        taxId: '12.345.678/0001-90',
        yearEstablished: 1998,
        industrySector: 'agriculture',
        employeeCount: 525,
        annualRevenue: 12800000,
        certifications: [
          {
            name: 'Non-GMO Project Verified',
            issuingBody: 'Non-GMO Project',
            issueDate: '2023-08-10',
            expiryDate: '2025-08-09',
          },
          {
            name: 'Rainforest Alliance',
            issuingBody: 'Rainforest Alliance',
            issueDate: '2024-01-15',
            expiryDate: '2026-01-14',
          },
          {
            name: 'ISO 14001:2015',
            issuingBody: 'International Organization for Standardization',
            issueDate: '2023-05-20',
            expiryDate: '2026-05-19',
          },
        ],
      },
      website: 'https://www.braziliansoy.com.br',
    })
    companyMap['Brazilian Soy Enterprises'] = brazilianSoy.id

    // Create additional importer
    const europeanOrganics = await createCompany({
      name: 'European Organics GmbH',
      type: 'importer',
      description:
        'Premium importer and distributor of certified organic products throughout the European Union, specializing in sustainable and ethically sourced agricultural commodities.',
      country: 'Germany',
      slug: 'european-organics',
      address: {
        streetAddress: 'Hafenstraße 42',
        city: 'Hamburg',
        stateProvince: 'Hamburg',
        postalCode: '20457',
        country: 'Germany',
        gpsCoordinates: '53.5411,9.9937',
      },
      contactInfo: {
        primaryPhone: '+49 40 5555 8761',
        alternatePhone: '+49 40 5555 8762',
        email: 'sourcing@european-organics.de',
        contactPerson: 'Katharina Schmidt',
        contactPosition: 'Procurement Manager',
      },
      businessDetails: {
        registrationNumber: 'DE-HH-2002-87654',
        taxId: 'DE987654321',
        yearEstablished: 2002,
        industrySector: 'food-processing',
        employeeCount: 235,
        annualRevenue: 42500000,
        certifications: [
          {
            name: 'EU Organic Certification',
            issuingBody: 'European Commission',
            issueDate: '2024-02-25',
            expiryDate: '2026-02-24',
          },
          {
            name: 'Fair Trade Certified',
            issuingBody: 'Fair Trade International',
            issueDate: '2023-11-30',
            expiryDate: '2025-11-29',
          },
          {
            name: 'ISO 9001:2015',
            issuingBody: 'International Organization for Standardization',
            issueDate: '2023-07-12',
            expiryDate: '2026-07-11',
          },
        ],
      },
      website: 'https://www.european-organics.de',
    })
    companyMap['European Organics GmbH'] = europeanOrganics.id

    // Create company that does both importing and exporting
    const mediterraneanTraders = await createCompany({
      name: 'Mediterranean Traders S.A.',
      type: 'both',
      description:
        'Family-owned import/export business specializing in olive oils, wines, and specialty Mediterranean products with operations across Southern Europe and North Africa.',
      country: 'Spain',
      slug: 'mediterranean-traders',
      address: {
        streetAddress: 'Calle del Comercio 15',
        city: 'Barcelona',
        stateProvince: 'Catalonia',
        postalCode: '08003',
        country: 'Spain',
        gpsCoordinates: '41.3851,2.1734',
      },
      contactInfo: {
        primaryPhone: '+34 93 555 6432',
        alternatePhone: '+34 93 555 6433',
        email: 'info@mediterraneantraders.es',
        contactPerson: 'Miguel Rodríguez',
        contactPosition: 'CEO',
      },
      businessDetails: {
        registrationNumber: 'ES-BCN-1985-76543',
        taxId: 'ES78901234B',
        yearEstablished: 1985,
        industrySector: 'food-processing',
        employeeCount: 98,
        annualRevenue: 15600000,
        certifications: [
          {
            name: 'Protected Designation of Origin (PDO)',
            issuingBody: 'European Commission',
            issueDate: '2023-10-05',
            expiryDate: '2025-10-04',
          },
          {
            name: 'IFS Food Certification',
            issuingBody: 'International Featured Standards',
            issueDate: '2024-03-18',
            expiryDate: '2026-03-17',
          },
          {
            name: 'Mediterranean Diet Certification',
            issuingBody: 'Mediterranean Diet Foundation',
            issueDate: '2023-09-22',
            expiryDate: '2025-09-21',
          },
        ],
      },
      website: 'https://www.mediterraneantraders.es',
    })
    companyMap['Mediterranean Traders S.A.'] = mediterraneanTraders.id

    console.log('✅ Seed companies completed')
  } else {
    // Helper function to create a company with proper type casting to avoid TypeScript errors
    const createCompany = async (companyData: any) => {
      return await payload.create({
        collection: 'companies',
        data: companyData as any,
      })
    }

    // Check if our new companies exist already
    const existingCompanyNames = await payload.find({
      collection: 'companies',
      where: {
        name: {
          in: ['Brazilian Soy Enterprises', 'European Organics GmbH', 'Mediterranean Traders S.A.'],
        },
      },
    })

    // If our new companies don't exist, create them
    if (existingCompanyNames.docs.length < 3) {
      console.log('🌱 Adding new companies to existing data...')

      // Check and create Brazilian Soy if it doesn't exist
      if (!existingCompanyNames.docs.find((c) => c.name === 'Brazilian Soy Enterprises')) {
        const brazilianSoy = await createCompany({
          name: 'Brazilian Soy Enterprises',
          type: 'exporter',
          description:
            'Leading producer and exporter of non-GMO soybeans and soy products from the Mato Grosso region of Brazil, with a focus on sustainable farming practices and rainforest preservation.',
          country: 'Brazil',
          slug: 'brazilian-soy-enterprises',
          address: {
            streetAddress: 'Rodovia BR-163, Km 742',
            city: 'Sorriso',
            stateProvince: 'Mato Grosso',
            postalCode: '78890-000',
            country: 'Brazil',
            gpsCoordinates: '-12.5452,-55.7211',
          },
          contactInfo: {
            primaryPhone: '+55 65 3555 7123',
            alternatePhone: '+55 65 3555 7124',
            email: 'exports@braziliansoy.com.br',
            contactPerson: 'Paulo Fernandes',
            contactPosition: 'International Trade Director',
          },
          businessDetails: {
            registrationNumber: 'BR-MT-1998-123456',
            taxId: '12.345.678/0001-90',
            yearEstablished: 1998,
            industrySector: 'agriculture',
            employeeCount: 525,
            annualRevenue: 12800000,
            certifications: [
              {
                name: 'Non-GMO Project Verified',
                issuingBody: 'Non-GMO Project',
                issueDate: '2023-08-10',
                expiryDate: '2025-08-09',
              },
              {
                name: 'Rainforest Alliance',
                issuingBody: 'Rainforest Alliance',
                issueDate: '2024-01-15',
                expiryDate: '2026-01-14',
              },
              {
                name: 'ISO 14001:2015',
                issuingBody: 'International Organization for Standardization',
                issueDate: '2023-05-20',
                expiryDate: '2026-05-19',
              },
            ],
          },
          website: 'https://www.braziliansoy.com.br',
        })
        companyMap['Brazilian Soy Enterprises'] = brazilianSoy.id
      }

      // Check and create European Organics if it doesn't exist
      if (!existingCompanyNames.docs.find((c) => c.name === 'European Organics GmbH')) {
        const europeanOrganics = await createCompany({
          name: 'European Organics GmbH',
          type: 'importer',
          description:
            'Premium importer and distributor of certified organic products throughout the European Union, specializing in sustainable and ethically sourced agricultural commodities.',
          country: 'Germany',
          slug: 'european-organics',
          address: {
            streetAddress: 'Hafenstraße 42',
            city: 'Hamburg',
            stateProvince: 'Hamburg',
            postalCode: '20457',
            country: 'Germany',
            gpsCoordinates: '53.5411,9.9937',
          },
          contactInfo: {
            primaryPhone: '+49 40 5555 8761',
            alternatePhone: '+49 40 5555 8762',
            email: 'sourcing@european-organics.de',
            contactPerson: 'Katharina Schmidt',
            contactPosition: 'Procurement Manager',
          },
          businessDetails: {
            registrationNumber: 'DE-HH-2002-87654',
            taxId: 'DE987654321',
            yearEstablished: 2002,
            industrySector: 'food-processing',
            employeeCount: 235,
            annualRevenue: 42500000,
            certifications: [
              {
                name: 'EU Organic Certification',
                issuingBody: 'European Commission',
                issueDate: '2024-02-25',
                expiryDate: '2026-02-24',
              },
              {
                name: 'Fair Trade Certified',
                issuingBody: 'Fair Trade International',
                issueDate: '2023-11-30',
                expiryDate: '2025-11-29',
              },
              {
                name: 'ISO 9001:2015',
                issuingBody: 'International Organization for Standardization',
                issueDate: '2023-07-12',
                expiryDate: '2026-07-11',
              },
            ],
          },
          website: 'https://www.european-organics.de',
        })
        companyMap['European Organics GmbH'] = europeanOrganics.id
      }

      // Check and create Mediterranean Traders if it doesn't exist
      if (!existingCompanyNames.docs.find((c) => c.name === 'Mediterranean Traders S.A.')) {
        const mediterraneanTraders = await createCompany({
          name: 'Mediterranean Traders S.A.',
          type: 'both',
          description:
            'Family-owned import/export business specializing in olive oils, wines, and specialty Mediterranean products with operations across Southern Europe and North Africa.',
          country: 'Spain',
          slug: 'mediterranean-traders',
          address: {
            streetAddress: 'Calle del Comercio 15',
            city: 'Barcelona',
            stateProvince: 'Catalonia',
            postalCode: '08003',
            country: 'Spain',
            gpsCoordinates: '41.3851,2.1734',
          },
          contactInfo: {
            primaryPhone: '+34 93 555 6432',
            alternatePhone: '+34 93 555 6433',
            email: 'info@mediterraneantraders.es',
            contactPerson: 'Miguel Rodríguez',
            contactPosition: 'CEO',
          },
          businessDetails: {
            registrationNumber: 'ES-BCN-1985-76543',
            taxId: 'ES78901234B',
            yearEstablished: 1985,
            industrySector: 'food-processing',
            employeeCount: 98,
            annualRevenue: 15600000,
            certifications: [
              {
                name: 'Protected Designation of Origin (PDO)',
                issuingBody: 'European Commission',
                issueDate: '2023-10-05',
                expiryDate: '2025-10-04',
              },
              {
                name: 'IFS Food Certification',
                issuingBody: 'International Featured Standards',
                issueDate: '2024-03-18',
                expiryDate: '2026-03-17',
              },
              {
                name: 'Mediterranean Diet Certification',
                issuingBody: 'Mediterranean Diet Foundation',
                issueDate: '2023-09-22',
                expiryDate: '2025-09-21',
              },
            ],
          },
          website: 'https://www.mediterraneantraders.es',
        })
        companyMap['Mediterranean Traders S.A.'] = mediterraneanTraders.id
      }

      console.log('✅ Added new companies to existing data')
    } else {
      console.log('🌱 All companies already exist in the database')
    }

    // Get all companies for the map
    const allCompanies = await payload.find({
      collection: 'companies',
      limit: 100,
    })

    allCompanies.docs.forEach((company) => {
      companyMap[company.name] = company.id
    })
  }

  return companyMap
}
