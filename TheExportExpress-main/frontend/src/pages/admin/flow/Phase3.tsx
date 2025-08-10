import React from 'react';
import { Link } from 'react-router-dom';

export default function Phase3() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Phase 3: Port → Port</h1>
        <p className="text-gray-300">International Transit</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link to="/admin/shipment-tracking" className="block rounded-lg border border-gray-700 bg-gray-800/50 p-4 hover:border-blue-500/60 hover:bg-gray-800/80 transition-colors">Shipment Tracking</Link>
        <Link to="/admin/orders" className="block rounded-lg border border-gray-700 bg-gray-800/50 p-4 hover:border-blue-500/60 hover:bg-gray-800/80 transition-colors">Consolidation & Routing</Link>
        <Link to="/admin/vendors" className="block rounded-lg border border-gray-700 bg-gray-800/50 p-4 hover:border-blue-500/60 hover:bg-gray-800/80 transition-colors">Logistics Partners</Link>
        <Link to="/admin/trade-analytics" className="block rounded-lg border border-gray-700 bg-gray-800/50 p-4 hover:border-blue-500/60 hover:bg-gray-800/80 transition-colors">Risk & ETA Analysis</Link>
      </div>
    </div>
  );
}


