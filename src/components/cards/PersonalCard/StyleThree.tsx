import { PersonalCard } from '@/types/card';

interface StyleThreeProps {
  card: PersonalCard;
}

export default function StyleThree({ card }: StyleThreeProps) {
  const { data } = card;
  
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-zinc-200">
      {/* Top Section with Circular Image */}
      <div className="bg-linear-to-br from-purple-100 via-pink-100 to-blue-100 p-8 pb-16 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/50 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-200/50 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          {data.image ? (
            <div className="relative mb-6">
              <div className="w-36 h-36 rounded-full overflow-hidden border-8 border-white shadow-2xl ring-4 ring-purple-200">
                <img 
                  src={data.image} 
                  alt={data.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 right-4 w-14 h-14 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full border-4 border-white flex items-center justify-center shadow-xl">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
          ) : (
            <div className="relative mb-6">
              <div className="w-36 h-36 rounded-full border-8 border-white shadow-2xl ring-4 ring-purple-200 bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                <span className="text-7xl">👤</span>
              </div>
              <div className="absolute -bottom-2 right-4 w-14 h-14 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full border-4 border-white flex items-center justify-center shadow-xl">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
          )}
          
          <h2 className="text-4xl font-bold text-zinc-900 mb-2 text-center">{data.name}</h2>
          {data.birthday && (
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full">
              <span className="text-xl">🎂</span>
              <span className="text-zinc-700 font-semibold">{data.birthday}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom Details Section */}
      <div className="p-8 -mt-8 space-y-4">
        {/* Contact Cards */}
        <div className="grid grid-cols-2 gap-3">
          {data.email && (
            <div className="p-4 bg-linear-to-br from-purple-50 to-purple-100 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="text-purple-600 text-2xl mb-2">✉</div>
              <p className="text-xs text-zinc-500 mb-1 font-medium">Email</p>
              <a href={`mailto:${data.email}`} className="text-zinc-800 font-bold text-xs truncate block hover:text-purple-600">
                {data.email}
              </a>
            </div>
          )}
          {data.phone && (
            <div className="p-4 bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="text-blue-600 text-2xl mb-2">📱</div>
              <p className="text-xs text-zinc-500 mb-1 font-medium">Phone</p>
              <a href={`tel:${data.phone}`} className="text-zinc-800 font-bold text-xs hover:text-blue-600">
                {data.phone}
              </a>
            </div>
          )}
          {data.website && (
            <div className="p-4 bg-linear-to-br from-green-50 to-green-100 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="text-green-600 text-2xl mb-2">🌐</div>
              <p className="text-xs text-zinc-500 mb-1 font-medium">Website</p>
              <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-zinc-800 font-bold text-xs truncate block hover:text-green-600">
                {data.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {data.address && (
            <div className="p-4 bg-linear-to-br from-orange-50 to-orange-100 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="text-orange-600 text-2xl mb-2">📍</div>
              <p className="text-xs text-zinc-500 mb-1 font-medium">Location</p>
              <p className="text-zinc-800 font-bold text-xs line-clamp-2">{data.address}</p>
            </div>
          )}
        </div>
        
        {/* Social Media Section */}
        {data.socialMedia && (data.socialMedia.instagram || data.socialMedia.twitter || data.socialMedia.facebook || data.socialMedia.linkedin) && (
          <div className="pt-4 border-t-2 border-zinc-200">
            <p className="text-sm font-bold text-zinc-700 mb-3 text-center">Follow Me</p>
            <div className="flex flex-wrap justify-center gap-2">
              {data.socialMedia.instagram && (
                <a
                  href={`https://instagram.com/${data.socialMedia.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-linear-to-r from-pink-500 via-purple-500 to-pink-500 text-white rounded-full hover:shadow-xl hover:scale-105 transition-all text-sm font-bold flex items-center gap-2"
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
                  className="px-4 py-2 bg-linear-to-r from-blue-400 to-blue-500 text-white rounded-full hover:shadow-xl hover:scale-105 transition-all text-sm font-bold flex items-center gap-2"
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
                  className="px-4 py-2 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-full hover:shadow-xl hover:scale-105 transition-all text-sm font-bold flex items-center gap-2"
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
                  className="px-4 py-2 bg-linear-to-r from-indigo-600 to-indigo-700 text-white rounded-full hover:shadow-xl hover:scale-105 transition-all text-sm font-bold flex items-center gap-2"
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
