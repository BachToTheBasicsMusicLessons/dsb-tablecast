/*
  # Create matches table for billiards streaming app

  1. New Tables
    - `matches`
      - `id` (uuid, primary key)
      - `match_type` (text) - e.g., "APA 8-Ball"
      - `player_a_name` (text) - Player A name
      - `player_a_team` (text) - Player A team name
      - `player_a_skill` (text) - Player A skill level, e.g., "SL6 (50)"
      - `player_a_score` (integer) - Player A current score
      - `player_b_name` (text) - Player B name
      - `player_b_team` (text) - Player B team name
      - `player_b_skill` (text) - Player B skill level, e.g., "SL6 (50)"
      - `player_b_score` (integer) - Player B current score
      - `match_score_a` (integer) - Team A match score
      - `match_score_b` (integer) - Team B match score
      - `created_at` (timestamptz) - When match was created
      - `updated_at` (timestamptz) - Auto-updated on any change

  2. Security
    - Enable RLS on `matches` table
    - Add policy for public read access (for streaming)
    - Add policy for authenticated users to create/update matches

  3. Real-time
    - Enable real-time replication for live updates
*/

CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_type text NOT NULL DEFAULT 'APA 8-Ball',
  player_a_name text NOT NULL DEFAULT 'Player A',
  player_a_team text NOT NULL DEFAULT 'Team A',
  player_a_skill text NOT NULL DEFAULT 'SL6 (50)',
  player_a_score integer NOT NULL DEFAULT 0,
  player_b_name text NOT NULL DEFAULT 'Player B',
  player_b_team text NOT NULL DEFAULT 'Team B',
  player_b_skill text NOT NULL DEFAULT 'SL6 (50)',
  player_b_score integer NOT NULL DEFAULT 0,
  match_score_a integer NOT NULL DEFAULT 0,
  match_score_b integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Policy for public read access (allows viewers to see match data)
CREATE POLICY "Anyone can view matches"
  ON matches
  FOR SELECT
  TO public
  USING (true);

-- Policy for authenticated users to create matches
CREATE POLICY "Authenticated users can create matches"
  ON matches
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy for authenticated users to update matches
CREATE POLICY "Authenticated users can update matches"
  ON matches
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at on any change
CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable real-time replication for the matches table
ALTER PUBLICATION supabase_realtime ADD TABLE matches;