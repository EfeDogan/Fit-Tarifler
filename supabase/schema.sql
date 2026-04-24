-- Profiles table (extends Supabase Auth users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Recipes table
CREATE TABLE recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  image_urls JSONB DEFAULT '[]',
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recipes are viewable by everyone"
  ON recipes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create recipes"
  ON recipes FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own recipes"
  ON recipes FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own recipes"
  ON recipes FOR DELETE
  USING (auth.uid() = author_id);

-- Labels table
CREATE TABLE labels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  color TEXT NOT NULL DEFAULT '#000000'
);

ALTER TABLE labels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Labels are viewable by everyone"
  ON labels FOR SELECT
  USING (true);

-- Recipe-Labels join table
CREATE TABLE recipe_labels (
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  label_id UUID REFERENCES labels(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (recipe_id, label_id)
);

ALTER TABLE recipe_labels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recipe labels are viewable by everyone"
  ON recipe_labels FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can add labels to recipes"
  ON recipe_labels FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM recipes WHERE recipes.id = recipe_labels.recipe_id AND recipes.author_id = auth.uid()
  ));

CREATE POLICY "Authors can remove labels from recipes"
  ON recipe_labels FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM recipes WHERE recipes.id = recipe_labels.recipe_id AND recipes.author_id = auth.uid()
  ));

-- Likes table
CREATE TABLE likes (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, recipe_id)
);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Likes are viewable by everyone"
  ON likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike"
  ON likes FOR DELETE
  USING (auth.uid() = user_id);

-- Saves (bookmarks) table
CREATE TABLE saves (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, recipe_id)
);

ALTER TABLE saves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Saves are viewable by everyone"
  ON saves FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can save"
  ON saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave"
  ON saves FOR DELETE
  USING (auth.uid() = user_id);

-- Storage bucket for recipe images
INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe-images', 'recipe-images', true);

CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'recipe-images' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view recipe images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'recipe-images');

CREATE POLICY "Users can delete their own images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'recipe-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Seed labels
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
  ('İçecek', 'icecek', '#45B7D1');
