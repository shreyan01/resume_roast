import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import { isSubscriptionActive } from '@/lib/lemon-squeezy';

const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) analyzer. Your task is to analyze resumes and provide detailed scoring and suggestions. Follow these guidelines:

1. Analyze the resume for:
   - Keyword optimization (matching job requirements)
   - Formatting and structure
   - Experience quality and relevance
   - Skills presentation and relevance

2. Provide scores for each category (0-100)
3. Give specific, actionable suggestions for improvement
4. Be professional but constructive in your feedback

Format your response as a JSON object with the following structure:
{
  "overall": number,
  "sections": {
    "keywords": number,
    "formatting": number,
    "experience": number,
    "skills": number
  },
  "suggestions": string[]
}`;

export async function POST(req: NextRequest) {
    try {
        // Check if user has active subscription
        const hasAccess = await isSubscriptionActive();
        if (!hasAccess) {
            return NextResponse.json(
                { error: 'Subscription required' },
                { status: 403 }
            );
        }

        const { resumeText } = await req.json();

        if (!resumeText) {
            return NextResponse.json(
                { error: 'Resume text is required' },
                { status: 400 }
            );
        }

        const OLLAMA_ENDPOINT = process.env.OLLAMA_ENDPOINT || 'http://localhost:11434';
        const MODEL = process.env.OLLAMA_MODEL || 'mistral';

        const response = await axios.post(
            `${OLLAMA_ENDPOINT}/api/chat`,
            {
                model: MODEL,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: `Analyze this resume: ${resumeText}` }
                ],
                stream: false,
                options: {
                    temperature: 0.7,
                    top_p: 0.9,
                }
            }
        );

        // Parse the response content as JSON
        const analysis = JSON.parse(response.data.message.content);

        return NextResponse.json(analysis);

    } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Error:', axiosError.response?.data || axiosError.message);
        return NextResponse.json(
            { 
                error: 'Failed to analyze resume. Please try again.',
                status: 'error'
            },
            { status: 500 }
        );
    }
} 