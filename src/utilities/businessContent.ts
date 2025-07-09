import { getPayload } from 'payload'
import config from '@payload-config'

export async function getBusinessTeamMembers(business: string) {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'team-members',
    where: {
      business: {
        equals: business,
      },
    },
    sort: 'order',
  })

  return docs
}

export async function getBusinessPricingPlans(business: string) {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'pricing-plans',
    where: {
      business: {
        equals: business,
      },
    },
    sort: 'order',
  })

  return docs
}

export async function getBusinessFeatures(business: string) {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'features',
    where: {
      business: {
        equals: business,
      },
    },
    sort: 'order',
  })

  return docs
}

export async function getBusinessTestimonials(business: string) {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'testimonials',
    where: {
      business: {
        equals: business,
      },
    },
    sort: 'order',
  })

  return docs
}

// Generic function to get any business-scoped content
export async function getBusinessContent(
  business: string,
  collection: 'team-members' | 'pricing-plans' | 'features' | 'testimonials',
  additionalWhere?: any,
) {
  const payload = await getPayload({ config })

  const whereClause = {
    business: {
      equals: business,
    },
    ...additionalWhere,
  }

  const { docs } = await payload.find({
    collection,
    where: whereClause,
    sort: 'order',
  })

  return docs
}
