import { BusinessCard } from '@/types/card';

interface StyleTwoProps {
  card: BusinessCard;
}

export default function StyleTwo({ card }: StyleTwoProps) {
  const { data } = card;
  
  return (
    <div className="w-full max-w-md mx-auto bg-linear-to-br from-zinc-50 via-white to-purple-50 rounded-2xl shadow-xl overflow-hidden border-l-4 border-purple-500">
      <div className="p-8">
        {/* Horizontal Layout with Side Image */}
        <div className="flex gap-6 mb-8">
          {data.image ? (
            <div className="shrink-0">
              <div className="relative">
                <img 
                  src={data.image} 
                  alt={data.name}
                  className="w-28 h-28 rounded-2xl object-cover shadow-xl border-4 border-white"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-500 rounded-full border-4 border-white flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="shrink-0">
              <div className="w-28 h-28 bg-linear-to-br from-purple-400 to-pink-400 rounded-2xl shadow-xl border-4 border-white flex items-center justify-center">
                <span className="text-5xl">👤</span>
              </div>
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h2 className="text-3xl font-bold text-zinc-900 mb-2 leading-tight">{data.name}</h2>
            <div className="h-1.5 w-16 bg-linear-to-r from-purple-500 to-pink-500 rounded-full mb-3"></div>
            <p className="text-lg text-zinc-700 font-semibold mb-1">{data.title}</p>
            <p className="text-zinc-600 font-medium">{data.company}</p>
          </div>
        </div>
        
        {/* Contact Grid */}
        <div className="grid grid-cols-1 gap-3 pt-6 border-t-2 border-zinc-200">
          {data.email && (
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-md">
                <span className="text-xl">✉</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-500 mb-1">Email</p>
                <span className="text-zinc-900 font-semibold truncate block">
                  {data.email}
                </span>
              </div>
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-md">
                <span className="text-xl">📞</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-500 mb-1">Phone</p>
                <span className="text-zinc-900 font-semibold">
                  {data.phone}
                </span>
              </div>
            </div>
          )}
          {data.website && (
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-linear-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-md">
                <span className="text-xl">🌐</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-500 mb-1">Website</p>
                <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-zinc-900 font-semibold hover:text-green-600 transition-colors truncate block">
                  {data.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            </div>
          )}
          {data.linkedin && (
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md">
                <span className="text-xl">💼</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-500 mb-1">LinkedIn</p>
                <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-zinc-900 font-semibold hover:text-indigo-600 transition-colors truncate block">
                  View Profile
                </a>
              </div>
            </div>
          )}
          {data.address && (
            <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-md shrink-0">
                <span className="text-xl">📍</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-500 mb-1">Address</p>
                <p className="text-zinc-900 font-semibold">{data.address}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
