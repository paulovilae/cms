-- Enhance the document-sections collection with new fields

-- Update type column to include new options
-- We can't directly change the constraints of an existing column in SQLite,
-- but we can handle this in the application layer by validating against an expanded list

-- Add input configuration fields
ALTER TABLE "document-sections"
ADD COLUMN inputConfig_placeholder TEXT;

ALTER TABLE "document-sections"
ADD COLUMN inputConfig_defaultValue TEXT;

ALTER TABLE "document-sections"
ADD COLUMN inputConfig_minLength INTEGER;

ALTER TABLE "document-sections"
ADD COLUMN inputConfig_maxLength INTEGER;

ALTER TABLE "document-sections"
ADD COLUMN inputConfig_isRequired INTEGER DEFAULT 0;

ALTER TABLE "document-sections"
ADD COLUMN inputConfig_validationRules TEXT; -- JSON array stored as text

ALTER TABLE "document-sections"
ADD COLUMN inputConfig_options TEXT; -- JSON array stored as text

-- Add AI configuration fields
ALTER TABLE "document-sections"
ADD COLUMN aiConfig_systemPrompt TEXT;

ALTER TABLE "document-sections"
ADD COLUMN aiConfig_exampleResponse TEXT;

ALTER TABLE "document-sections"
ADD COLUMN aiConfig_inputMapping TEXT; -- JSON object stored as text

ALTER TABLE "document-sections"
ADD COLUMN aiConfig_temperature REAL DEFAULT 0.7;

-- Add interaction history
ALTER TABLE "document-sections"
ADD COLUMN interactionHistory TEXT; -- JSON array stored as text

-- Add field to track dependencies
ALTER TABLE "document-sections"
ADD COLUMN dependencies TEXT; -- JSON array of section IDs stored as text

-- Create indexes for improved query performance
CREATE INDEX IF NOT EXISTS idx_document_sections_type ON "document-sections" (type);
CREATE INDEX IF NOT EXISTS idx_document_sections_is_completed ON "document-sections" (isCompleted);
CREATE INDEX IF NOT EXISTS idx_document_sections_is_generated ON "document-sections" (isGenerated);

-- Update the schema version
PRAGMA user_version = PRAGMA user_version + 1;