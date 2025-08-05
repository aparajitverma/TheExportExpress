use crate::database::Database;
use serde_json::Value;
use std::error::Error;
use std::sync::Arc;

#[derive(Debug, Clone)]
pub struct ExportManager {
    db: Arc<Database>,
}

impl ExportManager {
    pub fn new(db: Arc<Database>) -> Self {
        ExportManager { db }
    }
    
    // Order Processing
    pub async fn create_order(&self, order_data: Value) -> Result<String, Box<dyn Error>> {
        // Validate order data
        self.validate_order_data(&order_data).await?;
        
        // Calculate order totals
        let order_with_totals = self.calculate_order_totals(order_data).await?;
        
        // Perform AI analysis
        let order_with_analysis = self.analyze_order_with_ai(order_with_totals).await?;
        
        // Create order in database
        let order_id = self.db.create_order(order_with_analysis).await?;
        
        // Generate initial documents
        self.generate_initial_documents(&order_id).await?;
        
        // Sync with website if needed
        self.sync_order_with_website(&order_id).await?;
        
        Ok(order_id)
    }
    
    pub async fn update_order_status(&self, order_id: &str, status: &str) -> Result<(), Box<dyn Error>> {
        // Validate status transition
        self.validate_status_transition(order_id, status).await?;
        
        // Update status in database
        self.db.update_order_status(order_id, status).await?;
        
        // Generate additional documents if needed
        if status == "documentation" {
            self.generate_documentation_package(order_id).await?;
        }
        
        // Update website if needed
        if status == "completed" {
            self.update_website_inventory(order_id).await?;
        }
        
        Ok(())
    }
    
    // AI Analysis
    pub async fn analyze_order_profit(&self, order_data: Value) -> Result<Value, Box<dyn Error>> {
        let mut analysis = serde_json::Map::new();
        
        // Calculate basic profit metrics
        let total_value = order_data["order_details"]["total_value"].as_f64().unwrap_or(0.0);
        let total_cost = self.calculate_total_cost(&order_data).await?;
        let gross_profit = total_value - total_cost;
        let profit_margin = if total_value > 0.0 { gross_profit / total_value } else { 0.0 };
        
        // Get AI predictions for products
        let mut predicted_profit = 0.0;
        let mut risk_score = 0.0;
        let mut confidence = 0.0;
        
        if let Some(products) = order_data.get("products") {
            if let Some(products_array) = products.as_array() {
                let mut total_confidence = 0.0;
                let mut product_count = 0;
                
                for product in products_array {
                    if let Some(product_id) = product.get("product_id").and_then(|v| v.as_str()) {
                        let predictions = self.db.get_predictions(product_id).await?;
                        
                        if let Some(predicted_price) = predictions.get("predictions").and_then(|p| p.get("price_3_days")).and_then(|p| p.get("value")).and_then(|v| v.as_f64()) {
                            let current_price = product.get("unit_price").and_then(|v| v.as_f64()).unwrap_or(0.0);
                            let quantity = product.get("quantity").and_then(|v| v.as_f64()).unwrap_or(0.0);
                            
                            let price_difference = predicted_price - current_price;
                            predicted_profit += price_difference * quantity;
                            
                            if let Some(pred_confidence) = predictions.get("predictions").and_then(|p| p.get("price_3_days")).and_then(|p| p.get("confidence")).and_then(|v| v.as_f64()) {
                                total_confidence += pred_confidence;
                                product_count += 1;
                            }
                        }
                        
                        // Calculate risk based on market intelligence
                        if let Some(_risk_factors) = predictions.get("market_trends").and_then(|m| m.get("risk_factors")) {
                            risk_score += 0.1; // Base risk
                            if let Some(volatility) = predictions.get("market_trends").and_then(|m| m.get("price_volatility")).and_then(|v| v.as_f64()) {
                                risk_score += volatility * 0.5;
                            }
                        }
                    }
                }
                
                if product_count > 0 {
                    confidence = total_confidence / product_count as f64;
                }
            }
        }
        
        // Determine optimal shipping method
        let optimal_shipping = self.determine_optimal_shipping(&order_data).await?;
        
        // Calculate recommended insurance
        let recommended_insurance = total_value * 1.1; // 110% of order value
        
        analysis.insert("predicted_total_profit".to_string(), Value::Number(serde_json::Number::from_f64(predicted_profit).unwrap()));
        analysis.insert("profit_margin".to_string(), Value::Number(serde_json::Number::from_f64(profit_margin).unwrap()));
        analysis.insert("risk_score".to_string(), Value::Number(serde_json::Number::from_f64(risk_score.min(1.0)).unwrap()));
        analysis.insert("confidence".to_string(), Value::Number(serde_json::Number::from_f64(confidence).unwrap()));
        analysis.insert("optimal_shipping_method".to_string(), Value::String(optimal_shipping));
        analysis.insert("recommended_insurance".to_string(), Value::Number(serde_json::Number::from_f64(recommended_insurance).unwrap()));
        
        Ok(Value::Object(analysis))
    }
    
    // Document Generation
    pub async fn generate_order_documents(&self, order_id: &str) -> Result<Vec<String>, Box<dyn Error>> {
        let mut generated_documents = Vec::new();
        
        // Get order details
        let orders = self.db.get_orders(None).await?;
        let order = orders.into_iter().find(|o| o.get("_id").and_then(|v| v.as_str()) == Some(order_id));
        
        if let Some(order_data) = order {
            // Generate Commercial Invoice
            let commercial_invoice = self.generate_commercial_invoice(&order_data).await?;
            generated_documents.push(commercial_invoice);
            
            // Generate Packing List
            let packing_list = self.generate_packing_list(&order_data).await?;
            generated_documents.push(packing_list);
            
            // Generate Certificate of Origin (if needed)
            if self.requires_certificate_of_origin(&order_data).await? {
                let coo = self.generate_certificate_of_origin(&order_data).await?;
                generated_documents.push(coo);
            }
            
            // Generate Phytosanitary Certificate (if needed)
            if self.requires_phytosanitary_certificate(&order_data).await? {
                let phyto = self.generate_phytosanitary_certificate(&order_data).await?;
                generated_documents.push(phyto);
            }
        }
        
        Ok(generated_documents)
    }
    
    // Website Integration
    pub async fn sync_with_website(&self, sync_data: Value) -> Result<(), Box<dyn Error>> {
        // This would integrate with the website API
        // For now, we'll just log the sync data
        println!("Syncing with website: {:?}", sync_data);
        Ok(())
    }
    
    // Helper Methods
    async fn validate_order_data(&self, order_data: &Value) -> Result<(), Box<dyn Error>> {
        // Check required fields
        if !order_data.get("client").is_some() {
            return Err("Client information is required".into());
        }
        
        if !order_data.get("products").is_some() {
            return Err("Products are required".into());
        }
        
        if let Some(products) = order_data.get("products") {
            if let Some(products_array) = products.as_array() {
                if products_array.is_empty() {
                    return Err("At least one product is required".into());
                }
            }
        }
        
        Ok(())
    }
    
    async fn calculate_order_totals(&self, mut order_data: Value) -> Result<Value, Box<dyn Error>> {
        if let Some(products) = order_data.get_mut("products") {
            if let Some(products_array) = products.as_array_mut() {
                let mut total_value = 0.0;
                
                for product in products_array.iter_mut() {
                    let quantity = product.get("quantity").and_then(|v| v.as_f64()).unwrap_or(0.0);
                    let unit_price = product.get("unit_price").and_then(|v| v.as_f64()).unwrap_or(0.0);
                    let total = quantity * unit_price;
                    
                    product.as_object_mut().unwrap().insert("total".to_string(), Value::Number(serde_json::Number::from_f64(total).unwrap()));
                    total_value += total;
                }
                
                // Add order details
                let mut order_details = serde_json::Map::new();
                order_details.insert("total_value".to_string(), Value::Number(serde_json::Number::from_f64(total_value).unwrap()));
                order_details.insert("currency".to_string(), Value::String("INR".to_string()));
                
                if let Some(payment_terms) = order_data.get("payment_terms") {
                    order_details.insert("payment_terms".to_string(), payment_terms.clone());
                }
                
                if let Some(delivery_terms) = order_data.get("delivery_terms") {
                    order_details.insert("delivery_terms".to_string(), delivery_terms.clone());
                }
                
                order_data.as_object_mut().unwrap().insert("order_details".to_string(), Value::Object(order_details));
            }
        }
        
        Ok(order_data)
    }
    
    async fn analyze_order_with_ai(&self, mut order_data: Value) -> Result<Value, Box<dyn Error>> {
        let analysis = self.analyze_order_profit(order_data.clone()).await?;
        order_data.as_object_mut().unwrap().insert("ai_analysis".to_string(), analysis);
        Ok(order_data)
    }
    
    async fn calculate_total_cost(&self, order_data: &Value) -> Result<f64, Box<dyn Error>> {
        let mut total_cost = 0.0;
        
        if let Some(products) = order_data.get("products") {
            if let Some(products_array) = products.as_array() {
                for product in products_array {
                    let quantity = product.get("quantity").and_then(|v| v.as_f64()).unwrap_or(0.0);
                    let unit_cost = product.get("unit_cost").and_then(|v| v.as_f64()).unwrap_or(0.0);
                    total_cost += quantity * unit_cost;
                }
            }
        }
        
        Ok(total_cost)
    }
    
    async fn determine_optimal_shipping(&self, order_data: &Value) -> Result<String, Box<dyn Error>> {
        let total_value = order_data.get("order_details").and_then(|d| d.get("total_value")).and_then(|v| v.as_f64()).unwrap_or(0.0);
        
        // Simple logic based on order value
        if total_value > 100000.0 {
            Ok("air_freight".to_string())
        } else if total_value > 50000.0 {
            Ok("express_courier".to_string())
        } else {
            Ok("sea_freight".to_string())
        }
    }
    
    async fn validate_status_transition(&self, _order_id: &str, _status: &str) -> Result<(), Box<dyn Error>> {
        // Add validation logic for status transitions
        // For now, accept all transitions
        Ok(())
    }
    
    async fn generate_initial_documents(&self, _order_id: &str) -> Result<(), Box<dyn Error>> {
        // Generate initial documents like order confirmation
        Ok(())
    }
    
    async fn sync_order_with_website(&self, _order_id: &str) -> Result<(), Box<dyn Error>> {
        // Sync order with website
        Ok(())
    }
    
    async fn generate_documentation_package(&self, _order_id: &str) -> Result<(), Box<dyn Error>> {
        // Generate full documentation package
        Ok(())
    }
    
    async fn update_website_inventory(&self, _order_id: &str) -> Result<(), Box<dyn Error>> {
        // Update website inventory
        Ok(())
    }
    
    async fn generate_commercial_invoice(&self, _order_data: &Value) -> Result<String, Box<dyn Error>> {
        // Generate commercial invoice
        Ok("commercial_invoice.pdf".to_string())
    }
    
    async fn generate_packing_list(&self, _order_data: &Value) -> Result<String, Box<dyn Error>> {
        // Generate packing list
        Ok("packing_list.pdf".to_string())
    }
    
    async fn requires_certificate_of_origin(&self, _order_data: &Value) -> Result<bool, Box<dyn Error>> {
        // Check if certificate of origin is required
        Ok(true)
    }
    
    async fn generate_certificate_of_origin(&self, _order_data: &Value) -> Result<String, Box<dyn Error>> {
        // Generate certificate of origin
        Ok("certificate_of_origin.pdf".to_string())
    }
    
    async fn requires_phytosanitary_certificate(&self, _order_data: &Value) -> Result<bool, Box<dyn Error>> {
        // Check if phytosanitary certificate is required
        Ok(false)
    }
    
    async fn generate_phytosanitary_certificate(&self, _order_data: &Value) -> Result<String, Box<dyn Error>> {
        // Generate phytosanitary certificate
        Ok("phytosanitary_certificate.pdf".to_string())
    }
} 