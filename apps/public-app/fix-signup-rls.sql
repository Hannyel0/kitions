-- Fix RLS Policies for Signup Issue
-- Run this in your Supabase SQL Editor

-- First, let's check what policies currently exist
-- (You can run this separately to see current state)
/*
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('users', 'user_verification_statuses', 'retailers', 'distributors')
ORDER BY tablename, policyname;
*/

-- Fix for USERS table
-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Users can insert their own record" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON users;
DROP POLICY IF EXISTS "Users can only insert their own profile" ON users;

-- Create the correct policy for users table
CREATE POLICY "Allow users to insert their own record during signup" ON users
    FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Also ensure users can read their own record
CREATE POLICY "Users can read their own record" ON users
    FOR SELECT 
    TO authenticated
    USING (auth.uid() = id);

-- Fix for USER_VERIFICATION_STATUSES table
DROP POLICY IF EXISTS "Users can insert their own verification status" ON user_verification_statuses;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_verification_statuses;

CREATE POLICY "Allow users to insert their verification status" ON user_verification_statuses
    FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Fix for RETAILERS table
DROP POLICY IF EXISTS "Retailers can insert their own record" ON retailers;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON retailers;

CREATE POLICY "Allow retailers to insert their record" ON retailers
    FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Fix for DISTRIBUTORS table
DROP POLICY IF EXISTS "Distributors can insert their own record" ON distributors;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON distributors;

CREATE POLICY "Allow distributors to insert their record" ON distributors
    FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Ensure proper permissions are granted
GRANT INSERT, SELECT, UPDATE ON users TO authenticated;
GRANT INSERT, SELECT, UPDATE ON user_verification_statuses TO authenticated;
GRANT INSERT, SELECT, UPDATE ON retailers TO authenticated;
GRANT INSERT, SELECT, UPDATE ON distributors TO authenticated;

-- Verify RLS is enabled (should already be, but just in case)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_verification_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE retailers ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributors ENABLE ROW LEVEL SECURITY;

-- Check the results (run this after the above)
/*
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    cmd,
    CASE 
        WHEN cmd = 'INSERT' THEN with_check
        WHEN cmd = 'SELECT' THEN qual
        ELSE 'N/A'
    END as policy_condition
FROM pg_policies 
WHERE tablename IN ('users', 'user_verification_statuses', 'retailers', 'distributors')
    AND cmd IN ('INSERT', 'SELECT')
ORDER BY tablename, cmd;
*/ 