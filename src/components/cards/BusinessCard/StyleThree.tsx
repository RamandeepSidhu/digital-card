import { BusinessCard } from '@/types/card';

interface StyleThreeProps {
  card: BusinessCard;
}

export default function StyleThree({ card }: StyleThreeProps) {
  const { data } = card;
  
  return (
    <div className="w-full max-w-md mx-auto bg-linear-to-br from-purple-600 via-purple-700 to-pink-600 rounded-3xl shadow-2xl overflow-hidden text-white relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="relative z-10 p-8">
        {/* Circular Image with Badge */}
        <div className="flex flex-col items-center mb-8">
          {data.image ? (
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl ring-4 ring-white/20">
                <img 
                  src={data.image} 
                  alt={data.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full border-4 border-purple-700 flex items-center justify-center shadow-xl">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
          ) : (
            <div className="relative mb-6">
              <div className="w-32 h-32 bg-white/20 rounded-full border-4 border-white/30 shadow-2xl ring-4 ring-white/20 flex items-center justify-center">
                <span className="text-6xl">👤</span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full border-4 border-purple-700 flex items-center justify-center shadow-xl">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
          )}
          
          <h2 className="text-4xl font-bold mb-2 text-center">{data.name}</h2>
          <p className="text-xl text-white/90 mb-2 text-center">{data.title}</p>
          <div className="px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full">
            <p className="text-white/90 font-semibold">{data.company}</p>
          </div>
        </div>
        
        {/* Glass Morphism Contact Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 space-y-4 border border-white/20">
          {data.email && (
            <div className="flex items-center gap-4 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg">✉</span>
              </div>
              <a href={`mailto:${data.email}`} className="text-white font-semibold hover:underline flex-1 truncate">
                {data.email}
              </a>
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-4 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg">📞</span>
              </div>
              <a href={`tel:${data.phone}`} className="text-white font-semibold hover:underline flex-1">
                {data.phone}
              </a>
            </div>
          )}
          {data.website && (
            <div className="flex items-center gap-4 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🌐</span>
              </div>
              <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-white font-semibold hover:underline flex-1 truncate">
                {data.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {data.linkedin && (
            <div className="flex items-center gap-4 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg">💼</span>
              </div>
              <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-white font-semibold hover:underline flex-1 truncate">
                Connect on LinkedIn
              </a>
            </div>
          )}
          {data.address && (
            <div className="flex items-start gap-4 p-3 bg-white/10 rounded-xl">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg">📍</span>
              </div>
              <p className="text-white font-semibold flex-1">{data.address}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
