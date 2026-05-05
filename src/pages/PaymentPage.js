import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createOrderDB } from '../utils/db';
import './PaymentPage.css';

function formatNaira(amount) {
  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    return 'Price on request';
  }
  return `₦${amount.toLocaleString('en-NG')}`;
}

const INITIAL_ORDER = {
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  deliveryAddress: '',
  quantity: 1,
};

export default function PaymentPage() {
  const { state } = useLocation();
  const product = state?.product || null;
  const [orderForm, setOrderForm] = useState(INITIAL_ORDER);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = ({ target: { name, value } }) =>
    setOrderForm(f => ({ ...f, [name]: value }));

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!product) return;

    setError('');
    setLoading(true);

    try {
      await createOrderDB({
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        quantity: parseInt(orderForm.quantity),
        totalAmount: product.price * parseInt(orderForm.quantity),
        customerName: orderForm.customerName,
        customerEmail: orderForm.customerEmail,
        customerPhone: orderForm.customerPhone,
        deliveryAddress: orderForm.deliveryAddress,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError('Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section className="payment-page">
        <div className="container payment-card" style={{ textAlign: 'center', padding: '40px 24px' }}>
          <h2 style={{ color: '#166534', marginBottom: '12px' }}>✅ Order Placed Successfully!</h2>
          <p style={{ color: 'var(--gray-600)', marginBottom: '24px' }}>
            Thank you for your order. We'll contact you shortly to confirm delivery.
          </p>
          <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="payment-page">
        <div className="container payment-card">
          <h2>No Item Selected</h2>
          <p>Select a product from the shop before continuing to payment.</p>
          <Link to="/shop" className="btn btn-secondary">Back to Shop</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="payment-page">
      <div className="container payment-card">
        <h1>Complete Your Order</h1>
        
        <div className="payment-product">
          <h3>{product.name}</h3>
          {product.modelName && <p>Model: {product.modelName}</p>}
          <p>Availability: {product.availability || 'In stock'}</p>
          <p className="payment-price">{formatNaira(product.price)}</p>
        </div>

        <form className="payment-form" onSubmit={handlePlaceOrder} style={{
          display: 'grid',
          gap: '16px',
          marginTop: '24px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
        }}>
          <label style={{ display: 'grid', gap: '4px', fontSize: '0.9rem' }}>
            Full Name *
            <input
              type="text"
              name="customerName"
              value={orderForm.customerName}
              onChange={handleChange}
              required
              style={{ border: '1px solid var(--gray-200)', borderRadius: '8px', padding: '10px' }}
            />
          </label>

          <label style={{ display: 'grid', gap: '4px', fontSize: '0.9rem' }}>
            Email *
            <input
              type="email"
              name="customerEmail"
              value={orderForm.customerEmail}
              onChange={handleChange}
              required
              style={{ border: '1px solid var(--gray-200)', borderRadius: '8px', padding: '10px' }}
            />
          </label>

          <label style={{ display: 'grid', gap: '4px', fontSize: '0.9rem' }}>
            Phone *
            <input
              type="tel"
              name="customerPhone"
              value={orderForm.customerPhone}
              onChange={handleChange}
              required
              style={{ border: '1px solid var(--gray-200)', borderRadius: '8px', padding: '10px' }}
            />
          </label>

          <label style={{ display: 'grid', gap: '4px', fontSize: '0.9rem' }}>
            Quantity *
            <input
              type="number"
              name="quantity"
              min="1"
              value={orderForm.quantity}
              onChange={handleChange}
              required
              style={{ border: '1px solid var(--gray-200)', borderRadius: '8px', padding: '10px' }}
            />
          </label>

          <label style={{ gridColumn: '1 / -1', display: 'grid', gap: '4px', fontSize: '0.9rem' }}>
            Delivery Address *
            <textarea
              name="deliveryAddress"
              rows={3}
              value={orderForm.deliveryAddress}
              onChange={handleChange}
              required
              placeholder="e.g., 123 New Bodija, Ibadan"
              style={{ border: '1px solid var(--gray-200)', borderRadius: '8px', padding: '10px' }}
            />
          </label>

          {error && <p style={{ gridColumn: '1 / -1', color: '#b91c1c', fontSize: '0.9rem', fontWeight: 600 }}>{error}</p>}

          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', marginTop: '8px' }}>
            <Link to="/shop" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Placing Order…' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
