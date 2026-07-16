"use client";

import { useState } from 'react';
import styles from './page.module.css';

// Mock Data (will be replaced with real API data)
const mockBookedEvent = null; // Change to an object to see the booked state

const mockFeaturedEvent = {
  id: '1',
  eventName: 'Sunday Worship Service',
  date: 'August 10, 2026',
  time: '10:00 AM',
  locationAddress: 'Main Sanctuary, DA-ROS Church',
};

const mockUpcomingEvents = [
  {
    id: '2',
    eventName: 'Youth Ministry Gathering',
    date: 'August 12, 2026',
    time: '6:30 PM',
    locationAddress: 'Youth Hall',
  },
  {
    id: '3',
    eventName: 'Community Outreach',
    date: 'August 15, 2026',
    time: '9:00 AM',
    locationAddress: 'Downtown Community Center',
  },
  {
    id: '4',
    eventName: 'Midweek Bible Study',
    date: 'August 19, 2026',
    time: '7:00 PM',
    locationAddress: 'Room 101, Education Wing',
  },
  {
    id: '5',
    eventName: 'Choir Practice',
    date: 'August 21, 2026',
    time: '5:00 PM',
    locationAddress: 'Main Sanctuary',
  }
];

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState<'all' | 'registered'>('all');

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

      {/* Main Content Layout (Z-Shape Flow) */}
      <main className={styles.mainContent}>
        
        {/* Section 1: Top Horizontal Banner (Reminder) */}
        <section className={styles.reminderBanner}>
          <div className={styles.reminderText}>
            {mockBookedEvent ? (
              <>
                <h3>Upcoming: {mockBookedEvent.eventName}</h3>
                <p>{mockBookedEvent.date} at {mockBookedEvent.time}</p>
              </>
            ) : (
              <>
                <h3>Ready to join us?</h3>
                <p>You haven't booked any upcoming events yet. Register for an event below!</p>
              </>
            )}
          </div>
          <button className={styles.reminderBtn}>
            {mockBookedEvent ? 'View Details' : 'Register an Event'}
          </button>
        </section>

        {/* Section 2: Large Featured Box (Diagonal Middle focus) */}
        <section className={styles.featuredBox}>
          <div className={styles.featuredContent}>
            <span className={styles.badge}>Newly Added</span>
            <h1 className={styles.featuredTitle}>{mockFeaturedEvent.eventName}</h1>
            <div className={styles.featuredDetails}>
              <span>📅 {mockFeaturedEvent.date}</span>
              <span>⏰ {mockFeaturedEvent.time}</span>
              <span>📍 {mockFeaturedEvent.locationAddress}</span>
            </div>
            <button className={styles.featuredBtn}>Register Now</button>
          </div>
        </section>

        {/* Section 3: Bottom Grid (Bottom Horizontal flow) */}
        <section className={styles.eventsGrid}>
          {mockUpcomingEvents.map(event => (
            <div key={event.id} className={styles.eventCard}>
              <div className={styles.cardDate}>{event.date}</div>
              <h3 className={styles.cardTitle}>{event.eventName}</h3>
              <div className={styles.cardInfo}>
                <span>⏰ {event.time}</span>
                <span>📍 {event.locationAddress}</span>
              </div>
              <button className={styles.cardBtn}>Register</button>
            </div>
          ))}
        </section>

      </main>
    </div>
  );
}
