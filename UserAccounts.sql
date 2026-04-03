-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create user_account table
CREATE TABLE user_account (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    enabled BOOLEAN DEFAULT TRUE,
    account_non_locked BOOLEAN DEFAULT TRUE,
    failed_attempts INTEGER DEFAULT 0,
    CONSTRAINT username_min_length CHECK (char_length(user_name) >= 3)
);

-- Create index for faster lookups
CREATE INDEX idx_user_name ON user_account(user_name);

-- Create function to automatically update timestamp
CREATE OR REPLACE FUNCTION update_last_login_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_login = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update last_login on update
CREATE TRIGGER update_user_last_login
    BEFORE UPDATE ON user_account
    FOR EACH ROW
    EXECUTE FUNCTION update_last_login_column();