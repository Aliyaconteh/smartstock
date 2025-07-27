import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import API from '../api';

function PurchaseForm() {
    const [products, setProducts] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [items, setItems] = useState([{ product: '', quantity: 1 }]);

    useEffect(() => {
        const fetchProducts = async () => {
            const token = localStorage.getItem('access_token');
            try {
                const res = await axios.get('https://shop-backend-1-nhkz.onrender.com/api/products/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProducts(res.data);
            } catch (error) {
                console.error('Failed to load products:', error);
            }
        };
        fetchProducts();
    }, []);

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value;
        setItems(updatedItems);
    };

    const handleAddItem = () => {
        setItems([...items, { product: '', quantity: 1 }]);
    };

    const handleRemoveItem = (index) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');

        const payload = {
            customer_name: customerName,
            items: items.filter(item => item.product !== '')
        };

        try {
            await API.post('purchase/', payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Purchase Successful!');
            setCustomerName('');
            setItems([{ product: '', quantity: 1 }]);
        } catch (error) {
            console.error('Purchase submission failed:', error.response?.data || error);
            alert('Failed to submit purchase');
        }
    };

    return (
        <div className="d-flex" style={{ fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif` }}>
            <Sidebar />
            <main className="container-fluid mt-3 mt-md-5 px-3 px-md-4" style={{
                marginLeft: '0',
                transition: 'margin-left 0.3s',
                width: '100%',
                maxWidth: '100%'
            }}>
                <div className="card p-3 p-md-4 shadow-sm border rounded-3" style={{
                    maxWidth: '700px',
                    margin: '0 auto',
                    width: '100%'
                }}>
                    <h3 className="mb-4 text-center text-primary">Make a Purchase</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="customer_name" className="form-label fw-semibold">Customer Name</label>
                            <input
                                type="text"
                                name="customer_name"
                                id="customer_name"
                                className="form-control"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                required
                                placeholder="Enter customer name"
                            />
                        </div>

                        <h5 className="text-secondary mb-3">Purchase Items</h5>
                        {items.map((item, index) => (
                            <div key={index} className="row mb-3 g-2 align-items-end">
                                <div className="col-12 col-md-6">
                                    <label className="form-label">Product</label>
                                    <select
                                        className="form-select"
                                        value={item.product}
                                        onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                                        required
                                    >
                                        <option value="">-- Select product --</option>
                                        {products.map((product) => (
                                            <option key={product.id} value={product.id}>
                                                {product.name} (${product.price})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-8 col-md-3">
                                    <label className="form-label">Quantity</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                                        required
                                    />
                                </div>
                                <div className="col-4 col-md-3">
                                    {items.length > 1 && (
                                        <button
                                            type="button"
                                            className="btn btn-danger w-100"
                                            onClick={() => handleRemoveItem(index)}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        <div className="d-flex flex-column flex-md-row justify-content-between mt-3 gap-2">
                            <button
                                type="button"
                                className="btn btn-outline-primary order-2 order-md-1"
                                onClick={handleAddItem}
                            >
                                + Add Another Product
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary fw-semibold order-1 order-md-2"
                            >
                                Submit Purchase
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default PurchaseForm;