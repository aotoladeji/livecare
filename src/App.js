import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

import Navbar      from './components/layout/Navbar';
import Footer      from './components/layout/Footer';
import HomePage    from './pages/HomePage';
import AboutPage   from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import CaregiverPage from './pages/CaregiverPage';
import ContactPage from './pages/ContactPage';
import ScrollToTop from './components/ui/ScrollToTop';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/"            element={<HomePage />}     />
          <Route path="/about"       element={<AboutPage />}    />
          <Route path="/services"    element={<ServicesPage />} />
          <Route path="/caregivers"  element={<CaregiverPage />} />
          <Route path="/contact"     element={<ContactPage />}  />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}
