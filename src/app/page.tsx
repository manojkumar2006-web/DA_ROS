'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import styles from './page.module.css';

export default function Home() {
  useScrollReveal();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className={styles.main}>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.logo}>DA-ROS</div>
        <div className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/about" className={styles.navLink}>About</Link>
          <Link href="/events" className={styles.navLink}>Events</Link>
        </div>
        <Link href="/login" className={styles.loginBtn}>
          Login
        </Link>
      </nav>

      <section className={styles.hero}>
        <div className={styles.glowBottomLeft}></div>
        <div className={styles.glowTopRight}></div>
        
        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>Church Events</div>
          <h1 className={styles.h1}>DA-ROS</h1>
          <p className={styles.subtitle}>Discover. Join. Stay Connected.</p>
          <div className={styles.ctaRow}>
            <Link href="/login" className={styles.btnPrimary}>Get Started</Link>
            <Link href="/events" className={styles.btnOutline}>View Events</Link>
          </div>
        </div>
        
        <div className={styles.scrollIndicator}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </section>

      <section className={styles.featuresSection}>
        <h2 className={styles.featuresHeading}>4 Reasons to Join</h2>
        <div className={styles.featuresGrid}>
          <div className={`${styles.featureCard} reveal-3d delay-1`}>
            <div className={styles.cardIcon}>📅</div>
            <h3 className={styles.cardTitle}>Explore Events</h3>
            <p className={styles.cardDesc}>Browse all upcoming church events with complete details.</p>
          </div>
          <div className={`${styles.featureCard} reveal-3d delay-2`}>
            <div className={styles.cardIcon}>✅</div>
            <h3 className={styles.cardTitle}>Register Easily</h3>
            <p className={styles.cardDesc}>Reserve your spot instantly with a single click.</p>
          </div>
          <div className={`${styles.featureCard} reveal-3d delay-3`}>
            <div className={styles.cardIcon}>👥</div>
            <h3 className={styles.cardTitle}>Connect Together</h3>
            <p className={styles.cardDesc}>See who's joining and become part of every gathering.</p>
          </div>
          <div className={`${styles.featureCard} reveal-3d delay-4`}>
            <div className={styles.cardIcon}>📍</div>
            <h3 className={styles.cardTitle}>Navigate Easily</h3>
            <p className={styles.cardDesc}>Open event locations directly in Google Maps.</p>
          </div>
        </div>
      </section>

      <section className={styles.cinematicSection}>
        <h2 className={`${styles.cinematicText} reveal-scale`}>
          Your community, beautifully organized.
          <span className={styles.crimsonUnderline}></span>
        </h2>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLogo}>DA-ROS</div>
        <div className={styles.copyright}>© {new Date().getFullYear()} DA-ROS. All rights reserved.</div>
      </footer>
    </main>
  );
}
