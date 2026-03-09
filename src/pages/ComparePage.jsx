import { useState, useEffect } from "react";
import { getProducts } from "../features/products/services/productService";
import { useCompareStore } from "../features/compare/hooks/useCompareStore";

export default function ComparePage() {
  const [products, setProducts] = useState([]);
  const {
    selectedProductA,
    selectedProductB,
    setSelectedProductA,
    setSelectedProductB,
    clearSelection,
  } = useCompareStore();

  useEffect(() => {
    async function load() {
      const allProducts = await getProducts();
      setProducts(allProducts);
    }
    load();
  }, []);

  const productA = products.find((p) => p.id === Number(selectedProductA));
  const productB = products.find((p) => p.id === Number(selectedProductB));
  const comparisonFields = [
    { label: "Price", key: "price", format: (v) => `$${v?.toFixed(2) || "—"}` },
    { label: "Category", key: "category", format: (v) => v || "—" },
    { label: "Rating", key: "rating", format: (v) => (v ? `${v} / 5` : "—") },
    {
      label: "Stock",
      key: "stock",
      format: (v) => (v != null ? `${v} units` : "—"),
    },
  ];
  // Comparison logic  implemented => Highliting The Better
  const getColorClass = (key, aValue, bValue) => {
    if (aValue == null || bValue == null) return "text-gray-800";
    if (aValue === bValue) return "text-gray-800";
    switch (key) {
      case "price":
        return aValue < bValue ? "text-green-600" : "text-red-600";
      case "rating":
      case "stock":
        return aValue > bValue ? "text-green-600" : "text-red-600";
      default:
        return "text-gray-800";
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compare Products</h1>
          <p className="text-gray-500 mt-1">
            Select two products to compare them side by side
          </p>
        </div>
        <button
          onClick={() => clearSelection()}
          className="px-3 py-1.5 bg-primary-600 text-white cursor-pointer font-medium rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Product Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product A
          </label>
          <select
            value={selectedProductA}
            onChange={(e) => setSelectedProductA(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="">Select a product...</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product B
          </label>
          <select
            value={selectedProductB}
            onChange={(e) => setSelectedProductB(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="">Select a product...</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Table */}
      {productA || productB ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Product Headers */}
          <div className="grid grid-cols-3 border-b border-gray-100">
            <div className="p-4 bg-gray-50 font-medium text-sm text-gray-500">
              Feature
            </div>
            <div className="p-4 text-center border-l border-gray-100">
              {productA ? (
                <div>
                  <img
                    src={productA.thumbnail}
                    alt={productA.title}
                    className="w-20 h-20 object-cover rounded-xl mx-auto mb-2"
                  />
                  <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                    {productA.title}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-400 py-8">Select Product A</p>
              )}
            </div>
            <div className="p-4 text-center border-l border-gray-100">
              {productB ? (
                <div>
                  <img
                    src={productB.thumbnail}
                    alt={productB.title}
                    className="w-20 h-20 object-cover rounded-xl mx-auto mb-2"
                  />
                  <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                    {productB.title}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-400 py-8">Select Product B</p>
              )}
            </div>
          </div>

          {/* Comparison Rows */}
          {comparisonFields.map((field) => {
            const aValue = productA?.[field.key];
            const bValue = productB?.[field.key];
            return (
              <div
                key={field.key}
                className="grid grid-cols-3 border-b border-gray-50 last:border-0"
              >
                <div className="p-4 bg-gray-50 text-sm font-medium text-gray-600">
                  {field.label}
                </div>
                <div
                  className={`p-4 text-center text-sm ${getColorClass(
                    field.key,
                    aValue,
                    bValue,
                  )} border-l border-gray-100`}
                >
                  {productA ? field.format(productA[field.key]) : "—"}
                </div>
                <div
                  className={`p-4 text-center text-sm  border-l border-gray-100 ${getColorClass(
                    field.key,
                    bValue,
                    aValue,
                  )}`}
                >
                  {productB ? field.format(productB[field.key]) : "—"}
                </div>
              </div>
            );
          })}

          {/* Description */}
          <div className="grid grid-cols-3 border-t border-gray-100">
            <div className="p-4 bg-gray-50 text-sm font-medium text-gray-600">
              Description
            </div>
            <div className="p-4 text-sm text-gray-600 border-l border-gray-100 leading-relaxed">
              {productA?.description || "—"}
            </div>
            <div className="p-4 text-sm text-gray-600 border-l border-gray-100 leading-relaxed">
              {productB?.description || "—"}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <svg
            className="w-20 h-20 text-gray-200 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Select Products to Compare
          </h3>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">
            Choose two products from the dropdowns above to see a detailed
            side-by-side comparison.
          </p>
        </div>
      )}
    </div>
  );
}
