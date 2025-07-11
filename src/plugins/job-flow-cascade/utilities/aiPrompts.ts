import { GenerationType } from '../types'

// Define string literal types for backwards compatibility
type GenerationTypeString = 'section' | 'alternatives' | 'cascade'

/**
 * Build system prompt for section generation
 * @param context Document context
 * @param sectionTitle Title of the section to generate
 * @param stylePreference Style preference (formal, casual, etc.)
 * @returns System prompt for AI
 */
export function buildSectionGenerationPrompt(
  context: Record<string, any>,
  sectionTitle: string,
  stylePreference: string = 'formal',
): string {
  // Get relevant context
  const documentTitle = context.title || 'Document'
  const documentType = context.type || 'Job Description'
  const previousSections = context.previousSections || []

  // Build the prompt
  let prompt = `You are a professional content writer specializing in creating ${documentType} content.
  
Task: Generate content for the "${sectionTitle}" section of a ${documentType} titled "${documentTitle}".

Style: ${stylePreference}

`

  // Add context from previous sections if available
  if (previousSections.length > 0) {
    prompt += `\nContext from previous sections:\n`
    previousSections.forEach((section: any) => {
      prompt += `\n## ${section.title}\n${section.content}\n`
    })
  }

  // Add specific guidance based on section type
  switch (sectionTitle.toLowerCase()) {
    case 'job summary':
    case 'position summary':
      prompt += `
Create a concise overview of the position that provides candidates with a clear understanding of the role and its importance to the organization. Focus on key responsibilities, required skills, and how the role contributes to team or company goals.
`
      break
    case 'responsibilities':
    case 'job responsibilities':
    case 'key responsibilities':
      prompt += `
Create a comprehensive list of 6-10 key responsibilities for this position. Each responsibility should:
- Start with an action verb (e.g., "Develop", "Manage", "Coordinate")
- Be specific and measurable where possible
- Provide context for why the task matters
- Be realistic for someone in this role to accomplish
`
      break
    case 'qualifications':
    case 'requirements':
    case 'skills and qualifications':
      prompt += `
Create a structured list of qualifications and skills needed for this role, divided into:

1. Required Qualifications:
   - Education requirements
   - Years of experience
   - Technical skills
   - Certifications

2. Preferred Qualifications:
   - Additional skills that would be beneficial
   - Advanced certifications or education
   - Specialized experience

3. Soft Skills:
   - Communication abilities
   - Teamwork
   - Problem-solving
   - Adaptability
`
      break
    case 'benefits':
    case 'benefits and perks':
      prompt += `
Create an engaging list of benefits and perks offered with this position. Include:
- Health insurance and wellness programs
- Retirement benefits
- PTO and work-life balance offerings
- Professional development opportunities
- Unique company perks that differentiate the organization
`
      break
    default:
      prompt += `
Create clear, engaging, and professional content for this section that:
- Is appropriate for a ${documentType}
- Uses professional language in a ${stylePreference} tone
- Is well-structured with bullet points where appropriate
- Avoids jargon or overly technical language
- Is between 100-200 words
`
  }

  prompt += `\nPlease provide only the content for the "${sectionTitle}" section without any additional commentary.`

  return prompt
}

/**
 * Build prompt for alternative content generation
 * @param context Document context
 * @param sectionTitle Section title
 * @param currentContent Current content
 * @param numAlternatives Number of alternatives to generate
 * @returns Prompt for alternative content
 */
export function buildAlternativesPrompt(
  context: Record<string, any>,
  sectionTitle: string,
  currentContent: any,
  numAlternatives: number = 3,
): string {
  let prompt = `You are a professional content writer specializing in ${context.type || 'document'} content.

Task: Generate ${numAlternatives} alternative versions of the following "${sectionTitle}" section.

Current content:
${JSON.stringify(currentContent)}

Please generate ${numAlternatives} distinct alternatives that:
- Maintain the same key information
- Vary in tone and structure
- Range from concise to detailed
- Offer different organizational approaches

Return ONLY the alternative versions without any additional commentary.`

  return prompt
}

/**
 * Build prompt for full document cascade generation
 * @param context Document context
 * @param sections Section titles
 * @param stylePreference Style preference
 * @returns Prompt for cascade generation
 */
export function buildCascadePrompt(
  context: Record<string, any>,
  sections: string[],
  stylePreference: string = 'formal',
): string {
  const documentTitle = context.title || 'Document'
  const documentType = context.type || 'Job Description'

  let prompt = `You are a professional content writer specializing in creating ${documentType} content.

Task: Generate complete content for a ${documentType} titled "${documentTitle}" with the following sections:
${sections.map((section) => `- ${section}`).join('\n')}

Style: ${stylePreference}

The content should:
- Be appropriate for a professional ${documentType}
- Use clear, engaging language in a ${stylePreference} tone
- Be well-structured with bullet points where appropriate
- Include all necessary information for each section
- Avoid repetition between sections

Format the response as a JSON object with section titles as keys and content arrays as values.
`

  return prompt
}

/**
 * Mock AI response for development/testing
 * @param prompt The prompt sent to the AI
 * @param type The type of generation being performed
 * @returns Simulated AI response
 */
export function simulateAiResponse(prompt: string, type: GenerationType): any {
  // For development/testing, generate mock responses based on generation type
  // Convert enum to string for switch statement comparison
  const typeStr = type.toString()

  switch (typeStr) {
    case 'section':
      return {
        content: [
          {
            type: 'p',
            children: [
              {
                text: 'This is a simulated response for section generation. In a production environment, this would be actual AI-generated content based on the provided prompt and context.',
              },
            ],
          },
          {
            type: 'p',
            children: [
              {
                text: 'The job requires a highly motivated individual with excellent communication skills and the ability to work in a fast-paced environment.',
              },
            ],
          },
          {
            type: 'p',
            children: [
              {
                text: 'The ideal candidate will have 3-5 years of experience in a similar role, with a proven track record of success.',
              },
            ],
          },
        ],
      }

    case 'alternatives':
      // Return array of alternative content options
      return {
        alternatives: [
          // Alternative 1
          [
            {
              type: 'p',
              children: [
                {
                  text: 'Alternative 1: A dynamic professional with strong problem-solving abilities and excellent communication skills is needed for this challenging role.',
                },
              ],
            },
          ],
          // Alternative 2
          [
            {
              type: 'p',
              children: [
                {
                  text: 'Alternative 2: We seek an experienced candidate who excels in fast-paced environments and demonstrates exceptional attention to detail.',
                },
              ],
            },
          ],
          // Alternative 3
          [
            {
              type: 'p',
              children: [
                {
                  text: 'Alternative 3: The perfect candidate combines technical expertise with soft skills, bringing both knowledge and teamwork to our organization.',
                },
              ],
            },
          ],
        ],
      }

    case 'cascade':
      // Return complete document with all sections
      return {
        sections: {
          'Job Summary': [
            {
              type: 'p',
              children: [
                {
                  text: 'This position offers an exciting opportunity to contribute to our growing team. The role involves a mix of strategic planning and hands-on implementation.',
                },
              ],
            },
          ],
          Responsibilities: [
            {
              type: 'ul',
              children: [
                {
                  type: 'li',
                  children: [{ text: 'Develop and implement strategic initiatives' }],
                },
                {
                  type: 'li',
                  children: [{ text: 'Collaborate with cross-functional teams' }],
                },
                {
                  type: 'li',
                  children: [{ text: 'Analyze data and generate insights' }],
                },
              ],
            },
          ],
          Qualifications: [
            {
              type: 'p',
              children: [{ text: 'Required Skills:' }],
            },
            {
              type: 'ul',
              children: [
                {
                  type: 'li',
                  children: [{ text: "Bachelor's degree in relevant field" }],
                },
                {
                  type: 'li',
                  children: [{ text: '3+ years of experience in similar role' }],
                },
              ],
            },
          ],
        },
      }

    default:
      return {
        error: 'Unknown generation type',
      }
  }
}

/**
 * Format response based on specified preferences
 * @param content Content to format
 * @param formatPreferences Formatting preferences
 * @returns Formatted content
 */
export function formatResponseContent(
  content: any,
  formatPreferences: Record<string, any> = {},
): any {
  // In a real implementation, this would apply formatting based on preferences
  // For now, we just return the content unchanged
  return content
}

/**
 * Process content with style/format transformation
 * @param content Content to process
 * @param stylePreference Style preference
 * @returns Processed content
 */
export function processContentWithStyle(content: any, stylePreference: string): any {
  // This would apply style transformations based on preference
  // For now, we just return the content unchanged
  return content
}
