import { PersonalCard } from '@/types/card';

interface StyleOneProps {
  card: PersonalCard;
}

export default function StyleOne({ card }: StyleOneProps) {
  const { data } = card;
  
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-200">
      {/* Large Banner Image Section */}
      {data.image ? (
        <div className="relative h-56 bg-linear-to-br from-blue-400 to-cyan-400 overflow-hidden">
          <img 
            src={data.image} 
            alt={data.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">{data.name}</h2>
            {data.birthday && (
              <div className="flex items-center gap-2 text-white/90">
                <span className="text-xl">🎂</span>
                <span>{data.birthday}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="h-56 bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-6xl">👤</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">{data.name}</h2>
            {data.birthday && (
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl">🎂</span>
                <span>{data.birthday}</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Contact Details */}
      <div className="p-6 space-y-4 bg-linear-to-b from-white to-blue-50">
        <div className="grid grid-cols-2 gap-3">
          {data.email && (
            <div className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
              <div className="text-blue-600 text-2xl mb-2">✉</div>
              <p className="text-xs text-zinc-500 mb-1">Email</p>
              <a href={`mailto:${data.email}`} className="text-zinc-700 hover:text-blue-600 font-semibold text-sm truncate block">
                {data.email}
              </a>
            </div>
          )}
          {data.phone && (
            <div className="p-4 bg-cyan-50 rounded-xl hover:bg-cyan-100 transition-colors">
              <div className="text-cyan-600 text-2xl mb-2">📱</div>
              <p className="text-xs text-zinc-500 mb-1">Phone</p>
              <a href={`tel:${data.phone}`} className="text-zinc-700 hover:text-cyan-600 font-semibold text-sm">
                {data.phone}
              </a>
            </div>
          )}
          {data.website && (
            <div className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
              <div className="text-green-600 text-2xl mb-2">🌐</div>
              <p className="text-xs text-zinc-500 mb-1">Website</p>
              <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-zinc-700 hover:text-green-600 font-semibold text-sm truncate block">
                {data.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {data.address && (
            <div className="p-4 bg-orange-50 rounded-xl">
              <div className="text-orange-600 text-2xl mb-2">📍</div>
              <p className="text-xs text-zinc-500 mb-1">Address</p>
              <p className="text-zinc-700 font-semibold text-sm line-clamp-2">{data.address}</p>
            </div>
          )}
        </div>
        
        {/* Social Media Section */}
        {data.socialMedia && (data.socialMedia.instagram || data.socialMedia.twitter || data.socialMedia.facebook || data.socialMedia.linkedin) && (
          <div className="pt-4 border-t border-zinc-200">
            <p className="text-sm font-bold text-zinc-700 mb-3">Connect With Me</p>
            <div className="flex flex-wrap gap-2">
              {data.socialMedia.instagram && (
                <a
                  href={`https://instagram.com/${data.socialMedia.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-linear-to-r from-pink-500 to-purple-500 text-white rounded-full hover:shadow-lg transition-all text-sm font-semibold flex items-center gap-2"
                >
                  <span>📷</span>
                  <span>Instagram</span>
                </a>
              )}
              {data.socialMedia.twitter && (
                <a
                  href={`https://twitter.com/${data.socialMedia.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-linear-to-r from-blue-400 to-blue-500 text-white rounded-full hover:shadow-lg transition-all text-sm font-semibold flex items-center gap-2"
                >
                  <span>🐦</span>
                  <span>Twitter</span>
                </a>
              )}
              {data.socialMedia.facebook && (
                <a
                  href={`https://facebook.com/${data.socialMedia.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-full hover:shadow-lg transition-all text-sm font-semibold flex items-center gap-2"
                >
                  <span>👥</span>
                  <span>Facebook</span>
                </a>
              )}
              {data.socialMedia.linkedin && (
                <a
                  href={data.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-linear-to-r from-indigo-600 to-indigo-700 text-white rounded-full hover:shadow-lg transition-all text-sm font-semibold flex items-center gap-2"
                >
                  <span>💼</span>
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
