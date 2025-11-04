import { PersonalCard } from '@/types/card';

interface StyleTwoProps {
  card: PersonalCard;
}

export default function StyleTwo({ card }: StyleTwoProps) {
  const { data } = card;
  
  return (
    <div className="w-full max-w-md mx-auto bg-linear-to-br from-zinc-900 via-zinc-800 to-purple-900 rounded-3xl shadow-2xl overflow-hidden border border-purple-500/30">
      <div className="p-8">
        {/* Side-by-side Layout */}
        <div className="flex gap-6 mb-8">
          {data.image ? (
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-purple-500/50 shadow-2xl ring-2 ring-purple-400/30">
                  <img 
                    src={data.image} 
                    alt={data.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-zinc-900 flex items-center justify-center">
                  <span className="text-sm">✨</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-linear-to-br from-purple-500 to-pink-500 rounded-3xl border-4 border-purple-500/50 shadow-2xl ring-2 ring-purple-400/30 flex items-center justify-center">
                <span className="text-6xl">👤</span>
              </div>
            </div>
          )}
          
          <div className="flex-1 min-w-0 pt-2">
            <h2 className="text-3xl font-bold text-white mb-3 leading-tight">{data.name}</h2>
            {data.birthday && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎂</span>
                <span className="text-purple-300 font-medium">{data.birthday}</span>
              </div>
            )}
            <div className="h-1 w-24 bg-linear-to-r from-purple-400 to-pink-400 rounded-full"></div>
          </div>
        </div>
        
        {/* Contact Info Cards */}
        <div className="space-y-3">
          {data.email && (
            <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <span className="text-xl">✉</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-purple-300 mb-1">Email</p>
                <a href={`mailto:${data.email}`} className="text-white font-semibold hover:text-purple-300 transition-colors truncate block">
                  {data.email}
                </a>
              </div>
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <span className="text-xl">📱</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-purple-300 mb-1">Phone</p>
                <a href={`tel:${data.phone}`} className="text-white font-semibold hover:text-purple-300 transition-colors">
                  {data.phone}
                </a>
              </div>
            </div>
          )}
          {data.website && (
            <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-linear-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <span className="text-xl">🌐</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-purple-300 mb-1">Website</p>
                <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-white font-semibold hover:text-purple-300 transition-colors truncate block">
                  {data.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            </div>
          )}
          {data.address && (
            <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
                <span className="text-xl">📍</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-purple-300 mb-1">Address</p>
                <p className="text-white font-semibold">{data.address}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Social Media Pills */}
        {data.socialMedia && (data.socialMedia.instagram || data.socialMedia.twitter || data.socialMedia.facebook || data.socialMedia.linkedin) && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-sm font-bold text-purple-300 mb-4">Social Links</p>
            <div className="flex flex-wrap gap-2">
              {data.socialMedia.instagram && (
                <a
                  href={`https://instagram.com/${data.socialMedia.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-linear-to-r from-pink-600 to-purple-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all text-sm font-semibold"
                >
                  📷 Instagram
                </a>
              )}
              {data.socialMedia.twitter && (
                <a
                  href={`https://twitter.com/${data.socialMedia.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all text-sm font-semibold"
                >
                  🐦 Twitter
                </a>
              )}
              {data.socialMedia.facebook && (
                <a
                  href={`https://facebook.com/${data.socialMedia.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-linear-to-r from-blue-700 to-blue-800 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all text-sm font-semibold"
                >
                  👥 Facebook
                </a>
              )}
              {data.socialMedia.linkedin && (
                <a
                  href={data.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-linear-to-r from-indigo-600 to-indigo-700 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all text-sm font-semibold"
                >
                  💼 LinkedIn
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
