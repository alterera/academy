# Admin Panel Setup Guide

## Creating an Admin User

To create your first admin user, you have two options:

### Option 1: Using the Script (Recommended)

Run the create-admin script:

```bash
npx tsx scripts/create-admin.ts <username> <password> [name] [email]
```

**Example:**
```bash
npx tsx scripts/create-admin.ts admin mySecurePassword123 "Admin User" admin@example.com
```

**Note:** If `tsx` is not installed, install it first:
```bash
npm install -D tsx
```

### Option 2: Using MongoDB Directly

1. Connect to your MongoDB database
2. Insert an admin document into the `admins` collection:

```javascript
// In MongoDB shell or MongoDB Compass
db.admins.insertOne({
  username: "admin",
  password: "<bcrypt-hashed-password>", // Use bcrypt to hash your password
  name: "Admin User",
  email: "admin@example.com",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

To hash a password using Node.js:
```javascript
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash('your-password', 10);
console.log(hash);
```

## Admin Login

1. Navigate to `/admin/login`
2. Enter your username and password
3. You'll be redirected to `/admin` dashboard upon successful login

## Admin Features

- **Username/Password Authentication**: Simple authentication without OTP
- **Session Management**: Secure session-based authentication
- **Route Protection**: All admin routes are protected and require authentication
- **Auto-redirect**: Unauthenticated users are automatically redirected to login page

## Security Notes

- Admin passwords are hashed using bcrypt (10 rounds)
- Sessions are stored securely using iron-session
- Admin routes are protected at the layout level
- Only active admin accounts can log in

## Admin Model Schema

```typescript
{
  username: string;      // Unique, lowercase, 3-50 characters
  password: string;       // bcrypt hashed
  name?: string;         // Display name
  email?: string;        // Email address
  isActive: boolean;     // Account status (default: true)
  lastLogin?: Date;      // Last login timestamp
  createdAt: Date;       // Account creation date
  updatedAt: Date;       // Last update date
}
```

