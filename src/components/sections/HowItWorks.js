import React from 'react';
import useInView from '../../hooks/useInView';
import './HowItWorks.css';

const STEPS = [
  {
    num: '01',
    icon: '📋',
    title: 'Request Care',
    desc: 'Tell us your needs — care type, schedule, location, and any special requirements for your loved one.',
    detail: 'Via app or website, takes 5 minutes',
  },
  {
    num: '02',
    icon: '🤝',
    title: 'Get Matched',
    desc: 'We connect you with a verified, trained caregiver suited to your specific care needs and location.',
    detail: 'Usually within 24 hours',
  },
  {
    num: '03',
    icon: '🏠',
    title: 'Care Begins',
    desc: 'Your matched caregiver arrives and delivers structured, professional support in the comfort of home.',
    detail: 'Structured care plan provided',
  },
  {
    num: '04',
    icon: '📲',
    title: 'Stay Updated',
    desc: 'Receive real-time session updates, care logs, and reports directly to your phone throughout the day.',
    detail: 'Live notifications & reports',
  },
];

export default function HowItWorks() {
  const [ref, inView] = useInView();

  return (
    <section className="how" id="how-it-works">
      <div className="container" ref={ref}>
        <div className={`how__header ${inView ? 'visible' : ''}`}>
          <span className="section-tag">⚙️ How It Works</span>
          <h2 className="section-title">Getting started is <span>simple</span></h2>
          <p className="section-subtitle">
            From your first request to live care updates — the entire process is designed to be
            effortless for families.
          </p>
        </div>

        <div className="how__steps">
          {STEPS.map(({ num, icon, title, desc, detail }, i) => (
            <div
              key={i}
              className={`how__step ${inView ? 'visible' : ''}`}
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              {/* Connector line */}
              {i < STEPS.length - 1 && <div className="how__connector" />}

              <div className="how__step-num">{num}</div>
              <div className="how__step-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
              <span className="how__step-detail">{detail}</span>
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className={`how__cta-strip ${inView ? 'visible' : ''}`}>
          <div className="how__cta-strip-inner">
            <div>
              <h3>Ready to get started?</h3>
              <p>Join the waitlist and be first to access LiveCare in your area.</p>
            </div>
            <div className="how__cta-btns">
              <a href="/#waitlist" className="btn btn-primary">Join Waitlist</a>
              <a href="/contact" className="btn btn-secondary">Talk to Us</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
