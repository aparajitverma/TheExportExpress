import React from 'react';
import { Link } from 'react-router-dom';

export default function Phase1() {
  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 600 }}>Phase 1: Vendor → Host</h1>
      <p style={{ color: '#A0AEC0' }}>India Collection</p>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', marginTop: 16 }}>
        <Link to="/suppliers">Suppliers</Link>
        <Link to="/products">Products</Link>
        <Link to="/market-intelligence">Market Intelligence</Link>
        <Link to="/orders">Inquiries</Link>
      </div>
    </div>
  );
}


