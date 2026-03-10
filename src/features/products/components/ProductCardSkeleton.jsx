export default function ProductCardSkeleton() {
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
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
    return stars;
  };
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 aspect-square rounded-2xl" />
      <div className="h-4 bg-gray-200 rounded mt-3 ml-3 w-3/4" />
      <div className="h-4 bg-gray-200 rounded mt-3 ml-3 w-3/4" />
      <div className="flex mt-3 ml-3 ">{renderStars()}</div>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded mt-3 ml-3 w-1/4" />
        <div className="h-4 bg-gray-200 rounded mt-3 mr-3 w-1/4" />
      </div>
    </div>
  );
}
