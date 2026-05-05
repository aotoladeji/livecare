import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';

import Navbar      from './components/layout/Navbar';
import Footer      from './components/layout/Footer';
import HomePage    from './pages/HomePage';
import AboutPage   from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import CaregiverPage from './pages/CaregiverPage';
import ContactPage from './pages/ContactPage';
import ShopPage from './pages/ShopPage';
import AdminPage from './pages/AdminPage';
import PaymentPage from './pages/PaymentPage';
import ScrollToTop from './components/ui/ScrollToTop';

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <main>
        <Routes>
          <Route path="/"            element={<HomePage />}     />
          <Route path="/about"       element={<AboutPage />}    />
          <Route path="/services"    element={<ServicesPage />} />
          <Route path="/caregivers"  element={<CaregiverPage />} />
          <Route path="/contact"     element={<ContactPage />}  />
          <Route path="/shop"       element={<ShopPage />}      />
          <Route path="/admin"      element={<AdminPage />}     />
          <Route path="/payment"    element={<PaymentPage />}   />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
