"use client";

import { useState } from 'react';
import styles from './page.module.css';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup' | 'admin'>('signup');
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic frontend validation
    if (!/^\d{10}$/.test(contactNumber)) {
      setError('Contact number must be exactly 10 digits.');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setError('Name is required for sign up.');
      return;
    }

    if (mode === 'admin' && password !== 'JESUSLOVESYOU') {
      setError('Invalid admin credentials.');
      return;
    }

    // TODO: Connect to backend API
    console.log('Submitting:', { mode, name, contactNumber, password });
    alert('Authentication API integration is in progress!');
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
          Complete these easy steps to register your account and join our community.
        </p>

        <div className={styles.steps}>
          <div className={`${styles.stepCard} ${mode === 'signup' ? styles.active : ''}`}>
            <div className={styles.stepNumber}>1</div>
            <span className={styles.stepText}>Sign up your account</span>
          </div>
          <div className={`${styles.stepCard} ${mode === 'login' ? styles.active : ''}`}>
            <div className={styles.stepNumber}>2</div>
            <span className={styles.stepText}>Log in securely</span>
          </div>
          <div className={`${styles.stepCard} ${mode === 'admin' ? styles.active : ''}`}>
            <div className={styles.stepNumber}>3</div>
            <span className={styles.stepText}>Admin Access</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>
            {mode === 'signup' && 'Sign Up Account'}
            {mode === 'login' && 'Welcome Back'}
            {mode === 'admin' && 'Admin Portal'}
          </h2>
          <p className={styles.formSubtitle}>
            {mode === 'signup' && 'Enter your personal data to create your account.'}
            {mode === 'login' && 'Enter your contact number to log in.'}
            {mode === 'admin' && 'Enter admin credentials.'}
          </p>

          {error && <div className={styles.errorMsg}>{error}</div>}

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
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

            <button type="submit" className={styles.submitBtn}>
              {mode === 'signup' && 'Sign Up'}
              {mode === 'login' && 'Log In'}
              {mode === 'admin' && 'Access Portal'}
            </button>
          </form>

          {mode === 'signup' && (
            <p className={styles.toggleText}>
              Already have an account?{' '}
              <span className={styles.toggleLink} onClick={() => setMode('login')}>
                Log in
              </span>
            </p>
          )}

          {mode === 'login' && (
            <p className={styles.toggleText}>
              Don't have an account?{' '}
              <span className={styles.toggleLink} onClick={() => setMode('signup')}>
                Sign up
              </span>
            </p>
          )}

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
