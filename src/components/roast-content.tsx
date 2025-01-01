'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame } from 'lucide-react'

// Mock data - replace with API call
const mockRoasts = [
  {
    title: "That Objective Statement...",
    roast: "Your objective statement is so generic, it could've been written by a bot from 1995. 'Seeking to leverage my skills'? Everyone and their grandma is seeking to leverage their skills.",
    advice: [
      "Cut the corporate buzzwords and tell us what you actually want to do",
      "Show some personality (but keep it professional)",
      "Better yet, just delete it and let your experience speak for itself"
    ]
  },
  {
    title: "Your Experience Section is Putting Me to Sleep",
    roast: "Reading your job descriptions is like watching paint dry. 'Responsible for managing projects'? Wow, groundbreaking stuff there, chief.",
    advice: [
      "Start with power verbs that actually mean something",
      "Show us numbers, results, anything concrete",
      "Tell us what made YOU different from the other 100 people with the same title"
    ]
  },
  {
    title: "Skills Section or Buzzword Bingo?",
    roast: "Ah yes, 'team player', 'detail-oriented', and 'Microsoft Word' - the holy trinity of filler skills. I'm surprised you didn't include 'breathing' as a skill.",
    advice: [
      "Remove generic skills that everyone has",
      "Add specific technical skills relevant to your industry",
      "Quantify your skill levels or add certifications"
    ]
  }
]


export default function RoastContent() {
  const [visibleRoasts, setVisibleRoasts] = useState<number>(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleRoasts(prev => {
        if (prev < mockRoasts.length) return prev + 1
        clearInterval(timer)
        return prev
      })
    }, 2000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <Flame className="h-8 w-8 text-red-500" />
          Your Resume Got Roasted
        </h2>
        <p className="text-gray-600">Brace yourself. This might hurt a little...</p>
      </div>

      <AnimatePresence>
        {mockRoasts.slice(0, visibleRoasts).map((roast, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="border-l-4 border-red-500 pl-6 py-4"
          >
            <h3 className="text-xl font-bold mb-3">{roast.title}</h3>
            <p className="text-gray-700 mb-4 text-lg">{roast.roast}</p>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-red-700">How to fix this:</h4>
              <ul className="list-disc pl-4 space-y-2">
                {roast.advice.map((tip, i) => (
                  <li key={i} className="text-gray-600">{tip}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
