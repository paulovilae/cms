import type { Payload } from 'payload'
import { seedDonHugoPeanutTransaction } from './transactions/don-hugo-peanut'
import { seedCoffeeExportTransaction } from './transactions/coffee-export'
import { seedSoyExportTransaction } from './transactions/soy-export'
import { seedOliveOilExportTransaction } from './transactions/olive-oil-export'

export const seedExportTransactions = async (
  payload: Payload,
  companyMap: Record<string, any>,
  routeMap: Record<string, any>,
): Promise<Record<string, any>> => {
  const existingDocs = await payload.find({
    collection: 'export-transactions',
    limit: 1,
  })

  // Return map of transaction names to IDs for reference in other seed functions
  const transactionMap: Record<string, any> = {}

  if (existingDocs.docs.length === 0) {
    // Seed all transaction types
    const donHugoTransaction = await seedDonHugoPeanutTransaction(payload, companyMap, routeMap)
    transactionMap['Don Hugo Peanut Export - Batch #1'] = donHugoTransaction.id

    const coffeeTransaction = await seedCoffeeExportTransaction(payload, companyMap, routeMap)
    transactionMap['Global Coffee Export - Colombia to Japan'] = coffeeTransaction.id

    const soyTransaction = await seedSoyExportTransaction(payload, companyMap, routeMap)
    transactionMap['Brazilian Soy Export - Batch #147'] = soyTransaction.id

    const oliveOilTransaction = await seedOliveOilExportTransaction(payload, companyMap, routeMap)
    transactionMap['Mediterranean Olive Oil Export - Batch #32'] = oliveOilTransaction.id

    console.log('✅ Seed export transactions completed')
  } else {
    // If transactions already exist, get their IDs for the map
    const allTransactions = await payload.find({
      collection: 'export-transactions',
      limit: 100,
    })

    allTransactions.docs.forEach((transaction: any) => {
      transactionMap[transaction.title] = transaction.id
    })

    console.log('🌱 Export transactions already exist, using existing data')
  }

  return transactionMap
}
