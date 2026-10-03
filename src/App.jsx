import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { StickyCartBar } from './components/StickyCartBar';
import { CartDrawer } from './components/CartDrawer';
import { ToastNotification } from './components/ToastNotification';

// Pages
import { LandingPage } from './pages/LandingPage';
import { MenuPage } from './pages/MenuPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AdminDashboard } from './pages/AdminDashboard';

const AppContent = () => {
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const location = useLocation();
  const { settings } = useStore();

  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5EBDD] flex flex-col font-sans selection:bg-[#E11D2E] selection:text-white">
      {/* Toast notifications */}
      <ToastNotification />

      {/* Global Stall Closed Notice */}
      {!settings.isStallOpen && !isAdminPage && (
        <div className="bg-red-900/90 text-white text-center py-2 px-4 text-xs font-bold uppercase tracking-wider sticky top-0 z-50">
          ⚠️ BBQ Pit Stop Stall is currently paused for match restock. Pre-orders will resume shortly!
        </div>
      )}

      {/* Main Navbar */}
      <Navbar onOpenCart={() => setCartDrawerOpen(true)} />

      {/* Main Routed Page */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
          <Route path="/track/:id" element={<OrderTrackingPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      {/* Cart Drawer & Mobile Sticky Bar */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
      />
      <StickyCartBar onOpenCart={() => setCartDrawerOpen(true)} />

      {/* Footer */}
      {!isAdminPage && <Footer />}
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;
