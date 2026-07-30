import fs from 'node:fs/promises'
import path from 'node:path'
import { products } from '../src/catalogue.generated.js'
import { formations } from '../src/formation-data.js'

const baseUrl = 'http://localhost:5173'
const staticPages = [
  ['/', 'monthly', '1.0'],
  ['/boutique.html', 'weekly', '0.9'],
  ['/materiel-telecom-fibre-optique/', 'monthly', '0.9'],
  ['/sav/', 'monthly', '0.9'],
  ['/audit-telecoms/', 'monthly', '0.8'],
  ['/formations/', 'monthly', '0.9'],
  ['/a-propos-de-notre-mission/', 'monthly', '0.7'],
  ['/mentions-legales/', 'yearly', '0.3'],
  ['/conditions-generales-dutilisation/', 'yearly', '0.3'],
  ['/politique-de-confidentialite/', 'yearly', '0.3'],
]

const urls = [
  ...staticPages,
  ...formations.map((formation) => [`/formation.html?formation=${formation.slug}`, 'monthly', '0.8']),
  ...products.map((product) => [`/produit.html?produit=${product.slug}`, 'monthly', '0.7']),
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([pathname, changefreq, priority]) => `  <url><loc>${baseUrl}${pathname.replaceAll('&', '&amp;')}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`).join('\n')}
</urlset>
`

await fs.writeFile(path.join(process.cwd(), 'public', 'sitemap.xml'), xml, 'utf8')
console.log(`Sitemap generated with ${urls.length} URLs.`)
