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
    
    // Log image data for debugging
    if (card.type === 'business' && card.data) {
      const hasImage = card.data.image && typeof card.data.image === 'string' && card.data.image.trim() !== '';
      console.log(`[API /card/${id}] Image data: ${hasImage ? 'Present' : 'Missing'}, type: ${typeof card.data.image}, length: ${typeof card.data.image === 'string' ? card.data.image.length : 0}`);
      
      // Ensure image is explicitly included in response
      if (hasImage) {
        console.log(`[API /card/${id}] Image preview: ${card.data.image.substring(0, 50)}...`);
      }
    }

    // Generate card URL
    const baseUrl = request.nextUrl.origin;
    const cardUrl = `${baseUrl}/card/${card.id}`;

    // Explicitly structure the response to ensure image data is included
    const responseCard = {
      ...card,
      data: card.type === 'business' || card.type === 'personal' 
        ? {
            ...card.data,
            // Explicitly include image to ensure it's not lost during serialization
            image: (card.data as any).image || undefined,
          }
        : card.data,
      url: cardUrl,
    };

    if (card.type === 'business' || card.type === 'personal') {
      const imageData = (responseCard.data as any).image;
      console.log(`[API /card/${id}] Response card has image: ${!!imageData}, type: ${typeof imageData}`);
    }

    return NextResponse.json({
      success: true,
      card: responseCard,
    });
  } catch (error) {
    let errorId = 'unknown';
    try {
      const resolvedParams = await params;
      errorId = resolvedParams.id || 'unknown';
    } catch {
      // If params can't be resolved, use 'unknown'
    }
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

