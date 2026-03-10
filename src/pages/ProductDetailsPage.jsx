import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getProductById,
  getReviewsByProductId,
} from "../features/products/services/productService";
import useCartStore from "../features/cart/hooks/useCartStore";
import useWishlistStore from "../features/wishlist/hooks/useWishlistStore";
import { useCompareStore } from "../features/compare/hooks/useCompareStore";
import ReviewCard from "../features/products/components/ReviewCard";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(null);
  const addToCart = useCartStore((s) => s.addToCart);
  const addToWishlist = useWishlistStore((s) => s.addToWishlist);
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(Number(id)));
  // Get comparison state and actions from the store , selectedProductA & selectedProductB store the two products being compared
  // selectProduct adds a product to comparison , disSelectProduct removes a product from comparison
  const selectedProductA = useCompareStore((s) => s.selectedProductA);
  const selectedProductB = useCompareStore((s) => s.selectedProductB);
  const selectProduct = useCompareStore((s) => s.selectProduct);
  const disSelectProduct = useCompareStore((s) => s.disSelectProduct);
  // Check if the current product is already selected for comparison
  const isSelected =
    Number(id) === selectedProductA || Number(id) === selectedProductB;
  const toggleWish = () => {
    if (isInWishlist) {
      removeFromWishlist(Number(id));
    } else {
      addToWishlist(product);
    }
  };
  // Handles adding/removing the product from the comparison list
  const toggleCompare = () => {
    if (isSelected) {
      disSelectProduct(Number(id));
    } else {
      selectProduct(Number(id));
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;
  const sortedReviews = [...reviews].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );
  const displayedReviews = showAllReviews
    ? sortedReviews
    : sortedReviews.slice(0, 5);
  useEffect(() => {
    async function load() {
      setLoading(true);
      const p = await getProductById(id);
      const r = await getReviewsByProductId(id);
      setReviews(r);
      setProduct(p);
      setLoading(false);
    }
    load();
  }, [id]);

  useEffect(() => {
    // Initialize countdown in seconds
    const now = Date.now();
    const offerEndsAt = now + 2 * 24 * 60 * 60 * 1000; // 2 days from now
    let remainingSeconds = Math.floor((offerEndsAt - now) / 1000);

    // Set initial value via setTimeout to avoid synchronous setState in effect
    const initTimeout = setTimeout(() => setCountdown(remainingSeconds), 0);

    const interval = setInterval(() => {
      remainingSeconds -= 1;
      if (remainingSeconds <= 0) {
        setCountdown(0);
        clearInterval(interval);
      } else {
        setCountdown(remainingSeconds);
      }
    }, 1000);

    return () => {
      clearTimeout(initTimeout);
      clearInterval(interval);
    };
  }, []);

  const formatCountdown = (totalSeconds) => {
    if (totalSeconds === null || totalSeconds <= 0) return null;
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { days, hours, minutes, seconds };
  };

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
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Product Not Found
        </h2>
        <Link
          to="/products"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          ← Back to Products
        </Link>
      </div>
    );
  }

  const time = formatCountdown(countdown);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-primary-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          to="/products"
          className="hover:text-primary-600 transition-colors"
        >
          Products
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium truncate">
          {product.title}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="bg-white rounded-3xl overflow-hidden border max-h-max border-gray-100 shadow-sm">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full aspect-square object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-primary-600 uppercase tracking-wide mb-2">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">{renderStars(product.rating)}</div>
            <span className="text-sm text-gray-500">
              ({product.rating} rating)
            </span>
          </div>

          {/* Price */}
          <div className="text-3xl font-bold text-gray-900 mb-6">
            ${product.price.toFixed(2)}
          </div>

          {/* Offer Countdown */}
          {time && (
            <div className="bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 mb-6">
              <p className="text-sm font-medium text-amber-800 mb-3">
                🔥 Limited Time Offer — Ends In:
              </p>
              <div className="flex gap-3">
                {[
                  { value: time.days, label: "Days" },
                  { value: time.hours, label: "Hours" },
                  { value: time.minutes, label: "Min" },
                  { value: time.seconds, label: "Sec" },
                ].map((unit) => (
                  <div
                    key={unit.label}
                    className="text-center bg-white rounded-xl px-3 py-2 shadow-sm min-w-[60px]"
                  >
                    <div className="text-xl font-bold text-gray-900">
                      {String(unit.value).padStart(2, "0")}
                    </div>
                    <div className="text-xs text-gray-500">{unit.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                product.stock > 10
                  ? "bg-emerald-500"
                  : product.stock > 0
                    ? "bg-amber-500"
                    : "bg-red-500"
              }`}
            />
            <span className="text-sm text-gray-600">
              {product.stock > 10
                ? "In Stock"
                : product.stock > 0
                  ? `Only ${product.stock} left`
                  : "Out of Stock"}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-auto flex-wrap">
            <button
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className="flex-1 px-6 py-3.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Add to Cart
            </button>
            <button
              onClick={() => toggleWish()}
              className={`px-4 py-3.5 rounded-xl border-2 transition-all ${
                isInWishlist
                  ? "border-accent-500 bg-accent-50 text-accent-500"
                  : "border-gray-200 text-gray-400 hover:border-accent-300 hover:text-accent-500"
              }`}
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleCompare();
              }}
              className={`px-4 py-3.5 rounded-xl border-2  transition-all duration-200 ${
                isSelected
                  ? "border-primary-500 bg-accent-50 text-primary-500"
                  : "border-gray-200 text-gray-400 hover:border-accent-300 hover:text-primary-500"
              }`}
            >
              <svg
                className="w-4 h-4 fill-current"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M500.609,322.275l-57.428-162.834c0.135,0.008,0.279,0.025,0.406,0.025c39.538,0.677,49.422-20.58,54.566-27.94c7.118-10.171-7.91-20.343-15.816-13.558c-7.906,6.775-29.264,21.011-70.386,2.024C374.874,102.875,309.87,73.098,271.92,67.399v-39c0-8.799-7.127-15.921-15.918-15.921c-8.795,0-15.922,7.122-15.922,15.921v39c-37.95,5.699-102.953,35.476-140.031,52.593c-41.121,18.987-62.48,4.751-70.386-2.024c-7.906-6.784-22.935,3.388-15.816,13.558c5.145,7.36,15.028,28.617,54.566,27.94c0.132,0,0.276-0.017,0.402-0.025L11.391,322.275H0c11.497,38.025,46.804,65.736,88.595,65.736c41.786,0,77.093-27.711,88.59-65.736h-11.386l-60.355-171.134c37.183-11.467,89.569-31.056,134.636-34.072v24.23h-8.507v267.748H218.37v23.858c-8.715,0-17.569,0-24.874,0c-23.354,0-22.663,32.969-22.663,32.969c-19.233,0-28.85,15.101-28.85,33.648h228.033c0-18.546-9.616-33.648-28.845-33.648c0,0,0.686-32.969-22.668-32.969c-7.305,0-16.159,0-24.874,0v-23.858h-13.203V141.3h-8.507v-24.23c45.072,3.015,97.457,22.604,134.64,34.072l-60.358,171.134h-11.387c11.496,38.025,46.804,65.736,88.59,65.736c41.79,0,77.098-27.711,88.594-65.736H500.609z M141.243,322.275H35.948L88.595,173L141.243,322.275z M370.758,322.275L423.41,173l52.643,149.275H370.758z" />
              </svg>
            </button>
          </div>

          {/* Reviews Section */}
          <section className="mt-12 bg-white border border-gray-100 shadow-sm rounded-3xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Customer Reviews
            </h2>
            {reviews.length > 0 ? (
              <>
                {/* Reviews Summary */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="text-4xl font-bold text-gray-900">
                    {averageRating.toFixed(1)}
                  </div>

                  <div>
                    <div className="flex">{renderStars(averageRating)}</div>
                    <p className="text-sm text-gray-500 mt-1">
                      Based on {reviews.length} review
                      {reviews.length !== 1 && "s"}
                    </p>
                  </div>
                  {reviews.length > 5 && (
                    <button
                      className={`${showAllReviews ? "text-red-700" : "text-primary-600"} text-sm mt-4 ml-auto hover:font-semibold hover:cursor-pointer`}
                      onClick={() => setShowAllReviews((p) => !p)}
                    >
                      Show {showAllReviews ? "less" : "all reviews"}
                    </button>
                  )}
                </div>
                {/* Reviews List */}
                <div className="flex gap-4 flex-col max-h-72 overflow-y-auto">
                  {displayedReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </>
            ) : (
              /* Reviews List Empty */
              <p className="text-center text-md text-gray-400">
                No reviews yet
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
