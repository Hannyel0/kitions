# Kitions Platform - Technical Documentation

## Table of Contents
Here’s the setup:
- There’s a Supabase table called `user_verification_statuses` with columns: `user_id (uuid)`, `status (enum: 'pending', 'approved', 'rejected')`.
- When a user logs in and tries to access the dashboard app, I want to check their verification status.
- If their status is not 'approved', redirect them to `/pending-verification`.
- If approved, allow normal access (continue to protected pages).
- If there’s no session, redirect them to `/login`.
Here’s the setup:
- There’s a Supabase table called `user_verification_statuses` with columns: `user_id (uuid)`, `status (enum: 'pending', 'approved', 'rejected')`.
- When a user logs in and tries to access the dashboard app, I want to check their verification status.
- If their status is not 'approved', redirect them to `/pending-verification`.
- If approved, allow normal access (continue to protected pages).
- If there’s no session, redirect them to `/login`.

1. [Project Overview](#project-overview)
2. [Architecture Overview](#architecture-overview)
3. [Technology Stack](#technology-stack)
4. [Application Structure](#application-structure)
5. [Database Schema](#database-schema)
6. [Authentication & Authorization](#authentication--authorization)
7. [API Design](#api-design)
8. [Component Architecture](#component-architecture)
9. [State Management](#state-management)
10. [Deployment & Infrastructure](#deployment--infrastructure)
11. [Security Considerations](#security-considerations)
12. [Performance Optimizations](#performance-optimizations)
13. [Development Workflow](#development-workflow)

## Project Overview

Kitions is a comprehensive B2B platform that connects distributors and retailers in a streamlined marketplace. The platform consists of two main applications:

- **Public App** (`localhost:3000` / `kitions.com`): Marketing website with user registration and authentication
- **Dashboard App** (`localhost:3001` / `dashboard.kitions.com`): Business management interface for distributors and retailers

### Key Features

- **Multi-tenant Architecture**: Separate interfaces for distributors and retailers
- **Product Management**: Comprehensive inventory and catalog management
- **Order Management**: End-to-end order processing workflow
- **User Authentication**: Secure signup, login, and email verification
- **Real-time Updates**: Live inventory tracking and order status updates
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        PA[Public App<br/>Next.js 15]
        DA[Dashboard App<br/>Next.js 15]
    end
    
    subgraph "Authentication Layer"
        AUTH[Supabase Auth<br/>JWT + RLS]
    end
    
    subgraph "API Layer"
        SUPA[Supabase API<br/>PostgreSQL + REST]
        EDGE[Edge Functions<br/>Serverless]
    end
    
    subgraph "Storage Layer"
        DB[(PostgreSQL<br/>Database)]
        STORAGE[Supabase Storage<br/>File Management]
    end
    
    subgraph "External Services"
        EMAIL[Resend<br/>Email Service]
        MAPS[Mapbox<br/>Address Autocomplete]
    end
    
    PA --> AUTH
    DA --> AUTH
    PA --> SUPA
    DA --> SUPA
    AUTH --> DB
    SUPA --> DB
    EDGE --> DB
    PA --> EMAIL
    PA --> MAPS
    SUPA --> STORAGE
```

### Multi-Application Architecture

```mermaid
graph LR
    subgraph "Public Domain (kitions.com)"
        PUB[Public App<br/>Marketing & Auth]
    end
    
    subgraph "Dashboard Domain (dashboard.kitions.com)"
        DASH[Dashboard App<br/>Business Management]
    end
    
    subgraph "Shared Infrastructure"
        SUPABASE[Supabase Backend]
        DB[(Shared Database)]
    end
    
    PUB --> SUPABASE
    DASH --> SUPABASE
    SUPABASE --> DB
    
    PUB -.->|Redirect after signup| DASH
    DASH -.->|Back to public| PUB
```

## Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.3.1 | React framework with SSR/SSG |
| **React** | 19.0.0 | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Utility-first CSS framework |
| **Framer Motion** | 12.x | Animation library |
| **Lucide React** | 0.511.0 | Icon library |

### Backend & Database

| Technology | Purpose |
|------------|---------|
| **Supabase** | Backend-as-a-Service |
| **PostgreSQL** | Primary database |
| **Row Level Security** | Data access control |
| **Supabase Auth** | Authentication service |
| **Supabase Storage** | File storage |

### Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting |
| **Turbopack** | Fast bundler (dev mode) |
| **PostCSS** | CSS processing |

### External Services

| Service | Purpose |
|---------|---------|
| **Resend** | Email delivery |
| **Mapbox** | Address autocomplete |
| **FontAwesome** | Additional icons |

## Application Structure

### Public App Structure

```
public-app/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── signup/
│   │   │   ├── role/
│   │   │   ├── complete-profile/
│   │   │   ├── verification/
│   │   │   └── success/
│   │   ├── forgot-password/
│   │   └── verification/
│   ├── auth/
│   │   └── confirm/
│   ├── api/
│   │   └── invite-user/
│   ├── components/
│   ├── providers/
│   ├── utils/
│   ├── hooks/
│   ├── lib/
│   └── config/
├── middleware.ts
└── package.json
```

### Dashboard App Structure

```
dashboard-app/
├── app/
│   ├── distributor/
│   │   ├── home/
│   │   ├── products/
│   │   ├── inventory/
│   │   ├── orders/
│   │   ├── reports/
│   │   └── settings/
│   ├── retailer/
│   │   ├── home/
│   │   └── settings/
│   ├── components/
│   │   ├── layout/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── inventory/
│   │   ├── dashboard/
│   │   ├── barcode/
│   │   └── ui/
│   ├── providers/
│   ├── utils/
│   ├── hooks/
│   └── lib/
├── middleware.ts
└── package.json
```

## Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    users ||--o{ retailers : "has"
    users ||--o{ distributors : "has"
    users ||--|| user_verification_statuses : "has"
    
    distributors ||--o{ distributor_products : "owns"
    distributors ||--o{ orders : "receives"
    
    retailers ||--o{ orders : "places"
    
    product_categories ||--o{ distributor_products : "categorizes"
    distributor_products ||--o{ product_batches : "has"
    distributor_products ||--o{ order_items : "included_in"
    
    orders ||--o{ order_items : "contains"
    
    users {
        uuid id PK
        string email
        string first_name
        string last_name
        string phone
        string business_name
        string business_address
        string business_type
        string user_type
        string profile_picture_url
        timestamp created_at
        timestamp updated_at
        string unique_identifier
    }
    
    retailers {
        uuid id PK
        uuid user_id FK
        string store_address
        string store_type
        string inventory_needs
        timestamp created_at
        timestamp updated_at
    }
    
    distributors {
        uuid id PK
        uuid user_id FK
        decimal min_order_amount
        timestamp created_at
        timestamp updated_at
    }
    
    user_verification_statuses {
        uuid id PK
        uuid user_id FK
        string status
        timestamp updated_at
    }
    
    product_categories {
        uuid id PK
        string name
        timestamp created_at
    }
    
    distributor_products {
        uuid id PK
        uuid distributor_id FK
        uuid category_id FK
        string name
        text description
        decimal price
        string image_url
        integer case_size
        integer stock_quantity
        string sku
        string upc
        timestamp created_at
        timestamp updated_at
    }
    
    product_batches {
        uuid id PK
        uuid product_id FK
        uuid distributor_id FK
        string batch_number
        integer quantity
        integer remaining_quantity
        timestamp received_date
        timestamp expiration_date
        timestamp created_at
    }
    
    orders {
        uuid id PK
        string order_number
        uuid retailer_id FK
        uuid distributor_id FK
        string status
        string payment_status
        decimal subtotal
        decimal tax
        decimal discount
        decimal total
        text notes
        timestamp created_at
        timestamp updated_at
    }
    
    order_items {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        integer quantity
        decimal unit_price
        decimal total_price
    }
```

### Key Database Features

1. **Row Level Security (RLS)**: Implemented on all tables to ensure data isolation
2. **UUID Primary Keys**: For better security and distributed systems
3. **Audit Trails**: Created/updated timestamps on all entities
4. **Referential Integrity**: Foreign key constraints maintain data consistency
5. **Flexible Schema**: Supports multiple business types and use cases

## Authentication & Authorization

### Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant PA as Public App
    participant SA as Supabase Auth
    participant DB as Database
    participant DA as Dashboard App
    
    U->>PA: 1. Sign up with email/password
    PA->>SA: 2. Create auth user
    SA->>U: 3. Send verification email
    U->>SA: 4. Click verification link
    SA->>PA: 5. Redirect with auth code
    PA->>SA: 6. Exchange code for session
    PA->>DB: 7. Create user profile
    PA->>DA: 8. Redirect to dashboard
    DA->>SA: 9. Validate session
    SA->>DA: 10. Return user data
```

### Role-Based Access Control

```mermaid
graph TD
    USER[Authenticated User]
    
    USER --> RETAILER{Retailer Role}
    USER --> DISTRIBUTOR{Distributor Role}
    USER --> ADMIN{Admin Role}
    
    RETAILER --> R_ORDERS[View Orders]
    RETAILER --> R_PROFILE[Manage Profile]
    RETAILER --> R_BROWSE[Browse Products]
    
    DISTRIBUTOR --> D_PRODUCTS[Manage Products]
    DISTRIBUTOR --> D_INVENTORY[Manage Inventory]
    DISTRIBUTOR --> D_ORDERS[Process Orders]
    DISTRIBUTOR --> D_REPORTS[View Reports]
    DISTRIBUTOR --> D_PROFILE[Manage Profile]
    
    ADMIN --> A_ALL[All Permissions]
```

### Security Implementation

1. **JWT Tokens**: Secure session management
2. **Row Level Security**: Database-level access control
3. **HTTPS Only**: All communications encrypted
4. **CSRF Protection**: Built into Next.js
5. **Input Validation**: TypeScript + runtime validation
6. **Cookie Security**: HttpOnly, Secure, SameSite attributes

## API Design

### Supabase Integration Pattern

```mermaid
graph LR
    subgraph "Client Side"
        COMP[React Component]
        HOOK[Custom Hook]
    end
    
    subgraph "Supabase Client"
        CLIENT[Supabase Client]
        AUTH[Auth Module]
        DB[Database Module]
        STORAGE[Storage Module]
    end
    
    subgraph "Backend"
        POSTGRES[(PostgreSQL)]
        RLS[Row Level Security]
        TRIGGERS[Database Triggers]
    end
    
    COMP --> HOOK
    HOOK --> CLIENT
    CLIENT --> AUTH
    CLIENT --> DB
    CLIENT --> STORAGE
    DB --> POSTGRES
    AUTH --> RLS
    POSTGRES --> TRIGGERS
```

### Data Flow Patterns

#### Product Management Flow

```mermaid
sequenceDiagram
    participant C as Component
    participant S as Supabase Client
    participant DB as Database
    participant ST as Storage
    
    C->>S: Create product with image
    S->>ST: Upload product image
    ST-->>S: Return image URL
    S->>DB: Insert product record
    DB-->>S: Return created product
    S-->>C: Success response
    C->>C: Update UI state
```

#### Order Processing Flow

```mermaid
sequenceDiagram
    participant R as Retailer
    participant D as Distributor
    participant DB as Database
    participant N as Notifications
    
    R->>DB: Create order
    DB->>N: Trigger order notification
    N->>D: Notify new order
    D->>DB: Update order status
    DB->>N: Trigger status update
    N->>R: Notify status change
```

## Component Architecture

### Component Hierarchy

```mermaid
graph TD
    APP[App Layout]
    
    APP --> AUTH[Auth Provider]
    APP --> LAYOUT[Dashboard Layout]
    
    LAYOUT --> SIDEBAR[Sidebar Navigation]
    LAYOUT --> HEADER[Header Component]
    LAYOUT --> MAIN[Main Content]
    
    MAIN --> PRODUCTS[Products Module]
    MAIN --> ORDERS[Orders Module]
    MAIN --> INVENTORY[Inventory Module]
    MAIN --> REPORTS[Reports Module]
    
    PRODUCTS --> P_LIST[Product List]
    PRODUCTS --> P_CARD[Product Card]
    PRODUCTS --> P_MODAL[Product Modal]
    
    ORDERS --> O_LIST[Order List]
    ORDERS --> O_DETAILS[Order Details]
    ORDERS --> O_CREATE[Create Order]
    
    INVENTORY --> I_TABLE[Inventory Table]
    INVENTORY --> I_MODAL[Inventory Modal]
    INVENTORY --> I_SCANNER[Barcode Scanner]
```

### Design Patterns

1. **Container/Presentational Pattern**: Separation of logic and UI
2. **Custom Hooks**: Reusable state logic
3. **Compound Components**: Complex UI components
4. **Render Props**: Flexible component composition
5. **Higher-Order Components**: Cross-cutting concerns

### Component Examples

#### Product Management Components

```typescript
// Product Card Component
interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

// Custom Hook for Product Management
function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchProducts = useCallback(async () => {
    // Supabase integration logic
  }, []);
  
  return { products, loading, fetchProducts };
}
```

## State Management

### State Architecture

```mermaid
graph TD
    subgraph "Global State"
        AUTH_CTX[Auth Context]
        USER_CTX[User Context]
    end
    
    subgraph "Local State"
        COMP_STATE[Component State]
        FORM_STATE[Form State]
        UI_STATE[UI State]
    end
    
    subgraph "Server State"
        SUPABASE[Supabase Client]
        CACHE[Client Cache]
    end
    
    AUTH_CTX --> COMP_STATE
    USER_CTX --> COMP_STATE
    COMP_STATE --> SUPABASE
    SUPABASE --> CACHE
```

### State Management Patterns

1. **React Context**: Global authentication state
2. **useState/useReducer**: Local component state
3. **Custom Hooks**: Shared state logic
4. **Supabase Real-time**: Live data updates
5. **Session Storage**: Temporary data persistence

## Deployment & Infrastructure

### Deployment Architecture

```mermaid
graph TB
    subgraph "Production Environment"
        CDN[Vercel CDN]
        PA_PROD[Public App<br/>kitions.com]
        DA_PROD[Dashboard App<br/>dashboard.kitions.com]
    end
    
    subgraph "Development Environment"
        PA_DEV[Public App<br/>localhost:3000]
        DA_DEV[Dashboard App<br/>localhost:3001]
    end
    
    subgraph "Shared Services"
        SUPABASE[Supabase Cloud]
        RESEND[Resend Email]
        MAPBOX[Mapbox API]
    end
    
    CDN --> PA_PROD
    CDN --> DA_PROD
    
    PA_PROD --> SUPABASE
    DA_PROD --> SUPABASE
    PA_DEV --> SUPABASE
    DA_DEV --> SUPABASE
    
    PA_PROD --> RESEND
    PA_DEV --> RESEND
    PA_PROD --> MAPBOX
    PA_DEV --> MAPBOX
```

### Environment Configuration

| Environment | Public App URL | Dashboard App URL | Database |
|-------------|----------------|-------------------|----------|
| Development | localhost:3000 | localhost:3001 | Supabase Dev |
| Production | kitions.com | dashboard.kitions.com | Supabase Prod |

### Build & Deployment Process

```mermaid
graph LR
    CODE[Source Code] --> BUILD[Next.js Build]
    BUILD --> OPTIMIZE[Optimization]
    OPTIMIZE --> DEPLOY[Vercel Deploy]
    DEPLOY --> CDN[Global CDN]
    CDN --> USERS[End Users]
```

## Security Considerations

### Security Layers

```mermaid
graph TD
    subgraph "Application Security"
        AUTH[Authentication]
        AUTHZ[Authorization]
        INPUT[Input Validation]
        XSS[XSS Protection]
        CSRF[CSRF Protection]
    end
    
    subgraph "Database Security"
        RLS[Row Level Security]
        ENCRYPT[Encryption at Rest]
        BACKUP[Secure Backups]
    end
    
    subgraph "Infrastructure Security"
        HTTPS[HTTPS/TLS]
        HEADERS[Security Headers]
        CORS[CORS Policy]
        RATE[Rate Limiting]
    end
    
    AUTH --> RLS
    AUTHZ --> RLS
    INPUT --> ENCRYPT
    HTTPS --> HEADERS
```

### Security Measures

1. **Authentication**: Supabase Auth with JWT tokens
2. **Authorization**: Role-based access control
3. **Data Protection**: Row Level Security policies
4. **Transport Security**: HTTPS everywhere
5. **Input Validation**: TypeScript + runtime checks
6. **File Upload Security**: Validated file types and sizes
7. **Session Management**: Secure cookie handling

## Performance Optimizations

### Frontend Optimizations

```mermaid
graph LR
    subgraph "Build Time"
        TURBO[Turbopack]
        TREE[Tree Shaking]
        BUNDLE[Bundle Splitting]
    end
    
    subgraph "Runtime"
        SSR[Server Side Rendering]
        LAZY[Lazy Loading]
        CACHE[Client Caching]
        PREFETCH[Prefetching]
    end
    
    subgraph "Assets"
        IMG[Image Optimization]
        FONT[Font Optimization]
        CSS[CSS Optimization]
    end
    
    TURBO --> SSR
    TREE --> LAZY
    BUNDLE --> CACHE
    SSR --> IMG
```

### Performance Features

1. **Next.js 15**: Latest performance improvements
2. **Turbopack**: Fast development builds
3. **Image Optimization**: Automatic WebP conversion
4. **Code Splitting**: Automatic route-based splitting
5. **Lazy Loading**: Component and route lazy loading
6. **Caching**: Aggressive caching strategies
7. **CDN**: Global content delivery

### Database Optimizations

1. **Indexing**: Strategic database indexes
2. **Query Optimization**: Efficient Supabase queries
3. **Connection Pooling**: Managed by Supabase
4. **Real-time Subscriptions**: Efficient data updates

## Development Workflow

### Development Process

```mermaid
graph LR
    DEV[Development] --> LINT[ESLint Check]
    LINT --> TYPE[TypeScript Check]
    TYPE --> BUILD[Build Test]
    BUILD --> DEPLOY[Deploy Preview]
    DEPLOY --> REVIEW[Code Review]
    REVIEW --> MERGE[Merge to Main]
    MERGE --> PROD[Production Deploy]
```

### Code Quality

1. **TypeScript**: Strict type checking
2. **ESLint**: Code linting and formatting
3. **Prettier**: Code formatting (via ESLint)
4. **Husky**: Git hooks for quality checks
5. **Conventional Commits**: Standardized commit messages

### Testing Strategy

1. **Unit Tests**: Component and utility testing
2. **Integration Tests**: API and database testing
3. **E2E Tests**: Full user journey testing
4. **Manual Testing**: User acceptance testing

### Development Commands

```bash
# Public App
cd public-app
npm run dev          # Development server (port 3000)
npm run build        # Production build
npm run lint         # ESLint check

# Dashboard App
cd dashboard-app
npm run dev          # Development server (port 3001)
npm run build        # Production build
npm run lint         # ESLint check
```

## Key Technical Decisions

### Architecture Decisions

1. **Multi-App Architecture**: Separate concerns and domains
2. **Supabase Backend**: Rapid development with built-in features
3. **Next.js 15**: Latest React features and performance
4. **TypeScript**: Type safety and developer experience
5. **Tailwind CSS**: Utility-first styling approach

### Database Decisions

1. **PostgreSQL**: Robust relational database
2. **UUID Primary Keys**: Better security and distribution
3. **Row Level Security**: Database-level authorization
4. **Audit Trails**: Comprehensive change tracking

### Frontend Decisions

1. **Server Components**: Better performance and SEO
2. **Client Components**: Interactive user interfaces
3. **Custom Hooks**: Reusable state logic
4. **Component Libraries**: Consistent UI patterns

## Future Enhancements

### Planned Features

1. **Real-time Chat**: Communication between distributors and retailers
2. **Advanced Analytics**: Business intelligence dashboard
3. **Mobile Apps**: Native iOS and Android applications
4. **API Gateway**: Public API for third-party integrations
5. **Multi-language Support**: Internationalization
6. **Advanced Search**: Elasticsearch integration
7. **Payment Processing**: Integrated payment solutions

### Technical Improvements

1. **Microservices**: Break down into smaller services
2. **Event Sourcing**: Better audit trails and state management
3. **GraphQL**: More efficient data fetching
4. **Redis Caching**: Improved performance
5. **Monitoring**: Application performance monitoring
6. **CI/CD Pipeline**: Automated testing and deployment

---

*This documentation is maintained by the development team and updated with each major release.* 