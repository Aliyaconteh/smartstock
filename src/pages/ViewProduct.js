import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { FiArrowLeft } from 'react-icons/fi';

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

    const formatCurrency = (amount) => {
        return `SLL ${parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    };

    if (isLoading) return (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading product details...</p>
        </div>
    );

    if (!product) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="alert alert-danger">Product not found</div>
        </div>
    );

    return (
        <div className="container py-4">
            <div className="card shadow-sm">
                <div className="card-header bg-light d-flex align-items-center py-3">
                    <button
                        onClick={() => navigate('/products')}
                        className="btn btn-sm btn-outline-secondary me-3"
                        title="Back to Products"
                    >
                        <FiArrowLeft size={18} />
                    </button>
                    <h2 className="mb-0 flex-grow-1 text-center">Product Details</h2>
                </div>

                <div className="card-body p-4">
                    <div className="row mb-4">
                        <div className="col-12 col-md-6 mb-3 mb-md-0">
                            <h5 className="fw-bold">{product.name}</h5>
                            <p className="text-muted">{product.description || 'No description available'}</p>
                        </div>
                        <div className="col-12 col-md-6">
                            <span className={`badge ${product.available === 'Available' ? 'bg-success' : 'bg-danger'} fs-6`}>
                                {product.available}
                            </span>
                        </div>
                    </div>

                    <div className="row g-3">
                        <div className="col-12 col-sm-6 col-md-3">
                            <div className="p-3 border rounded">
                                <h6 className="text-muted small">Price</h6>
                                <h5 className="mb-0">{formatCurrency(product.price)}</h5>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-md-3">
                            <div className="p-3 border rounded">
                                <h6 className="text-muted small">Quantity</h6>
                                <h5 className="mb-0">{product.quantity}</h5>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-md-3">
                            <div className="p-3 border rounded">
                                <h6 className="text-muted small">Category</h6>
                                <h5 className="mb-0">{product.category || '-'}</h5>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-md-3">
                            <div className="p-3 border rounded">
                                <h6 className="text-muted small">Expiry Date</h6>
                                <h5 className="mb-0">
                                    {product.expiry_date ? new Date(product.expiry_date).toLocaleDateString() : '-'}
                                </h5>
                            </div>
                        </div>
                    </div>

                    {/* Additional details can be added here */}
                    <div className="mt-4 pt-3 border-top">
                        <h6 className="text-muted mb-3">Additional Information</h6>
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <p><strong>Created At:</strong> {new Date(product.created_at).toLocaleString()}</p>
                            </div>
                            <div className="col-12 col-md-6">
                                <p><strong>Last Updated:</strong> {new Date(product.updated_at).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-footer bg-light d-flex justify-content-end py-3">
                    <button
                        className="btn btn-primary me-2"
                        onClick={() => navigate(`/products/edit/${id}`)}
                    >
                        Edit Product
                    </button>
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate('/products')}
                    >
                        Back to List
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ViewProduct;