import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        textAlign: 'center',
        padding: '20px',
        fontSize: '12px',
        color: '#424242',
        borderTop: '1px solid #ddd',
        marginTop: '40px',
      }}
    >
      © Bicéphale, 2025. Tous droits réservés.
    </footer>
  );
};

export default Footer;