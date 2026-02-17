# Customer Portal - Backend

**Note:** Customer Portal is a frontend-only application.

This folder is a placeholder to maintain structural consistency with AdminApp and FinanceApp.

## Architecture

Customer Portal does not have its own backend. It uses:

- **FinanceApp SSO API** for authentication (`/api/auth/*`)
- **FinanceApp API** for business logic (`/api/*`)

## Why No Backend?

Customer Portal is a self-service portal for bank customers to:
- View their loans
- Make payments
- Submit documents
- Track loan applications

All these operations are handled by the FinanceApp backend API.
