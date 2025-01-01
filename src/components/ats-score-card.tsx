'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { ATSScore } from '@/types'

interface Props {
  score?: ATSScore
}

export function ATSScoreCard({ score }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ATS Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <span className="text-5xl font-bold text-red-600">
              {score?.overall || 0}%
            </span>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Formatting', value: score?.breakdown.formatting || 0 },
              { label: 'Keywords', value: score?.breakdown.keywords || 0 },
              { label: 'Content', value: score?.breakdown.content || 0 }
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <Progress value={item.value} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}