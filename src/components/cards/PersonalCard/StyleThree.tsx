import { PersonalCard } from '@/types/card';

interface StyleThreeProps {
  card: PersonalCard;
}

export default function StyleThree({ card }: StyleThreeProps) {
  const { data } = card;
  
  return (
    <div className="w-full max-w-md mx-auto bg-zinc-900 rounded-lg shadow-lg overflow-hidden border border-purple-500/30">
      <div className="p-6 space-y-4">
        <div className="text-center pb-4 border-b border-purple-500/30">
          <h2 className="text-3xl font-bold text-white mb-2">{data.name}</h2>
          {data.birthday && (
            <p className="text-purple-400 text-sm">🎂 Birthday: {data.birthday}</p>
          )}
        </div>
        
        <div className="space-y-3 text-sm">
          {data.email && (
            <div className="flex items-center gap-3 text-zinc-300">
              <span className="text-purple-400 w-6">📧</span>
              <a href={`mailto:${data.email}`} className="text-purple-400 hover:text-purple-300 transition-colors">
                {data.email}
              </a>
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-3 text-zinc-300">
              <span className="text-purple-400 w-6">📱</span>
              <a href={`tel:${data.phone}`} className="text-white hover:text-purple-300 transition-colors">
                {data.phone}
              </a>
            </div>
          )}
          {data.website && (
            <div className="flex items-center gap-3 text-zinc-300">
              <span className="text-purple-400 w-6">🌐</span>
              <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">
                {data.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {data.address && (
            <div className="flex items-start gap-3 text-zinc-300">
              <span className="text-purple-400 w-6">📍</span>
              <p>{data.address}</p>
            </div>
          )}
        </div>
        
        {data.socialMedia && (
          <div className="pt-4 border-t border-purple-500/30">
            <p className="text-sm font-semibold text-purple-400 mb-3">Social Links</p>
            <div className="grid grid-cols-2 gap-2">
              {data.socialMedia.instagram && (
                <a
                  href={`https://instagram.com/${data.socialMedia.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-purple-900/50 border border-purple-500/50 rounded hover:bg-purple-900/70 transition-colors text-center text-sm text-white"
                >
                  📷 Instagram
                </a>
              )}
              {data.socialMedia.twitter && (
                <a
                  href={`https://twitter.com/${data.socialMedia.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-purple-900/50 border border-purple-500/50 rounded hover:bg-purple-900/70 transition-colors text-center text-sm text-white"
                >
                  🐦 Twitter
                </a>
              )}
              {data.socialMedia.facebook && (
                <a
                  href={`https://facebook.com/${data.socialMedia.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-purple-900/50 border border-purple-500/50 rounded hover:bg-purple-900/70 transition-colors text-center text-sm text-white"
                >
                  👥 Facebook
                </a>
              )}
              {data.socialMedia.linkedin && (
                <a
                  href={data.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-purple-900/50 border border-purple-500/50 rounded hover:bg-purple-900/70 transition-colors text-center text-sm text-white"
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

