import { NextRequest, NextResponse } from 'next/server';
import { getSubscription, getCustomerSubscriptions, getSubscriptionStatus } from '@/lib/lemon-squeezy';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const customerId = searchParams.get('customerId');
        const subscriptionId = searchParams.get('subscriptionId');

        if (!customerId && !subscriptionId) {
            return NextResponse.json(
                { error: 'Either customerId or subscriptionId is required' },
                { status: 400 }
            );
        }

        let subscription = null;
        if (subscriptionId) {
            subscription = await getSubscription(subscriptionId);
        } else if (customerId) {
            const subscriptions = await getCustomerSubscriptions(customerId);
            // Get the most recent active subscription
            subscription = subscriptions.find(sub => sub.status === 'active') || null;
        }

        const status = getSubscriptionStatus(subscription);

        return NextResponse.json({
            isSubscribed: status === 'active',
            status: 'success',
            subscription: subscription ? {
                id: subscription.id,
                status: subscription.status,
                createdAt: subscription.createdAt,
                updatedAt: subscription.updatedAt
            } : null
        });
    } catch (error) {
        console.error('Subscription check error:', error);
        return NextResponse.json(
            { 
                error: 'Failed to check subscription status',
                status: 'error'
            },
            { status: 500 }
        );
    }
} 