import React, { useState } from 'react';
import PageHero from '../components/ui/PageHero';
import useInView from '../hooks/useInView';
import './ContactPage.css';

const FAQS = [
  { q: 'How quickly can I get a caregiver assigned?', a: 'Once you\'ve joined the waitlist and we\'ve confirmed your area, we typically complete matching within 24–48 hours of your care request.' },
  { q: 'Is LiveCare available outside Ibadan?', a: 'We\'re launching in Ibadan first. Expansion to other cities is planned. Join the waitlist and select your location — we\'ll notify you when we arrive.' },
  { q: 'Can I request a specific caregiver for repeat sessions?', a: 'Yes. We encourage continuity of care and will do our best to assign the same caregiver for regular sessions whenever possible.' },
  { q: 'What happens if a caregiver doesn\'t show up?', a: 'Our coordination team monitors every session. If a caregiver is unable to attend, we work quickly to find a replacement and notify you immediately.' },
  { q: 'How are caregivers trained?', a: 'All caregivers complete a structured training programme covering personal care standards, safety protocols, communication, emergency response, and session reporting.' },
  { q: 'How does billing work?', a: 'Billing is managed through the LiveCare app. You\'ll receive a clear invoice after each session, and payments can be made securely within the app.' },
];

const CHANNELS = [
  { icon: '✉️', label: 'Email Us', value: 'hello@livecare.ng', href: 'mailto:hello@livecare.ng', desc: 'We respond within 24 hours' },
  { icon: '📞', label: 'Call Us', value: '+234 907 352 0931', href: 'tel:+2349073520931', desc: 'Mon–Sat, 8am–6pm WAT' },
  { icon: '📍', label: 'Location', value: 'Suite 10, Al-Barka Plaza, Favoz Junction, New Bodija, Ibadan 200221, Oyo', href: null, desc: 'Serving Ibadan & surroundings' },
];

const INITIAL = { name: '', email: '', phone: '', subject: '', message: '' };

export default function ContactPage() {
  const [ref1, v1] = useInView();
  const [ref2, v2] = useInView();
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = ({ target: { name, value } }) =>
    setForm(f => ({ ...f, [name]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1400);
  };

  return (
    <>
      <PageHero
        tag="📬 Get in Touch"
        title="We'd love to"
        highlight="hear from you"
        subtitle="Have a question about care, our platform, or becoming a caregiver? We're here to help."
      />

      {/* Contact section */}
      <section className="contact-section" ref={ref1}>
        <div className="container contact-section__inner">
          {/* Left: info + channels */}
          <div className={`contact-info ${v1 ? 'visible' : ''}`}>
            <span className="section-tag">💬 Contact Details</span>
            <h2 className="section-title">Reach us <span>anytime</span></h2>
            <p className="section-subtitle" style={{ marginTop: 10 }}>
              Whether you're a family looking for care, a caregiver wanting to join, or a partner interested in working with us — reach out.
            </p>

            <div className="contact-channels">
              {CHANNELS.map(({ icon, label, value, href, desc }, i) => (
                <div key={i} className="contact-channel">
                  <div className="contact-channel__icon">{icon}</div>
                  <div>
                    <p className="contact-channel__label">{label}</p>
                    {href
                      ? <a href={href} className="contact-channel__value">{value}</a>
                      : <p className="contact-channel__value">{value}</p>
                    }
                    <p className="contact-channel__desc">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="contact-social">
              <p>Follow us</p>
              <div className="contact-social__icons">
                {[
                  { label: 'Twitter/X', icon: '𝕏', href: '#' },
                  { label: 'Instagram', icon: '📷', href: '#' },
                  { label: 'Facebook', icon: 'f', href: '#' },
                  { label: 'LinkedIn', icon: 'in', href: '#' },
                  { label: 'TikTok', icon: '♪', href: '#' },
                ].map(({ label, icon, href }, i) => (
                  <a key={i} href={href} aria-label={label} className="contact-social__btn">{icon}</a>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="contact-map">
              <div className="contact-map__inner">
                <span>📍</span>
                <p>Ibadan, Oyo State</p>
                <span className="contact-map__pulse" />
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className={`contact-form-wrap ${v1 ? 'visible' : ''}`}>
            {submitted ? (
              <div className="contact-success">
                <div className="contact-success__icon">✅</div>
                <h3>Message Sent!</h3>
                <p>Thanks, <strong>{form.name.split(' ')[0]}</strong>! We've received your message and will get back to you within 24 hours.</p>
                <button className="btn btn-secondary" onClick={() => { setSubmitted(false); setForm(INITIAL); }}>
                  Send another message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <h3>Send us a message</h3>
                <p>Fill in the form and we'll get back to you within one business day.</p>

                <div className="contact-form__row">
                  <ContactField label="Full Name" name="name" type="text" placeholder="Amara Johnson"
                    value={form.name} onChange={handleChange} />
                  <ContactField label="Email Address" name="email" type="email" placeholder="you@example.com"
                    value={form.email} onChange={handleChange} />
                </div>

                <div className="contact-form__row">
                  <ContactField label="Phone Number (optional)" name="phone" type="tel" placeholder="0"
                    value={form.phone} onChange={handleChange} />
                  <div className="contact-field">
                    <label>Subject</label>
                    <select name="subject" value={form.subject} onChange={handleChange} required>
                      <option value="">Choose a subject…</option>
                      <option value="care">Requesting care for a loved one</option>
                      <option value="caregiver">Becoming a caregiver</option>
                      <option value="partnership">Business or partnership enquiry</option>
                      <option value="media">Press or media enquiry</option>
                      <option value="other">Something else</option>
                    </select>
                  </div>
                </div>

                <div className="contact-field">
                  <label>Your Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange}
                    placeholder="Tell us what you need or how we can help…"
                    rows={5} required
                  />
                </div>

                <button type="submit" className={`btn btn-primary btn-lg contact-submit ${loading ? 'loading' : ''}`} disabled={loading}>
                  {loading ? <span className="contact-spinner" /> : '📤 Send Message'}
                </button>
                <p className="contact-form__note">🔒 Your details are kept private and secure.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="contact-faq" id="faq" ref={ref2}>
        <div className="container">
          <div className={`contact-faq__header ${v2 ? 'visible' : ''}`}>
            <span className="section-tag">❓ Frequently Asked</span>
            <h2 className="section-title">Quick <span>answers</span></h2>
            <p className="section-subtitle">The most common questions we get — answered.</p>
          </div>
          <div className={`contact-faq__grid ${v2 ? 'visible' : ''}`}>
            {FAQS.map(({ q, a }, i) => (
              <div key={i} className={`contact-faq__item ${openFaq === i ? 'open' : ''}`}>
                <button className="contact-faq__q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{q}</span>
                  <span className="contact-faq__chevron">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="contact-faq__a"><p>{a}</p></div>
                )}
              </div>
            ))}
          </div>

          <div className={`contact-faq__cta ${v2 ? 'visible' : ''}`}>
            <p>Still have questions?</p>
            <a href="mailto:hello@livecare.ng" className="btn btn-primary">Email Us Directly →</a>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactField({ label, name, type, placeholder, value, onChange }) {
  return (
    <div className="contact-field">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  );
}
