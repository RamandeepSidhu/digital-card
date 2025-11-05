import { NextRequest, NextResponse } from 'next/server';
import { deleteCardServer } from '@/lib/cardStorageServer';

// DELETE /api/cards/[id] - Delete a card by ID
export async function DELETE(
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

    console.log(`[API /cards/${id}] Deleting card...`);
    
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
      
      // If card doesn't exist, that's okay - return success anyway
      // This allows deletion to work even if card was already deleted
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

