'use client';

import { useState } from 'react';
import { Booking } from '@/types';
import { createReview } from '@/lib/firebase/database';

interface ReviewModalProps {
  booking: Booking;
  onClose: () => void;
  onReviewSubmitted: () => void;
}

export default function ReviewModal({ booking, onClose, onReviewSubmitted }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      setError('Please write a review comment');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      await createReview({
        bookingId: booking.id,
        customerId: booking.customerId,
        customerName: booking.customerName,
        artistId: booking.artistId,
        artistName: booking.artistName,
        rating,
        comment: comment.trim(),
      });

      onReviewSubmitted();
      onClose();
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Leave a Review</h2>
            <p className="text-sm text-gray-600 mt-1">
              How was your experience with {booking.artistName}?
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Rating Stars */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="text-4xl transition-all focus:outline-none"
                  disabled={isSubmitting}
                >
                  <span
                    className={
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this artist..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={4}
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Booking Info */}
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Date:</span> {booking.date}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Time:</span> {booking.time}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Service:</span> {booking.description}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
