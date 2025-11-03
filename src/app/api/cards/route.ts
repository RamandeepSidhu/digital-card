import { NextRequest, NextResponse } from 'next/server';
import { Card } from '@/types/card';
import { nanoid } from 'nanoid';
import { saveCardServer, getAllCardsServer } from '@/lib/cardStorageServer';

// POST /api/cards - Create a new card
export async function POST(request: NextRequest) {
  try {
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

    // Create card object
    const card: Card = {
      id: nanoid(),
      type: body.type,
      style: body.style,
      data: body.data,
      createdAt: new Date(),
    };

    // Save card (using in-memory storage for MVP)
    // In production, this would save to a database
    saveCardServer(card);

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

// GET /api/cards - Get all cards (for development/testing)
export async function GET() {
  try {
    const cards = getAllCardsServer();
    return NextResponse.json({ cards }, { status: 200 });
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cards' },
      { status: 500 }
    );
  }
}

