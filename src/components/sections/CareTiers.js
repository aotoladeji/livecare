import React, { useState } from 'react';
import useInView from '../../hooks/useInView';
import './CareTiers.css';

const BASIC_SERVICES = [
  { icon: '🤝', label: 'Companionship & Supervision' },
  { icon: '🚿', label: 'Personal Hygiene Support' },
  { icon: '🍽️', label: 'Feeding & Nutrition Assistance' },
  { icon: '🚶', label: 'Mobility & Transfers' },
  { icon: '💊', label: 'Medication Reminders' },
  { icon: '🏠', label: 'Light Household Support' },
];

const SPECIALIZED = [
  {
    id: 'dementia',
    icon: '🧠',
    color: '#6366f1',
    bg: '#eef2ff',
    title: 'Dementia Care',
    badge: 'Memory Support',
    desc: 'Specialized support for individuals with memory-related conditions, focused on safety, consistent routine, and emotional stability.',
    features: ['Safe environment setup', 'Routine-based care', 'Emotional grounding', 'Family communication'],
  },
  {
    id: 'palliative',
    icon: '❤️',
    color: '#e11d48',
    bg: '#fff1f2',
    title: 'Palliative Care',
    badge: 'Comfort-Focused',
    desc: 'Comfort-focused support for individuals with serious or long-term conditions, prioritizing dignity and quality of life.',
    features: ['Pain management support', 'Dignified personal care', 'Emotional & spiritual support', 'Family coordination'],
  },
  {
    id: 'rehab',
    icon: '💪',
    color: '#059669',
    bg: '#ecfdf5',
    title: 'Rehabilitation Care',
    badge: 'Recovery Support',
    desc: 'Assistance during recovery after illness, surgery, or injury — supporting mobility, strength-building, and daily functioning.',
    features: ['Post-surgery recovery', 'Mobility assistance', 'Exercise guidance', 'Progress tracking'],
  },
];

export default function CareTiers() {
  const [ref, inView] = useInView();
  const [activeTab, setActiveTab] = useState('basic');

  return (
    <section className="tiers" id="services">
      <div className="tiers__bg-shape" />
      <div className="container" ref={ref}>
        <div className={`tiers__header ${inView ? 'visible' : ''}`}>
          <span className="section-tag">🩺 Care Services</span>
          <h2 className="section-title">The right care, <span>for every need</span></h2>
          <p className="section-subtitle">
            From everyday personal care to specialized medical support — LiveCare provides structured,
            dignified care tailored to your loved one's situation.
          </p>

          {/* Tab switcher */}
          <div className="tiers__tabs">
            <button
              className={`tiers__tab ${activeTab === 'basic' ? 'active' : ''}`}
              onClick={() => setActiveTab('basic')}
            >
              🌟 Basic / Personal Care
            </button>
            <button
              className={`tiers__tab ${activeTab === 'specialized' ? 'active' : ''}`}
              onClick={() => setActiveTab('specialized')}
            >
              🏥 Specialized Care
            </button>
          </div>
        </div>

        {/* Basic Care Panel */}
        {activeTab === 'basic' && (
          <div className={`tiers__basic ${inView ? 'visible' : ''}`}>
            <div className="tiers__basic-intro">
              <div className="tiers__basic-badge">Core Package</div>
              <h3>Personal Care — The Foundation</h3>
              <p>
                Our core care package covers all daily essentials your loved one needs to live
                comfortably and safely at home.
              </p>
            </div>
            <div className="tiers__grid">
              {BASIC_SERVICES.map(({ icon, label }, i) => (
                <div key={i} className="tiers__item" style={{ animationDelay: `${i * 0.08}s` }}>
                  <span className="tiers__item-icon">{icon}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <div className="tiers__cta">
              <a href="/#waitlist" className="btn btn-primary">Get Started with Basic Care</a>
              <p>Speak with our care team to customise your package.</p>
            </div>
          </div>
        )}

        {/* Specialized Panel */}
        {activeTab === 'specialized' && (
          <div className={`tiers__specialized ${inView ? 'visible' : ''}`}>
            {SPECIALIZED.map(({ id, icon, color, bg, title, badge, desc, features }) => (
              <div key={id} className="tiers__card">
                <div className="tiers__card-icon" style={{ background: bg, color }}>
                  <span>{icon}</span>
                </div>
                <div className="tiers__card-body">
                  <div className="tiers__card-badge" style={{ background: bg, color }}>{badge}</div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  <ul className="tiers__card-features">
                    {features.map((f, i) => (
                      <li key={i}>
                        <span className="tiers__check" style={{ background: color }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="tiers__card-action">
                  <a href="/#waitlist" className="btn btn-secondary btn-sm">Enquire Now →</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
