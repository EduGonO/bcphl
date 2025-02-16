import React from 'react';
import Link from 'next/link';

export type Category = { name: string; color: string };

export type HeaderProps = {
  categories: Category[];
  activeCategory?: string | null;
  onCategoryChange?: (category: string) => void;
  layout: 'vertical' | 'horizontal';
};

const Header: React.FC<HeaderProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  layout,
}) => {
  const commonBtnStyle: React.CSSProperties = {
    fontSize: '14px',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
    borderRadius: '5px',
    padding: '10px 12px',
    textAlign: 'center',
  };

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
          background: 'rgba(248,248,248,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          zIndex: 1000,
          fontSize: '14px',
        }}
      >
        <Link href="/">
          <a style={{ textDecoration: 'none' }}>
            <img
              src="/media/logo.png"
              alt="Logo"
              style={{ height: '60px' }}
            />
          </a>
        </Link>
        <h1
          style={{
            fontSize: '34px',
            textAlign: 'left',
            fontFamily: 'DINAlternate-Bold, sans-serif',
            margin: 0,
          }}
        >
          Bicéphale
        </h1>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            width: '100%',
          }}
        >
          {categories.map((cat) => {
            const btnStyle: React.CSSProperties = {
              ...commonBtnStyle,
              width: '100%',
              backgroundColor: cat.color,
              opacity: activeCategory === cat.name ? 1 : 0.8,
            };
            return onCategoryChange ? (
              <button
                key={cat.name}
                onClick={() => onCategoryChange(cat.name)}
                style={btnStyle}
              >
                {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
              </button>
            ) : (
              <Link key={cat.name} href={`/?category=${cat.name}`}>
                <a
                  style={{
                    ...btnStyle,
                    textDecoration: 'none',
                    display: 'block',
                    textAlign: 'left',
                  }}
                >
                  {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                </a>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  // Horizontal layout
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '10px 20px',
        boxSizing: 'border-box',
        background: 'rgba(248,248,248,0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
      }}
    >
      {/* Logo and Title (centered together) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        <Link href="/">
          <a style={{ textDecoration: 'none' }}>
            <img src="/media/logo.png" alt="Logo" style={{ height: '60px' }} />
          </a>
        </Link>
        <h1
          style={{
            fontSize: '38px',
            margin: 0,
            lineHeight: '1',
            fontFamily: 'DINAlternate-Bold, sans-serif',
            color: 'inherit',
          }}
        >
          BICÉPHALE
        </h1>
      </div>
      {/* Categories (displayed as plain text) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          marginTop: '10px',
          padding: '10px 0',
          whiteSpace: 'nowrap',
          overflow: 'auto',
          lineHeight: 1,
        }}
      >
        {categories.map((cat) => (
          <span
            key={cat.name}
            style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#fff',
              backgroundColor: cat.color,
              padding: '5px 10px',
              borderRadius: '5px',
              opacity: activeCategory === cat.name ? 1 : 0.8,
            }}
          >
            {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Header;
