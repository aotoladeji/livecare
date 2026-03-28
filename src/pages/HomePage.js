import React from 'react';
import Hero          from '../components/sections/Hero';
import WhatIsLiveCare from '../components/sections/WhatIsLiveCare';
import CareTiers     from '../components/sections/CareTiers';
import HowItWorks    from '../components/sections/HowItWorks';
import WhyChoose     from '../components/sections/WhyChoose';
import AppDownload   from '../components/sections/AppDownload';
import WaitlistForm  from '../components/sections/WaitlistForm';
import CaregiverCTA  from '../components/sections/CaregiverCTA';

export default function HomePage() {
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
