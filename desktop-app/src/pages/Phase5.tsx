import React from 'react';
import { Link } from 'react-router-dom';

export default function Phase5() {
  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 600 }}>Phase 5: Port → Client</h1>
      <p style={{ color: '#A0AEC0' }}>Final Delivery</p>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', marginTop: 16 }}>
        <Link to="/orders">Delivery Orders</Link>
        <Link to="/orders">Invoice & Settlement</Link>
        <Link to="/suppliers">Last-mile Partners</Link>
        <Link to="/orders">SLA & Feedback</Link>
      </div>
    </div>
  );
}


