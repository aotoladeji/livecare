import React from 'react';
import useInView from '../../hooks/useInView';
import './AppDownload.css';

const APP_FEATURES = [
  { icon: '📍', text: 'Get a caregiver' },
  { icon: '📋', text: 'View daily care logs & session summaries' },
  { icon: '💬', text: 'Chat directly with your caregiver' },
  { icon: '🔔', text: 'Instant alerts & care reminders' },
  { icon: '💳', text: 'Manage payments & subscriptions' },
  { icon: '⭐', text: 'Rate sessions and give feedback' },
];

export default function AppDownload() {
  const [ref, inView] = useInView();

  return (
    <section className="app" id="app" ref={ref}>
      <div className="app__bg" />
      <div className="container app__inner">
        {/* Phone mockup */}
        <div className={`app__visual ${inView ? 'visible' : ''}`}>
          <div className="app__phone">
            <div className="app__phone-screen">
              {/* Mocked app UI */}
              <div className="app__mock-header">
                <span>🏠 LiveCare</span>
                <span className="app__mock-pill">Live</span>
              </div>
              <div className="app__mock-card">
                <p style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Active session</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#0d1157' }}>Mrs. Folake Adeyemi</p>
                <p style={{ fontSize: 12, color: '#475569' }}>With Nurse Amaka · Started 9:00 AM</p>
                <div className="app__mock-bar">
                  <div className="app__mock-fill" style={{ width: '65%' }} />
                </div>
                <p style={{ fontSize: 11, color: '#387afc' }}>65% of session complete</p>
              </div>
              <div className="app__mock-updates">
                {['Caregiver arrived ✓', 'Morning hygiene done ✓', 'Medication given ✓', 'Lunch in progress...'].map((item, i) => (
                  <div key={i} className={`app__mock-update ${i === 3 ? 'active' : ''}`}>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="app__mock-btn">📞 Call Caregiver</div>
            </div>
          </div>
          {/* Glow */}
          <div className="app__phone-glow" />
        </div>

        {/* Content */}
        <div className={`app__content ${inView ? 'visible' : ''}`}>
          <span className="section-tag">📲 About the App</span>
          <h2 className="section-title">
            Manage care <span>from your phone</span>
          </h2>
          <p className="section-subtitle" style={{ marginTop: 12 }}>
            Access everything you need to manage your loved one's care — track sessions, communicate with caregivers,
            review daily logs, and stay connected — all from one app.
          </p>

          <ul className="app__features">
            {APP_FEATURES.map(({ icon, text }, i) => (
              <li key={i}>
                <span className="app__feat-icon">{icon}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <div className="app__store-btns">
            <button type="button" className="app__store-btn app__store-btn--disabled" disabled>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              <div>
                <span>Download on</span>
                <strong>App Store</strong>
              </div>
            </button>
            <button type="button" className="app__store-btn app__store-btn--disabled" disabled>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76a2 2 0 001.83-.21l10.65-6.22-2.38-2.37-10.1 8.8zM20.6 10.29L17.8 8.66l-2.68 2.68 2.68 2.68 2.83-1.64a1.6 1.6 0 000-2.09zM1.45.36A2 2 0 001 1.5v21a2 2 0 00.45 1.14l.09.09 11.77-11.77v-.27L1.54.27l-.09.09zm12.12 12.99l-3.03-3.04L1.85 19.1l11.72-5.75z"/></svg>
              <div>
                <span>Get it on</span>
                <strong>Google Play</strong>
              </div>
            </button>
          </div>

          <p className="app__coming">
            🚀 App launching soon — join the waitlist for early access
          </p>
        </div>
      </div>
    </section>
  );
}
