import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import smartstockLogo from '../assets/smartstock-logo.jpg'; // Adjust if needed
function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    return (
        <div style={styles.sidebar}>
            <div style={styles.logoBlock}>
                <img src={smartstockLogo} alt="SmartStock Logo" style={styles.logo} />

            </div>

            <nav>
                <ul style={styles.navList}>
                    <li><Link to="/dashboard" style={styles.link}><i className="bi bi-house-door"></i> Home</Link></li>
                    <li><Link to="/products" style={styles.link}><i className="bi bi-box"></i> Manage Products</Link></li>
                    <li><Link to="/products/add" style={styles.link}><i className="bi bi-plus-square"></i> Add Product</Link></li>
                    <li><Link to="/purchase/new" style={styles.link}><i className="bi bi-cart-plus"></i> Purchase</Link></li>
                    <li><Link to="/purchases" style={styles.link}><i className="bi bi-card-list"></i> Purchase History</Link></li>
                </ul>
            </nav>

            <button onClick={handleLogout} style={styles.logoutBtn}>
                <i className="bi bi-box-arrow-right"></i> Logout
            </button>
        </div>
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
        justifyContent: 'space-between'
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
    header: {
        fontSize: '18px',
        color: '#004085',
        fontWeight: 'bold',
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
        textAlign: 'center'
    }
};

export default Sidebar;
