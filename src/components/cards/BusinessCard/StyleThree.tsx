import { BusinessCard } from '@/types/card';

interface StyleThreeProps {
  card: BusinessCard;
}

export default function StyleThree({ card }: StyleThreeProps) {
  const { data } = card;
  
  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-2xl shadow-2xl overflow-hidden text-white">
      <div className="p-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">{data.name}</h2>
          <p className="text-purple-100 text-lg font-medium mb-1">{data.title}</p>
          <p className="text-purple-200">{data.company}</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-4">
          {data.email && (
            <div>
              <p className="text-purple-200 text-xs uppercase mb-1">Email</p>
              <a href={`mailto:${data.email}`} className="text-white font-semibold hover:underline">
                {data.email}
              </a>
            </div>
          )}
          {data.phone && (
            <div>
              <p className="text-purple-200 text-xs uppercase mb-1">Phone</p>
              <a href={`tel:${data.phone}`} className="text-white font-semibold">
                {data.phone}
              </a>
            </div>
          )}
          {data.website && (
            <div>
              <p className="text-purple-200 text-xs uppercase mb-1">Website</p>
              <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-white font-semibold hover:underline">
                {data.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {data.linkedin && (
            <div>
              <p className="text-purple-200 text-xs uppercase mb-1">LinkedIn</p>
              <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-white font-semibold hover:underline">
                Connect with me
              </a>
            </div>
          )}
          {data.address && (
            <div>
              <p className="text-purple-200 text-xs uppercase mb-1">Address</p>
              <p className="text-white font-semibold">{data.address}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

