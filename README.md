# ExportMaster Pro

A comprehensive desktop application for managing the complete export lifecycle for Indian exporters, built with Tauri and Rust.

## Features

- **Source Management**: Manage suppliers and sources with performance tracking
- **Product Catalog**: Comprehensive product database with specifications and market data
- **Trade Regulations**: Access to export/import rules and compliance information
- **Offline-First**: Full functionality without internet connectivity
- **Secure**: AES-256 encryption for sensitive business data
- **Multi-language**: Support for English and Hindi

## Technology Stack

- **Backend**: Rust with Tauri framework
- **Frontend**: React with TypeScript
- **Database**: MongoDB for document storage
- **Cache**: Redis for performance optimization
- **UI**: Chakra UI component library

## Development Setup

### Prerequisites

- Rust (latest stable version)
- Node.js (v16 or higher)
- MongoDB (v5.0 or higher)
- Redis (v6.0 or higher)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd export-master-pro
```

2. Install Rust dependencies:
```bash
cd src-tauri
cargo build
```

3. Install frontend dependencies:
```bash
npm install
```

4. Set up environment configuration:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Start MongoDB and Redis services

6. Run the development server:
```bash
npm run tauri dev
```

## Configuration

The application uses a hierarchical configuration system:

1. `config/default.toml` - Base configuration
2. `config/development.toml` - Development overrides
3. `config/production.toml` - Production overrides
4. `config/local.toml` - Local overrides (not tracked in git)
5. Environment variables with `EXPORT_MASTER_` prefix

## Project Structure

```
src-tauri/
├── src/
│   ├── api/           # Tauri command handlers
│   ├── config/        # Configuration management
│   ├── database/      # Database connection and setup
│   ├── error/         # Error types and handling
│   ├── models/        # Data models
│   ├── services/      # Business logic layer
│   ├── utils/         # Utility functions
│   └── main.rs        # Application entry point
├── Cargo.toml         # Rust dependencies
└── tauri.conf.json    # Tauri configuration

config/                # Configuration files
├── default.toml
├── development.toml
└── production.toml
```

## Building for Production

```bash
npm run tauri build
```

This will create platform-specific installers in `src-tauri/target/release/bundle/`.

## License

MIT License - see LICENSE file for details.