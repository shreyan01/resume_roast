// pages/index.tsx
'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Zap, Target, TrendingUp, Star, FileText, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 text-center relative">
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-full">
          <div className="flex justify-center gap-4 opacity-70">
            <div className="animate-float-slow delay-0">🔥</div>
            <div className="animate-float-slow delay-100">📝</div>
            <div className="animate-float-slow delay-200">✨</div>
          </div>
        </div>
        <h1 className="text-7xl font-bold tracking-tight text-gray-900 mb-8">
          Get Your Resume <span className="text-red-600 relative inline-block">
            Roasted🔥
            <div className="absolute -bottom-2 left-0 w-full h-2 bg-red-600/30 transform -rotate-1"></div>
          </span>
        </h1>
        <p className="text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
          Brutal honesty meets actionable insights. Get your resume torn apart by AI for free, 
          or unlock premium ATS insights for just $1.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-2xl mx-auto">
          <Button onClick={() => router.push('/signup')} size="lg" variant="default" className="group bg-red-600 hover:bg-red-700 h-16 text-lg px-8 shadow-xl shadow-red-600/20 hover:translate-y-[-2px] transition-all duration-300">
            <FileText className="mr-2 h-5 w-5 group-hover:rotate-6 transition-transform" />
            Roast My Resume (Free)
          </Button>
          <Button size="lg" variant="outline" className="group border-2 border-red-600 text-red-600 hover:bg-red-50 h-16 text-lg px-8 hover:scale-105 transition-all duration-300">
            $1 Premium Roast <Zap className="ml-2 h-5 w-5 group-hover:animate-pulse" />
          </Button>
        </div>
      </div>

      {/* Social Proof */}
      <div className="bg-white/50 backdrop-blur-sm py-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600 font-medium mb-10 text-lg">
            Trusted by job seekers from leading companies
          </p>
          <div className="flex flex-wrap justify-center gap-16 mt-6">
            {[
              { src: "/google.png", alt: "Google" },
              { src: "/microsoft.png", alt: "Microsoft" },
              { src: "/meta.png", alt: "Meta" },
              { src: "/amazon.png", alt: "Amazon" }
            ].map((company) => (
              <div key={company.alt} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Image 
                  className='hover:scale-110 transition-transform duration-300' 
                  src={company.src} 
                  alt={company.alt} 
                  width={90} 
                  height={90}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-28">
        <div className="grid md:grid-cols-2 gap-20">
          <div className="group space-y-6 p-10 rounded-3xl hover:bg-white/80 transition-colors duration-300 relative">
            <div className="absolute inset-0 border border-red-100 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="h-16 w-16 rounded-2xl bg-red-100 flex items-center justify-center transform rotate-3 group-hover:rotate-6 transition-transform duration-300">
              <Target className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold">Brutal Honesty</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              No sugar coating. Get raw feedback on what&apos;s wrong with your resume and why it&apos;s getting rejected.
            </p>
            <div className="pt-4">
              <Button variant="ghost" className="text-red-600 p-0 hover:bg-transparent group">
                Learn more <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
          <div className="group space-y-6 p-10 rounded-3xl hover:bg-white/80 transition-colors duration-300 relative">
            <div className="absolute inset-0 border border-red-100 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="h-16 w-16 rounded-2xl bg-red-100 flex items-center justify-center transform -rotate-3 group-hover:-rotate-6 transition-transform duration-300">
              <TrendingUp className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold">ATS Insights ($1)</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              See exactly how ATS systems parse your resume and get a detailed scoring breakdown.
            </p>
            <div className="pt-4">
              <Button variant="ghost" className="text-red-600 p-0 hover:bg-transparent group">
                Learn more <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Features */}
      <div className="bg-white py-28">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-20">
            What You Get for $1
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
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
              <div key={i} className="group bg-gray-50 p-10 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-green-100 p-3 rounded-xl group-hover:scale-110 transition-transform">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-xl">{feature.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 py-28">
        <div className="grid md:grid-cols-2 gap-16">
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
            <div key={i} className="group bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex gap-1.5 mb-8">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-yellow-400 fill-yellow-400 group-hover:scale-110 transition-transform" />
                ))}
              </div>
              <p className="text-gray-700 text-xl mb-8 leading-relaxed">{testimonial.quote}</p>
              <div className="flex items-center gap-5">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center text-lg font-semibold text-red-600">
                  {testimonial.author[0]}
                </div>
                <div>
                  <p className="font-bold text-lg">{testimonial.author}</p>
                  <p className="text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-red-600 via-red-600 to-red-700 text-white py-28">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-10">Ready to face the truth?</h2>
          <p className="text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Get roasted for free or unlock premium insights for just $1
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-2xl mx-auto">
            <Button size="lg" variant="default" className="group bg-white text-red-600 hover:bg-gray-50 h-16 text-lg px-8 shadow-2xl shadow-red-900/20">
              Start Free Roast <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="group border-2 border-white text-black hover:bg-red-500 h-16 text-lg px-8">
              Upgrade to Premium for just $1<Zap className="ml-2 h-5 w-5 group-hover:animate-pulse" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}