# Carton Caps Referral Service

## Introduction
The Carton Caps Referral Service is a microservice that manages the referral system for the Carton Caps mobile app. It provides functionality for users to create referral links, track their referrals, and convert referrals when new users join through these links. Built with Node.js, Express, and TypeScript, it follows Clean Architecture principles to ensure maintainability and testability.

## Features
- Create and manage referral deep links
- Track referral status and conversions
- Secure server-to-server communication
- JWT-based client authentication
- Swagger API documentation
- Comprehensive test coverage

## Getting Started

### Prerequisites
- Node.js 20 or higher
- npm or yarn
- Git

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd carton-caps-referral-service
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```env
   PORT=3000
   NODE_ENV=development
   API_PREFIX=/api
   SWAGGER_ENABLED=true
   SWAGGER_PATH=/docs
   CLIENT_SECRET=your_client_secret
   SERVER_SIGNATURE_SECRET=your_server_secret
   ```

### Running the Application
- Development mode:
  ```bash
  npm run dev
  ```

- Production build and run:
  ```bash
  npm run build
  npm start
  ```

The server will start on port 3000 (configurable via PORT env variable).

## API Documentation

### Overview
The API is divided into client-facing endpoints (mobile app) and server-facing endpoints (core service). Detailed API documentation is available via Swagger at `/docs` when the server is running.

### Authentication
- **Client Authentication**: JWT-based authentication for mobile app requests
- **Server Authentication**: Signature-based authentication for server-to-server communication
- **Development Mode**: Special endpoint available to generate test tokens

### Client Endpoints

1. **Generate Test Token** (Development Only)
   ```bash
   # POST /api/auth/authorize
   curl -X POST http://localhost:3000/api/auth/authorize \
     -H "Content-Type: application/json" \
     -d '{"userId": "test_user_123"}'
   ```

2. **Create Referral Link**
   ```bash
   # POST /api/referrals/deep-link
   curl -X POST http://localhost:3000/api/referrals/deep-link \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"expiration": 86400}'
   ```

3. **Get User Referrals**
   ```bash
   # GET /api/referrals
   curl -X GET http://localhost:3000/api/referrals \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

### Server Endpoints

1. **Convert Referral**
   ```bash
   # POST /api/referrals/convert
   curl -X POST http://localhost:3000/api/referrals/convert \
     -H "X-Signature: serversecret" \
     -H "Content-Type: application/json" \
     -d '{
       "referralCode": "REF123ABC",
       "newUser": {
         "id": "usr_2024_03_19_001",
         "email": "john.doe@example.com",
         "firstName": "John",
         "lastName": "Doe",
         "phoneNumber": "+1234567890",
         "deviceId": "d3v1c3_1d_4bc",
         "dob": "1990-05-15",
         "createdAt": "2024-03-19T03:02:28.897Z",
         "updatedAt": "2024-03-19T03:02:28.897Z",
         "referralCode": "JOHNDOE123"
       }
     }'
   ```

## Architecture

### Clean Architecture
The project follows Clean Architecture principles with clear separation of concerns:

1. **API Layer** (`src/api/`): HTTP interface and request handling
2. **Domain Layer** (`src/domain/`): Business entities and interfaces
3. **Infrastructure Layer** (`src/infrastructure/`): External implementations
4. **Application Layer** (`src/use-cases/`): Business logic orchestration

### Design Decisions

1. **Authentication**:
   - Client authentication uses JWT tokens
   - Server-to-server calls use a signature-based authentication
   - Development mode includes a special endpoint to generate test tokens

2. **User Management**:
   - User identity is managed by a separate core service
   - This service only stores referral-specific information
   - User validation happens through the core service API

3. **Referral Rules**:
   - Users can't refer themselves (checked via device ID and phone number)
   - Rate limiting is implemented (max 10 referrals per 24 hours)
   - Referral links can optionally expire
   - Referral conversion happens after user registration

4. **Data Storage**:
   - Currently uses in-memory storage for development
   - Designed to be easily extended to use a proper database

### Project Structure
```
carton-caps-referral-service/
├── src/
│   ├── api/                    # API Layer
│   │   ├── controllers/        # Request handlers
│   │   ├── dtos/              # Data Transfer Objects
│   │   ├── middlewares/       # Express middlewares
│   │   └── routes/            # Route definitions
│   ├── config/                 # Configuration
│   ├── domain/                 # Domain Layer
│   │   ├── models/            # Domain models
│   │   ├── repositories/      # Repository interfaces
│   │   └── services/          # Domain service interfaces
│   ├── infrastructure/         # Infrastructure Layer
│   │   ├── api/               # External API clients
│   │   ├── database/          # Database implementations
│   │   ├── deep-link/         # Deep linking service
│   │   └── validation/        # Validation implementations
│   ├── use-cases/             # Application Layer
│   └── app.ts                 # Application entry point
├── tests/                     # Test files
└── [config files]            # Configuration files
```

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Future Improvements

1. **Technical Improvements**:
   - Implement PostgreSQL database
   - Add database migrations
   - Add API rate limiting
   - Implement proper logging
   - Add monitoring and metrics
   - Set up CI/CD pipeline
   - Add integration tests
   - Add load testing

2. **Feature Improvements**:
   - Add referral reward tracking
   - Implement referral tiers/levels
   - Add referral analytics
   - Support multiple referral programs
   - Add webhook notifications
   - Support bulk operations
   - Add link tracking/analytics

3. **Security Improvements**:
   - Implement proper HMAC for server auth
   - Add request signing
   - Add API key rotation
   - Implement secrets management
   - Add audit logging
   - Add fraud detection

4. **Documentation Improvements**:
   - Add API versioning
   - Add postman collection
   - Add architecture diagrams
   - Add deployment guide
   - Add contribution guidelines

## License
This project is licensed under the MIT License.