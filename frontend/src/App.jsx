import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import AnnouncementBar from './components/layout/AnnouncementBar';
import Footer from './components/layout/Footer';

// ── Main Pages ──
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// ── Auth Pages (no navbar/footer) ──
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// ── User Pages ──
import ProfilePage from './pages/ProfilePage';
import CheckoutPage from './pages/CheckoutPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import ProductDetailPage from './pages/ProductDetailPage';

// ── Category Pages (Dynamic) ──
import CategoryPage from './pages/CategoryPage';

// ── Special Order Pages (3 total) ──
import BirthdayCakesPage from './pages/special/BirthdayCakesPage';
import GiftBoxesPage from './pages/special/GiftBoxesPage';
import EventOrdersPage from './pages/special/EventOrdersPage';

// ── Static & Public Pages ──
import PrivacyPolicy from './pages/public/PolicyPage';
import Contact from './pages/public/Contact';
import Jobs from './pages/public/Jobs';
import Wholesale from './pages/public/Wholesale';
import FindOurBread from './pages/public/FindOurBread';

// ── Admin Layout + Pages ──
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ManageCategories from './pages/admin/ManageCategories';
import ManageOrders from './pages/admin/ManageOrders';
import ManageStaff from './pages/admin/ManageStaff';
import Attendance from './pages/admin/Attendance';
import Salaries from './pages/admin/Salaries';
import Inventory from './pages/admin/Inventory';
import Machinery from './pages/admin/Machinery';
import CounterSales from './pages/admin/CounterSales';
import Reports from './pages/admin/Reports';
import StaffLeave from './pages/admin/StaffLeave';
import Expenses from './pages/admin/Expenses';
import ManageDiscounts from './pages/admin/ManageDiscounts';
import ManageBranches from './pages/admin/ManageBranches';
import JobApplications from './pages/admin/JobApplications';

// ── Operational Admin Pages ──
import ManageRecipes from './pages/admin/ManageRecipes';
import ManageProduction from './pages/admin/ManageProduction';
import ManageWaste from './pages/admin/ManageWaste';
import ManageSuppliers from './pages/admin/ManageSuppliers';
import ManageCustomOrders from './pages/admin/ManageCustomOrders';

import ProtectedRoute from './components/ProtectedRoute';

/**
 * AUTH PAGES LIST
 * ================
 * Pages in this list will NOT show the global Navbar, AnnouncementBar, or Footer.
 * They have their own full-screen, centered layout (like Login, Register).
 * To add a new auth/standalone page, just add its path to this array.
 */
// AUTH_PAGES: These routes will NOT show the global Navbar, AnnouncementBar, or Footer.
// All /admin routes are included so the admin panel has its own layout (AdminLayout).
const AUTH_PAGES = ['/login', '/register', '/forgot-password'];

// Check if the current path is any admin page (starts with /admin)
// Admin pages use AdminLayout — they must NOT show customer Navbar/Footer
const isAdminPath = (pathname) => pathname.startsWith('/admin');

/**
 * AppLayout Component
 * ====================
 * This component lives INSIDE <BrowserRouter> so it can use useLocation().
 * It conditionally renders the global header and footer based on the current route.
 *
 * Why separate from App?
 *   useLocation() only works inside a component that is a CHILD of <BrowserRouter>.
 *   We can't call useLocation() directly in App() because BrowserRouter hasn't
 *   mounted yet at that point.
 */
function AppLayout() {
  // useLocation returns the current URL info (pathname, search, hash)
  const location = useLocation();

  // Check if the current page should hide the customer header/footer:
  //   1. Auth pages (login, register, forgot-password)
  //   2. Any admin page (/admin, /admin/products, etc.)
  const isAuthPage = AUTH_PAGES.includes(location.pathname) || isAdminPath(location.pathname);

  return (
    <>
      {/* ── Global Sticky Header ──
          Only shown on non-auth pages.
          sticky + z-50 keeps the bar fixed at the top while scrolling.
      */}
      {!isAuthPage && (
        <header className="sticky top-0 z-50 shadow-sm">
          <AnnouncementBar />
          <Navbar />
        </header>
      )}

      {/* ── Page Content ── */}
      <main className="min-h-screen">
        <Routes>

          {/* ── Main Routes ── */}
          <Route path="/"               element={<HomePage />} />
          <Route path="/menu"           element={<MenuPage />} />

          {/* ── Admin Routes ──
              All admin pages are wrapped in AdminLayout.
              AdminLayout renders the sidebar + top bar automatically.
              The individual page becomes the `children` inside AdminLayout.
          */}
          <Route path="/admin"              element={<ProtectedRoute allowedRoles={['admin', 'manager']}><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/products"    element={<ProtectedRoute allowedRoles={['admin', 'manager']}><AdminLayout><ManageProducts /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/categories"  element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><ManageCategories /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/orders"      element={<ProtectedRoute allowedRoles={['admin', 'manager', 'staff', 'delivery']}><AdminLayout><ManageOrders /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/staff"       element={<ProtectedRoute allowedRoles={['admin', 'manager']}><AdminLayout><ManageStaff /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/attendance"  element={<ProtectedRoute allowedRoles={['admin', 'manager', 'staff']}><AdminLayout><Attendance /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/salaries"    element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><Salaries /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/inventory"   element={<ProtectedRoute allowedRoles={['admin', 'manager']}><AdminLayout><Inventory /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/machinery"   element={<ProtectedRoute allowedRoles={['admin', 'manager']}><AdminLayout><Machinery /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/counter"     element={<ProtectedRoute allowedRoles={['admin', 'manager', 'staff']}><AdminLayout><CounterSales /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/reports"     element={<ProtectedRoute allowedRoles={['admin', 'manager']}><AdminLayout><Reports /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/leaves"      element={<ProtectedRoute allowedRoles={['admin', 'manager', 'staff', 'delivery']}><AdminLayout><StaffLeave /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/expenses"    element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><Expenses /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/discounts"   element={<ProtectedRoute allowedRoles={['admin', 'manager']}><AdminLayout><ManageDiscounts /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/branches"    element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><ManageBranches /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/jobs"        element={<ProtectedRoute allowedRoles={['admin', 'manager']}><AdminLayout><JobApplications /></AdminLayout></ProtectedRoute>} />
          
          <Route path="/admin/recipes"     element={<ProtectedRoute allowedRoles={['admin', 'manager']}><AdminLayout><ManageRecipes /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/production"  element={<ProtectedRoute allowedRoles={['admin', 'manager', 'staff']}><AdminLayout><ManageProduction /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/waste"       element={<ProtectedRoute allowedRoles={['admin', 'manager']}><AdminLayout><ManageWaste /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/suppliers"   element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><ManageSuppliers /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/custom-orders" element={<ProtectedRoute allowedRoles={['admin', 'manager']}><AdminLayout><ManageCustomOrders /></AdminLayout></ProtectedRoute>} />

          {/* ── Auth Routes (no navbar/footer — handled by isAuthPage above) ── */}
          <Route path="/login"          element={<LoginPage />} />
          <Route path="/register"       element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* ── User Routes ── */}
          <Route path="/profile"        element={<ProfilePage />} />
          <Route path="/checkout"       element={<CheckoutPage />} />
          <Route path="/order-tracking" element={<OrderTrackingPage />} />

          {/* ── Product Detail Route ──
              :id is a dynamic URL param — any value after /product/ is captured.
              Example: /product/42 → id = "42" inside ProductDetailPage via useParams()
          */}
          <Route path="/product/:id"    element={<ProductDetailPage />} />

          {/* ── Category Routes — /menu/:id ── */}
          <Route path="/menu/:id"  element={<CategoryPage />} />

          {/* ── Special Order Routes — /special/<slug> ── */}
          <Route path="/special/birthday-cakes" element={<BirthdayCakesPage />} />
          <Route path="/special/gift-boxes"     element={<GiftBoxesPage />} />
          <Route path="/special/event-orders"   element={<EventOrdersPage />} />

          {/* ── Public Information Routes ── */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/contact"        element={<Contact />} />
          <Route path="/jobs"           element={<Jobs />} />
          <Route path="/wholesale"      element={<Wholesale />} />
          <Route path="/find-our-bread" element={<FindOurBread />} />

          {/* ── 404 Fallback ── */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-[60vh] font-body">
              <h1 className="font-heading text-6xl font-bold text-primary mb-4">404</h1>
              <p className="text-text-light text-lg mb-8">Oops! This page doesn't exist.</p>
              <a
                href="/"
                className="bg-primary text-white px-8 py-3 rounded font-bold tracking-widest text-sm hover:bg-[#6A1414] transition-colors"
              >
                GO HOME
              </a>
            </div>
          } />

        </Routes>
      </main>

      {/* ── Global Footer ──
          Only shown on non-auth pages (same logic as header above).
      */}
      {!isAuthPage && <Footer />}
    </>
  );
}

/**
 * App Component — Root of the Application
 * =========================================
 * Wraps everything in <BrowserRouter> so all child components
 * (including AppLayout) can use React Router hooks like useLocation, useNavigate, etc.
 */
function App() {
  return (
    <BrowserRouter>
      {/*
        AppLayout must be INSIDE BrowserRouter.
        This is because it uses useLocation() which requires the Router context.
      */}
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;

/*
 * END OF FILE SUMMARY
 * =====================
 * Architecture:
 *   <BrowserRouter>
 *     <AppLayout>          ← useLocation() reads current route HERE
 *       <header>           ← hidden on auth pages AND all /admin/* routes
 *       <main><Routes>     ← all page routes
 *       <Footer>           ← hidden on auth pages AND all /admin/* routes
 *
 * Admin pages use AdminLayout (sidebar + topbar) instead of customer Navbar.
 *
 * Auth Pages (no header/footer): /login, /register, /forgot-password
 * Admin Pages (no customer header/footer): /admin, /admin/*
 *
 * Total Routes: 25
 *   /                       → HomePage
 *   /menu                   → MenuPage
 *   /menu/fast-food         → FastFoodPage
 *   /menu/bakery            → BakeryItemsPage
 *   /menu/desi              → DesiItemsPage
 *   /menu/desserts          → DessertsPage
 *   /menu/ice-cream         → IceCreamPage
 *   /menu/beverages         → BeveragesPage
 *   /special/birthday-cakes → BirthdayCakesPage
 *   /special/gift-boxes     → GiftBoxesPage
 *   /special/event-orders   → EventOrdersPage
 *   /login                  → LoginPage          (no header/footer)
 *   /register               → RegisterPage       (no header/footer)
 *   /forgot-password        → ForgotPasswordPage (no header/footer)
 *   /profile                → ProfilePage
 *   /checkout               → CheckoutPage
 *   /order-tracking         → OrderTrackingPage
 *   /product/:id            → ProductDetailPage
 *   /admin                  → AdminDashboard     (AdminLayout)
 *   /admin/products         → ManageProducts     (AdminLayout)
 *   /admin/categories       → ManageCategories   (AdminLayout)
 *   /admin/orders           → ManageOrders       (AdminLayout)
 *   /admin/staff            → ManageStaff        (AdminLayout)
 *   *                       → 404 page
 */