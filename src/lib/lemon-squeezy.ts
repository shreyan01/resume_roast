import { createHmac } from 'crypto';

export interface Subscription {
    id: string;
    status: 'active' | 'inactive' | 'cancelled';
    variantId: string;
    customerId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Customer {
    id: string;
    email: string;
    name: string;
    status: 'active' | 'inactive';
}

// Only check environment variables on the server side
if (typeof window === 'undefined') {
    const LEMON_SQUEEZY_API_KEY = process.env.LEMON_SQUEEZY_API_KEY;
    const LEMON_SQUEEZY_WEBHOOK_SECRET = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    const LEMON_SQUEEZY_STORE_ID = process.env.LEMON_SQUEEZY_STORE_ID;

    if (!LEMON_SQUEEZY_API_KEY || !LEMON_SQUEEZY_WEBHOOK_SECRET || !LEMON_SQUEEZY_STORE_ID) {
        console.error('Missing variables:', {
            apiKey: !LEMON_SQUEEZY_API_KEY,
            webhookSecret: !LEMON_SQUEEZY_WEBHOOK_SECRET,
            storeId: !LEMON_SQUEEZY_STORE_ID
        });
        throw new Error('Missing required Lemon Squeezy environment variables');
    }
}

export async function getSubscription(subscriptionId: string): Promise<Subscription | null> {
    try {
        const response = await fetch(
            `https://api.lemonsqueezy.com/v1/subscriptions/${subscriptionId}`,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
                    'Accept': 'application/json',
                },
            }
        );

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching subscription:', error);
        return null;
    }
}

export async function getCustomerSubscriptions(customerId: string): Promise<Subscription[]> {
    try {
        const response = await fetch(
            `https://api.lemonsqueezy.com/v1/customers/${customerId}/subscriptions`,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
                    'Accept': 'application/json',
                },
            }
        );

        if (!response.ok) {
            return [];
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching customer subscriptions:', error);
        return [];
    }
}

export function verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!process.env.LEMON_SQUEEZY_WEBHOOK_SECRET) {
        throw new Error('Missing LEMON_SQUEEZY_WEBHOOK_SECRET environment variable');
    }
    const hmac = createHmac('sha256', process.env.LEMON_SQUEEZY_WEBHOOK_SECRET);
    const digest = hmac.update(payload).digest('hex');
    return digest === signature;
}

export function getSubscriptionStatus(subscription: Subscription | null): 'active' | 'inactive' {
    if (!subscription) return 'inactive';
    return subscription.status === 'active' ? 'active' : 'inactive';
}

export const LEMON_SQUEEZY_VARIANT_ID = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_VARIANT_ID!;

export async function openCheckout() {
    try {
        // Get the store ID and variant ID from the API
        const response = await fetch('/api/lemon-squeezy/checkout-url');
        if (!response.ok) {
            throw new Error('Failed to get checkout URL');
        }
        const { checkoutUrl } = await response.json();
        
        // Open checkout in new window
        window.open(checkoutUrl, '_blank');
    } catch (error) {
        console.error('Failed to open checkout:', error);
    }
}

export async function isSubscriptionActive(): Promise<boolean> {
    try {
        // Check if user has an active subscription
        const response = await fetch('/api/lemon-squeezy/check-subscription');
        if (!response.ok) {
            return false;
        }
        const data = await response.json();
        return data.isActive;
    } catch (error) {
        console.error('Error checking subscription:', error);
        return false;
    }
} 