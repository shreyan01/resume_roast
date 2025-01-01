'use client'
import { useState, useEffect } from 'react'
import { motion, } from 'framer-motion'
import { Flame, RefreshCcw, Share2, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Resume } from '@/types'
import RoastContent from '@/components/roast-content'
import {UserReactions} from '@/components/user-reactions'

interface Props {
  resume: Resume
  status: 'idle' | 'roasting' | 'completed'
  onReset: () => void
}

export default function RoastingExperience({ status, onReset }: Props) {
  const [showPremiumUpsell, setShowPremiumUpsell] = useState(false)

  useEffect(() => {
    if (status === 'completed') {
      const timer = setTimeout(() => setShowPremiumUpsell(true), 10000)
      return () => clearTimeout(timer)
    }
  }, [status])

  if (status === 'roasting') {
    return (
      <div className="text-center py-12">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="inline-block mb-6"
        >
          <Flame className="h-16 w-16 text-red-500" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-4">Roasting in Progress...</h2>
        <p className="text-gray-600">Preparing your brutal feedback with a side of tough love</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <RoastContent />
        <UserReactions />

        <div className="flex justify-between items-center mt-8 pt-8 border-t">
          <div className="flex gap-4">
            <Button variant="outline" onClick={onReset}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Try Another Resume
            </Button>
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share Roast
            </Button>
          </div>
        </div>

        {showPremiumUpsell && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Card className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-red-100">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Zap className="text-red-500" />
                Want More Than Just a Roast?
              </h3>
              <p className="text-gray-600 mb-4">
                Get detailed ATS insights, keyword analysis, and professional improvement suggestions for just $1.
              </p>
              <Button className="bg-red-600 hover:bg-red-700">
                Upgrade to Premium
                <Zap className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
