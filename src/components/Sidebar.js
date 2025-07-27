import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import smartstockLogo from '../assets/smartstock-logo.jpg';

function Sidebar() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);

    // Check screen size on mount and resize
    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobileView(mobile);
            if (!mobile) setIsMobileMenuOpen(false); // Auto-close when resizing to desktop
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    // Toggle sidebar visibility
    const toggleSidebar = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            {/* Mobile menu toggle button (always visible on mobile) */}
            {isMobileView && (
                <div style={styles.mobileMenuToggle} onClick={toggleSidebar}>
                    <i className={`bi ${isMobileMenuOpen ? 'bi-x' : 'bi-list'}`} style={styles.mobileMenuIcon}></i>
                </div>
            )}

            {/* Sidebar with responsive behavior */}
            <div style={{
                ...styles.sidebar,
                ...(isMobileView && !isMobileMenuOpen ? styles.sidebarMobileClosed : {})
            }}>
                <div style={styles.logoBlock}>
                    <img src={smartstockLogo} alt="SmartStock Logo" style={styles.logo} />
                </div>

                <nav>
                    <ul style={styles.navList}>
                        <li><Link to="/dashboard" style={styles.link} onClick={() => isMobileView && setIsMobileMenuOpen(false)}><i className="bi bi-house-door"></i> Home</Link></li>
                        <li><Link to="/products" style={styles.link} onClick={() => isMobileView && setIsMobileMenuOpen(false)}><i className="bi bi-box"></i> Manage Products</Link></li>
                        <li><Link to="/products/add" style={styles.link} onClick={() => isMobileView && setIsMobileMenuOpen(false)}><i className="bi bi-plus-square"></i> Add Product</Link></li>
                        <li><Link to="/purchase/new" style={styles.link} onClick={() => isMobileView && setIsMobileMenuOpen(false)}><i className="bi bi-cart-plus"></i> Purchase</Link></li>
                        <li><Link to="/purchases" style={styles.link} onClick={() => isMobileView && setIsMobileMenuOpen(false)}><i className="bi bi-card-list"></i> Purchase History</Link></li>
                    </ul>
                </nav>

                <button onClick={handleLogout} style={styles.logoutBtn}>
                    <i className="bi bi-box-arrow-right"></i> Logout
                </button>
            </div>
        </>
    );
}

const styles = {
    sidebar: {
        width: '220px',
        height: '100vh',
        backgroundColor: '#f1f4f9',
        borderRight: '1px solid #ccc',
        padding: '20px',
        position: 'fixed',
        top: 0,
        left: 0,
        fontFamily: 'Segoe UI, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.3s ease-in-out',
        zIndex: 1000, // Higher than content
    },
    logoBlock: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    logo: {
        height: '100px',
        marginBottom: '10px',
        width: '150px',
    },
    navList: {
        listStyle: 'none',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    link: {
        textDecoration: 'none',
        color: '#0056b3',
        fontSize: '15px',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px',
        borderRadius: '4px',
        transition: 'background-color 0.2s',
    },
    linkHover: {
        backgroundColor: '#e0e7ff',
    },
    logoutBtn: {
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        padding: '10px',
        borderRadius: '4px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: 'auto',
        width: '100%',
        textAlign: 'center',
        transition: 'background-color 0.2s',
    },
    logoutBtnHover: {
        backgroundColor: '#0056b3',
    },
    mobileMenuToggle: {
        position: 'fixed',
        top: '15px',
        left: '15px',
        zIndex: 1100, // Higher than sidebar
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    },
    mobileMenuIcon: {
        fontSize: '20px',
    },
    sidebarMobileClosed: {
        transform: 'translateX(-100%)',
    },
};

// Add this to your main CSS file or component
const globalStyles = `
    @media (max-width: 768px) {
        body {
            padding-left: 0 !important;
        }
        main {
            margin-left: 0 !important;
            width: 100% !important;
        }
    }
`;

// Inject global styles
const styleElement = document.createElement('style');
styleElement.innerHTML = globalStyles;
document.head.appendChild(styleElement);

export default Sidebar;