import { BankCard } from '@/types/card';

interface StyleOneProps {
  card: BankCard;
}

export default function StyleOne({ card }: StyleOneProps) {
  const { data } = card;
  
  return (
    <div className="w-full max-w-md mx-auto bg-zinc-900 rounded-2xl shadow-lg overflow-hidden">
      {/* Top Section with Bank Name */}
      <div className="p-6 bg-zinc-900">
        <div className="flex items-start justify-between mb-6">
          <div className="text-white">
            <p className="text-gray-400 text-xs mb-1">Bank Name</p>
            <p className="text-xl font-bold text-white">{data.bankName}</p>
          </div>
          <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
        
        {/* Account Holder */}
        <div className="mb-4">
          <p className="text-gray-400 text-xs mb-1">Account Holder</p>
          <p className="text-lg font-semibold text-white">{data.accountHolder}</p>
        </div>
        
        {/* Account Number - Large and Bold */}
        <div className="mb-4">
          <p className="text-gray-400 text-xs mb-2">Account Number</p>
          <p className="text-3xl font-bold text-white tracking-wider">{data.accountNumber}</p>
        </div>
        
        {/* UPI ID in Purple Rectangle */}
        {data.upiId && (
          <div className="bg-purple-600 rounded-lg p-4 mt-6">
            <p className="text-purple-200 text-xs mb-1">UPI ID</p>
            <p className="text-lg font-semibold text-white">{data.upiId}</p>
          </div>
        )}
      </div>
    </div>
  );
}

