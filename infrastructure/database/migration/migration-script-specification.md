# Migration Script Specification

This document provides the specification for implementing the migration script that will execute the Salarium Job Flow to Generic Job Flow Cascade migration.

## Overview

The migration script will execute a multi-phase process to:
1. Update the database schema
2. Migrate templates from Salarium to the generic format
3. Migrate instances to documents and sections
4. Update relationships and generation history
5. Validate the migration

## Script Structure

```javascript
// migration-executor.js
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const sqlite3 = require('sqlite3')
const yaml = require('js-yaml')
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const mkdirp = promisify(require('mkdirp'))

// Load configuration
const config = yaml.load(fs.readFileSync(path.resolve(__dirname, './migration-config.yaml'), 'utf8'))
const mappings = require('./schema-mapping.json')

// Main migration function
async function executeMigration() {
  const logger = createLogger()
  const db = await connectToDatabase()
  
  try {
    // Create backup
    if (config.backup.enabled) {
      await createBackup(db, config.backup)
    }
    
    // Execute each phase in order
    const sortedPhases = config.phases.sort((a, b) => a.order - b.order)
    
    for (const phase of sortedPhases) {
      logger.info(`Starting phase: ${phase.name} - ${phase.description}`)
      
      if (phase.requiresConfirmation) {
        // In real implementation, this would prompt the user
        logger.info(`Confirmation required for phase: ${phase.name}`)
      }
      
      // Execute the phase
      await executePhase(db, phase, logger)
      
      logger.info(`Completed phase: ${phase.name}`)
    }
    
    // Generate final report
    if (config.reporting.enabled) {
      await generateReport(logger.getLogs(), config.reporting)
    }
    
    logger.info('Migration completed successfully')
    return { success: true }
  } catch (error) {
    logger.error(`Migration failed: ${error.message}`)
    
    // Attempt rollback if enabled
    if (config.rollback.enabled) {
      await executeRollback(db, config.rollback, logger)
    }
    
    return { success: false, error: error.message }
  } finally {
    await closeDatabase(db)
  }
}
```

## Core Functions

### Phase Execution

```javascript
async function executePhase(db, phase, logger) {
  // Different handling based on phase type
  if (phase.scripts) {
    // Execute SQL scripts
    await executeSqlScripts(db, phase.scripts, logger)
  }
  
  if (phase.steps) {
    // Execute complex migration steps
    for (const step of phase.steps) {
      await executeStep(db, step, logger)
    }
  }
}

async function executeSqlScripts(db, scripts, logger) {
  for (const scriptName of scripts) {
    const scriptPath = path.resolve(__dirname, `./${scriptName}`)
    const sql = await readFile(scriptPath, 'utf8')
    
    // Split script into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0)
    
    // Execute each statement
    for (const statement of statements) {
      try {
        await executeQuery(db, statement)
        logger.info(`Executed SQL statement from ${scriptName}`)
      } catch (error) {
        logger.error(`Error executing SQL from ${scriptName}: ${error.message}`)
        throw error
      }
    }
  }
}
```

### Template Migration

```javascript
async function migrateTemplates(db, step, logger) {
  // Fetch Salarium templates
  const templates = await executeQuery(db, step.query)
  
  // Convert templates to new format
  const convertedTemplates = templates.map(template => {
    const converted = {}
    
    // Map fields according to configuration
    for (const mapping of step.mapping.fieldMappings) {
      const sourceValue = getNestedValue(template, mapping.source)
      
      if (mapping.transform === 'none') {
        setNestedValue(converted, mapping.target, sourceValue)
      } else if (mapping.transform === 'lookupMapping') {
        const mappedValue = mappings[mapping.mappingKey][sourceValue]
        setNestedValue(converted, mapping.target, mappedValue)
      } else if (mapping.transform === 'convertStepsToSectionTemplates') {
        const sectionTemplates = convertStepsToSectionTemplates(sourceValue)
        setNestedValue(converted, mapping.target, sectionTemplates)
      }
    }
    
    // Add additional fields
    for (const field of step.mapping.additionalFields) {
      if (field.transform) {
        const value = executeTransformation(field.transform, template, field.source)
        setNestedValue(converted, field.target, value)
      } else {
        setNestedValue(converted, field.target, field.value)
      }
    }
    
    return converted
  })
  
  // Save converted templates
  for (const template of convertedTemplates) {
    await saveToDatabase(db, step.mapping.targetCollection, template)
    logger.info(`Migrated template: ${template.title}`)
  }
  
  return convertedTemplates
}
```

### Instance Migration

```javascript
async function migrateInstances(db, step, logger) {
  // Fetch flow instances
  const instances = await executeQuery(db, step.query)
  
  // Convert instances to documents
  const convertedDocuments = instances.map(instance => {
    const converted = {}
    
    // Map fields according to configuration
    for (const mapping of step.mapping.fieldMappings) {
      const sourceValue = getNestedValue(instance, mapping.source)
      
      if (mapping.transform === 'none') {
        setNestedValue(converted, mapping.target, sourceValue)
      } else if (mapping.transform === 'lookupMapping') {
        const mappedValue = mappings[mapping.mappingKey][sourceValue]
        setNestedValue(converted, mapping.target, mappedValue)
      }
    }
    
    // Add additional fields
    for (const field of step.mapping.additionalFields) {
      if (field.transform) {
        const value = executeTransformation(field.transform, instance, field.source)
        setNestedValue(converted, field.target, value)
      } else {
        setNestedValue(converted, field.target, field.value)
      }
    }
    
    return converted
  })
  
  // Save converted documents
  for (const document of convertedDocuments) {
    await saveToDatabase(db, 'flow-documents', document)
    logger.info(`Migrated document: ${document.title}`)
    
    // Migrate step responses to sections
    await migrateStepResponsesToSections(db, instance, document, step.mapping, logger)
  }
  
  return convertedDocuments
}

async function migrateStepResponsesToSections(db, instance, document, mapping, logger) {
  const stepResponses = instance.stepResponses || []
  
  for (const response of stepResponses) {
    const section = {}
    section.documentId = document.id
    
    // Map fields according to configuration
    for (const fieldMapping of mapping.fieldMappings) {
      const sourceValue = getNestedValue(response, fieldMapping.source)
      
      if (fieldMapping.transform === 'none') {
        setNestedValue(section, fieldMapping.target, sourceValue)
      } else if (fieldMapping.transform === 'convertToRichText') {
        const richText = convertToRichText(sourceValue)
        setNestedValue(section, fieldMapping.target, richText)
      }
    }
    
    // Add additional fields
    for (const field of mapping.additionalFields) {
      if (field.transform) {
        // Find the corresponding step in the template
        const templateStep = getTemplateStep(instance.template, response.stepNumber)
        const value = executeTransformation(field.transform, templateStep, field.source)
        setNestedValue(section, field.target, value)
      } else {
        setNestedValue(section, field.target, field.value)
      }
    }
    
    await saveToDatabase(db, 'document-sections', section)
    logger.info(`Migrated section: ${section.title} for document ${document.id}`)
  }
}
```

### Transformation Functions

```javascript
function convertStepsToSectionTemplates(steps) {
  return steps.map(step => ({
    title: step.stepTitle,
    type: mappings.stepTypeToSectionType[step.stepType] || 'rich_text',
    order: step.stepNumber,
    inputConfig: {
      placeholder: step.questionText,
      isRequired: step.isRequired,
      validationRules: convertValidationRules(step.validationRules),
      minLength: step.validationRules?.minLength,
      maxLength: step.validationRules?.maxLength
    },
    aiConfig: {
      systemPrompt: step.systemPrompt,
      exampleResponse: step.examples?.[0]?.expectedOutput,
      temperature: 0.7
    },
    defaultContent: null
  }))
}

function convertValidationRules(rules) {
  if (!rules) return []
  
  const result = []
  for (const [key, value] of Object.entries(rules)) {
    if (key in mappings.validationRuleMapping) {
      const ruleConfig = mappings.validationRuleMapping[key]
      result.push({
        rule: ruleConfig.type,
        value: value,
        errorMessage: ruleConfig.errorMessage.replace('{value}', value)
      })
    }
  }
  
  return result
}

function convertToRichText(text) {
  if (!text) return null
  
  // Convert plain text to Slate.js rich text format
  return [
    {
      type: 'paragraph',
      children: [{ text }]
    }
  ]
}

function mapStepTypeToSectionType(stepType) {
  return mappings.stepTypeToSectionType[stepType] || 'rich_text'
}

function buildStepSequenceFromTemplate(template, document) {
  const sectionTemplates = template.sectionTemplates || []
  
  return sectionTemplates.map(template => ({
    stepNumber: template.order,
    sectionId: null, // Will be filled in during migration
    dependencies: template.dependencies || [],
    isCompleted: false
  }))
}
```

### Validation Functions

```javascript
async function validateMigration(db, phase, logger) {
  logger.info('Validating migration results')
  
  for (const step of phase.steps) {
    if (step.queries) {
      for (const validation of step.queries) {
        const results = {}
        
        // Execute all queries in this validation
        for (const query of validation.query.split(';')) {
          if (query.trim()) {
            const result = await executeQuery(db, query.trim())
            const match = query.match(/AS\s+(\w+)/i)
            if (match && match[1]) {
              results[match[1].toLowerCase()] = result[0][match[1].toLowerCase()]
            }
          }
        }
        
        // Evaluate assertion
        const assertionResult = evaluateAssertion(results, validation.assertion)
        if (!assertionResult.success) {
          logger.error(`Validation '${validation.name}' failed: ${assertionResult.message}`)
          throw new Error(`Validation failed: ${validation.name}`)
        } else {
          logger.info(`Validation '${validation.name}' passed`)
        }
      }
    }
  }
  
  logger.info('All validations passed')
  return true
}

function evaluateAssertion(results, assertion) {
  // Parse and evaluate the assertion expression
  // This is a simplified implementation
  const [left, operator, right] = assertion.split(/\s*(=|>|<|>=|<=|!=)\s*/)
  
  const leftValue = results[left]
  const rightValue = results[right] || parseInt(right, 10)
  
  switch (operator) {
    case '=':
      return { 
        success: leftValue === rightValue,
        message: `${left}(${leftValue}) should equal ${right}(${rightValue})`
      }
    case '>':
      return { 
        success: leftValue > rightValue,
        message: `${left}(${leftValue}) should be greater than ${right}(${rightValue})`
      }
    // Other operators would be implemented similarly
    default:
      return { success: false, message: `Unknown operator: ${operator}` }
  }
}
```

### Utility Functions

```javascript
function createLogger() {
  const logs = []
  
  return {
    info: (message) => {
      const entry = { level: 'info', message, timestamp: new Date().toISOString() }
      console.log(`[INFO] ${message}`)
      logs.push(entry)
    },
    error: (message) => {
      const entry = { level: 'error', message, timestamp: new Date().toISOString() }
      console.error(`[ERROR] ${message}`)
      logs.push(entry)
    },
    warn: (message) => {
      const entry = { level: 'warn', message, timestamp: new Date().toISOString() }
      console.warn(`[WARN] ${message}`)
      logs.push(entry)
    },
    getLogs: () => logs
  }
}

function connectToDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('./databases/multi-tenant.db', (err) => {
      if (err) reject(err)
      else resolve(db)
    })
  })
}

function closeDatabase(db) {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

function executeQuery(db, query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

function saveToDatabase(db, collection, data) {
  // Generate SQL for inserting or updating data
  // This would need more complete implementation
  const keys = Object.keys(data)
  const placeholders = keys.map(() => '?').join(', ')
  const values = keys.map(key => data[key])
  
  const sql = `INSERT INTO "${collection}" (${keys.join(', ')}) VALUES (${placeholders})`
  
  return executeQuery(db, sql, values)
}

function getNestedValue(obj, path) {
  const parts = path.split('.')
  let current = obj
  
  for (const part of parts) {
    if (current == null) return undefined
    current = current[part]
  }
  
  return current
}

function setNestedValue(obj, path, value) {
  const parts = path.split('.')
  let current = obj
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    if (!(part in current)) {
      current[part] = {}
    }
    current = current[part]
  }
  
  current[parts[parts.length - 1]] = value
}

async function createBackup(db, backupConfig) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupPath = backupConfig.location.replace('{{timestamp}}', timestamp)
  
  // Ensure directory exists
  await mkdirp(path.dirname(backupPath))
  
  // Create backup using the SQLite .backup command
  return new Promise((resolve, reject) => {
    const backupDb = new sqlite3.Database(backupPath, (err) => {
      if (err) reject(err)
      else {
        db.backup(backupDb, (err) => {
          if (err) reject(err)
          else {
            backupDb.close()
            resolve(backupPath)
          }
        })
      }
    })
  })
}

async function executeRollback(db, rollbackConfig, logger) {
  logger.warn('Executing rollback procedure')
  
  if (rollbackConfig.backupRestoreCommand) {
    // Execute the restore command
    const command = rollbackConfig.backupRestoreCommand
      .replace('{{backupFile}}', latestBackupFile)
    
    // In a real implementation, this would use child_process.exec
    logger.info(`Executing rollback command: ${command}`)
  }
  
  // Execute rollback SQL statements
  for (const statement of rollbackConfig.steps) {
    try {
      await executeQuery(db, statement)
      logger.info(`Executed rollback statement: ${statement}`)
    } catch (error) {
      logger.error(`Error executing rollback statement: ${error.message}`)
    }
  }
  
  logger.info('Rollback completed')
}

async function generateReport(logs, reportConfig) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const reportPath = reportConfig.outputFile.replace('{{timestamp}}', timestamp)
  
  // Ensure directory exists
  await mkdirp(path.dirname(reportPath))
  
  const report = {
    timestamp: new Date().toISOString(),
    logs: reportConfig.detailedLogs ? logs : logs.filter(log => log.level !== 'info'),
    summary: {
      total: logs.length,
      info: logs.filter(log => log.level === 'info').length,
      warn: logs.filter(log => log.level === 'warn').length,
      error: logs.filter(log => log.level === 'error').length
    }
  }
  
  await writeFile(reportPath, JSON.stringify(report, null, 2))
  console.log(`Migration report written to: ${reportPath}`)
}

// Entry point
executeMigration()
  .then(result => {
    if (result.success) {
      console.log('Migration completed successfully')
      process.exit(0)
    } else {
      console.error(`Migration failed: ${result.error}`)
      process.exit(1)
    }
  })
  .catch(error => {
    console.error(`Unhandled error: ${error.message}`)
    process.exit(1)
  })
```

## Implementation Notes

1. **Error Handling**: All operations should have proper error handling and logging.
2. **Transactions**: The migration should use database transactions where appropriate.
3. **Performance**: For large datasets, consider processing in batches.
4. **Validation**: Each step should include validation to ensure data integrity.
5. **Backup**: Always create a backup before starting the migration.
6. **Rollback**: Implement rollback procedures for each phase.

## Test Strategy

1. **Development Testing**: Execute on a copy of the production database.
2. **Validation Testing**: Verify all migrated data against original data.
3. **Integration Testing**: Test the migrated data with the application.
4. **Performance Testing**: Measure migration time for realistic data volumes.

## Execution Checklist

- [ ] Backup the database
- [ ] Execute the schema update
- [ ] Migrate templates
- [ ] Migrate instances to documents
- [ ] Update relationships
- [ ] Validate the migration
- [ ] Generate report
- [ ] Test with application