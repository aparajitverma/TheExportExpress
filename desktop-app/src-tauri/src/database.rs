use mongodb::bson::{doc, DateTime};
use mongodb::{Client, Collection};
use serde_json::Value;
use std::error::Error;
use std::sync::Arc;
use futures_util::StreamExt;
use chrono::{Utc, Datelike};

#[derive(Clone, Debug)]
pub struct Database {
    client: Client,
    db: Arc<mongodb::Database>,
}

impl Database {
    pub fn new(connection_string: &str) -> Result<Self, Box<dyn Error>> {
        let rt = tokio::runtime::Runtime::new()?;
        
        let client = rt.block_on(async {
            Client::with_uri_str(connection_string).await
        })?;
        
        let db = client.database("exportpro");
        
        Ok(Database { client, db: Arc::new(db) })
    }
    
    // Product Management
    pub async fn get_products(&self, category: Option<String>) -> Result<Vec<Value>, Box<dyn Error>> {
        let collection: Collection<Value> = self.db.collection("products");
        
        let filter = if let Some(cat) = category {
            doc! { "category": cat, "inventory.available": { "$gt": 0 } }
        } else {
            doc! { "inventory.available": { "$gt": 0 } }
        };
        
        let mut cursor = collection.find(filter, None).await?;
        let mut products = Vec::new();
        
        while let Some(doc) = cursor.next().await {
            products.push(doc?);
        }
        
        Ok(products)
    }
    
    pub async fn create_product(&self, product: Value) -> Result<String, Box<dyn Error>> {
        let collection: Collection<Value> = self.db.collection("products");
        let result = collection.insert_one(product, None).await?;
        Ok(result.inserted_id.to_string())
    }
    
    // Order Management
    pub async fn get_orders(&self, status: Option<String>) -> Result<Vec<Value>, Box<dyn Error>> {
        let collection: Collection<Value> = self.db.collection("orders");
        
        let filter = if let Some(status_filter) = status {
            doc! { "status_tracking.current_status": status_filter }
        } else {
            doc! {}
        };
        
        let options = mongodb::options::FindOptions::builder()
            .sort(doc! { "created_at": -1 })
            .build();
        
        let mut cursor = collection.find(filter, options).await?;
        let mut orders = Vec::new();
        
        while let Some(doc) = cursor.next().await {
            orders.push(doc?);
        }
        
        Ok(orders)
    }
    
    pub async fn create_order(&self, order: Value) -> Result<String, Box<dyn Error>> {
        let collection: Collection<Value> = self.db.collection("orders");
        
        // Generate order number
        let order_number = self.generate_order_number().await?;
        
        // Add metadata to order
        let mut order_with_metadata = order.as_object().unwrap().clone();
        order_with_metadata.insert("order_number".to_string(), Value::String(order_number));
        order_with_metadata.insert("created_at".to_string(), Value::String(Utc::now().to_rfc3339()));
        
        let result = collection.insert_one(Value::Object(order_with_metadata), None).await?;
        Ok(result.inserted_id.to_string())
    }
    
    pub async fn update_order_status(&self, order_id: &str, status: &str) -> Result<(), Box<dyn Error>> {
        let collection: Collection<Value> = self.db.collection("orders");
        
        let update = doc! {
            "$set": {
                "status_tracking.current_status": status,
                "status_tracking.status_history": {
                    "$push": {
                        "status": status,
                        "timestamp": DateTime::now(),
                        "notes": format!("Status updated to {}", status)
                    }
                }
            }
        };
        
        let filter = doc! { "_id": order_id };
        collection.update_one(filter, update, None).await?;
        
        Ok(())
    }
    
    async fn generate_order_number(&self) -> Result<String, Box<dyn Error>> {
        let collection: Collection<Value> = self.db.collection("orders");
        
        // Get the latest order number
        let options = mongodb::options::FindOptions::builder()
            .sort(doc! { "order_number": -1 })
            .limit(1)
            .build();
        
        let mut cursor = collection.find(doc! {}, options).await?;
        
        if let Some(latest_order) = cursor.next().await {
            let order = latest_order?;
            if let Some(order_number) = order.get("order_number").and_then(|v| v.as_str()) {
                // Extract number from existing order number (e.g., "EXP-2024-001" -> 1)
                if let Some(number_str) = order_number.split('-').last() {
                    if let Ok(number) = number_str.parse::<i32>() {
                        return Ok(format!("EXP-{}-{:03}", Utc::now().year(), number + 1));
                    }
                }
            }
        }
        
        // If no existing orders, start with 001
        Ok(format!("EXP-{}-001", Utc::now().year()))
    }
    
    // Supplier Management
    pub async fn get_suppliers(&self, type_filter: Option<String>) -> Result<Vec<Value>, Box<dyn Error>> {
        let collection: Collection<Value> = self.db.collection("suppliers");
        
        let filter = if let Some(supplier_type) = type_filter {
            doc! { "type": supplier_type }
        } else {
            doc! {}
        };
        
        let options = mongodb::options::FindOptions::builder()
            .sort(doc! { "performance_metrics.reliability_score": -1 })
            .build();
        
        let mut cursor = collection.find(filter, options).await?;
        let mut suppliers = Vec::new();
        
        while let Some(doc) = cursor.next().await {
            suppliers.push(doc?);
        }
        
        Ok(suppliers)
    }
    
    pub async fn create_supplier(&self, supplier: Value) -> Result<String, Box<dyn Error>> {
        let collection: Collection<Value> = self.db.collection("suppliers");
        
        // Add metadata to supplier
        let mut supplier_with_metadata = supplier.as_object().unwrap().clone();
        supplier_with_metadata.insert("created_at".to_string(), Value::String(Utc::now().to_rfc3339()));
        
        // Initialize performance metrics if not provided
        if !supplier_with_metadata.contains_key("performance_metrics") {
            supplier_with_metadata.insert("performance_metrics".to_string(), Value::Object(serde_json::Map::from_iter(vec![
                ("reliability_score".to_string(), Value::Number(serde_json::Number::from(7))),
                ("quality_consistency".to_string(), Value::Number(serde_json::Number::from(7))),
                ("delivery_timeliness".to_string(), Value::Number(serde_json::Number::from(7))),
                ("price_competitiveness".to_string(), Value::Number(serde_json::Number::from(7))),
                ("communication_responsiveness".to_string(), Value::Number(serde_json::Number::from(7))),
            ])));
        }
        
        let result = collection.insert_one(Value::Object(supplier_with_metadata), None).await?;
        Ok(result.inserted_id.to_string())
    }
    
    pub async fn update_supplier(&self, supplier_id: &str, supplier_data: Value) -> Result<(), Box<dyn Error>> {
        let collection: Collection<Value> = self.db.collection("suppliers");
        
        let filter = doc! { "_id": supplier_id };
        
        // Convert Value to Bson for the update
        let bson_data = mongodb::bson::to_bson(&supplier_data)?;
        let update = doc! { "$set": bson_data };
        
        collection.update_one(filter, update, None).await?;
        
        Ok(())
    }
    
    // AI Predictions
    pub async fn get_predictions(&self, product_id: &str) -> Result<Value, Box<dyn Error>> {
        let collection: Collection<Value> = self.db.collection("market_intelligence");
        
        let now = DateTime::now();
        let yesterday = now.timestamp_millis() - (24 * 60 * 60 * 1000);
        let yesterday_dt = DateTime::from_millis(yesterday);
        
        let filter = doc! { 
            "product_id": product_id,
            "timestamp": { "$gte": yesterday_dt }
        };
        
        let options = mongodb::options::FindOneOptions::builder()
            .sort(doc! { "timestamp": -1 })
            .build();
            
        if let Some(prediction) = collection.find_one(filter, options).await? {
            Ok(prediction)
        } else {
            Ok(serde_json::json!({
                "error": "No recent predictions found",
                "product_id": product_id
            }))
        }
    }
    
    // Market Intelligence
    pub async fn get_market_intelligence(&self, product_id: &str) -> Result<Vec<Value>, Box<dyn Error>> {
        let collection: Collection<Value> = self.db.collection("market_intelligence");
        
        let now = DateTime::now();
        let week_ago = now.timestamp_millis() - (7 * 24 * 60 * 60 * 1000);
        let week_ago_dt = DateTime::from_millis(week_ago);
        
        let filter = doc! { 
            "product_id": product_id,
            "timestamp": { "$gte": week_ago_dt }
        };
        
        let options = mongodb::options::FindOptions::builder()
            .sort(doc! { "timestamp": -1 })
            .build();
        
        let mut cursor = collection.find(filter, options).await?;
        let mut intelligence = Vec::new();
        
        while let Some(doc) = cursor.next().await {
            intelligence.push(doc?);
        }
        
        Ok(intelligence)
    }
    
    // Arbitrage Opportunities
    pub async fn get_arbitrage_opportunities(&self) -> Result<Vec<Value>, Box<dyn Error>> {
        let collection: Collection<Value> = self.db.collection("market_intelligence");
        
        let now = DateTime::now();
        let yesterday = now.timestamp_millis() - (24 * 60 * 60 * 1000);
        let yesterday_dt = DateTime::from_millis(yesterday);
        
        let filter = doc! { 
            "arbitrage_opportunities": { "$exists": true, "$ne": [] },
            "timestamp": { "$gte": yesterday_dt }
        };
        
        let options = mongodb::options::FindOptions::builder()
            .sort(doc! { "timestamp": -1 })
            .build();
        
        let mut cursor = collection.find(filter, options).await?;
        let mut opportunities = Vec::new();
        
        while let Some(doc) = cursor.next().await {
            opportunities.push(doc?);
        }
        
        Ok(opportunities)
    }
} 