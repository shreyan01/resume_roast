'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { CheckCircle2, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react'
import type { FormatAnalysis as FormatAnalysisType } from '@/types'

interface Props {
  analysis?: FormatAnalysisType
}

export function FormatAnalysis({ analysis }: Props) {
  const getIcon = (type: 'critical' | 'warning' | 'info') => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'info':
        return <AlertCircle className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Format Analysis
          <span className={`text-sm px-3 py-1 rounded-full ${
            analysis?.overallFormat === 'good' 
              ? 'bg-green-100 text-green-700'
              : analysis?.overallFormat === 'needs_improvement'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {analysis?.overallFormat?.replace('_', ' ').toUpperCase() || 'ANALYZING'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Format Issues */}
          <div className="space-y-4">
            {analysis?.issues.map((issue, index) => (
              <Alert key={index} variant={
                issue.type === 'critical' ? 'destructive' : 
                issue.type === 'warning' ? 'default' : 'default'
              }>
                {getIcon(issue.type)}
                <AlertTitle className="ml-2">
                  {issue.section && `${issue.section}: `}{issue.message}
                </AlertTitle>
              </Alert>
            ))}
          </div>

          {/* Positives */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              What You&apos;re Doing Right
            </h3>
            <ul className="space-y-2">
              {analysis?.positives.map((positive, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                  <span className="text-green-700">{positive}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
