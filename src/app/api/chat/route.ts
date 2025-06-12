import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import officeParser from 'officeparser';

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
- Structure your roasts with:
  1. A witty opening line
  2. 2-3 specific issues with the resume
  3. A sarcastic closing remark

For improvement requests, reply with: "Oh, you want ACTUAL help? That's cute. *Premium Feature Alert* 💅 For just $1, you can get:
- Real ATS scoring (not just me roasting you)
- Keyword analysis (big words I promise you're missing)
- Format fixes (because this needs work)
- Tips from actual top resumes (not whatever this is)

But for now, let's get back to roasting this masterpiece..."`;

async function parseResumeFile(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    try {
        const text = await officeParser.parseOfficeAsync(buffer);
        return text;
    } catch (error) {
        console.error('Parse error:', error);
        throw new Error('Failed to parse file. Please ensure it\'s a valid PDF or DOCX file.');
    }
}

export async function POST(request: NextRequest) {
    console.log('=== Chat API Route Debug ===');
    console.log('Request URL:', request.url);
    console.log('Request method:', request.method);
    console.log('Content-Type:', request.headers.get('content-type'));
    
    try {
        const contentType = request.headers.get('content-type') || '';
        let message: string;
        let conversationHistory: ChatMessage[] = [];

        if (contentType.includes('multipart/form-data')) {
            // Handle file upload
            console.log('Processing file upload...');
            const formData = await request.formData();
            const resumeFile = formData.get('resume') as File;
            
            if (!resumeFile) {
                console.log('No resume file found in form data');
                return NextResponse.json(
                    { 
                        error: 'No resume file provided',
                        status: 'error'
                    },
                    { status: 400 }
                );
            }

            console.log('File details:', {
                name: resumeFile.name,
                type: resumeFile.type,
                size: resumeFile.size
            });

            try {
                message = await parseResumeFile(resumeFile);
                console.log('File parsed successfully, text length:', message.length);
            } catch (error) {
                console.error('File parsing error:', error);
                return NextResponse.json(
                    { 
                        error: 'Failed to parse file. Please ensure it\'s a valid PDF or DOCX file.',
                        status: 'error'
                    },
                    { status: 400 }
                );
            }

            // Check if OpenAI API key is configured
            if (!process.env.OPENAI_API_KEY) {
                console.error('OpenAI API key is not configured');
                return NextResponse.json(
                    { 
                        error: 'OpenAI API key is not configured',
                        status: 'error'
                    },
                    { status: 500 }
                );
            }

            const openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY,
            });

            // Send text to OpenAI
            console.log('Sending text to OpenAI...');
            try {
                const completion = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: 'system', content: SYSTEM_PROMPT },
                        {
                            role: 'user',
                            content: `Roast this resume (be brutal but funny):\n\n${message}`
                        }
                    ],
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
            } catch (openaiError) {
                console.error('OpenAI API error:', openaiError);
                return NextResponse.json(
                    { 
                        error: 'Failed to get response from OpenAI',
                        status: 'error'
                    },
                    { status: 500 }
                );
            }

        } else if (contentType.includes('application/json')) {
            // Handle chat message
            console.log('Processing chat message...');
            const body = await request.json();
            message = body.message;
            conversationHistory = body.conversationHistory || [];
            
            if (!message) {
                console.log('No message found in JSON body');
                return NextResponse.json(
                    { 
                        error: 'No message provided',
                        status: 'error'
                    },
                    { status: 400 }
                );
            }
            console.log('Received message length:', message.length);

            // Check if OpenAI API key is configured
            if (!process.env.OPENAI_API_KEY) {
                console.error('OpenAI API key is not configured');
                return NextResponse.json(
                    { 
                        error: 'OpenAI API key is not configured',
                        status: 'error'
                    },
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
            try {
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
            } catch (openaiError) {
                console.error('OpenAI API error:', openaiError);
                return NextResponse.json(
                    { 
                        error: 'Failed to get response from OpenAI',
                        status: 'error'
                    },
                    { status: 500 }
                );
            }
        } else {
            console.log('Unsupported content type:', contentType);
            return NextResponse.json(
                { 
                    error: 'Unsupported content type',
                    status: 'error'
                },
                { status: 400 }
            );
        }

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