import { PersonalCard } from '@/types/card';

interface StyleOneProps {
  card: PersonalCard;
}

export default function StyleOne({ card }: StyleOneProps) {
  const { data } = card;
  
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden border border-zinc-200">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
        <h2 className="text-2xl font-bold mb-1">{data.name}</h2>
        {data.birthday && (
          <p className="text-purple-100 text-sm">🎂 {data.birthday}</p>
        )}
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 gap-3 text-sm">
          {data.email && (
            <div className="flex items-start">
              <span className="text-zinc-600 w-16">Email:</span>
              <a href={`mailto:${data.email}`} className="text-purple-600 hover:underline">
                {data.email}
              </a>
            </div>
          )}
          {data.phone && (
            <div className="flex items-start">
              <span className="text-zinc-600 w-16">Phone:</span>
              <a href={`tel:${data.phone}`} className="text-zinc-900">
                {data.phone}
              </a>
            </div>
          )}
          {data.website && (
            <div className="flex items-start">
              <span className="text-zinc-600 w-16">Web:</span>
              <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                {data.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {data.address && (
            <div className="flex items-start">
              <span className="text-zinc-600 w-16">Address:</span>
              <p className="text-zinc-900">{data.address}</p>
            </div>
          )}
        </div>
        
        {data.socialMedia && (
          <div className="pt-4 border-t border-zinc-200">
            <p className="text-sm text-zinc-600 font-semibold mb-2">Social Media</p>
            <div className="flex flex-wrap gap-3">
              {data.socialMedia.instagram && (
                <a
                  href={`https://instagram.com/${data.socialMedia.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline text-sm"
                >
                  📷 {data.socialMedia.instagram}
                </a>
              )}
              {data.socialMedia.twitter && (
                <a
                  href={`https://twitter.com/${data.socialMedia.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline text-sm"
                >
                  🐦 {data.socialMedia.twitter}
                </a>
              )}
              {data.socialMedia.facebook && (
                <a
                  href={`https://facebook.com/${data.socialMedia.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline text-sm"
                >
                  👥 {data.socialMedia.facebook}
                </a>
              )}
              {data.socialMedia.linkedin && (
                <a
                  href={data.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline text-sm"
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

