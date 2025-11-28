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
    <section className="py-16 bg-white" id="resenas">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Lo que dicen nuestros clientes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 p-6 rounded-lg shadow">
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={review.profileImage} 
                  alt={review.customerName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-800">{review.customerName}</p>
                  <StarRating rating={review.rating} />
                </div>
              </div>
              <p className="text-gray-700">&ldquo;{review.comment}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
