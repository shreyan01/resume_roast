'use client'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import ResumeUploader from '@/components/resume-uploader'
import RoastingExperience from '@/components/roasting-experience'
import PremiumInsights from '@/components/premium-insights'
import type { Resume } from '@/types'

export default function Dashboard() {
  const [activeResume, setActiveResume] = useState<Resume | null>(null)
  const [roastStatus, setRoastStatus] = useState<'idle' | 'roasting' | 'completed'>('idle')

  const handleUploadComplete = (resume: Resume) => {
    setActiveResume(resume)
    setRoastStatus('roasting')
    // Simulate roasting process
    setTimeout(() => setRoastStatus('completed'), 5000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-8">
          <h1 className="text-3xl font-bold text-gray-900">Resume Roaster</h1>
          <p className="mt-2 text-gray-600">Get brutally honest feedback or unlock premium insights</p>
        </div>

        {/* Main Content */}
        <Card className="mt-8">
          <Tabs defaultValue="roast" className="p-6">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="roast">Get Roasted (Free)</TabsTrigger>
              <TabsTrigger value="premium">Premium Insights ($1)</TabsTrigger>
            </TabsList>

            <TabsContent value="roast">
              {!activeResume || roastStatus === 'idle' ? (
                <ResumeUploader onUploadComplete={handleUploadComplete} />
              ) : (
                <RoastingExperience 
                  resume={activeResume}
                  status={roastStatus}
                  onReset={() => {
                    setActiveResume(null)
                    setRoastStatus('idle')
                  }}
                />
              )}
            </TabsContent>

            <TabsContent value="premium">
              <PremiumInsights />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
