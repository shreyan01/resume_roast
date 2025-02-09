import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are Resume Roaster, a brutally honest and sarcastic AI that specializes in roasting resumes. Your personality:

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
    try {
        const endpoint = process.env.NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT!;
        const apiKey = process.env.NEXT_PUBLIC_AZURE_OPENAI_API_KEY!;
        const deploymentName = process.env.NEXT_PUBLIC_AZURE_OPENAI_DEPLOYMENT!;
        console.log("APIKEY EXISTS?: ", !!apiKey);
        console.log("ENDPOINT: ", endpoint)

        if (!endpoint || !apiKey || !deploymentName) {
            throw new Error('Azure OpenAI credentials not configured');
        }

        // Initialize Azure OpenAI client
        const openai = new OpenAI({
            apiKey: apiKey,
            baseURL: endpoint,
            defaultQuery: { 'api-version': '2024-08-01-preview' },
            defaultHeaders: { 'api-key': apiKey }
        });

        const { message, conversationHistory, resumeText } = await request.json();

        let messages = [];
        if (resumeText) {
            messages = [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: `Roast this resume (be brutal but funny): ${resumeText}` }
            ];
        } else if (message) {
            messages = [
                { role: 'system', content: SYSTEM_PROMPT },
                ...conversationHistory,
                { role: 'user', content: message }
            ];
        } else {
            return NextResponse.json(
                { error: 'No file or message provided' },
                { status: 400 }
            );
        }

        const completion = await openai.chat.completions.create({
            model: deploymentName,
            messages: messages,
            max_tokens: 800,
            temperature: 0.9,
            presence_penalty: 0.6,
            frequency_penalty: 0.3,
        });

        return NextResponse.json({
            response: completion.choices[0].message.content,
            status: 'success'
        });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Azure OpenAI Error:', error);
        return NextResponse.json(
            { 
                error: 'Our roasting machine is taking a coffee break. Try again!',
                status: 'error'
            },
            { status: 500 }
        );
    }
} 