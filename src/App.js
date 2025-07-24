import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { setAuthToken } from './api'; // ✅ import this

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import PrivateRoute from './components/PrivateRoute';
import ViewProduct from './pages/ViewProduct';
import PurchaseForm from './components/PurchaseForm';
import PurchaseList from './pages/PurchaseList';
import PurchaseView from './pages/PurchaseView';

function App() {
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            setAuthToken(token); // ✅ apply the token globally
        }
    }, []);

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/purchases" element={<PurchaseList />} />
            <Route path="/purchase/view/:id" element={<PurchaseView />} />
            <Route path="/view/:id" element={<ViewProduct />} />
            <Route path="/edit/:id" element={<EditProduct />} />

            <Route
                path="/dashboard"
                element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                }
            />
            <Route
                path="/products"
                element={
                    <PrivateRoute>
                        <ProductList />
                    </PrivateRoute>
                }
            />
            <Route
                path="/products/add"
                element={
                    <PrivateRoute>
                        <AddProduct />
                    </PrivateRoute>
                }
            />
            <Route
                path="/products/edit/:id"
                element={
                    <PrivateRoute>
                        <EditProduct />
                    </PrivateRoute>
                }
            />
            <Route path="/products/view/:id" element={<ViewProduct />} />
            <Route
                path="/purchase/new"
                element={
                    <PrivateRoute>
                        <PurchaseForm />
                    </PrivateRoute>
                }
            />
        </Routes>
    );
}

export default App;
