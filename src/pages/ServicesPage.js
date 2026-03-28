import React, { useState } from 'react';
import PageHero from '../components/ui/PageHero';
import WaitlistForm from '../components/sections/WaitlistForm';
import useInView from '../hooks/useInView';
import './ServicesPage.css';

const ALL_SERVICES = [
  {
    category: 'Basic Care',
    color: '#387afc',
    bg: '#e8f0ff',
    icon: '🌟',
    items: [
      { icon: '🤝', name: 'Companionship & Supervision', desc: 'Consistent companionship that prevents isolation and supports emotional wellbeing.' },
      { icon: '🚿', name: 'Personal Hygiene Support', desc: 'Assistance with bathing, grooming, oral care, and dressing with full dignity and respect.' },
      { icon: '🍽️', name: 'Feeding & Nutrition Assistance', desc: 'Help with meal preparation, feeding support, and monitoring dietary intake.' },
      { icon: '🚶', name: 'Mobility & Transfers', desc: 'Safe assistance with moving, repositioning, getting in and out of bed or chairs.' },
      { icon: '💊', name: 'Medication Reminders', desc: 'Structured reminders and supervision to ensure medications are taken correctly and on time.' },
      { icon: '🏠', name: 'Light Household Support', desc: 'Basic tidying, laundry, and household tasks to maintain a safe, comfortable environment.' },
    ],
  },
  {
    category: 'Dementia Care',
    color: '#6366f1',
    bg: '#eef2ff',
    icon: '🧠',
    items: [
      { icon: '🔒', name: 'Safe Environment Setup', desc: 'Home safety assessments and modifications to reduce risk for individuals with memory conditions.' },
      { icon: '🗓️', name: 'Routine-Based Care', desc: 'Structured daily routines that reduce confusion and provide emotional security.' },
      { icon: '💬', name: 'Emotional Grounding', desc: 'Trained interaction techniques to manage anxiety, agitation, and disorientation with calm.' },
      { icon: '👨‍👩‍👧', name: 'Family Communication', desc: 'Regular updates, guidance, and coaching to support family members in caregiving decisions.' },
    ],
  },
  {
    category: 'Palliative Care',
    color: '#e11d48',
    bg: '#fff1f2',
    icon: '❤️',
    items: [
      { icon: '😌', name: 'Comfort-Focused Support', desc: 'Care centred on reducing discomfort and maximising quality of life at every stage.' },
      { icon: '🌸', name: 'Dignity & Personal Care', desc: 'Sensitive personal care that honours the individual\'s preferences and dignity throughout.' },
      { icon: '🧘', name: 'Emotional & Spiritual Support', desc: 'Compassionate presence and support for emotional, psychological, and spiritual needs.' },
      { icon: '📞', name: 'Family Coordination', desc: 'Liaison with family members, medical teams, and support services for holistic care.' },
    ],
  },
  {
    category: 'Rehabilitation Care',
    color: '#059669',
    bg: '#ecfdf5',
    icon: '💪',
    items: [
      { icon: '🏥', name: 'Post-Surgery Recovery', desc: 'Supportive home care following hospital discharge to aid safe, smooth recovery.' },
      { icon: '🦽', name: 'Mobility Assistance', desc: 'Guided exercises and physical support to rebuild strength and range of motion.' },
      { icon: '🎯', name: 'Goal-Based Plans', desc: 'Clear recovery milestones with structured daily tasks to keep progress on track.' },
      { icon: '📊', name: 'Progress Tracking', desc: 'Regular reporting on recovery progress shared with families and healthcare providers.' },
    ],
  },
];

export default function ServicesPage() {
  const [active, setActive] = useState(0);
  const [ref, inView] = useInView();

  const current = ALL_SERVICES[active];

  return (
    <>
      <PageHero
        tag="🩺 Our Services"
        title="Complete care,"
        highlight="tailored to you"
        subtitle="From everyday personal care to specialized medical support — structured, professional, and delivered with dignity."
      />

      <section className="svc-page" ref={ref}>
        <div className="container">
          {/* Category switcher */}
          <div className={`svc-page__nav ${inView ? 'visible' : ''}`}>
            {ALL_SERVICES.map(({ category, icon, color }, i) => (
              <button
                key={i}
                className={`svc-page__nav-btn ${active === i ? 'active' : ''}`}
                style={active === i ? { background: color, color: 'white', borderColor: color } : {}}
                onClick={() => setActive(i)}
              >
                {icon} {category}
              </button>
            ))}
          </div>

          {/* Panel */}
          <div className={`svc-page__panel ${inView ? 'visible' : ''}`} key={active}>
            <div className="svc-page__panel-header" style={{ background: current.bg, borderColor: current.color + '33' }}>
              <div className="svc-page__panel-icon" style={{ background: current.color + '22', color: current.color }}>
                {current.icon}
              </div>
              <div>
                <h2>{current.category}</h2>
                <p>
                  {active === 0 && 'The foundation of all care — essential daily support delivered with professionalism and warmth.'}
                  {active === 1 && 'Specialised support for individuals living with dementia and memory-related conditions.'}
                  {active === 2 && 'Comfort-focused care for individuals with serious or long-term conditions.'}
                  {active === 3 && 'Structured support for recovery after illness, surgery, or injury.'}
                </p>
              </div>
            </div>
            <div className="svc-page__grid">
              {current.items.map(({ icon, name, desc }, i) => (
                <div key={i} className="svc-page__item" style={{ transitionDelay: `${i * 0.08}s` }}>
                  <div className="svc-page__item-icon" style={{ background: current.bg, color: current.color }}>{icon}</div>
                  <h4>{name}</h4>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className={`svc-page__cta ${inView ? 'visible' : ''}`}>
            <h3>Not sure which care type you need?</h3>
            <p>Our care team will help you find the right fit. Reach out or join the waitlist and we'll be in touch.</p>
            <div className="svc-page__cta-btns">
              <a href="/#waitlist" className="btn btn-primary btn-lg">Join Waitlist</a>
              <a href="/contact" className="btn btn-secondary btn-lg">Talk to Our Team</a>
            </div>
          </div>
        </div>
      </section>

      <WaitlistForm />
    </>
  );
}
