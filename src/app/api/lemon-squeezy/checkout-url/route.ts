import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const storeId = process.env.LEMON_SQUEEZY_STORE_ID
        const variantId = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_VARIANT_ID

        if (!storeId || !variantId) {
            return NextResponse.json(
                { error: 'Missing required environment variables' },
                { status: 500 }
            )
        }

        const checkoutUrl = `https://${storeId}.lemonsqueezy.com/checkout/buy/${variantId}?checkout[custom][source]=resume_roast_ats`

        return NextResponse.json({ checkoutUrl })
    } catch (error) {
        console.error('Error generating checkout URL:', error)
        return NextResponse.json(
            { error: 'Failed to generate checkout URL' },
            { status: 500 }
        )
    }
} 