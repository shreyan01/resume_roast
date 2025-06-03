import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

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
    try {
        const { resumeText, message, conversationHistory } = await request.json();

        if (!resumeText && !message) {
            return NextResponse.json(
                { error: 'Resume text or message is required' },
                { status: 400 }
            );
        }

        const OLLAMA_ENDPOINT = process.env.OLLAMA_ENDPOINT || 'http://localhost:11434';
        const MODEL = process.env.OLLAMA_MODEL || 'mistral';

        let messages = [];
        if (message && conversationHistory) {
            // Handle follow-up conversation
            messages = [
                { role: 'system', content: SYSTEM_PROMPT },
                ...conversationHistory,
                { role: 'user', content: message }
            ];
        } else {
            // Initial roast
            messages = [
                { role: 'system', content: SYSTEM_PROMPT },
                {
                    role: 'user',
                    content: `Roast this resume (be brutal but funny): ${resumeText}`
                }
            ];
        }

        const response = await axios.post(
            `${OLLAMA_ENDPOINT}/api/chat`,
            {
                model: MODEL,
                messages: messages,
                stream: false,
                options: {
                    temperature: 0.9,
                    top_p: 0.9,
                    presence_penalty: 0.6,
                    frequency_penalty: 0.3,
                }
            }
        );

        return NextResponse.json({
            response: response.data.message.content,
            status: 'success'
        });

    } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Error:', axiosError.response?.data || axiosError.message);
        return NextResponse.json(
            { 
                error: 'Our roasting machine is taking a coffee break. Try again!',
                status: 'error'
            },
            { status: 500 }
        );
    }
}
