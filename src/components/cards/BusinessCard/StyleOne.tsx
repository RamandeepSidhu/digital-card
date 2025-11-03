import { BusinessCard } from '@/types/card';

interface StyleOneProps {
  card: BusinessCard;
}

export default function StyleOne({ card }: StyleOneProps) {
  const { data } = card;
  
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden border border-zinc-200">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
        <div className="flex items-center gap-4">
          {data.image && (
            <img 
              src={data.image} 
              alt={data.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold mb-1">{data.name}</h2>
            <p className="text-purple-100 text-sm">{data.title}</p>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <p className="text-sm text-zinc-600 font-semibold mb-1">Company</p>
          <p className="text-zinc-900">{data.company}</p>
        </div>
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
          {data.linkedin && (
            <div className="flex items-start">
              <span className="text-zinc-600 w-16">LinkedIn:</span>
              <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                {data.linkedin.replace(/^https?:\/\/www\.|^https?:\/\//, '')}
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
      </div>
    </div>
  );
}

