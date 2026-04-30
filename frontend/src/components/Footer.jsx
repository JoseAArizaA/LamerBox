import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="app-footer">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} LAMERBOX. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;