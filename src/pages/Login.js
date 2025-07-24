import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from "../assets/smartstock-logo.jpg";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post('https://shop-backend-1-nhkz.onrender.com/api/token/', {
                username,
                password,
            });
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            navigate('/dashboard');
        } catch (error) {
            setError('Login failed. Please check your credentials and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.logoContainer}>
                    <img src={logo} alt="SmartStock Logo" style={styles.logo}/>
                    <h2 style={styles.title}>SmartStock</h2>
                    <p style={styles.subtitle}>Inventory Management System</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    {error && <div style={styles.error}>{error}</div>}

                    <div style={styles.inputGroup}>
                        <label htmlFor="username" style={styles.label}>Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            style={styles.input}
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label htmlFor="password" style={styles.label}>Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            style={styles.input}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        style={styles.button}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}

const styles = {
    container: {
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f2f5',
        fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
        width: '380px',
        padding: '40px',
        textAlign: 'center',
    },
    logoContainer: {
        marginBottom: '30px',
    },
    logo: {
        height: '60px',
        marginBottom: '15px',
    },
    title: {
        margin: '0',
        color: '#2d3748',
        fontSize: '24px',
        fontWeight: '700',
    },
    subtitle: {
        margin: '5px 0 0',
        color: '#718096',
        fontSize: '14px',
        fontWeight: '400',
    },
    form: {
        marginTop: '20px',
    },
    inputGroup: {
        marginBottom: '20px',
        textAlign: 'left',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '500',
        color: '#4a5568',
        fontSize: '14px',
    },
    input: {
        width: '100%',
        padding: '12px 15px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        fontSize: '14px',
        transition: 'all 0.2s ease',
        backgroundColor: '#f8fafc',
        boxSizing: 'border-box',
    },
    inputFocus: {
        borderColor: '#3182ce',
        boxShadow: '0 0 0 3px rgba(49, 130, 206, 0.1)',
    },
    button: {
        width: '100%',
        padding: '14px',
        backgroundColor: '#4299e1',
        border: 'none',
        color: 'white',
        fontWeight: '600',
        fontSize: '15px',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        marginTop: '10px',
    },
    buttonHover: {
        backgroundColor: '#3182ce',
        transform: 'translateY(-1px)',
    },
    error: {
        color: '#e53e3e',
        backgroundColor: '#fff5f5',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '14px',
        border: '1px solid #fed7d7',
    },
};

export default Login;