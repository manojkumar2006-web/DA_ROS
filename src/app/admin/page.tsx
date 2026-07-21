"use client";

import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
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

  // Import State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importError, setImportError] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  // Create Event Tab States
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [eventDetails, setEventDetails] = useState<{ registeredUsers: any[] } | null>(null);
  
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventCost, setNewEventCost] = useState('');
  const [eventModalError, setEventModalError] = useState('');
  const [isEventSubmitting, setIsEventSubmitting] = useState(false);

  // Fetch users when on Add User tab
  useEffect(() => {
    if (activeTab === 'addUser') {
      fetchUsers();
    } else if (activeTab === 'createEvent') {
      fetchEvents();
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

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFile) return;

    setImportError('');
    setIsImporting(true);

    try {
      const data = await importFile.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const json: any[] = XLSX.utils.sheet_to_json(worksheet);
      
      const usersToImport = json.map(row => ({
        name: row['Name'] || row['name'] || '',
        contactNumber: String(row['Contact Number'] || row['Contact'] || row['contactNumber'] || row['Phone'] || '')
      }));

      const res = await fetch('/api/admin/users/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users: usersToImport })
      });

      const resultData = await res.json();
      if (!res.ok) {
        throw new Error(resultData.error || 'Failed to import users');
      }

      setIsImportModalOpen(false);
      setImportFile(null);
      alert(`Successfully processed! Inserted: ${resultData.insertedCount + resultData.upsertedCount}, Updated: ${resultData.modifiedCount}`);
      fetchUsers();
    } catch (err: any) {
      setImportError(err.message);
    } finally {
      setIsImporting(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/admin/events');
      const data = await res.json();
      if (data.events) {
        setEvents(data.events);
      }
    } catch (err) {
      console.error('Failed to fetch events', err);
    }
  };

  const handleSelectEvent = async (event: any) => {
    setSelectedEvent(event);
    setEventDetails(null);

    try {
      const res = await fetch(`/api/admin/events/${event._id}`);
      const data = await res.json();
      if (data.registeredUsers) {
        setEventDetails({ registeredUsers: data.registeredUsers });
      }
    } catch (err) {
      console.error('Failed to fetch event details', err);
    }
  };

  const handleAddEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEventModalError('');
    setIsEventSubmitting(true);

    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          eventName: newEventName, 
          date: newEventDate, 
          time: newEventTime, 
          locationAddress: newEventLocation, 
          travelCost: newEventCost 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create event');
      }

      setEvents([data.event, ...events]); 
      setIsEventModalOpen(false);
      setNewEventName('');
      setNewEventDate('');
      setNewEventTime('');
      setNewEventLocation('');
      setNewEventCost('');
    } catch (err: any) {
      setEventModalError(err.message);
    } finally {
      setIsEventSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm('Are you sure you want to delete this event? This will also delete all registrations for it.')) return;
    try {
      const res = await fetch(`/api/admin/events/${eventId}`, { method: 'DELETE' });
      if (res.ok) {
        setEvents(events.filter(e => e._id !== eventId));
        setSelectedEvent(null);
        setEventDetails(null);
      }
    } catch (err) {
      console.error('Failed to delete event', err);
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
              <div>
                <button className={styles.btnImport} onClick={() => setIsImportModalOpen(true)}>
                  Import
                </button>
                <button className={styles.btnAddUser} onClick={() => setIsModalOpen(true)}>
                  + Add User
                </button>
              </div>
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
            
            {/* Import Users Modal */}
            {isImportModalOpen && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                  <h3 className={styles.modalTitle}>Import Users (Excel)</h3>
                  <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Upload an .xlsx or .csv file. It must contain columns named <strong>Name</strong> and <strong>Contact Number</strong>.
                  </p>
                  {importError && <div style={{ color: 'var(--crimson)', marginBottom: '1rem', fontSize: '0.9rem' }}>{importError}</div>}
                  
                  <form onSubmit={handleImportSubmit}>
                    <div className={styles.formGroup}>
                      <input 
                        type="file" 
                        accept=".xlsx, .xls, .csv" 
                        onChange={(e) => setImportFile(e.target.files ? e.target.files[0] : null)}
                        required
                        style={{ border: 'none', padding: 0 }}
                      />
                    </div>
                    
                    <div className={styles.modalActions}>
                      <button type="button" className={styles.btnSecondary} onClick={() => { setIsImportModalOpen(false); setImportFile(null); setImportError(''); }}>Cancel</button>
                      <button type="submit" className={styles.btnPrimary} disabled={isImporting || !importFile}>
                        {isImporting ? 'Importing...' : 'Upload & Import'}
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
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Event Management</h2>
              <button className={styles.btnAddUser} onClick={() => setIsEventModalOpen(true)}>
                + Add Event
              </button>
            </div>

            <div className={styles.usersLayout}>
              {/* Left Column: Events List */}
              <div className={styles.usersSidebar}>
                <div className={styles.sidebarTitle}>Created Events</div>
                {events.length === 0 ? (
                  <div className={styles.noUsers}>No events found.</div>
                ) : (
                  events.map(event => (
                    <div 
                      key={event._id} 
                      className={`${styles.userListItem} ${selectedEvent?._id === event._id ? styles.activeUser : ''}`}
                      onClick={() => handleSelectEvent(event)}
                    >
                      <span className={styles.userName}>{event.eventName}</span>
                      <span className={styles.userPhone}>{event.date} - {event.time}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Middle Column: Event Details */}
              <div className={styles.userDetailsArea}>
                {!selectedEvent ? (
                  <div className={styles.emptyState}>Select an event from the left to view its details.</div>
                ) : (
                  <>
                    <div className={styles.detailsHeader}>
                      <div className={styles.detailsTitleArea}>
                        <h3 className={styles.detailsTitle}>{selectedEvent.eventName}</h3>
                        <div className={styles.detailsPhone}>{selectedEvent.date} | {selectedEvent.time}</div>
                        <div style={{color: '#888', marginTop: '0.5rem'}}>Estimated Travel Cost: ₹{selectedEvent.travelCost}</div>
                      </div>
                      <button 
                        className={styles.btnDelete}
                        onClick={() => handleDeleteEvent(selectedEvent._id)}
                      >
                        Delete Event
                      </button>
                    </div>

                    <div className={styles.eventsGrid}>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <h4 className={styles.eventsSectionTitle}>Location</h4>
                        <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem' }}>{selectedEvent.locationAddress}</p>
                        
                        <div className={styles.mapContainer}>
                          <iframe
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps?q=${encodeURIComponent(selectedEvent.locationAddress)}&output=embed`}
                          ></iframe>
                        </div>
                      </div>

                      <div style={{ gridColumn: '1 / -1', marginTop: '2rem' }}>
                        <h4 className={styles.eventsSectionTitle}>Registered Users ({eventDetails?.registeredUsers?.length || 0})</h4>
                        {!eventDetails ? (
                          <div className={styles.noEvents}>Loading...</div>
                        ) : eventDetails.registeredUsers.length === 0 ? (
                          <div className={styles.noEvents}>No users registered yet.</div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                            {eventDetails.registeredUsers.map(user => (
                              <div key={user._id} style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 600 }}>{user.name}</span>
                                <span style={{ color: 'var(--crimson)' }}>{user.contactNumber}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Add Event Modal */}
            {isEventModalOpen && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                  <h3 className={styles.modalTitle}>Add New Event</h3>
                  {eventModalError && <div style={{ color: 'var(--crimson)', marginBottom: '1rem', fontSize: '0.9rem' }}>{eventModalError}</div>}
                  
                  <form onSubmit={handleAddEventSubmit}>
                    <div className={styles.formGroup}>
                      <label>Event Name</label>
                      <input 
                        type="text" 
                        value={newEventName} 
                        onChange={e => setNewEventName(e.target.value)} 
                        required 
                        placeholder="e.g. Sunday Worship Service"
                      />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div className={styles.formGroup} style={{ flex: 1 }}>
                        <label>Date</label>
                        <input 
                          type="date" 
                          value={newEventDate} 
                          onChange={e => setNewEventDate(e.target.value)} 
                          required 
                        />
                      </div>
                      <div className={styles.formGroup} style={{ flex: 1 }}>
                        <label>Time</label>
                        <input 
                          type="time" 
                          value={newEventTime} 
                          onChange={e => setNewEventTime(e.target.value)} 
                          required 
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Location (Physical Address)</label>
                      <input 
                        type="text" 
                        value={newEventLocation} 
                        onChange={e => setNewEventLocation(e.target.value)} 
                        required 
                        placeholder="e.g. 123 Church St, City, Country"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Travel Cost (₹)</label>
                      <input 
                        type="number" 
                        value={newEventCost} 
                        onChange={e => setNewEventCost(e.target.value)} 
                        required 
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    <div className={styles.modalActions}>
                      <button type="button" className={styles.btnSecondary} onClick={() => setIsEventModalOpen(false)}>Cancel</button>
                      <button type="submit" className={styles.btnPrimary} disabled={isEventSubmitting}>
                        {isEventSubmitting ? 'Creating...' : 'Create Event'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
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
