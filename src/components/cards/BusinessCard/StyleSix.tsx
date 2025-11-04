import { BusinessCard } from '@/types/card';

interface StyleSixProps {
  card: BusinessCard;
}

export default function StyleSix({ card }: StyleSixProps) {
  const { data } = card;
  
  return (
    <div className="w-full max-w-md mx-auto bg-linear-to-br from-rose-500 via-pink-500 to-purple-600 rounded-3xl shadow-2xl overflow-hidden text-white relative">
      {/* Premium Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-8">
        {/* Premium Header with Badge */}
        <div className="flex items-start justify-between mb-6">
          <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
            <span className="text-xs font-bold uppercase tracking-wider">Premium</span>
          </div>
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>

        {/* Profile Image with Premium Frame */}
        <div className="flex flex-col items-center mb-8">
          {data.image ? (
            <div className="relative mb-6">
              <div className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-white/50 shadow-2xl transform rotate-3">
                <img 
                  src={data.image} 
                  alt={data.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-3 -right-3 w-16 h-16 bg-linear-to-br from-yellow-300 to-orange-400 rounded-2xl border-4 border-white shadow-2xl flex items-center justify-center transform -rotate-12">
                <span className="text-3xl">✨</span>
              </div>
            </div>
          ) : (
            <div className="relative mb-6">
              <div className="w-40 h-40 rounded-3xl border-4 border-white/50 shadow-2xl transform rotate-3 bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-8xl">👤</span>
              </div>
              <div className="absolute -top-3 -right-3 w-16 h-16 bg-linear-to-br from-yellow-300 to-orange-400 rounded-2xl border-4 border-white shadow-2xl flex items-center justify-center transform -rotate-12">
                <span className="text-3xl">✨</span>
              </div>
            </div>
          )}
          
          <h2 className="text-5xl font-black mb-3 text-center drop-shadow-lg">
            {data.name}
          </h2>
          <div className="px-6 py-2 bg-white/25 backdrop-blur-md rounded-full border border-white/40 mb-2">
            <p className="text-lg font-bold">{data.title}</p>
          </div>
          <p className="text-xl text-white/90 font-semibold">{data.company}</p>
        </div>
        
        {/* Premium Contact Section */}
        <div className="space-y-3">
          {data.email && (
            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-5 border-2 border-white/30 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/30 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-white font-bold text-lg flex-1 truncate">{data.email}</span>
              </div>
            </div>
          )}
          
          {data.phone && (
            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-5 border-2 border-white/30 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/30 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="text-white font-bold text-lg flex-1">{data.phone}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

