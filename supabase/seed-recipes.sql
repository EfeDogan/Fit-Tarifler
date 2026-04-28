-- Seed: 4 fitness-focused recipes
-- Author: 9aef38af-60d2-416f-8041-4329b2038bf2
-- Run in Supabase SQL Editor

WITH
label_protein_yuksek AS (SELECT id FROM labels WHERE slug = 'protein-yuksek' LIMIT 1),
label_dusuk_kalori AS (SELECT id FROM labels WHERE slug = 'dusuk-kalori' LIMIT 1),
label_keto AS (SELECT id FROM labels WHERE slug = 'keto' LIMIT 1),
label_super_besin AS (SELECT id FROM labels WHERE slug = 'super-besin' LIMIT 1),

recipe_1 AS (
  INSERT INTO recipes (title, description, content, image_urls, author_id, calories, protein, carbs, fat, created_at)
  VALUES (
    'Izgara Tavuk Göğsü & Quinoa Salatası',
    'Yüksek proteinli, dengeli makrolu öğle veya akşam yemeği tarifi. Quinoa ile tokluk hissi uzun süre devam eder.',
    '<h2>Malzemeler</h2><ul><li>200g tavuk göğsü</li><li>100g quinoa</li><li>1/2 salatalık</li><li>10 cherry domates</li><li>1/4 kırmızı soğan</li><li>1 yemek kaşığı zeytinyağı</li><li>Limon suyu, tuz, karabiber, kekik</li><li>Taze nane veya maydanoz</li></ul><h2>Hazırlanışı</h2><p><strong>1.</strong> Quinoa''yu iyice yıkayıp 1:2 oranında suda pişirin (yaklaşık 15 dk). Süzüp soğumaya bırakın.</p><p><strong>2.</strong> Tavuk göğsünü kekik, tuz, karabiber ve zeytinyağı ile marine edin. Izgarada veya tavada her iki tarafını 5-6 dk pişirin.</p><p><strong>3.</strong> Salatalık, domates ve soğanı küçük küçük doğrayın. Taze nane/maydanozu kıyın.</p><p><strong>4.</strong> Soğuyan quinoa ile sebzeleri karıştırın. Üzerine limon suyu, kalan zeytinyağı, tuz ve karabiber ekleyip harmanlayın.</p><p><strong>5.</strong> Tavuğu dilimleyerek salata üzerine yerleştirin. Afiyet olsun!</p>',
    '[]',
    '9aef38af-60d2-416f-8041-4329b2038bf2',
    480, 45, 32, 12,
    NOW() - INTERVAL '3 days'
  ) RETURNING id
),

recipe_2 AS (
  INSERT INTO recipes (title, description, content, image_urls, author_id, calories, protein, carbs, fat, created_at)
  VALUES (
    'Fırında Somon & Sebze',
    'Omega-3 zengini somon fileto ile renkli sebzeler. Keto dostu, düşük karbonhidratlı akşam yemeği.',
    '<h2>Malzemeler</h2><ul><li>180g somon fileto</li><li>1/2 brokoli</li><li>1/2 kırmızı biber</li><li>100g brüksel lahanası</li><li>1 yemek kaşığı zeytinyağı</li><li>2 diş sarımsak</li><li>Limon, tuz, karabiber, pul biber</li></ul><h2>Hazırlanışı</h2><p><strong>1.</strong> Fırını 200°C''ye önceden ısıtın.</p><p><strong>2.</strong> Brokoliyi çiçeklerine ayırın, biberi şeritler halinde doğrayın, brüksel lahanalarını ikiye bölün.</p><p><strong>3.</strong> Sebzeleri zeytinyağı, ezilmiş sarımsak, tuz ve karabiber ile harmanlayıp fırın tepsisine yayın.</p><p><strong>4.</strong> Somon filetoyu tuz, karabiber ve pul biberle baharatlayın. Sebzelerin yanına yerleştirin.</p><p><strong>5.</strong> Üzerine limon dilimleri koyup 20-22 dk fırınlayın. Somon kolayca ayrılıyorsa hazırdır.</p><p><strong>6.</strong> Fırından çıkarıp 2 dk dinlendirin. Servis edin. Afiyet olsun!</p>',
    '[]',
    '9aef38af-60d2-416f-8041-4329b2038bf2',
    520, 38, 8, 28,
    NOW() - INTERVAL '2 days'
  ) RETURNING id
),

recipe_3 AS (
  INSERT INTO recipes (title, description, content, image_urls, author_id, calories, protein, carbs, fat, created_at)
  VALUES (
    'Protein Pancake (Muz-Yulaf)',
    'Antrenman sonrası kahvaltısı için harika bir seçim. Yulaf ve muz bazlı, protein tozu ile güçlendirilmiş.',
    '<h2>Malzemeler</h2><ul><li>1 olgun muz</li><li>40g yulaf ezmesi</li><li>1 scoop vanilyalı protein tozu (~25g protein)</li><li>1 yumurta</li><li>50ml süt (badem sütü de olabilir)</li><li>1/2 çay kaşığı kabartma tozu</li><li>Tarçın</li><li>Topping: taze meyve, fıstık ezmesi</li></ul><h2>Hazırlanışı</h2><p><strong>1.</strong> Muzu bir kasede çatalla ezin. Yulaf, protein tozu, yumurta, süt, kabartma tozu ve tarçını ekleyip blender veya çırpıcı ile pürüzsüz hale getirin.</p><p><strong>2.</strong> Yapışmaz tavayı orta ateşte ısıtın (hafifçe yağlayabilirsiniz).</p><p><strong>3.</strong> Her pancake için yaklaşık 2 yemek kaşığı hamur dökün. Yüzeyinde kabarcıklar oluşunca (2-3 dk) ters çevirip 1-2 dk daha pişirin.</p><p><strong>4.</strong> Tüm hamurla aynı işlemi tekrarlayın (yaklaşık 6-8 pancake çıkar).</p><p><strong>5.</strong> Servis tabağına alın, üzerine taze meyve ve fıstık ezmesi ekleyin. Afiyet olsun!</p>',
    '[]',
    '9aef38af-60d2-416f-8041-4329b2038bf2',
    350, 28, 42, 8,
    NOW() - INTERVAL '1 day'
  ) RETURNING id
),

recipe_4 AS (
  INSERT INTO recipes (title, description, content, image_urls, author_id, calories, protein, carbs, fat, created_at)
  VALUES (
    'Fıstık Ezmeli Protein Yulaf',
    'Sabahları enerji veren, tok tutan protein dolu yulaf kasesi. Hazırlaması sadece 5 dakika!',
    '<h2>Malzemeler</h2><ul><li>60g yulaf ezmesi</li><li>150ml süt</li><li>1 scoop çikolatalı protein tozu</li><li>1 yemek kaşığı fıstık ezmesi (şekersiz)</li><li>1/2 muz</li><li>1 tatlı kaşığı chia tohumu</li><li>1 tatlı kaşığı bal (opsiyonel)</li><li>Topping: ceviz, bitter çikolata parçaları</li></ul><h2>Hazırlanışı</h2><p><strong>1.</strong> Yulaf ve sütü bir kasede karıştırın. Mikrodalgada 2 dakika ısıtın (veya küçük bir sos tenceresinde 5 dk pişirin).</p><p><strong>2.</strong> Kaseden çıkarıp 1-2 dk soğumaya bırakın. Protein tozunu ekleyip iyice karıştırın (topaklanmaması için biraz soğuması önemli).</p><p><strong>3.</strong> Chia tohumunu ekleyip karıştırın.</p><p><strong>4.</strong> Üzerine fıstık ezmesini kaşıkla yayarak ekleyin.</p><p><strong>5.</strong> Dilimlenmiş muz, ceviz parçaları ve bitter çikolata ile süsleyin. Bal isterseniz son olarak gezdirebilirsiniz. Afiyet olsun!</p>',
    '[]',
    '9aef38af-60d2-416f-8041-4329b2038bf2',
    440, 32, 48, 14,
    NOW()
  ) RETURNING id
)

INSERT INTO recipe_labels (recipe_id, label_id) VALUES
  ((SELECT id FROM recipe_1), (SELECT id FROM label_protein_yuksek)),
  ((SELECT id FROM recipe_1), (SELECT id FROM label_dusuk_kalori)),
  ((SELECT id FROM recipe_2), (SELECT id FROM label_protein_yuksek)),
  ((SELECT id FROM recipe_2), (SELECT id FROM label_keto)),
  ((SELECT id FROM recipe_3), (SELECT id FROM label_dusuk_kalori)),
  ((SELECT id FROM recipe_3), (SELECT id FROM label_protein_yuksek)),
  ((SELECT id FROM recipe_4), (SELECT id FROM label_protein_yuksek)),
  ((SELECT id FROM recipe_4), (SELECT id FROM label_super_besin));
