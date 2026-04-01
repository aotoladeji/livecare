import React, { useState } from 'react';
import useInView from '../../hooks/useInView';
import './WaitlistForm.css';

const INITIAL = { name: '', phone: '', email: '', location: '' };

export default function WaitlistForm() {
  const [ref, inView] = useInView();
  const [form, setForm]       = useState(INITIAL);
  const [errors, setErrors]   = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]  = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = 'Full name is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = 'Valid email is required';
    if (!form.location.trim()) e.location = 'Location is required';
    return e;
  };

  const handleChange = ({ target: { name, value } }) => {
    setForm(f => ({ ...f, [name]: value }));
    setErrors(e => ({ ...e, [name]: '' }));
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    // Simulate API call
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1400);
  };

  return (
    <section className="waitlist" id="waitlist" ref={ref}>
      <div className="waitlist__bg-blob" />
      <div className="container waitlist__inner">
        {/* Left text */}
        <div className={`waitlist__text ${inView ? 'visible' : ''}`}>
          <span className="section-tag">🚀 Early Access</span>
          <h2 className="section-title">
            Be among the first to<br /><span>access LiveCare</span>
          </h2>
          <p className="section-subtitle" style={{ marginTop: 12 }}>
            We're launching in Ibadan, Nigeria. Enter your details to get early access when we go live in your area.
            No spam — just your launch invite.
          </p>
          <div className="waitlist__perks">
            {['Priority access when we launch', 'Exclusive early-adopter pricing', 'Direct line to our care team', 'Shape the product with your feedback'].map((p, i) => (
              <div key={i} className="waitlist__perk">
                <span className="waitlist__check">✓</span>
                <span>{p}</span>
              </div>
            ))}
          </div>
          <div className="waitlist__count">
            <div className="waitlist__avatars">
              {['👩🏽','👨🏿','👩🏻','👴🏾'].map((e, i) => (
                <span key={i} style={{ zIndex: 4-i }}>{e}</span>
              ))}
            </div>
            <p><strong>10+ families</strong> already on the waitlist</p>
          </div>
        </div>

        {/* Form */}
        <div className={`waitlist__form-wrap ${inView ? 'visible' : ''}`}>
          {submitted ? (
            <div className="waitlist__success">
              <div className="waitlist__success-icon">🎉</div>
              <h3>You're on the list!</h3>
              <p>Thanks for joining, <strong>{form.name.split(' ')[0]}</strong>. We'll notify you as soon as LiveCare launches in your area.</p>
              <button className="btn btn-secondary" onClick={() => { setSubmitted(false); setForm(INITIAL); }}>
                Add another person
              </button>
            </div>
          ) : (
            <form className="waitlist__form" onSubmit={handleSubmit} noValidate>
              <h3>Join the Waitlist</h3>
              <p>Fill in your details below — it takes under a minute.</p>

              <div className="waitlist__fields">
                <Field label="Full Name" name="name" type="text" placeholder="e.g. Amara Johnson"
                  value={form.name} onChange={handleChange} error={errors.name} icon="👤" />
                <Field label="Phone Number" name="phone" type="tel" placeholder="e.g. 08012345678"
                  value={form.phone} onChange={handleChange} error={errors.phone} icon="📞" />
                <Field label="Email Address" name="email" type="email" placeholder="you@example.com"
                  value={form.email} onChange={handleChange} error={errors.email} icon="✉️" />
                <Field label="Your Location" name="location" type="text" placeholder="e.g. Bodija, Ibadan"
                  value={form.location} onChange={handleChange} error={errors.location} icon="📍" />
              </div>

              <button type="submit" className={`btn btn-primary btn-lg waitlist__submit ${loading ? 'loading' : ''}`} disabled={loading}>
                {loading ? <span className="waitlist__spinner" /> : '🚀 Join the Waitlist'}
              </button>

              <p className="waitlist__disclaimer">
                🔒 Your details are private and will never be shared or sold.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, type, placeholder, value, onChange, error, icon }) {
  return (
    <div className={`waitlist__field ${error ? 'has-error' : ''}`}>
      <label htmlFor={name}>{label}</label>
      <div className="waitlist__input-wrap">
        <span className="waitlist__input-icon">{icon}</span>
        <input id={name} name={name} type={type} placeholder={placeholder} value={value} onChange={onChange} />
      </div>
      {error && <p className="waitlist__error">{error}</p>}
    </div>
  );
}
