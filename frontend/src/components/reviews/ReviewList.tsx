"use client";

import Card from "@/components/ui/Card";
import type { Review } from "../../../../shared/types";
import { format } from "date-fns";

interface ReviewListProps {
  reviews: Review[];
  title?: string;
}

export default function ReviewList({
  reviews,
  title = "Reviews",
}: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <Card title={title}>
        <p className="text-gray-600 text-center py-4">No reviews yet</p>
      </Card>
    );
  }

  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <Card title={`${title} (${reviews.length})`}>
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-xl ${
                  star <= Math.round(averageRating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-600">
            ({reviews.length} reviews)
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-4 last:border-b-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold">{review.reviewerName}</p>
                <p className="text-sm text-gray-600">
                  {format(new Date(review.createdAt), "MMM dd, yyyy")}
                </p>
              </div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-lg ${
                      star <= review.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            {review.comment && (
              <p className="text-gray-700 mt-2">{review.comment}</p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
