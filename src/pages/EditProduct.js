import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';

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
    const { id } = useParams();
    const navigate = useNavigate();

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
            <div className="container mt-4 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading product details...</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-lg-8">
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
                                        rows="3"
                                        name="description"
                                        value={product.description}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
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
                                    <div className="col-md-6 mb-3">
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

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label text-muted">Expiry Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="expiry_date"
                                            value={product.expiry_date}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
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

                                <div className="d-flex justify-content-between mt-4">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => navigate('/products')}
                                    >
                                        <i className="bi bi-x-circle me-1"></i>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        <i className="bi bi-check-circle me-1"></i>
                                        Update Product
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditProduct;