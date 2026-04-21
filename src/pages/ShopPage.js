import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import useInView from '../hooks/useInView';
import './ShopPage.css';

/* ─── Product catalogue ─────────────────────────────────────── */
const CATEGORIES = ['All', 'Mobility Aids', 'Personal Care', 'Medical Equipment', 'Daily Living'];

const PRODUCTS = [
  /* Mobility Aids */
  {
    id: 1, category: 'Mobility Aids',
    name: 'Folding Walking Stick',
    desc: 'Lightweight aluminium, height-adjustable, ergonomic grip. Folds compactly for travel.',
    price: 8500,
    icon: '🦯',
    tag: 'Best Seller',
  },
  {
    id: 2, category: 'Mobility Aids',
    name: 'Standard Wheelchair',
    desc: 'Durable steel frame, padded seat & back, removable footrests, 18" seat width.',
    price: 95000,
    icon: '♿',
    tag: 'Popular',
  },
  {
    id: 3, category: 'Mobility Aids',
    name: 'Rollator Walker',
    desc: '4-wheeled walker with hand brakes, padded seat and under-seat basket.',
    price: 52000,
    icon: '🚶',
    tag: null,
  },
  {
    id: 4, category: 'Mobility Aids',
    name: 'Forearm Crutches',
    desc: 'Adjustable elbow crutches with comfortable arm cuff. Sold as a pair.',
    price: 14000,
    icon: '🩼',
    tag: null,
  },
  {
    id: 5, category: 'Mobility Aids',
    name: 'Electric Mobility Scooter',
    desc: 'Rechargeable 3-wheel scooter, 15 km/h max, 25 km range per charge.',
    price: 320000,
    icon: '🛵',
    tag: 'Premium',
  },
  /* Personal Care */
  {
    id: 6, category: 'Personal Care',
    name: 'Shower Transfer Bench',
    desc: 'Adjustable height bath chair with back rest and suction feet for safety.',
    price: 28000,
    icon: '🛁',
    tag: null,
  },
  {
    id: 7, category: 'Personal Care',
    name: 'Raised Toilet Seat',
    desc: 'Adds 4″ height, supports up to 135 kg, easy clip-on installation.',
    price: 12500,
    icon: '🚽',
    tag: null,
  },
  {
    id: 8, category: 'Personal Care',
    name: 'Adult Incontinence Briefs (Pack of 10)',
    desc: 'Soft, breathable, leak-proof. Available in M, L, XL.',
    price: 6500,
    icon: '🩲',
    tag: 'Best Seller',
  },
  {
    id: 9, category: 'Personal Care',
    name: 'Long-Handled Bath Sponge',
    desc: '65 cm handle, soft sponge head. Allows easy back & feet washing.',
    price: 2800,
    icon: '🧽',
    tag: null,
  },
  /* Medical Equipment */
  {
    id: 10, category: 'Medical Equipment',
    name: 'Digital Blood Pressure Monitor',
    desc: 'Upper-arm cuff, memory for 60 readings, irregular heartbeat alert.',
    price: 21000,
    icon: '💊',
    tag: 'Popular',
  },
  {
    id: 11, category: 'Medical Equipment',
    name: 'Pulse Oximeter',
    desc: 'Fingertip SpO₂ & pulse rate display, auto power-off, includes lanyard.',
    price: 7500,
    icon: '🩺',
    tag: null,
  },
  {
    id: 12, category: 'Medical Equipment',
    name: 'Weekly Pill Organiser',
    desc: '7-day AM/PM compartments, large-print labels, easy-open lids.',
    price: 3200,
    icon: '💉',
    tag: null,
  },
  {
    id: 13, category: 'Medical Equipment',
    name: 'Digital Thermometer',
    desc: 'Fast 10-second reading, fever alert, flexible tip for comfort.',
    price: 4500,
    icon: '🌡️',
    tag: null,
  },
  /* Daily Living */
  {
    id: 14, category: 'Daily Living',
    name: 'Anti-Slip Bathroom Mat',
    desc: 'Suction-cup base, machine washable, 60 × 90 cm, multiple colours.',
    price: 5500,
    icon: '🛟',
    tag: null,
  },
  {
    id: 15, category: 'Daily Living',
    name: 'Grab Bar (Stainless Steel)',
    desc: '45 cm wall-mounted safety rail, 135 kg capacity, rust-proof finish.',
    price: 9800,
    icon: '🔩',
    tag: null,
  },
  {
    id: 16, category: 'Daily Living',
    name: 'Large-Print Playing Cards',
    desc: 'High-contrast extra-large font deck, great for low-vision users.',
    price: 2200,
    icon: '🃏',
    tag: null,
  },
  {
    id: 17, category: 'Daily Living',
    name: 'Talking Alarm Clock',
    desc: 'Announces time loudly at the press of a button, loud alarm, night light.',
    price: 11500,
    icon: '⏰',
    tag: null,
  },
  {
    id: 18, category: 'Daily Living',
    name: 'Lap Tray Table',
    desc: 'Cushioned bean-bag base, solid wood surface. Perfect for bed or sofa use.',
    price: 8200,
    icon: '🍽️',
    tag: null,
  },
];

function formatNaira(amount) {
  return '₦' + amount.toLocaleString('en-NG');
}

/* ─── Order Modal ───────────────────────────────────────────── */
function OrderModal({ product, onClose }) {
  if (!product) return null;
  return (
    <div className="shop-modal__backdrop" onClick={onClose}>
      <div className="shop-modal__box" onClick={e => e.stopPropagation()}>
        <button className="shop-modal__close" onClick={onClose} aria-label="Close">✕</button>
        <div className="shop-modal__icon">{product.icon}</div>
        <h3 className="shop-modal__name">{product.name}</h3>
        <p className="shop-modal__price">{formatNaira(product.price)}</p>
        <p className="shop-modal__desc">{product.desc}</p>
        <p className="shop-modal__note">
          To place an order, call or message us and we'll confirm availability and delivery to your location.
        </p>
        <div className="shop-modal__actions">
          <a
            href="tel:+2349073520931"
            className="btn btn-primary"
          >
            📞 Call to Order
          </a>
          <Link
            to="/contact"
            className="btn btn-outline"
            onClick={onClose}
          >
            Send a Message
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Product Card ──────────────────────────────────────────── */
function ProductCard({ product, onOrder }) {
  return (
    <div className="shop-card">
      {product.tag && <span className="shop-card__tag">{product.tag}</span>}
      <div className="shop-card__icon-wrap">
        <span className="shop-card__icon">{product.icon}</span>
      </div>
      <div className="shop-card__body">
        <span className="shop-card__category">{product.category}</span>
        <h3 className="shop-card__name">{product.name}</h3>
        <p className="shop-card__desc">{product.desc}</p>
      </div>
      <div className="shop-card__footer">
        <span className="shop-card__price">{formatNaira(product.price)}</span>
        <button className="btn btn-primary btn-sm" onClick={() => onOrder(product)}>
          Order Now
        </button>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch]                 = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [heroRef, heroVisible]   = useInView({ threshold: 0.1 });
  const [gridRef, gridVisible]   = useInView({ threshold: 0.05 });

  const filtered = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchCat    = activeCategory === 'All' || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.desc.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);

  return (
    <div className="shop-page">

      {/* ── Hero ── */}
      <section className="shop-hero" ref={heroRef}>
        <div className={`container shop-hero__inner ${heroVisible ? 'visible' : ''}`}>
          <span className="section-tag">Geriatric Care Store</span>
          <h1 className="shop-hero__title">
            Everything Your Loved One&nbsp;<span className="shop-hero__accent">Needs to Thrive</span>
          </h1>
          <p className="shop-hero__sub">
            Carefully selected mobility aids, personal care products and medical equipment
            — delivered to your door across Nigeria.
          </p>
          <div className="shop-hero__search-wrap">
            <span className="shop-hero__search-icon">🔍</span>
            <input
              className="shop-hero__search"
              type="search"
              placeholder="Search products…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search products"
            />
          </div>
        </div>
      </section>

      {/* ── Category Filter ── */}
      <div className="container shop-filter">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`shop-filter__btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Product Grid ── */}
      <section className="container shop-grid-section" ref={gridRef}>
        {filtered.length === 0 ? (
          <div className="shop-empty">
            <span className="shop-empty__icon">🔍</span>
            <p>No products match your search. Try a different keyword or category.</p>
          </div>
        ) : (
          <div className={`shop-grid ${gridVisible ? 'visible' : ''}`}>
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} onOrder={setSelectedProduct} />
            ))}
          </div>
        )}
      </section>

      {/* ── Bottom CTA ── */}
      <section className="shop-cta">
        <div className="container shop-cta__inner">
          <h2 className="shop-cta__title">Can't find what you're looking for?</h2>
          <p className="shop-cta__sub">
            Our team can source specialised equipment not listed here.
            Reach out and we'll help you find the right product.
          </p>
          <div className="shop-cta__btns">
            <Link to="/contact" className="btn btn-primary btn-lg">Contact Us</Link>
            <a href="tel:+2349073520931" className="btn btn-outline btn-lg">📞 Call Now</a>
          </div>
        </div>
      </section>

      {/* ── Order Modal ── */}
      <OrderModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
