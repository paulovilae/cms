/**
 * Validation helper functions for the Job Description Workflow
 */

// Minimum character length for different sections
const MIN_LENGTHS = {
  jobTitle: 5,
  jobMission: 20,
  jobScope: 50,
  responsibilities: 50,
  qualifications: 50,
}

// Maximum character length for different sections
const MAX_LENGTHS = {
  jobTitle: 100,
  jobMission: 500,
  jobScope: 1500,
  responsibilities: 2000,
  qualifications: 2000,
}

/**
 * Validates job title input
 */
export const validateJobTitle = (title: string): string | null => {
  if (!title || title.trim().length === 0) {
    return 'Job title is required'
  }

  if (title.trim().length < MIN_LENGTHS.jobTitle) {
    return `Job title must be at least ${MIN_LENGTHS.jobTitle} characters`
  }

  if (title.trim().length > MAX_LENGTHS.jobTitle) {
    return `Job title cannot exceed ${MAX_LENGTHS.jobTitle} characters`
  }

  return null // No error
}

/**
 * Validates job mission input
 */
export const validateJobMission = (mission: string): string | null => {
  if (!mission || mission.trim().length === 0) {
    return 'Job mission is required'
  }

  if (mission.trim().length < MIN_LENGTHS.jobMission) {
    return `Job mission must be at least ${MIN_LENGTHS.jobMission} characters`
  }

  if (mission.trim().length > MAX_LENGTHS.jobMission) {
    return `Job mission cannot exceed ${MAX_LENGTHS.jobMission} characters`
  }

  return null // No error
}

/**
 * Validates job scope input
 */
export const validateJobScope = (scope: string): string | null => {
  if (!scope || scope.trim().length === 0) {
    return 'Job scope is required'
  }

  if (scope.trim().length < MIN_LENGTHS.jobScope) {
    return `Job scope must be at least ${MIN_LENGTHS.jobScope} characters`
  }

  if (scope.trim().length > MAX_LENGTHS.jobScope) {
    return `Job scope cannot exceed ${MAX_LENGTHS.jobScope} characters`
  }

  return null // No error
}

/**
 * Validates responsibilities input
 */
export const validateResponsibilities = (responsibilities: string): string | null => {
  if (!responsibilities || responsibilities.trim().length === 0) {
    return 'Responsibilities are required'
  }

  if (responsibilities.trim().length < MIN_LENGTHS.responsibilities) {
    return `Responsibilities must be at least ${MIN_LENGTHS.responsibilities} characters`
  }

  if (responsibilities.trim().length > MAX_LENGTHS.responsibilities) {
    return `Responsibilities cannot exceed ${MAX_LENGTHS.responsibilities} characters`
  }

  // Check if there are at least 3 bullet points
  const bulletPoints = responsibilities.match(/•/g) || []
  if (bulletPoints.length < 3) {
    return 'Please include at least 3 bullet points for responsibilities'
  }

  return null // No error
}

/**
 * Validates qualifications input
 */
export const validateQualifications = (qualifications: string): string | null => {
  if (!qualifications || qualifications.trim().length === 0) {
    return 'Qualifications are required'
  }

  if (qualifications.trim().length < MIN_LENGTHS.qualifications) {
    return `Qualifications must be at least ${MIN_LENGTHS.qualifications} characters`
  }

  if (qualifications.trim().length > MAX_LENGTHS.qualifications) {
    return `Qualifications cannot exceed ${MAX_LENGTHS.qualifications} characters`
  }

  // Check if there are required and preferred sections
  if (!qualifications.includes('**Required Qualifications:**')) {
    return 'Please include a "Required Qualifications" section'
  }

  return null // No error
}

/**
 * Validates a step based on step number
 */
export const validateStepInput = (stepNumber: number, content: string): string | null => {
  switch (stepNumber) {
    case 1:
      return validateJobTitle(content)
    case 2:
      return validateJobMission(content)
    case 3:
      return validateJobScope(content)
    case 4:
      return validateResponsibilities(content)
    case 5:
      return validateQualifications(content)
    default:
      return null
  }
}

/**
 * Checks if the document is complete (all required sections are filled)
 */
export const isDocumentComplete = (stepResponses: any[]): boolean => {
  if (!stepResponses || stepResponses.length === 0) {
    return false
  }

  // Check if all steps are completed
  for (let i = 1; i <= 5; i++) {
    const step = stepResponses.find((step) => step.stepNumber === i)
    if (!step || !step.isCompleted || !step.aiGeneratedContent.trim()) {
      return false
    }
  }

  return true
}
