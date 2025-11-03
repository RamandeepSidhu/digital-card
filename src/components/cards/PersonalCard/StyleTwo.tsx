import { PersonalCard } from '@/types/card';

interface StyleTwoProps {
  card: PersonalCard;
}

export default function StyleTwo({ card }: StyleTwoProps) {
  const { data } = card;
  
  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg overflow-hidden text-white">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {data.image ? (
              <img 
                src={data.image} 
                alt={data.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
              />
            ) : (
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                👤
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold mb-1">{data.name}</h2>
              {data.birthday && (
                <p className="text-purple-100 text-sm">🎂 {data.birthday}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-3 text-sm">
          {data.email && (
            <div className="flex items-center gap-2">
              <span className="w-5">📧</span>
              <a href={`mailto:${data.email}`} className="hover:underline">
                {data.email}
              </a>
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-2">
              <span className="w-5">📱</span>
              <a href={`tel:${data.phone}`} className="hover:underline">
                {data.phone}
              </a>
            </div>
          )}
          {data.website && (
            <div className="flex items-center gap-2">
              <span className="w-5">🌐</span>
              <a href={data.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {data.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {data.address && (
            <div className="flex items-start gap-2">
              <span className="w-5">📍</span>
              <p className="text-purple-100">{data.address}</p>
            </div>
          )}
        </div>
        
        {data.socialMedia && (
          <div className="mt-6 pt-4 border-t border-white/20">
            <p className="text-sm font-semibold mb-3">Connect with me</p>
            <div className="flex flex-wrap gap-2">
              {data.socialMedia.instagram && (
                <a
                  href={`https://instagram.com/${data.socialMedia.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors text-sm"
                >
                  📷 Instagram
                </a>
              )}
              {data.socialMedia.twitter && (
                <a
                  href={`https://twitter.com/${data.socialMedia.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors text-sm"
                >
                  🐦 Twitter
                </a>
              )}
              {data.socialMedia.facebook && (
                <a
                  href={`https://facebook.com/${data.socialMedia.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors text-sm"
                >
                  👥 Facebook
                </a>
              )}
              {data.socialMedia.linkedin && (
                <a
                  href={data.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors text-sm"
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

