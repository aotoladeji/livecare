import React from 'react';
import useInView from '../../hooks/useInView';
import './WhatIsLiveCare.css';

const PILLARS = [
  { icon: '👩‍⚕️', title: 'Trained Caregivers', desc: 'Every caregiver is screened, trained, and matched to your specific care needs.' },
  { icon: '📲', title: 'Real-Time Monitoring', desc: 'Track care sessions live. Receive updates and reports directly to your phone.' },
  { icon: '🔄', title: 'Continuous Care', desc: 'Structured schedules that ensure consistent, uninterrupted support for your loved ones.' },
  { icon: '🛡️', title: 'Safe & Dignified', desc: 'Care that respects autonomy and dignity, delivered in the comfort of home.' },
];

export default function WhatIsLiveCare() {
  const [ref, inView] = useInView();

  return (
    <section className="what" id="about">
      <div className="container">
        <div className={`what__inner ${inView ? 'visible' : ''}`} ref={ref}>
          {/* Text side */}
          <div className="what__text">
            <span className="section-tag">💡 What is LiveCare</span>
            <h2 className="section-title">
              Home care that's <span>structured,</span><br />
              reliable, and accessible
            </h2>
            <p className="section-subtitle" style={{ marginTop: 16 }}>
              We ara a structured home care service that provides reliable elderly and
              assisted living support. We combine trained caregivers, real-time care monitoring,
              and coordinated support to ensure consistent and dignified care.
            </p>
            <p className="section-subtitle" style={{ marginTop: 12 }}>
              From companionship and hygiene support to specialized dementia and palliative care —
              we're built to meet families where they are.
            </p>
            <a href="/services" className="btn btn-primary" style={{ marginTop: 28 }}>
              Explore Our Services →
            </a>
          </div>

          {/* Pillar grid */}
          <div className="what__pillars">
            {PILLARS.map(({ icon, title, desc }, i) => (
              <div key={i} className="what__pillar" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="what__pillar-icon">{icon}</div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
