import React from 'react';
import { Link } from 'react-router-dom';

export default function Phase4() {
  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 600 }}>Phase 4: Import Processing</h1>
      <p style={{ color: '#A0AEC0' }}>Customs & Clearance</p>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', marginTop: 16 }}>
        <Link to="/orders">Customs Status</Link>
        <Link to="/settings">Compliance Docs</Link>
        <Link to="/suppliers">Broker Coordination</Link>
      </div>
    </div>
  );
}


