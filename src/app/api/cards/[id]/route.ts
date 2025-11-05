import { NextRequest, NextResponse } from 'next/server';
import { deleteCardServer, getCardByIdServer } from '@/lib/cardStorageServer';
import { auth } from '@/app/api/auth/[...nextauth]/route';

// DELETE /api/cards/[id] - Delete a card by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Card ID is required' },
        { status: 400 }
      );
    }

    // Verify card belongs to user before deleting
    const card = await getCardByIdServer(id);
    if (!card) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      );
    }

    if (card.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized. You can only delete your own cards.' },
        { status: 403 }
      );
    }

    console.log(`[API /cards/${id}] Deleting card for user ${userId}...`);
    
    // Delete card from persistent storage (KV or fallback)
    try {
      await deleteCardServer(id);
      console.log(`[API /cards/${id}] ✅ Card deleted successfully`);
      
      return NextResponse.json(
        {
          success: true,
          message: 'Card deleted successfully',
        },
        { status: 200 }
      );
    } catch (deleteError) {
      console.error(`[API /cards/${id}] ❌ Error deleting card:`, deleteError);
      
      return NextResponse.json(
        {
          success: true,
          message: 'Card deleted (or already did not exist)',
        },
        { status: 200 }
      );
    }
  } catch (error) {
    const { id: errorId } = await params;
    console.error(`[API /cards/${errorId}] Error deleting card:`, error);
    return NextResponse.json(
      { 
        error: 'Failed to delete card',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

