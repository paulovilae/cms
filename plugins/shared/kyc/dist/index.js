"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kycPlugin = void 0;
const KYCApplications_1 = require("./collections/KYCApplications");
const VerificationDocuments_1 = require("./collections/VerificationDocuments");
const KYCTemplates_1 = require("./collections/KYCTemplates");
const kycPlugin = (options = {}) => (incomingConfig) => {
    if (options.enabled === false) {
        return incomingConfig;
    }
    // create copy of incoming config
    let config = { ...incomingConfig };
    // Add collections
    config.collections = [
        ...(config.collections || []),
        KYCApplications_1.KYCApplications,
        VerificationDocuments_1.VerificationDocuments,
        KYCTemplates_1.KYCTemplates,
    ];
    // Add onInit for plugin setup
    config.onInit = async (payload) => {
        if (incomingConfig.onInit)
            await incomingConfig.onInit(payload);
        payload.logger.info('KYC plugin initialized');
    };
    return config;
};
exports.kycPlugin = kycPlugin;
exports.default = exports.kycPlugin;
