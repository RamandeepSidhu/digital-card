import CardTypeSelector from '@/components/CardTypeSelector';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-black">
      <main className="flex min-h-screen w-full flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Navigation */}
        <div className="absolute top-4 right-4">
          <Link
            href="/my-cards"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
          >
            📋 My Cards
          </Link>
        </div>

        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-zinc-900 dark:text-zinc-50 tracking-tight">
            Digital Card Generator
          </h1>
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Create beautiful shareable digital cards with QR codes. 
            Share your contact details or payment information instantly.
          </p>
        </div>
        
        <div className="w-full flex justify-center animate-slide-up">
          <CardTypeSelector />
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            Choose a card type to get started
          </p>
        </div>
      </main>
    </div>
  );
}
