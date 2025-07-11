-- Enhance the flow-documents collection with new fields

-- Add template relationship
ALTER TABLE "flow-documents"
ADD COLUMN templateId TEXT REFERENCES "flow-templates" (id) ON DELETE SET NULL;

-- Add organization relationship
ALTER TABLE "flow-documents"
ADD COLUMN organizationId TEXT REFERENCES "organizations" (id) ON DELETE SET NULL;

-- Add workflow fields
ALTER TABLE "flow-documents"
ADD COLUMN workflow_currentStep INTEGER DEFAULT 0;

ALTER TABLE "flow-documents"
ADD COLUMN workflow_totalSteps INTEGER DEFAULT 0;

ALTER TABLE "flow-documents"
ADD COLUMN workflow_progress INTEGER DEFAULT 0;

ALTER TABLE "flow-documents"
ADD COLUMN workflow_stepSequence TEXT; -- JSON array stored as text

-- Add AI config fields
ALTER TABLE "flow-documents"
ADD COLUMN aiConfig_preferredProviderId TEXT REFERENCES "ai-providers" (id) ON DELETE SET NULL;

ALTER TABLE "flow-documents"
ADD COLUMN aiConfig_systemPromptOverrides TEXT; -- JSON object stored as text

ALTER TABLE "flow-documents"
ADD COLUMN aiConfig_defaultPrompt TEXT;

-- Create indexes for new fields
CREATE INDEX IF NOT EXISTS idx_flow_documents_template_id ON "flow-documents" (templateId);
CREATE INDEX IF NOT EXISTS idx_flow_documents_organization_id ON "flow-documents" (organizationId);
CREATE INDEX IF NOT EXISTS idx_flow_documents_preferred_provider_id ON "flow-documents" (aiConfig_preferredProviderId);

-- Update the schema version
PRAGMA user_version = PRAGMA user_version + 1;