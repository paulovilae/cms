import { getPayload } from 'payload'
import configPromise from '@payload-config'
import {
  convertSalariumInstanceToDocument,
  convertSalariumStepToSection,
  convertSalariumTemplateToGeneric,
  validateMigrationData,
  convertRichTextContent,
} from '../../../src/plugins/job-flow-cascade/utilities/migrationMappers'

/**
 * Salarium to Generic Job Flow Cascade Migration Script
 *
 * This script migrates data from Salarium-specific collections to the generic
 * Job Flow Cascade collections with enhanced schema support.
 */

interface MigrationOptions {
  dryRun?: boolean
  batchSize?: number
  skipValidation?: boolean
  backupData?: boolean
}

interface MigrationResult {
  success: boolean
  migratedDocuments: number
  migratedSections: number
  migratedTemplates: number
  errors: string[]
  warnings: string[]
}

export class SalariumToGenericMigration {
  private payload: any
  private options: MigrationOptions
  private result: MigrationResult

  constructor(options: MigrationOptions = {}) {
    this.options = {
      dryRun: false,
      batchSize: 50,
      skipValidation: false,
      backupData: true,
      ...options,
    }

    this.result = {
      success: false,
      migratedDocuments: 0,
      migratedSections: 0,
      migratedTemplates: 0,
      errors: [],
      warnings: [],
    }
  }

  async initialize() {
    try {
      this.payload = await getPayload({ config: configPromise })
      console.log('✓ Payload initialized successfully')
    } catch (error) {
      throw new Error(`Failed to initialize Payload: ${error}`)
    }
  }

  async run(): Promise<MigrationResult> {
    console.log('🚀 Starting Salarium to Generic Job Flow Cascade Migration')
    console.log(`Options: ${JSON.stringify(this.options, null, 2)}`)

    try {
      await this.initialize()

      if (this.options.backupData) {
        await this.createBackup()
      }

      // Phase 1: Migrate Templates (when templates are enabled)
      // await this.migrateTemplates()

      // Phase 2: Migrate Flow Instances to Flow Documents
      await this.migrateFlowInstances()

      // Phase 3: Migrate Step Responses to Document Sections
      await this.migrateStepResponses()

      // Phase 4: Update Generation History
      await this.updateGenerationHistory()

      // Phase 5: Validate Migration
      if (!this.options.skipValidation) {
        await this.validateMigration()
      }

      this.result.success = this.result.errors.length === 0

      console.log('✅ Migration completed successfully')
      console.log(
        `Migrated: ${this.result.migratedDocuments} documents, ${this.result.migratedSections} sections`,
      )

      return this.result
    } catch (error) {
      this.result.errors.push(`Migration failed: ${error}`)
      console.error('❌ Migration failed:', error)
      return this.result
    }
  }

  private async createBackup() {
    console.log('📦 Creating data backup...')

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const backupPath = `./backups/salarium-migration-${timestamp}`

      // In a real implementation, you would export data to files
      // For now, we'll just log the backup creation
      console.log(`✓ Backup would be created at: ${backupPath}`)

      this.result.warnings.push(`Backup functionality not fully implemented`)
    } catch (error) {
      this.result.warnings.push(`Backup creation failed: ${error}`)
    }
  }

  private async migrateFlowInstances() {
    console.log('📄 Migrating Flow Instances to Flow Documents...')

    try {
      // Get all Salarium flow instances
      const flowInstances = await this.payload.find({
        collection: 'flow-instances',
        where: {
          businessUnit: {
            equals: 'salarium',
          },
        },
        limit: this.options.batchSize,
      })

      console.log(`Found ${flowInstances.docs.length} flow instances to migrate`)

      for (const instance of flowInstances.docs) {
        try {
          // Convert Salarium instance to generic document
          const documentData = convertSalariumInstanceToDocument(instance)

          if (!this.options.skipValidation) {
            const isValid = validateMigrationData(instance, documentData)
            if (!isValid) {
              this.result.errors.push(`Validation failed for instance ${instance.id}`)
              continue
            }
          }

          if (!this.options.dryRun) {
            // Create the new flow document
            const newDocument = await this.payload.create({
              collection: 'flow-documents',
              data: documentData,
            })

            console.log(`✓ Migrated instance ${instance.id} to document ${newDocument.id}`)
            this.result.migratedDocuments++
          } else {
            console.log(`[DRY RUN] Would migrate instance ${instance.id}`)
            this.result.migratedDocuments++
          }
        } catch (error) {
          this.result.errors.push(`Failed to migrate instance ${instance.id}: ${error}`)
        }
      }
    } catch (error) {
      this.result.errors.push(`Failed to migrate flow instances: ${error}`)
    }
  }

  private async migrateStepResponses() {
    console.log('📝 Migrating Step Responses to Document Sections...')

    try {
      // Get all flow documents that were migrated
      const flowDocuments = await this.payload.find({
        collection: 'flow-documents',
        where: {
          'metadata.migratedFrom': {
            equals: 'salarium-flow-instance',
          },
        },
        limit: this.options.batchSize,
      })

      for (const document of flowDocuments.docs) {
        try {
          const originalInstanceId = document.metadata?.originalId
          if (!originalInstanceId) {
            this.result.warnings.push(`Document ${document.id} missing original instance ID`)
            continue
          }

          // Get the original flow instance to access step responses
          const originalInstance = await this.payload.findByID({
            collection: 'flow-instances',
            id: originalInstanceId,
          })

          if (!originalInstance || !originalInstance.stepResponses) {
            this.result.warnings.push(`No step responses found for instance ${originalInstanceId}`)
            continue
          }

          // Convert each step response to a document section
          for (let i = 0; i < originalInstance.stepResponses.length; i++) {
            const stepResponse = originalInstance.stepResponses[i]

            const sectionData = convertSalariumStepToSection(stepResponse, document.id, i)

            // Convert rich text content
            if (sectionData.content) {
              sectionData.content = convertRichTextContent(sectionData.content)
            }

            if (!this.options.dryRun) {
              const newSection = await this.payload.create({
                collection: 'document-sections',
                data: sectionData,
              })

              console.log(`✓ Created section ${newSection.id} for document ${document.id}`)
              this.result.migratedSections++
            } else {
              console.log(`[DRY RUN] Would create section for document ${document.id}`)
              this.result.migratedSections++
            }
          }
        } catch (error) {
          this.result.errors.push(
            `Failed to migrate sections for document ${document.id}: ${error}`,
          )
        }
      }
    } catch (error) {
      this.result.errors.push(`Failed to migrate step responses: ${error}`)
    }
  }

  private async updateGenerationHistory() {
    console.log('📚 Updating Generation History relationships...')

    try {
      // Get all generation history entries for Salarium
      const historyEntries = await this.payload.find({
        collection: 'generation-history',
        where: {
          'metadata.businessUnit': {
            equals: 'salarium',
          },
        },
        limit: this.options.batchSize,
      })

      for (const entry of historyEntries.docs) {
        try {
          // Find the new document ID based on the original instance ID
          const newDocument = await this.payload.find({
            collection: 'flow-documents',
            where: {
              'metadata.originalId': {
                equals: entry.documentId,
              },
            },
            limit: 1,
          })

          if (newDocument.docs.length === 0) {
            this.result.warnings.push(`No migrated document found for history entry ${entry.id}`)
            continue
          }

          // Find the new section ID based on the step response order
          const newSections = await this.payload.find({
            collection: 'document-sections',
            where: {
              documentId: {
                equals: newDocument.docs[0].id,
              },
            },
            sort: 'order',
          })

          // Update the generation history entry with new IDs
          if (!this.options.dryRun) {
            await this.payload.update({
              collection: 'generation-history',
              id: entry.id,
              data: {
                documentId: newDocument.docs[0].id,
                sectionId: newSections.docs[0]?.id || entry.sectionId,
                metadata: {
                  ...entry.metadata,
                  migrationUpdated: new Date().toISOString(),
                },
              },
            })

            console.log(`✓ Updated generation history entry ${entry.id}`)
          } else {
            console.log(`[DRY RUN] Would update generation history entry ${entry.id}`)
          }
        } catch (error) {
          this.result.errors.push(`Failed to update generation history entry ${entry.id}: ${error}`)
        }
      }
    } catch (error) {
      this.result.errors.push(`Failed to update generation history: ${error}`)
    }
  }

  private async validateMigration() {
    console.log('🔍 Validating migration results...')

    try {
      // Check that all migrated documents have sections
      const migratedDocuments = await this.payload.find({
        collection: 'flow-documents',
        where: {
          'metadata.migratedFrom': {
            equals: 'salarium-flow-instance',
          },
        },
      })

      for (const document of migratedDocuments.docs) {
        const sections = await this.payload.find({
          collection: 'document-sections',
          where: {
            documentId: {
              equals: document.id,
            },
          },
        })

        if (sections.docs.length === 0) {
          this.result.warnings.push(`Document ${document.id} has no sections`)
        }
      }

      // Check data integrity
      const totalDocuments = migratedDocuments.totalDocs
      const totalSections = await this.payload.find({
        collection: 'document-sections',
        where: {
          documentId: {
            in: migratedDocuments.docs.map((doc) => doc.id),
          },
        },
      })

      console.log(
        `✓ Validation complete: ${totalDocuments} documents, ${totalSections.totalDocs} sections`,
      )
    } catch (error) {
      this.result.errors.push(`Validation failed: ${error}`)
    }
  }

  async rollback() {
    console.log('🔄 Rolling back migration...')

    try {
      if (!this.options.dryRun) {
        // Delete migrated documents
        const migratedDocuments = await this.payload.find({
          collection: 'flow-documents',
          where: {
            'metadata.migratedFrom': {
              equals: 'salarium-flow-instance',
            },
          },
        })

        for (const document of migratedDocuments.docs) {
          // Delete sections first
          const sections = await this.payload.find({
            collection: 'document-sections',
            where: {
              documentId: {
                equals: document.id,
              },
            },
          })

          for (const section of sections.docs) {
            await this.payload.delete({
              collection: 'document-sections',
              id: section.id,
            })
          }

          // Delete document
          await this.payload.delete({
            collection: 'flow-documents',
            id: document.id,
          })
        }

        console.log('✓ Rollback completed')
      } else {
        console.log('[DRY RUN] Rollback would delete migrated data')
      }
    } catch (error) {
      console.error('❌ Rollback failed:', error)
      throw error
    }
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2)
  const options: MigrationOptions = {}

  // Parse command line arguments
  args.forEach((arg) => {
    if (arg === '--dry-run') options.dryRun = true
    if (arg === '--skip-validation') options.skipValidation = true
    if (arg === '--no-backup') options.backupData = false
    if (arg.startsWith('--batch-size=')) {
      options.batchSize = parseInt(arg.split('=')[1])
    }
  })

  const migration = new SalariumToGenericMigration(options)

  migration
    .run()
    .then((result) => {
      console.log('\n📊 Migration Summary:')
      console.log(`Success: ${result.success}`)
      console.log(`Documents: ${result.migratedDocuments}`)
      console.log(`Sections: ${result.migratedSections}`)
      console.log(`Templates: ${result.migratedTemplates}`)
      console.log(`Errors: ${result.errors.length}`)
      console.log(`Warnings: ${result.warnings.length}`)

      if (result.errors.length > 0) {
        console.log('\n❌ Errors:')
        result.errors.forEach((error) => console.log(`  - ${error}`))
      }

      if (result.warnings.length > 0) {
        console.log('\n⚠️  Warnings:')
        result.warnings.forEach((warning) => console.log(`  - ${warning}`))
      }

      process.exit(result.success ? 0 : 1)
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error)
      process.exit(1)
    })
}

export default SalariumToGenericMigration
