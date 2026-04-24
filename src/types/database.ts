export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Label {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string | null;
  content: string;
  image_urls: string[];
  author_id: string;
  created_at: string;
  profiles?: Profile;
  labels?: Label[];
  likes?: Like[];
  saves?: Save[];
  like_count?: number;
  save_count?: number;
  is_liked_by_user?: boolean;
  is_saved_by_user?: boolean;
}

export interface Like {
  user_id: string;
  recipe_id: string;
}

export interface Save {
  user_id: string;
  recipe_id: string;
}
