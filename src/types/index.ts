// Resume Types
export interface Resume {
  id: string
  userId: string
  fileName: string
  fileUrl: string
  uploadedAt: Date
  status: 'processing' | 'roasting' | 'completed' | 'failed'
}

// Roast Types
export interface Roast {
  id: string
  resumeId: string
  sections: RoastSection[]
  overallRoast: string
  timestamp: Date
  userReaction?: UserReaction
}

export interface RoastSection {
  title: string
  roast: string
  advice: string[]
}

export type UserReaction = 'hurt' | 'fair' | 'harder' | null

// Premium Analysis Types
export interface PremiumAnalysis {
  resumeId: string
  atsScore: ATSScore
  keywordAnalysis: KeywordAnalysis
  formatAnalysis: FormatAnalysis
  improvementSuggestions: ImprovementSuggestion[]
}

export interface ATSScore {
  overall: number
  breakdown: {
    formatting: number
    keywords: number
    content: number
  }
}

export interface KeywordAnalysis {
  industry: string
  foundKeywords: string[]
  missingKeywords: string[]
  keywordScore: number
}

export interface FormatAnalysis {
  issues: FormatIssue[]
  positives: string[]
  overallFormat: 'good' | 'needs_improvement' | 'poor'
}

export interface FormatIssue {
  type: 'critical' | 'warning' | 'info'
  message: string
  section?: string
}

export interface ImprovementSuggestion {
  section: string
  suggestions: string[]
  priority: 'high' | 'medium' | 'low'
}

// User Types
export interface User {
  id: string
  email: string
  name?: string
  hasPremiumAccess: boolean
  createdAt: Date
}

// Payment Types
export interface Payment {
  id: string
  userId: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  createdAt: Date
}
