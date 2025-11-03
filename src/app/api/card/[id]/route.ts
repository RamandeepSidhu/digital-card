import { NextRequest, NextResponse } from 'next/server';
import { getCardByIdServer } from '@/lib/cardStorageServer';

// GET /api/card/[id] - Get a specific card by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Card ID is required' },
        { status: 400 }
      );
    }

    const card = await getCardByIdServer(id);

    if (!card) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      );
    }

    // Generate card URL
    const baseUrl = request.nextUrl.origin;
    const cardUrl = `${baseUrl}/card/${card.id}`;

    return NextResponse.json({
      success: true,
      card: {
        ...card,
        url: cardUrl,
      },
    });
  } catch (error) {
    console.error('Error fetching card:', error);
    return NextResponse.json(
      { error: 'Failed to fetch card' },
      { status: 500 }
    );
  }
}

