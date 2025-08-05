#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Builder, Manager, State};
use serde_json::Value;
use std::sync::Arc;
use tokio::sync::Mutex;

mod database;
mod export_manager;
mod api;
mod integrations;
mod document_generator;

use database::Database;
use export_manager::ExportManager;
use document_generator::DocumentGenerator;

#[derive(Clone)]
struct AppState {
    db: Arc<Database>,
    export_manager: Arc<Mutex<ExportManager>>,
    document_generator: Arc<DocumentGenerator>,
}

// Order Management Commands
#[tauri::command]
async fn get_orders(state: tauri::State<'_, AppState>, status: Option<String>) -> Result<Vec<serde_json::Value>, String> {
    state.db.get_orders(status).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn create_order(state: State<'_, AppState>, order_data: Value) -> Result<String, String> {
    let export_manager = state.export_manager.lock().await;
    export_manager.create_order(order_data).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn update_order_status(state: State<'_, AppState>, order_id: String, status: String) -> Result<(), String> {
    let export_manager = state.export_manager.lock().await;
    export_manager.update_order_status(&order_id, &status).await.map_err(|e| e.to_string())
}

// Supplier Management Commands
#[tauri::command]
async fn get_suppliers(state: tauri::State<'_, AppState>, type_filter: Option<String>) -> Result<Vec<serde_json::Value>, String> {
    state.db.get_suppliers(type_filter).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn create_supplier(state: tauri::State<'_, AppState>, supplier_data: serde_json::Value) -> Result<String, String> {
    state.db.create_supplier(supplier_data).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn update_supplier(state: tauri::State<'_, AppState>, supplier_id: String, supplier_data: serde_json::Value) -> Result<(), String> {
    state.db.update_supplier(&supplier_id, supplier_data).await.map_err(|e| e.to_string())
}

// Product Management Commands (existing, but included for completeness)
#[tauri::command]
async fn get_products(state: tauri::State<'_, AppState>, category: Option<String>) -> Result<Vec<serde_json::Value>, String> {
    state.db.get_products(category).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn create_product(state: tauri::State<'_, AppState>, product_data: serde_json::Value) -> Result<String, String> {
    state.db.create_product(product_data).await.map_err(|e| e.to_string())
}

// AI Integration Commands - Phase 3
#[tauri::command]
async fn get_ai_predictions(state: tauri::State<'_, AppState>, product_id: String) -> Result<serde_json::Value, String> {
    state.db.get_predictions(&product_id).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_arbitrage_opportunities(state: tauri::State<'_, AppState>) -> Result<Vec<serde_json::Value>, String> {
    state.db.get_arbitrage_opportunities().await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn analyze_market(_state: tauri::State<'_, AppState>, product_ids: Vec<String>, markets: Vec<String>, analysis_type: String) -> Result<serde_json::Value, String> {
    // This would typically call the AI engine
    // For now, return simulated analysis
    let analysis_result = serde_json::json!({
        "products_analyzed": product_ids.len(),
        "markets_analyzed": markets.len(),
        "analysis_type": analysis_type,
        "opportunities": [
            {
                "product_id": "saffron",
                "product_name": "Saffron",
                "market": "US",
                "buy_price": 2500,
                "sell_price": 4500,
                "profit_margin": 0.35,
                "confidence": 0.85,
                "risk_score": 0.25,
                "optimal_quantity": "100-200kg",
                "time_sensitivity": "high"
            }
        ],
        "market_trends": {
            "overall_trend": "up",
            "trend_strength": 0.75,
            "key_factors": ["increased_demand", "supply_constraints"]
        },
        "risk_assessment": {
            "overall_risk": "medium",
            "risk_factors": ["price_volatility", "logistics_delays"],
            "mitigation_strategies": ["hedging", "diversification"]
        },
        "generated_at": chrono::Utc::now().to_rfc3339()
    });
    Ok(analysis_result)
}

#[tauri::command]
async fn get_market_intelligence(_state: tauri::State<'_, AppState>, product_id: String) -> Result<serde_json::Value, String> {
    // For now, return simulated market intelligence
    // In production, this would call the AI engine
    let intelligence = serde_json::json!({
        "product_id": product_id,
        "product_name": "Sample Product",
        "current_price": 2500,
        "market_analysis": {
            "demand_trend": "increasing",
            "supply_status": "stable",
            "price_volatility": "medium"
        },
        "price_trends": {
            "short_term": "up",
            "medium_term": "stable",
            "long_term": "up"
        },
        "supply_analysis": {
            "availability": "good",
            "lead_time": "2-3 weeks",
            "quality_consistency": "high"
        },
        "demand_analysis": {
            "market_size": "large",
            "growth_rate": "12%",
            "seasonal_factors": ["harvest_season", "festival_demand"]
        },
        "risk_factors": ["price_volatility", "supply_disruption_risk"],
        "opportunities": [
            {
                "type": "arbitrage",
                "description": "Price difference between markets",
                "potential_profit": "15-20%"
            }
        ],
        "recommendations": [
            "Increase inventory for peak season",
            "Diversify supplier base",
            "Implement hedging strategy"
        ],
        "generated_at": chrono::Utc::now().to_rfc3339()
    });
    
    Ok(intelligence)
}

#[tauri::command]
async fn analyze_order_profit(state: State<'_, AppState>, order_data: Value) -> Result<Value, String> {
    let export_manager = state.export_manager.lock().await;
    export_manager.analyze_order_profit(order_data).await.map_err(|e| e.to_string())
}

// Document Generation Commands (new specific commands)
#[tauri::command]
async fn generate_order_documents(state: State<'_, AppState>, order_id: String) -> Result<Vec<String>, String> {
    let export_manager = state.export_manager.lock().await;
    export_manager.generate_order_documents(&order_id).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn generate_commercial_invoice(state: tauri::State<'_, AppState>, order_data: serde_json::Value) -> Result<String, String> {
    state.document_generator.generate_commercial_invoice(&order_data).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn generate_packing_list(state: tauri::State<'_, AppState>, order_data: serde_json::Value) -> Result<String, String> {
    state.document_generator.generate_packing_list(&order_data).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn generate_certificate_of_origin(state: tauri::State<'_, AppState>, order_data: serde_json::Value) -> Result<String, String> {
    state.document_generator.generate_certificate_of_origin(&order_data).await.map_err(|e| e.to_string())
}

// Real-time Sync Commands
#[tauri::command]
async fn sync_with_website(state: State<'_, AppState>, sync_data: Value) -> Result<(), String> {
    let export_manager = state.export_manager.lock().await;
    export_manager.sync_with_website(sync_data).await.map_err(|e| e.to_string())
}

fn main() {
    let context = tauri::generate_context!();
    Builder::default()
        .setup(|app| {
            let mongo_uri = "mongodb://localhost:27017/exportpro";
            let db = match Database::new(mongo_uri) {
                Ok(db) => {
                    println!("✅ Connected to MongoDB successfully");
                    db
                },
                Err(e) => {
                    println!("⚠️  Warning: Could not connect to MongoDB: {}", e);
                    println!("   The app will start in offline mode. Some features may be limited.");
                    println!("   Starting app in offline mode...");
                    // For now, let's just skip database initialization and see if the app starts
                    // You would need to implement a mock database here
                    println!("   Skipping database initialization for now");
                    // This is a temporary workaround - you should implement a proper mock database
                    Database::new("mongodb://localhost:27017/exportpro").unwrap()
                }
            };
            let export_manager = ExportManager::new(Arc::new(db.clone()));
            let document_generator = DocumentGenerator::new(); // Initialize
            app.manage(AppState { 
                db: Arc::new(db), 
                export_manager: Arc::new(Mutex::new(export_manager)), 
                document_generator: Arc::new(document_generator) 
            }); // Manage state
            println!("ExportExpressPro Desktop starting...");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Order Management
            get_orders, create_order, update_order_status,
            // Supplier Management
            get_suppliers, create_supplier, update_supplier,
            // Product Management
            get_products, create_product,
            // AI Integration - Phase 3
            get_ai_predictions, get_arbitrage_opportunities, analyze_market,
            get_market_intelligence, analyze_order_profit,
            // Document Generation
            generate_order_documents, generate_commercial_invoice,
            generate_packing_list, generate_certificate_of_origin,
            // Real-time Sync
            sync_with_website
        ])
        .run(context)
        .expect("error while running tauri application");
}
