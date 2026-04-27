# Fit Tarifler

Sağlıklı tariflerinizi paylaşın ve keşfedin. Modern, temiz ve minimalist bir tarif paylaşım platformu.

## Özellikler

### Temel
- **Kullanıcı Kimlik Doğrulama** — Kayıt ol, giriş yap, çıkış yap
- **Tarif Oluşturma** — Başlık, kısa açıklama, zengin metin editörü (Tiptap), çoklu görsel yükleme (en fazla 3), etiket seçimi, besin değeri girişi
- **Ana Akış (Feed)** — Tüm kullanıcıların paylaştığı tarifler, image-overlay kart tasarımı, kalori badge'i
- **Tarif Detay** — Görsel galerisi, zengin içerik, etiketler, besin değeri kartı, beğeni ve kaydetme
- **Beğeni & Kaydetme** — Optimistik UI ile anlık geri bildirim
- **Profil Sayfası** — Kendi tarifleriniz ve kaydettiğiniz tarifler
- **Responsive Tasarım** — Mobil ve masaüstü uyumlu

### Zengin Metin Editörü (Tiptap)
- **Formatlama** — Kalın, italik, üstü çizili, başlık (H2/H3), sıralı/sırasız liste, alıntı, kod bloğu, yatay çizgi
- **Görsel Ekleme** — URL ile veya dosya yükleme (Supabase Storage)
- **Drag & Drop** — Görseli doğrudan editöre sürükleyip bırakın

### Besin Değeri Sistemi
- **Makro Girişi** — Kalori, protein, karbonhidrat, yağ (opsiyonel)
- **Besin Kartı** — Tarif detay sayfasında renkli makro gösterimi
- **Kalori Badge'i** — Feed kartlarında kalori bilgisi
- **Dinamik Filtreleme** — Dropdown ile protein, kalori, karb ve yağ filtreleme

### Filtreleme
- **Etiket Filtreleri** — 10 farklı kategori etiketi (Keto, Vegan, Glutensiz vb.)
- **Besin Filtreleri** — Protein (10g+ ~ 50g+), Kalori (200 altı ~ 700 altı), Karbonhidrat (10g altı ~ 50g altı), Yağ (5g altı ~ 30g altı)
- **Çoklu Filtre** — Etiket ve besin filtreleri aynı anda kullanılabilir

### Performans
- **Paralel Sorgular** — `Promise.all` ile Supabase sorguları paralel çalışır
- **Optimistik UI** — Beğeni/kaydetme/filtreleme anında güncellenir
- **Loading Skeleton** — Tarif detay sayfasında iskelet yükleme animasyonu
- **Atomik İşlemler** — Server action'larda delete-first pattern

## Tech Stack

| Katman | Teknoloji |
|---|---|
| Frontend | [Next.js 16](https://nextjs.org/) (App Router) |
| Dil | TypeScript |
| Styling | Tailwind CSS v4 |
| Zengin Editör | [Tiptap](https://tiptap.dev/) |
| Backend & DB | [Supabase](https://supabase.com/) (Auth + PostgreSQL + Storage) |
| Analitik | [Vercel Analytics](https://vercel.com/analytics) |
| Deploy | [Vercel](https://vercel.com/) |

## Proje Yapısı

```
fit-recipe-medium/
├── supabase/
│   ├── schema.sql              # Tam veritabanı şeması (sıfırdan kurulum için)
│   ├── migration.sql           # Mevcut DB'i güncellemek için migration
│   └── migration-macros.sql    # Besin değeri sütunları migration
├── src/
│   ├── proxy.ts                # Auth proxy
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
│   │   ├── RecipeCard.tsx       # Tarif kartı (image-overlay tasarım)
│   │   ├── LikeSaveButtons.tsx  # Beğeni/kaydetme (optimistik UI)
│   │   ├── TiptapEditor.tsx     # Zengin metin editörü + drag&drop
│   │   ├── FeedFilters.tsx      # Etiket + besin filtreleme (dropdown)
│   │   ├── ImageGallery.tsx     # Görsel galerisi
│   │   └── DeleteRecipeButton.tsx
│   └── app/
│       ├── page.tsx             # Ana akış (/)
│       ├── login/page.tsx       # Giriş sayfası
│       ├── signup/page.tsx      # Kayıt sayfası
│       ├── create/page.tsx      # Tarif oluşturma
│       ├── profile/page.tsx     # Kullanıcı profili
│       ├── recipe/[id]/
│       │   ├── page.tsx         # Tarif detay
│       │   └── loading.tsx      # Yükleme iskeleti
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
└─────────────┘     │ content (HTML)   │     └──────┬──────┘
                    │ image_urls       │            │
                    │ calories         │            │
                    │ protein          │            │
                    │ carbs            │            │
                    │ fat              │            │
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

Supabase SQL Editor'de sırasıyla çalıştırın:

1. `supabase/schema.sql` — Tam şema (sıfırdan kurulum)
2. `supabase/migration-macros.sql` — Besin değeri sütunları

> Mevcut bir veritabanınız varsa `supabase/migration.sql` + `supabase/migration-macros.sql` kullanın.

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
2. Çevre değişkenlerini ekleyin:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy edin

## Etiketler

| Etiket | Renk |
|---|---|
| Keto | `#FF6B6B` |
| Vegan | `#4ECB71` |
| Vejetaryen | `#95D5B2` |
| Glutensiz | `#FFD93D` |
| Protein Yüksek | `#6BCB77` |
| Düşük Kalori | `#4D96FF` |
| Düşük Karbonhidrat | `#9B59B6` |
| Süper Besin | `#FF8C32` |
| Atıştırmalık | `#FF6B9D` |
| İçecek | `#45B7D1` |

## Lisans

MIT
