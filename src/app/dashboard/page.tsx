'use client'
import { useState } from 'react'
import { Menu, Flame, Zap} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import ResumeUploader from '@/components/resume-uploader'
import RoastingExperience from '@/components/roasting-experience'
import PremiumInsights from '@/components/premium-insights'
import type { Resume } from '@/types'

export default function Dashboard() {
  const [activeResume, setActiveResume] = useState<Resume | null>(null)
  const [roastStatus, setRoastStatus] = useState<'idle' | 'roasting' | 'completed'>('idle')
  const [activeSection, setActiveSection] = useState<'roast' | 'premium'>('roast')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const handleUploadComplete = (resume: Resume) => {
    setActiveResume(resume)
    setRoastStatus('roasting')
    setTimeout(() => setRoastStatus('completed'), 5000)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={cn(
        "bg-white border-r transition-all duration-300",
        isSidebarCollapsed ? "w-20" : "w-64"
      )}>
        <div className="p-4 border-b flex items-center justify-between">
          <h1 className={cn(
            "font-bold transition-all duration-300",
            isSidebarCollapsed ? "hidden" : "text-xl"
          )}>
            Resume Roaster
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          <Button
            variant={activeSection === 'roast' ? 'default' : 'ghost'}
            className={cn(
              "w-full justify-start",
              activeSection === 'roast' && "bg-red-600 hover:bg-red-700 text-white"
            )}
            onClick={() => setActiveSection('roast')}
          >
            <Flame className="h-5 w-5 mr-2" />
            {!isSidebarCollapsed && "Get Roasted"}
          </Button>

          <Button
            variant={activeSection === 'premium' ? 'default' : 'ghost'}
            className={cn(
              "w-full justify-start",
              activeSection === 'premium' && "bg-red-600 hover:bg-red-700 text-white"
            )}
            onClick={() => setActiveSection('premium')}
          >
            <Zap className="h-5 w-5 mr-2" />
            {!isSidebarCollapsed && "Premium Insights"}
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {activeSection === 'roast' ? (
            <>
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
            </>
          ) : (
            <PremiumInsights />
          )}
        </div>
      </div>
    </div>
  )
}
