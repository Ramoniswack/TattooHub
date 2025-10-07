'use client';

import { useEffect, useState } from 'react';
import { Review } from '@/types';
import { getArtistReviews } from '@/lib/firebase/database';
import { format } from 'date-fns';
import { Star, User } from 'lucide-react';

interface ReviewsListProps {
  artistId: string;
  artistName: string;
}

export default function ReviewsList({ artistId, artistName }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setIsLoading(true);
        const artistReviews = await getArtistReviews(artistId);
        setReviews(artistReviews);
        
        if (artistReviews.length > 0) {
          const total = artistReviews.reduce((sum, review) => sum + review.rating, 0);
          setAverageRating(Number((total / artistReviews.length).toFixed(1)));
        }
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, [artistId]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Customer Reviews
            </h3>
            {reviews.length > 0 ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  <span className="text-3xl font-bold text-gray-900">
                    {averageRating}
                  </span>
                </div>
                <span className="text-gray-600">
                  Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            ) : (
              <p className="text-gray-600">No reviews yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 rounded-full p-2">
                    <User className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {review.customerName}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {review.createdAt ? (
                        typeof review.createdAt === 'string' 
                          ? new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : format(new Date(review.createdAt), 'MMM d, yyyy')
                      ) : 'Recent'}
                    </p>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>
              
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No reviews yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Be the first to review {artistName}!
          </p>
        </div>
      )}
    </div>
  );
}
