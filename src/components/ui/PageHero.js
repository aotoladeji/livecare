import React from 'react';
import './PageHero.css';

export default function PageHero({ tag, title, subtitle, highlight, backgroundImage = '/tmp/hero-2.png' }) {
  return (
    <section className="page-hero">
      <div className="page-hero__image" style={{ backgroundImage: `url(${backgroundImage})` }} />
      <div className="page-hero__overlay" />
      <div className="page-hero__blob page-hero__blob--1" />
      <div className="page-hero__blob page-hero__blob--2" />
      <div className="container page-hero__inner">
        {tag && <span className="section-tag page-hero__tag">{tag}</span>}
        <h1 className="page-hero__title">
          {title} {highlight && <span>{highlight}</span>}
        </h1>
        {subtitle && <p className="page-hero__sub">{subtitle}</p>}
      </div>
    </section>
  );
}
