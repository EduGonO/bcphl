import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: '#f2f2f2',
        padding: '20px',
        textAlign: 'center',
        fontSize: '14px',
        color: '#555',
        borderTop: '1px solid #ddd',
        marginTop: '40px',
      }}
    >
      <div style={{ marginBottom: '10px' }}>© Bicéphale, 2025. All rights reserved.</div>
      <div>
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
