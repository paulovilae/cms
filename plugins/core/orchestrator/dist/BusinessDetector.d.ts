import type { BusinessDetector, BusinessContext, BusinessDetectionResult, DetectionMethod, OrchestratorLogger } from './types';
/**
 * Business context detector implementation
 */
export declare class BusinessDetectorImpl implements BusinessDetector {
    private logger;
    private fallbackContext;
    private enabledMethods;
    constructor(logger: OrchestratorLogger, options?: {
        fallback?: BusinessContext;
        enabledMethods?: DetectionMethod[];
    });
    /**
     * Detect business context using multiple methods
     */
    detect(context?: {
        domain?: string;
        port?: number;
        headers?: Record<string, string>;
        environment?: Record<string, string>;
    }): Promise<BusinessDetectionResult>;
    /**
     * Detect by environment variables
     */
    private detectByEnvironment;
    /**
     * Detect by domain name
     */
    private detectByDomain;
    /**
     * Detect by port number
     */
    private detectByPort;
    /**
     * Detect by HTTP headers
     */
    private detectByHeaders;
    /**
     * Get all supported business contexts
     */
    getSupportedContexts(): BusinessContext[];
    /**
     * Validate if a string is a valid business context
     */
    isValidContext(context: string): context is BusinessContext;
    /**
     * Update business configuration
     */
    updateBusinessConfig(business: BusinessContext, config: {
        domains?: string[];
        ports?: number[];
        envVars?: Record<string, string>;
    }): void;
    /**
     * Enable or disable detection methods
     */
    setEnabledMethods(methods: DetectionMethod[]): void;
    /**
     * Get current detection configuration
     */
    getDetectionConfig(): {
        fallbackContext: BusinessContext;
        enabledMethods: DetectionMethod[];
        businessConfigs: Record<string, {
            domains: string[];
            ports: number[];
            envVars: Record<string, string>;
        }>;
    };
}
//# sourceMappingURL=BusinessDetector.d.ts.map