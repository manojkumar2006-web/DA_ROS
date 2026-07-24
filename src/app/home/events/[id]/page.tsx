"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useScrollReveal, use3DTilt } from '@/hooks/useScrollReveal';
import { formatTimeWithAmPm } from '@/lib/formatTime';

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [event, setEvent] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerMsg, setRegisterMsg] = useState('');

  useScrollReveal();
  use3DTilt('.tilt-card');

  useEffect(() => {
    const load = async () => {
      try {
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
  }, [id, router]);

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
        setRegisterMsg('✅ You are registered!');
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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000000' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#dc143c', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: '#86868b', fontSize: '14px' }}>Loading event details...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#000000', color: '#f4f8fb', fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, 'Helvetica Neue', sans-serif" }}>

      {/* Sticky Top Navbar */}
      <nav style={{ position: 'sticky', top: 0, height: '56px', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.85)', backdropFilter: 'saturate(180%) blur(20px)', WebkitBackdropFilter: 'saturate(180%) blur(20px)', zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Link href="/home" style={{ color: '#86868b', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500, transition: 'color 0.2s' }}>
          <span>&larr;</span> Back to Events
        </Link>
        <span style={{ fontWeight: 700, fontSize: '16px', letterSpacing: '-0.01em', color: '#f4f8fb' }}>
          DA-ROS
        </span>
      </nav>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Event Header Banner */}
        <div style={{ background: 'linear-gradient(135deg, rgba(220,20,60,0.12) 0%, rgba(20,20,25,0.6) 100%)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '36px 40px', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'inline-block', background: '#dc143c', color: '#fff', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase', marginBottom: '16px' }}>
            EVENT DETAILS
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 12px 0', lineHeight: 1.15 }}>
            {event.eventName}
          </h1>
          <p style={{ color: '#86868b', fontSize: '16px', margin: 0 }}>
            {formatDate(event.date)} &bull; {formatTimeWithAmPm(event.time)}
          </p>
        </div>

        {/* Info Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div className="tilt-card" style={{ background: '#161617', border: '1px solid #272729', borderRadius: '16px', padding: '20px' }}>
            <div style={{ fontSize: '1.6rem', marginBottom: '8px' }}>📅</div>
            <div style={{ color: '#86868b', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>Date</div>
            <div style={{ color: '#f4f8fb', fontSize: '16px', fontWeight: 700 }}>{formatDate(event.date)}</div>
          </div>

          <div className="tilt-card" style={{ background: '#161617', border: '1px solid #272729', borderRadius: '16px', padding: '20px' }}>
            <div style={{ fontSize: '1.6rem', marginBottom: '8px' }}>⏰</div>
            <div style={{ color: '#86868b', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>Time</div>
            <div style={{ color: '#f4f8fb', fontSize: '16px', fontWeight: 700 }}>{formatTimeWithAmPm(event.time)}</div>
          </div>

          <div className="tilt-card" style={{ background: '#161617', border: '1px solid #272729', borderRadius: '16px', padding: '20px' }}>
            <div style={{ fontSize: '1.6rem', marginBottom: '8px' }}>📍</div>
            <div style={{ color: '#86868b', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>Location</div>
            <div style={{ color: '#f4f8fb', fontSize: '16px', fontWeight: 700 }}>{event.locationAddress}</div>
          </div>

          {event.travelCost && event.travelCost !== '0' && (
            <div className="tilt-card" style={{ background: '#161617', border: '1px solid #272729', borderRadius: '16px', padding: '20px' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '8px' }}>🚌</div>
              <div style={{ color: '#86868b', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>Travel Cost</div>
              <div style={{ color: '#f4f8fb', fontSize: '16px', fontWeight: 700 }}>₹{event.travelCost}</div>
            </div>
          )}
        </div>

        {/* Registration CTA Card */}
        <div style={{ background: isRegistered ? 'rgba(48,209,88,0.08)' : 'rgba(220,20,60,0.08)', border: `1px solid ${isRegistered ? 'rgba(48,209,88,0.25)' : 'rgba(220,20,60,0.25)'}`, borderRadius: '20px', padding: '32px', textAlign: 'center', marginBottom: '32px' }}>
          {isRegistered ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎉</div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#30d158', margin: '0 0 8px 0' }}>You're Registered!</h2>
              <p style={{ fontSize: '15px', color: '#86868b', margin: 0 }}>Your spot is confirmed for this event. See you there!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', margin: '0 0 8px 0' }}>Reserve Your Spot</h2>
              <p style={{ fontSize: '15px', color: '#86868b', margin: '0 0 24px 0', maxWidth: '500px' }}>
                Join us for {event.eventName}. Register below to confirm your attendance.
              </p>

              {registerMsg && <p style={{ color: registerMsg.startsWith('✅') ? '#30d158' : '#ff453a', marginBottom: '16px', fontSize: '14px', fontWeight: 500 }}>{registerMsg}</p>}

              <button
                onClick={handleRegister}
                disabled={isRegistering}
                style={{
                  background: '#dc143c',
                  color: '#fff',
                  border: 'none',
                  padding: '14px 40px',
                  borderRadius: '980px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: isRegistering ? 'not-allowed' : 'pointer',
                  opacity: isRegistering ? 0.8 : 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 16px rgba(220, 20, 60, 0.3)',
                }}
              >
                {isRegistering ? (
                  <>
                    <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Registering...
                  </>
                ) : (
                  'Register Now →'
                )}
              </button>

              {!currentUser && (
                <p style={{ color: '#86868b', fontSize: '14px', marginTop: '16px' }}>
                  <Link href="/login" style={{ color: '#f4f8fb', textDecoration: 'underline' }}>Sign in</Link> to reserve your spot.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Venue Map */}
        {event.locationAddress && (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Getting There</h3>
            <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #272729', height: '320px', width: '100%', background: '#161617' }}>
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

      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
