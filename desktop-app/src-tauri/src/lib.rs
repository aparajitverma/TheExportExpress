pub mod database;
pub mod export_manager;
pub mod api;
pub mod integrations;
pub mod document_generator;

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[tokio::test]
    async fn test_order_creation() {
        let db = database::Database::new("mongodb://localhost:27017/exportpro").unwrap();
        let export_manager = export_manager::ExportManager::new(std::sync::Arc::new(db));
        
        let order_data = json!({
            "client": {
                "company_name": "Test Company",
                "contact_person": "John Doe",
                "email": "john@testcompany.com"
            },
            "products": [
                {
                    "product_id": "test_product_1",
                    "name": "Test Product",
                    "quantity": 10,
                    "unit_price": 100.0
                }
            ],
            "payment_terms": "LC_at_sight",
            "delivery_terms": "FOB_Mumbai"
        });
        
        let result = export_manager.create_order(order_data).await;
        assert!(result.is_ok());
    }

    #[tokio::test]
    async fn test_supplier_creation() {
        let db = database::Database::new("mongodb://localhost:27017/exportpro").unwrap();
        
        let supplier_data = json!({
            "name": "Test Supplier",
            "type": "farmer_cooperative",
            "location": {
                "state": "Maharashtra",
                "district": "Mumbai",
                "pincode": "400001"
            },
            "contact": {
                "primary_contact": "Supplier Contact",
                "phone": "+91-9876543210",
                "email": "contact@testsupplier.com",
                "preferred_communication": "whatsapp"
            },
            "products_offered": [
                {
                    "product_id": "test_product_1",
                    "name": "Test Product",
                    "capacity": "100kg/month",
                    "current_price": 100.0,
                    "quality_grade": "premium",
                    "lead_time_days": 7,
                    "minimum_order_kg": 10
                }
            ]
        });
        
        let result = db.create_supplier(supplier_data).await;
        assert!(result.is_ok());
    }

    #[tokio::test]
    async fn test_document_generation() {
        let document_generator = document_generator::DocumentGenerator::new();
        
        let order_data = json!({
            "order_number": "EXP-2024-001",
            "client": {
                "company_name": "Test Company"
            },
            "order_details": {
                "total_value": 1000.0
            },
            "products": [
                {
                    "name": "Test Product",
                    "quantity": 10,
                    "unit_price": 100.0,
                    "total": 1000.0
                }
            ]
        });
        
        let result = document_generator.generate_commercial_invoice(&order_data).await;
        assert!(result.is_ok());
    }
} 