-- Fix RLS Policies for Signup Process
-- Run these commands in your Supabase SQL Editor

-- 1. Enable RLS on all tables (if not already enabled)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_verification_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE retailers ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributors ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies (if any) to avoid conflicts
DROP POLICY IF EXISTS "Users can insert their own record" ON users;
DROP POLICY IF EXISTS "Users can read their own record" ON users;
DROP POLICY IF EXISTS "Users can update their own record" ON users;

DROP POLICY IF EXISTS "Users can insert their own verification status" ON user_verification_statuses;
DROP POLICY IF EXISTS "Users can read their own verification status" ON user_verification_statuses;
DROP POLICY IF EXISTS "Users can update their own verification status" ON user_verification_statuses;

DROP POLICY IF EXISTS "Retailers can insert their own record" ON retailers;
DROP POLICY IF EXISTS "Retailers can read their own record" ON retailers;
DROP POLICY IF EXISTS "Retailers can update their own record" ON retailers;

DROP POLICY IF EXISTS "Distributors can insert their own record" ON distributors;
DROP POLICY IF EXISTS "Distributors can read their own record" ON distributors;
DROP POLICY IF EXISTS "Distributors can update their own record" ON distributors;

-- 3. Create new RLS policies for USERS table
CREATE POLICY "Users can insert their own record" ON users
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read their own record" ON users
    FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own record" ON users
    FOR UPDATE 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 4. Create RLS policies for USER_VERIFICATION_STATUSES table
CREATE POLICY "Users can insert their own verification status" ON user_verification_statuses
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own verification status" ON user_verification_statuses
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own verification status" ON user_verification_statuses
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 5. Create RLS policies for RETAILERS table
CREATE POLICY "Retailers can insert their own record" ON retailers
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Retailers can read their own record" ON retailers
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Retailers can update their own record" ON retailers
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 6. Create RLS policies for DISTRIBUTORS table
CREATE POLICY "Distributors can insert their own record" ON distributors
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Distributors can read their own record" ON distributors
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Distributors can update their own record" ON distributors
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 7. Optional: Create policies for admin access (if needed)
-- Uncomment these if you need admin users to access all records

-- CREATE POLICY "Admins can read all users" ON users
--     FOR SELECT 
--     USING (
--         EXISTS (
--             SELECT 1 FROM users 
--             WHERE id = auth.uid() 
--             AND role = 'admin'
--         )
--     );

-- CREATE POLICY "Admins can update all users" ON users
--     FOR UPDATE 
--     USING (
--         EXISTS (
--             SELECT 1 FROM users 
--             WHERE id = auth.uid() 
--             AND role = 'admin'
--         )
--     );

-- 8. Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_verification_statuses TO authenticated;
GRANT SELECT, INSERT, UPDATE ON retailers TO authenticated;
GRANT SELECT, INSERT, UPDATE ON distributors TO authenticated;

-- 9. Grant permissions to service role (for admin operations)
GRANT ALL ON users TO service_role;
GRANT ALL ON user_verification_statuses TO service_role;
GRANT ALL ON retailers TO service_role;
GRANT ALL ON distributors TO service_role; 