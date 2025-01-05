import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
    try {
        const { resumeText } = await request.json();

        if (!resumeText) {
            return NextResponse.json({ error: 'Resume text is required' }, { status: 400 });
        }

        const endpoint = process.env.NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT;
        const apiKey = process.env.NEXT_PUBLIC_AZURE_OPENAI_API_KEY;

        const response = await axios.post(
            `${endpoint}`,
            {
                messages: [
                    { role: 'system', content: 'You are a professional resume reviewer specializing in providing constructive feedback and roasting resumes.' },
                    { role: 'user', content: `Please roast the following resume: ${resumeText}` }
                ],
                max_tokens: 500,
                temperature: 0.7,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': apiKey,
                },
            }
        );

        return NextResponse.json({ roast: response.data.choices[0].message.content });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Error from Azure OpenAI:', error.response?.data || error.message);
        return NextResponse.json({ error: 'Failed to process the resume.' }, { status: 500 });
    }
}
