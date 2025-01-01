'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Zap, Lock } from 'lucide-react'
import { ATSScoreCard } from './ats-score-card'
import { KeywordAnalysis } from './keyword-analysis'
import { FormatAnalysis } from './format-analysis'
import { ImprovementSuggestions } from './improvement-suggestions'
import type { PremiumAnalysis } from '@/types'

export default function PremiumInsights() {
  const [isPurchased, setIsPurchased] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [analysis] = useState<PremiumAnalysis | null>(null)

  const handlePurchase = async () => {
    setIsLoading(true)
    try {
      // TODO: Implement Stripe payment
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate payment
      setIsPurchased(true)
    } catch (error) {
      console.error('Payment failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isPurchased) {
    return (
      <div className="text-center py-12">
        <Lock className="h-12 w-12 mx-auto mb-6 text-red-500" />
        <h2 className="text-2xl font-bold mb-4">Unlock Premium Insights</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Get detailed ATS scoring, keyword analysis, and professional improvement suggestions.
        </p>
        <Button 
          onClick={handlePurchase} 
          disabled={isLoading}
          className="bg-red-600 hover:bg-red-700"
        >
          <Zap className="mr-2 h-4 w-4" />
          {isLoading ? 'Processing...' : 'Unlock for $1'}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <ATSScoreCard score={analysis?.atsScore} />
        <KeywordAnalysis analysis={analysis?.keywordAnalysis} />
      </div>
      <FormatAnalysis analysis={analysis?.formatAnalysis} />
      <ImprovementSuggestions suggestions={analysis?.improvementSuggestions} />
    </div>
  )
}
