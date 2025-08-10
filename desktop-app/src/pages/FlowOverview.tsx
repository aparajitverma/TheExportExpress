import React from 'react';
import { Link } from 'react-router-dom';

export default function FlowOverview() {
  const phases = [
    { path: '/phase-1', title: 'Phase 1: Vendor → Host', subtitle: 'India Collection' },
    { path: '/phase-2', title: 'Phase 2: Host → Port', subtitle: 'Export Processing' },
    { path: '/phase-3', title: 'Phase 3: Port → Port', subtitle: 'International Transit' },
    { path: '/phase-4', title: 'Phase 4: Import Processing', subtitle: 'Customs & Clearance' },
    { path: '/phase-5', title: 'Phase 5: Port → Client', subtitle: 'Final Delivery' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">International Export Flow</h1>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', marginTop: 16 }}>
        {phases.map(p => (
          <Link key={p.path} to={p.path} style={{ padding: 16, borderRadius: 12, border: '1px solid #2D3748', background: '#1A202C', color: '#E2E8F0', textDecoration: 'none' }}>
            <div style={{ fontSize: 12, color: '#A0AEC0' }}>{p.subtitle}</div>
            <div style={{ marginTop: 6, fontSize: 18, fontWeight: 600 }}>{p.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}


