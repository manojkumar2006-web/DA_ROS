"use client";

import { useState } from 'react';
import styles from './page.module.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'addUser' | 'createEvent' | 'attendance'>('createEvent');

  return (
    <div className={styles.container}>
      {/* Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.logoArea}>
          <div className={styles.logoIcon}></div>
          <span className={styles.logoText}>DA-ROS Admin</span>
        </div>

        <div className={styles.navTabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'addUser' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('addUser')}
          >
            Add User
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'createEvent' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('createEvent')}
          >
            Create Event
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'attendance' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance
          </button>
        </div>

        <div className={styles.profileArea}>
          <div className={styles.profileCircle}>A</div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {activeTab === 'addUser' && (
          <div className={styles.sectionContent} key="addUser">
            <h1 className={styles.placeholderText}>Add User Section</h1>
          </div>
        )}
        
        {activeTab === 'createEvent' && (
          <div className={styles.sectionContent} key="createEvent">
            <h1 className={styles.placeholderText}>Create Event Section</h1>
          </div>
        )}
        
        {activeTab === 'attendance' && (
          <div className={styles.sectionContent} key="attendance">
            <h1 className={styles.placeholderText}>Attendance Section</h1>
          </div>
        )}
      </main>
    </div>
  );
}
