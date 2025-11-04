import { BankCard } from '@/types/card';

interface StyleTwoProps {
  card: BankCard;
}

export default function StyleTwo({ card }: StyleTwoProps) {
  const { data } = card;
  
  return (
    <div className="w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl" 
         style={{
           background: 'linear-linear(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
           backdropFilter: 'blur(20px)',
           border: '1px solid rgba(168, 85, 247, 0.2)',
         }}>
      <div className="p-8 bg-white/10 backdrop-blur-md">
        <div className="mb-6 pb-6 border-b border-purple-300/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-zinc-800">{data.bankName}</h3>
            {data.logo ? (
              <img 
                src={data.logo} 
                alt={data.bankName}
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-300/50"
              />
            ) : (
              <div className="w-10 h-10 bg-purple-500/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-purple-700 text-lg">💳</span>
              </div>
            )}
          </div>
          <p className="text-zinc-700 font-semibold">{data.accountHolder}</p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-purple-200/30">
            <p className="text-zinc-600 text-xs mb-2 uppercase tracking-wide">Account Number</p>
            <p className="text-2xl font-mono font-bold text-zinc-800 tracking-wider">{data.accountNumber}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {data.ifscCode && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-purple-200/20">
                <p className="text-zinc-600 text-xs mb-1">IFSC</p>
                <p className="font-mono font-semibold text-zinc-800">{data.ifscCode}</p>
              </div>
            )}
            {data.routingNumber && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-purple-200/20">
                <p className="text-zinc-600 text-xs mb-1">Routing</p>
                <p className="font-mono font-semibold text-zinc-800">{data.routingNumber}</p>
              </div>
            )}
          </div>
          
          {data.upiId && (
            <div className="bg-purple-500/20 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
              <p className="text-purple-700 text-xs mb-1 font-semibold uppercase">UPI ID</p>
              <p className="text-purple-900 font-bold">{data.upiId}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

