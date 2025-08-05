use serde_json::Value;
use std::error::Error;
use std::fs;
use std::path::Path;

#[derive(Debug, Clone)]
pub struct DocumentGenerator;

impl DocumentGenerator {
    pub fn new() -> Self {
        DocumentGenerator
    }
    
    pub async fn generate_commercial_invoice(&self, order_data: &Value) -> Result<String, Box<dyn Error + Send + Sync>> {
        let invoice_content = self.create_invoice_content(order_data).await?;
        let filename = format!("commercial_invoice_{}.html", 
            order_data.get("order_number").and_then(|v| v.as_str()).unwrap_or("unknown"));
        
        self.save_document(&filename, &invoice_content).await?;
        Ok(filename)
    }
    
    pub async fn generate_packing_list(&self, order_data: &Value) -> Result<String, Box<dyn Error + Send + Sync>> {
        let packing_content = self.create_packing_list_content(order_data).await?;
        let filename = format!("packing_list_{}.html", 
            order_data.get("order_number").and_then(|v| v.as_str()).unwrap_or("unknown"));
        
        self.save_document(&filename, &packing_content).await?;
        Ok(filename)
    }
    
    pub async fn generate_certificate_of_origin(&self, order_data: &Value) -> Result<String, Box<dyn Error + Send + Sync>> {
        let coo_content = self.create_certificate_of_origin_content(order_data).await?;
        let filename = format!("certificate_of_origin_{}.html", 
            order_data.get("order_number").and_then(|v| v.as_str()).unwrap_or("unknown"));
        
        self.save_document(&filename, &coo_content).await?;
        Ok(filename)
    }
    
    async fn create_invoice_content(&self, order_data: &Value) -> Result<String, Box<dyn Error + Send + Sync>> {
        let order_number = order_data.get("order_number").and_then(|v| v.as_str()).unwrap_or("N/A");
        let client = order_data.get("client").unwrap_or(&Value::Null);
        let company_name = client.get("company_name").and_then(|v| v.as_str()).unwrap_or("N/A");
        let total_value = order_data.get("order_details").and_then(|d| d.get("total_value")).and_then(|v| v.as_f64()).unwrap_or(0.0);
        
        let html_content = format!(
            r#"
            <!DOCTYPE html>
            <html>
            <head>
                <title>Commercial Invoice - {}</title>
                <style>
                    body {{ font-family: Arial, sans-serif; margin: 40px; }}
                    .header {{ text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }}
                    .invoice-details {{ margin: 20px 0; }}
                    .client-info {{ margin: 20px 0; }}
                    .products-table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
                    .products-table th, .products-table td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
                    .total {{ text-align: right; font-weight: bold; margin-top: 20px; }}
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>COMMERCIAL INVOICE</h1>
                    <p>Invoice Number: {}</p>
                    <p>Date: {}</p>
                </div>
                
                <div class="client-info">
                    <h3>Bill To:</h3>
                    <p>{}</p>
                </div>
                
                <div class="invoice-details">
                    <h3>Invoice Details:</h3>
                    <p><strong>Order Number:</strong> {}</p>
                    <p><strong>Currency:</strong> INR</p>
                </div>
                
                <table class="products-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {}
                    </tbody>
                </table>
                
                <div class="total">
                    <h3>Total Amount: ₹{}</h3>
                </div>
            </body>
            </html>
            "#,
            order_number,
            order_number,
            chrono::Utc::now().format("%Y-%m-%d"),
            company_name,
            order_number,
            self.generate_products_table_rows(order_data).await?,
            total_value
        );
        
        Ok(html_content)
    }
    
    async fn create_packing_list_content(&self, order_data: &Value) -> Result<String, Box<dyn Error + Send + Sync>> {
        let order_number = order_data.get("order_number").and_then(|v| v.as_str()).unwrap_or("N/A");
        let total_packages = self.calculate_total_packages(order_data).await?;
        let total_weight = self.calculate_total_weight(order_data).await?;
        let packing_rows = self.generate_packing_table_rows(order_data).await?;
        
        let html_content = format!(
            r#"
            <!DOCTYPE html>
            <html>
            <head>
                <title>Packing List - {}</title>
                <style>
                    body {{ font-family: Arial, sans-serif; margin: 40px; }}
                    .header {{ text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }}
                    .packing-details {{ margin: 20px 0; }}
                    .products-table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
                    .products-table th, .products-table td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>PACKING LIST</h1>
                    <p>Order Number: {}</p>
                    <p>Date: {}</p>
                </div>
                
                <div class="packing-details">
                    <h3>Packing Details:</h3>
                    <p><strong>Total Packages:</strong> {}</p>
                    <p><strong>Total Weight:</strong> {} kg</p>
                </div>
                
                <table class="products-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Package Number</th>
                            <th>Weight (kg)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {}
                    </tbody>
                </table>
            </body>
            </html>
            "#,
            order_number,
            order_number,
            chrono::Utc::now().format("%Y-%m-%d"),
            total_packages,
            total_weight,
            packing_rows
        );
        
        Ok(html_content)
    }
    
    async fn create_certificate_of_origin_content(&self, order_data: &Value) -> Result<String, Box<dyn Error + Send + Sync>> {
        let order_number = order_data.get("order_number").and_then(|v| v.as_str()).unwrap_or("N/A");
        
        let html_content = format!(
            r#"
            <!DOCTYPE html>
            <html>
            <head>
                <title>Certificate of Origin - {}</title>
                <style>
                    body {{ font-family: Arial, sans-serif; margin: 40px; }}
                    .header {{ text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }}
                    .certificate-content {{ margin: 20px 0; line-height: 1.6; }}
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>CERTIFICATE OF ORIGIN</h1>
                    <p>Certificate Number: COO-{}-001</p>
                    <p>Date: {}</p>
                </div>
                
                <div class="certificate-content">
                    <p>This is to certify that the goods described below are of Indian origin:</p>
                    
                    <h3>Goods Description:</h3>
                    <p>Agricultural products and spices exported under Order Number: {}</p>
                    
                    <h3>Origin Criteria:</h3>
                    <p>These goods have been wholly obtained in India and meet the requirements for preferential treatment.</p>
                    
                    <h3>Declaration:</h3>
                    <p>I hereby declare that the above information is correct and that the goods described above are of Indian origin.</p>
                    
                    <p style="margin-top: 40px;">
                        <strong>Authorized Signature:</strong> _________________<br>
                        <strong>Date:</strong> {}<br>
                        <strong>Stamp:</strong> _________________
                    </p>
                </div>
            </body>
            </html>
            "#,
            order_number,
            order_number,
            chrono::Utc::now().format("%Y-%m-%d"),
            order_number,
            chrono::Utc::now().format("%Y-%m-%d")
        );
        
        Ok(html_content)
    }
    
    async fn generate_products_table_rows(&self, order_data: &Value) -> Result<String, Box<dyn Error + Send + Sync>> {
        let mut rows = String::new();
        
        if let Some(products) = order_data.get("products") {
            if let Some(products_array) = products.as_array() {
                for product in products_array {
                    let name = product.get("name").and_then(|v| v.as_str()).unwrap_or("N/A");
                    let quantity = product.get("quantity").and_then(|v| v.as_f64()).unwrap_or(0.0);
                    let unit_price = product.get("unit_price").and_then(|v| v.as_f64()).unwrap_or(0.0);
                    let total = product.get("total").and_then(|v| v.as_f64()).unwrap_or(0.0);
                    
                    rows.push_str(&format!(
                        "<tr><td>{}</td><td>{}</td><td>₹{}</td><td>₹{}</td></tr>",
                        name, quantity, unit_price, total
                    ));
                }
            }
        }
        
        Ok(rows)
    }
    
    async fn generate_packing_table_rows(&self, order_data: &Value) -> Result<String, Box<dyn Error + Send + Sync>> {
        let mut rows = String::new();
        let mut package_number = 1;
        
        if let Some(products) = order_data.get("products") {
            if let Some(products_array) = products.as_array() {
                for product in products_array {
                    let name = product.get("name").and_then(|v| v.as_str()).unwrap_or("N/A");
                    let quantity = product.get("quantity").and_then(|v| v.as_f64()).unwrap_or(0.0);
                    let weight_per_unit = 0.5; // Default weight per unit in kg
                    let total_weight = quantity * weight_per_unit;
                    
                    rows.push_str(&format!(
                        "<tr><td>{}</td><td>{}</td><td>{}</td><td>{}</td></tr>",
                        name, quantity, package_number, total_weight
                    ));
                    
                    package_number += 1;
                }
            }
        }
        
        Ok(rows)
    }
    
    async fn calculate_total_packages(&self, order_data: &Value) -> Result<i32, Box<dyn Error + Send + Sync>> {
        if let Some(products) = order_data.get("products") {
            if let Some(products_array) = products.as_array() {
                return Ok(products_array.len() as i32);
            }
        }
        Ok(0)
    }
    
    async fn calculate_total_weight(&self, order_data: &Value) -> Result<f64, Box<dyn Error + Send + Sync>> {
        let mut total_weight = 0.0;
        
        if let Some(products) = order_data.get("products") {
            if let Some(products_array) = products.as_array() {
                for product in products_array {
                    let quantity = product.get("quantity").and_then(|v| v.as_f64()).unwrap_or(0.0);
                    let weight_per_unit = 0.5; // Default weight per unit in kg
                    total_weight += quantity * weight_per_unit;
                }
            }
        }
        
        Ok(total_weight)
    }
    
    async fn save_document(&self, filename: &str, content: &str) -> Result<(), Box<dyn Error + Send + Sync>> {
        let documents_dir = Path::new("documents");
        if !documents_dir.exists() {
            fs::create_dir_all(documents_dir)?;
        }
        
        let file_path = documents_dir.join(filename);
        fs::write(file_path, content)?;
        
        Ok(())
    }
} 