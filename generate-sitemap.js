import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Получаем текущую директорию для ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Функция для форматирования текущей даты в формат YYYY-MM-DD
function getCurrentDate() {
  const date = new Date();
  return date.toISOString().split('T')[0];
}

// Чтение данных из JSON файла
const rawData = fs.readFileSync(path.join(__dirname, 'public', 'data', 'data.json'), 'utf8');
const data = JSON.parse(rawData);

// Начало XML
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd
                            http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd">
  <!-- Главная страница -->
  <url>
    <loc>https://dilavia.by/</loc>
    <lastmod>${getCurrentDate()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Статические страницы -->
  <url>
    <loc>https://dilavia.by/about</loc>
    <lastmod>${getCurrentDate()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://dilavia.by/delivery</loc>
    <lastmod>${getCurrentDate()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://dilavia.by/contacts</loc>
    <lastmod>${getCurrentDate()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://dilavia.by/reviews</loc>
    <lastmod>${getCurrentDate()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Функциональные страницы -->
  <url>
    <loc>https://dilavia.by/catalog</loc>
    <lastmod>${getCurrentDate()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://dilavia.by/fabric</loc>
    <lastmod>${getCurrentDate()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;

// Коллекция уникальных категорий и подкатегорий
const categories = new Set();
const subcategories = new Map(); // Map для связи категорий с подкатегориями

// Собираем все категории и подкатегории
data[0].products.forEach(product => {
  if (product.category && product.category.code) {
    categories.add(product.category.code);
    
    if (product.subcategory && product.subcategory.code) {
      if (!subcategories.has(product.category.code)) {
        subcategories.set(product.category.code, new Set());
      }
      subcategories.get(product.category.code).add(product.subcategory.code);
    }
  }
});

// Добавляем категории в sitemap
sitemap += `\n\n  <!-- Категории мебели -->`;
for (const category of categories) {
  sitemap += `
  <url>
    <loc>https://dilavia.by/catalog/${category}</loc>
    <lastmod>${getCurrentDate()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
}

// Добавляем подкатегории в sitemap
sitemap += `\n\n  <!-- Подкатегории мебели -->`;
for (const [category, subcatSet] of subcategories.entries()) {
  for (const subcategory of subcatSet) {
    sitemap += `
  <url>
    <loc>https://dilavia.by/catalog/${category}/${subcategory}</loc>
    <lastmod>${getCurrentDate()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }
}

// Добавляем товары в sitemap
sitemap += `\n\n  <!-- Страницы товаров -->`;
data[0].products.forEach(product => {
  if (product.slug) {
    sitemap += `
  <url>
    <loc>https://dilavia.by/product/${product.slug}</loc>
    <lastmod>${getCurrentDate()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>`;
    
    // Если у товара есть изображения, добавляем их
    if (product.images && product.images.length > 0) {
      sitemap += `
    <image:image>
      <image:loc>https://dilavia.by/${product.images[0]}</image:loc>
      <image:title>${product.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')}</image:title>
    </image:image>`;
    }
    
    sitemap += `
  </url>`;
  }
});

// Коллекции материалов из директорий
const materialCollections = {
  "Velours": ["Verona", "River", "Pandora", "Omega", "Nessi", "Lorena", "Lanvin_Aqua", "Grand", "Fabriq", "Camel", "Bernar"],
  "Microvelour": ["Montale"],
  "Jacquard": [],
  "Gozhka": [],
  "Faux_suede": [],
  "Faux_leather": [],
  "Chenille": []
};

// Добавляем материалы
sitemap += `\n\n  <!-- Страницы материалов -->`;
for (const material in materialCollections) {
  sitemap += `
  <url>
    <loc>https://dilavia.by/fabric/${material}</loc>
    <lastmod>${getCurrentDate()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
}

// Добавляем коллекции материалов
sitemap += `\n\n  <!-- Коллекции материалов -->`;
for (const material in materialCollections) {
  for (const collection of materialCollections[material]) {
    sitemap += `
  <url>
    <loc>https://dilavia.by/fabric/${material}/${collection}</loc>
    <lastmod>${getCurrentDate()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
  }
}

// Заканчиваем XML
sitemap += `
</urlset>`;

// Записываем в файл
fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), sitemap);

console.log('Sitemap generated successfully with all products!'); 