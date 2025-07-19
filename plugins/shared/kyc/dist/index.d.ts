import type { Config } from 'payload';
export interface KYCPluginOptions {
    enabled?: boolean;
    kycProvider?: 'manual' | 'sumsub' | 'truora' | 'complyadvantage';
    storageAdapter?: 'local' | 's3' | 'ipfs';
    autoApprove?: boolean;
    complianceLevel?: 'basic' | 'enhanced' | 'full';
}
export declare const kycPlugin: (options?: KYCPluginOptions) => (incomingConfig: Config) => Config;
export default kycPlugin;
