import React, { useState, useEffect } from 'react';
import { createProduct } from '../api';
import { FiPlusCircle, FiBox, FiCalendar, FiTag, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        expiry_date: '',
        category: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createProduct(formData);
            alert('Product added successfully!');
            setFormData({
                name: '',
                description: '',
                price: '',
                quantity: '',
                expiry_date: '',
                category: ''
            });
            navigate('/products');
        } catch (error) {
            console.error(error);
            alert('Failed to add product');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="container-fluid px-3 px-md-4 py-3 py-md-5" style={{
                marginLeft: isMobile ? '0' : '220px',
                width: '100%',
                transition: 'margin-left 0.3s'
            }}>
                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-bottom-0 pb-0">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                            <div>
                                <div className="d-flex align-items-center">
                                    <FiPlusCircle className="text-primary me-2" size={24} />
                                    <h4 className="mb-0 text-primary">Add New Product</h4>
                                </div>
                                <p className="text-muted mt-2">Fill in the product details below</p>
                            </div>
                            <button
                                onClick={() => navigate(-1)}
                                className="btn btn-sm btn-outline-secondary align-self-md-center"
                            >
                                <FiArrowLeft className="me-1" />
                                Back
                            </button>
                        </div>
                    </div>

                    <div className="card-body pt-0">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Product Name</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light">
                                        <FiTag className="text-muted" />
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter product name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Description</label>
                                <textarea
                                    className="form-control"
                                    rows={isMobile ? "2" : "3"}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter product description"
                                    required
                                ></textarea>
                            </div>

                            <div className="row g-2 mb-3">
                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-semibold">Price (SLL)</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light">
                                            SLL
                                        </span>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            placeholder="0.00"
                                            min="0.01"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-semibold">Quantity</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light">
                                            <FiBox className="text-muted" />
                                        </span>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="quantity"
                                            value={formData.quantity}
                                            onChange={handleChange}
                                            placeholder="0"
                                            min="0"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row g-2 mb-4">
                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-semibold">Expiry Date</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light">
                                            <FiCalendar className="text-muted" />
                                        </span>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="expiry_date"
                                            value={formData.expiry_date}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-semibold">Category</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        placeholder="Enter category"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="d-flex flex-column flex-md-row justify-content-between mt-4 gap-2">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="btn btn-outline-secondary order-md-1 order-2"
                                >
                                    <FiArrowLeft className="me-1" />
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary order-md-2 order-1"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <FiPlusCircle className="me-1" />
                                            Add Product
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;