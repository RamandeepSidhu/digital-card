import { BusinessCard } from '@/types/card';

interface StyleFiveProps {
  card: BusinessCard;
}

export default function StyleFive({ card }: StyleFiveProps) {
  const { data } = card;
  
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100 relative">
      {/* Premium Top Section with Elegant Design */}
      <div className="relative h-64 bg-linear-to-br from-slate-900 via-purple-900 to-indigo-900 overflow-hidden">
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Profile Section */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center pt-8 pb-6">
          {data.image ? (
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-4 ring-purple-500/30">
                <img 
                  src={data.image} 
                  alt={data.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-linear-to-br from-emerald-400 to-teal-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          ) : (
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl ring-4 ring-purple-500/30 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <span className="text-6xl">👤</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-linear-to-br from-emerald-400 to-teal-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}
          
          <h2 className="text-3xl font-bold text-white mb-1 px-4 text-center">{data.name}</h2>
          <p className="text-purple-200 text-sm font-medium">{data.title}</p>
        </div>
      </div>
      
      {/* Elegant White Body Section */}
      <div className="bg-white px-8 py-8">
        <div className="text-center mb-6 pb-6 border-b-2 border-gray-100">
          <p className="text-gray-700 text-lg font-semibold">{data.company}</p>
        </div>
        
        {/* Premium Contact Cards */}
        <div className="space-y-4">
          {data.email && (
            <div className="flex items-center gap-4 p-4 bg-linear-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
              <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-gray-800 font-semibold flex-1 truncate">{data.email}</span>
            </div>
          )}
          
          {data.phone && (
            <div className="flex items-center gap-4 p-4 bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
              <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span className="text-gray-800 font-semibold flex-1">{data.phone}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

