"use client";

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState<'all' | 'registered'>('all');
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/admin/events');
        if (res.ok) {
          const data = await res.json();
          // Sort by date ascending (upcoming first)
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

  const featuredEvent = events[0] || null;
  const remainingEvents = events.slice(1);

  return (
    <div className={styles.container}>
      {/* Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.logoArea}>
          <div className={styles.logoIcon}></div>
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

      {/* Main Content */}
      <main className={styles.mainContent}>

        {isLoading ? (
          /* Loading State */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#dc143c', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: '#888' }}>Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          /* Empty State */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem' }}>📭</div>
            <h2 style={{ color: '#fff', fontFamily: 'var(--font-playfair), serif' }}>No Events Yet</h2>
            <p style={{ color: '#888', maxWidth: '400px' }}>The admin hasn't posted any upcoming events. Check back soon!</p>
          </div>
        ) : (
          <>
            {/* Section 1: Top Banner */}
            <section className={styles.reminderBanner}>
              <div className={styles.reminderText}>
                <>
                  <h3>🗓 {events.length} Upcoming Event{events.length !== 1 ? 's' : ''}</h3>
                  <p>Next event: <strong>{featuredEvent?.eventName}</strong> on {formatDate(featuredEvent?.date)}</p>
                </>
              </div>
              <button className={styles.reminderBtn}>View All Events ↓</button>
            </section>

            {/* Section 2: Featured / Latest Event */}
            {featuredEvent && (
              <section className={styles.featuredBox}>
                <div className={styles.featuredContent}>
                  <span className={styles.badge}>Latest Event</span>
                  <h1 className={styles.featuredTitle}>{featuredEvent.eventName}</h1>
                  <div className={styles.featuredDetails}>
                    <span>📅 {formatDate(featuredEvent.date)}</span>
                    <span>⏰ {featuredEvent.time}</span>
                    <span>📍 {featuredEvent.locationAddress}</span>
                    {featuredEvent.travelCost && (
                      <span>🚌 Travel Cost: ₹{featuredEvent.travelCost}</span>
                    )}
                  </div>
                  {featuredEvent.gmapLink && (
                    <a
                      href={featuredEvent.gmapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.featuredBtn}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
                    >
                      View on Maps 🗺
                    </a>
                  )}
                </div>
              </section>
            )}

            {/* Section 3: Remaining Events Grid */}
            {remainingEvents.length > 0 && (
              <section className={styles.eventsGrid}>
                {remainingEvents.map(event => (
                  <div key={event._id} className={styles.eventCard}>
                    <div className={styles.cardDate}>
                      {new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', {
                        month: 'long', day: 'numeric', year: 'numeric'
                      }).toUpperCase()}
                    </div>
                    <h3 className={styles.cardTitle}>{event.eventName}</h3>
                    <div className={styles.cardInfo}>
                      <span>⏰ {event.time}</span>
                      <span>📍 {event.locationAddress}</span>
                      {event.travelCost && <span>🚌 ₹{event.travelCost}</span>}
                    </div>
                    {event.gmapLink ? (
                      <a
                        href={event.gmapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.cardBtn}
                        style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}
                      >
                        View on Maps
                      </a>
                    ) : (
                      <button className={styles.cardBtn}>Details</button>
                    )}
                  </div>
                ))}
              </section>
            )}
          </>
        )}
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
