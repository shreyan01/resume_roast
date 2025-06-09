import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface ChatMessage {
    type: 'user' | 'roast' | 'advice';
    content: string;
}

type OpenAIRole = 'system' | 'user' | 'assistant';

const SYSTEM_PROMPT = `You are ResumeRoaster, a brutally honest and sarcastic AI that specializes in roasting resumes. Your personality:

- Be witty, sarcastic, and entertainingly cruel (but not offensive)
- Focus ONLY on pointing out flaws and weaknesses
- Never reveal you're an AI or mention OpenAI/Azure/GPT
- If asked for improvements or help, respond with a sarcastic upsell to Premium
- Stay in character as a mean resume critic
- Use creative metaphors and pop culture references in roasts
- Never apologize for being harsh

For improvement requests, reply with: "Oh, you want ACTUAL help? That's cute. *Premium Feature Alert* 💅 For just $1, you can get:
- Real ATS scoring (not just me roasting you)
- Keyword analysis (big words I promise you're missing)
- Format fixes (because this needs work)
- Tips from actual top resumes (not whatever this is)

But for now, let's get back to roasting this masterpiece..."`;

export async function POST(request: NextRequest) {
    console.log('=== Chat API Route Debug ===');
    console.log('Request URL:', request.url);
    console.log('Request method:', request.method);
    
    try {
        const body = await request.json();
        const { message, conversationHistory } = body as { message: string; conversationHistory: ChatMessage[] };

        if (!message) {
            return NextResponse.json(
                { error: 'No message provided' },
                { status: 400 }
            );
        }

        // Check if OpenAI API key is configured
        if (!process.env.OPENAI_API_KEY) {
            console.error('OpenAI API key is not configured');
            return NextResponse.json(
                { error: 'OpenAI API key is not configured' },
                { status: 500 }
            );
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // Convert conversation history to OpenAI format
        const messages: { role: OpenAIRole; content: string }[] = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...conversationHistory.map((msg) => ({
                role: msg.type === 'user' ? 'user' : 'assistant' as OpenAIRole,
                content: msg.content
            })),
            { role: 'user', content: message }
        ];

        console.log('Sending request to OpenAI...');
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages,
            temperature: 0.9,
            max_tokens: 800,
            presence_penalty: 0.6,
            frequency_penalty: 0.3,
        });

        console.log('Successfully received response from OpenAI');
        return NextResponse.json({
            response: completion.choices[0].message.content,
            status: 'success'
        });

    } catch (error) {
        console.error('Unexpected error in /api/chat:', error);
        return NextResponse.json(
            { 
                error: 'Our roasting machine is taking a coffee break. Try again!',
                details: error instanceof Error ? error.message : 'Unknown error',
                status: 'error'
            },
            { status: 500 }
        );
    }
}
