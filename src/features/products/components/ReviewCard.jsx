import React from "react";

export default function ReviewCard({ review }) {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-5 h-5 ${
            i <= Math.round(rating)
              ? "text-amber-400 fill-current"
              : "text-gray-300 fill-current"
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>,
      );
    }
    return stars;
  };
  return (
    <div
      key={review.id}
      className="border border-gray-200 rounded-2xl p-5 shadow  hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-semibold">
            {review.user.charAt(0)}
          </div>

          <div>
            <p className="font-semibold text-gray-900">{review.user}</p>
            <p className="text-xs text-gray-500">
              {new Date(review.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex">{renderStars(review.rating)}</div>
      </div>

      {/* Comment */}
      <p className="text-gray-600 leading-relaxed">{review.comment}</p>
    </div>
  );
}
