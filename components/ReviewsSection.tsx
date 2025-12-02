import { Star } from 'lucide-react';

interface Review {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
  profileImage: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  return (
    <section className="py-20 bg-gray-50" id="resenas">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full border border-yellow-200">
              <Star className="w-4 h-4 fill-yellow-600" />
              <span className="text-sm font-semibold">TESTIMONIOS</span>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4 text-gray-900">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-center text-gray-600 text-lg mb-12">Miles de clientes satisfechos confían en nosotros</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((review) => (
              <div 
                key={review.id} 
                className="group bg-white p-6 rounded-2xl border-2 border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <img 
                      src={review.profileImage} 
                      alt={review.customerName}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-purple-200 transition-all"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{review.customerName}</p>
                    <StarRating rating={review.rating} />
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">&ldquo;{review.comment}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
