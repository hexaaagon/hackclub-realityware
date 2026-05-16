-- Enable Row Level Security on user-related tables
-- This ensures that users can only access their own data

-- user table
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read/write their own users" ON "user";
CREATE POLICY "Users can read/write their own users"
ON "user"
FOR ALL
USING ("id" = current_user_id());

-- session table
ALTER TABLE "session" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read/write their own sessions" ON "session";
CREATE POLICY "Users can read/write their own sessions"
ON "session"
FOR ALL
USING ("id" = current_user_id());

-- account table
ALTER TABLE "account" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read/write their own accounts" ON "account";
CREATE POLICY "Users can read/write their own accounts"
ON "account"
FOR ALL
USING ("id" = current_user_id());

-- verification table
ALTER TABLE "verification" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read/write their own verifications" ON "verification";
CREATE POLICY "Users can read/write their own verifications"
ON "verification"
FOR ALL
USING (identifier = (SELECT email FROM "user" WHERE id = current_user_id()));
