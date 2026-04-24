# Fit Tarifler

Sağlıklı tariflerinizi paylaşın ve keşfedin. Medium tarzı, temiz ve minimalist bir tarif paylaşım platformu.

## Özellikler

- **Kullanıcı Kimlik Doğrulama** — Kayıt ol, giriş yap, çıkış yap
- **Tarif Oluşturma** — Başlık, kısa açıklama, detaylı içerik, çoklu görsel yükleme (en fazla 3), etiket seçimi
- **Ana Akış (Feed)** — Tüm kullanıcıların paylaştığı tarifler, kart tabanlı grid layout
- **Tarif Detay** — Görsel galerisi, tam içerik, etiketler, beğeni ve kaydetme
- **Beğeni & Kaydetme** — Tarifleri beğenin ve daha sonra okumak üzere kaydedin
- **Profil Sayfası** — Kendi tarifleriniz ve kaydettiğiniz tarifler
- **Etiket Sistemi** — 10 farklı kategori etiketi (Keto, Vegan, Glutensiz, vb.)
- **Responsive Tasarım** — Mobil ve masaüstü uyumlu

## Tech Stack

| Katman | Teknoloji |
|---|---|
| Frontend | [Next.js 16](https://nextjs.org/) (App Router) |
| Dil | TypeScript |
| Styling | Tailwind CSS |
| Backend & DB | [Supabase](https://supabase.com/) (Auth + PostgreSQL + Storage) |
| Deploy | [Vercel](https://vercel.com/) |

## Proje Yapısı

```
fit-recipe-medium/
├── supabase/
│   ├── schema.sql              # Tam veritabanı şeması (sıfırdan kurulum için)
│   └── migration.sql           # Mevcut DB'i güncellemek için migration
├── src/
│   ├── proxy.ts                # Auth proxy (korumalı route yönetimi)
│   ├── types/
│   │   └── database.ts         # TypeScript tip tanımları
│   ├── lib/
│   │   ├── auth.ts             # Client-side auth hook (login/signup/logout)
│   │   ├── recipes.ts          # Client-side recipe hook (create/delete)
│   │   ├── actions/
│   │   │   └── recipes.ts      # Server actions (like/save toggle)
│   │   └── supabase/
│   │       ├── client.ts       # Browser Supabase client
│   │       └── server.ts       # Server Supabase client
│   ├── components/
│   │   ├── Navbar.tsx           # Navigasyon çubuğu
│   │   ├── RecipeCard.tsx       # Tarif kartı (grid için)
│   │   ├── LikeSaveButtons.tsx  # Beğeni/kaydetme butonları
│   │   ├── ImageGallery.tsx     # Görsel galerisi
│   │   └── DeleteRecipeButton.tsx
│   └── app/
│       ├── page.tsx             # Ana akış (/)
│       ├── login/page.tsx       # Giriş sayfası
│       ├── signup/page.tsx      # Kayıt sayfası
│       ├── create/page.tsx      # Tarif oluşturma
│       ├── profile/page.tsx     # Kullanıcı profili
│       ├── recipe/[id]/page.tsx # Tarif detay
│       └── api/labels/route.ts  # Etiket listesi API
└── .env.example                 # Çevre değişkenleri şablonu
```

## Veritabanı Şeması

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│  profiles   │     │     recipes      │     │   labels    │
│─────────────│     │──────────────────│     │─────────────│
│ id (PK)     │◄────│ author_id (FK)   │     │ id (PK)     │
│ username    │     │ id (PK)          │     │ name        │
│ avatar_url  │     │ title            │     │ slug        │
│ created_at  │     │ description      │     │ color       │
└─────────────┘     │ content          │     └──────┬──────┘
                    │ image_urls       │            │
                    │ created_at       │            │
                    └────────┬─────────┘            │
                             │                      │
                    ┌────────▼─────────┐            │
                    │  recipe_labels   │◄───────────┘
                    │──────────────────│
                    │ recipe_id (PK,FK)│
                    │ label_id (PK,FK) │
                    └──────────────────┘

┌─────────────┐     ┌─────────────┐
│    likes     │     │    saves    │
│─────────────│     │─────────────│
│ user_id (PK)│     │ user_id (PK)│
│ recipe_id(PK)│    │ recipe_id(PK)│
└─────────────┘     └─────────────┘
```

## Kurulum

### 1. Repoyu klonlayın

```bash
git clone https://github.com/EfeDogan/Fit-Tarifler.git
cd Fit-Tarifler
npm install
```

### 2. Supabase projesi oluşturun

1. [supabase.com](https://supabase.com) adresinde yeni proje oluşturun
2. Proje URL'nizi ve anon key'inizi alın

### 3. Çevre değişkenlerini ayarlayın

```bash
cp .env.example .env.local
```

`.env.local` dosyasını düzenleyin:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Veritabanını kurun

Supabase SQL Editor'de `supabase/schema.sql` dosyasının tamamını çalıştırın.

> Mevcut bir veritabanınız varsa `supabase/migration.sql` kullanın (idempotent, tekrar çalıştırılabilir).

### 5. Storage bucket oluşturun

`schema.sql` zaten bucket'ı oluşturur. Eğer migration kullanıyorsanız, Supabase Dashboard'da:
- **Storage** → yeni bucket: `recipe-images` (public: true)

### 6. Çalıştırın

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) adresinde açılacaktır.

## Deploy

### Vercel

1. [vercel.com](https://vercel.com) adresinde projeyi import edin
2. Çevre değişkenlerini (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) ekleyin
3. Deploy edin

## Etiketler

| Etiket | Renk |
|---|---|
| Keto | 🔴 `#FF6B6B` |
| Vegan | 🟢 `#4ECB71` |
| Vejetaryen | 🟢 `#95D5B2` |
| Glutensiz | 🟡 `#FFD93D` |
| Protein Yüksek | 🟢 `#6BCB77` |
| Düşük Kalori | 🔵 `#4D96FF` |
| Düşük Karbonhidrat | 🟣 `#9B59B6` |
| Süper Besin | 🟠 `#FF8C32` |
| Atıştırmalık | 🩷 `#FF6B9D` |
| İçecek | 🔵 `#45B7D1` |

## Lisans

MIT
