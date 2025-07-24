import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { FiArrowLeft } from 'react-icons/fi'; // Using Feather icon for back button

function ViewProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                const res = await API.get(`products/${id}/`);
                setProduct(res.data);
            } catch (error) {
                console.error('Failed to fetch product:', error);
                alert('Failed to load product');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (isLoading) return (
        <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <p>Loading product details...</p>
        </div>
    );

    if (!product) return <div style={styles.errorContainer}>Product not found</div>;

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <button
                        onClick={() => navigate('/products')}
                        style={styles.backButton}
                        title="Back to Products"
                    >
                        <FiArrowLeft size={20} />
                    </button>
                    <h2 style={styles.title}>Product Details</h2>
                    <div style={styles.headerSpacer}></div> {/* For alignment */}
                </div>

                <div style={styles.content}>
                    <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Product Name</span>
                        <span style={styles.detailValue}>{product.name}</span>
                    </div>

                    <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Description</span>
                        <span style={styles.detailValue}>{product.description || '-'}</span>
                    </div>

                    <div style={styles.detailGrid}>
                        <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Price</span>
                            <span style={styles.detailValue}>${parseFloat(product.price).toFixed(2)}</span>
                        </div>

                        <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Quantity</span>
                            <span style={styles.detailValue}>{product.quantity}</span>
                        </div>

                        <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Expiry Date</span>
                            <span style={styles.detailValue}>
                                {product.expiry_date ? new Date(product.expiry_date).toLocaleDateString() : '-'}
                            </span>
                        </div>

                        <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Category</span>
                            <span style={styles.detailValue}>{product.category}</span>
                        </div>
                    </div>

                    <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Status</span>
                        <span style={{
                            ...styles.statusBadge,
                            backgroundColor: product.available === 'Available' ? '#e6ffed' : '#ffebeb',
                            color: product.available === 'Available' ? '#1a7f37' : '#cf222e'
                        }}>
                            {product.available}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        padding: '20px',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        width: '100%',
        maxWidth: '700px',
        overflow: 'hidden',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 25px',
        borderBottom: '1px solid #eaeaea',
        position: 'relative',
    },
    backButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#4a5568',
        padding: '8px',
        borderRadius: '50%',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        margin: 0,
        color: '#2d3748',
        fontSize: '20px',
        fontWeight: '600',
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
    },
    headerSpacer: {
        width: '40px', // Matches the back button width for balance
    },
    content: {
        padding: '25px',
    },
    detailGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px',
        margin: '20px 0',
    },
    detailItem: {
        marginBottom: '18px',
    },
    detailLabel: {
        display: 'block',
        fontSize: '14px',
        color: '#718096',
        marginBottom: '6px',
        fontWeight: '500',
    },
    detailValue: {
        display: 'block',
        fontSize: '16px',
        color: '#2d3748',
        fontWeight: '500',
        padding: '8px 0',
        borderBottom: '1px solid #edf2f7',
    },
    statusBadge: {
        display: 'inline-block',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '600',
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        color: '#4a5568',
    },
    loadingSpinner: {
        border: '4px solid rgba(0, 0, 0, 0.1)',
        borderLeftColor: '#3182ce',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px',
    },
    errorContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        color: '#e53e3e',
        fontSize: '18px',
        fontWeight: '500',
    },
};

export default ViewProduct;