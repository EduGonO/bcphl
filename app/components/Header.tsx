import React, { useState } from 'react';
import Link from 'next/link';

export type Category = { name: string; color: string };

export type HeaderProps = {
  categories: Category[];
  activeCategory?: string | null;
  onCategoryChange?: (category: string) => void;
  layout?: 'vertical' | 'horizontal';
};

const Header: React.FC<HeaderProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  layout = 'horizontal',
}) => {
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const dropdownVisible = isButtonHovered || isDropdownHovered;

  const buttonBase: React.CSSProperties = {
    fontSize: '14px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    padding: '10px 12px',
    background: 'none',
    color: '#607d8b',
    transition: 'color 0.2s ease',
  };

  // Vertical dropdown: spans sidebar width.
  const verticalDropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    background: 'rgba(248,248,248,0.95)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    borderRadius: '4px',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  };

  // Horizontal dropdown: fixed, centered, constrained.
  const horizontalDropdownStyle: React.CSSProperties = {
    position: 'fixed',
    top: '70px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'calc(100vw - 20px)',
    maxWidth: '600px',
    background: 'rgba(248,248,248,0.95)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    padding: '10px 20px',
    borderRadius: '8px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    justifyContent: 'center',
  };

  const renderDropdown = () => {
    const style = layout === 'horizontal' ? horizontalDropdownStyle : verticalDropdownStyle;
    return (
      <div
        onMouseEnter={() => setIsDropdownHovered(true)}
        onMouseLeave={() => setIsDropdownHovered(false)}
      >
        <div style={style}>
          {categories.map(cat =>
            onCategoryChange ? (
              <button
                key={cat.name}
                onClick={() => {
                  onCategoryChange(cat.name);
                }}
                style={{ ...buttonBase, color: cat.color }}
              >
                {cat.name}
              </button>
            ) : (
              <Link key={cat.name} href={`/?category=${cat.name}`}>
                <a style={{ ...buttonBase, color: cat.color, textDecoration: 'none' }}>
                  {cat.name}
                </a>
              </Link>
            )
          )}
        </div>
      </div>
    );
  };

  const categoriesButton = (
    <button style={{ ...buttonBase, display: 'flex', alignItems: 'center', gap: '5px' }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
      </svg>
      Categories
    </button>
  );

  const searchButton = (
    <Link href="/indices">
      <a style={{ ...buttonBase, padding: '10px', display: 'flex', alignItems: 'center' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </a>
    </Link>
  );

  // Container for the categories button.
  const categoriesContainer = (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsButtonHovered(true)}
      onMouseLeave={() => setIsButtonHovered(false)}
    >
      {categoriesButton}
      {dropdownVisible && layout === 'vertical' && renderDropdown()}
    </div>
  );

  if (layout === 'vertical') {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '250px',
          height: '100vh',
          padding: '20px',
          boxSizing: 'border-box',
          background: 'rgba(248,248,248,0.95)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          zIndex: 1000,
        }}
      >
        <Link href="/">
          <a style={{ textDecoration: 'none' }}>
            <img src="/media/logo.png" alt="Logo" style={{ height: '60px' }} />
          </a>
        </Link>
        <h1 style={{ fontSize: '34px', textAlign: 'left', fontFamily: 'DINAlternate-Bold, sans-serif', margin: 0, color: '#333' }}>
          BICÉPHALE
        </h1>
        {categoriesContainer}
        {searchButton}
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          padding: '10px 20px',
          boxSizing: 'border-box',
          background: 'rgba(255,255,255,0.95)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link href="/">
              <a style={{ textDecoration: 'none' }}>
                <img src="/media/logo.png" alt="Logo" style={{ height: '60px' }} />
              </a>
            </Link>
            <h1 style={{ fontSize: '38px', margin: 0, lineHeight: '1', fontFamily: 'DINAlternate-Bold, sans-serif', color: '#333' }}>
              BICÉPHALE
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', position: 'relative' }}>
            <div
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
            >
              {categoriesButton}
            </div>
            {searchButton}
          </div>
        </div>
      </div>
      {layout === 'horizontal' && dropdownVisible && renderDropdown()}
    </>
  );
};

export default Header;
