import React from 'react';
import useInView from '../../hooks/useInView';
import './WhyChoose.css';

const REASONS = [
  { icon: '✅', title: 'Trained & Verified Caregivers', desc: 'Every caregiver passes rigorous background checks, health screening, and structured training before being placed with a family.' },
  { icon: '📋', title: 'Structured Care Delivery', desc: 'Care is never ad-hoc. Each session follows a defined care plan, ensuring consistent, professional service every time.' },
  { icon: '🔔', title: 'Real-Time Session Updates', desc: 'Track every session as it happens. Get activity logs, care notes, and alerts sent directly to your phone.' },
  { icon: '🔍', title: 'Transparent & Reliable', desc: 'No hidden fees. No surprises. Our system keeps families fully informed about scheduling, caregivers, and billing.' },
  { icon: '🔄', title: 'Continuous Care Support', desc: 'Care doesn\'t stop when the session ends. We provide ongoing coordination to ensure care continuity across every visit.' },
  { icon: '🏡', title: 'Comfort of Home', desc: 'Familiar surroundings promote faster recovery and emotional wellness. LiveCare brings professional care directly to your doorstep.' },
];

const STATS = [
  { value: '500+', label: 'Caregivers Ready' },
  { value: '24/7', label: 'Support Availability' },
  { value: '100%', label: 'Background Checked' },
  { value: '4.9★', label: 'Average Rating' },
];

export default function WhyChoose() {
  const [ref, inView] = useInView();
  const [statsRef, statsInView] = useInView();

  return (
    <section className="why" id="why">
      <div className="why__top">
        <div className="container" ref={statsRef}>
          <div className={`why__stats ${statsInView ? 'visible' : ''}`}>
            {STATS.map(({ value, label }, i) => (
              <div key={i} className="why__stat" style={{ transitionDelay: `${i * 0.1}s` }}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container">
        <div className={`why__header ${inView ? 'visible' : ''}`} ref={ref}>
          <span className="section-tag">🌟 Why LiveCare</span>
          <h2 className="section-title">Care you can <span>count on</span></h2>
          <p className="section-subtitle">
            We built LiveCare around one promise: your loved ones deserve safe, dignified, and consistent care — delivered with full transparency.
          </p>
        </div>

        <div className="why__grid">
          {REASONS.map(({ icon, title, desc }, i) => (
            <div
              key={i}
              className={`why__card ${inView ? 'visible' : ''}`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="why__card-icon">{icon}</div>
              <div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial strip */}
        <div className={`why__testimonials ${inView ? 'visible' : ''}`}>
          {[
            { quote: 'LiveCare gave us peace of mind. Knowing my mother had someone trained and caring for her every day changed everything.', name: 'Adaeze O.', role: 'Daughter, Ibadan' },
            { quote: 'The real-time updates are incredible. I always know exactly how my father\'s sessions are going, even when I\'m at work.', name: 'Emeka T.', role: 'Son, Lagos' },
            { quote: 'Professional, warm, and incredibly organised. The caregiver assigned to us was outstanding.', name: 'Bisi A.', role: 'Wife, Ibadan' },
          ].map(({ quote, name, role }, i) => (
            <div key={i} className="why__testimonial">
              <p className="why__quote">"{quote}"</p>
              <div className="why__reviewer">
                <div className="why__avatar">{name[0]}</div>
                <div>
                  <strong>{name}</strong>
                  <span>{role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
