'use client'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Flame, Send, RefreshCcw, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import type { Resume } from '@/types'

interface Message {
  type: 'roast' | 'advice' | 'user'
  content: string
}

interface Props {
  resume: Resume
  status: 'idle' | 'roasting' | 'completed'
  onReset: () => void
}

export default function RoastingExperience({ resume, status, onReset }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [userInput, setUserInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPremiumUpsell, setShowPremiumUpsell] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const getInitialRoast = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/roast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeText: resume.content })
        })
        
        const data = await response.json()
        if (data.status === 'success') {
          setMessages([{
            type: 'roast',
            content: data.response
          }])
        }
      } catch (error) {
        console.error('Error getting roast:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (status === 'completed') {
      getInitialRoast()
      const upsellTimer = setTimeout(() => setShowPremiumUpsell(true), 15000)
      
      return () => clearTimeout(upsellTimer)
    }
  }, [status, resume.content])

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return

    const newUserMessage = { role: 'user' as const, content: userInput }
    setMessages(prev => [...prev, newUserMessage])
    setUserInput('')
    setIsLoading(true)

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: userInput,
                conversationHistory: messages
            })
        })

        const data = await response.json()
        if (data.status === 'success') {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.response
            }])
        }
    } catch (error) {
        console.error('Error sending message:', error)
    } finally {
        setIsLoading(false)
    }
  }

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
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start gap-2 max-w-[80%] ${
              message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}>
              <Avatar>
                {message.type === 'user' ? 
                  '👤' : 
                  <Flame className="h-5 w-5 text-red-500" />
                }
              </Avatar>
              <div className={`rounded-lg p-4 ${
                message.type === 'user' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-white border'
              }`}>
                {message.content}
              </div>
            </div>
          </div>
        ))}

        {showPremiumUpsell && (
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
        )}
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onReset}
            className="shrink-0"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your response..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button 
            onClick={handleSendMessage}
            className="bg-red-600 hover:bg-red-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
