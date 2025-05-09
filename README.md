# Biometric Authentication Server

A NestJS GraphQL server implementing biometric authentication with support for 10-finger biometric login.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone https://github.com/danielnifty1/divic_assessment_v2.git
cd imsu-server-v3
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/dbname"
JWT_SECRET="your-secret-key"
JWT_EXPIRATION="24h"
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run start:dev
```

The server will run on `http://localhost:3000/graphql`

## Testing

### Unit Tests

The project includes comprehensive unit tests for both the service and resolver layers:

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

### Test Coverage

The tests cover the following scenarios:

#### Auth Service Tests
- User Registration
  - Successful registration
  - Duplicate email handling
  - Password hashing
  - JWT token generation

- User Login
  - Successful login
  - Invalid credentials
  - Password comparison
  - JWT token generation

- Biometric Authentication
  - Successful biometric login
  - Invalid biometric key
  - Multiple finger support
  - Token generation

- Biometric Setup
  - Successful biometric registration
  - Duplicate biometric handling
  - User association
  - Token generation

#### Auth Resolver Tests
- GraphQL Mutations
  - Register mutation
  - Login mutation
  - Biometric login mutation
  - Set biometric mutation

- Authentication Guards
  - Protected route handling
  - User context injection
  - GraphQL context management

### E2E Tests

To run end-to-end tests:

```bash
# Run e2e tests
npm run test:e2e
```

## API Usage

### 1. Register a new user
```graphql
mutation Register($input: SignUpInput!) {
  register(input: $input) {
    token
    user {
      id
      email
      name
    }
  }
}
```
Variables:
```json
{
  "input": {
    "email": "user@example.com",
    "password": "password123",
    "name": "Test User"
  }
}
```

### 2. Standard Login
```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
    user {
      id
      email
      name
    }
  }
}
```
Variables:
```json
{
  "input": {
    "email": "user@example.com",
    "password": "password123"
  }
}
```

### 3. Set Biometric Data
```graphql
mutation SetBiometric($input: BiometricInput!) {
  setBiometric(input: $input) {
    token
    user {
      id
      email
      name
    }
  }
}
```
Variables:
```json
{
  "input": {
    "right_thumb_finger": "thumb123",
    "right_index_finger": "index123",
    "right_middle_finger": "middle123",
    "right_ring_finger": "ring123",
    "right_short_finger": "short123",
    "left_thumb_finger": "leftthumb123",
    "left_index_finger": "leftindex123",
    "left_middle_finger": "leftmiddle123",
    "left_ring_finger": "leftring123",
    "left_short_finger": "leftshort123"
  }
}
```
Headers:
```
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### 4. Biometric Login
```graphql
mutation BiometricLogin($input: BiometricLoginInput!) {
  biometricLogin(input: $input) {
    token
    user {
      id
      email
      name
    }
  }
}
```
Variables:
```json
{
  "input": {
    "biometric_key": "thumb123"
  }
}
```

## Testing with Postman

1. Create a new POST request to `http://localhost:3000/graphql`
2. Set headers:
   - `Content-Type: application/json`
   - `Authorization: Bearer YOUR_JWT_TOKEN` (for protected routes)
3. Set body to raw JSON with the GraphQL query and variables
4. Send the request

## Features

- User registration and authentication
- JWT-based authentication
- 10-finger biometric support
- GraphQL API
- PostgreSQL database with Prisma ORM
- TypeScript support

## Error Handling

The API returns appropriate error messages for:
- Invalid credentials
- Duplicate biometric keys
- Unauthorized access
- Invalid input data

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Protected routes using Guards
- Unique constraints on biometric keys
