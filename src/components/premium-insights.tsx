'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Zap, Github, Linkedin, Lock } from 'lucide-react'
import { openCheckout, isSubscriptionActive } from '@/lib/lemon-squeezy'

interface ATSScore {
  overall: number
  sections: {
    keywords: number
    formatting: number
    experience: number
    skills: number
  }
  suggestions: string[]
}

interface Resume {
  id: string
  title: string
  content: string
  source: 'linkedin' | 'github' | 'personal'
  url?: string
}

export default function PremiumInsights() {
  const [atsScore, setAtsScore] = useState<ATSScore | null>(null)
  const [resumes, setResumes] = useState<Resume[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check subscription status on mount
    (async () => {
      const active = await isSubscriptionActive();
      setHasAccess(active);
    })();
  }, []);

  const handleATSScoring = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/ats-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: 'Your resume text here' }) // Replace with actual resume text
      })
      const data = await response.json()
      setAtsScore(data)
    } catch (error) {
      console.error('Error getting ATS score:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchResumes = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/maang-resumes')
      if (!response.ok) {
        throw new Error('Failed to fetch resumes')
      }

      const data = await response.json()
      setResumes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const getSourceIcon = (source: Resume['source']) => {
    switch (source) {
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />
      case 'github':
        return <Github className="w-4 h-4" />
      default:
        return null
    }
  }

  const renderPaywall = () => (
    <div className="text-center py-12">
      <Lock className="h-12 w-12 mx-auto mb-6 text-yellow-500" />
      <h2 className="text-2xl font-bold mb-4">Unlock Premium Insights</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Get unlimited access to ATS scoring and real MAANG company resumes for just <span className="font-semibold">$3/month</span>.
      </p>
      <Button 
        onClick={openCheckout}
        className="bg-yellow-500 hover:bg-yellow-600 text-white"
      >
        <Zap className="mr-2 h-4 w-4" />
        Unlock Premium Insights
      </Button>
    </div>
  )

  if (!hasAccess) {
    return (
      <div className="space-y-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
            <Zap className="h-8 w-8 text-yellow-500" />
            Premium Insights
          </h2>
          <p className="text-gray-600">Get detailed ATS analysis and access to real MAANG company resumes</p>
        </div>
        {renderPaywall()}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <Zap className="h-8 w-8 text-yellow-500" />
          Premium Insights
        </h2>
        <p className="text-gray-600">Get detailed ATS analysis and access to real MAANG company resumes</p>
      </div>

      <Tabs defaultValue="ats" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ats">ATS Score</TabsTrigger>
          <TabsTrigger value="resumes">MAANG Resumes</TabsTrigger>
        </TabsList>

        <TabsContent value="ats" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">ATS Score Analysis</h3>
              <Button onClick={handleATSScoring} disabled={isLoading}>
                {isLoading ? 'Analyzing...' : 'Analyze Resume'}
              </Button>
            </div>

            {atsScore && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {atsScore.overall}%
                  </div>
                  <p className="text-gray-600">Overall ATS Score</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Keywords Match</Label>
                    <Progress value={atsScore.sections.keywords} className="mt-2" />
                  </div>
                  <div>
                    <Label>Formatting</Label>
                    <Progress value={atsScore.sections.formatting} className="mt-2" />
                  </div>
                  <div>
                    <Label>Experience Quality</Label>
                    <Progress value={atsScore.sections.experience} className="mt-2" />
                  </div>
                  <div>
                    <Label>Skills Relevance</Label>
                    <Progress value={atsScore.sections.skills} className="mt-2" />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-blue-700">Improvement Suggestions:</h4>
                  <ul className="list-disc pl-4 space-y-2">
                    {atsScore.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-gray-600">{suggestion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="resumes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">MAANG Company Resumes</h3>
            <Button
              onClick={handleSearchResumes}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Search Resumes'}
            </Button>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <div className="grid gap-4">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="p-4 border rounded-lg space-y-2 cursor-pointer hover:bg-accent"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{resume.title}</h4>
                  <div className="flex items-center gap-2">
                    {getSourceIcon(resume.source)}
                    {resume.url && (
                      <a
                        href={resume.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline"
                      >
                        View Source
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {resume.content}
                </p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
