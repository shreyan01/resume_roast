'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion'
import { ArrowRight, Zap } from 'lucide-react'
import type { ImprovementSuggestion } from '@/types'

interface Props {
  suggestions?: ImprovementSuggestion[]
}

export function ImprovementSuggestions({ suggestions }: Props) {
  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50'
      case 'low':
        return 'text-green-600 bg-green-50'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-red-500" />
          Improvement Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="space-y-4">
          {suggestions?.map((suggestion, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border rounded-lg px-4"
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    getPriorityColor(suggestion.priority)
                  }`}>
                    {suggestion.priority.toUpperCase()}
                  </span>
                  <span className="font-semibold">{suggestion.section}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-3 py-3">
                  {suggestion.suggestions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-red-500 mt-1" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
