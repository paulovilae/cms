// Define types for our features
type IconType = 'upload' | 'predefined'
type PredefinedIconType =
  | 'lock'
  | 'coin'
  | 'shield'
  | 'globe'
  | 'document'
  | 'chart'
  | 'clock'
  | 'wallet'

// Sample features based on IntelliTrade product information
export const features = [
  {
    title: 'Smart Escrow System',
    description:
      'Our secure multi-signature smart escrow system holds buyer funds and releases payment automatically when delivery conditions are verified, providing 85% advance payment to exporters upon verification.',
    // Using simple text here since rich text will be handled in the seed index file
    category: 'escrow' as const,
    userType: 'both' as const,
    order: 1,
    // Using simple text here since rich text will be handled in the seed index file
  },
  {
    title: 'Oracle Verification',
    description:
      'Our verification system validates logistics milestones through photographic evidence, confirms geographic location through GPS data, and timestamps all verification events on the blockchain.',
    // Using simple text here since rich text will be handled in the seed index file
    category: 'oracle' as const,
    userType: 'both' as const,
    order: 2,
    // Using simple text here since rich text will be handled in the seed index file
  },
  {
    title: 'Dual Token Architecture',
    description:
      'IntelliTrade utilizes a dual token system with stablecoins (USDC/USDT) acting as collateral with 1:1 parity to USD for fund transfers, and Platform Tokens (TP) enabling contract creation and platform fee payment.',
    // Using simple text here since rich text will be handled in the seed index file
    category: 'blockchain' as const,
    userType: 'both' as const,
    order: 3,
    // Using simple text here since rich text will be handled in the seed index file
  },
  {
    title: 'KYC/KYB Processing',
    description:
      'Our platform includes custom identity verification workflows, document validation using OCR, automated financial statement analysis, and comprehensive compliance tracking and reporting.',
    // Using simple text here since rich text will be handled in the seed index file
    category: 'kyc' as const,
    userType: 'both' as const,
    order: 4,
    // Using simple text here since rich text will be handled in the seed index file
  },
  {
    title: '85% Advance Payment',
    description:
      'Exporters receive 85% of the payment upfront through our factoring with recourse system, eliminating cash flow issues while waiting for full payment after delivery.',
    // Using simple text here since rich text will be handled in the seed index file
    category: 'payments' as const,
    userType: 'exporter' as const,
    order: 5,
    // Using simple text here since rich text will be handled in the seed index file
  },
  {
    title: 'Cross-Border Payment Solution',
    description:
      'IntelliTrade eliminates high costs and delays in international payments through our stablecoin-based transaction system, making cross-border trade finance efficient and affordable.',
    // Using simple text here since rich text will be handled in the seed index file
    category: 'payments' as const,
    userType: 'both' as const,
    order: 6,
    // Using simple text here since rich text will be handled in the seed index file
  },
]
