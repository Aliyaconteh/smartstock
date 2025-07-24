import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const PurchaseList = () => {
    const [purchases, setPurchases] = useState([]);
    const [filteredPurchases, setFilteredPurchases] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
                <div className="container-fluid px-4 mt-4" style={{ marginLeft: '220px' }}>
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
            <div className="container-fluid px-4 mt-4" style={{ marginLeft: '220px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">Purchase History</h2>
                    <div className="d-flex">
                        <div className="input-group" style={{ width: '300px' }}>
                            <span className="input-group-text bg-white">
                                <i className="bi bi-search"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by customer or product..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {filteredPurchases.length === 0 ? (
                    <div className="alert alert-info">
                        {searchTerm ? 'No purchases match your search.' : 'No purchase history available.'}
                    </div>
                ) : (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                    <tr>
                                        <th>Customer</th>
                                        <th>Products</th>
                                        <th>Unit Price</th>
                                        <th>Qty</th>
                                        <th>Total</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredPurchases.map((purchase) => {
                                        const purchaseTotal = purchase.items.reduce((sum, item) => {
                                            return sum + parseFloat(item.total_price || 0);
                                        }, 0);

                                        return (
                                            <tr key={purchase.id}>
                                                <td className="fw-semibold">{purchase.customer_name}</td>
                                                <td>
                                                    <ul className="list-unstyled mb-0">
                                                        {purchase.items.map(item => (
                                                            <li key={item.id} className="small">
                                                                {item.product_name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td>
                                                    <ul className="list-unstyled mb-0">
                                                        {purchase.items.map(item => (
                                                            <li key={item.id} className="small">
                                                                ${parseFloat(item.product_price).toFixed(2)}
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
                                                    ${purchaseTotal.toFixed(2)}
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
                                                            <i className="bi bi-eye"></i>
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