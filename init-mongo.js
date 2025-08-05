db = db.getSiblingDB('exportpro');

// Create collections with validation
db.createCollection("products", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "category", "pricing", "inventory"],
      properties: {
        name: { bsonType: "string" },
        category: { bsonType: "string" },
        pricing: {
          bsonType: "object",
          required: ["base_cost", "current_price"],
          properties: {
            base_cost: { bsonType: "number" },
            current_price: { bsonType: "number" },
            predicted_price: { bsonType: "number" }
          }
        },
        inventory: {
          bsonType: "object",
          required: ["current_stock", "available"],
          properties: {
            current_stock: { bsonType: "number" },
            reserved: { bsonType: "number" },
            available: { bsonType: "number" }
          }
        }
      }
    }
  }
});

// Create indexes for performance
db.products.createIndex({ "category": 1, "pricing.current_price": 1 });
db.products.createIndex({ "name": "text", "category": "text" });
db.products.createIndex({ "market_intelligence.arbitrage_opportunities.market": 1 });

// Orders collection
db.createCollection("orders", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["order_number", "client", "products", "status_tracking"],
      properties: {
        order_number: { bsonType: "string" },
        status_tracking: {
          bsonType: "object",
          required: ["current_status"],
          properties: {
            current_status: { 
              bsonType: "string",
              enum: ["created", "processing", "sourcing", "documentation", 
                    "shipping", "delivered", "completed", "cancelled"]
            }
          }
        }
      }
    }
  }
});

db.orders.createIndex({ "order_number": 1 }, { unique: true });
db.orders.createIndex({ "status_tracking.current_status": 1 });
db.orders.createIndex({ "client.client_id": 1 });

// Suppliers collection
db.createCollection("suppliers");
db.suppliers.createIndex({ "location.state": 1, "location.district": 1 });
db.suppliers.createIndex({ "products_offered.product_id": 1 });
db.suppliers.createIndex({ "performance_metrics.reliability_score": -1 });

// Market intelligence collection
db.createCollection("market_intelligence");
db.market_intelligence.createIndex({ "product_id": 1, "timestamp": -1 });
db.market_intelligence.createIndex({ "arbitrage_opportunities.target_market": 1 });
db.market_intelligence.createIndex({ "timestamp": -1 });

// User authentication
db.createCollection("users");
db.users.createIndex({ "email": 1 }, { unique: true });

print("Database initialized successfully with collections and indexes"); 