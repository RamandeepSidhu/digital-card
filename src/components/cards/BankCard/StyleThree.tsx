import { BankCard } from '@/types/card';

interface StyleThreeProps {
  card: BankCard;
}

export default function StyleThree({ card }: StyleThreeProps) {
  const { data } = card;
  
  return (
    <div className="w-full max-w-md mx-auto bg-linear-to-br from-zinc-900 via-zinc-800 to-black rounded-xl shadow-2xl overflow-hidden border border-purple-500/20">
      <div className="relative p-8">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-purple-400 text-xs mb-2 uppercase tracking-widest">Bank Name</p>
              <p className="text-2xl font-bold text-white">{data.bankName}</p>
            </div>
            {data.logo ? (
              <img 
                src={data.logo} 
                alt={data.bankName}
                className="w-14 h-14 rounded-xl object-cover border-2 border-purple-500/50 shadow-lg"
              />
            ) : (
              <div className="w-14 h-14 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
                <span className="text-white text-2xl">💳</span>
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <p className="text-zinc-400 text-xs mb-2 uppercase tracking-wide">Account Holder</p>
            <p className="text-xl font-semibold text-white">{data.accountHolder}</p>
          </div>
          
          <div className="bg-zinc-800/50 rounded-xl p-5 mb-4 border border-purple-500/30">
            <p className="text-purple-400 text-xs mb-3 uppercase tracking-wide">Account Number</p>
            <p className="text-3xl font-mono font-bold text-white tracking-wider">{data.accountNumber}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            {data.ifscCode && (
              <div className="bg-zinc-800/30 rounded-lg p-4 border border-purple-500/20">
                <p className="text-purple-400 text-xs mb-2 uppercase">IFSC</p>
                <p className="font-mono font-semibold text-white">{data.ifscCode}</p>
              </div>
            )}
            {data.routingNumber && (
              <div className="bg-zinc-800/30 rounded-lg p-4 border border-purple-500/20">
                <p className="text-purple-400 text-xs mb-2 uppercase">Routing</p>
                <p className="font-mono font-semibold text-white">{data.routingNumber}</p>
              </div>
            )}
          </div>
          
          {data.upiId && (
            <div className="bg-linear-to-r from-purple-600/30 to-purple-500/30 rounded-xl p-4 border border-purple-400/40">
              <p className="text-purple-300 text-xs mb-2 uppercase tracking-wide">UPI ID</p>
              <p className="text-lg font-bold text-white">{data.upiId}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

