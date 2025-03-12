import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (newsletterOpen && popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setNewsletterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [newsletterOpen]);

  const linkStyle: React.CSSProperties = {
    color: '#fff',
    textDecoration: 'none',
    cursor: 'pointer',
  };

  const buttonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '14px',
    cursor: 'pointer',
    padding: 0,
  };

  return (
    <>
      {newsletterOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}
        >
          <div
            ref={popoverRef}
            style={{
              background: '#fff',
              color: '#000',
              padding: '20px',
              borderRadius: '8px',
              width: '300px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{ margin: '0 0 10px', fontSize: '16px', color: '#333' }}>
              Newsletter Signup
            </h3>
            <p style={{ margin: '0 0 10px', fontSize: '14px', color: '#666' }}>
              Enter your email to subscribe:
            </p>
            <input
              type="email"
              placeholder="Email"
              style={{
                width: '100%',
                padding: '8px',
                fontSize: '14px',
                marginBottom: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <button
              style={{
                width: '100%',
                padding: '8px',
                fontSize: '14px',
                cursor: 'pointer',
                background: '#607d8b',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
              }}
            >
              Subscribe
            </button>
          </div>
        </div>
      )}
      <footer
        style={{
          background: '#000',
          color: '#fff',
          padding: '20px',
          textAlign: 'center',
          marginTop: '40px',
        }}
      >
        {/* Logo and website name */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '15px',
          }}
        >
          <img src="/media/logo.png" alt="Logo" style={{ height: '40px' }} />
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>BICÉPHALE</span>
        </div>
        {/* Navigation buttons */}
        <nav
          style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            marginBottom: '15px',
          }}
        >
          <Link href="/indices">
            <a style={linkStyle}>articles</a>
          </Link>
          <a style={linkStyle}>événements</a>
          <button style={buttonStyle} onClick={() => setNewsletterOpen(true)}>
            newsletter
          </button>
          <a style={linkStyle}>à propos</a>
          <a style={linkStyle}>contact</a>
        </nav>
        {/* Social media icons */}
        <div
          style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            marginBottom: '15px',
          }}
        >
          <a style={linkStyle} href="#">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
          <a style={linkStyle} href="#">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43 1a9.15 9.15 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.11 0a4.48 4.48 0 0 0-4.47 4.47c0 .35.04.7.11 1.03A12.8 12.8 0 0 1 1.64 1.14a4.48 4.48 0 0 0 1.38 5.97 4.46 4.46 0 0 1-2.03-.56v.06A4.48 4.48 0 0 0 4.47 11a4.48 4.48 0 0 1-2.02.08 4.48 4.48 0 0 0 4.18 3.11A9 9 0 0 1 0 19.54a12.76 12.76 0 0 0 6.92 2.03c8.3 0 12.84-6.87 12.84-12.84 0-.2 0-.39-.02-.59A9.22 9.22 0 0 0 23 3z" />
            </svg>
          </a>
          <a style={linkStyle} href="#">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
            </svg>
          </a>
          <a style={linkStyle} href="#">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16v16H4z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </a>
        </div>
        {/* Copyright */}
        <div style={{ fontSize: '12px' }}>
          © Bicéphale, 2025. Tous droits réservés.
        </div>
      </footer>
    </>
  );
};

export 
