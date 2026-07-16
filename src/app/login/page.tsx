"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'admin'>('login');
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!/^\d{10}$/.test(contactNumber)) {
      setError('Contact number must be exactly 10 digits.');
      return;
    }

    if (mode === 'login' && !name.trim()) {
      setError('Name is required to log in.');
      return;
    }

    if (mode === 'admin' && !password.trim()) {
      setError('Admin password is required.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, name, contactNumber, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Success
      if (data.role === 'admin') {
        router.push('/admin'); // Assuming admin has a separate dashboard
      } else {
        router.push('/home');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Left Panel */}
      <div className={styles.leftPanel}>
        <div className={styles.logoArea}>
          <div className={styles.logoIcon}></div>
          <span className={styles.logoText}>DA-ROS</span>
        </div>
        <h1 className={styles.leftTitle}>Get Started with Us</h1>
        <p className={styles.leftDesc}>
          Access our church community portal to register for upcoming events.
        </p>

        <div className={styles.steps}>
          <div className={`${styles.stepCard} ${mode === 'login' ? styles.active : ''}`}>
            <div className={styles.stepNumber}>1</div>
            <span className={styles.stepText}>Log in securely</span>
          </div>
          <div className={`${styles.stepCard} ${mode === 'admin' ? styles.active : ''}`}>
            <div className={styles.stepNumber}>2</div>
            <span className={styles.stepText}>Admin Access</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>
            {mode === 'login' && 'Welcome to DA-ROS'}
            {mode === 'admin' && 'Admin Portal'}
          </h2>
          <p className={styles.formSubtitle}>
            {mode === 'login' && 'Enter your details to log in to your account.'}
            {mode === 'admin' && 'Enter admin credentials.'}
          </p>

          {error && <div className={styles.errorMsg}>{error}</div>}

          <form onSubmit={handleSubmit}>
            {mode === 'login' && (
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.label}>Contact Number</label>
              <input
                type="tel"
                className={styles.input}
                placeholder="10-digit mobile number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                maxLength={10}
                required
              />
            </div>

            {mode === 'admin' && (
              <div className={styles.formGroup}>
                <label className={styles.label}>Admin Password</label>
                <input
                  type="password"
                  className={styles.input}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            )}

            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
              {isLoading ? 'Processing...' : (mode === 'login' ? 'Log In' : 'Access Portal')}
            </button>
          </form>

          {mode !== 'admin' && (
            <div className={styles.adminToggle} onClick={() => setMode('admin')}>
              Are you an administrator?
            </div>
          )}
          {mode === 'admin' && (
            <div className={styles.adminToggle} onClick={() => setMode('login')}>
              Return to User Login
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
