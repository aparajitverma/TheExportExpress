import React from 'react';
import { Link } from 'react-router-dom';

export default function Phase2() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Phase 2: Host → Port</h1>
        <p className="text-gray-300">Export Processing</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link to="/admin/orders" className="block rounded-lg border border-gray-700 bg-gray-800/50 p-4 hover:border-blue-500/60 hover:bg-gray-800/80 transition-colors">Orders</Link>
        <Link to="/admin/payments" className="block rounded-lg border border-gray-700 bg-gray-800/50 p-4 hover:border-blue-500/60 hover:bg-gray-800/80 transition-colors">Payments</Link>
        <Link to="/admin/shipment-tracking" className="block rounded-lg border border-gray-700 bg-gray-800/50 p-4 hover:border-blue-500/60 hover:bg-gray-800/80 transition-colors">Packing & Documents</Link>
        <Link to="/admin/trade-analytics" className="block rounded-lg border border-gray-700 bg-gray-800/50 p-4 hover:border-blue-500/60 hover:bg-gray-800/80 transition-colors">Pricing & Quotes</Link>
        <Link to="/admin/settings" className="block rounded-lg border border-gray-700 bg-gray-800/50 p-4 hover:border-blue-500/60 hover:bg-gray-800/80 transition-colors">Compliance & Templates</Link>
      </div>
    </div>
  );
}


