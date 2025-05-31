# User Verification Lockdown System

This document explains how the user verification system works in the Kitions dashboard application.

## Overview

The verification system prevents unverified users from accessing the dashboard until their account has been approved by an administrator. This ensures that only legitimate businesses can access the platform.

## How It Works

### 1. Middleware Protection

The dashboard app's middleware (`middleware.ts`) automatically checks every request for:

1. **Authentication Status**: User must have a valid session
2. **Verification Status**: User must have an approved verification status

### 2. Verification Status Flow

```
User Signs Up → Account Created (No verification record)
                     ↓
Admin Reviews → Creates verification record with status:
                     ↓
    ┌─────────────────┼─────────────────┐
    ▼                 ▼                 ▼
'pending'         'verified'       'rejected'
    ↓                 ↓                 ↓
Redirect to       Allow access    Redirect to
pending page      to dashboard    pending page
```

### 3. Database Schema

The verification system uses the `user_verification_statuses` table:

```sql
user_verification_statuses (
  user_id UUID (FK to users.id),
  status ENUM('pending', 'verified', 'rejected'),
  updated_at TIMESTAMP
)
```

### 4. Verification Status Values

- **`pending`**: User account is under review
- **`verified`**: User account has been approved (allows dashboard access)
- **`rejected`**: User account has been rejected
- **No record**: User hasn't been reviewed yet (treated as pending)

## Implementation Details

### Middleware Logic

The middleware follows this flow:

1. Check if user has a valid session
2. If no session → redirect to login
3. If session exists → check verification status
4. If not verified → redirect to `/pending-verification`
5. If verified → allow access to dashboard

### Protected vs Public Routes

**Protected Routes** (require verification):
- `/distributor/*`
- `/retailer/*`
- All dashboard functionality

**Public Routes** (accessible without verification):
- `/pending-verification`
- `/auth/callback`
- `/error-auth`
- Static assets

### Automatic Redirects

- **Unverified users** accessing dashboard → `/pending-verification`
- **Verified users** accessing pending page → appropriate dashboard (`/distributor/home` or `/retailer/home`)

## User Experience

### For Unverified Users

1. User signs up through public app
2. User is redirected to dashboard
3. Middleware detects unverified status
4. User sees pending verification page with:
   - Current verification status
   - Contact information for support
   - Ability to sign out
   - Refresh status button

### For Verified Users

1. User signs up and gets verified by admin
2. User can access full dashboard functionality
3. No restrictions on dashboard features

## Admin Workflow

Admins need to:

1. Review new user signups
2. Create verification records in `user_verification_statuses` table
3. Set appropriate status (`verified`, `rejected`, or `pending`)
4. Users automatically get access/restrictions based on status

## Custom Hook

The `useVerificationStatus` hook provides:

```typescript
{
  user: User | null;
  verificationStatus: VerificationStatus | null;
  loading: boolean;
  error: Error | null;
  isVerified: boolean;
  refreshStatus: () => Promise<void>;
}
```

This can be used in any component that needs to check verification status.

## Error Handling

The system handles:

- **No verification record**: Treated as pending
- **Database errors**: Redirect to pending verification for safety
- **Session errors**: Redirect to login
- **Network issues**: Show error state with retry option

## Security Considerations

- Verification check happens at middleware level (cannot be bypassed)
- Database-level Row Level Security (RLS) provides additional protection
- All verification queries use the authenticated user's ID
- No client-side verification bypasses possible

## Customization

To modify verification behavior:

1. Update middleware logic in `middleware.ts`
2. Modify status values in database types
3. Update UI messages in `pending-verification/page.tsx`
4. Adjust hook logic in `useVerificationStatus.ts`

## Testing

To test the verification system:

1. Create a user account
2. Don't create verification record (or set to 'pending'/'rejected')
3. Try accessing dashboard routes
4. Verify redirect to pending verification page
5. Update status to 'verified' in database
6. Verify dashboard access is granted 