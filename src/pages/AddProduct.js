import React, { useState } from 'react';
import { createProduct } from '../api';
import { FiPlusCircle, FiDollarSign, FiBox, FiCalendar, FiTag, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // 👈 Import Sidebar here

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
    const navigate = useNavigate();

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
        } catch (error) {
            console.error(error);
            alert('Failed to add product');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="d-flex">
            <Sidebar /> {/* 👈 Sidebar on the left */}

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white border-bottom-0 pb-0">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <div className="d-flex align-items-center">
                                            <FiPlusCircle className="text-primary me-2" size={24} />
                                            <h4 className="mb-0 text-primary">Add New Product</h4>
                                        </div>
                                        <p className="text-muted mt-2">Fill in the product details below</p>
                                    </div>
                                    <button
                                        onClick={() => navigate(-1)}
                                        className="btn btn-sm btn-outline-secondary"
                                    >
                                        <FiArrowLeft className="me-1" />
                                        Back
                                    </button>
                                </div>
                            </div>

                            <div className="card-body pt-0">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
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

                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">Description</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Enter product description"
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="row g-3 mb-4">
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Price</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light">
                                                    <FiDollarSign className="text-muted" />
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
                                        <div className="col-md-6">
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

                                    <div className="row g-3 mb-4">
                                        <div className="col-md-6">
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
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
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

                                    <div className="d-flex justify-content-between mt-4">
                                        <button
                                            type="button"
                                            onClick={() => navigate(-1)}
                                            className="btn btn-outline-secondary"
                                        >
                                            <FiArrowLeft className="me-1" />
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
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
            </div>
        </div>
    );
};

export default AddProduct;
