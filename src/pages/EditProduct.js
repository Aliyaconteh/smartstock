import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import Sidebar from '../components/Sidebar';

function EditProduct() {
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        expiry_date: '',
        category: ''
    });

    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('You are not logged in');
            navigate('/login');
        }

        const fetchProduct = async () => {
            try {
                const res = await API.get(`products/${id}/`);
                setProduct(res.data);
                setLoading(false);
            } catch (error) {
                alert('Failed to load product. Please log in again.');
                console.error(error);
                navigate('/');
            }
        };
        fetchProduct();
    }, [id, navigate]);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.put(`products/${id}/`, product);
            alert('Product updated successfully!');
            navigate('/products');
        } catch (error) {
            alert('Failed to update product. Make sure you are authenticated.');
            console.error(error);
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
                        <p className="mt-2">Loading product details...</p>
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
                <div className="card border-light shadow-sm">
                    <div className="card-header bg-light">
                        <h4 className="mb-0 text-primary">
                            <i className="bi bi-pencil-square me-2"></i>
                            Edit Product
                        </h4>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label text-muted">Product Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={product.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-muted">Description</label>
                                <textarea
                                    className="form-control"
                                    rows={isMobile ? "2" : "3"}
                                    name="description"
                                    value={product.description}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="row g-2">
                                <div className="col-12 col-md-6 mb-3">
                                    <label className="form-label text-muted">Price ($)</label>
                                    <div className="input-group">
                                        <span className="input-group-text">$</span>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="price"
                                            value={product.price}
                                            onChange={handleChange}
                                            min="0.01"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 mb-3">
                                    <label className="form-label text-muted">Quantity</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="quantity"
                                        value={product.quantity}
                                        onChange={handleChange}
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="row g-2">
                                <div className="col-12 col-md-6 mb-3">
                                    <label className="form-label text-muted">Expiry Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="expiry_date"
                                        value={product.expiry_date}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-12 col-md-6 mb-3">
                                    <label className="form-label text-muted">Category</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="category"
                                        value={product.category}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="d-flex flex-column flex-md-row justify-content-between mt-4 gap-2">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary order-md-1 order-2"
                                    onClick={() => navigate('/products')}
                                >
                                    <i className="bi bi-x-circle me-1"></i>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary order-md-2 order-1"
                                >
                                    <i className="bi bi-check-circle me-1"></i>
                                    Update Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditProduct;