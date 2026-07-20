"use client";

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'addUser' | 'createEvent' | 'attendance'>('addUser');

  // Add User Tab States
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [userDetails, setUserDetails] = useState<{ upcoming: any[], history: any[] } | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [modalError, setModalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch users when on Add User tab
  useEffect(() => {
    if (activeTab === 'addUser') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const handleSelectUser = async (user: any) => {
    setSelectedUser(user);
    setUserDetails(null); // reset while loading

    try {
      const res = await fetch(`/api/admin/users/${user._id}`);
      const data = await res.json();
      if (data.registeredEvents) {
        // Separate events into upcoming and history based on current date
        const now = new Date();
        const upcoming: any[] = [];
        const history: any[] = [];

        data.registeredEvents.forEach((event: any) => {
          const eventDate = new Date(`${event.date} ${event.time}`);
          if (eventDate >= now) {
            upcoming.push(event);
          } else {
            history.push(event);
          }
        });

        setUserDetails({ upcoming, history });
      }
    } catch (err) {
      console.error('Failed to fetch user details', err);
    }
  };

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newUserName, contactNumber: newUserPhone }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      // Success
      setUsers([data.user, ...users]); // Add to top of list
      setIsModalOpen(false);
      setNewUserName('');
      setNewUserPhone('');
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(users.filter(u => u._id !== userId));
        setSelectedUser(null);
        setUserDetails(null);
      }
    } catch (err) {
      console.error('Failed to delete user', err);
    }
  };

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
        
        {/* ADD USER SECTION */}
        {activeTab === 'addUser' && (
          <div className={styles.sectionContent} key="addUser">
            
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>User Management</h2>
              <button className={styles.btnAddUser} onClick={() => setIsModalOpen(true)}>
                + Add User
              </button>
            </div>

            <div className={styles.usersLayout}>
              {/* Left Column: Users List */}
              <div className={styles.usersSidebar}>
                <div className={styles.sidebarTitle}>Registered Users</div>
                {users.length === 0 ? (
                  <div className={styles.noUsers}>No users found.</div>
                ) : (
                  users.map(user => (
                    <div 
                      key={user._id} 
                      className={`${styles.userListItem} ${selectedUser?._id === user._id ? styles.activeUser : ''}`}
                      onClick={() => handleSelectUser(user)}
                    >
                      <span className={styles.userName}>{user.name}</span>
                      <span className={styles.userPhone}>{user.contactNumber}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Middle Column: User Details */}
              <div className={styles.userDetailsArea}>
                {!selectedUser ? (
                  <div className={styles.emptyState}>Select a user from the left to view their details.</div>
                ) : (
                  <>
                    <div className={styles.detailsHeader}>
                      <div className={styles.detailsTitleArea}>
                        <h3 className={styles.detailsTitle}>{selectedUser.name}</h3>
                        <div className={styles.detailsPhone}>{selectedUser.contactNumber}</div>
                      </div>
                      <button 
                        className={styles.btnDelete}
                        onClick={() => handleDeleteUser(selectedUser._id)}
                      >
                        Delete User
                      </button>
                    </div>

                    <div className={styles.eventsGrid}>
                      <div>
                        <h4 className={styles.eventsSectionTitle}>Upcoming Events</h4>
                        {!userDetails ? (
                          <div className={styles.noEvents}>Loading...</div>
                        ) : userDetails.upcoming.length === 0 ? (
                          <div className={styles.noEvents}>No upcoming registrations.</div>
                        ) : (
                          userDetails.upcoming.map(ev => (
                            <div key={ev._id} className={styles.eventCard}>
                              <h4>{ev.eventName}</h4>
                              <p>{ev.date} at {ev.time}</p>
                            </div>
                          ))
                        )}
                      </div>

                      <div>
                        <h4 className={styles.eventsSectionTitle}>History</h4>
                        {!userDetails ? (
                          <div className={styles.noEvents}>Loading...</div>
                        ) : userDetails.history.length === 0 ? (
                          <div className={styles.noEvents}>No past events attended.</div>
                        ) : (
                          userDetails.history.map(ev => (
                            <div key={ev._id} className={styles.eventCard}>
                              <h4>{ev.eventName}</h4>
                              <p>{ev.date}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Add User Modal */}
            {isModalOpen && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                  <h3 className={styles.modalTitle}>Add New User</h3>
                  {modalError && <div style={{ color: 'var(--crimson)', marginBottom: '1rem', fontSize: '0.9rem' }}>{modalError}</div>}
                  
                  <form onSubmit={handleAddUserSubmit}>
                    <div className={styles.formGroup}>
                      <label>Full Name</label>
                      <input 
                        type="text" 
                        value={newUserName} 
                        onChange={e => setNewUserName(e.target.value)} 
                        required 
                        placeholder="John Doe"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Contact Number</label>
                      <input 
                        type="tel" 
                        value={newUserPhone} 
                        onChange={e => setNewUserPhone(e.target.value)} 
                        required 
                        maxLength={10}
                        placeholder="10-digit number"
                      />
                    </div>
                    <div className={styles.modalActions}>
                      <button type="button" className={styles.btnSecondary} onClick={() => setIsModalOpen(false)}>Cancel</button>
                      <button type="submit" className={styles.btnPrimary} disabled={isSubmitting}>
                        {isSubmitting ? 'Adding...' : 'Add User'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
          </div>
        )}
        
        {/* CREATE EVENT SECTION */}
        {activeTab === 'createEvent' && (
          <div className={styles.sectionContent} key="createEvent">
            <h1 className={styles.placeholderText}>Create Event Section</h1>
          </div>
        )}
        
        {/* ATTENDANCE SECTION */}
        {activeTab === 'attendance' && (
          <div className={styles.sectionContent} key="attendance">
            <h1 className={styles.placeholderText}>Attendance Section</h1>
          </div>
        )}
      </main>
    </div>
  );
}
