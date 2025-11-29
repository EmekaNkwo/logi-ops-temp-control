"use client";

import { useState } from "react";
import { useReviewStore } from "@/stores/useReviewStore";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { v4 as uuidv4 } from "uuid";

interface ReviewFormProps {
  shipmentId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: "shipper" | "carrier";
  revieweeId: string;
  revieweeName: string;
  onSuccess?: () => void;
}

export default function ReviewForm({
  shipmentId,
  reviewerId,
  reviewerName,
  reviewerRole,
  revieweeId,
  revieweeName,
  onSuccess,
}: ReviewFormProps) {
  const { createReview, loading } = useReviewStore();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReview({
        id: uuidv4(),
        shipmentId,
        reviewerId,
        reviewerName,
        reviewerRole,
        revieweeId,
        revieweeName,
        rating,
        comment,
        createdAt: new Date().toISOString(),
      });
      if (onSuccess) onSuccess();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <Card title={`Review ${revieweeName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl ${
                  star <= rating ? "text-yellow-400" : "text-gray-300"
                } hover:text-yellow-400 transition-colors`}
              >
                ★
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Selected: {rating} out of 5
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comment
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Share your experience..."
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="submit" disabled={loading}>
            {loading ? <LoadingSpinner size="sm" /> : "Submit Review"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
