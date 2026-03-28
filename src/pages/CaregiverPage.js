import React, { useState } from 'react';
import PageHero from '../components/ui/PageHero';
import useInView from '../hooks/useInView';
import './CaregiverPage.css';

const STEPS = [
  { num: '01', title: 'Apply Online', desc: 'Fill out our caregiver application form with your experience, qualifications, and availability.' },
  { num: '02', title: 'Screening & Verification', desc: 'We conduct background checks, identity verification, and review your references.' },
  { num: '03', title: 'Training Programme', desc: 'Complete our structured training programme covering care standards, safety, and client communication.' },
  { num: '04', title: 'Get Matched & Start', desc: 'Once verified and trained, you\'ll be matched with families and begin earning immediately.' },
];

const BENEFITS = [
  { icon: '💰', title: 'Reliable Income', desc: 'Transparent, on-time payments with no hidden deductions. Know exactly what you earn.' },
  { icon: '📅', title: 'Flexible Scheduling', desc: 'Choose shifts that work for your lifestyle. Full-time, part-time, or weekend options available.' },
  { icon: '📚', title: 'Free Training', desc: 'Access professional development training at no cost to you — grow your skills while you earn.' },
  { icon: '🏅', title: 'Build Your Profile', desc: 'Build a verified track record of sessions, ratings, and skills visible to families.' },
  { icon: '🤝', title: 'Ongoing Support', desc: 'Our care coordination team is always available to support you through any challenges.' },
  { icon: '🚀', title: 'Career Growth', desc: 'Progress from basic care to specialist roles as you gain experience and qualifications.' },
];

const REQUIREMENTS = [
  'At least 18 years of age',
  'Valid government-issued ID',
  'Passion for caring for others',
  'Basic literacy and communication skills',
  'Willingness to undergo background checks',
  'Ability to commit to scheduled sessions',
  'Previous care experience (preferred, not required)',
  'Smartphone access for app-based session management',
];

const FAQS = [
  { q: 'Do I need formal qualifications to apply?', a: 'No formal qualifications are required to start. We provide all necessary training. A caring attitude and willingness to learn are the most important qualities we look for.' },
  { q: 'How much will I earn?', a: 'Pay is competitive and based on the type of care provided, session length, and your experience level. Detailed rates are shared during the onboarding process.' },
  { q: 'How soon can I start working?', a: 'Once your background check is complete and you\'ve finished training, you can typically begin receiving placements within 1–2 weeks of applying.' },
  { q: 'What areas do you currently operate in?', a: 'We\'re launching in Ibadan, Oyo State first. If you\'re based nearby, apply now and we\'ll confirm availability in your area.' },
  { q: 'What support will I receive during sessions?', a: 'Our care coordination team is reachable by phone throughout every session. You\'ll never be left to handle a difficult situation alone.' },
];

const INITIAL_FORM = { name: '', phone: '', email: '', location: '', experience: '', message: '' };

export default function CaregiverPage() {
  const [ref1, v1] = useInView();
  const [ref2, v2] = useInView();
  const [ref3, v3] = useInView();
  const [ref4, v4] = useInView();
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = ({ target: { name, value } }) =>
    setForm(f => ({ ...f, [name]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1500);
  };

  return (
    <>
      <PageHero
        tag="👩‍⚕️ Join Our Team"
        title="Become a"
        highlight="LiveCare Caregiver"
        subtitle="Join a network of professional, trained caregivers making a real difference. Structured opportunities, fair pay, and ongoing growth."
      />

      {/* Benefits */}
      <section className="cg-benefits" ref={ref1}>
        <div className="container">
          <div className={`cg-benefits__header ${v1 ? 'visible' : ''}`}>
            <span className="section-tag">✨ Why Join LiveCare</span>
            <h2 className="section-title">More than a job — <span>a career</span></h2>
            <p className="section-subtitle">We invest in our caregivers because when you thrive, so do the families you care for.</p>
          </div>
          <div className={`cg-benefits__grid ${v1 ? 'visible' : ''}`}>
            {BENEFITS.map(({ icon, title, desc }, i) => (
              <div key={i} className="cg-benefit-card" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="cg-benefit-icon">{icon}</div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to join */}
      <section className="cg-steps" ref={ref2}>
        <div className="container">
          <div className={`cg-steps__header ${v2 ? 'visible' : ''}`}>
            <span className="section-tag">🗺️ How It Works</span>
            <h2 className="section-title">From application <span>to first session</span></h2>
          </div>
          <div className={`cg-steps__track ${v2 ? 'visible' : ''}`}>
            {STEPS.map(({ num, title, desc }, i) => (
              <div key={i} className="cg-step" style={{ transitionDelay: `${i * 0.13}s` }}>
                <div className="cg-step__num">{num}</div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements + Apply form */}
      <section className="cg-apply" id="apply" ref={ref3}>
        <div className="container cg-apply__inner">
          {/* Requirements */}
          <div className={`cg-requirements ${v3 ? 'visible' : ''}`}>
            <span className="section-tag">📋 Requirements</span>
            <h2 className="section-title">What we <span>look for</span></h2>
            <p className="section-subtitle" style={{ marginTop: 12 }}>
              You don't need years of experience to join — we provide training. What matters most is your commitment and heart.
            </p>
            <ul className="cg-req-list">
              {REQUIREMENTS.map((r, i) => (
                <li key={i}>
                  <span className="cg-check">✓</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>

            {/* Testimonial */}
            <div className="cg-testimonial">
              <p className="cg-testimonial__quote">
                "LiveCare gave me structure and purpose. I went from informal care work to a real career with training and consistent income."
              </p>
              <div className="cg-testimonial__author">
                <div className="cg-testimonial__avatar">N</div>
                <div>
                  <strong>Ngozi A.</strong>
                  <span>LiveCare Caregiver · Ibadan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className={`cg-form-wrap ${v3 ? 'visible' : ''}`}>
            {submitted ? (
              <div className="cg-form-success">
                <div className="cg-form-success__icon">🎉</div>
                <h3>Application Received!</h3>
                <p>
                  Thanks, <strong>{form.name.split(' ')[0]}</strong>! We've received your application and will be
                  in touch within 2–3 business days to discuss next steps.
                </p>
                <button className="btn btn-secondary" onClick={() => { setSubmitted(false); setForm(INITIAL_FORM); }}>
                  Submit another application
                </button>
              </div>
            ) : (
              <form className="cg-form" onSubmit={handleSubmit} noValidate>
                <h3>Apply as a Caregiver</h3>
                <p>Fill in your details and we'll reach out to guide you through the next steps.</p>

                <div className="cg-form__grid">
                  <CgField label="Full Name" name="name" type="text" placeholder="Amara Johnson"
                    value={form.name} onChange={handleChange} required />
                  <CgField label="Phone Number" name="phone" type="tel" placeholder="08012345678"
                    value={form.phone} onChange={handleChange} required />
                  <CgField label="Email Address" name="email" type="email" placeholder="you@example.com"
                    value={form.email} onChange={handleChange} required />
                  <CgField label="Your Location" name="location" type="text" placeholder="e.g. Bodija, Ibadan"
                    value={form.location} onChange={handleChange} required />
                </div>

                <div className="cg-field">
                  <label>Care Experience</label>
                  <select name="experience" value={form.experience} onChange={handleChange} required>
                    <option value="">Select your experience level</option>
                    <option value="none">No formal experience (open to training)</option>
                    <option value="some">1–2 years informal/family care</option>
                    <option value="moderate">2–4 years formal caregiving</option>
                    <option value="experienced">4+ years professional care</option>
                  </select>
                </div>

                <div className="cg-field">
                  <label>Tell us about yourself (optional)</label>
                  <textarea name="message" value={form.message} onChange={handleChange}
                    placeholder="Why do you want to join LiveCare? Any relevant experience or skills..."
                    rows={4}
                  />
                </div>

                <button type="submit" className={`btn btn-primary btn-lg cg-submit ${loading ? 'loading' : ''}`} disabled={loading}>
                  {loading ? <span className="cg-spinner" /> : '🚀 Submit Application'}
                </button>
                <p className="cg-form__disclaimer">🔒 Your information is safe with us and will never be shared without your consent.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="cg-faq" ref={ref4}>
        <div className="container">
          <div className={`cg-faq__header ${v4 ? 'visible' : ''}`}>
            <span className="section-tag">❓ FAQs</span>
            <h2 className="section-title">Common <span>questions</span></h2>
          </div>
          <div className={`cg-faq__list ${v4 ? 'visible' : ''}`}>
            {FAQS.map(({ q, a }, i) => (
              <div key={i} className={`cg-faq__item ${openFaq === i ? 'open' : ''}`}>
                <button className="cg-faq__q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{q}</span>
                  <span className="cg-faq__chevron">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && <div className="cg-faq__a"><p>{a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function CgField({ label, name, type, placeholder, value, onChange, required }) {
  return (
    <div className="cg-field">
      <label htmlFor={name}>{label}{required && <span style={{ color: '#ef4444' }}>*</span>}</label>
      <input id={name} name={name} type={type} placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  );
}
