const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Basic routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'ExportExpressPro Website Integration Service',
    status: 'running',
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  // Handle real-time updates
  socket.on('price_update', (data) => {
    console.log('Price update received:', data);
    // Broadcast to all connected clients
    io.emit('price_update', data);
  });

  socket.on('arbitrage_opportunity', (data) => {
    console.log('Arbitrage opportunity received:', data);
    io.emit('arbitrage_opportunity', data);
  });

  socket.on('order_status_update', (data) => {
    console.log('Order status update received:', data);
    io.emit('order_status_update', data);
  });

  socket.on('market_alert', (data) => {
    console.log('Market alert received:', data);
    io.emit('market_alert', data);
  });
});

// Mock API endpoints for development
app.get('/api/products', (req, res) => {
  res.json({
    products: [
      {
        id: 'product_001',
        name: 'Premium Kashmiri Saffron',
        category: 'spices',
        pricing: {
          current_price: 2800,
          predicted_price: 3200
        },
        inventory: {
          available: 500
        }
      }
    ]
  });
});

app.get('/api/orders', (req, res) => {
  res.json({
    orders: [
      {
        id: 'order_001',
        order_number: 'EXP-2024-001',
        client: {
          company_name: 'US Natural Products Inc'
        },
        status_tracking: {
          current_status: 'processing'
        }
      }
    ]
  });
});

app.get('/api/predictions', (req, res) => {
  res.json({
    predictions: [
      {
        product_id: 'product_001',
        predictions: {
          price_3_days: {
            value: 3200,
            confidence: 0.85
          }
        },
        arbitrage_opportunities: [
          {
            market: 'US',
            net_profit: 1000,
            confidence: 0.85
          }
        ]
      }
    ]
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Website integration service running on port ${PORT}`);
  console.log(`WebSocket server ready for connections`);
});
