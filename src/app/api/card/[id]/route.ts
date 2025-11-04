import { NextRequest, NextResponse } from 'next/server';
import { getCardByIdServer } from '@/lib/cardStorageServer';
import { initRedis } from '@/lib/cardStorageKV';

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

    // Log Redis connection status for debugging
    const redisClient = await initRedis();
    const redisStatus = redisClient ? '✅ Connected' : '❌ Using fallback (in-memory)';
    console.log(`[API /card/${id}] Redis status: ${redisStatus}`);

    const card = await getCardByIdServer(id);

    if (!card) {
      console.log(`[API /card/${id}] Card not found in storage`);
      // Check if Redis is actually connected
      if (!redisClient) {
        console.warn(`[API /card/${id}] ⚠️ Redis not connected. Environment variables may not be set or app needs redeploy.`);
      }
      return NextResponse.json(
        { 
          error: 'Card not found',
          debug: {
            redisConnected: !!redisClient,
            envUrlSet: !!process.env.KV_REST_API_URL,
            envTokenSet: !!process.env.KV_REST_API_TOKEN,
          }
        },
        { status: 404 }
      );
    }

    console.log(`[API /card/${id}] ✅ Card found and returned`);

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
    const { id: errorId } = await params;
    console.error(`[API /card/${errorId}] Error fetching card:`, error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch card',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

