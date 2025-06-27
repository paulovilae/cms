// Simple script to test companies and transactions
const fetch = require('node-fetch')

async function createCompanies() {
  console.log('Creating companies...')

  // Create Don Hugo Farms
  const donHugo = await fetch('http://localhost:3003/api/companies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + Buffer.from('test@test.com:test').toString('base64'),
    },
    body: JSON.stringify({
      name: 'Don Hugo Farms',
      type: 'exporter',
      description:
        'Premium peanut producer from Argentina specializing in high-quality peanut cultivation using sustainable farming practices.',
      country: 'Argentina',
      slug: 'don-hugo-farms',
    }),
  }).then((res) => res.json())

  // Create Global Nut Distributors
  const globalNut = await fetch('http://localhost:3003/api/companies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + Buffer.from('test@test.com:test').toString('base64'),
    },
    body: JSON.stringify({
      name: 'Global Nut Distributors Ltd.',
      type: 'importer',
      description:
        'International distributor of premium nuts and dried fruits with distribution centers across North America and Europe.',
      country: 'United States',
      slug: 'global-nut-distributors',
    }),
  }).then((res) => res.json())

  // Create Colombian Coffee Cooperative
  const colombianCoffee = await fetch('http://localhost:3003/api/companies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + Buffer.from('test@test.com:test').toString('base64'),
    },
    body: JSON.stringify({
      name: 'Colombian Coffee Cooperative',
      type: 'exporter',
      description:
        'Farmer-owned cooperative producing premium Arabica coffee beans using traditional growing methods.',
      country: 'Colombia',
      slug: 'colombian-coffee-cooperative',
    }),
  }).then((res) => res.json())

  // Create Tokyo Bean Trading
  const tokyoBean = await fetch('http://localhost:3003/api/companies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + Buffer.from('test@test.com:test').toString('base64'),
    },
    body: JSON.stringify({
      name: 'Tokyo Bean Trading Co.',
      type: 'importer',
      description:
        'Specialty coffee importer supplying high-end cafés and roasters throughout Japan with rare and premium coffee varieties.',
      country: 'Japan',
      slug: 'tokyo-bean-trading',
    }),
  }).then((res) => res.json())

  console.log('Companies created:', {
    donHugo: donHugo.id,
    globalNut: globalNut.id,
    colombianCoffee: colombianCoffee.id,
    tokyoBean: tokyoBean.id,
  })

  return {
    donHugo: donHugo.id,
    globalNut: globalNut.id,
    colombianCoffee: colombianCoffee.id,
    tokyoBean: tokyoBean.id,
  }
}

async function createTransactions(companies) {
  console.log('Creating transactions...')

  // Create Don Hugo Peanut Export
  const donHugoTransaction = await fetch('http://localhost:3003/api/export-transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + Buffer.from('test@test.com:test').toString('base64'),
    },
    body: JSON.stringify({
      title: 'Don Hugo Peanut Export - Batch #1',
      contractAddress: '0x7a3E8F126a5D91C58EA6F53EaB37C6439E63F1F9',
      exporter: companies.donHugo,
      importer: companies.globalNut,
      product: 'Premium Grade A Peanuts',
      amount: 75000,
      currency: 'usdc',
      status: 'in-progress',
      verificationSteps: [
        {
          stepName: 'Production Verification',
          description: 'Verification of peanut production at Don Hugo Farms facility',
          status: 'verified',
          verifiedBy: 'Oracle Node #452',
          timestamp: '2025-04-12T10:23:45Z',
          paymentReleased: 15,
          evidenceType: 'photo',
        },
        {
          stepName: 'Port of Origin Departure',
          description: 'Verification of goods arrival and loading at Puerto de Buenos Aires',
          status: 'verified',
          verifiedBy: 'Oracle Node #387',
          timestamp: '2025-04-18T14:05:12Z',
          paymentReleased: 20,
          evidenceType: 'document',
        },
        {
          stepName: 'Final Delivery Verification',
          description: 'Verification of delivery to Global Nut Distributors warehouse',
          status: 'pending',
          evidenceType: 'multiple',
        },
      ],
      slug: 'don-hugo-peanut-export-batch-1',
    }),
  }).then((res) => res.json())

  // Create Colombian Coffee Export
  const coffeeTransaction = await fetch('http://localhost:3003/api/export-transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + Buffer.from('test@test.com:test').toString('base64'),
    },
    body: JSON.stringify({
      title: 'Global Coffee Export - Colombia to Japan',
      contractAddress: '0x8b3F9C12E8A0E2D33d9F4B1F5A2C1E6F7b8D9E0F',
      exporter: companies.colombianCoffee,
      importer: companies.tokyoBean,
      product: 'Premium Arabica Coffee Beans',
      amount: 120000,
      currency: 'usdc',
      status: 'completed',
      verificationSteps: [
        {
          stepName: 'Production Verification',
          description: 'Verification of coffee bean production at Colombian farms',
          status: 'verified',
          verifiedBy: 'Oracle Node #217',
          timestamp: '2025-03-12T08:15:30Z',
          paymentReleased: 15,
          evidenceType: 'photo',
        },
        {
          stepName: 'Final Delivery Verification',
          description: 'Verification of delivery to Tokyo Bean Trading warehouse',
          status: 'verified',
          verifiedBy: 'Oracle Node #127',
          timestamp: '2025-04-17T10:45:27Z',
          paymentReleased: 45,
          evidenceType: 'multiple',
        },
      ],
      slug: 'global-coffee-export-colombia-to-japan',
    }),
  }).then((res) => res.json())

  console.log('Transactions created:', {
    donHugoTransaction: donHugoTransaction.id,
    coffeeTransaction: coffeeTransaction.id,
  })
}

async function main() {
  try {
    const companies = await createCompanies()
    await createTransactions(companies)
    console.log('Test data created successfully!')
  } catch (error) {
    console.error('Error creating test data:', error)
  }
}

main()
