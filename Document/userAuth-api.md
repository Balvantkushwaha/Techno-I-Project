# UserAuth API Documentation

## Base URL
`http://localhost:3000/api/v1/auth`

## Authentication
- Login/Register success ke baad `token` cookie set hoti hai.
- Protected routes ke liye `token` cookie required hai.
- Cookie config (current code): `httpOnly: true`, `sameSite: "strict"`, `maxAge: 7 days`, `secure` only in production.

## Important Notes
- OTP expiry: **5 minutes**.
- Current implementation me `forget-password` aur `reset-password` 
- `register/init` response me OTP `data` ke andar return ho raha hai (dev/testing behavior).

---

## 1. Init Register (Send OTP)
**POST** `/register/init`

### Request Body
```json
{
  "identifier": "user@example.com"
}
```

### Success Response (200)
```json
{
  "success": true,
  "message": "OTP sent",
  "data": "123456"
}
```

### Error Responses
- `400` - User already exists
- `500` - Internal server error

---

## 2. Verify Register OTP
**POST** `/register/verify-otp`

### Request Body
```json
{
  "identifier": "user@example.com",
  "otp": "123456"
}
```

### Success Response (200)
```json
{
  "success": true,
  "verified": true,
  "message": "OTP verified",
  "nextStep": "COLLECT_USER_DETAILS"
}
```

### Error Responses
- `400` - Invalid OTP / OTP expired

---

## 3. Complete Register
**POST** `/register/complete`

### Request Body
```json
{
  "identifier": "user@example.com",
  "firstName": "Balvant",
  "lastName": "Kumar",
  "password": "Pass@123",
  "confirmPassword": "Pass@123"
}
```

### Success Response (201)
- User created
- Auth cookie (`token`) set

Example:
```json
{
  "success": true,
  "message": "Registration successful and logged in",
  "user": {
    "_id": "...",
    "firstName": "Balvant",
    "lastName": "Kumar",
    "email": "user@example.com"
  }
}
```

### Error Responses
- `400` - Passwords do not match
- `500` - Internal server error

---

## 4. Login (Password or OTP Request)
**POST** `/login/method`

### A) Password Login - Request Body
```json
{
  "identifier": "user@example.com",
  "password": "Pass@123",
  "loginMethod": "password"
}
```

### Success Response (200)
- Auth cookie (`token`) set
- User data returned

### B) OTP Login Request - Request Body
```json
{
  "identifier": "user@example.com",
  "loginMethod": "otp"
}
```

### Success Response (200)
```json
{
  "success": true,
  "message": "OTP sent for login"
}
```

### Error Responses
- `404` - User not found
- `401` - Invalid credentials (password flow)
- `500` - Internal server error

---

## 5. Verify Login OTP
**POST** `/login/verify-otp`

### Request Body
```json
{
  "identifier": "user@example.com",
  "otp": "123456"
}
```

### Success Response (200)
- OTP verified
- Auth cookie (`token`) set
- User data returned

### Error Responses
- `400` - Invalid OTP / OTP expired

---

## 6. Forget Password
**POST** `/forget-password`

### Auth
Required (`token` cookie)

### Request Body
```json
{
  "identifier": "user@example.com"
}
```

### Success Response (200)
```json
{
  "success": true,
  "message": "OTP sent for password reset"
}
```

### Error Responses
- `404` - User not found
- `500` - Internal server error

---

## 7. Reset Password
**PUT** `/reset-password`

### Auth
Required (`token` cookie)

### Request Body
```json
{
  "identifier": "user@example.com",
  "otp": "123456",
  "newPassword": "NewPass@123",
  "confirmPassword": "NewPass@123"
}
```

### Success Response (200)
```json
{
  "success": true,
  "message": "Password updated successfully. You can now login."
}
```

### Error Responses
- `400` - Passwords do not match / Invalid OTP / OTP expired
- `404` - User not found

---

## 8. Get Profile
**GET** `/profile`

### Auth
Required (`token` cookie)

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "firstName": "Balvant",
    "lastName": "Kumar",
    "email": "user@example.com"
  }
}
```

### Error Responses
- `401` - Not authorized / Token failed
- `404` - User not found

---

## 9. Logout
**POST** `/logout`

### Auth
Required (`token` cookie)

### Success Response (200)
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Behavior
- Clears `token` cookie

### Error Responses
- `500` - Internal server error
