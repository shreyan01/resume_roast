'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle } from 'lucide-react'
import type { KeywordAnalysis as KeywordAnalysisType } from '@/types'

interface Props {
  analysis?: KeywordAnalysisType
}

export function KeywordAnalysis({ analysis }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Keyword Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Industry</h3>
            <Badge variant="outline">{analysis?.industry || 'Loading...'}</Badge>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Found Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis?.foundKeywords.map((keyword) => (
                  <Badge key={keyword} variant="default">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <XCircle className="h-4 w-4 text-red-500" />
                Missing Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis?.missingKeywords.map((keyword) => (
                  <Badge key={keyword} variant="destructive">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
