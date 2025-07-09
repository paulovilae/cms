// Business-specific features for each platform

export const intellitradeFeatures = [
  {
    title: 'Smart Escrow System',
    description:
      'Our secure multi-signature smart escrow system holds buyer funds and releases payment automatically when delivery conditions are verified, providing 85% advance payment to exporters upon verification.',
    category: 'escrow' as const,
    userType: 'both' as const,
    order: 1,
  },
  {
    title: 'Oracle Verification',
    description:
      'Our verification system validates logistics milestones through photographic evidence, confirms geographic location through GPS data, and timestamps all verification events on the blockchain.',
    category: 'oracle' as const,
    userType: 'both' as const,
    order: 2,
  },
  {
    title: 'Dual Token Architecture',
    description:
      'IntelliTrade utilizes a dual token system with stablecoins (USDC/USDT) acting as collateral with 1:1 parity to USD for fund transfers, and Platform Tokens (TP) enabling contract creation and platform fee payment.',
    category: 'blockchain' as const,
    userType: 'both' as const,
    order: 3,
  },
  {
    title: 'KYC/KYB Processing',
    description:
      'Our platform includes custom identity verification workflows, document validation using OCR, automated financial statement analysis, and comprehensive compliance tracking and reporting.',
    category: 'kyc' as const,
    userType: 'both' as const,
    order: 4,
  },
  {
    title: '85% Advance Payment',
    description:
      'Exporters receive 85% of the payment upfront through our factoring with recourse system, eliminating cash flow issues while waiting for full payment after delivery.',
    category: 'payments' as const,
    userType: 'exporter' as const,
    order: 5,
  },
  {
    title: 'Cross-Border Payment Solution',
    description:
      'IntelliTrade eliminates high costs and delays in international payments through our stablecoin-based transaction system, making cross-border trade finance efficient and affordable.',
    category: 'payments' as const,
    userType: 'both' as const,
    order: 6,
  },
]

export const salariumFeatures = [
  {
    title: 'AI-Assisted Job Description Creation',
    description:
      'Intelligent job description assistance with market-based skill requirement analysis, industry-standard job template generation, automated job posting optimization, and real-time market alignment suggestions.',
    category: 'ai-assistance' as const,
    userType: 'hr' as const,
    order: 1,
  },
  {
    title: 'AI-Assisted Compensation Analysis',
    description:
      'Advanced compensation management with market salary benchmarking, pay equity analysis and recommendations, compensation structure optimization, and performance-based compensation modeling.',
    category: 'compensation' as const,
    userType: 'hr' as const,
    order: 2,
  },
  {
    title: 'Market Information & Benchmarking',
    description:
      'Comprehensive market intelligence with real-time industry salary data integration, regional market analysis and trends, competitive positioning insights, and skills demand forecasting.',
    category: 'market-data' as const,
    userType: 'hr' as const,
    order: 3,
  },
  {
    title: 'Benefits Analysis & Optimization',
    description:
      'Intelligent benefits management with benefits package cost-benefit analysis, employee satisfaction correlation analysis, competitive benefits benchmarking, and ROI analysis for benefits programs.',
    category: 'benefits' as const,
    userType: 'hr' as const,
    order: 4,
  },
  {
    title: 'HR Workflow Automation',
    description:
      'Streamlined HR processes with document flow management and automation, approval process optimization, compliance tracking and reporting, and employee lifecycle management.',
    category: 'automation' as const,
    userType: 'hr' as const,
    order: 5,
  },
  {
    title: 'Talent Analytics & Insights',
    description:
      'Data-driven HR decision making with employee performance analytics, retention prediction modeling, skills gap analysis, workforce planning insights, and diversity and inclusion metrics.',
    category: 'analytics' as const,
    userType: 'hr' as const,
    order: 6,
  },
]

export const latinosFeatures = [
  {
    title: 'AI-Powered Trading Bots',
    description:
      'Advanced automated trading bots with machine learning algorithms, real-time market analysis, customizable trading strategies, and risk management protocols for optimal trading performance.',
    category: 'trading-bots' as const,
    userType: 'trader' as const,
    order: 1,
  },
  {
    title: 'Real-Time Market Analytics',
    description:
      'Comprehensive market data analysis with live price feeds, technical indicators, market sentiment analysis, and predictive analytics to inform trading decisions.',
    category: 'analytics' as const,
    userType: 'trader' as const,
    order: 2,
  },
  {
    title: 'Strategy Builder & Backtesting',
    description:
      'Intuitive strategy creation tools with drag-and-drop interface, historical backtesting capabilities, performance optimization, and strategy sharing marketplace.',
    category: 'strategy' as const,
    userType: 'trader' as const,
    order: 3,
  },
  {
    title: 'Risk Management System',
    description:
      'Advanced risk controls with position sizing algorithms, stop-loss automation, portfolio diversification tools, and real-time risk monitoring to protect your investments.',
    category: 'risk-management' as const,
    userType: 'trader' as const,
    order: 4,
  },
  {
    title: 'Fast Execution Engine',
    description:
      'Ultra-low latency trading execution with direct market access, smart order routing, slippage minimization, and high-frequency trading capabilities.',
    category: 'execution' as const,
    userType: 'trader' as const,
    order: 5,
  },
  {
    title: 'Portfolio Management',
    description:
      'Comprehensive portfolio tracking with performance analytics, asset allocation optimization, rebalancing automation, and detailed reporting for tax and compliance purposes.',
    category: 'portfolio' as const,
    userType: 'trader' as const,
    order: 6,
  },
]

export const capacitaFeatures = [
  {
    title: 'Avatar Arena Training',
    description:
      'Immersive AI character simulation with complex personas, dynamic interactions, progressive difficulty levels, and multi-modal responses for realistic training scenarios.',
    category: 'avatar-training' as const,
    userType: 'trainee' as const,
    order: 1,
  },
  {
    title: 'RPG-Style Gamification',
    description:
      'Engaging game-like experience with narrative storylines, character progression, achievement systems, and branching narratives that create personalized learning paths.',
    category: 'gamification' as const,
    userType: 'trainee' as const,
    order: 2,
  },
  {
    title: 'Multi-Stage Real-Time Evaluation',
    description:
      'Advanced AI-powered assessment across text analysis, voice evaluation, and visual assessment with sentiment analysis, tone analysis, and posture recognition.',
    category: 'evaluation' as const,
    userType: 'trainee' as const,
    order: 3,
  },
  {
    title: 'Universal Training Engine',
    description:
      'Cross-industry adaptable framework with evaluation criteria for different industries, AI content generation, and flexible deployment for customer service, sales, healthcare, and education.',
    category: 'training-engine' as const,
    userType: 'admin' as const,
    order: 4,
  },
  {
    title: 'Performance Analytics',
    description:
      'Comprehensive training analytics with detailed performance insights, improvement tracking, skill development metrics, and ROI measurement for training programs.',
    category: 'analytics' as const,
    userType: 'admin' as const,
    order: 5,
  },
  {
    title: 'Scalable Deployment',
    description:
      'Enterprise-ready platform with support for 10,000+ concurrent users, customizable content for specific business needs, and easy integration with existing training systems.',
    category: 'scalability' as const,
    userType: 'admin' as const,
    order: 6,
  },
]

// Function to get features for a specific business
export function getBusinessFeatures(business: string) {
  switch (business) {
    case 'intellitrade':
      return intellitradeFeatures
    case 'salarium':
      return salariumFeatures
    case 'latinos':
      return latinosFeatures
    case 'capacita':
      return capacitaFeatures
    default:
      return intellitradeFeatures // fallback
  }
}
