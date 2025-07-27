import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import Sidebar from '../components/Sidebar';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await API.get('products/');
                setProducts(res.data);
                setFilteredProducts(res.data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch products', error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const results = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(results);
    }, [searchTerm, products]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await API.delete(`products/${id}/`);
            setProducts(products.filter(product => product.id !== id));
        } catch (error) {
            console.error('Failed to delete product', error);
        }
    };

    const isProductExpired = (expiryDate) => {
        if (!expiryDate) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(expiryDate) < today;
    };

    // Format price in Leones
    const formatPrice = (price) => {
        return `SLL ${parseFloat(price).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
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
                        <p className="mt-2">Loading products...</p>
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
                    <h2 className="mb-0">Product List</h2>
                    <div className="w-100 w-md-auto">
                        <div className="input-group">
                            <span className="input-group-text bg-white">
                                <i className="bi bi-search"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ minWidth: '200px' }}
                            />
                        </div>
                    </div>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="alert alert-info">
                        {searchTerm ? 'No products match your search.' : 'No products available.'}
                    </div>
                ) : isMobile ? (
                    // Mobile Card View
                    <div className="row g-3">
                        {filteredProducts.map(product => {
                            const expired = isProductExpired(product.expiry_date);
                            return (
                                <div key={product.id} className="col-12">
                                    <div className={`card shadow-sm h-100 ${expired ? 'border-danger' : ''}`}>
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <h5 className="card-title mb-0">
                                                    {product.name}
                                                    {expired && (
                                                        <span className="badge bg-danger ms-2">Expired</span>
                                                    )}
                                                </h5>
                                                <span className="badge bg-primary fs-6">
                                                    {formatPrice(product.price)}
                                                </span>
                                            </div>

                                            <p className="text-muted small mb-2">
                                                <i className="bi bi-tag me-1"></i>
                                                {product.category}
                                            </p>

                                            <p className="card-text small mb-2">
                                                {product.description}
                                            </p>

                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <div>
                                                    <i className="bi bi-box-seam me-1"></i>
                                                    <strong>Qty:</strong> {product.quantity}
                                                </div>
                                                {product.expiry_date && (
                                                    <div className={expired ? 'text-danger' : ''}>
                                                        <i className="bi bi-calendar-x me-1"></i>
                                                        {product.expiry_date}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="d-flex justify-content-end gap-2 mt-3">
                                                <Link
                                                    to={`/view/${product.id}`}
                                                    className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                                >
                                                    <i className="bi bi-eye me-1"></i> View
                                                </Link>
                                                <Link
                                                    to={`/edit/${product.id}`}
                                                    className="btn btn-sm btn-outline-warning d-flex align-items-center"
                                                >
                                                    <i className="bi bi-pencil me-1"></i> Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="btn btn-sm btn-outline-danger d-flex align-items-center"
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
                                        <th style={{ width: '15%' }}>Name</th>
                                        <th style={{ width: '25%' }}>Description</th>
                                        <th style={{ width: '10%' }}>Price (SLL)</th>
                                        <th style={{ width: '8%' }}>Qty</th>
                                        <th style={{ width: '12%' }}>Expiry Date</th>
                                        <th style={{ width: '10%' }}>Category</th>
                                        <th style={{ width: '20%' }}>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredProducts.map(product => {
                                        const expired = isProductExpired(product.expiry_date);
                                        return (
                                            <tr key={product.id} className={expired ? 'table-danger' : ''}>
                                                <td className="fw-semibold">{product.name}</td>
                                                <td className="text-truncate" style={{ maxWidth: '200px' }}>
                                                    {product.description}
                                                </td>
                                                <td className="fw-bold">
                                                    {formatPrice(product.price)}
                                                </td>
                                                <td>{product.quantity}</td>
                                                <td className={expired ? 'fw-bold text-danger' : ''}>
                                                    {product.expiry_date}
                                                    {expired && <span className="badge bg-danger ms-2">Expired</span>}
                                                </td>
                                                <td>{product.category}</td>
                                                <td>
                                                    <div className="d-flex">
                                                        <Link
                                                            to={`/view/${product.id}`}
                                                            className="btn btn-sm btn-outline-primary me-2"
                                                        >
                                                            <i className="bi bi-eye"></i>
                                                        </Link>
                                                        <Link
                                                            to={`/edit/${product.id}`}
                                                            className="btn btn-sm btn-outline-warning me-2"
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(product.id)}
                                                            className="btn btn-sm btn-outline-danger"
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
}

export default ProductList;