# Kitions Admin Dashboard System

This document explains the admin dashboard system implementation for the Kitions platform.

## Overview

The admin dashboard provides secure, role-based access for platform administrators to manage users, monitor activity, and configure system settings. Only users with the `admin` role can access admin routes.

## Features Implemented

### 1. Secure Access Control
- **Middleware Protection**: All `/admin/*` routes are protected at the middleware level
- **Role Verification**: Only users with `role = 'admin'` can access admin routes
- **Session Validation**: Requires valid authentication session
- **Redirect Handling**: Non-admin users are redirected to error page

### 2. Admin Layout & Navigation
- **Responsive Sidebar**: Clean navigation with icons and active states
- **Mobile Support**: Collapsible sidebar for mobile devices
- **User Menu**: Admin profile dropdown with sign-out functionality
- **Breadcrumbs**: Dynamic page titles based on current route

### 3. Dashboard Overview
- **Key Metrics**: Total users, pending verifications, distributors, retailers
- **Recent Activity**: Latest user sign-ups with verification status
- **Quick Actions**: Direct links to common admin tasks
- **Real-time Data**: Live statistics from Supabase

### 4. User Management
- **User Table**: Comprehensive view of all platform users
- **Search & Filter**: Find users by name, email, business, or role
- **Verification Control**: Approve/reject user verifications directly
- **Status Indicators**: Visual status badges and icons
- **Bulk Actions**: Efficient management of multiple users

### 5. Database Security (RLS Policies)
- **Admin Read Access**: Admins can view all users and verification statuses
- **Admin Write Access**: Admins can update verification statuses
- **Secure Queries**: All data access is secured through RLS policies
- **Role-based Permissions**: Database-level security enforcement

## Directory Structure

```
dashboard-app/app/admin/
├── layout.tsx              # Admin layout with sidebar navigation
├── dashboard/
│   └── page.tsx            # Main dashboard with stats and overview
├── users/
│   └── page.tsx            # User management and verification
├── distributors/
│   └── page.tsx            # Distributor overview (placeholder)
├── products/
│   └── page.tsx            # Product management (placeholder)
├── analytics/
│   └── page.tsx            # Platform analytics (placeholder)
└── settings/
    └── page.tsx            # Admin settings (placeholder)
```

## Setup Instructions

### 1. Database Policies

Run the SQL script in `dashboard-app/admin-rls-policies.sql` in your Supabase SQL Editor:

```sql
-- This creates RLS policies allowing admin users to:
-- - Read all users and verification statuses
-- - Update verification statuses
-- - Insert new verification records
-- - Access distributor and retailer data
```

### 2. Create Admin User

To create an admin user, update an existing user's role in the database:

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';
```

### 3. Access the Admin Dashboard

1. Sign in with an admin account
2. Navigate to `/admin/dashboard`
3. The middleware will verify admin access automatically

## Security Model

### Middleware Protection

```typescript
// Check admin access for admin routes
if (isAdminRoute && isVerified) {
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single();
    
  if (userData?.role !== 'admin') {
    return NextResponse.redirect(new URL('/error-auth', req.url));
  }
}
```

### Database Policies

```sql
-- Example: Admin read access to all users
CREATE POLICY "Admins can read all users" ON users
    FOR SELECT 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );
```

## API Integration

### Data Fetching

All admin pages use the Supabase browser client with proper RLS policies:

```typescript
const { data: users, error } = await supabase
  .from('users')
  .select('id, email, first_name, last_name, business_name, role, created_at')
  .order('created_at', { ascending: false });
```

### Verification Updates

Admins can update user verification status:

```typescript
const { error } = await supabase
  .from('user_verification_statuses')
  .update({ status: 'verified', updated_at: new Date().toISOString() })
  .eq('user_id', userId);
```

## Navigation Structure

### Primary Navigation
- **Dashboard**: Overview and key metrics
- **User Management**: User verification and management
- **Distributors**: Distributor performance (placeholder)
- **Products**: Product management (placeholder)
- **Analytics**: Platform analytics (placeholder)
- **Settings**: System configuration (placeholder)

### User Experience
- **Responsive Design**: Works on desktop and mobile
- **Loading States**: Smooth loading indicators
- **Error Handling**: Graceful error messages
- **Real-time Updates**: Live data refresh

## Error Handling

### Access Denied
- Non-admin users are redirected to `/error-auth`
- Clear error messages for unauthorized access
- Proper logging for security auditing

### Data Errors
- Database errors are caught and displayed
- Graceful fallbacks for missing data
- User-friendly error messages

## Performance Considerations

### Optimized Queries
- Efficient Supabase queries with specific field selection
- Pagination support (ready for implementation)
- Indexed database columns for fast lookups

### Client-Side Optimization
- React state management for smooth interactions
- Debounced search and filtering
- Lazy loading for large datasets

## Future Enhancements

### Planned Features
1. **Advanced Analytics**: Charts and detailed metrics
2. **Product Management**: Full CRUD operations for products
3. **Distributor Tools**: Performance monitoring and management
4. **System Settings**: Configuration management
5. **Audit Logs**: Track admin actions and changes
6. **Bulk Operations**: Mass user operations
7. **Export Functionality**: Data export capabilities

### Security Enhancements
1. **Two-Factor Authentication**: Additional security for admin accounts
2. **Session Management**: Advanced session controls
3. **IP Whitelisting**: Restrict admin access by IP
4. **Audit Trail**: Comprehensive action logging

## Troubleshooting

### Common Issues

1. **Access Denied**: Ensure user has `role = 'admin'` in database
2. **Data Not Loading**: Check RLS policies are applied
3. **Middleware Errors**: Verify session and role verification logic
4. **UI Issues**: Check component imports and styling

### Debug Steps

1. Check browser console for errors
2. Verify admin role in database
3. Test RLS policies in Supabase
4. Review middleware logs
5. Check authentication state

## Development Notes

### Code Organization
- Components are modular and reusable
- TypeScript interfaces for type safety
- Consistent error handling patterns
- Clean separation of concerns

### Testing Considerations
- Test admin access control
- Verify RLS policy enforcement
- Test user verification workflows
- Validate error handling

---

This admin system provides a solid foundation for platform administration with room for future expansion and enhancement. 