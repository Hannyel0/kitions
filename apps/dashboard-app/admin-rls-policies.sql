-- Admin RLS Policies for User Management
-- Run this in your Supabase SQL Editor to enable admin access

-- 1. Add policies for admin users to read all users
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

-- 2. Add policies for admin users to update all users (for role changes if needed)
CREATE POLICY "Admins can update all users" ON users
    FOR UPDATE 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- 3. Add policies for admin users to read all verification statuses
CREATE POLICY "Admins can read all verification statuses" ON user_verification_statuses
    FOR SELECT 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- 4. Add policies for admin users to update all verification statuses
CREATE POLICY "Admins can update all verification statuses" ON user_verification_statuses
    FOR UPDATE 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- 5. Add policies for admin users to insert verification statuses (for users who don't have one yet)
CREATE POLICY "Admins can insert verification statuses" ON user_verification_statuses
    FOR INSERT 
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- 6. Add policies for admin users to read all retailers
CREATE POLICY "Admins can read all retailers" ON retailers
    FOR SELECT 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- 7. Add policies for admin users to read all distributors
CREATE POLICY "Admins can read all distributors" ON distributors
    FOR SELECT 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- 8. Verify the policies were created
-- You can run this query to check the policies:
/*
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    cmd,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE policyname LIKE '%Admin%'
ORDER BY tablename, policyname;
*/ 