import React, { useMemo, useState } from 'react';
import {
  addShopProduct,
  deleteWaitlistEntry,
  getShopProducts,
  getWaitlistEntries,
  isAdminAuthenticated,
  setAdminAuthenticated,
  updateProductImages,
} from '../utils/storage';
import { CATEGORIES } from '../data/shopProducts';
import './AdminPage.css';

const ADMIN_USER = process.env.REACT_APP_ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.REACT_APP_ADMIN_PASSWORD || 'livecare2026';

const EMPTY_PRODUCT = {
  category: 'Mobility Aids',
  name: '',
  modelName: '',
  availability: 'In stock',
  desc: '',
  price: '',
  icon: '🧾',
  tag: '',
};

function formatDate(value) {
  return new Date(value).toLocaleString('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function formatNaira(amount) {
  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    return 'Price on request';
  }
  return `₦${Number(amount).toLocaleString('en-NG')}`;
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(() => isAdminAuthenticated());
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');

  const [waitlist, setWaitlist] = useState(() => getWaitlistEntries());
  const [products, setProducts] = useState(() => getShopProducts());

  const [draftProduct, setDraftProduct] = useState(EMPTY_PRODUCT);
  const [productError, setProductError] = useState('');
  const [imageDrafts, setImageDrafts] = useState({});

  const categoriesWithoutAll = useMemo(
    () => CATEGORIES.filter(category => category !== 'All'),
    []
  );

  const handleLogin = (event) => {
    event.preventDefault();
    if (credentials.username === ADMIN_USER && credentials.password === ADMIN_PASS) {
      setAdminAuthenticated(true);
      setAuthenticated(true);
      setAuthError('');
      return;
    }
    setAuthError('Invalid admin credentials. Please try again.');
  };

  const handleLogout = () => {
    setAdminAuthenticated(false);
    setAuthenticated(false);
    setCredentials({ username: '', password: '' });
  };

  const handleAddProduct = (event) => {
    event.preventDefault();
    const nextPrice = draftProduct.price === '' ? null : Number(draftProduct.price);

    if (!draftProduct.name.trim() || !draftProduct.desc.trim()) {
      setProductError('Please add a valid product name and description.');
      return;
    }

    if (nextPrice !== null && (Number.isNaN(nextPrice) || nextPrice <= 0)) {
      setProductError('Price must be empty or a positive number.');
      return;
    }

    const nextProduct = {
      id: Date.now(),
      category: draftProduct.category,
      name: draftProduct.name.trim(),
      modelName: draftProduct.modelName.trim() || null,
      availability: draftProduct.availability.trim() || 'In stock',
      desc: draftProduct.desc.trim(),
      price: nextPrice,
      icon: draftProduct.icon.trim() || '🧾',
      tag: draftProduct.tag.trim() || null,
      images: [],
    };

    const nextProducts = addShopProduct(nextProduct);
    setProducts(nextProducts);
    setDraftProduct(EMPTY_PRODUCT);
    setProductError('');
  };

  const addImageToProduct = (productId, imageUrl) => {
    const currentProduct = products.find(product => product.id === productId);
    if (!currentProduct) return;

    const sanitized = imageUrl.trim();
    if (!sanitized) return;

    const nextImages = [...(currentProduct.images || []), sanitized];
    const nextProducts = updateProductImages(productId, nextImages);
    setProducts(nextProducts);
    setImageDrafts(drafts => ({ ...drafts, [productId]: '' }));
  };

  const handleImageUrlSubmit = (event, productId) => {
    event.preventDefault();
    addImageToProduct(productId, imageDrafts[productId] || '');
  };

  const handleImageUpload = (event, productId) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        addImageToProduct(productId, reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeProductImage = (productId, imageIndex) => {
    const currentProduct = products.find(product => product.id === productId);
    if (!currentProduct) return;

    const nextImages = (currentProduct.images || []).filter((_, index) => index !== imageIndex);
    const nextProducts = updateProductImages(productId, nextImages);
    setProducts(nextProducts);
  };

  const handleDeleteWaitlist = (entryId) => {
    setWaitlist(deleteWaitlistEntry(entryId));
  };

  if (!authenticated) {
    return (
      <section className="admin-page">
        <div className="container admin-auth">
          <h1>Admin Login</h1>
          <p>Sign in to access waitlist records and manage the shop gallery.</p>
          <form className="admin-auth__form" onSubmit={handleLogin}>
            <label>
              Username
              <input
                type="text"
                value={credentials.username}
                onChange={event => setCredentials(state => ({ ...state, username: event.target.value }))}
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={credentials.password}
                onChange={event => setCredentials(state => ({ ...state, password: event.target.value }))}
                required
              />
            </label>
            {authError && <p className="admin-error">{authError}</p>}
            <button type="submit" className="btn btn-primary">Log In</button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <div className="container admin-header">
        <div>
          <h1>LiveCare Admin</h1>
          <p>Manage waitlist submissions and shop product images from one dashboard.</p>
        </div>
        <button className="btn btn-secondary" onClick={handleLogout}>Log Out</button>
      </div>

      <div className="container admin-stats">
        <div className="admin-stat">
          <h3>Waitlist Signups</h3>
          <strong>{waitlist.length}</strong>
        </div>
        <div className="admin-stat">
          <h3>Shop Products</h3>
          <strong>{products.length}</strong>
        </div>
        <div className="admin-stat">
          <h3>Total Product Images</h3>
          <strong>{products.reduce((sum, product) => sum + (product.images?.length || 0), 0)}</strong>
        </div>
      </div>

      <div className="container admin-block">
        <h2>Waitlist Entries</h2>
        {waitlist.length === 0 ? (
          <p className="admin-empty">No waitlist entries yet.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Location</th>
                  <th>Submitted</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {waitlist.map(entry => (
                  <tr key={entry.id}>
                    <td>{entry.name}</td>
                    <td>{entry.email}</td>
                    <td>{entry.phone}</td>
                    <td>{entry.location}</td>
                    <td>{formatDate(entry.submittedAt)}</td>
                    <td>
                      <button
                        className="admin-delete"
                        onClick={() => handleDeleteWaitlist(entry.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="container admin-block">
        <h2>Add New Shop Item</h2>
        <form className="admin-product-form" onSubmit={handleAddProduct}>
          <label>
            Product Name
            <input
              type="text"
              value={draftProduct.name}
              onChange={event => setDraftProduct(state => ({ ...state, name: event.target.value }))}
            />
          </label>
          <label>
            Category
            <select
              value={draftProduct.category}
              onChange={event => setDraftProduct(state => ({ ...state, category: event.target.value }))}
            >
              {categoriesWithoutAll.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>
          <label>
            Model / Name (optional)
            <input
              type="text"
              value={draftProduct.modelName}
              onChange={event => setDraftProduct(state => ({ ...state, modelName: event.target.value }))}
            />
          </label>
          <label>
            Availability
            <input
              type="text"
              value={draftProduct.availability}
              onChange={event => setDraftProduct(state => ({ ...state, availability: event.target.value }))}
            />
          </label>
          <label>
            Price (NGN)
            <input
              type="number"
              min="0"
              value={draftProduct.price}
              onChange={event => setDraftProduct(state => ({ ...state, price: event.target.value }))}
              placeholder="Leave empty for price on request"
            />
          </label>
          <label>
            Icon (emoji)
            <input
              type="text"
              value={draftProduct.icon}
              onChange={event => setDraftProduct(state => ({ ...state, icon: event.target.value }))}
            />
          </label>
          <label>
            Tag (optional)
            <input
              type="text"
              value={draftProduct.tag}
              onChange={event => setDraftProduct(state => ({ ...state, tag: event.target.value }))}
            />
          </label>
          <label className="admin-product-form__wide">
            Description
            <textarea
              rows={3}
              value={draftProduct.desc}
              onChange={event => setDraftProduct(state => ({ ...state, desc: event.target.value }))}
            />
          </label>
          {productError && <p className="admin-error admin-product-form__wide">{productError}</p>}
          <div className="admin-product-form__wide">
            <button className="btn btn-primary" type="submit">Add Product</button>
          </div>
        </form>
      </div>

      <div className="container admin-block">
        <h2>Manage Product Images</h2>
        <div className="admin-products">
          {products.map(product => (
            <article key={product.id} className="admin-product-card">
              <div className="admin-product-card__head">
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.category} • {formatNaira(product.price)}</p>
                  {product.modelName && <p>Model: {product.modelName}</p>}
                  <p>Availability: {product.availability || 'In stock'}</p>
                </div>
              </div>

              <form className="admin-image-form" onSubmit={(event) => handleImageUrlSubmit(event, product.id)}>
                <input
                  type="url"
                  placeholder="Paste image URL"
                  value={imageDrafts[product.id] || ''}
                  onChange={event => setImageDrafts(drafts => ({ ...drafts, [product.id]: event.target.value }))}
                />
                <button className="btn btn-secondary" type="submit">Add URL</button>
              </form>

              <label className="admin-upload">
                Upload image file
                <input type="file" accept="image/*" onChange={(event) => handleImageUpload(event, product.id)} />
              </label>

              <div className="admin-gallery-grid">
                {(product.images || []).length === 0 ? (
                  <p className="admin-empty">No images yet.</p>
                ) : (
                  (product.images || []).map((image, index) => (
                    <div key={`${product.id}_${index}`} className="admin-gallery-item">
                      <img src={image} alt={`${product.name} ${index + 1}`} />
                      <button onClick={() => removeProductImage(product.id, index)}>
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
