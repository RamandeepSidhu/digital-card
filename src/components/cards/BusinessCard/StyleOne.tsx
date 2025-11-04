import { BusinessCard } from '@/types/card';

interface StyleOneProps {
  card: BusinessCard;
}

export default function StyleOne({ card }: StyleOneProps) {
  const { data } = card;
  
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-200">
      {/* Large Image Section */}
      {data.image ? (
        <div className="relative h-48 bg-linear-to-br from-purple-400 to-pink-400 overflow-hidden">
          <img 
            src={data.image} 
            alt={data.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h2 className="text-3xl font-bold mb-1 drop-shadow-lg">{data.name}</h2>
            <p className="text-white/90 text-lg">{data.title}</p>
          </div>
        </div>
      ) : (
        <div className="h-48 bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">👤</span>
            </div>
            <h2 className="text-3xl font-bold mb-1">{data.name}</h2>
            <p className="text-white/90 text-lg">{data.title}</p>
          </div>
        </div>
      )}
      
      {/* Details Section */}
      <div className="p-6 space-y-4 bg-linear-to-b from-white to-zinc-50">
        <div className="pb-4 border-b border-zinc-200">
          <p className="text-sm text-zinc-500 mb-1">Company</p>
          <p className="text-xl font-bold text-zinc-900">{data.company}</p>
        </div>
        
        <div className="space-y-3">
          {data.email && (
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                <span className="text-lg">✉</span>
              </div>
              <a href={`mailto:${data.email}`} className="text-zinc-700 hover:text-purple-600 font-medium flex-1">
                {data.email}
              </a>
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                <span className="text-lg">📞</span>
              </div>
              <a href={`tel:${data.phone}`} className="text-zinc-700 hover:text-blue-600 font-medium flex-1">
                {data.phone}
              </a>
            </div>
          )}
          {data.website && (
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
                <span className="text-lg">🌐</span>
              </div>
              <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-zinc-700 hover:text-green-600 font-medium flex-1 truncate">
                {data.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {data.linkedin && (
            <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
              <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
                <span className="text-lg">💼</span>
              </div>
              <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-zinc-700 hover:text-indigo-600 font-medium flex-1 truncate">
                LinkedIn Profile
              </a>
            </div>
          )}
          {data.address && (
            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                <span className="text-lg">📍</span>
              </div>
              <p className="text-zinc-700 font-medium">{data.address}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
