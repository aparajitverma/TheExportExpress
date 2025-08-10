import React from 'react';
import { Link } from 'react-router-dom';

export default function Phase1() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Phase 1: Vendor → Host</h1>
        <p className="text-gray-300">India Collection</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link to="/admin/vendors" className="block rounded-lg border border-gray-700 bg-gray-800/50 p-4 hover:border-blue-500/60 hover:bg-gray-800/80 transition-colors">Vendors</Link>
        <Link to="/admin/products" className="block rounded-lg border border-gray-700 bg-gray-800/50 p-4 hover:border-blue-500/60 hover:bg-gray-800/80 transition-colors">Products</Link>
        <Link to="/admin/categories" className="block rounded-lg border border-gray-700 bg-gray-800/50 p-4 hover:border-blue-500/60 hover:bg-gray-800/80 transition-colors">Categories</Link>
        <Link to="/admin/bulk-import" className="block rounded-lg border border-gray-700 bg-gray-800/50 p-4 hover:border-blue-500/60 hover:bg-gray-800/80 transition-colors">Bulk Import</Link>
        <Link to="/admin/trade-analytics" className="block rounded-lg border border-gray-700 bg-gray-800/50 p-4 hover:border-blue-500/60 hover:bg-gray-800/80 transition-colors">Market Intelligence</Link>
        <Link to="/admin/inquiries" className="block rounded-lg border border-gray-700 bg-gray-800/50 p-4 hover:border-blue-500/60 hover:bg-gray-800/80 transition-colors">Inquiries</Link>
      </div>
    </div>
  );
}


