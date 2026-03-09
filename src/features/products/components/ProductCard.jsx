import { Link } from "react-router-dom";
import useCartStore from "../../cart/hooks/useCartStore";
import useWishlistStore from "../../wishlist/hooks/useWishlistStore";
import { useCompareStore } from "../../compare/hooks/useCompareStore";

export default function ProductCard({ product }) {
  const addToCart = useCartStore((s) => s.addToCart);
  const addToWishlist = useWishlistStore((s) => s.addToWishlist);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);
  const selectedProductA = useCompareStore((s) => s.selectedProductA);
  const selectedProductB = useCompareStore((s) => s.selectedProductB);
  const selectProduct = useCompareStore((s) => s.selectProduct);
  const disSelectProduct = useCompareStore((s) => s.disSelectProduct);
  const isSelected =
    product.id === Number(selectedProductA) ||
    product.id === Number(selectedProductB);
  const toggleWish = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  const toggleCompare = () => {
    if (isSelected) {
      disSelectProduct(product.id);
    } else {
      selectProduct(product.id);
    }
  };
  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    const hasHalf = rating - full >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < full) {
        stars.push(
          <svg
            key={i}
            className="w-4 h-4 text-amber-400 fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>,
        );
      } else if (i === full && hasHalf) {
        stars.push(
          <svg key={i} className="w-4 h-4 text-amber-400" viewBox="0 0 20 20">
            <defs>
              <linearGradient id={`half-${product.id}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#d1d5db" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#half-${product.id})`}
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>,
        );
      } else {
        stars.push(
          <svg
            key={i}
            className="w-4 h-4 text-gray-300 fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>,
        );
      }
    }
    return stars;
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-primary-100 transition-all duration-300 flex flex-col">
      {/* Image */}
      <Link
        to={`/products/${product.id}`}
        className="relative overflow-hidden aspect-square bg-gray-50"
      >
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.stock <= 10 && product.stock > 0 && (
          <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Out of Stock
          </span>
        )}
        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWish();
          }}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all duration-200 ${
            isInWishlist
              ? "bg-accent-500 text-white"
              : "bg-white/90 text-gray-400 hover:text-accent-500"
          }`}
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {/* compare button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleCompare();
          }}
          className={`absolute top-3 left-3 p-2 rounded-full shadow-md transition-all duration-200 ${
            isSelected
              ? "bg-primary-500 text-white"
              : "bg-white/90 text-gray-400 hover:text-primary-500"
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
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs font-medium text-primary-600 uppercase tracking-wide mb-1">
          {product.category}
        </span>
        <Link
          to={`/products/${product.id}`}
          className="text-sm font-semibold text-gray-800 hover:text-primary-600 transition-colors line-clamp-2 mb-2"
        >
          {product.title}
        </Link>

        <div className="flex items-center gap-1 mb-3">
          {renderStars(product.rating)}
          <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className="px-3 py-1.5 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
