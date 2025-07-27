import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const PurchaseList = () => {
    const [purchases, setPurchases] = useState([]);
    const [filteredPurchases, setFilteredPurchases] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();

    // Format price in Leones
    const formatPrice = (price) => {
        return `SLL ${parseFloat(price).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    // Check if mobile view
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    useEffect(() => {
        const fetchPurchases = async () => {
            const token = localStorage.getItem('access_token');
            try {
                const res = await axios.get('https://shop-backend-1-nhkz.onrender.com/api/purchase/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPurchases(res.data);
                setFilteredPurchases(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch purchases', err);
                setLoading(false);
            }
        };
        fetchPurchases();
    }, []);

    useEffect(() => {
        const results = purchases.filter(purchase =>
            purchase.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            purchase.items.some(item =>
                item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredPurchases(results);
    }, [searchTerm, purchases]);

    const handleView = (id) => {
        navigate(`/purchase/view/${id}`);
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('access_token');

        if (window.confirm('Are you sure you want to delete this purchase?')) {
            try {
                await axios.delete(`https://shop-backend-1-nhkz.onrender.com/api/purchase/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setPurchases(purchases.filter((purchase) => purchase.id !== id));
            } catch (error) {
                console.error('Failed to delete purchase', error);
                alert('Delete failed. Please make sure you are logged in.');
            }
        }
    };

    if (loading) {
        return (
            <div className="d-flex">
                <Sidebar />
                <div className="container-fluid px-3 px-md-4 mt-4" style={{
                    marginLeft: isMobile ? '0' : '220px',
                    width: '100%',
                    transition: 'margin-left 0.3s'
                }}>
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading purchase history...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="container-fluid px-3 px-md-4 mt-4" style={{
                marginLeft: isMobile ? '0' : '220px',
                width: '100%',
                transition: 'margin-left 0.3s'
            }}>
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                    <h2 className="mb-0">Purchase History</h2>
                    <div className="w-100 w-md-auto">
                        <div className="input-group">
                            <span className="input-group-text bg-white">
                                <i className="bi bi-search"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by customer or product..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ minWidth: '200px' }}
                            />
                        </div>
                    </div>
                </div>

                {filteredPurchases.length === 0 ? (
                    <div className="alert alert-info">
                        {searchTerm ? 'No purchases match your search.' : 'No purchase history available.'}
                    </div>
                ) : isMobile ? (
                    // Mobile Card View
                    <div className="row g-3">
                        {filteredPurchases.map((purchase) => {
                            const purchaseTotal = purchase.items.reduce((sum, item) => {
                                return sum + parseFloat(item.total_price || 0);
                            }, 0);

                            return (
                                <div key={purchase.id} className="col-12">
                                    <div className="card shadow-sm h-100">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h5 className="card-title mb-0 text-truncate" style={{ maxWidth: '200px' }}>
                                                    {purchase.customer_name}
                                                </h5>
                                                <span className="badge bg-primary fs-6">
                                                    {formatPrice(purchaseTotal)}
                                                </span>
                                            </div>

                                            <p className="text-muted small mb-3">
                                                <i className="bi bi-calendar me-1"></i>
                                                {new Date(purchase.purchase_date).toLocaleDateString()}
                                            </p>

                                            <div className="mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                {purchase.items.map(item => (
                                                    <div key={item.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                                        <div className="text-truncate" style={{ maxWidth: '150px' }}>
                                                            <strong className="d-block">{item.product_name}</strong>
                                                            <small className="text-muted">
                                                                {formatPrice(item.product_price)} × {item.quantity}
                                                            </small>
                                                        </div>
                                                        <div className="text-end fw-bold">
                                                            {formatPrice(item.total_price)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="d-flex justify-content-end gap-2 mt-2">
                                                <button
                                                    className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                                    onClick={() => handleView(purchase.id)}
                                                >
                                                    <i className="bi bi-eye me-1"></i> View
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger d-flex align-items-center"
                                                    onClick={() => handleDelete(purchase.id)}
                                                >
                                                    <i className="bi bi-trash me-1"></i> Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    // Desktop Table View
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                    <tr>
                                        <th style={{ width: '15%' }}>Customer</th>
                                        <th style={{ width: '25%' }}>Products</th>
                                        <th style={{ width: '12%' }}>Unit Price</th>
                                        <th style={{ width: '8%' }}>Qty</th>
                                        <th style={{ width: '12%' }}>Total</th>
                                        <th style={{ width: '12%' }}>Date</th>
                                        <th style={{ width: '16%' }}>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredPurchases.map((purchase) => {
                                        const purchaseTotal = purchase.items.reduce((sum, item) => {
                                            return sum + parseFloat(item.total_price || 0);
                                        }, 0);

                                        return (
                                            <tr key={purchase.id}>
                                                <td className="fw-semibold text-truncate" style={{ maxWidth: '150px' }}>
                                                    {purchase.customer_name}
                                                </td>
                                                <td>
                                                    <ul className="list-unstyled mb-0">
                                                        {purchase.items.map(item => (
                                                            <li key={item.id} className="small text-truncate" style={{ maxWidth: '200px' }}>
                                                                {item.product_name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td>
                                                    <ul className="list-unstyled mb-0">
                                                        {purchase.items.map(item => (
                                                            <li key={item.id} className="small">
                                                                {formatPrice(item.product_price)}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td>
                                                    <ul className="list-unstyled mb-0">
                                                        {purchase.items.map(item => (
                                                            <li key={item.id} className="small">
                                                                {item.quantity}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td className="fw-bold text-primary">
                                                    {formatPrice(purchaseTotal)}
                                                </td>
                                                <td className="small text-muted">
                                                    {new Date(purchase.purchase_date).toLocaleDateString()}
                                                </td>
                                                <td>
                                                    <div className="d-flex">
                                                        <button
                                                            className="btn btn-sm btn-outline-primary me-2"
                                                            onClick={() => handleView(purchase.id)}
                                                        >
                                                            <i className="bi bi-eye"></i> View
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleDelete(purchase.id)}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PurchaseList;