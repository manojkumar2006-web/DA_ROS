"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { useScrollReveal, use3DTilt } from '@/hooks/useScrollReveal';

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState<'all' | 'registered'>('all');
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useScrollReveal();
  use3DTilt('.tilt-card');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/admin/events');
        if (res.ok) {
          const data = await res.json();
          const sorted = (data.events || []).sort((a: any, b: any) =>
            new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime()
          );
          setEvents(sorted);
        }
      } catch (err) {
        console.error('Failed to fetch events', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    });
  };

  const getDayOnly = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr + 'T00:00:00').getDate().toString();
  };

  const getMonthOnly = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short'
    }).toUpperCase();
  };

  const featuredEvent = events[0] || null;
  const remainingEvents = events.slice(1);

  return (
    <div className={styles.container}>
      {/* Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.logoArea}>
          <span className={styles.logoText}>DA-ROS</span>
        </div>

        <div className={styles.navTabs}>
          <button
            className={`${styles.tab} ${activeTab === 'all' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Events
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'registered' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('registered')}
          >
            Registered Events
          </button>
        </div>

        <div className={styles.profileArea}>
          <div className={styles.profileCircle}>U</div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroGlow}></div>
        <div className={styles.heroContent}>
          <span className={`reveal ${styles.eyebrow}`}>UPCOMING EVENTS</span>
          <h1 className={`reveal delay-1 ${styles.heroTitle}`}>
            {isLoading ? '...' : (events.length > 0 ? `${events.length} Events` : 'Events')}
          </h1>
          <p className={`reveal delay-2 ${styles.heroSubtitle}`}>Your community. Your calendar.</p>
        </div>
      </section>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {isLoading ? (
          <div className={styles.loadingGrid}>
            <div className={`${styles.skeletonCard} shimmer`}></div>
            <div className={`${styles.skeletonCard} shimmer`}></div>
            <div className={`${styles.skeletonCard} shimmer`}></div>
          </div>
        ) : events.length === 0 ? (
          <div className={`reveal ${styles.emptyState}`}>
            <div className={styles.emptyIcon}>📭</div>
            <h2 className={styles.emptyTitle}>No events yet</h2>
            <p className={styles.emptyDesc}>There are no upcoming events at the moment. Please check back later.</p>
          </div>
        ) : (
          <>
            {/* Featured Event */}
            {featuredEvent && (
              <section
                className={`reveal-3d ${styles.featuredCard}`}
                onClick={() => router.push(`/home/events/${featuredEvent._id}`)}
              >
                <div className={styles.featuredLeft}>
                  <span className={styles.badge}>LATEST</span>
                  <h2 className={styles.featuredTitle}>{featuredEvent.eventName}</h2>
                  <div className={styles.featuredPills}>
                    <span className={styles.pill}>{formatDate(featuredEvent.date)}</span>
                    <span className={styles.pill}>{featuredEvent.time}</span>
                    <span className={styles.pill}>{featuredEvent.locationAddress}</span>
                  </div>
                </div>
                <div className={styles.featuredRight}>
                  <div className={styles.dateCircle}>
                    <span className={styles.dateMonth}>{getMonthOnly(featuredEvent.date)}</span>
                    <span className={styles.dateDay}>{getDayOnly(featuredEvent.date)}</span>
                  </div>
                </div>
              </section>
            )}

            {/* Events Grid */}
            {remainingEvents.length > 0 && (
              <section className={styles.eventsGrid}>
                {remainingEvents.map((event, index) => {
                  const delayClass = `delay-${Math.min((index % 6) + 1, 6)}`;
                  return (
                    <div
                      key={event._id}
                      className={`reveal tilt-card ${delayClass} ${styles.eventCard}`}
                      onClick={() => router.push(`/home/events/${event._id}`)}
                    >
                      <div className={styles.cardDate}>
                        {formatDate(event.date)}
                      </div>
                      <h3 className={styles.cardTitle}>{event.eventName}</h3>
                      <div className={styles.cardPills}>
                        <span className={styles.pillSmall}>{event.time}</span>
                        <span className={styles.pillSmall}>{event.locationAddress}</span>
                      </div>
                      <div className={styles.cardFooter}>
                        View Details →
                      </div>
                    </div>
                  );
                })}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
