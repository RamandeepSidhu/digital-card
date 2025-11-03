import { BusinessCard } from '@/types/card';

interface StyleTwoProps {
  card: BusinessCard;
}

export default function StyleTwo({ card }: StyleTwoProps) {
  const { data } = card;
  
  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-zinc-50 to-white rounded-xl shadow-xl overflow-hidden border-l-4 border-purple-600">
      <div className="p-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-zinc-900 mb-2">{data.name}</h2>
          <div className="h-1 w-20 bg-purple-600 mb-3"></div>
          <p className="text-lg text-zinc-600 font-semibold">{data.title}</p>
          <p className="text-zinc-500 mt-1">{data.company}</p>
        </div>
        
        <div className="space-y-4 pt-4 border-t border-zinc-200">
          {data.email && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm">✉</span>
              </div>
              <a href={`mailto:${data.email}`} className="text-zinc-700 hover:text-purple-600 transition-colors">
                {data.email}
              </a>
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm">📞</span>
              </div>
              <a href={`tel:${data.phone}`} className="text-zinc-700">
                {data.phone}
              </a>
            </div>
          )}
          {data.website && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm">🌐</span>
              </div>
              <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                {data.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {data.linkedin && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm">💼</span>
              </div>
              <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                LinkedIn Profile
              </a>
            </div>
          )}
          {data.address && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                <span className="text-purple-600 text-sm">📍</span>
              </div>
              <p className="text-zinc-700">{data.address}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

