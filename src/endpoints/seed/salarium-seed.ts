import type { Payload } from 'payload'

export const seedSalariumCollections = async (payload: Payload): Promise<void> => {
  console.log('Seeding Salarium collections...')

  try {
    // Create a sample organization
    const organization = await payload.create({
      collection: 'organizations',
      data: {
        name: 'IntelliTrade Demo Company',
        domain: 'intellitrade.com',
        description:
          'A leading fintech company specializing in trade finance solutions using blockchain technology.',
        industry: 'technology',
        location: {
          country: 'United States',
          state: 'California',
          city: 'San Francisco',
          timezone: 'UTC-8',
        },
        subscription: {
          plan: 'professional',
          status: 'active',
          limits: {
            maxUsers: 50,
            maxTemplates: 100,
            maxInstances: 500,
            maxAIRequests: 1000,
          },
          billingEmail: 'billing@intellitrade.com',
          subscriptionStart: new Date().toISOString(),
        },
        branding: {
          primaryColor: '#0066cc',
          secondaryColor: '#004499',
        },
        settings: {
          defaultLanguage: 'en',
          allowPublicTemplates: true,
          requireApproval: false,
          enableCollaboration: true,
          enableAnalytics: true,
        },
        usage: {
          totalUsers: 1,
          totalTemplates: 0,
          totalInstances: 0,
          monthlyAIRequests: 0,
          lastActivity: new Date().toISOString(),
        },
      },
    })

    console.log('✓ Created organization:', organization.name)

    // Create job families
    const engineeringFamily = await payload.create({
      collection: 'job-families',
      data: {
        name: 'Engineering',
        description: 'Software development, technical architecture, and engineering roles',
        industryAlignment: [
          { industry: 'technology', relevance: 'high' },
          { industry: 'finance', relevance: 'medium' },
        ],
        commonSkills: [
          { skill: 'Programming', category: 'technical', importance: 'essential' },
          { skill: 'Problem Solving', category: 'analytical', importance: 'essential' },
          { skill: 'Team Collaboration', category: 'soft', importance: 'important' },
          { skill: 'Code Review', category: 'technical', importance: 'important' },
        ],
        careerProgression: [
          {
            level: 'Junior Developer',
            order: 1,
            typicalTitles: [
              { title: 'Junior Software Engineer' },
              { title: 'Software Developer I' },
            ],
            experienceRange: { minYears: 0, maxYears: 2 },
            keyResponsibilities: [
              { responsibility: 'Write clean, maintainable code' },
              { responsibility: 'Participate in code reviews' },
              { responsibility: 'Learn new technologies and frameworks' },
            ],
            requiredSkills: [
              { skill: 'Basic programming knowledge' },
              { skill: 'Version control (Git)' },
              { skill: 'Debugging skills' },
            ],
          },
          {
            level: 'Mid-Level Developer',
            order: 2,
            typicalTitles: [{ title: 'Software Engineer' }, { title: 'Software Developer II' }],
            experienceRange: { minYears: 2, maxYears: 5 },
            keyResponsibilities: [
              { responsibility: 'Design and implement features' },
              { responsibility: 'Mentor junior developers' },
              { responsibility: 'Participate in technical decisions' },
            ],
            requiredSkills: [
              { skill: 'Advanced programming skills' },
              { skill: 'System design basics' },
              { skill: 'Testing methodologies' },
            ],
          },
          {
            level: 'Senior Developer',
            order: 3,
            typicalTitles: [
              { title: 'Senior Software Engineer' },
              { title: 'Software Developer III' },
            ],
            experienceRange: { minYears: 5, maxYears: 10 },
            keyResponsibilities: [
              { responsibility: 'Lead technical projects' },
              { responsibility: 'Architect solutions' },
              { responsibility: 'Guide team technical decisions' },
            ],
            requiredSkills: [
              { skill: 'Expert programming skills' },
              { skill: 'System architecture' },
              { skill: 'Leadership abilities' },
            ],
          },
        ],
        marketData: {
          demandLevel: 'very-high',
          growthProjection: 'growing',
          competitiveness: 'very-competitive',
          lastUpdated: new Date().toISOString(),
        },
        metadata: {
          tags: [{ tag: 'technology' }, { tag: 'software' }, { tag: 'development' }],
          isActive: true,
          lastReviewed: new Date().toISOString(),
        },
      },
    })

    console.log('✓ Created job family:', engineeringFamily.name)

    // Create a department
    const engineeringDept = await payload.create({
      collection: 'departments',
      data: {
        name: 'Engineering',
        description:
          'Responsible for all software development, technical architecture, and platform engineering',
        organization: organization.id,
        departmentType: 'core',
        budget: {
          annualBudget: 2000000,
          currency: 'USD',
          budgetPeriod: 'annual',
          spentToDate: 500000,
          lastUpdated: new Date().toISOString(),
        },
        headcount: {
          currentHeadcount: 15,
          targetHeadcount: 20,
          contractors: 2,
          openPositions: 5,
          breakdown: [
            { level: 'senior', count: 5 },
            { level: 'mid-level', count: 7 },
            { level: 'junior', count: 3 },
          ],
        },
        location: {
          type: 'hybrid',
          primaryLocation: {
            country: 'United States',
            state: 'California',
            city: 'San Francisco',
            address: '123 Tech Street, Suite 400',
          },
        },
        responsibilities: [
          { responsibility: 'Develop and maintain the IntelliTrade platform', category: 'primary' },
          { responsibility: 'Implement blockchain integration features', category: 'primary' },
          { responsibility: 'Ensure system security and scalability', category: 'primary' },
          { responsibility: 'Support DevOps and infrastructure', category: 'secondary' },
        ],
        jobFamilies: [
          {
            jobFamily: engineeringFamily.id,
            relevance: 'primary',
            currentCount: 15,
            targetCount: 20,
          },
        ],
        goals: [
          {
            goal: 'Launch new blockchain verification system',
            type: 'quarterly',
            status: 'in-progress',
            targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
            progress: 65,
          },
          {
            goal: 'Improve system performance by 30%',
            type: 'annual',
            status: 'on-track',
            targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
            progress: 40,
          },
        ],
        metadata: {
          establishedDate: new Date('2020-01-01').toISOString(),
          costCenter: 'ENG-001',
          tags: [{ tag: 'technology' }, { tag: 'core-business' }, { tag: 'product-development' }],
          isActive: true,
          notes: 'Primary engineering team responsible for platform development',
        },
      },
    })

    console.log('✓ Created department:', engineeringDept.name)

    // Get the first AI provider for the template
    const aiProviders = await payload.find({
      collection: 'ai-providers',
      limit: 1,
    })

    if (aiProviders.docs.length === 0) {
      console.log('⚠ No AI providers found, skipping template creation')
      return
    }

    const defaultAIProvider = aiProviders.docs[0]

    // Create the job description template
    const jobDescriptionTemplate = await payload.create({
      collection: 'flow-templates',
      data: {
        name: 'Job Description Creation',
        slug: 'job-description-creation',
        description:
          'Create comprehensive job descriptions with AI assistance. This template guides you through defining job title, mission, scope, responsibilities, and qualifications.',
        category: 'hr',
        version: '1.0.0',
        isActive: true,
        aiProvider: defaultAIProvider?.id || 1,
        steps: [
          {
            stepNumber: 1,
            title: 'Job Title',
            description: 'Define the official job title for this position',
            questionText:
              'What is the job title for this position? (e.g., "Senior Software Engineer", "Marketing Manager")',
            systemPrompt:
              "Create a standardized, professional job title from the user's input. Follow industry conventions and ensure clarity. If the input is informal or unclear, suggest a more professional alternative while maintaining the core meaning. The title should be specific enough to understand the role but not overly complex.",
            stepType: 'text',
            isRequired: true,
            validationRules: {
              minLength: 5,
              maxLength: 100,
              customMessage: 'Job title must be between 5 and 100 characters',
            },
            examples: [
              {
                userInput: 'software dev',
                expectedOutput: 'Software Developer',
              },
              {
                userInput: 'senior marketing person',
                expectedOutput: 'Senior Marketing Manager',
              },
            ],
          },
          {
            stepNumber: 2,
            title: 'Job Mission',
            description: 'Define the primary purpose and mission of this role',
            questionText:
              'Describe the primary purpose and mission of this role. What is the main reason this position exists?',
            systemPrompt:
              'Create a compelling job mission statement following HR best practices. The mission should be clear, concise, and reflect both organizational goals and employee value. Format it as: "To [primary purpose] by [key activities] in order to [organizational impact]." Keep it between 50-150 words and make it inspiring yet realistic.',
            stepType: 'textarea',
            isRequired: true,
            validationRules: {
              minLength: 50,
              maxLength: 500,
              customMessage: 'Mission statement should be between 50 and 500 characters',
            },
            examples: [
              {
                userInput: 'Build software and fix bugs',
                expectedOutput:
                  'To develop and maintain high-quality software solutions by designing, coding, and testing applications that meet user needs and business requirements, in order to drive innovation and deliver exceptional user experiences.',
              },
            ],
          },
          {
            stepNumber: 3,
            title: 'Job Scope & Reach',
            description: 'Define the scope and organizational impact of this position',
            questionText:
              'What is the scope and reach of this position? Consider team size, budget responsibility, geographic reach, and organizational impact.',
            systemPrompt:
              "Define the job's scope including team size, budget responsibility, geographic reach, and organizational impact. Structure this as clear bullet points covering: • Team Leadership (if applicable) • Budget/Resources (if applicable) • Geographic Scope • Internal/External Stakeholders • Decision-making Authority. Be specific about numbers and scope where possible.",
            stepType: 'textarea',
            isRequired: true,
            validationRules: {
              minLength: 100,
              maxLength: 1000,
            },
            examples: [
              {
                userInput: 'Works with the development team, reports to engineering manager',
                expectedOutput:
                  '• Team Leadership: Collaborates with 5-8 development team members\n• Budget/Resources: No direct budget responsibility\n• Geographic Scope: San Francisco office with remote collaboration\n• Internal Stakeholders: Engineering Manager, Product Team, QA Team\n• External Stakeholders: Occasional client technical discussions\n• Decision-making Authority: Technical implementation decisions within assigned projects',
              },
            ],
          },
          {
            stepNumber: 4,
            title: 'Key Responsibilities',
            description: 'List the main responsibilities and duties',
            questionText:
              'List the main responsibilities and duties for this position. What will this person be doing day-to-day?',
            systemPrompt:
              'Transform the user\'s input into 5-8 clear, action-oriented responsibility statements. Start each with a strong action verb (e.g., "Develop", "Manage", "Analyze", "Lead"). Be specific about outcomes and organize by priority/importance. Each responsibility should be measurable and clearly defined. Format as a bulleted list with parallel structure.',
            stepType: 'textarea',
            isRequired: true,
            validationRules: {
              minLength: 200,
              maxLength: 1500,
            },
            examples: [
              {
                userInput: 'Code, test, debug, work with team, attend meetings',
                expectedOutput:
                  '• Develop and maintain high-quality software applications using modern programming languages and frameworks\n• Design and implement new features based on product requirements and user feedback\n• Conduct thorough testing and debugging to ensure code quality and system reliability\n• Collaborate with cross-functional teams including Product, Design, and QA to deliver integrated solutions\n• Participate in code reviews to maintain coding standards and share knowledge\n• Troubleshoot and resolve technical issues in production environments\n• Contribute to technical documentation and knowledge sharing initiatives\n• Stay current with emerging technologies and industry best practices',
              },
            ],
          },
          {
            stepNumber: 5,
            title: 'Required Qualifications',
            description: 'Define the essential qualifications and requirements',
            questionText:
              'What are the essential qualifications and requirements for this position? Include education, experience, skills, and any certifications.',
            systemPrompt:
              'Organize qualifications into clear categories: Education Requirements, Experience Requirements, Technical Skills, and Certifications/Licenses (if applicable). Distinguish between "Required" and "Preferred" qualifications. Ensure requirements are legally compliant, directly job-related, and realistic for the role level. Use specific years of experience and concrete skill requirements.',
            stepType: 'textarea',
            isRequired: true,
            validationRules: {
              minLength: 150,
              maxLength: 1200,
            },
            examples: [
              {
                userInput: 'Computer science degree, knows programming, some experience',
                expectedOutput:
                  "**Required Qualifications:**\n• Education: Bachelor's degree in Computer Science, Software Engineering, or related technical field\n• Experience: 2-4 years of professional software development experience\n• Technical Skills: Proficiency in at least one modern programming language (Java, Python, JavaScript, etc.)\n• Technical Skills: Experience with version control systems (Git)\n• Technical Skills: Understanding of software development lifecycle and agile methodologies\n\n**Preferred Qualifications:**\n• Experience with cloud platforms (AWS, Azure, or GCP)\n• Knowledge of database design and SQL\n• Familiarity with containerization technologies (Docker, Kubernetes)\n• Previous experience in fintech or financial services industry",
              },
            ],
          },
        ],
        outputTemplate: `# {{jobTitle}}

## Position Overview
{{jobMission}}

## Scope & Impact
{{jobScope}}

## Key Responsibilities
{{keyResponsibilities}}

## Qualifications
{{qualifications}}

## About {{organizationName}}
{{organizationDescription}}

---
*Generated by IntelliTrade Salarium on {{generationDate}}*`,
        metadata: {
          tags: [{ tag: 'hr' }, { tag: 'job-description' }, { tag: 'hiring' }],
          difficulty: 'beginner',
          estimatedTime: 25,
          industry: [
            { industry: 'technology' },
            { industry: 'finance' },
            { industry: 'healthcare' },
            { industry: 'manufacturing' },
          ],
          language: 'en',
        },
        usage: {
          timesUsed: 0,
          averageCompletionTime: 0,
          successRate: 0,
        },
      },
    })

    console.log('✓ Created flow template:', jobDescriptionTemplate.name)
    console.log('✅ Salarium collections seeding completed successfully!')
  } catch (error) {
    console.error('❌ Error seeding Salarium collections:', error)
    throw error
  }
}
