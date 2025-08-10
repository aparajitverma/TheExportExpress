import React from 'react';
import { Link } from 'react-router-dom';

export default function Phase2() {
  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 600 }}>Phase 2: Host → Port</h1>
      <p style={{ color: '#A0AEC0' }}>Export Processing</p>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', marginTop: 16 }}>
        <Link to="/orders">Orders</Link>
        <Link to="/orders">Packing & Docs</Link>
        <Link to="/market-intelligence">Pricing & Quotes</Link>
        <Link to="/settings">Compliance</Link>
      </div>
    </div>
  );
}


