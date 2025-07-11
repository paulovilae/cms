-- Create the new flow-templates collection
CREATE TABLE IF NOT EXISTS "flow-templates" (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  businessUnit TEXT,
  isActive INTEGER DEFAULT 1,
  sectionTemplates TEXT, -- JSON array stored as text
  defaultAiProviderId TEXT,
  globalSystemPrompt TEXT,
  workflow TEXT, -- JSON object stored as text
  createdAt TEXT,
  updatedAt TEXT
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_flow_templates_business_unit ON "flow-templates" (businessUnit);
CREATE INDEX IF NOT EXISTS idx_flow_templates_category ON "flow-templates" (category);
CREATE INDEX IF NOT EXISTS idx_flow_templates_is_active ON "flow-templates" (isActive);

-- Create foreign key constraint for AI provider relationship
ALTER TABLE "flow-templates" 
ADD CONSTRAINT fk_flow_templates_ai_provider 
FOREIGN KEY (defaultAiProviderId) 
REFERENCES "ai-providers" (id)
ON DELETE SET NULL;

-- Add description explaining the table's purpose
COMMENT ON TABLE "flow-templates" IS 'Stores document templates that can be used to generate new documents with predefined section structures';