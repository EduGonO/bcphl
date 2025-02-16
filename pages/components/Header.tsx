import React from 'react';
import Link from 'next/link';

type Category = { name: string; color: string };

type HeaderProps = {
  categories: Category[];
  activeCategory?: string | null;
  onCategoryChange?: (category: string) => void;
  showBackButton?: boolean;
};

const Header: React.FC<HeaderProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  showBackButton = false,
}) => {
  return (
    <div
      style={{
        marginBottom: '42px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
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
            margin: '5px',
          }}
        >
          Back
        </button>
      )}
      <Link href="/">
        <a style={{ textDecoration: 'none', margin: '5px' }}>
          <img src="/media/logo.png" alt="Logo" style={{ maxHeight: '240px' }} />
        </a>
      </Link>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: '5px' }}>
        {categories.map((cat) => {
          const buttonStyle = {
            margin: '5px',
            padding: '10px 5px',
            writingMode: 'vertical-rl' as const,
            textAlign: 'center' as const,
            fontSize: '14px',
            border: 'none',
            backgroundColor: cat.color,
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 'bold' as const,
            borderRadius: '5px',
            transition: 'all 0.2s ease',
            opacity: activeCategory === cat.name ? 1 : 0.8,
          };
          if (onCategoryChange) {
            return (
              <button key={cat.name} onClick={() => onCategoryChange(cat.name)} style={buttonStyle}>
                {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
              </button>
            );
          }
          return (
            <Link key={cat.name} href={`/?category=${cat.name}`}>
              <a style={{ ...buttonStyle, textDecoration: 'none' }}>
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
