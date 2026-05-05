import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './PaymentPage.css';

function formatNaira(amount) {
  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    return 'Price on request';
  }
  return `₦${amount.toLocaleString('en-NG')}`;
}

export default function PaymentPage() {
  const { state } = useLocation();
  const product = state?.product || null;

  return (
    <section className="payment-page">
      <div className="container payment-card">
        <h1>Complete Your Order</h1>
        <p className="payment-sub">
          Paystack integration will be connected here in the next phase.
        </p>

        {product ? (
          <div className="payment-product">
            <h2>{product.name}</h2>
            {product.modelName && <p>Model: {product.modelName}</p>}
            <p>Availability: {product.availability || 'In stock'}</p>
            <p className="payment-price">{formatNaira(product.price)}</p>
          </div>
        ) : (
          <div className="payment-product">
            <h2>No item selected</h2>
            <p>Select a product from the shop before continuing to payment.</p>
          </div>
        )}

        <div className="payment-actions">
          <Link to="/shop" className="btn btn-secondary">Back to Shop</Link>
          <button type="button" className="btn btn-primary" disabled>
            Pay with Paystack (Coming Soon)
          </button>
        </div>
      </div>
    </section>
  );
}
