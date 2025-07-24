import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { getProducts } from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiBox, FiTrendingUp, } from 'react-icons/fi';
import { BsBoxSeam, BsGraphUp } from 'react-icons/bs';

function Dashboard() {
    const [adminName, setAdminName] = useState('');
    const [totalProducts, setTotalProducts] = useState(0);
    const [recentProducts, setRecentProducts] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) return;

            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setAdminName(payload.username || payload.email || 'Admin');

                const res = await getProducts();
                const products = Array.isArray(res.data) ? res.data : res.data.results || [];

                setTotalProducts(products.length);
                setRecentProducts(products.slice(-5).reverse());

                const categoryCount = {};
                products.forEach((product) => {
                    categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
                });

                const formattedCategoryData = Object.keys(categoryCount).map((cat) => ({
                    category: cat,
                    count: categoryCount[cat],
                }));

                setCategoryData(formattedCategoryData);
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="d-flex" style={{ minHeight: '100vh' }}>
                <Sidebar />
                <div className="d-flex justify-content-center align-items-center" style={{ flex: 1, marginLeft: '220px' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex" style={{ minHeight: '100vh', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            <Sidebar />

            <main style={{ flex: 1, marginLeft: '220px', padding: '2rem' }}>
                <div className="mb-4">
                    <h1 className="text-primary mb-2">Welcome back, <span className="fw-bold">{adminName}</span></h1>
                    <p className="text-muted">Here's what's happening with your inventory today</p>
                </div>

                {/* Stats Cards */}
                <div className="row mb-4 g-4">
                    <div className="col-md-6 col-lg-3">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="bg-primary bg-opacity-10 p-3 rounded me-3">
                                        <FiBox size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <h6 className="mb-1 text-muted">Total Products</h6>
                                        <h3 className="mb-0 fw-bold">{totalProducts}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-3">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="bg-success bg-opacity-10 p-3 rounded me-3">
                                        <FiTrendingUp size={24} className="text-success" />
                                    </div>
                                    <div>
                                        <h6 className="mb-1 text-muted">Categories</h6>
                                        <h3 className="mb-0 fw-bold">{categoryData.length}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts and Recent Products */}
                <div className="row g-4">
                    <div className="col-lg-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white border-0 pt-3">
                                <h5 className="d-flex align-items-center">
                                    <BsBoxSeam className="me-2 text-primary" />
                                    Recent Products
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="list-group list-group-flush">
                                    {recentProducts.map((prod) => (
                                        <div key={prod.id} className="list-group-item border-0 px-0 py-2">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6 className="mb-1 fw-semibold">{prod.name}</h6>
                                                    <small className="text-muted">{prod.category}</small>
                                                </div>
                                                <span className="badge bg-primary bg-opacity-10 text-primary">
                                                    ${parseFloat(prod.price).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white border-0 pt-3">
                                <h5 className="d-flex align-items-center">
                                    <BsGraphUp className="me-2 text-primary" />
                                    Products by Category
                                </h5>
                            </div>
                            <div className="card-body">
                                <div style={{ height: '300px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={categoryData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis
                                                dataKey="category"
                                                tick={{ fontSize: 12 }}
                                                tickMargin={10}
                                            />
                                            <YAxis
                                                allowDecimals={false}
                                                tick={{ fontSize: 12 }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                                }}
                                            />
                                            <Bar
                                                dataKey="count"
                                                fill="#6366f1"
                                                radius={[4, 4, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;