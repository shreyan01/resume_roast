import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/lemon-squeezy';

export async function POST(request: NextRequest) {
    try {
        const signature = request.headers.get('x-signature');
        if (!signature) {
            return NextResponse.json(
                { error: 'Missing signature' },
                { status: 401 }
            );
        }

        const payload = await request.text();
        const isValid = verifyWebhookSignature(payload, signature);
        
        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 401 }
            );
        }

        const event = JSON.parse(payload);
        const { meta, data } = event;

        // Handle different webhook events
        switch (meta.event_name) {
            case 'subscription_created':
                // Handle new subscription
                console.log('New subscription created:', data);
                break;
            
            case 'subscription_updated':
                // Handle subscription update
                console.log('Subscription updated:', data);
                break;
            
            case 'subscription_cancelled':
                // Handle subscription cancellation
                console.log('Subscription cancelled:', data);
                break;
            
            default:
                console.log('Unhandled event:', meta.event_name);
        }

        return NextResponse.json({ status: 'success' });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        );
    }
} 