import React from 'react';
import { Link } from 'react-router-dom';
import useInView from '../../hooks/useInView';
import './CaregiverCTA.css';

const BENEFITS = [
  { icon: '💼', title: 'Structured Placements', desc: 'Get matched with families that fit your skills and schedule.' },
  { icon: '📚', title: 'Training & Development', desc: 'Access ongoing training to grow your caregiving career.' },
  { icon: '💰', title: 'Competitive Pay', desc: 'Earn reliable income with transparent, on-time payments.' },
  { icon: '🏅', title: 'Professional Growth', desc: 'Build a verified track record that opens doors to more opportunities.' },
];

export default function CaregiverCTA() {
  const [ref, inView] = useInView();

  return (
    <section className="caregiver-cta" id="caregivers" ref={ref}>
      <div className="caregiver-cta__bg" />
      <div className="container">
        <div className={`caregiver-cta__inner ${inView ? 'visible' : ''}`}>
          <div className="caregiver-cta__content">
            <span className="section-tag" style={{ background: 'rgba(255,255,255,.15)', color: 'white', border: '1px solid rgba(255,255,255,.2)' }}>
              👩‍⚕️ Join Our Team
            </span>
            <h2 className="section-title" style={{ color: 'white' }}>
              Become a <span style={{ color: 'var(--blue-light)' }}>LiveCare Caregiver</span>
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(255,255,255,.8)', maxWidth: 480 }}>
              Join LiveCare and access structured opportunities, professional training, and a platform that values your work.
              Make a real difference in people's lives.
            </p>
            <div className="caregiver-cta__benefits">
              {BENEFITS.map(({ icon, title, desc }, i) => (
                <div key={i} className="caregiver-cta__benefit">
                  <span>{icon}</span>
                  <div>
                    <strong>{title}</strong>
                    <p>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 8 }}>
              <Link to="/caregivers#apply" className="btn btn-primary btn-lg">
                Apply as Caregiver →
              </Link>
              <Link to="/caregivers" className="btn btn-outline btn-lg">
                Learn More
              </Link>
            </div>
          </div>

          <div className="caregiver-cta__visual">
            <div className="caregiver-cta__card">
              <div className="caregiver-cta__profile">
                <div className="caregiver-cta__avatar">👩🏽‍⚕️</div>
                <div>
                  <strong>Nurse Amaka</strong>
                  <span>Certified Home Caregiver</span>
                </div>
                <div className="caregiver-cta__rating">⭐ 4.9</div>
              </div>
              <div className="caregiver-cta__stats-row">
                {[['42', 'Sessions'], ['98%', 'Satisfaction'], ['2yrs', 'Experience']].map(([v, l], i) => (
                  <div key={i} className="caregiver-cta__mini-stat">
                    <strong>{v}</strong>
                    <span>{l}</span>
                  </div>
                ))}
              </div>
              <div className="caregiver-cta__tags">
                {['Dementia Care', 'Palliative', 'Personal Care', 'Mobility'].map((t, i) => (
                  <span key={i} className="caregiver-cta__tag">{t}</span>
                ))}
              </div>
              <div className="caregiver-cta__badge">✅ Background Verified</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
