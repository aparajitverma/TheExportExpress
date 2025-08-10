import React from 'react';
import { Link } from 'react-router-dom';

export default function Phase3() {
  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 600 }}>Phase 3: Port → Port</h1>
      <p style={{ color: '#A0AEC0' }}>International Transit</p>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', marginTop: 16 }}>
        <Link to="/orders">Shipment Tracking</Link>
        <Link to="/suppliers">Logistics Partners</Link>
        <Link to="/market-intelligence">Risk & ETA Analysis</Link>
      </div>
    </div>
  );
}


