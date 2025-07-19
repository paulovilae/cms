const ConfigLoader = require('./config-loader');

/**
 * Initialize configuration for the current business context
 * This should be called at the start of the application
 */
function initializeConfig() {
  const configLoader = new ConfigLoader();
  
  try {
    // Load business environment based on context detection
    const { businessName, config } = configLoader.loadBusinessEnvironment();
    
    console.log(`🔧 Initialized configuration for business: ${businessName}`);
    console.log(`📍 Port: ${config.port}`);
    console.log(`🌐 Domain: ${config.domain}`);
    console.log(`💾 Database: ${config.databaseUri}`);
    
    return { businessName, config };
  } catch (error) {
    console.error('❌ Failed to initialize configuration:', error.message);
    console.log('🔄 Falling back to default CMS configuration...');
    
    // Fallback to CMS configuration
    process.env.BUSINESS_NAME = 'cms';
    process.env.PORT = '3006';
    process.env.BUSINESS_DOMAIN = 'cms.paulovila.org';
    
    return {
      businessName: 'cms',
      config: configLoader.getBusinessConfig('cms')
    };
  }
}

/**
 * Get configuration for a specific business
 */
function getBusinessConfig(businessName) {
  const configLoader = new ConfigLoader();
  return configLoader.getBusinessConfig(businessName);
}

/**
 * Detect current business context
 */
function detectBusiness() {
  const configLoader = new ConfigLoader();
  return configLoader.detectBusinessContext();
}

module.exports = {
  initializeConfig,
  getBusinessConfig,
  detectBusiness,
  ConfigLoader
};