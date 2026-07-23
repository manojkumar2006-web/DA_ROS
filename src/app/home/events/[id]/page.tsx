"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useScrollReveal, use3DTilt } from '@/hooks/useScrollReveal';

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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000000' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#dc143c', borderRadius: '50%', animation: 'spin 1s cubic-bezier(0.16,1,0.3,1) infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div style={{ background: '#000000', color: '#f4f8fb', fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, 'Helvetica Neue', sans-serif", overflowX: 'hidden' }}>
      
      {/* Minimal Sticky Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', zIndex: 100, borderBottom: '1px solid #272729' }}>
        <Link href="/home" style={{ position: 'absolute', left: '24px', color: '#86868b', textDecoration: 'none', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
          <span>&larr;</span> Events
        </Link>
        <div style={{ fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, 'Helvetica Neue', sans-serif", fontWeight: 700, fontSize: '18px', color: '#f4f8fb', letterSpacing: '-0.01em' }}>
          DA-ROS
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ position: 'relative', width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(220,20,60,0.15) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none', zIndex: 0 }} />
        
        <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 24px' }}>
          <div style={{ background: '#dc143c', color: '#fff', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', padding: '4px 12px', borderRadius: '40px', textTransform: 'uppercase', marginBottom: '24px', animation: 'fadeIn 0.5s ease-out forwards', opacity: 0 }}>
            EVENT
          </div>
          <h1 style={{ fontSize: '80px', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.05, margin: 0, maxWidth: '900px', animation: 'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards', animationDelay: '0.2s', opacity: 0, transform: 'translateY(40px)' }}>
            {event.eventName}
          </h1>
        </div>

        <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
          <div style={{ animation: 'bounce 2s infinite', color: '#86868b', fontSize: '24px' }}>&darr;</div>
        </div>
      </section>

      {/* Details Section */}
      <section style={{ background: '#080808', padding: '120px 24px', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
          
          <div className="tilt-card reveal-left delay-1" style={{ background: '#161617', border: '1px solid #272729', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>📅</div>
            <div style={{ color: '#86868b', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Date</div>
            <div style={{ color: '#f4f8fb', fontSize: '18px', fontWeight: 700 }}>{formatDate(event.date)}</div>
          </div>
          
          <div className="tilt-card reveal-left delay-2" style={{ background: '#161617', border: '1px solid #272729', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏰</div>
            <div style={{ color: '#86868b', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Time</div>
            <div style={{ color: '#f4f8fb', fontSize: '18px', fontWeight: 700 }}>{event.time}</div>
          </div>
          
          <div className="tilt-card reveal-right delay-3" style={{ background: '#161617', border: '1px solid #272729', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>📍</div>
            <div style={{ color: '#86868b', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Location</div>
            <div style={{ color: '#f4f8fb', fontSize: '18px', fontWeight: 700 }}>{event.locationAddress}</div>
          </div>
          
          {event.travelCost && event.travelCost !== '0' && (
            <div className="tilt-card reveal-right delay-4" style={{ background: '#161617', border: '1px solid #272729', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🚌</div>
              <div style={{ color: '#86868b', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Travel Cost</div>
              <div style={{ color: '#f4f8fb', fontSize: '18px', fontWeight: 700 }}>₹{event.travelCost}</div>
            </div>
          )}
          
        </div>
      </section>

      {/* Map Section */}
      {event.locationAddress && (
        <section style={{ background: '#000000', padding: '120px 24px', borderTop: '1px solid #272729' }}>
          <div className="reveal-scale" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '56px', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', marginBottom: '40px', textAlign: 'center' }}>Getting There</h2>
            <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid #272729', height: '380px', width: '100%', background: '#161617' }}>
              <iframe
                src={
                  event.gmapLink && event.gmapLink.includes('embed')
                    ? event.gmapLink
                    : \`https://maps.google.com/maps?q=\${encodeURIComponent(event.gmapLink || event.locationAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed\`
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
        </section>
      )}

      {/* Register Section */}
      <section style={{ background: '#0a0a0a', padding: '120px 24px', borderTop: '1px solid #272729', width: '100%', position: 'relative' }}>
        <div className="reveal-scale" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          {isRegistered ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '80px', marginBottom: '24px' }}>🎉</div>
              <h2 style={{ fontSize: '56px', fontWeight: 700, letterSpacing: '-0.03em', color: '#30d158', margin: '0 0 16px 0' }}>You’re in!</h2>
              <p style={{ fontSize: '20px', color: '#86868b', margin: 0, fontWeight: 500 }}>Your attendance is confirmed for this event.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{ fontSize: '56px', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', margin: '0 0 24px 0' }}>Join this event.</h2>
              <p style={{ fontSize: '20px', color: '#86868b', margin: '0 0 48px 0', maxWidth: '600px', lineHeight: 1.5 }}>
                Reserve your spot and be part of this incredible gathering. Space might be limited, so don’t wait.
              </p>
              
              {registerMsg && <p style={{ color: registerMsg.startsWith('✅') ? '#30d158' : '#ff453a', marginBottom: '24px', fontSize: '16px', fontWeight: 500 }}>{registerMsg}</p>}
              
              <button
                onClick={handleRegister}
                disabled={isRegistering}
                className="cta-button"
                style={{
                  background: '#dc143c',
                  color: '#fff',
                  border: 'none',
                  padding: '18px 48px',
                  borderRadius: '980px',
                  fontSize: '18px',
                  fontWeight: 600,
                  cursor: isRegistering ? 'not-allowed' : 'pointer',
                  opacity: isRegistering ? 0.8 : 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                  boxShadow: '0 8px 24px rgba(220, 20, 60, 0.3)',
                }}
              >
                {isRegistering ? (
                  <>
                    <span style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Processing...
                  </>
                ) : (
                  'Register Now'
                )}
              </button>

              {!currentUser && (
                <p style={{ color: '#86868b', fontSize: '15px', marginTop: '24px' }}>
                  <Link href="/login" style={{ color: '#f4f8fb', textDecoration: 'underline' }}>Sign in</Link> to reserve your spot.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      <style>{`
        @keyframes spin { 
          to { transform: rotate(360deg); } 
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        .cta-button:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(220, 20, 60, 0.5) !important;
        }
        .cta-button:active:not(:disabled) {
          transform: scale(0.97) translateY(0);
          box-shadow: 0 4px 16px rgba(220, 20, 60, 0.4) !important;
        }
      `}</style>
    </div>
  );
}
