import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.sectionOne}>
        <nav className={styles.navbar}>
          <div className={styles.logo}>DA-ROS</div>
          <div className={styles.navLinks}>
            <Link href="/" className={styles.navLink}>Home</Link>
            <Link href="/about" className={styles.navLink}>About</Link>
            <Link href="/events" className={styles.navLink}>Events</Link>
            <Link href="/login" className={styles.btnPrimary}>
              Login <span className={styles.btnIcon}>→</span>
            </Link>
          </div>
        </nav>

        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.heroLeft}>
              <p className={styles.greeting}>Welcome to</p>
              <h1 className={styles.title}>
                DA-ROS<br />
                Events
              </h1>
            </div>
            <div className={styles.heroRight}>
              <h2 className={styles.subtitle}>
                Discover, Join &<br />Stay Connected.
              </h2>
              <p className={styles.description}>
                Find upcoming church events, register in seconds, view travel details, and stay connected with your community—all from one place.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.features}>
          <div className={styles.featureItem}>
            <span className={styles.featureNumber}>#01</span>
            <span className={styles.featureText}>Explore Events</span>
            <span className={styles.featureDesc}>Browse all upcoming church events with complete details.</span>
          </div>
          <div className={styles.featureItem}>
            <span className={styles.featureNumber}>#02</span>
            <span className={styles.featureText}>Register Easily</span>
            <span className={styles.featureDesc}>Reserve your spot instantly with a single click.</span>
          </div>
          <div className={styles.featureItem}>
            <span className={styles.featureNumber}>#03</span>
            <span className={styles.featureText}>Connect Together</span>
            <span className={styles.featureDesc}>See who's joining and become part of every gathering.</span>
          </div>
          <div className={styles.featureItem}>
            <span className={styles.featureNumber}>#04</span>
            <span className={styles.featureText}>Navigate Easily</span>
            <span className={styles.featureDesc}>Open event locations directly in Google Maps.</span>
          </div>
        </section>
      </div>

      <section className={styles.sectionTwo}>
        <div className={styles.s2Top}>
          <div className={styles.s2Left}>
            <h2 className={styles.s2Title}>
              DA-ROS is the central place for staying connected with our church community.
            </h2>
            <p className={styles.s2Links}>
              FAITH &mdash; FELLOWSHIP &mdash; COMMUNITY
            </p>
          </div>
        </div>

        <div className={styles.s2Bottom}>
          <div className={styles.s2Feature}>
            <div className={styles.s2Icon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
            <h3 className={styles.s2FeatureTitle}>Church Events</h3>
            <p className={styles.s2FeatureDesc}>Stay informed about every upcoming service, prayer meeting, youth gathering, outreach program, and special event happening in our church.</p>
          </div>
          <div className={styles.s2Feature}>
            <div className={styles.s2Icon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <h3 className={styles.s2FeatureTitle}>Be Part of Every Gathering</h3>
            <p className={styles.s2FeatureDesc}>Register for events with ease, see how many members are joining, and become part of every moment that strengthens our church family.</p>
          </div>
          <div className={styles.s2Feature}>
            <div className={styles.s2Icon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
            </div>
            <h3 className={styles.s2FeatureTitle}>Easy Navigation</h3>
            <p className={styles.s2FeatureDesc}>Find event venues, view travel information, and get directions instantly through Google Maps so you can arrive without hassle.</p>
          </div>
          <div className={styles.s2Feature}>
            <div className={styles.s2Icon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </div>
            <h3 className={styles.s2FeatureTitle}>Stay Connected</h3>
            <p className={styles.s2FeatureDesc}>Never miss an important church event. Keep track of your registrations and stay connected with everything happening in our church.</p>
          </div>
        </div>
      </section>

      <section className={styles.sectionThree}>
        <div className={styles.s3Badge}>
          <span className={styles.s3BadgeDot}></span> Join DA-ROS
        </div>
        <h2 className={styles.s3Title}>
          Stay Connected<br />
          With Our Church<br />
          <span className={styles.textCrimson}>Community</span>
        </h2>
        <p className={styles.s3Description}>
          Join our church family through every gathering, fellowship, and special event. Sign in to register for upcoming events, or access the admin portal to organize and manage church activities.
        </p>
        <div className={styles.s3ButtonGroup}>
          <button className={styles.s3BtnPrimary}>Login</button>
          <button className={styles.s3BtnSecondary}>Admin</button>
        </div>
      </section>
    </main>
  );
}
