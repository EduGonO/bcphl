import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        textAlign: 'center',
        padding: '10px 20px',
        fontSize: '14px',
        color: '#555',
        background: 'transparent',
      }}
    >
      <div>© Bicéphale, 2025. Tous droits réservés.</div>
      <div style={{ marginTop: '5px' }}>
        <button
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            backgroundColor: '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Contact
        </button>
      </div>
    </footer>
  );
};

export default Footer;