import { BankCard } from '@/types/card';

interface StyleOneProps {
  card: BankCard;
}

export default function StyleOne({ card }: StyleOneProps) {
  const { data } = card;
  
  return (
    <div className="w-full max-w-md mx-auto bg-linear-to-br from-zinc-800 to-zinc-900 rounded-xl shadow-2xl overflow-hidden border border-zinc-700">
      <div className="p-6 bg-zinc-900/50 border-b border-zinc-700">
        <div className="flex items-center justify-between mb-4">
          <div className="text-white">
            <p className="text-zinc-400 text-xs mb-1">Bank Name</p>
            <p className="text-lg font-bold">{data.bankName}</p>
          </div>
          {data.logo ? (
            <img 
              src={data.logo} 
              alt={data.bankName}
              className="w-12 h-12 rounded-lg object-cover border-2 border-purple-500/30"
            />
          ) : (
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">🏦</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6 space-y-4 text-white">
        <div>
          <p className="text-zinc-400 text-xs mb-1">Account Holder</p>
          <p className="text-lg font-semibold">{data.accountHolder}</p>
        </div>
        
        <div className="bg-zinc-800/50 rounded-lg p-4">
          <p className="text-zinc-400 text-xs mb-2">Account Number</p>
          <p className="text-xl font-mono font-bold tracking-wider">{data.accountNumber}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          {data.ifscCode && (
            <div>
              <p className="text-zinc-400 text-xs mb-1">IFSC Code</p>
              <p className="font-mono">{data.ifscCode}</p>
            </div>
          )}
          {data.routingNumber && (
            <div>
              <p className="text-zinc-400 text-xs mb-1">Routing Number</p>
              <p className="font-mono">{data.routingNumber}</p>
            </div>
          )}
        </div>
        
        {data.upiId && (
          <div className="bg-purple-600/20 rounded-lg p-4 border border-purple-500/30">
            <p className="text-purple-300 text-xs mb-1">UPI ID</p>
            <p className="font-semibold">{data.upiId}</p>
          </div>
        )}
      </div>
    </div>
  );
}

