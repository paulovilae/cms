"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessDetectorImpl = void 0;
/**
 * Default business configurations for detection
 */
const DEFAULT_BUSINESS_CONFIGS = {
    intellitrade: {
        domains: ['intellitrade.paulovila.org', 'intellitrade.localhost'],
        ports: [3004],
        envVars: { BUSINESS_MODE: 'intellitrade', BUSINESS_CONTEXT: 'intellitrade' }
    },
    salarium: {
        domains: ['salarium.paulovila.org', 'salarium.localhost'],
        ports: [3005],
        envVars: { BUSINESS_MODE: 'salarium', BUSINESS_CONTEXT: 'salarium' }
    },
    latinos: {
        domains: ['latinos.paulovila.org', 'latinos.localhost'],
        ports: [3003],
        envVars: { BUSINESS_MODE: 'latinos', BUSINESS_CONTEXT: 'latinos' }
    },
    capacita: {
        domains: ['capacita.paulovila.org', 'capacita.localhost'],
        ports: [3007],
        envVars: { BUSINESS_MODE: 'capacita', BUSINESS_CONTEXT: 'capacita' }
    },
    cms: {
        domains: ['cms.paulovila.org', 'cms.localhost'],
        ports: [3006],
        envVars: { BUSINESS_MODE: 'cms', BUSINESS_CONTEXT: 'cms' }
    }
};
/**
 * Business context detector implementation
 */
class BusinessDetectorImpl {
    constructor(logger, options = {}) {
        this.logger = logger;
        this.fallbackContext = options.fallback || 'unknown';
        this.enabledMethods = new Set(options.enabledMethods || ['domain', 'port', 'environment', 'header']);
    }
    /**
     * Detect business context using multiple methods
     */
    async detect(context) {
        const startTime = Date.now();
        try {
            // Try detection methods in order of reliability
            const detectionMethods = [
                () => this.detectByEnvironment(context?.environment),
                () => this.detectByDomain(context?.domain),
                () => this.detectByPort(context?.port),
                () => this.detectByHeaders(context?.headers)
            ];
            for (const method of detectionMethods) {
                const result = await method();
                if (result.context !== 'unknown') {
                    const detectionTime = Date.now() - startTime;
                    this.logger.success(`Business context detected: ${result.context}`, {
                        method: result.method,
                        confidence: result.confidence,
                        detectionTime: `${detectionTime}ms`
                    });
                    return result;
                }
            }
            // Fallback to default context
            const fallbackResult = {
                context: this.fallbackContext,
                method: 'environment',
                confidence: 0.1,
                metadata: { reason: 'fallback', detectionTime: Date.now() - startTime }
            };
            this.logger.warn(`No business context detected, using fallback: ${this.fallbackContext}`, { detectionTime: `${Date.now() - startTime}ms` });
            return fallbackResult;
        }
        catch (error) {
            this.logger.error('Business detection failed', error);
            return {
                context: this.fallbackContext,
                method: 'environment',
                confidence: 0.0,
                metadata: { error: error.message }
            };
        }
    }
    /**
     * Detect by environment variables
     */
    async detectByEnvironment(environment) {
        if (!this.enabledMethods.has('environment')) {
            return { context: 'unknown', method: 'environment', confidence: 0 };
        }
        const env = environment || {};
        // Check explicit business context variables
        const businessMode = env.BUSINESS_MODE || env.BUSINESS_CONTEXT;
        if (businessMode && this.isValidContext(businessMode)) {
            return {
                context: businessMode,
                method: 'environment',
                confidence: 0.95,
                metadata: { variable: 'BUSINESS_MODE', value: businessMode }
            };
        }
        // Check for business-specific environment patterns
        for (const [business, config] of Object.entries(DEFAULT_BUSINESS_CONFIGS)) {
            for (const [envVar, expectedValue] of Object.entries(config.envVars)) {
                if (env[envVar] === expectedValue) {
                    return {
                        context: business,
                        method: 'environment',
                        confidence: 0.9,
                        metadata: { variable: envVar, value: expectedValue }
                    };
                }
            }
        }
        return { context: 'unknown', method: 'environment', confidence: 0 };
    }
    /**
     * Detect by domain name
     */
    async detectByDomain(domain) {
        if (!this.enabledMethods.has('domain') || !domain) {
            return { context: 'unknown', method: 'domain', confidence: 0 };
        }
        const normalizedDomain = domain.toLowerCase();
        for (const [business, config] of Object.entries(DEFAULT_BUSINESS_CONFIGS)) {
            for (const businessDomain of config.domains) {
                if (normalizedDomain.includes(businessDomain.toLowerCase())) {
                    return {
                        context: business,
                        method: 'domain',
                        confidence: 0.85,
                        metadata: { domain: normalizedDomain, matchedPattern: businessDomain }
                    };
                }
            }
        }
        // Check for subdomain patterns
        const subdomainMatch = normalizedDomain.match(/^([^.]+)\./);
        if (subdomainMatch) {
            const subdomain = subdomainMatch[1];
            if (this.isValidContext(subdomain)) {
                return {
                    context: subdomain,
                    method: 'domain',
                    confidence: 0.7,
                    metadata: { domain: normalizedDomain, subdomain }
                };
            }
        }
        return { context: 'unknown', method: 'domain', confidence: 0 };
    }
    /**
     * Detect by port number
     */
    async detectByPort(port) {
        if (!this.enabledMethods.has('port') || !port) {
            return { context: 'unknown', method: 'port', confidence: 0 };
        }
        for (const [business, config] of Object.entries(DEFAULT_BUSINESS_CONFIGS)) {
            if (config.ports.includes(port)) {
                return {
                    context: business,
                    method: 'port',
                    confidence: 0.8,
                    metadata: { port, businessPorts: config.ports }
                };
            }
        }
        return { context: 'unknown', method: 'port', confidence: 0 };
    }
    /**
     * Detect by HTTP headers
     */
    async detectByHeaders(headers) {
        if (!this.enabledMethods.has('header') || !headers) {
            return { context: 'unknown', method: 'header', confidence: 0 };
        }
        // Check for business context in headers
        const businessHeader = headers['x-business-context'] ||
            headers['X-Business-Context'] ||
            headers['business-context'];
        if (businessHeader && this.isValidContext(businessHeader)) {
            return {
                context: businessHeader,
                method: 'header',
                confidence: 0.9,
                metadata: { header: 'x-business-context', value: businessHeader }
            };
        }
        // Check host header for domain detection
        const hostHeader = headers.host || headers.Host;
        if (hostHeader) {
            return this.detectByDomain(hostHeader);
        }
        return { context: 'unknown', method: 'header', confidence: 0 };
    }
    /**
     * Get all supported business contexts
     */
    getSupportedContexts() {
        return ['intellitrade', 'salarium', 'latinos', 'capacita', 'cms', 'unknown'];
    }
    /**
     * Validate if a string is a valid business context
     */
    isValidContext(context) {
        return this.getSupportedContexts().includes(context);
    }
    /**
     * Update business configuration
     */
    updateBusinessConfig(business, config) {
        if (business === 'unknown')
            return;
        const currentConfig = DEFAULT_BUSINESS_CONFIGS[business];
        if (currentConfig) {
            if (config.domains) {
                currentConfig.domains.push(...config.domains);
            }
            if (config.ports) {
                currentConfig.ports.push(...config.ports);
            }
            if (config.envVars) {
                Object.assign(currentConfig.envVars, config.envVars);
            }
        }
        this.logger.info(`Updated business configuration for ${business}`, config);
    }
    /**
     * Enable or disable detection methods
     */
    setEnabledMethods(methods) {
        this.enabledMethods = new Set(methods);
        this.logger.info('Updated enabled detection methods', { methods });
    }
    /**
     * Get current detection configuration
     */
    getDetectionConfig() {
        return {
            fallbackContext: this.fallbackContext,
            enabledMethods: Array.from(this.enabledMethods),
            businessConfigs: DEFAULT_BUSINESS_CONFIGS
        };
    }
}
exports.BusinessDetectorImpl = BusinessDetectorImpl;
//# sourceMappingURL=BusinessDetector.js.map