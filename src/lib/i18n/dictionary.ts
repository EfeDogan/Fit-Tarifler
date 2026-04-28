export type Dictionary = {
  siteTitle: string;
  siteDescription: string;
  homeHeroSubtitle: string;
  homeEmpty: string;
  homeEmptySub: string;
  homeError: string;
  navbarWriteRecipe: string;
  navbarProfile: string;
  navbarLogout: string;
  navbarLoggingOut: string;
  navbarLogin: string;
  navbarSignup: string;
  filterAll: string;
  filterCalorie: string;
  filterCalorieUnder: string;
  filterProtein: string;
  filterCarbs: string;
  filterCarbsUnder: string;
  filterFat: string;
  filterFatUnder: string;
  kcal: string;
  proteinLabel: string;
  carbsLabel: string;
  fatLabel: string;
  saveButton: string;
  createTitle: string;
  createTitleLabel: string;
  createTitlePlaceholder: string;
  createDescriptionLabel: string;
  createDescriptionPlaceholder: string;
  createNutritionLabel: string;
  createNutritionOptional: string;
  createCalorieLabel: string;
  createProteinLabel: string;
  createCarbsLabel: string;
  createFatLabel: string;
  createContentLabel: string;
  createImagesLabel: string;
  createImagesMax: string;
  createPreview: string;
  createTagsLabel: string;
  createUploadImage: string;
  createSubmitting: string;
  createSubmit: string;
  createError: string;
  createAuthError: string;
  createRecipeError: string;
  loginTitle: string;
  loginSubtitle: string;
  loginEmailLabel: string;
  loginPasswordLabel: string;
  loginSubmitting: string;
  loginSubmit: string;
  loginNoAccount: string;
  loginError: string;
  signupTitle: string;
  signupSubtitle: string;
  signupUsernameLabel: string;
  signupEmailLabel: string;
  signupPasswordLabel: string;
  signupSubmitting: string;
  signupSubmit: string;
  signupHasAccount: string;
  profileMyRecipes: string;
  profileSaved: string;
  profileNoRecipes: string;
  profileNoSaved: string;
  profileError: string;
  recipeBack: string;
  recipeDelete: string;
  recipeDeleteConfirm: string;
  recipeEdit: string;
  editTitle: string;
  editSubmit: string;
  editSubmitting: string;
  editError: string;
  editNotAuthorized: string;
  editImageRemove: string;
  commentsTitle: string;
  commentsEmpty: string;
  commentsPlaceholder: string;
  commentsSubmit: string;
  commentsSubmitting: string;
  commentsLoginRequired: string;
  commentsLoginLink: string;
  commentsDelete: string;
  commentsDeleteConfirm: string;
  commentJustNow: string;
  commentMinutesAgo: string;
  commentHoursAgo: string;
  commentDaysAgo: string;
};

export type LabelTranslations = Record<string, string>;

const labelTranslationsTR: LabelTranslations = {
  keto: "Keto",
  vegan: "Vegan",
  vejetaryen: "Vejetaryen",
  glutensiz: "Glutensiz",
  "protein-yuksek": "Protein Yüksek",
  "dusuk-kalori": "Düşük Kalori",
  "dusuk-karbonhidrat": "Düşük Karbonhidrat",
  "super-besin": "Süper Besin",
  atistirmalik: "Atıştırmalık",
  icecek: "İçecek",
};

const labelTranslationsEN: LabelTranslations = {
  keto: "Keto",
  vegan: "Vegan",
  vejetaryen: "Vegetarian",
  glutensiz: "Gluten-Free",
  "protein-yuksek": "High Protein",
  "dusuk-kalori": "Low Calorie",
  "dusuk-karbonhidrat": "Low Carb",
  "super-besin": "Superfood",
  atistirmalik: "Snack",
  icecek: "Beverage",
};

export const labelDictionaries: Record<Locale, LabelTranslations> = {
  tr: labelTranslationsTR,
  en: labelTranslationsEN,
};

const tr: Dictionary = {
  siteTitle: "Fit Recipe",
  siteDescription: "Sağlıklı tariflerinizi paylaşın ve keşfedin",
  homeHeroSubtitle: "Sağlıklı tariflerinizi paylaşın, başkalarının tariflerini keşfedin.",
  homeEmpty: "Henüz tarif yok.",
  homeEmptySub: "İlk tarifi siz paylaşın!",
  homeError: "Tarifler yüklenirken hata oluştu:",
  navbarWriteRecipe: "Tarif Yaz",
  navbarProfile: "Profilim",
  navbarLogout: "Çıkış",
  navbarLoggingOut: "Çıkış yapılıyor...",
  navbarLogin: "Giriş",
  navbarSignup: "Kayıt Ol",
  filterAll: "Tümü",
  filterCalorie: "Kalori",
  filterCalorieUnder: "altı",
  filterProtein: "Protein",
  filterCarbs: "Karb",
  filterCarbsUnder: "altı",
  filterFat: "Yağ",
  filterFatUnder: "altı",
  kcal: "kcal",
  proteinLabel: "Protein",
  carbsLabel: "Karbonhidrat",
  fatLabel: "Yağ",
  saveButton: "Kaydet",
  createTitle: "Yeni Tarif",
  createTitleLabel: "Başlık",
  createTitlePlaceholder: "Tarifinizin başlığı",
  createDescriptionLabel: "Kısa Açıklama",
  createDescriptionPlaceholder: "Tarifinizin kısaca ne hakkında olduğunu yazın...",
  createNutritionLabel: "Besin Değerleri",
  createNutritionOptional: "opsiyonel",
  createCalorieLabel: "Kalori (kcal)",
  createProteinLabel: "Protein (g)",
  createCarbsLabel: "Karbonhidrat (g)",
  createFatLabel: "Yağ (g)",
  createContentLabel: "Tarif İçeriği",
  createImagesLabel: "Görseller",
  createImagesMax: "En fazla {max} görsel yükleyebilirsiniz",
  createPreview: "Önizleme",
  createTagsLabel: "Etiketler",
  createUploadImage: "Görsel Yükle",
  createSubmitting: "Paylaşılıyor...",
  createSubmit: "Tarifi Paylaş",
  createError: "Tarif oluşturulurken bir hata oluştu.",
  createAuthError: "Giriş yapmanız gerekiyor.",
  createRecipeError: "Tarif oluşturulurken bir hata oluştu.",
  loginTitle: "Fit Recipe",
  loginSubtitle: "Hesabınıza giriş yapın",
  loginEmailLabel: "E-posta",
  loginPasswordLabel: "Şifre",
  loginSubmitting: "Giriş yapılıyor...",
  loginSubmit: "Giriş Yap",
  loginNoAccount: "Hesabınız yok mu?",
  loginError: "E-posta veya şifre hatalı.",
  signupTitle: "Fit Recipe",
  signupSubtitle: "Yeni hesap oluşturun",
  signupUsernameLabel: "Kullanıcı Adı",
  signupEmailLabel: "E-posta",
  signupPasswordLabel: "Şifre",
  signupSubmitting: "Kayıt olunuyor...",
  signupSubmit: "Kayıt Ol",
  signupHasAccount: "Zaten hesabınız var mı?",
  profileMyRecipes: "Tariflerim",
  profileSaved: "Kaydedilenler",
  profileNoRecipes: "Henüz tarif paylaşmadınız.",
  profileNoSaved: "Henüz tarif kaydetmediniz.",
  profileError: "Hata:",
  recipeBack: "← Geri Dön",
  recipeDelete: "Tarifi Sil",
  recipeDeleteConfirm: "Bu tarifi silmek istediğinizden emin misiniz?",
  recipeEdit: "Düzenle",
  editTitle: "Tarifi Düzenle",
  editSubmit: "Güncelle",
  editSubmitting: "Güncelleniyor...",
  editError: "Tarif güncellenirken bir hata oluştu.",
  editNotAuthorized: "Bu tarifi düzenleme yetkiniz yok.",
  editImageRemove: "Kaldır",
  commentsTitle: "Yorumlar",
  commentsEmpty: "Henüz yorum yapılmamış. İlk yorumu siz yapın!",
  commentsPlaceholder: "Yorumunuzu yazın...",
  commentsSubmit: "Gönder",
  commentsSubmitting: "Gönderiliyor...",
  commentsLoginRequired: "Yorum yapmak için ",
  commentsLoginLink: "giriş yapın",
  commentsDelete: "Sil",
  commentsDeleteConfirm: "Bu yorumu silmek istediğinizden emin misiniz?",
  commentJustNow: "Az önce",
  commentMinutesAgo: "{count} dk önce",
  commentHoursAgo: "{count} saat önce",
  commentDaysAgo: "{count} gün önce",
};

const en: Dictionary = {
  siteTitle: "Fit Recipe",
  siteDescription: "Share and discover healthy recipes",
  homeHeroSubtitle: "Share your healthy recipes, discover others' recipes.",
  homeEmpty: "No recipes yet.",
  homeEmptySub: "Be the first to share a recipe!",
  homeError: "Error loading recipes:",
  navbarWriteRecipe: "Write Recipe",
  navbarProfile: "Profile",
  navbarLogout: "Logout",
  navbarLoggingOut: "Logging out...",
  navbarLogin: "Login",
  navbarSignup: "Sign Up",
  filterAll: "All",
  filterCalorie: "Calories",
  filterCalorieUnder: "under",
  filterProtein: "Protein",
  filterCarbs: "Carbs",
  filterCarbsUnder: "under",
  filterFat: "Fat",
  filterFatUnder: "under",
  kcal: "kcal",
  proteinLabel: "Protein",
  carbsLabel: "Carbs",
  fatLabel: "Fat",
  saveButton: "Save",
  createTitle: "New Recipe",
  createTitleLabel: "Title",
  createTitlePlaceholder: "Your recipe title",
  createDescriptionLabel: "Short Description",
  createDescriptionPlaceholder: "Briefly describe what your recipe is about...",
  createNutritionLabel: "Nutrition Facts",
  createNutritionOptional: "optional",
  createCalorieLabel: "Calories (kcal)",
  createProteinLabel: "Protein (g)",
  createCarbsLabel: "Carbs (g)",
  createFatLabel: "Fat (g)",
  createContentLabel: "Recipe Content",
  createImagesLabel: "Images",
  createImagesMax: "You can upload up to {max} images",
  createPreview: "Preview",
  createTagsLabel: "Tags",
  createUploadImage: "Upload Image",
  createSubmitting: "Sharing...",
  createSubmit: "Share Recipe",
  createError: "An error occurred while creating the recipe.",
  createAuthError: "You need to log in.",
  createRecipeError: "An error occurred while creating the recipe.",
  loginTitle: "Fit Recipe",
  loginSubtitle: "Log in to your account",
  loginEmailLabel: "Email",
  loginPasswordLabel: "Password",
  loginSubmitting: "Logging in...",
  loginSubmit: "Log In",
  loginNoAccount: "Don't have an account?",
  loginError: "Invalid email or password.",
  signupTitle: "Fit Recipe",
  signupSubtitle: "Create a new account",
  signupUsernameLabel: "Username",
  signupEmailLabel: "Email",
  signupPasswordLabel: "Password",
  signupSubmitting: "Signing up...",
  signupSubmit: "Sign Up",
  signupHasAccount: "Already have an account?",
  profileMyRecipes: "My Recipes",
  profileSaved: "Saved",
  profileNoRecipes: "You haven't shared any recipes yet.",
  profileNoSaved: "You haven't saved any recipes yet.",
  profileError: "Error:",
  recipeBack: "← Go Back",
  recipeDelete: "Delete Recipe",
  recipeDeleteConfirm: "Are you sure you want to delete this recipe?",
  recipeEdit: "Edit",
  editTitle: "Edit Recipe",
  editSubmit: "Update",
  editSubmitting: "Updating...",
  editError: "An error occurred while updating the recipe.",
  editNotAuthorized: "You are not authorized to edit this recipe.",
  editImageRemove: "Remove",
  commentsTitle: "Comments",
  commentsEmpty: "No comments yet. Be the first to comment!",
  commentsPlaceholder: "Write your comment...",
  commentsSubmit: "Submit",
  commentsSubmitting: "Submitting...",
  commentsLoginRequired: "To comment, please ",
  commentsLoginLink: "log in",
  commentsDelete: "Delete",
  commentsDeleteConfirm: "Are you sure you want to delete this comment?",
  commentJustNow: "Just now",
  commentMinutesAgo: "{count}m ago",
  commentHoursAgo: "{count}h ago",
  commentDaysAgo: "{count}d ago",
};

export const dictionaries = { tr, en } as const;
export type Locale = keyof typeof dictionaries;

export const availableLocales: { code: Locale; name: string; flag: string }[] = [
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
];
