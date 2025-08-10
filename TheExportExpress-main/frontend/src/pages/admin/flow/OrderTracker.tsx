import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl } from '../../../config';

type OrderItem = {
  _id: string;
  quantity: number;
  price: number;
  product?: { name?: string };
  vendor?: { name?: string; companyName?: string };
};

type Shipment = {
  _id: string;
  carrier?: string;
  trackingNumber?: string;
  status?: string;
  estimatedDeparture?: string;
  estimatedArrival?: string;
  trackingUrl?: string;
};

type Order = {
  _id: string;
  orderNumber: string;
  customerName: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  finalAmount: number;
  currency: string;
  items: OrderItem[];
  shipments: Shipment[];
  createdAt: string;
  updatedAt: string;
};

const phaseTitles = [
  { key: 'phase1', title: 'Phase 1: Vendor → Host', subtitle: 'India Collection' },
  { key: 'phase2', title: 'Phase 2: Host → Port', subtitle: 'Export Processing' },
  { key: 'phase3', title: 'Phase 3: Port → Port', subtitle: 'International Transit' },
  { key: 'phase4', title: 'Phase 4: Import Processing', subtitle: 'Customs & Clearance' },
  { key: 'phase5', title: 'Phase 5: Port → Client', subtitle: 'Final Delivery' },
];

export default function OrderTracker() {
  const { orderId: routeOrderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [orderIdInput, setOrderIdInput] = useState(routeOrderId || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const pollRef = useRef<number | null>(null);

  const loadOrder = async (id: string) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const base = await getApiUrl();
      const { data } = await axios.get(`${base}/api/orders/${id}`);
      if (data?.success && data?.data) {
        setOrder(data.data as Order);
      } else {
        setError('Order not found');
        setOrder(null);
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load order');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  // initialize from route param
  useEffect(() => {
    if (routeOrderId) {
      setOrderIdInput(routeOrderId);
      loadOrder(routeOrderId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeOrderId]);

  // polling every 8s for live updates
  useEffect(() => {
    if (!order?._id) return;
    if (pollRef.current) window.clearInterval(pollRef.current);
    pollRef.current = window.setInterval(() => loadOrder(order._id), 8000);
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?._id]);

  const currentPhaseIndex = useMemo(() => {
    if (!order) return -1;
    // Simple mapping from statuses to phase progression
    if (order.orderStatus === 'pending') return 0; // Phase 1
    if (order.orderStatus === 'processing') return 1; // Phase 2
    if (order.orderStatus === 'shipped') return 2; // Phase 3
    if (order.orderStatus === 'delivered') return 4; // Phase 5
    return 0;
  }, [order]);

  const handleLoad = () => {
    if (orderIdInput.trim()) {
      // reflect in URL for shareability
      if (!location.pathname.endsWith(orderIdInput.trim())) {
        navigate(`/admin/flow/order-tracker/${orderIdInput.trim()}`);
      }
      loadOrder(orderIdInput.trim());
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Order Tracker</h1>
          <p className="text-gray-300">Monitor a single order across the 5-phase export workflow.</p>
        </div>
        <div className="flex gap-2">
          <input
            className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm w-72"
            placeholder="Enter Order ID"
            value={orderIdInput}
            onChange={(e) => setOrderIdInput(e.target.value)}
          />
          <button
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
            onClick={handleLoad}
            disabled={loading}
          >
            {loading ? 'Loading…' : 'Load'}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded border border-red-500/40 bg-red-900/20 text-red-200 px-4 py-3 text-sm">{error}</div>
      )}

      {order && (
        <div className="space-y-6">
          {/* Order header */}
          <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs text-gray-400">Order</div>
                <div className="text-lg font-semibold">{order.orderNumber} <span className="text-xs text-gray-500">({order._id})</span></div>
              </div>
              <div className="flex gap-3 text-sm">
                <span className="px-2 py-1 rounded bg-gray-700 text-gray-200">Payment: {order.paymentStatus}</span>
                <span className="px-2 py-1 rounded bg-gray-700 text-gray-200">Status: {order.orderStatus}</span>
                <span className="px-2 py-1 rounded bg-gray-700 text-gray-200">Amount: {order.currency} {order.finalAmount}</span>
              </div>
            </div>
          </div>

          {/* Phase stepper */}
          <div className="grid gap-3 sm:grid-cols-5">
            {phaseTitles.map((p, idx) => {
              const active = idx <= currentPhaseIndex;
              return (
                <div key={p.key} className={`rounded-lg border p-3 ${active ? 'border-emerald-500/50 bg-emerald-900/10' : 'border-gray-700 bg-gray-800/30'}`}>
                  <div className="text-xs text-gray-400">{p.subtitle}</div>
                  <div className="text-sm font-medium">{p.title}</div>
                </div>
              );
            })}
          </div>

          {/* Phase sections */}
          <div className="grid gap-4">
            {/* Phase 1: Items & Vendors */}
            <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
              <div className="text-sm font-semibold mb-2">Phase 1 • Items & Vendors</div>
              <div className="text-xs text-gray-400 mb-3">Products and supplier allocation</div>
              <div className="divide-y divide-gray-700/60">
                {order.items?.map((it) => (
                  <div key={it._id} className="py-2 flex items-center justify-between">
                    <div>
                      <div className="text-sm">{it.product?.name || 'Product'}</div>
                      <div className="text-xs text-gray-400">Vendor: {it.vendor?.companyName || it.vendor?.name || 'N/A'}</div>
                    </div>
                    <div className="text-sm text-gray-300">Qty: {it.quantity} • Price: {order.currency} {it.price}</div>
                  </div>
                ))}
                {!order.items?.length && <div className="text-sm text-gray-400 py-2">No items</div>}
              </div>
            </div>

            {/* Phase 2: Processing & Docs */}
            <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
              <div className="text-sm font-semibold mb-2">Phase 2 • Export Processing</div>
              <div className="text-xs text-gray-400 mb-3">Order processing, payments and document prep</div>
              <div className="text-sm text-gray-300">Payment Status: {order.paymentStatus}</div>
              <div className="text-sm text-gray-300">Order Status: {order.orderStatus}</div>
            </div>

            {/* Phase 3: Transit & Tracking */}
            <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
              <div className="text-sm font-semibold mb-2">Phase 3 • International Transit</div>
              <div className="text-xs text-gray-400 mb-3">Shipments, routing and live tracking</div>
              <div className="space-y-2">
                {order.shipments?.map((s) => (
                  <div key={s._id} className="rounded border border-gray-700 p-3">
                    <div className="text-sm">{s.carrier || 'Carrier'} • {s.trackingNumber || 'No Tracking'}</div>
                    <div className="text-xs text-gray-400">Status: {s.status || '—'}</div>
                    <div className="text-xs text-gray-400">ETA: {s.estimatedArrival || '—'}</div>
                    {s.trackingUrl && (
                      <a href={s.trackingUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-400 underline">
                        Open tracking
                      </a>
                    )}
                  </div>
                ))}
                {!order.shipments?.length && <div className="text-sm text-gray-400">No shipments</div>}
              </div>
            </div>

            {/* Phase 4: Import/Customs */}
            <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
              <div className="text-sm font-semibold mb-2">Phase 4 • Import Processing</div>
              <div className="text-xs text-gray-400 mb-3">Customs, duties and destination handling</div>
              <div className="text-sm text-gray-300">Customs Status: derived from shipment status</div>
            </div>

            {/* Phase 5: Final Delivery */}
            <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
              <div className="text-sm font-semibold mb-2">Phase 5 • Final Delivery</div>
              <div className="text-xs text-gray-400 mb-3">Last mile delivery and closure</div>
              <div className="text-sm text-gray-300">Delivered if order status is delivered</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


