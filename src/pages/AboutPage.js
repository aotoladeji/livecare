import React from 'react';
import PageHero from '../components/ui/PageHero';
import WaitlistForm from '../components/sections/WaitlistForm';
import useInView from '../hooks/useInView';
import './AboutPage.css';

const TEAM_VALUES = [
  { icon: '❤️', title: 'Compassion First', desc: 'Every decision we make is guided by deep care for the people we serve — both clients and caregivers.' },
  { icon: '🔍', title: 'Radical Transparency', desc: 'We believe families deserve real time visibility into every session' },
    { icon: '📐', title: 'Structure & Reliability', desc: "Care that's inconsistent isn’t truly care. We engineer reliability into every step of our process." },
  { icon: '🚀', title: 'Continuous Improvement', desc: 'We gather feedback, learn from every session, and constantly improve the experience for all.' },
];

export default function AboutPage() {
  const [ref1, v1] = useInView();
  const [ref2, v2] = useInView();

  return (
    <>
      <PageHero
        tag="🏢 Our Story"
        title="Built to make caregiving"
        highlight="structured & accessible"
        subtitle="LiveCare exists because families deserve more than uncertainty when it comes to the people they love most."
      />

      {/* Mission */}
      <section className="about-mission">
        <div className="container">
          <div className={`about-mission__inner ${v1 ? 'visible' : ''}`} ref={ref1}>
            <div className="about-mission__text">
              <span className="section-tag">🎯 Our Mission</span>
              <h2 className="section-title">Care without <span>compromise</span></h2>
              <p className="section-subtitle" style={{ marginTop: 12 }}>
                LiveCare is built to make caregiving structured, reliable, and accessible. We focus on delivering
                safe, coordinated, and continuous care for individuals and families across Nigeria.
              </p>
              <p className="section-subtitle" style={{ marginTop: 12 }}>
                We started in Ibadan — a city of millions, many of whom are aging parents, recovering patients,
                or individuals with complex needs — and found a gap between demand for quality home care and what
                was actually available. LiveCare is our answer.
              </p>
            </div>
            <div className="about-mission__stats">
              {[
                { n: '10+', l: 'Caregivers Trained' },
                { n: '10+', l: 'Families Waiting' },
                { n: '24/7', l: 'Support Availability' },
                { n: '100%', l: 'Background Checked' },
              ].map(({ n, l }, i) => (
                <div key={i} className="about-stat">
                  <strong>{n}</strong>
                  <span>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-values" ref={ref2}>
        <div className="container">
          <div className={`about-values__header ${v2 ? 'visible' : ''}`}>
            <span className="section-tag">💡 Our Values</span>
            <h2 className="section-title">What we <span>stand for</span></h2>
          </div>
          <div className={`about-values__grid ${v2 ? 'visible' : ''}`}>
            {TEAM_VALUES.map(({ icon, title, desc }, i) => (
              <div key={i} className="about-value-card" style={{ transitionDelay: `${i * 0.12}s` }}>
                <div className="about-value-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="about-location">
        <div className="container">
          <div className="about-location__inner">
            <div>
              <span className="section-tag">📍 Where We Are</span>
              <h2 className="section-title">Based in <span>Ibadan, Nigeria</span></h2>
              <p className="section-subtitle" style={{ marginTop: 12 }}>
                We're proud to be building from Ibadan — one of Africa's largest cities, and a place where the
                need for structured, dignified home care is real and urgent. We're launching here first, then expanding.
              </p>
              <div className="about-contact-chips">
                <a href="mailto:hello@livecare.ng" className="about-chip">✉️ hello@livecare.ng</a>
                <a href="tel:+2349073520931" className="about-chip">📞 +234 907 352 0931</a>
                <span className="about-chip">📍 Suite 10, Al-Barka Plaza, Favoz Junction, New Bodija, Ibadan 200221, Oyo</span>
              </div>
            </div>
            <div className="about-map-placeholder">
              <span>🗺️</span>
              <p>Ibadan, Nigeria</p>
              <span className="about-map-dot" />
            </div>
          </div>
        </div>
      </section>

      <WaitlistForm />
    </>
  );
}
