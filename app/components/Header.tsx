import React from 'react';
import Link from 'next/link';

export type Category = { name: string; color: string };

export type HeaderProps = {
  categories: Category[];
  activeCategory?: string | null;
  onCategoryChange?: (category: string) => void;
  showBackButton?: boolean;
  layout: 'vertical' | 'horizontal';
};

const Header: React.FC<HeaderProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  showBackButton = false,
  layout,
}) => {
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
          zIndex: 1000,
        }}
      >
        {showBackButton && (
          <button
            onClick={() => window.history.back()}
            style={{
              backgroundColor: '#f44336',
              color: '#fff',
              border: 'none',
              padding: '10px 15px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              marginBottom: '20px',
            }}
          >
            Back
          </button>
        )}
        <Link href="/">
          <a style={{ textDecoration: 'none', marginBottom: '20px' }}>
            <img src="/media/logo.png" alt="Logo" style={{ maxWidth: '100%' }} />
          </a>
        </Link>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {categories.map((cat) => {
            const btnStyle = {
              padding: '10px 12px',
              fontSize: '14px',
              border: 'none',
              backgroundColor: cat.color,
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 'bold' as const,
              borderRadius: '5px',
              opacity: activeCategory === cat.name ? 1 : 0.8,
              textAlign: 'left' as const,
            };
            return onCategoryChange ? (
              <button key={cat.name} onClick={() => onCategoryChange(cat.name)} style={btnStyle}>
                {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
              </button>
            ) : (
              <Link key={cat.name} href={`/?category=${cat.name}`}>
                <a style={{ ...btnStyle, textDecoration: 'none' }}>
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
        height: '80px',
        padding: '10px 20px',
        boxSizing: 'border-box',
        background: 'rgba(248,248,248,0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {showBackButton && (
          <button
            onClick={() => window.history.back()}
            style={{
              backgroundColor: '#f44336',
              color: '#fff',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Back
          </button>
        )}
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
          const btnStyle = {
            padding: '8px 12px',
            fontSize: '14px',
            border: 'none',
            backgroundColor: cat.color,
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 'bold' as const,
            borderRadius: '5px',
            opacity: activeCategory === cat.name ? 1 : 0.8,
            textAlign: 'center' as const,
          };
          return onCategoryChange ? (
            <button key={cat.name} onClick={() => onCategoryChange(cat.name)} style={btnStyle}>
              {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
            </button>
          ) : (
            <Link key={cat.name} href={`/?category=${cat.name}`}>
              <a style={{ ...btnStyle, textDecoration: 'none' }}>
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
