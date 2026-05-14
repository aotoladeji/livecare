import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import {
  addCustomProductDB,
  certifyCaregiverDB,
  deleteCaregiverApplicationDB,
  deleteWaitlistEntryDB,
  getAllProductsDB,
  removeCertifiedCaregiverDB,
  subscribeCaregiverApplications,
  subscribeCertifiedCaregivers,
  subscribeWaitlist,
  updateProductImagesDB,
  deleteContactSubmissionDB,
  subscribeContacts,
  subscribeOrders,
  deleteOrderDB,
  updateOrderStatusDB,
} from '../utils/db';
import { isAdminAuthenticated, setAdminAuthenticated, getAdminPassword, setAdminPassword } from '../utils/storage';
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
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [waitlist, setWaitlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [caregiverApplications, setCaregiverApplications] = useState([]);
  const [certifiedCaregivers, setCertifiedCaregivers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbError, setDbError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [draftProduct, setDraftProduct] = useState(EMPTY_PRODUCT);
  const [productError, setProductError] = useState('');
  const [imageDrafts, setImageDrafts] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRefs = useRef({});

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');

  const handleRealtimeError = useCallback((error) => {
    if (error?.code === 'permission-denied') {
      setDbError('Permission denied for some admin data. Update Firestore rules or sign in with an authorized account.');
      return;
    }

    setDbError('Real-time updates are temporarily unavailable. Please refresh and try again.');
  }, []);

  const loadProducts = useCallback(() => {
    setDbLoading(true);
    setDbError('');
    getAllProductsDB({ fallbackOnPermissionDenied: false })
      .then(prods => setProducts(prods))
      .catch(err => {
        if (err?.code === 'permission-denied') {
          setDbError('Permission denied for product data. Update Firestore rules to allow admin access.');
        } else {
          console.error(err);
          setDbError('Failed to load products. Check your connection.');
        }
      })
      .finally(() => setDbLoading(false));
  }, []);

  // Real-time waitlist listener — auto-updates when new submissions arrive
  useEffect(() => {
    if (!authenticated) return;
    const unsubscribe = subscribeWaitlist((entries) => {
      setWaitlist(entries);
    }, handleRealtimeError);
    return () => unsubscribe();
  }, [authenticated, handleRealtimeError]);

  // Real-time caregiver application listener
  useEffect(() => {
    if (!authenticated) return;
    const unsubscribe = subscribeCaregiverApplications((entries) => {
      setCaregiverApplications(entries);
    }, handleRealtimeError);
    return () => unsubscribe();
  }, [authenticated, handleRealtimeError]);

  // Real-time certified caregivers listener
  useEffect(() => {
    if (!authenticated) return;
    const unsubscribe = subscribeCertifiedCaregivers((entries) => {
      setCertifiedCaregivers(entries);
    }, handleRealtimeError);
    return () => unsubscribe();
  }, [authenticated, handleRealtimeError]);

  // Real-time contacts listener
  useEffect(() => {
    if (!authenticated) return;
    const unsubscribe = subscribeContacts((entries) => {
      setContacts(entries);
    }, handleRealtimeError);
    return () => unsubscribe();
  }, [authenticated, handleRealtimeError]);

  // Real-time orders listener
  useEffect(() => {
    if (!authenticated) return;
    const unsubscribe = subscribeOrders((entries) => {
      setOrders(entries);
    }, handleRealtimeError);
    return () => unsubscribe();
  }, [authenticated, handleRealtimeError]);

  // Load products once on login
  useEffect(() => {
    if (authenticated) loadProducts();
  }, [authenticated, loadProducts]);

  const loadData = loadProducts;

  const categoriesWithoutAll = useMemo(
    () => CATEGORIES.filter(category => category !== 'All'),
    []
  );

  const liveSessions = useMemo(() => {
    const now = Date.now();
    return orders
      .filter(order => !['completed', 'cancelled'].includes(String(order.status || '').toLowerCase()))
      .map(order => {
        const createdMs = new Date(order.createdAt || Date.now()).getTime();
        const ageHours = Math.max(0, (now - createdMs) / (1000 * 60 * 60));
        const textBlob = `${order.notes || ''} ${order.message || ''} ${order.status || ''}`.toLowerCase();
        const flagged = textBlob.includes('incident') || textBlob.includes('unsafe') || textBlob.includes('complaint') || String(order.status || '').toLowerCase() === 'flagged';

        let indicator = 'On time';
        if (flagged) indicator = 'Flagged';
        else if (ageHours > 24) indicator = 'Delayed';

        const activityCount = Array.isArray(order.items)
          ? order.items.reduce((sum, item) => sum + Number(item?.quantity || 1), 0)
          : Number(order.quantity || 1);

        return {
          ...order,
          indicator,
          ageHours,
          activityCount,
          sessionLabel: order.productName || 'Care Session',
          customerLabel: order.customerName || order.name || order.email || 'Unknown',
        };
      });
  }, [orders]);

  const liveSessionCounts = useMemo(() => {
    return liveSessions.reduce((acc, session) => {
      if (session.indicator === 'On time') acc.onTime += 1;
      if (session.indicator === 'Delayed') acc.delayed += 1;
      if (session.indicator === 'Flagged') acc.flagged += 1;
      return acc;
    }, { onTime: 0, delayed: 0, flagged: 0 });
  }, [liveSessions]);

  const activityLogs = useMemo(() => {
    const orderLogs = orders.map(order => ({
      id: `order-${order.id}`,
      type: 'Session',
      title: `${order.customerName || 'Customer'} session ${order.status || 'pending'}`,
      detail: order.productName || 'Care service',
      date: order.createdAt,
    }));

    const caregiverLogs = caregiverApplications.map(entry => ({
      id: `caregiver-${entry.id}`,
      type: 'Caregiver',
      title: `${entry.name || 'Applicant'} submitted caregiver application`,
      detail: entry.location || 'Location not set',
      date: entry.submittedAt,
    }));

    const contactLogs = contacts.map(entry => ({
      id: `contact-${entry.id}`,
      type: 'Inquiry',
      title: `${entry.name || 'User'} sent an inquiry`,
      detail: entry.subject || 'No subject',
      date: entry.submittedAt,
    }));

    return [...orderLogs, ...caregiverLogs, ...contactLogs]
      .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
      .slice(0, 20);
  }, [orders, caregiverApplications, contacts]);

  const userManagement = useMemo(() => {
    const buckets = [waitlist, contacts, caregiverApplications, certifiedCaregivers];
    const map = new Map();

    buckets.forEach(list => {
      list.forEach(entry => {
        const email = String(entry.email || '').trim().toLowerCase();
        if (!email) return;

        if (!map.has(email)) {
          map.set(email, {
            email,
            name: entry.name || 'Unknown',
            waitlist: 0,
            contacts: 0,
            applications: 0,
            certified: 0,
          });
        }

        const current = map.get(email);
        if (waitlist.includes(entry)) current.waitlist += 1;
        if (contacts.includes(entry)) current.contacts += 1;
        if (caregiverApplications.includes(entry)) current.applications += 1;
        if (certifiedCaregivers.includes(entry)) current.certified += 1;
      });
    });

    return Array.from(map.values()).sort((a, b) => {
      const scoreA = a.certified * 10 + a.applications * 4 + a.contacts + a.waitlist;
      const scoreB = b.certified * 10 + b.applications * 4 + b.contacts + b.waitlist;
      return scoreB - scoreA;
    });
  }, [waitlist, contacts, caregiverApplications, certifiedCaregivers]);

  const incidentReports = useMemo(() => {
    const keyword = /(incident|unsafe|complaint|violence|abuse|delay)/i;

    const orderIncidents = liveSessions
      .filter(session => session.indicator === 'Flagged' || keyword.test(`${session.notes || ''} ${session.message || ''}`))
      .map(session => ({
        id: `session-${session.id}`,
        source: 'Session Monitoring',
        label: session.sessionLabel,
        reporter: session.customerLabel,
        severity: session.indicator === 'Flagged' ? 'high' : 'medium',
        date: session.createdAt,
        notes: session.notes || session.message || 'Flagged by system monitoring rules.',
      }));

    const contactIncidents = contacts
      .filter(entry => keyword.test(`${entry.subject || ''} ${entry.message || ''}`))
      .map(entry => ({
        id: `contact-${entry.id}`,
        source: 'Contact Inquiry',
        label: entry.subject || 'Incident-related inquiry',
        reporter: entry.name || entry.email || 'Anonymous',
        severity: 'medium',
        date: entry.submittedAt,
        notes: entry.message || 'No additional details',
      }));

    return [...orderIncidents, ...contactIncidents]
      .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
  }, [liveSessions, contacts]);

  const consistencySummary = useMemo(() => {
    const total = caregiverApplications.length;
    const withId = caregiverApplications.filter(entry => Array.isArray(entry.verificationDocuments) && entry.verificationDocuments.length > 0).length;
    const consistencyRate = total === 0 ? 0 : Math.round((withId / total) * 100);

    return {
      consistencyRate,
      withId,
      withoutId: Math.max(total - withId, 0),
    };
  }, [caregiverApplications]);

  const handleChangePassword = (event) => {
    event.preventDefault();
    setPasswordError('');

    const storedPassword = getAdminPassword();
    const currentPassword = storedPassword || ADMIN_PASS;

    if (passwordForm.currentPassword !== currentPassword) {
      setPasswordError('Current password is incorrect.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setAdminPassword(passwordForm.newPassword);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowChangePassword(false);
    alert('Password changed successfully!');
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const storedPassword = getAdminPassword();
    const validPassword = storedPassword || ADMIN_PASS;
    if (credentials.username === ADMIN_USER && credentials.password === validPassword) {
      setAdminAuthenticated(true);
      setAuthenticated(true);
      setAuthError('');
      return;
    }
    setAuthError('Invalid admin credentials. Please try again.');
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    setAdminAuthenticated(false);
    setAuthenticated(false);
    setCredentials({ username: '', password: '' });
    navigate('/');
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

    addCustomProductDB(nextProduct)
      .then(() => loadData())
      .catch(err => {
        console.error(err);
        setProductError('Failed to save product. Try again.');
      });
    setDraftProduct(EMPTY_PRODUCT);
    setProductError('');
  };

  const addImageToProduct = (productId, imageUrl) => {
    const currentProduct = products.find(product => product.id === productId);
    if (!currentProduct) return;

    const sanitized = imageUrl.trim();
    if (!sanitized) return;

    const nextImages = [...(currentProduct.images || []), sanitized];
    updateProductImagesDB(productId, nextImages)
      .then(() => loadData())
      .catch(err => console.error('Image URL save failed:', err));
    setImageDrafts(drafts => ({ ...drafts, [productId]: '' }));
  };

  const handleImageUrlSubmit = (event, productId) => {
    event.preventDefault();
    addImageToProduct(productId, imageDrafts[productId] || '');
  };

  const handleImageUpload = (event, productId) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const currentProduct = products.find(product => product.id === productId);
    if (!currentProduct) return;

    setUploadProgress(prev => ({ ...prev, [productId]: { done: 0, total: files.length } }));

    const uploadedUrls = [];

    const uploadNext = (index) => {
      if (index >= files.length) {
        // All done
        const nextImages = [...(currentProduct.images || []), ...uploadedUrls];
        updateProductImagesDB(productId, nextImages)
          .then(() => loadData())
          .catch(err => console.error('Image upload save failed:', err));
        setUploadProgress(prev => { const s = { ...prev }; delete s[productId]; return s; });
        if (fileInputRefs.current[productId]) fileInputRefs.current[productId].value = '';
        return;
      }

      const file = files[index];
      const storageRef = ref(storage, `products/${productId}/${Date.now()}_${file.name}`);
      const task = uploadBytesResumable(storageRef, file);

      task.on('state_changed',
        null,
        (error) => {
          console.error('Upload failed:', error);
          setUploadProgress(prev => { const s = { ...prev }; delete s[productId]; return s; });
        },
        () => {
          getDownloadURL(task.snapshot.ref).then((url) => {
            uploadedUrls.push(url);
            setUploadProgress(prev => ({
              ...prev,
              [productId]: { done: index + 1, total: files.length },
            }));
            uploadNext(index + 1);
          });
        }
      );
    };

    uploadNext(0);
    event.target.value = '';
  };

  const removeProductImage = (productId, imageIndex) => {
    const currentProduct = products.find(product => product.id === productId);
    if (!currentProduct) return;

    const nextImages = (currentProduct.images || []).filter((_, index) => index !== imageIndex);
    updateProductImagesDB(productId, nextImages)
      .then(() => loadData())
      .catch(err => console.error('Image removal failed:', err));
  };

  const handleDeleteWaitlist = (entryId) => {
    deleteWaitlistEntryDB(entryId)
      .catch(err => console.error('Delete failed:', err));
    // The real-time listener will automatically update the waitlist state
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

  const NAV_GROUPS = [
    {
      id: 'operations',
      label: 'Operations',
      items: [
        { id: 'overview', icon: '📊', label: 'Overview' },
        { id: 'live-monitoring', icon: '🟢', label: 'Live Monitoring', badge: liveSessions.length },
        { id: 'incident-handling', icon: '🚨', label: 'Incident Handling', badge: incidentReports.length },
        { id: 'session-monitoring', icon: '🎯', label: 'Session Monitoring', badge: liveSessions.length },
        { id: 'quality-review', icon: '🧪', label: 'Quality Review' },
      ],
    },
    {
      id: 'pipeline',
      label: 'Leads & Requests',
      items: [
        { id: 'orders', icon: '🛒', label: 'Orders', badge: orders.length },
        { id: 'waitlist', icon: '📋', label: 'Waitlist', badge: waitlist.length },
        { id: 'contacts', icon: '💬', label: 'Contact Inquiries', badge: contacts.length },
      ],
    },
    {
      id: 'care-team',
      label: 'Care Team',
      items: [
        { id: 'cg-apps', icon: '👤', label: 'CG Applications', badge: caregiverApplications.length },
        { id: 'certified', icon: '🏅', label: 'Certified Caregivers', badge: certifiedCaregivers.length },
        { id: 'user-management', icon: '👥', label: 'User Management', badge: userManagement.length },
      ],
    },
    {
      id: 'catalog',
      label: 'Shop Catalog',
      items: [
        { id: 'images', icon: '🖼️', label: 'Product Images', badge: products.length },
        { id: 'add-product', icon: '➕', label: 'Add Shop Item' },
      ],
    },
    {
      id: 'account',
      label: 'Account',
      items: [
        { id: '__back_to_web__', icon: '🌐', label: 'Back to Web', action: () => navigate('/') },
        { id: '__change_password__', icon: '🔐', label: 'Change Password', action: () => setShowChangePassword(true) },
        { id: '__logout__', icon: '🚪', label: 'Log Out', action: handleLogout, tone: 'logout' },
      ],
    },
  ];

  const NAV_ITEMS = NAV_GROUPS.flatMap(group => group.items);

  const navTo = (id) => { setActiveSection(id); setSidebarOpen(false); };

  return (
    <div className="adm-shell">
      {/* ── Sidebar ── */}
      <aside className={`adm-sidebar ${sidebarOpen ? 'adm-sidebar--open' : ''}`}>
        <div className="adm-sidebar__brand">
          <span className="adm-sidebar__logo">⚕️</span>
          <div>
            <p className="adm-sidebar__title">LiveCare</p>
            <p className="adm-sidebar__sub">Admin Panel</p>
          </div>
        </div>

        <nav className="adm-sidebar__nav">
          {NAV_GROUPS.map(group => (
            <div key={group.id} className="adm-nav-group">
              <p className="adm-nav-group__label">{group.label}</p>
              {group.items.map(item => (
                <button
                  key={item.id}
                  className={`adm-nav-item ${activeSection === item.id ? 'adm-nav-item--active' : ''} ${item.tone === 'logout' ? 'adm-nav-item--logout' : ''}`}
                  onClick={() => {
                    if (typeof item.action === 'function') {
                      item.action();
                      setSidebarOpen(false);
                      return;
                    }
                    navTo(item.id);
                  }}
                >
                  <span className="adm-nav-item__icon">{item.icon}</span>
                  <span className="adm-nav-item__label">{item.label}</span>
                  {item.badge > 0 && <span className="adm-nav-item__badge">{item.badge}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="adm-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ── Main content ── */}
      <div className="adm-main">
        {/* Top bar */}
        <header className="adm-topbar">
          <button className="adm-hamburger" onClick={() => setSidebarOpen(v => !v)} aria-label="Toggle sidebar">
            <span /><span /><span />
          </button>
          <div className="adm-topbar__title">
            <h1>{NAV_ITEMS.find(n => n.id === activeSection)?.label}</h1>
          </div>
          <button className="adm-topbar__refresh btn btn-secondary" onClick={loadData} disabled={dbLoading}>
            {dbLoading ? '…' : '↻ Refresh'}
          </button>
        </header>

        {dbError && <p className="adm-error-banner">{dbError}</p>}

        <div className="adm-content">

          {/* ── Overview ── */}
          {activeSection === 'overview' && (
            <div className="adm-section">
              <div className="adm-stats">
                <div className="adm-stat">
                  <span className="adm-stat__icon">📋</span>
                  <div>
                    <p className="adm-stat__label">Waitlist Signups</p>
                    <strong className="adm-stat__val">{waitlist.length}</strong>
                  </div>
                </div>
                <div className="adm-stat">
                  <span className="adm-stat__icon">�</span>
                  <div>
                    <p className="adm-stat__label">Contact Inquiries</p>
                    <strong className="adm-stat__val">{contacts.length}</strong>
                  </div>
                </div>
                <div className="adm-stat">
                  <span className="adm-stat__icon">🛒</span>
                  <div>
                    <p className="adm-stat__label">Orders</p>
                    <strong className="adm-stat__val">{orders.length}</strong>
                  </div>
                </div>
                <div className="adm-stat">
                  <span className="adm-stat__icon">👤</span>
                  <div>
                    <p className="adm-stat__label">CG Applications</p>
                    <strong className="adm-stat__val">{caregiverApplications.length}</strong>
                  </div>
                </div>
                <div className="adm-stat">
                  <span className="adm-stat__icon">🏅</span>
                  <div>
                    <p className="adm-stat__label">Certified Caregivers</p>
                    <strong className="adm-stat__val">{certifiedCaregivers.length}</strong>
                  </div>
                </div>
              </div>

              <div className="adm-overview-shortcuts">
                {NAV_ITEMS.filter(n => n.id !== 'overview').map(item => (
                  <button key={item.id} className="adm-shortcut" onClick={() => navTo(item.id)}>
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Waitlist ── */}
          {activeSection === 'waitlist' && (
            <div className="adm-section">
              {waitlist.length === 0 ? (
                <p className="adm-empty">No waitlist entries yet.</p>
              ) : (
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr><th>Name</th><th>Email</th><th>Phone</th><th>Location</th><th>Submitted</th><th></th></tr>
                    </thead>
                    <tbody>
                      {waitlist.map(entry => (
                        <tr key={entry.id}>
                          <td>{entry.name}</td>
                          <td>{entry.email}</td>
                          <td>{entry.phone}</td>
                          <td>{entry.location}</td>
                          <td>{formatDate(entry.submittedAt)}</td>
                          <td><button className="adm-btn-delete" onClick={() => handleDeleteWaitlist(entry.id)}>Delete</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Contact Inquiries ── */}
          {activeSection === 'contacts' && (
            <div className="adm-section">
              <div style={{ marginBottom: '16px', display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    border: '1px solid var(--gray-200)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              {contacts.length === 0 ? (
                <p className="adm-empty">No contact inquiries yet.</p>
              ) : (
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr><th>Name</th><th>Email</th><th>Subject</th><th>Message</th><th>Date</th><th></th></tr>
                    </thead>
                    <tbody>
                      {contacts.filter(c => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase())).map(entry => (
                        <tr key={entry.id}>
                          <td>{entry.name}</td>
                          <td>{entry.email}</td>
                          <td>{entry.subject}</td>
                          <td className="adm-td-msg">{entry.message}</td>
                          <td>{formatDate(entry.submittedAt)}</td>
                          <td><button className="adm-btn-delete" onClick={() => deleteContactSubmissionDB(entry.id).catch(console.error)}>Delete</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Orders ── */}
          {activeSection === 'orders' && (
            <div className="adm-section">
              <div style={{ marginBottom: '16px', display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Search by customer name..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    border: '1px solid var(--gray-200)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    fontSize: '0.9rem'
                  }}
                />
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  style={{
                    border: '1px solid var(--gray-200)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              {orders.length === 0 ? (
                <p className="adm-empty">No orders yet.</p>
              ) : (
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr><th>Product</th><th>Customer</th><th>Qty</th><th>Amount</th><th>Status</th><th>Date</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {orders.filter(o => {
                        const matchSearch = !searchQuery || o.customerName.toLowerCase().includes(searchQuery.toLowerCase());
                        const matchStatus = statusFilter === 'all' || o.status === statusFilter;
                        return matchSearch && matchStatus;
                      }).map(order => (
                        <tr key={order.id}>
                          <td>{order.productName}</td>
                          <td>{order.customerName}</td>
                          <td>{order.quantity}</td>
                          <td>{formatNaira(order.totalAmount)}</td>
                          <td style={{ textTransform: 'capitalize', fontWeight: 500 }}>{order.status || 'pending'}</td>
                          <td>{formatDate(order.createdAt)}</td>
                          <td>
                            <div className="adm-actions">
                              <select
                                value={order.status || 'pending'}
                                onChange={e => updateOrderStatusDB(order.id, e.target.value).catch(console.error)}
                                style={{ fontSize: '0.8rem', padding: '4px 8px', borderRadius: '5px', border: '1px solid var(--gray-200)' }}
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="shipped">Shipped</option>
                                <option value="completed">Completed</option>
                              </select>
                              <button className="adm-btn-delete" onClick={() => deleteOrderDB(order.id).catch(console.error)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Live Monitoring Dashboard ── */}
          {activeSection === 'live-monitoring' && (
            <div className="adm-section">
              <div className="adm-stats adm-monitoring-stats">
                <div className="adm-stat"><span className="adm-stat__icon">🟢</span><div><p className="adm-stat__label">On Time</p><strong className="adm-stat__val">{liveSessionCounts.onTime}</strong></div></div>
                <div className="adm-stat"><span className="adm-stat__icon">🟠</span><div><p className="adm-stat__label">Delayed</p><strong className="adm-stat__val">{liveSessionCounts.delayed}</strong></div></div>
                <div className="adm-stat"><span className="adm-stat__icon">🔴</span><div><p className="adm-stat__label">Flagged</p><strong className="adm-stat__val">{liveSessionCounts.flagged}</strong></div></div>
              </div>

              {liveSessions.length === 0 ? (
                <p className="adm-empty">No active sessions at the moment.</p>
              ) : (
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr><th>Session</th><th>Customer</th><th>Status</th><th>Activity Count</th><th>Age</th><th>Created</th></tr>
                    </thead>
                    <tbody>
                      {liveSessions.map(session => (
                        <tr key={session.id}>
                          <td>{session.sessionLabel}</td>
                          <td>{session.customerLabel}</td>
                          <td><span className={`adm-status-pill adm-status-pill--${session.indicator.toLowerCase().replace(' ', '-')}`}>{session.indicator}</span></td>
                          <td>{session.activityCount}</td>
                          <td>{Math.round(session.ageHours)}h</td>
                          <td>{formatDate(session.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Quality Review Panel ── */}
          {activeSection === 'quality-review' && (
            <div className="adm-section">
              <div className="adm-stats adm-monitoring-stats">
                <div className="adm-stat"><span className="adm-stat__icon">📑</span><div><p className="adm-stat__label">Activity Logs</p><strong className="adm-stat__val">{activityLogs.length}</strong></div></div>
                <div className="adm-stat"><span className="adm-stat__icon">📈</span><div><p className="adm-stat__label">Consistency</p><strong className="adm-stat__val">{consistencySummary.consistencyRate}%</strong></div></div>
                <div className="adm-stat"><span className="adm-stat__icon">🚨</span><div><p className="adm-stat__label">Incident Reports</p><strong className="adm-stat__val">{incidentReports.length}</strong></div></div>
              </div>

              <div className="adm-table-wrap" style={{ marginBottom: '16px' }}>
                <table className="adm-table">
                  <thead>
                    <tr><th>Timestamp</th><th>Type</th><th>Activity</th><th>Observation</th></tr>
                  </thead>
                  <tbody>
                    {activityLogs.length === 0 ? (
                      <tr><td colSpan={4}>No activity logs yet.</td></tr>
                    ) : activityLogs.map(log => (
                      <tr key={log.id}>
                        <td>{formatDate(log.date)}</td>
                        <td>{log.type}</td>
                        <td>{log.title}</td>
                        <td>{log.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="adm-overview-shortcuts adm-quality-patterns">
                <div className="adm-shortcut">
                  <span>🧭</span>
                  <span>Observation Patterns</span>
                  <small>{liveSessionCounts.delayed} delayed sessions currently require follow-up.</small>
                </div>
                <div className="adm-shortcut">
                  <span>👤</span>
                  <span>Caregiver Consistency</span>
                  <small>{consistencySummary.withId} with IDs uploaded, {consistencySummary.withoutId} pending document verification.</small>
                </div>
                <div className="adm-shortcut">
                  <span>🚨</span>
                  <span>Incident Reports</span>
                  <small>{incidentReports.length} reports identified from session and inquiry streams.</small>
                </div>
              </div>
            </div>
          )}

          {/* ── User Management ── */}
          {activeSection === 'user-management' && (
            <div className="adm-section">
              {userManagement.length === 0 ? (
                <p className="adm-empty">No users captured yet.</p>
              ) : (
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr><th>Name</th><th>Email</th><th>Waitlist</th><th>Inquiries</th><th>Applications</th><th>Certified</th></tr>
                    </thead>
                    <tbody>
                      {userManagement.slice(0, 50).map(user => (
                        <tr key={user.email}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.waitlist}</td>
                          <td>{user.contacts}</td>
                          <td>{user.applications}</td>
                          <td>{user.certified}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Session Monitoring ── */}
          {activeSection === 'session-monitoring' && (
            <div className="adm-section">
              {liveSessions.length === 0 ? (
                <p className="adm-empty">No sessions available for monitoring.</p>
              ) : (
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr><th>Session</th><th>Customer</th><th>Indicator</th><th>Status</th><th>Activity Count</th></tr>
                    </thead>
                    <tbody>
                      {liveSessions.map(session => (
                        <tr key={`monitor-${session.id}`}>
                          <td>{session.sessionLabel}</td>
                          <td>{session.customerLabel}</td>
                          <td><span className={`adm-status-pill adm-status-pill--${session.indicator.toLowerCase().replace(' ', '-')}`}>{session.indicator}</span></td>
                          <td style={{ textTransform: 'capitalize' }}>{session.status || 'pending'}</td>
                          <td>{session.activityCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Incident Handling ── */}
          {activeSection === 'incident-handling' && (
            <div className="adm-section">
              {incidentReports.length === 0 ? (
                <p className="adm-empty">No incidents detected.</p>
              ) : (
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr><th>Source</th><th>Subject</th><th>Reporter</th><th>Severity</th><th>Notes</th><th>Date</th></tr>
                    </thead>
                    <tbody>
                      {incidentReports.map(report => (
                        <tr key={report.id}>
                          <td>{report.source}</td>
                          <td>{report.label}</td>
                          <td>{report.reporter}</td>
                          <td><span className={`adm-severity adm-severity--${report.severity}`}>{report.severity.toUpperCase()}</span></td>
                          <td className="adm-td-msg">{report.notes}</td>
                          <td>{formatDate(report.date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Caregiver Applications ── */}
          {activeSection === 'cg-apps' && (
            <div className="adm-section">
              {caregiverApplications.length === 0 ? (
                <p className="adm-empty">No caregiver applications yet.</p>
              ) : (
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr><th>Name</th><th>Email</th><th>Phone</th><th>Location</th><th>Experience</th><th>ID Verification</th><th>Submitted</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {caregiverApplications.map(entry => {
                        const hasIdUpload = entry.verificationDocuments && entry.verificationDocuments.length > 0;
                        const idDoc = hasIdUpload ? entry.verificationDocuments[0] : null;
                        return (
                          <tr key={entry.id}>
                            <td>{entry.name}</td>
                            <td>{entry.email}</td>
                            <td>{entry.phone}</td>
                            <td>{entry.location}</td>
                            <td>{entry.experience || '—'}</td>
                            <td className="adm-id-status">
                              {hasIdUpload ? (
                                <div className="adm-id-badge adm-id-badge--uploaded">
                                  <span>✓ {idDoc.type.replace('_', ' ')}</span>
                                  <a
                                    href={idDoc.downloadURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="adm-id-link"
                                    title="Download ID document"
                                  >
                                    📥 View
                                  </a>
                                </div>
                              ) : (
                                <div className="adm-id-badge adm-id-badge--pending">
                                  <span>⏳ Pending</span>
                                </div>
                              )}
                            </td>
                            <td>{formatDate(entry.submittedAt)}</td>
                            <td>
                              <div className="adm-actions">
                                <button className="adm-btn-certify" onClick={() => certifyCaregiverDB(entry).catch(console.error)}>✅ Certify</button>
                                <button className="adm-btn-delete" onClick={() => deleteCaregiverApplicationDB(entry.id).catch(console.error)}>Delete</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Certified Caregivers ── */}
          {activeSection === 'certified' && (
            <div className="adm-section">
              {certifiedCaregivers.length === 0 ? (
                <p className="adm-empty">No certified caregivers yet.</p>
              ) : (
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr><th>Name</th><th>Email</th><th>Phone</th><th>Location</th><th>Experience</th><th>Certified On</th><th></th></tr>
                    </thead>
                    <tbody>
                      {certifiedCaregivers.map(entry => (
                        <tr key={entry.id}>
                          <td>{entry.name}</td>
                          <td>{entry.email}</td>
                          <td>{entry.phone}</td>
                          <td>{entry.location}</td>
                          <td>{entry.experience || '—'}</td>
                          <td>{formatDate(entry.certifiedAt)}</td>
                          <td><button className="adm-btn-delete" onClick={() => removeCertifiedCaregiverDB(entry.id).catch(console.error)}>Remove</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Add Shop Item ── */}
          {activeSection === 'add-product' && (
            <div className="adm-section">
              <form className="adm-product-form" onSubmit={handleAddProduct}>
                <label>
                  Product Name
                  <input type="text" value={draftProduct.name} onChange={e => setDraftProduct(s => ({ ...s, name: e.target.value }))} />
                </label>
                <label>
                  Category
                  <select value={draftProduct.category} onChange={e => setDraftProduct(s => ({ ...s, category: e.target.value }))}>
                    {categoriesWithoutAll.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </label>
                <label>
                  Model / Name (optional)
                  <input type="text" value={draftProduct.modelName} onChange={e => setDraftProduct(s => ({ ...s, modelName: e.target.value }))} />
                </label>
                <label>
                  Availability
                  <input type="text" value={draftProduct.availability} onChange={e => setDraftProduct(s => ({ ...s, availability: e.target.value }))} />
                </label>
                <label>
                  Price (NGN)
                  <input type="number" min="0" value={draftProduct.price} onChange={e => setDraftProduct(s => ({ ...s, price: e.target.value }))} placeholder="Leave empty for price on request" />
                </label>
                <label>
                  Icon (emoji)
                  <input type="text" value={draftProduct.icon} onChange={e => setDraftProduct(s => ({ ...s, icon: e.target.value }))} />
                </label>
                <label>
                  Tag (optional)
                  <input type="text" value={draftProduct.tag} onChange={e => setDraftProduct(s => ({ ...s, tag: e.target.value }))} />
                </label>
                <label className="adm-product-form__wide">
                  Description
                  <textarea rows={3} value={draftProduct.desc} onChange={e => setDraftProduct(s => ({ ...s, desc: e.target.value }))} />
                </label>
                {productError && <p className="adm-form-error adm-product-form__wide">{productError}</p>}
                <div className="adm-product-form__wide">
                  <button className="btn btn-primary" type="submit">Add Product</button>
                </div>
              </form>
            </div>
          )}

          {/* ── Product Images ── */}
          {activeSection === 'images' && (
            <div className="adm-section">
              <div className="adm-products">
                {products.map(product => (
                  <article key={product.id} className="adm-product-card">
                    <div className="adm-product-card__head">
                      <h3>{product.name}</h3>
                      <p>{product.category} · {formatNaira(product.price)}</p>
                      {product.modelName && <p>Model: {product.modelName}</p>}
                    </div>

                    <form className="adm-image-form" onSubmit={e => handleImageUrlSubmit(e, product.id)}>
                      <input
                        type="url"
                        placeholder="Paste image URL"
                        value={imageDrafts[product.id] || ''}
                        onChange={e => setImageDrafts(d => ({ ...d, [product.id]: e.target.value }))}
                      />
                      <button className="btn btn-secondary" type="submit">Add URL</button>
                    </form>

                    <label className="adm-upload">
                      Upload image files
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        ref={el => { fileInputRefs.current[product.id] = el; }}
                        onChange={e => handleImageUpload(e, product.id)}
                      />
                    </label>

                    {uploadProgress[product.id] && (
                      <p className="adm-upload-progress">Uploading {uploadProgress[product.id].done} / {uploadProgress[product.id].total}…</p>
                    )}

                    <div className="adm-gallery-grid">
                      {(product.images || []).length === 0 ? (
                        <p className="adm-empty">No images yet.</p>
                      ) : (
                        (product.images || []).map((img, idx) => (
                          <div key={`${product.id}_${idx}`} className="adm-gallery-item">
                            <img src={img} alt={`${product.name} ${idx + 1}`} />
                            <button onClick={() => removeProductImage(product.id, idx)}>Remove</button>
                          </div>
                        ))
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Change Password Modal ── */}
      {showChangePassword && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }} onClick={() => setShowChangePassword(false)}>
          <div style={{
            background: 'var(--white)',
            borderRadius: '14px',
            padding: '28px',
            width: '100%',
            maxWidth: '380px',
            boxShadow: '0 16px 48px rgba(0,0,0,0.16)',
            animation: 'adm-fade-in 0.2s ease'
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 16px', color: 'var(--navy)', fontSize: '1.2rem' }}>Change Password</h2>
            <form onSubmit={handleChangePassword} style={{ display: 'grid', gap: '14px' }}>
              <label style={{ display: 'grid', gap: '4px', fontSize: '0.9rem', color: 'var(--gray-600)', fontWeight: 500 }}>
                Current Password
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={e => setPasswordForm(s => ({ ...s, currentPassword: e.target.value }))}
                  required
                  style={{
                    border: '1px solid var(--gray-200)',
                    borderRadius: '9px',
                    padding: '10px 12px',
                    fontSize: '0.93rem',
                    color: 'var(--navy)'
                  }}
                />
              </label>
              <label style={{ display: 'grid', gap: '4px', fontSize: '0.9rem', color: 'var(--gray-600)', fontWeight: 500 }}>
                New Password
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm(s => ({ ...s, newPassword: e.target.value }))}
                  required
                  style={{
                    border: '1px solid var(--gray-200)',
                    borderRadius: '9px',
                    padding: '10px 12px',
                    fontSize: '0.93rem',
                    color: 'var(--navy)'
                  }}
                />
              </label>
              <label style={{ display: 'grid', gap: '4px', fontSize: '0.9rem', color: 'var(--gray-600)', fontWeight: 500 }}>
                Confirm Password
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={e => setPasswordForm(s => ({ ...s, confirmPassword: e.target.value }))}
                  required
                  style={{
                    border: '1px solid var(--gray-200)',
                    borderRadius: '9px',
                    padding: '10px 12px',
                    fontSize: '0.93rem',
                    color: 'var(--navy)'
                  }}
                />
              </label>
              {passwordError && <p style={{ color: '#b91c1c', fontSize: '0.87rem', fontWeight: 600, margin: 0 }}>{passwordError}</p>}
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Change Password</button>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowChangePassword(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
