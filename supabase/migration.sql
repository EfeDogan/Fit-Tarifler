-- ============================================
-- Idempotent Migration: Run this SAFELY multiple times
-- Run in Supabase SQL Editor
-- ============================================

-- 1. Migrate image_url → image_urls (JSONB)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'recipes' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE recipes ADD COLUMN IF NOT EXISTS image_urls JSONB DEFAULT '[]';
    UPDATE recipes SET image_urls = jsonb_build_array(image_url) WHERE image_url IS NOT NULL AND (image_urls IS NULL OR image_urls = '[]');
    ALTER TABLE recipes DROP COLUMN image_url;
  END IF;
END $$;

-- Ensure image_urls column exists
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS image_urls JSONB DEFAULT '[]';

-- 2. Ensure description column exists
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS description TEXT;

-- 3. Create labels table if not exists
CREATE TABLE IF NOT EXISTS labels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  color TEXT NOT NULL DEFAULT '#000000'
);

ALTER TABLE labels ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'labels' AND policyname = 'Labels are viewable by everyone'
  ) THEN
    CREATE POLICY "Labels are viewable by everyone" ON labels FOR SELECT USING (true);
  END IF;
END $$;

-- 4. Create recipe_labels join table if not exists
CREATE TABLE IF NOT EXISTS recipe_labels (
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  label_id UUID REFERENCES labels(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (recipe_id, label_id)
);

ALTER TABLE recipe_labels ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'recipe_labels' AND policyname = 'Recipe labels are viewable by everyone') THEN
    CREATE POLICY "Recipe labels are viewable by everyone" ON recipe_labels FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'recipe_labels' AND policyname = 'Authenticated users can add labels to recipes') THEN
    CREATE POLICY "Authenticated users can add labels to recipes" ON recipe_labels FOR INSERT
      WITH CHECK (EXISTS (SELECT 1 FROM recipes WHERE recipes.id = recipe_labels.recipe_id AND recipes.author_id = auth.uid()));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'recipe_labels' AND policyname = 'Authors can remove labels from recipes') THEN
    CREATE POLICY "Authors can remove labels from recipes" ON recipe_labels FOR DELETE
      USING (EXISTS (SELECT 1 FROM recipes WHERE recipes.id = recipe_labels.recipe_id AND recipes.author_id = auth.uid()));
  END IF;
END $$;

-- 5. Seed labels (safe to re-run)
INSERT INTO labels (name, slug, color) VALUES
  ('Keto', 'keto', '#FF6B6B'),
  ('Vegan', 'vegan', '#4ECB71'),
  ('Vejetaryen', 'vejetaryen', '#95D5B2'),
  ('Glutensiz', 'glutensiz', '#FFD93D'),
  ('Protein Yüksek', 'protein-yuksek', '#6BCB77'),
  ('Düşük Kalori', 'dusuk-kalori', '#4D96FF'),
  ('Düşük Karbonhidrat', 'dusuk-karbonhidrat', '#9B59B6'),
  ('Süper Besin', 'super-besin', '#FF8C32'),
  ('Atıştırmalık', 'atistirmalik', '#FF6B9D'),
  ('İçecek', 'icecek', '#45B7D1')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- VERIFICATION: Run this to check everything is set up
-- ============================================
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'recipes' ORDER BY ordinal_position;
-- SELECT count(*) as label_count FROM labels;
-- SELECT * FROM recipe_labels LIMIT 5;
