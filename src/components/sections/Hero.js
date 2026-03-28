import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

export default function Hero() {
  const ref = useRef(null);

  useEffect(() => {
    // Staggered entrance
    const els = ref.current?.querySelectorAll('.hero__animate');
    els?.forEach((el, i) => {
      el.style.animationDelay = `${i * 0.12}s`;
      el.classList.add('run');
    });
  }, []);

  return (
    <section className="hero" ref={ref}>
      {/* Background blobs */}
      <div className="hero__blob hero__blob--1" />
      <div className="hero__blob hero__blob--2" />
      <div className="hero__blob hero__blob--3" />

      <div className="container hero__inner">
        {/* Left content */}
        <div className="hero__content">
          <span className="section-tag hero__animate">🏥 Home Care, Reimagined</span>

          <h1 className="hero__heading hero__animate">
            Trusted Care,<br />
            <span>Till Infinity</span>
          </h1>

          <p className="hero__sub hero__animate">
            LiveCare connects families to trained caregivers, delivering safe, structured,
            and continuous home care support — with real-time updates and total peace of mind.
          </p>

          <div className="hero__actions hero__animate">
            <a href="#app" className="btn btn-primary btn-lg">
              <AppIcon /> Download App
            </a>
            <a href="#waitlist" className="btn btn-outline btn-lg">
              Join Waitlist
            </a>
          </div>

          {/* Trust bar */}
          <div className="hero__trust hero__animate">
            <div className="hero__trust-item">
              <strong>500+</strong>
              <span>Verified Caregivers</span>
            </div>
            <div className="hero__trust-divider" />
            <div className="hero__trust-item">
              <strong>24/7</strong>
              <span>Support Available</span>
            </div>
            <div className="hero__trust-divider" />
            <div className="hero__trust-item">
              <strong>100%</strong>
              <span>Background Checked</span>
            </div>
          </div>
        </div>

        {/* Right visual card */}
        <div className="hero__visual hero__animate">
          <div className="hero__card">
            <div className="hero__card-header">
              <div className="hero__avatar-group">
                {['👩🏽‍⚕️','👨🏿‍⚕️','👩🏻‍⚕️'].map((e, i) => (
                  <div key={i} className="hero__avatar" style={{ zIndex: 3-i }}>{e}</div>
                ))}
              </div>
              <div>
                <p className="hero__card-label">Active caregivers</p>
                <p className="hero__card-value">Near Ibadan</p>
              </div>
            </div>

            <div className="hero__care-status">
              <div className="hero__status-dot" />
              <span>Live session in progress</span>
            </div>

            <div className="hero__timeline">
              {['Caregiver Matched', 'Care Session Started', 'Family Updated', 'Session Logged'].map((step, i) => (
                <div key={i} className={`hero__timeline-step ${i < 3 ? 'done' : 'active'}`}>
                  <div className="hero__timeline-dot">
                    {i < 3 ? <CheckIcon /> : <PulseIcon />}
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            <div className="hero__pill">
              <span>⭐</span>
              <span>4.9 avg rating · 200+ reviews</span>
            </div>
          </div>

          {/* Floating badge */}
          <div className="hero__badge">
            <span>🛡️</span>
            <div>
              <strong>Verified</strong>
              <span>All caregivers are trained & background-checked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="hero__wave">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}

function AppIcon() {
  return <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 18.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13z"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>;
}
function CheckIcon() {
  return <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>;
}
function PulseIcon() {
  return <div className="hero__pulse" />;
}
