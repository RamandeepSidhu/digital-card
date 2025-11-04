import { BusinessCard } from '@/types/card';

interface StyleFourProps {
  card: BusinessCard;
}

export default function StyleFour({ card }: StyleFourProps) {
  const { data } = card;
  
  return (
    <div className="w-full max-w-md mx-auto bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-3xl shadow-2xl overflow-hidden text-white relative">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative z-10 p-8">
        {/* Premium Header with Elegant Typography */}
        <div className="mb-8 text-center">
          {data.image ? (
            <div className="relative inline-block mb-6">
              <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white/40 shadow-2xl ring-4 ring-white/10">
                <img 
                  src={data.image} 
                  alt={data.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-2 -right-2 w-14 h-14 bg-linear-to-br from-gold-400 to-orange-500 rounded-full border-4 border-indigo-900 flex items-center justify-center shadow-2xl">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          ) : (
            <div className="relative inline-block mb-6">
              <div className="w-36 h-36 bg-white/20 rounded-full border-4 border-white/40 shadow-2xl ring-4 ring-white/10 flex items-center justify-center backdrop-blur-sm">
                <span className="text-7xl">👤</span>
              </div>
              <div className="absolute -top-2 -right-2 w-14 h-14 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full border-4 border-indigo-900 flex items-center justify-center shadow-2xl">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          )}
          
          <h2 className="text-5xl font-extrabold mb-3 bg-linear-to-r from-white to-purple-200 bg-clip-text text-transparent">
            {data.name}
          </h2>
          <div className="inline-block px-6 py-2 bg-white/15 backdrop-blur-md rounded-full border border-white/30 mb-3">
            <p className="text-lg font-semibold text-white/95">{data.title}</p>
          </div>
          <p className="text-xl text-purple-200 font-medium">{data.company}</p>
        </div>
        
        {/* Premium Contact Section with Glass Morphism */}
        <div className="space-y-3">
          {data.email && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-white font-medium flex-1 truncate">{data.email}</span>
              </div>
            </div>
          )}
          
          {data.phone && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="text-white font-medium flex-1">{data.phone}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

