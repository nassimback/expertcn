import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const workspace = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const official = JSON.parse(await fs.readFile(path.join(workspace, '.codex-tmp', 'expertcn-products-scraped.json'), 'utf8'))
const catalogueUrl = pathToFileURL(path.join(workspace, 'src', 'catalogue.generated.js'))
catalogueUrl.searchParams.set('audit', Date.now())
const { products } = await import(catalogueUrl.href)
const localBySlug = new Map(products.map((product) => [product.slug, product]))

const checks = []
for (const source of official) {
  const local = localBySlug.get(source.slug)
  const missingImages = []
  for (const image of local?.gallery || []) {
    try {
      await fs.access(path.join(workspace, 'public', image.replace(/^\//, '')))
    } catch {
      missingImages.push(image)
    }
  }
  checks.push({
    slug: source.slug,
    exists: Boolean(local),
    slugExact: local?.slug === source.slug,
    titleExact: local?.name === source.title,
    shortDescriptionExact: source.shortDescription ? local?.description === source.shortDescription : true,
    descriptionExact: source.description?.length ? JSON.stringify(local?.longDescription) === JSON.stringify(source.description) : true,
    typeExact: local?.type === (source.productType === 'variable' ? 'Variable' : 'Simple'),
    optionsExact: JSON.stringify(local?.options || []) === JSON.stringify(source.options || []),
    galleryCountExact: (local?.gallery?.length || 0) === (source.images?.length || 0),
    missingImages,
    officialPlaceholder: source.imageUrls?.some((image) => image.includes('woocommerce-placeholder.png')) || false,
  })
}

const failures = checks.filter((check) => (
  !check.exists
  || !check.slugExact
  || !check.titleExact
  || !check.shortDescriptionExact
  || !check.descriptionExact
  || !check.typeExact
  || !check.optionsExact
  || !check.galleryCountExact
  || check.missingImages.length
))
const report = {
  source: 'https://www.expertcn.fr/product-sitemap.xml',
  auditedAt: new Date().toISOString(),
  sitemapProducts: official.length,
  localProducts: products.length,
  v6OnlyProducts: products.filter((product) => !official.some((source) => source.slug === product.slug)).length,
  passed: checks.length - failures.length,
  failures: failures.length,
  officialPlaceholderProducts: checks.filter((check) => check.officialPlaceholder).map((check) => check.slug),
  checks,
}

const outputPath = path.join(workspace, '.codex-tmp', 'expertcn-product-audit.json')
await fs.writeFile(outputPath, JSON.stringify(report, null, 2), 'utf8')
console.log(JSON.stringify({
  sitemapProducts: report.sitemapProducts,
  localProducts: report.localProducts,
  v6OnlyProducts: report.v6OnlyProducts,
  passed: report.passed,
  failures: report.failures,
  officialPlaceholders: report.officialPlaceholderProducts.length,
  outputPath,
}, null, 2))

if (failures.length) process.exitCode = 1
