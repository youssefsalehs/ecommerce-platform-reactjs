import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import ComparePage from "./pages/ComparePage";
import CheckoutPage from "./pages/CheckoutPage";
import { Toaster } from "react-hot-toast";
export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,

          style: {
            background: "#065095",
            color: "#fff",
          },
          success: {
            duration: 3000,
            style: {
              background: "#09a209",
              color: "#fff",
            },
            iconTheme: {
              primary: "white",
              secondary: "black",
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailsPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="checkout" element={<CheckoutPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
