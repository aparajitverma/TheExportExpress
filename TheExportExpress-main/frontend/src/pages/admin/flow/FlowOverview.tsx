import React from 'react';
import { Link } from 'react-router-dom';

export default function FlowOverview() {
  const phases = [
    {
      path: '/admin/flow/phase-1',
      title: 'Phase 1: Vendor → Host',
      subtitle: 'India Collection',
      desc: 'Onboard suppliers, curate products, prepare catalog and pricing.',
    },
    {
      path: '/admin/flow/phase-2',
      title: 'Phase 2: Host → Port',
      subtitle: 'Export Processing',
      desc: 'Confirm orders, documents, packing, and export readiness.',
    },
    {
      path: '/admin/flow/phase-3',
      title: 'Phase 3: Port → Port',
      subtitle: 'International Transit',
      desc: 'Manage shipments, routing, tracking, and exceptions.',
    },
    {
      path: '/admin/flow/phase-4',
      title: 'Phase 4: Import Processing',
      subtitle: 'Customs & Clearance',
      desc: 'Coordinate customs, duties, compliance and destination handling.',
    },
    {
      path: '/admin/flow/phase-5',
      title: 'Phase 5: Port → Client',
      subtitle: 'Final Delivery',
      desc: 'Last-mile delivery, handover, invoices, and closure.',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">International Export Flow</h1>
      <p className="text-gray-300">
        Follow the unified 5-phase workflow. Each phase aggregates the relevant tools and pages.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {phases.map((p) => (
          <Link
            key={p.path}
            to={p.path}
            className="block rounded-lg border border-gray-700 bg-gray-800/50 p-4 hover:border-blue-500/60 hover:bg-gray-800/80 transition-colors"
          >
            <div className="text-sm text-gray-400">{p.subtitle}</div>
            <div className="mt-1 text-lg font-medium">{p.title}</div>
            <div className="mt-2 text-sm text-gray-400">{p.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}


