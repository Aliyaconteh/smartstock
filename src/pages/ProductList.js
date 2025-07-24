import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import Sidebar from '../components/Sidebar';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-2 bg-light min-vh-100 p-0">
                        <Sidebar />
                    </div>
                    <div className="col-md-10 p-4 text-center">
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
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2 bg-light min-vh-100 p-0">
                    <Sidebar />
                </div>

                <div className="col-md-10 p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2>Product List</h2>
                        {/* Removed the Add Product button */}
                    </div>

                    <div className="mb-3">
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="bi bi-search"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by name, description or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="alert alert-info">
                            {searchTerm ? 'No products match your search.' : 'No products available.'}
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                <thead className="table-light">
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Expiry Date</th>
                                    <th>Category</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredProducts.map(product => {
                                    const expired = isProductExpired(product.expiry_date);
                                    return (
                                        <tr key={product.id} className={expired ? 'table-danger' : ''}>
                                            <td>{product.name}</td>
                                            <td>{product.description}</td>
                                            <td>${parseFloat(product.price).toFixed(2)}</td>
                                            <td>{product.quantity}</td>
                                            <td className={expired ? 'fw-bold' : ''}>
                                                {product.expiry_date}
                                                {expired && <span className="badge bg-danger ms-2">Expired</span>}
                                            </td>
                                            <td>{product.category}</td>
                                            <td>
                                                <div className="d-flex">
                                                    <Link
                                                        to={`/view/${product.id}`}
                                                        className="btn btn-sm btn-info me-2">
                                                        <i className="bi bi-eye"></i>
                                                    </Link>
                                                    <Link
                                                        to={`/edit/${product.id}`}
                                                        className="btn btn-sm btn-warning me-2">
                                                        <i className="bi bi-pencil"></i>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="btn btn-sm btn-danger">
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
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductList;