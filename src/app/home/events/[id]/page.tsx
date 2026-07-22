"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [event, setEvent] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerMsg, setRegisterMsg] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        // Fetch event details & current user in parallel
        const [eventRes, meRes] = await Promise.all([
          fetch(`/api/admin/events/${id}`),
          fetch('/api/auth/me'),
        ]);

        if (!eventRes.ok) { router.push('/home'); return; }

        const eventData = await eventRes.json();
        setEvent(eventData.event);

        if (meRes.ok) {
          const meData = await meRes.json();
          setCurrentUser(meData.user);
          // Check if already registered
          const alreadyIn = eventData.registeredUsers?.some(
            (u: any) => u._id === meData.user._id
          );
          setIsRegistered(alreadyIn);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  const handleRegister = async () => {
    if (!currentUser) { router.push('/login'); return; }
    setIsRegistering(true);
    setRegisterMsg('');
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser._id }),
      });
      if (res.ok) {
        setIsRegistered(true);
        setRegisterMsg('✅ You have been registered successfully!');
      } else {
        setRegisterMsg('❌ Registration failed. Please try again.');
      }
    } catch {
      setRegisterMsg('❌ Something went wrong. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  const formatDate = (d: string) =>
    d ? new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }) : '';

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080808' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#dc143c', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: '#888' }}>Loading event...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: '#fff', fontFamily: 'var(--font-inter), sans-serif' }}>

      {/* Ambient background glow */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 20% 40%, rgba(220,20,60,0.06) 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(80,20,120,0.05) 0%, transparent 55%)' }} />

      {/* Navbar */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 10 }}>
        <Link href="/home" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{ width: '20px', height: '20px', border: '2px solid #fff', borderRadius: '50%' }} />
          <span style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 700, fontSize: '1.2rem', color: '#fff' }}>DA-ROS</span>
        </Link>
        <Link href="/home" style={{ color: '#888', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          ← Back to Events
        </Link>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem', position: 'relative', zIndex: 1 }}>

        {/* Event Badge + Title */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span style={{ background: '#dc143c', color: '#fff', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', padding: '0.3rem 0.9rem', borderRadius: '20px', textTransform: 'uppercase' }}>
            Event
          </span>
          <h1 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '3.5rem', fontWeight: 800, marginTop: '1rem', marginBottom: 0, lineHeight: 1.1 }}>
            {event.eventName}
          </h1>
        </div>

        {/* Detail Cards Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
          {/* Date */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>📅</div>
            <div style={{ color: '#888', fontSize: '0.8rem', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Date</div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{formatDate(event.date)}</div>
          </div>

          {/* Time */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>⏰</div>
            <div style={{ color: '#888', fontSize: '0.8rem', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Time</div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{event.time}</div>
          </div>

          {/* Location */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>📍</div>
            <div style={{ color: '#888', fontSize: '0.8rem', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Location</div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{event.locationAddress}</div>
          </div>

          {/* Travel Cost */}
          {event.travelCost && event.travelCost !== '0' && (
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>🚌</div>
              <div style={{ color: '#888', fontSize: '0.8rem', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Travel Cost</div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>₹{event.travelCost}</div>
            </div>
          )}
        </div>

        {/* Map */}
        {event.locationAddress && (
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.4rem', marginBottom: '1rem' }}>Venue</h3>
            <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', height: '300px' }}>
              <iframe
                src={
                  event.gmapLink && event.gmapLink.includes('embed')
                    ? event.gmapLink
                    : `https://maps.google.com/maps?q=${encodeURIComponent(event.gmapLink || event.locationAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`
                }
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        )}

        {/* Register Section */}
        <div style={{ background: 'rgba(220,20,60,0.06)', border: '1px solid rgba(220,20,60,0.2)', borderRadius: '20px', padding: '2.5rem', textAlign: 'center' }}>
          {isRegistered ? (
            <>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
              <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.8rem', marginBottom: '0.5rem' }}>You're Registered!</h2>
              <p style={{ color: '#aaa', marginBottom: 0 }}>You have been added to the attendance list for this event. See you there!</p>
            </>
          ) : (
            <>
              <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Ready to Join?</h2>
              <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>Click below to register for this event and confirm your attendance.</p>
              {registerMsg && <p style={{ color: registerMsg.startsWith('✅') ? '#4ade80' : '#f87171', marginBottom: '1rem', fontSize: '0.9rem' }}>{registerMsg}</p>}
              <button
                onClick={handleRegister}
                disabled={isRegistering}
                style={{
                  background: '#dc143c',
                  color: '#fff',
                  border: 'none',
                  padding: '1rem 3rem',
                  borderRadius: '50px',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  cursor: isRegistering ? 'not-allowed' : 'pointer',
                  opacity: isRegistering ? 0.7 : 1,
                  transition: 'transform 0.2s, opacity 0.2s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
                onMouseEnter={e => !isRegistering && ((e.target as HTMLElement).style.transform = 'translateY(-2px)')}
                onMouseLeave={e => ((e.target as HTMLElement).style.transform = 'translateY(0)')}
              >
                {isRegistering ? (
                  <>
                    <span style={{ display: 'inline-block', width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Registering...
                  </>
                ) : (
                  'Register Now →'
                )}
              </button>
              {!currentUser && (
                <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '1rem' }}>
                  <Link href="/login" style={{ color: '#dc143c' }}>Log in</Link> first to register for this event.
                </p>
              )}
            </>
          )}
        </div>

      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
