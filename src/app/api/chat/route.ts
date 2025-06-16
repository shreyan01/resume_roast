import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { PDFDocument } from 'pdf-lib';

export const dynamic = 'force-dynamic';

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

For improvement requests, reply with: "Oh, you want ACTUAL help? That's cute. *Premium Feature Alert* 💅 For just $3/month, you can get:
- Real ATS scoring (not just me roasting you)
- Keyword analysis (big words I promise you're missing)
- Format fixes (because this needs work)
- Tips from actual top resumes (not whatever this is)

But for now, let's get back to roasting this masterpiece..."`;

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

async function convertPDFToPNG(pdfBuffer: Buffer): Promise<string> {
    try {
        // Load the PDF document
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        
        // Create a new PDF with just the first page
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [0]);
        newPdf.addPage(copiedPage);
        
        // Save as PDF bytes
        const pdfBytes = await newPdf.save();
        
        // Convert to base64
        const base64 = Buffer.from(pdfBytes).toString('base64');
        return `data:application/pdf;base64,${base64}`;
    } catch (error) {
        console.error('Error converting PDF:', error);
        throw new Error('Failed to process PDF');
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

            // Validate file size
            if (resumeFile.size > 5 * 1024 * 1024) {
                return NextResponse.json(
                    { 
                        error: 'File size must be less than 5MB',
                        status: 'error'
                    },
                    { status: 400 }
                );
            }

            // Validate file type
            const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(resumeFile.type)) {
                return NextResponse.json(
                    { 
                        error: 'Only PDF and DOCX files are supported',
                        status: 'error'
                    },
                    { status: 400 }
                );
            }

            // Convert file to buffer
            const arrayBuffer = await resumeFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Convert PDF to base64 if it's a PDF
            let dataUrl: string;
            if (resumeFile.type === 'application/pdf') {
                dataUrl = await convertPDFToPNG(buffer);
            } else {
                // For DOCX, we'll need to handle differently
                throw new Error('DOCX files are not supported yet. Please convert to PDF first.');
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

            // Send file directly to OpenAI
            console.log('Sending file to OpenAI...');
            const completion = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: SYSTEM_PROMPT
                    },
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "Please roast this resume brutally but professionally. Point out its flaws and weaknesses."
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: dataUrl
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 1000
            });

            console.log('Successfully received response from OpenAI');
            return NextResponse.json({
                response: completion.choices[0].message.content,
                status: 'success'
            });

        } else {
            // Handle text message
            const body = await request.json();
            message = body.message;
            conversationHistory = body.conversationHistory || [];

            if (!message) {
                return NextResponse.json(
                    { 
                        error: 'Message is required',
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
            const completion = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: SYSTEM_PROMPT
                    },
                    ...conversationHistory.map(msg => ({
                        role: msg.role,
                        content: msg.content
                    })),
                    {
                        role: "user",
                        content: message
                    }
                ],
                max_tokens: 1000
            });

            console.log('Successfully received response from OpenAI');
            return NextResponse.json({
                response: completion.choices[0].message.content,
                status: 'success'
            });
        }
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { 
                error: 'Failed to process request. Please try again.',
                status: 'error'
            },
            { status: 500 }
        );
    }
}