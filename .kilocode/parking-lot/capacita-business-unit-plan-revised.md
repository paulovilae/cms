# Capacita Business Unit - Revised Implementation Plan

## Executive Summary

Capacita is a new business unit focused on AI-powered training through gamified learning with real-time evaluation and feedback. The system features a robust "Avatar Arena" with complex character personas and RPG-style storytelling, making it applicable across multiple industries beyond customer service.

## Architecture: Core vs Business-Specific Functionality

### Core Functionality (Shared Plugin - Reusable Across Industries)

#### Shared Training Engine Plugin (`src/plugins/shared/training-engine/`)
**Purpose**: Universal training and evaluation system that can be used by any industry

##### Core Collections
```typescript
// Universal evaluation framework
TrainingEvaluations: {
  // Multi-stage evaluation system (text, voice, visual)
  // KPI framework adaptable to any industry
  // Recommendation engine
}

// Avatar system with complex personas
AvatarPersonas: {
  // Character profiles with psychological traits
  // Behavioral patterns and response styles
  // Difficulty progression and adaptation
}

// Gamification and progression
UserProgress: {
  // Points, levels, achievements system
  // Skill trees and competency tracking
  // Historical performance analytics
}

// Scenario engine for any industry
TrainingScenarios: {
  // Flexible scenario framework
  // Industry-agnostic structure
  // Narrative and context system
}
```

##### Core Services
```typescript
// Universal evaluation engine
MultiStageEvaluationService: {
  // Text sentiment and communication analysis
  // Voice tone and speech pattern analysis
  // Visual posture and gesture recognition
  // Adaptable KPI framework
}

// Avatar interaction engine
AvatarInteractionEngine: {
  // Complex persona simulation
  // Dynamic response generation
  // Emotional state management
  // Behavioral adaptation
}

// Gamification engine
GamificationEngine: {
  // Achievement and badge system
  // Progress tracking and analytics
  // Leaderboards and competitions
  // Reward distribution
}
```

### Business-Specific Functionality (Capacita Plugin)

#### Capacita Plugin (`src/plugins/business/capacita/`)
**Purpose**: Customer service training specialization using the core training engine

##### Specialized Collections
```typescript
// Customer service specific scenarios
CustomerServiceScenarios: {
  // Extends TrainingScenarios with CS-specific fields
  // Customer types, complaint categories
  // Industry-specific evaluation criteria
}

// Customer personas for training
CustomerPersonas: {
  // Different customer types and behaviors
  // Complaint scenarios and escalation paths
  // Industry-specific challenges
}
```

## Phase 2 Enhanced: Avatar Arena & RPG Gamification

### Avatar Arena Concept

#### Complex Character Personas System

##### Persona Archetypes
```typescript
interface AvatarPersona {
  // Basic Identity
  name: string;
  appearance: AvatarAppearance;
  voiceProfile: VoiceCharacteristics;
  
  // Psychological Profile
  personalityTraits: {
    agreeableness: number; // -100 to 100
    patience: number; // 0 to 100
    hostility: number; // 0 to 100
    intelligence: number; // 0 to 100
    emotionalStability: number; // 0 to 100
    trustworthiness: number; // -100 to 100 (negative = treacherous)
  };
  
  // Behavioral Patterns
  behaviorPatterns: {
    initialMood: 'calm' | 'frustrated' | 'angry' | 'hostile' | 'suspicious' | 'friendly';
    escalationTriggers: string[]; // Words/phrases that make them worse
    deEscalationResponses: string[]; // What calms them down
    manipulativeTactics: string[]; // For treacherous characters
    emotionalVolatility: number; // How quickly mood changes
  };
  
  // Difficulty and Progression
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  unlockRequirements: {
    level: number;
    previousPersonasCompleted: string[];
    skillsRequired: string[];
  };
  
  // Narrative Context
  backstory: string;
  motivations: string[];
  currentSituation: string;
  hiddenAgenda?: string; // For treacherous characters
}
```

##### Example Avatar Personas

```typescript
const avatarPersonas = [
  // Beginner Level
  {
    name: "Sarah the Reasonable Customer",
    personalityTraits: { agreeableness: 70, patience: 80, hostility: 10 },
    behaviorPatterns: {
      initialMood: 'calm',
      escalationTriggers: ['no', 'impossible', 'policy'],
      deEscalationResponses: ['understand', 'help', 'solution']
    },
    difficultyLevel: 1,
    backstory: "A busy professional who just wants her issue resolved quickly and efficiently."
  },
  
  // Intermediate Level
  {
    name: "Marcus the Skeptical Investigator",
    personalityTraits: { agreeableness: 30, patience: 40, hostility: 60, intelligence: 90 },
    behaviorPatterns: {
      initialMood: 'suspicious',
      escalationTriggers: ['standard procedure', 'policy', 'everyone'],
      deEscalationResponses: ['specifically', 'exactly', 'details']
    },
    difficultyLevel: 3,
    backstory: "A former investigative journalist who questions everything and expects detailed explanations."
  },
  
  // Advanced Level - Treacherous
  {
    name: "Victoria the Charming Manipulator",
    personalityTraits: { agreeableness: 85, patience: 70, hostility: 20, trustworthiness: -80 },
    behaviorPatterns: {
      initialMood: 'friendly',
      manipulativeTactics: ['flattery', 'false urgency', 'name dropping', 'guilt trips'],
      hiddenAgenda: "Trying to get unauthorized access or special treatment through manipulation"
    },
    difficultyLevel: 4,
    backstory: "A sophisticated manipulator who uses charm and social engineering to get what she wants."
  },
  
  // Expert Level - Hostile
  {
    name: "Derek the Explosive Executive",
    personalityTraits: { agreeableness: -50, patience: 5, hostility: 95, intelligence: 75 },
    behaviorPatterns: {
      initialMood: 'angry',
      escalationTriggers: ['wait', 'hold', 'transfer', 'supervisor'],
      emotionalVolatility: 90
    },
    difficultyLevel: 5,
    backstory: "A high-stress executive who's already had a terrible day and has zero tolerance for delays."
  }
];
```

### RPG-Style Gamification System

#### Narrative Contexts and Storylines

##### Corporate Storylines
```typescript
interface CorporateStoryline {
  title: "The Merger Crisis";
  setting: "Fortune 500 company during a major acquisition";
  context: "Customer service is overwhelmed with confused clients asking about account changes";
  chapters: [
    {
      title: "Day 1: The Announcement",
      scenarios: ["confused_existing_customers", "worried_premium_clients"],
      difficulty: "intermediate"
    },
    {
      title: "Week 2: System Integration Issues", 
      scenarios: ["angry_locked_out_users", "data_migration_complaints"],
      difficulty: "advanced"
    },
    {
      title: "Month 3: The Hostile Takeover Rumors",
      scenarios: ["panicked_investors", "manipulative_competitors"],
      difficulty: "expert"
    }
  ];
}
```

##### RPG Adventure Storylines
```typescript
interface RPGStoryline {
  title: "The Tavern Keeper's Dilemma";
  setting: "Medieval fantasy tavern in a bustling trading city";
  context: "You're the tavern keeper dealing with various adventurers, merchants, and troublemakers";
  chapters: [
    {
      title: "The Suspicious Stranger",
      scenarios: ["hooded_figure_asking_questions", "nervous_merchant_seeking_protection"],
      difficulty: "beginner",
      fantasyElements: ["magic items", "guild politics", "ancient prophecies"]
    },
    {
      title: "The Dragon's Debt",
      scenarios: ["angry_dragon_demanding_payment", "terrified_village_delegation"],
      difficulty: "advanced",
      fantasyElements: ["dragon negotiation", "magical contracts", "ancient laws"]
    },
    {
      title: "The Thieves' Guild Infiltration",
      scenarios: ["charming_rogue_with_hidden_agenda", "guild_master_testing_loyalty"],
      difficulty: "expert",
      fantasyElements: ["secret codes", "loyalty tests", "moral dilemmas"]
    }
  ];
}
```

#### Enhanced Collections for RPG System

```typescript
// Storylines and Narratives
StorylineCollection: {
  slug: 'storylines',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'genre', type: 'select', options: ['corporate', 'fantasy', 'sci-fi', 'historical', 'modern'] },
    { name: 'setting', type: 'textarea' },
    { name: 'overallContext', type: 'richText' },
    { name: 'chapters', type: 'array', fields: [
      { name: 'title', type: 'text' },
      { name: 'description', type: 'textarea' },
      { name: 'scenarios', type: 'relationship', relationTo: 'training-scenarios', hasMany: true },
      { name: 'unlockRequirements', type: 'json' },
      { name: 'rewards', type: 'json' }
    ]},
    { name: 'difficultyProgression', type: 'json' },
    { name: 'isActive', type: 'checkbox', defaultValue: true }
  ]
}

// Character Development System
CharacterProgressionCollection: {
  slug: 'character-progression',
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    { name: 'characterName', type: 'text' }, // User's character name
    { name: 'characterClass', type: 'select', options: ['diplomat', 'negotiator', 'problem-solver', 'mediator'] },
    { name: 'level', type: 'number', defaultValue: 1 },
    { name: 'experience', type: 'number', defaultValue: 0 },
    { name: 'skillPoints', type: 'json' }, // Different skill categories
    { name: 'unlockedPersonas', type: 'relationship', relationTo: 'avatar-personas', hasMany: true },
    { name: 'completedStorylines', type: 'relationship', relationTo: 'storylines', hasMany: true },
    { name: 'achievements', type: 'array', of: 'text' },
    { name: 'inventory', type: 'json' }, // RPG-style items/tools unlocked
    { name: 'reputation', type: 'json' } // Standing with different factions/groups
  ]
}

// Dynamic Scenario Generation
ScenarioTemplatesCollection: {
  slug: 'scenario-templates',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'genre', type: 'select', options: ['corporate', 'fantasy', 'sci-fi', 'historical'] },
    { name: 'situationType', type: 'select', options: ['complaint', 'inquiry', 'negotiation', 'crisis'] },
    { name: 'contextTemplate', type: 'textarea' }, // Template with variables
    { name: 'variableParameters', type: 'json' }, // What can be randomized
    { name: 'difficultyModifiers', type: 'json' },
    { name: 'evaluationCriteria', type: 'json' },
    { name: 'possibleOutcomes', type: 'array', of: 'text' }
  ]
}
```

### Enhanced Avatar Interaction System

#### Dynamic Persona Behavior Engine

```typescript
// Advanced persona simulation
class PersonaBehaviorEngine {
  // Emotional state management
  updateEmotionalState(persona: AvatarPersona, userInput: string, context: InteractionContext): EmotionalState {
    // Analyze user input for triggers
    // Update persona's current emotional state
    // Apply personality modifiers
    // Return new emotional state with reasoning
  }
  
  // Dynamic response generation
  generateResponse(persona: AvatarPersona, userInput: string, emotionalState: EmotionalState): PersonaResponse {
    // Generate contextually appropriate response
    // Apply personality filters
    // Include hidden agenda elements for treacherous characters
    // Add emotional cues and body language
  }
  
  // Difficulty adaptation
  adaptDifficulty(persona: AvatarPersona, userPerformance: PerformanceMetrics): AvatarPersona {
    // Adjust persona difficulty based on user skill
    // Modify escalation triggers
    // Change response patterns
    // Maintain character consistency
  }
}
```

#### Multi-Modal Avatar Responses

```typescript
interface PersonaResponse {
  // Verbal response
  spokenText: string;
  voiceModifiers: {
    tone: 'calm' | 'frustrated' | 'angry' | 'sarcastic' | 'manipulative';
    pace: 'slow' | 'normal' | 'fast' | 'rushed';
    volume: 'quiet' | 'normal' | 'loud' | 'shouting';
    pitch: 'low' | 'normal' | 'high' | 'strained';
  };
  
  // Visual cues
  facialExpression: 'neutral' | 'smiling' | 'frowning' | 'scowling' | 'smirking';
  bodyLanguage: 'open' | 'closed' | 'aggressive' | 'defensive' | 'manipulative';
  eyeContact: 'direct' | 'avoiding' | 'intense' | 'calculating';
  
  // Behavioral cues
  interruptionLikelihood: number; // 0-100
  patienceLevel: number; // Current patience (0-100)
  trustLevel: number; // How much they trust the user (-100 to 100)
  
  // Hidden information (for evaluation)
  hiddenThoughts: string; // What they're really thinking
  manipulationAttempt?: string; // If they're trying to manipulate
  testingBehavior?: string; // If they're testing the user
}
```

## Revised Implementation Phases

### Phase 1: Core Training Engine (Weeks 1-4)
**Priority: HIGHEST - Universal system foundation**

#### Week 1-2: Universal Evaluation Framework
- [ ] Create shared training-engine plugin structure
- [ ] Implement multi-stage evaluation system (text, voice, visual)
- [ ] Build adaptable KPI framework for any industry
- [ ] Create universal recommendation engine

#### Week 3-4: Basic Avatar System
- [ ] Implement AvatarPersonas collection with psychological profiles
- [ ] Create basic persona behavior engine
- [ ] Build simple avatar interaction system
- [ ] **Test Script**: Evaluate interactions with 3 different persona types

### Phase 2: Avatar Arena & RPG System (Weeks 5-10)
**Priority: HIGH - The core differentiator**

#### Week 5-6: Complex Persona System
- [ ] Implement advanced personality trait system
- [ ] Create behavioral pattern engine with triggers and responses
- [ ] Build treacherous character logic with hidden agendas
- [ ] Develop emotional state management system
- [ ] **Test Script**: Verify persona consistency across 20+ interactions

#### Week 7-8: RPG Gamification Engine
- [ ] Implement Storylines and CharacterProgression collections
- [ ] Create narrative context system for scenarios
- [ ] Build chapter-based progression with unlocks
- [ ] Develop skill trees and character classes
- [ ] **Test Script**: Complete full storyline progression from beginner to expert

#### Week 9-10: Dynamic Content Generation
- [ ] Implement ScenarioTemplates for procedural generation
- [ ] Create context-aware scenario variations
- [ ] Build difficulty adaptation algorithms
- [ ] Develop multi-genre content system (corporate, fantasy, sci-fi)
- [ ] **Test Script**: Generate 50 unique scenarios from 5 templates

### Phase 3: Capacita Specialization (Weeks 11-14)
**Priority: MEDIUM - Business-specific implementation**

#### Week 11-12: Customer Service Specialization
- [ ] Create Capacita plugin using core training engine
- [ ] Implement customer service specific personas and scenarios
- [ ] Build industry-specific evaluation criteria
- [ ] Create customer service storylines and contexts

#### Week 13-14: Integration and Polish
- [ ] Integrate with existing AI Management Plugin
- [ ] Create comprehensive admin interface
- [ ] Build analytics and reporting dashboard
- [ ] **Test Script**: End-to-end customer service training journey

## Enhanced Quality Assurance

### Avatar Arena Test Scripts

#### Persona Consistency Test
```typescript
const testPersonaConsistency = async () => {
  const persona = await getPersona('Derek the Explosive Executive');
  const testInputs = [
    "I need to speak to your manager",
    "Can you please hold for a moment?",
    "I understand your frustration",
    "Let me transfer you to another department"
  ];
  
  for (const input of testInputs) {
    const response = await personaBehaviorEngine.generateResponse(persona, input);
    assert(response.voiceModifiers.tone === 'angry' || response.voiceModifiers.tone === 'frustrated');
    assert(response.patienceLevel < 30, "Derek should have low patience");
    assert(response.interruptionLikelihood > 70, "Derek should frequently interrupt");
  }
};
```

#### Treacherous Character Test
```typescript
const testTreacherousCharacter = async () => {
  const persona = await getPersona('Victoria the Charming Manipulator');
  const response = await personaBehaviorEngine.generateResponse(
    persona, 
    "I'm sorry, but I can't do that for you"
  );
  
  assert(response.facialExpression === 'smiling', "Should maintain charming facade");
  assert(response.manipulationAttempt, "Should attempt manipulation");
  assert(response.hiddenThoughts !== response.spokenText, "Hidden agenda should differ from speech");
};
```

#### RPG Storyline Progression Test
```typescript
const testStorylineProgression = async () => {
  const user = await createTestUser();
  const storyline = await getStoryline('The Tavern Keeper\'s Dilemma');
  
  // Test chapter unlocking
  const chapter1 = storyline.chapters[0];
  assert(await canAccessChapter(user, chapter1), "Should access first chapter");
  
  const chapter2 = storyline.chapters[1];
  assert(!await canAccessChapter(user, chapter2), "Should not access locked chapter");
  
  // Complete chapter 1
  await completeChapter(user, chapter1);
  assert(await canAccessChapter(user, chapter2), "Should unlock next chapter after completion");
};
```

## Success Metrics

### Core System Metrics
- **Persona Realism**: > 90% user belief in character authenticity
- **Emotional Consistency**: < 5% personality contradictions across interactions
- **Adaptation Accuracy**: 85% appropriate difficulty adjustments
- **Cross-Industry Applicability**: Successfully deployed in 3+ different industries

### RPG Engagement Metrics
- **Story Completion Rate**: > 75% chapter completion rate
- **Character Progression**: Average 3+ skill improvements per user
- **Replay Value**: > 40% users replay scenarios with different approaches
- **Narrative Immersion**: > 8/10 user engagement scores

### Business Impact
- **Training Effectiveness**: 40% improvement in real-world performance
- **User Retention**: > 80% monthly active user retention
- **Scalability**: Support for 10,000+ concurrent users
- **Market Expansion**: Successful deployment in 5+ industries within 12 months

This revised plan creates a much more robust and engaging system with the Avatar Arena concept and RPG-style gamification, while maintaining clear separation between core reusable functionality and business-specific implementations.