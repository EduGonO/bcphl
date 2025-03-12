import React, { useState } from 'react';
import Link from 'next/link';

export type Category = { name: string; color: string };

export type HeaderProps = {
  categories: Category[];
  activeCategory?: string | null;
  onCategoryChange?: (category: string) => void;
  layout: 'vertical' | 'horizontal';
};

const Header: React.FC<HeaderProps> = ({ categories, activeCategory, onCategoryChange, layout }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const btnStyle: React.CSSProperties = {
    fontSize: '14px',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
    borderRadius: '5px',
    padding: '10px 12px',
    backgroundColor: '#607d8b',
  };

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    background: 'rgba(248,248,248,0.9)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    borderRadius: '4px',
    padding: '10px',
    zIndex: 1000,
  };

  const renderDropdown = () => (
    <div style={dropdownStyle}>
      {categories.map(cat =>
        onCategoryChange ? (
          <button
            key={cat.name}
            onClick={() => { onCategoryChange(cat.name); setDropdownVisible(false); }}
            style={{ ...btnStyle, backgroundColor: cat.color, margin: '5px 0', width: '100%' }}
          >
            {cat.name}
          </button>
        ) : (
          <Link key={cat.name} href={`/?category=${cat.name}`}>
            <a style={{ ...btnStyle, backgroundColor: cat.color, margin: '5px 0', width: '100%', display: 'block', textAlign: 'center', textDecoration: 'none' }}>
              {cat.name}
            </a>
          </Link>
        )
      )}
    </div>
  );

  const searchBtn = (
    <Link href="/indices">
      <a style={{ ...btnStyle, display: 'flex', alignItems: 'center', gap: '5px' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        Search
      </a>
    </Link>
  );

  if (layout === 'vertical') {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '250px',
        height: '100vh',
        padding: '20px',
        boxSizing: 'border-box',
        background: 'rgba(248,248,248,0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        zIndex: 1000,
      }}>
        <Link href="/">
          <a style={{ textDecoration: 'none' }}>
            <img src="/media/logo.png" alt="Logo" style={{ height: '60px' }} />
          </a>
        </Link>
        <h1 style={{
          fontSize: '34px',
          textAlign: 'left',
          fontFamily: 'DINAlternate-Bold, sans-serif',
          margin: 0,
        }}>
          BICÉPHALE
        </h1>
        <div style={{ position: 'relative' }}
          onMouseEnter={() => setDropdownVisible(true)}
          onMouseLeave={() => setDropdownVisible(false)}
        >
          <button style={btnStyle}>Categories</button>
          {dropdownVisible && renderDropdown()}
        </div>
        {searchBtn}
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      padding: '10px 20px',
      boxSizing: 'border-box',
      background: 'rgba(248,248,248,0.8)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/">
            <a style={{ textDecoration: 'none' }}>
              <img src="/media/logo.png" alt="Logo" style={{ height: '60px' }} />
            </a>
          </Link>
          <h1 style={{
            fontSize: '38px',
            margin: 0,
            lineHeight: '1',
            fontFamily: 'DINAlternate-Bold, sans-serif',
          }}>
            BICÉPHALE
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}
            onMouseEnter={() => setDropdownVisible(true)}
            onMouseLeave={() => setDropdownVisible(false)}
          >
            <button style={btnStyle}>Categories</button>
            {dropdownVisible && renderDropdown()}
          </div>
          {searchBtn}
        </div>
      </div>
    </div>
  );
};

export default Header;
