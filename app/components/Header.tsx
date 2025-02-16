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
    width: '100%',
    textAlign: 'left',
    padding: '10px 12px',
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
            <img src="/media/logo.png" alt="Logo" style={{ maxWidth: '100%' }} />
          </a>
        </Link>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
          {categories.map((cat) => {
            const btnStyle: React.CSSProperties = {
              ...commonBtnStyle,
              backgroundColor: cat.color,
              opacity: activeCategory === cat.name ? 1 : 0.8,
            };
            if (onCategoryChange) {
              return (
                <button
                  key={cat.name}
                  onClick={() => onCategoryChange(cat.name)}
                  style={btnStyle}
                >
                  {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                </button>
              );
            }
            // Ensure link looks identical: enforce block display and full width
            return (
              <Link key={cat.name} href={`/?category=${cat.name}`}>
                <a
                  style={{
                    ...btnStyle,
                    textDecoration: 'none',
                    display: 'block',
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

  // Horizontal layout remains unchanged.
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '80px',
        padding: '10px 20px',
        boxSizing: 'border-box',
        background: 'rgba(248,248,248,0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        zIndex: 1000,
        fontSize: '14px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Link href="/">
          <a style={{ textDecoration: 'none' }}>
            <img src="/media/logo.png" alt="Logo" style={{ height: '70px' }} />
          </a>
        </Link>
      </div>
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          whiteSpace: 'nowrap',
          lineHeight: 1,
        }}
      >
        {categories.map((cat) => {
          const btnStyle: React.CSSProperties = {
            fontSize: '14px',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 'bold',
            borderRadius: '5px',
            padding: '8px 12px',
            backgroundColor: cat.color,
            opacity: activeCategory === cat.name ? 1 : 0.8,
            textAlign: 'center',
          };
          if (onCategoryChange) {
            return (
              <button key={cat.name} onClick={() => onCategoryChange(cat.name)} style={btnStyle}>
                {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
              </button>
            );
          }
          return (
            <Link key={cat.name} href={`/?category=${cat.name}`}>
              <a style={{ ...btnStyle, textDecoration: 'none', display: 'block' }}>
                {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Header;
