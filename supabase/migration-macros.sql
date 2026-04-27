-- Add macro/calorie columns to recipes table
-- Run this in Supabase SQL Editor

ALTER TABLE recipes ADD COLUMN IF NOT EXISTS calories INTEGER;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS protein INTEGER;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS carbs INTEGER;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS fat INTEGER;
