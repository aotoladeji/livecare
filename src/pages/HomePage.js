import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero          from '../components/sections/Hero';
import WhatIsLiveCare from '../components/sections/WhatIsLiveCare';
import CareTiers     from '../components/sections/CareTiers';
import HowItWorks    from '../components/sections/HowItWorks';
import WhyChoose     from '../components/sections/WhyChoose';
import AppDownload   from '../components/sections/AppDownload';
import WaitlistForm  from '../components/sections/WaitlistForm';
import CaregiverCTA  from '../components/sections/CaregiverCTA';

export default function HomePage() {
  const { state } = useLocation();

  useEffect(() => {
    if (state?.scrollTo === 'waitlist') {
      const el = document.getElementById('waitlist');
      if (el) {
        // Small delay lets the page finish rendering before scrolling
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [state]);

  return (
    <>
      <Hero />
      <WhatIsLiveCare />
      <CareTiers />
      <HowItWorks />
      <WhyChoose />
      <AppDownload />
      <WaitlistForm />
      <CaregiverCTA />
    </>
  );
}
