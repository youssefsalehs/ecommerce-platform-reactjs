import { useState, useEffect } from "react";
import {
  getCategories,
  filterProducts,
} from "../features/products/services/productService";
import ProductCard from "../features/products/components/ProductCard";
import { useSearchParams } from "react-router";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  // Basic state — not wired to filterProducts yet (student task)
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "",
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "title");
  const [sortOrder, setSortOrder] = useState(
    searchParams.get("sortOrder") || "asc",
  );
  const [currentPage, setCurrentPage] = useState(searchParams.get("page") || 1);
  const productsPerPage = 8;
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  //Ensures the component updates if the user navigates back/forward and validate url parameters
  useEffect(() => {
    const search = searchParams.get("search") || "";
    setSearch(search);
    setDebouncedSearch(search);

    const categoryParam = searchParams.get("category") || "";
    setSelectedCategory(
      categories.includes(categoryParam) ? categoryParam : "",
    );

    const sortByParam = searchParams.get("sortBy") || "title";
    const sortOrderParam = searchParams.get("sortOrder") || "asc";
    setSortBy(
      ["title", "price", "rating"].includes(sortByParam)
        ? sortByParam
        : "title",
    );
    setSortOrder(
      ["asc", "desc"].includes(sortOrderParam) ? sortOrderParam : "asc",
    );

    let page = Number(searchParams.get("page")) || 1;
    if (page < 1) page = 1;
    if (totalPages && page > totalPages) page = totalPages;
    setCurrentPage(page);

    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
  }, [searchParams, categories, totalPages]);

  // Update URL whenever filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (search.trim()) params.set("search", search);
    if (selectedCategory) params.set("category", selectedCategory);
    if (sortBy !== "title" || sortOrder !== "asc") {
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);
    }
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (currentPage > 1) params.set("page", currentPage);

    setSearchParams(params, { replace: true });
  }, [
    search,
    selectedCategory,
    sortBy,
    sortOrder,
    minPrice,
    maxPrice,
    currentPage,
    setSearchParams,
  ]);
  //debouncing search to avoid sending many requests
  useEffect(() => {
    const debounce = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(debounce);
  }, [search]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      // Currently just loads all products — students should use filterProducts()

      const { data, total, totalPages } = await filterProducts({
        search: debouncedSearch,
        category: selectedCategory,
        sortBy,
        sortOrder,
        page: currentPage,
        limit: productsPerPage,
        minPrice: minPrice || 0,
        maxPrice: maxPrice || Infinity,
      });
      setProducts(data);
      setTotalPages(totalPages);
      setTotal(total);
      const cats = await getCategories();
      setCategories(cats);
      // Simulate a short loading time so the spinner is visible
      setTimeout(() => setLoading(false), 600);
    }
    load();
  }, [
    debouncedSearch,
    selectedCategory,
    sortBy,
    sortOrder,
    currentPage,
    minPrice,
    maxPrice,
  ]);
  //clear filterations by setting it to its default values
  //   function clearFilteraions() {
  //     setSearch("");
  //     setSortBy("");
  //     setSortOrder("");
  //     setCurrentPage(1);
  //     setSelectedCategory("");
  //     setMinPrice("");
  //     setMaxPrice("");
  //   }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
        <p className="text-gray-500">
          Browse our collection of {total} premium products
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split("-");
              setSortBy(by);
              setSortOrder(order);
              setCurrentPage(1);
            }}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="title-asc">Name: A → Z</option>
            <option value="title-desc">Name: Z → A</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating-desc">Rating: Best First</option>
          </select>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 w-32 border border-gray-200 rounded-xl text-sm text-gray-600  focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 w-32 border border-gray-200 rounded-xl text-sm text-gray-600  focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
          <p className="text-gray-500 text-sm">Loading products...</p>
        </div>
      ) : (
        <>
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Empty State */}
          {products.length === 0 && (
            <div className="text-center py-16">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-gray-500 text-lg">No products found</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  const newPage = Math.max(1, Number(currentPage) - 1);
                  setCurrentPage(newPage);
                }}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => {
                      setCurrentPage(pageNum);
                    }}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? "bg-primary-600 text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                ),
              )}
              <button
                onClick={() => {
                  const newPage = Math.min(totalPages, Number(currentPage) + 1);
                  setCurrentPage(newPage);
                }}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
