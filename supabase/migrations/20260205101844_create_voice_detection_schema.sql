/*
  # Voice Detection API Schema

  1. New Tables
    - `api_keys`
      - `id` (uuid, primary key)
      - `key` (text, unique) - The API key
      - `name` (text) - Name/description of the key
      - `is_active` (boolean) - Whether the key is active
      - `created_at` (timestamptz)
      - `last_used_at` (timestamptz)
    
    - `detection_logs`
      - `id` (uuid, primary key)
      - `api_key_id` (uuid, foreign key to api_keys)
      - `language` (text) - Detected or specified language
      - `result` (text) - AI_GENERATED or HUMAN
      - `confidence` (decimal) - Confidence score 0.0-1.0
      - `audio_duration` (decimal) - Duration in seconds
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for service role access (for edge functions)
    - Public read access to api_keys for validation (but only key validation)
*/

-- Create api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  name text NOT NULL DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  last_used_at timestamptz
);

-- Create detection_logs table
CREATE TABLE IF NOT EXISTS detection_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id uuid REFERENCES api_keys(id) ON DELETE SET NULL,
  language text,
  result text NOT NULL,
  confidence decimal(3,2) NOT NULL,
  audio_duration decimal(10,2),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE detection_logs ENABLE ROW LEVEL SECURITY;

-- Policies for api_keys (allow service role full access)
CREATE POLICY "Service role can manage api_keys"
  ON api_keys
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policies for detection_logs (allow service role full access)
CREATE POLICY "Service role can manage detection_logs"
  ON detection_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create an index for faster API key lookups
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key) WHERE is_active = true;

-- Create an index for detection logs by api_key_id
CREATE INDEX IF NOT EXISTS idx_detection_logs_api_key_id ON detection_logs(api_key_id);

-- Insert a sample API key for testing
INSERT INTO api_keys (key, name, is_active)
VALUES ('test_key_' || gen_random_uuid()::text, 'Test API Key', true)
ON CONFLICT (key) DO NOTHING;