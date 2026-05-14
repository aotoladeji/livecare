import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useInView from '../hooks/useInView';
import { CATEGORIES, DEFAULT_PRODUCTS } from '../data/shopProducts';
import { getAllProductsDB } from '../utils/db';
import './ShopPage.css';

function formatNaira(amount) {
  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    return 'Price on request';
  }
  return '₦' + amount.toLocaleString('en-NG');
}

function shuffleProducts(items) {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

/* ─── Order Modal ───────────────────────────────────────────── */
function ProductModal({ product, onClose }) {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setActiveImage(0);
  }, [product?.id]);

  useEffect(() => {
    const onEsc = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [onClose]);

  if (!product) return null;

  const gallery = Array.isArray(product.images) ? product.images : [];
  const hasImages = gallery.length > 0;

  const goPrev = () => {
    if (gallery.length < 2) return;
    setActiveImage((i) => (i === 0 ? gallery.length - 1 : i - 1));
  };

  const goNext = () => {
    if (gallery.length < 2) return;
    setActiveImage((i) => (i === gallery.length - 1 ? 0 : i + 1));
  };

  return (
    <div className="shop-modal__backdrop" onClick={onClose}>
      <div className="shop-modal__box" onClick={e => e.stopPropagation()}>
        <button className="shop-modal__close" onClick={onClose} aria-label="Close">✕</button>
        <div className="shop-modal__viewer">
          {hasImages ? (
            <img
              src={gallery[activeImage]}
              alt={`${product.name} view ${activeImage + 1}`}
              className="shop-modal__image"
            />
          ) : (
            <div className="shop-modal__icon">{product.icon}</div>
          )}
          {gallery.length > 1 && (
            <>
              <button className="shop-modal__nav shop-modal__nav--prev" onClick={goPrev} aria-label="Previous image">‹</button>
              <button className="shop-modal__nav shop-modal__nav--next" onClick={goNext} aria-label="Next image">›</button>
            </>
          )}
        </div>
        {gallery.length > 1 && (
          <div className="shop-modal__thumbs">
            {gallery.map((src, index) => (
              <button
                key={`${product.id}_${index}`}
                className={`shop-modal__thumb ${index === activeImage ? 'active' : ''}`}
                onClick={() => setActiveImage(index)}
                aria-label={`View image ${index + 1}`}
              >
                <img src={src} alt={`${product.name} thumbnail ${index + 1}`} />
              </button>
            ))}
          </div>
        )}
        <h3 className="shop-modal__name">{product.name}</h3>
        {product.modelName && <p className="shop-modal__model">Model: {product.modelName}</p>}
        <p className="shop-modal__availability">Availability: {product.availability || 'In stock'}</p>
        <p className="shop-modal__price">{formatNaira(product.price)}</p>
        <p className="shop-modal__desc">{product.desc}</p>
        <p className="shop-modal__note">
          To place an order, call or message us and we'll confirm availability and delivery to your location.
        </p>
        <div className="shop-modal__actions">
          <Link
            to="/payment"
            state={{ product }}
            className="btn btn-primary"
            onClick={onClose}
          >
            Order Now
          </Link>
          <Link
            to="/contact"
            className="btn btn-outline"
            onClick={onClose}
          >
            📞 Call to Order
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Product Card ──────────────────────────────────────────── */
function ProductCard({ product, onOrder, onView }) {
  const coverImage = product.images?.[0];
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <div className="shop-card">
      {product.tag && <span className="shop-card__tag">{product.tag}</span>}
      <div className="shop-card__icon-wrap">
        {coverImage ? (
          <img className="shop-card__image" src={coverImage} alt={product.name} />
        ) : (
          <span className="shop-card__icon">{product.icon}</span>
        )}
      </div>
      <div className="shop-card__body">
        <span className="shop-card__category">{product.category}</span>
        <h3 className="shop-card__name">{product.name}</h3>
        {product.modelName && <p className="shop-card__model">{product.modelName}</p>}
        <p className="shop-card__availability">{product.availability || 'In stock'}</p>
        <button
          type="button"
          className="shop-card__details-toggle"
          onClick={() => setDetailsOpen((value) => !value)}
          aria-expanded={detailsOpen}
        >
          {detailsOpen ? 'Hide details' : 'View details'}
        </button>
        {detailsOpen && <p className="shop-card__desc">{product.desc}</p>}
      </div>
      <div className="shop-card__footer">
        <span className="shop-card__price">{formatNaira(product.price)}</span>
        <div className="shop-card__actions">
          <button className="btn btn-secondary btn-sm" onClick={() => onOrder(product)}>
            Order Now
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => onView(product)}>
            View Item
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function ShopPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch]                 = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const [heroRef, heroVisible]   = useInView({ threshold: 0.1 });
  const [gridRef, gridVisible]   = useInView({ threshold: 0.05 });

  useEffect(() => {
    setProductsLoading(true);
    getAllProductsDB()
      .then(prods => setProducts(prods))
      .catch(err => {
        console.warn('Falling back to default products:', err);
        setProducts(DEFAULT_PRODUCTS);
      })
      .finally(() => setProductsLoading(false));
  }, []);

  const handleOrderNow = (product) => {
    navigate('/payment', { state: { product } });
  };

  const shuffledProducts = useMemo(() => shuffleProducts(products), [products]);

  const filtered = useMemo(() => {
    const source = activeCategory === 'All' ? shuffledProducts : products;

    return source.filter(p => {
      const matchCat    = activeCategory === 'All' || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.desc.toLowerCase().includes(search.toLowerCase()) ||
                          (p.modelName || '').toLowerCase().includes(search.toLowerCase()) ||
                          (p.availability || '').toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, products, search, shuffledProducts]);

  return (
    <div className="shop-page">

      {/* ── Hero ── */}
      <section className="shop-hero" ref={heroRef}>
        <div className="shop-hero__image" style={{ backgroundImage: "url('/tmp/hero-1.png')" }} />
        <div className="shop-hero__overlay" />
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
        {productsLoading ? (
          <div className="shop-empty">
            <span className="shop-empty__icon">⏳</span>
            <p>Loading products…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="shop-empty">
            <span className="shop-empty__icon">🔍</span>
            <p>No products match your search. Try a different keyword or category.</p>
          </div>
        ) : (
          <div className={`shop-grid ${gridVisible ? 'visible' : ''}`}>
            {filtered.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onOrder={handleOrderNow}
                onView={setSelectedProduct}
              />
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
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
