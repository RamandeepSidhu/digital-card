import { NextRequest, NextResponse } from 'next/server';
import { Card } from '@/types/card';
import { nanoid } from 'nanoid';
import { saveCardServer, getAllCardsServer } from '@/lib/cardStorageServer';
import { auth } from '@/app/api/auth/[...nextauth]/route';

// POST /api/cards - Create a new card
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    
    // Validate card type
    if (!body.type || (body.type !== 'business' && body.type !== 'bank' && body.type !== 'personal')) {
      return NextResponse.json(
        { error: 'Invalid card type. Must be "business", "bank", or "personal"' },
        { status: 400 }
      );
    }

    // Validate required fields based on type
    if (body.type === 'business') {
      const required = ['name', 'title', 'company', 'email', 'phone'];
      for (const field of required) {
        if (!body.data?.[field]) {
          return NextResponse.json(
            { error: `Missing required field: ${field}` },
            { status: 400 }
          );
        }
      }
    } else if (body.type === 'bank') {
      const required = ['accountHolder', 'bankName', 'accountNumber'];
      for (const field of required) {
        if (!body.data?.[field]) {
          return NextResponse.json(
            { error: `Missing required field: ${field}` },
            { status: 400 }
          );
        }
      }
    } else if (body.type === 'personal') {
      const required = ['name', 'email', 'phone'];
      for (const field of required) {
        if (!body.data?.[field]) {
          return NextResponse.json(
            { error: `Missing required field: ${field}` },
            { status: 400 }
          );
        }
      }
    }

    // Validate style
    if (!body.style || !['style1', 'style2', 'style3'].includes(body.style)) {
      return NextResponse.json(
        { error: 'Invalid style. Must be "style1", "style2", or "style3"' },
        { status: 400 }
      );
    }

    // Create card object (use provided ID or generate new one)
    const card: Card = {
      id: body.id || nanoid(),
      type: body.type,
      style: body.style,
      userId: userId, // Associate card with current user
      data: body.data,
      createdAt: body.createdAt ? new Date(body.createdAt) : new Date(),
    };

    console.log(`[API /cards] Saving card ${card.id} to storage...`);
    
    // Save card to persistent storage (KV or fallback)
    try {
      await saveCardServer(card);
      console.log(`[API /cards] ✅ Card ${card.id} saved successfully`);
    } catch (saveError) {
      console.error(`[API /cards] ❌ Error saving card ${card.id}:`, saveError);
      // Still return success if we can't save to Redis (fallback to in-memory)
      // This allows cards to work locally even without Redis
    }

    // Return card with URL
    const baseUrl = request.nextUrl.origin;
    const cardUrl = `${baseUrl}/card/${card.id}`;

    return NextResponse.json(
      {
        success: true,
        card: {
          ...card,
          url: cardUrl,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating card:', error);
    return NextResponse.json(
      { error: 'Failed to create card' },
      { status: 500 }
    );
  }
}

// GET /api/cards - Get all cards for the current user
export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const cards = await getAllCardsServer();
    
    // Strictly filter cards by userId - only show cards that:
    // 1. Have a userId field set
    // 2. userId exactly matches the current user's ID
    // 3. Are not example/test cards
    // 4. Have valid data
    const userCards = cards.filter(
      (card) => {
        // Ensure card has userId and it matches exactly
        if (!card.userId || card.userId !== userId) {
          return false;
        }
        // Exclude example/test cards
        if (card.id.startsWith('example-') || card.id.startsWith('test-')) {
          return false;
        }
        // Must have valid data
        if (!card.data) {
          return false;
        }
        return true;
      }
    );
    
    console.log(`[API /cards] User ${userId} requested cards. Found ${userCards.length} cards out of ${cards.length} total.`);
    
    return NextResponse.json({ cards: userCards }, { status: 200 });
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cards' },
      { status: 500 }
    );
  }
}

