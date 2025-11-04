import { PersonalCard } from '@/types/card';

interface StyleOneProps {
  card: PersonalCard;
}

export default function StyleOne({ card }: StyleOneProps) {
  const { data } = card;
  
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Blue-Purple Gradient Header */}
      <div className="relative h-48 bg-linear-to-br from-blue-500 via-purple-500 to-purple-600 flex flex-col items-center justify-center pt-8 pb-6">
        {/* Avatar Circle */}
        <div className="w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center mb-4 shadow-lg">
          {data.image ? (
            <img              src={data.image} 
              alt={data.name}
              className="gradient w-full h-full rounded-full object-cover"
            />
          ) : (
            <svg className="w-16 h-16 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          )}
        </div>
        
        {/* Name */}
        <h2 className="text-2xl font-bold text-white">{data.name}</h2>
      </div>
      
      {/* Contact Information Boxes */}
      <div className="p-4 bg-white">
        <div className="grid grid-cols-2 gap-3">
          {data.email && (
            <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-mgradienttext-gray-600">Email</span>
              </div>
              <a href={`mailto:${data.email}`} className="text-sm text-gray-800 hover:text-blue-600 wrap-break-word">
                {data.email}
              </a>
            </div>
          )}
          {data.phone && (
            <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-xs font-medium text-gray-600">Phone</span>
              </div>
              <a href={`tel:${data.phone}`} className="text-sm text-gray-800 hover:text-blue-600">
                {data.phone}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
