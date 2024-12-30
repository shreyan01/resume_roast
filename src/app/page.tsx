// pages/index.tsx
'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Zap, Target, TrendingUp, Star } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
          Get Your Resume <span className="text-red-600">Roasted</span> 🔥
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Brutal honesty meets actionable insights. Get your resume torn apart by AI for free, 
          or unlock premium ATS insights for just $1.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" variant="default" className="bg-red-600 hover:bg-red-700">
            Roast My Resume (Free)
          </Button>
          <Button size="lg" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
            $1 Premium Roast <Zap className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Social Proof */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-600 font-medium">
            Trusted by job seekers from
          </p>
          <div className="flex justify-center gap-8 mt-6">
            <span className="text-gray-400 font-semibold">GOOGLE</span>
            <span className="text-gray-400 font-semibold">MICROSOFT</span>
            <span className="text-gray-400 font-semibold">META</span>
            <span className="text-gray-400 font-semibold">AMAZON</span>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <Target className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold">Brutal Honesty</h3>
            <p className="text-gray-600">
              No sugar coating. Get raw feedback on what&apos;s wrong with your resume and why it&apos;s getting rejected.
            </p>
          </div>
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold">ATS Insights ($1)</h3>
            <p className="text-gray-600">
              See exactly how ATS systems parse your resume and get a detailed scoring breakdown.
            </p>
          </div>
        </div>
      </div>

      {/* Premium Features */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What You Get for $1
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "ATS Score",
                description: "Get a detailed score of how well your resume performs against ATS systems"
              },
              {
                title: "Keyword Analysis",
                description: "See which important keywords are missing from your resume"
              },
              {
                title: "Format Check",
                description: "Learn if your resume format is optimized for ATS parsing"
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Check className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              quote: "The brutal honesty was exactly what I needed. Landed a job at Google after implementing the suggestions.",
              author: "Sarah K.",
              role: "Software Engineer"
            },
            {
              quote: "Best dollar I've ever spent. The ATS insights showed me exactly why I wasn't getting callbacks.",
              author: "Michael R.",
              role: "Product Manager"
            }
          ].map((testimonial, i) => (
            <div key={i} className="bg-gray-50 p-6 rounded-lg">
              <Star className="h-5 w-5 text-yellow-400 mb-4" />
              <p className="text-gray-700 mb-4">{testimonial.quote}</p>
              <div>
                <p className="font-medium">{testimonial.author}</p>
                <p className="text-gray-600 text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-red-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to face the truth?</h2>
          <p className="text-xl mb-8 opacity-90">
            Get roasted for free or unlock premium insights for just $1
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" variant="default" className="bg-white text-red-600 hover:bg-gray-100">
              Start Free Roast
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-red-700">
              Upgrade to Premium <Zap className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}