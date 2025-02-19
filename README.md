# Carton Caps Referral Service

## Overview
The **Carton Caps Referral Service** is a microservice that manages referrals for the Carton Caps mobile app. It enables users to:
- Create deferred links (client-side)
- Track completed referrals (client-side)
- Validate and convert referrals (server-side during registration)

### Tech Stack
| Technology | Purpose |
|------------|---------|
| **Express.js** | Simple yet highly customizable web framework for Node.js, used by thousands of developers and companies.|
| **TypeScript** | Static typing for JavaScript |
| **Class Validator** | Validates API request bodies |

This service follows **[Clean Architecture principles](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)** for modularity and testability.
To adopt it for Express, I followed [this guide](https://dev.to/dipakahirav/modern-api-development-with-nodejs-express-and-typescript-using-clean-architecture-1m77) with some modifications of my own.

---

## Getting Started

### Prerequisites
- Node.js `20+`
- npm `10.7.0+`
- Git

### Installation & Setup
```bash
git clone https://github.com/incuedAA/carton-caps-referral-service.git
cd carton-caps-referral-service
npm install
cp .env.example .env  # Configure environment variables
```

### Running the Service

- **Production Mode** _(recommended)_:
  ```bash
  npm run build
  npm start
  ```
 - **Development Mode** _(for live-reloading code, note that the in-memory DB will restart every time as well)_:
      ```bash
      npm run dev
      ```
  The service runs on port `3000` (configurable via `PORT` in `.env`).

---

## Authentication
| Type | Method |
|------|--------|
| **Client Authentication** | JWT-based authentication (Bearer token) |
| **Server Authentication** | Signature-based (set `x-signature` header) |

💡 **Test Token Generation** (_Development only_):
```bash
curl -X POST http://localhost:3000/api/auth/authorize \
-H "Content-Type: application/json"  \
-d '{"userId": "referring-user-id"}'
```

---

## API Endpoints

### Client Endpoints

#### Create Referral Link
- **Endpoint:** `POST /api/referrals/deep-link`
- **Description:** Creates a new referral with deep link generation.
- **Security:** Requires JWT authentication.

#### Get User Referrals
- **Endpoint:** `GET /api/referrals`
- **Description:** Retrieves all referrals for the authenticated user. Only `COMPLETED` referrals are returned.
- **Security:** Requires JWT authentication.

### Server Endpoints

#### Convert Referral
- **Endpoint:** `POST /api/referrals/convert`
- **Description:** Converts a referral during user registration. Performs validation checks (rate limiting, phone number uniqueness, etc.).
- **Security:** Requires `x-signature` header authentication.

📘 **Full API documentation is available via Swagger** at `/docs` when the service is running.


---

## Business Logic

### Referral Rules
- Users **cannot refer themselves**.
- **Rate limiting**: Maximum **10 referrals per 24 hours**.
- Referral conversion occurs **only after user registration**.
- The referrer and the new user **must have different phone numbers**.

### Referral Flow (For the sake of this exercise)
- **Create Referral Link**: Should be called when a user clicks any of the share buttons
- **Get User Referrals**: Should be called on entering the referral screen.
- **Convert Referral**: Should be called during the core server's registration flow. The result should be appended to the "registration" endpoint response body so the application can know whether a referral went through


### Data Storage
- **Development Mode**: Uses in-memory storage.
- **Production Ready**: Can be extended to use a database.

---

## Folder Structure

```plaintext
carton-caps-referral-service/
├── src/
│   ├── api/            # HTTP routes & controllers
│   ├── domain/         # Business logic & models
│   ├── infrastructure/ # External integrations, storage, validation
│   ├── use-cases/      # Application logic
│   ├── config/         # Configuration files
│   └── app.ts          # Entry point
└── tests/              # Test cases
```

---


## Error Handling

All API responses follow a consistent error handling strategy:
- **`422 Unprocessable Entity`**: Validation errors, such as missing or incorrect fields.
- **`400 Bad Request`**: Business rule violations (e.g., self-referral attempts, exceeded referral limits).
- **`401 Unauthorized`**: Missing or invalid authentication tokens.
- **`500 Internal Server Error`**: Unexpected server failures.

Each error response includes a structured JSON body with an `errorCode` and `message` field for better debugging.

---

## Quick Testing Instructions

The following are instructions for testing the "happy path" of the application using test data (see [mockData.ts](src/infrastructure/mocks/mockData.ts))

1. Create an authorization token with the **/authorize** endpoint, using **referring-user-id** as the userId. Paste this into the request headers for all client requests `Authorization: Bearer <token>`
2. Generate a deep link from the **/referrals/deep-link** endpoint (no parameters needed).
3. GET all referrals for your user from the **/referrals** endpoint; it should return 0 referrals.
4. Send a POST request to the **/referrals/convert** endpoint, using the same test user's referral code and any new user body. Remember to set `x-signature` to the M2M signature (by default it's *myserversecret*).
5. Send a GET request to the `/referrals` endpoint again; this time, the new referral should be available for that user.

Sample test user payload:
```json
{
  "referralCode": "REF123", // same referral code as the referring-user-id
  "newUser": {
    "id": "new-user-id2",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "referrer@example.com",
    "phoneNumber": "+9876543211",
    "dob": "1990-01-01",
    "createdAt": "2025-02-19T03:27:05.518Z",
    "updatedAt": "2025-02-19T03:27:05.518Z",
    "referralCode": "REF4"
  }
}
```

---

## Development & Testing

### Running Tests
```bash
npm run test
```

### Linting
```bash
npm run lint
```

---

## Improvements

> **Note**: This API is too small to be a standalone microservice. Ideally, it should be integrated into the core API.



✅ **Enhance rate limiting** to be more dynamic (e.g. different limits for different users, smaller window based on number of times a user has hit the limit)
✅ **Improve logging** (use `winston` for structured logs)  
✅ **Implement proper HMAC** for `x-signature`  
✅ **Support API key rotation**  
✅ **Enable secrets management** (e.g., AWS Secrets Manager)  
✅ **Enhance fraud detection**, either via a dedicated fingerprinting platform, or by using an analytics provider to track user's referral patterns and create an in-house flagging system for repeat offenders.
---

## License
This project is licensed under the **MIT License**.
