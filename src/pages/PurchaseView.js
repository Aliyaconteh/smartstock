import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import logo from '../assets/smartstock-logo.jpg';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const PurchaseView = () => {
    const { id } = useParams();
    const [purchase, setPurchase] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const receiptRef = useRef();

    useEffect(() => {
        const fetchPurchase = async () => {
            try {
                const res = await API.get(`purchase/${id}/`);
                setPurchase(res.data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch purchase', error);
                setLoading(false);
            }
        };
        fetchPurchase();
    }, [id]);

    const exportToPDF = () => {
        if (!purchase) return;

        const doc = new jsPDF();

        // Add logo
        const logoImg = new Image();
        logoImg.src = logo;
        doc.addImage(logoImg, 'JPEG', 15, 10, 30, 20);

        // Header
        doc.setFontSize(16);
        doc.text('Purchase Receipt', 105, 20, { align: 'center' });
        doc.setFontSize(10);
        doc.text(`Receipt #: ${purchase.id}`, 15, 40);
        doc.text(`Date: ${new Date(purchase.purchase_date).toLocaleDateString()}`, 15, 45);

        // Customer Info
        doc.setFontSize(12);
        doc.text('Customer Information:', 15, 60);
        doc.setFontSize(10);
        doc.text(`Name: ${purchase.customer_name}`, 15, 65);

        // Items table
        const items = purchase.items.map(item => [
            item.product_name,
            `$${parseFloat(item.product_price).toFixed(2)}`,
            item.quantity,
            `$${parseFloat(item.total_price).toFixed(2)}`
        ]);

        doc.autoTable({
            startY: 75,
            head: [['Product', 'Unit Price', 'Quantity', 'Total']],
            body: items,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185] }
        });

        // Total
        const totalAmount = purchase.items.reduce(
            (acc, item) => acc + parseFloat(item.total_price || 0),
            0
        );

        doc.setFontSize(12);
        doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 15, doc.lastAutoTable.finalY + 15);

        // Footer
        doc.setFontSize(10);
        doc.text('Thank you for your purchase!', 105, doc.lastAutoTable.finalY + 25, { align: 'center' });
        doc.text('SmartStock Inventory System', 105, doc.lastAutoTable.finalY + 30, { align: 'center' });

        doc.save(`purchase-receipt-${purchase.id}.pdf`);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading purchase details...</p>
                </div>
            </div>
        );
    }

    if (!purchase) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="alert alert-danger">
                    Failed to load purchase details. Please try again.
                </div>
            </div>
        );
    }

    const totalAmount = purchase.items?.reduce(
        (acc, item) => acc + parseFloat(item.total_price || 0),
        0
    );

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm" ref={receiptRef}>
                        <div className="card-header bg-light d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">Purchase Receipt</h4>
                            <div>
                                <button
                                    className="btn btn-sm btn-outline-primary me-2"
                                    onClick={exportToPDF}
                                >
                                    <i className="bi bi-file-earmark-pdf me-1"></i> Export PDF
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => navigate(-1)}
                                >
                                    <i className="bi bi-arrow-left me-1"></i> Back
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="text-center mb-4">
                                <img src={logo} alt="SmartStock Logo" style={{ height: '80px' }} />
                                <h5 className="mt-3">SmartStock Purchase Receipt</h5>
                                <p className="text-muted">Receipt #: {purchase.id}</p>
                            </div>

                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <div className="border p-3 rounded">
                                        <h6 className="border-bottom pb-2">Customer Information</h6>
                                        <p className="mb-1"><strong>Name:</strong> {purchase.customer_name}</p>
                                        <p className="mb-0"><strong>Date:</strong> {new Date(purchase.purchase_date).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="border p-3 rounded">
                                        <h6 className="border-bottom pb-2">Purchase Summary</h6>
                                        <p className="mb-1"><strong>Items:</strong> {purchase.items?.length}</p>
                                        <p className="mb-0"><strong>Total:</strong> ${totalAmount.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>

                            <h6 className="mb-3">Items Purchased</h6>
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead className="table-light">
                                    <tr>
                                        <th>Product</th>
                                        <th>Unit Price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {purchase.items?.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.product_name}</td>
                                            <td>${parseFloat(item.product_price).toFixed(2)}</td>
                                            <td>{item.quantity}</td>
                                            <td>${parseFloat(item.total_price).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="d-flex justify-content-end mt-4">
                                <div className="border-top pt-3" style={{ width: '300px' }}>
                                    <div className="d-flex justify-content-between">
                                        <span className="fw-bold">Subtotal:</span>
                                        <span>${totalAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="fw-bold">Tax:</span>
                                        <span>$0.00</span>
                                    </div>
                                    <div className="d-flex justify-content-between mt-2">
                                        <span className="fw-bold fs-5">Total:</span>
                                        <span className="fw-bold fs-5 text-success">${totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 pt-3 border-top text-center text-muted small">
                                <p>Thank you for your purchase!</p>
                                <p className="mb-0">SmartStock Inventory System</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseView;