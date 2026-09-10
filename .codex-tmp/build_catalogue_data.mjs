import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool'

const workspace = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const workbookPath = path.join(workspace, 'Categorisation_Produits_ExpertCN_v6.xlsx')
const imageDir = path.join(workspace, 'public', 'images', 'shop', 'products')
const outputPath = path.join(workspace, 'src', 'catalogue.generated.js')
const officialProductsPath = path.join(workspace, '.codex-tmp', 'expertcn-products-scraped.json')

const categoryCopy = {
  'Tests et mesures': 'Mesurez, qualifiez et documentez vos réseaux fibre sur le terrain.',
  'Soudeuses fibre optique': 'Raccordez et préparez la fibre avec des équipements reconnus par les techniciens.',
  'Raccordement optique': 'Organisez, terminez et interconnectez vos liaisons optiques.',
  'Équipements Actifs': 'Déployez les accès, la commutation et les infrastructures PON professionnelles.',
  'Tirage et sécurité': 'Facilitez le passage de câbles et sécurisez chaque intervention.',
  'Identification de réseau': 'Identifiez durablement câbles, panneaux et équipements.',
  Consommables: 'Maintenez vos opérations avec les pièces et consommables adaptés.',
}

const subcategoryCopy = {
  'Analyseurs PON': 'Analyse et qualification des réseaux optiques passifs.',
  'OTDR/Réflectomètres': 'Diagnostic précis des événements et pertes sur la liaison.',
  'Photomètres & Lasers': 'Contrôle de puissance et localisation visuelle des défauts.',
  'Analyseurs de spectre (OCC)': 'Contrôle des canaux CWDM, DWDM et xWDM.',
  'Multimètres optiques': 'Certification rapide et cartographie des liaisons.',
  Compteurs: 'Mesure opérationnelle pour les interventions réseau.',
  Logiciels: 'Centralisation et exploitation des résultats de test.',
  Soudeuses: 'Raccordement fiable pour les chantiers fibre exigeants.',
  Cliveuses: 'Préparation nette et reproductible avant soudure.',
  'Tiroirs optiques': 'Organisation et protection des fibres en baie.',
  Pigtails: 'Finition propre des connexions fibre en tiroir.',
  Jarretières: 'Interconnexion fiable des équipements optiques.',
  PTO: 'Terminaison optique disponible selon le nombre de fibres.',
  MPO: 'Connectique haute densité pour infrastructures optiques.',
  Breakout: 'Distribution optique monomode ou multimode.',
  'Câbles optiques': 'Câbles configurés selon la fibre, la structure et la capacité nécessaires.',
  CPE: 'Accès client et passerelles pour réseaux professionnels.',
  Switches: 'Commutation industrielle pour environnements exigeants.',
  OLT: 'Infrastructure d’accès PON pour déploiements opérateurs et entreprises.',
  'Modules optiques': 'Modules compatibles pour interconnexions multi-constructeurs.',
  'Chargeur alimentation': 'Modules d’alimentation adaptés aux équipements actifs Raisecom.',
  Recharges: 'Recharges disponibles en plusieurs longueurs.',
  'Aiguilles de tirage': 'Aiguilles adaptées aux différentes longueurs de parcours.',
  'Accessoires de tirage': 'Accessoires dédiés au guidage et à la préparation du tirage.',
  Étiqueteuses: 'Identification mobile et industrielle des réseaux.',
  Électrodes: 'Pièces de remplacement pour entretenir les soudeuses.',
  'Étiquettes & Rubans': 'Consommables d’identification adaptés aux équipements Brady.',
  Colliers: 'Fixation propre et durable des faisceaux.',
  Divers: 'Consommables de protection pour raccordements optiques.',
}

const specialSlugs = {
  'Analyseur PON VeEX PX92': 'analyseur-pon-px92',
  'Logiciel Vesion R-Server VeEX': 'logiciel-vesion-r-server-veex',
  'Mini OTDR VeEX OPX-BOXe': 'mini-otdr-opx-boxe',
  'Réflectomètre OTDR VeEX FX150+': 'reflectometre-otdr-veex-fx150',
  'Soudeuse Fujikura 41S+': null,
  'Soudeuse Fujikura 90S+': null,
  Recharge: 'recharge-100m',
  'Aiguille de tirage': 'aiguille-de-tirage-100m-6-7mm',
  PTO: 'pto-1-2-4fo',
  Breakout: 'breakout-monomode',
  Pigtails: 'pigtails',
  'Jarretières Optiques': 'jarretieres-optiques',
  'Gamme SFP Newlinks (page de présentation)': 'module-optique-sfp-compatible',
  'Photomètre PON 10G FX41xT VeEX': 'photometre-pon-10g-fx41xt-veex',
  'Soudeuse Sumitomo T72C+': 'soudeuse-sumitomo-t72c',
  'Soudeuse Sumitomo T-57C+': 'soudeuse-sumitomo-t-57c',
  'Cliveuse Sumitomo FC-6+': 'cliveuse-sumitomo-fc-6',
  'Tiroirs Optiques Actifs': 'tiroirs-optiques-actifs',
  'SMOOVES 60MM': 'smooves-60mm',
  'Étiqueteuse M210-LAB BRADY': 'etiqueteuse-m210-lab-brady',
  'Kit Étiqueteuse M211 BRADY': 'etiqueteuse-m211-brady',
}

const categoryFallback = {
  'Tests et mesures': '/images/shop/analyseur-pon.png',
  'Soudeuses fibre optique': '/images/expertcn-maintenance.jpg',
  'Raccordement optique': '/images/shop/shop-hero.jpg',
  'Équipements Actifs': '/images/shop/shop-hero.jpg',
  'Tirage et sécurité': '/images/shop/aiguille.png',
  'Identification de réseau': '/images/shop/etiqueteuse-m210.png',
  Consommables: '/images/expertcn-maintenance.jpg',
}

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\+/g, '')
    .replace(/&/g, 'et')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function tidyNote(note = '') {
  const clean = String(note)
    .replace(/^Nouveau \(à créer\)\s*[—-]\s*/i, '')
    .replace(/^Reclassé[^.;]*[.;]?\s*/i, '')
    .replace(/\s*[⚠].*$/u, '')
    .replace(/[—–]/g, '-')
    .trim()
  const publicCopy = clean
    .replace(/\s+(Confirmer|Page variable|Références exactes|Format compact original|À confirmer|Probablement).*$/i, '')
    .trim()
  if (!publicCopy || /^(Page consolidée|Page variable|Longueurs|Vérifier|PAGE WORDPRESS|distinct de la ligne|Références exactes)/i.test(publicCopy)) return ''
  return publicCopy.length > 170 ? `${publicCopy.slice(0, 167).replace(/\s+\S*$/, '')}...` : publicCopy
}

function cleanCell(value) {
  return value == null || String(value).toLowerCase() === 'null' ? '' : value
}

function publicText(value = '') {
  return String(value).replace(/[—–]/g, '-').trim()
}

function formatMetres(value) {
  return publicText(value).replace(/\s*M$/i, ' m')
}

function formatMillimetres(value) {
  return publicText(value).replace(/\s*MM$/i, ' mm').replace('.', ',')
}

function buildLongDescription(product) {
  const family = product.subcategory.toLocaleLowerCase('fr')
  return [
    product.description,
    `${product.name} complète la gamme ${family} d’ExpertCN, destinée aux professionnels des télécoms. Notre équipe peut vérifier la compatibilité avec votre matériel, votre réseau et les contraintes de votre chantier avant la commande.`,
  ]
}

const input = await FileBlob.load(workbookPath)
const workbook = await SpreadsheetFile.importXlsx(input)
const sheet = workbook.worksheets.getItem('Produits')
const rows = sheet.getRange('A2:M60').values
const variableSheet = workbook.worksheets.getItem('Produits variables — Specs')
const rechargeRows = variableSheet.getRange('A9:B13').values
const aiguilleRows = variableSheet.getRange('A20:C24').values
const ptoSource = publicText(variableSheet.getRange('B28').values[0][0])
const breakoutSource = publicText(variableSheet.getRange('B32').values[0][0])
const imageFiles = await fs.readdir(imageDir)
const imageBySlug = new Map(imageFiles.map((file) => [file.replace(/\.[^.]+$/, ''), file]))
const imageByName = new Map(imageFiles.map((file) => [file.toLocaleLowerCase('fr'), file]))
const imageSizes = new Map(await Promise.all(imageFiles.map(async (file) => [file, (await fs.stat(path.join(imageDir, file))).size])))
const technicalFallbacks = [
  '/images/expertcn-maintenance.jpg',
  '/images/expertcn-hero.jpg',
  '/images/shop/shop-hero.jpg',
]

function selectTechnicalFallback(slug, category) {
  if (category !== 'Soudeuses fibre optique') return categoryFallback[category]
  const index = [...slug].reduce((total, character) => total + character.charCodeAt(0), 0) % technicalFallbacks.length
  return technicalFallbacks[index]
}

const validatedOptions = {
  Recharge: [{
    name: 'Longueur',
    values: rechargeRows.map(([, length]) => formatMetres(length)),
  }],
  'Aiguille de tirage': [{
    name: 'Configuration',
    values: aiguilleRows.map(([, length, diameter]) => {
      const diameterLabel = /confirmer/i.test(diameter) ? 'à confirmer' : formatMillimetres(diameter)
      return `${formatMetres(length)} - diamètre ${diameterLabel}`
    }),
  }],
  PTO: [{
    name: 'Nombre de fibres',
    values: [...ptoSource.matchAll(/PTO\s+(\d+)FO/gi)].map((match) => `${match[1]} FO`),
  }],
  Breakout: [{
    name: 'Type de fibre',
    values: breakoutSource.split('-').at(-1).replace(/\(.*$/, '').split(',').map((value) => value.trim()).filter(Boolean),
  }],
}

const pendingOptions = {
  Pigtails: 'Configuration optique',
  'Jarretières Optiques': 'Configuration optique',
  'Cartouches étiquettes Brady M21 (M210 / M211)': 'Matière et largeur',
  'Étiquettes & rubans Brady M4/M5 (M410 / M510 / M511)': 'Matière et largeur',
  'Étiquettes & rubans Brady M6/M7 (M610 / M611 / M710)': 'Matière et largeur',
  'CPE Ethernet Raisecom RAX711': 'Modèle',
  'CPE Ethernet Raisecom RAX721': 'Modèle',
}

const allProducts = rows.map((row) => {
  const [name, brand, category, subcategory, , sku, imageUrl, shortDescription, status, notes, type, longDescription, imageFilename] = row
  const generatedSlug = slugify(name)
  const preferredSlug = Object.hasOwn(specialSlugs, name) ? specialSlugs[name] : generatedSlug
  const namedImageFile = imageFilename ? imageByName.get(String(imageFilename).toLocaleLowerCase('fr')) : null
  const legacyImageFile = preferredSlug ? imageBySlug.get(preferredSlug) : null
  const imageFile = namedImageFile || legacyImageFile
  const isLogoPlaceholder = imageFile && imageSizes.get(imageFile) === 9923
  const hasUsableProductImage = imageFile && !isLogoPlaceholder
  const sourceUrl = preferredSlug && imageFile ? `https://www.expertcn.fr/produit/${preferredSlug}/` : null
  const product = {
    name,
    brand: cleanCell(brand) || 'ExpertCN',
    category: category === 'Accessoires' && subcategory === 'Alimentation' ? 'Équipements Actifs' : category,
    subcategory: category === 'Accessoires' && subcategory === 'Alimentation' ? 'Chargeur alimentation' : (subcategory || 'Équipements spécialisés'),
    sku: cleanCell(sku) || null,
    description: publicText(cleanCell(shortDescription) || tidyNote(cleanCell(notes)) || subcategoryCopy[subcategory] || categoryCopy[category]),
    status,
    type,
    image: hasUsableProductImage
      ? `/images/shop/products/${imageFile}`
      : (cleanCell(imageUrl) || selectTechnicalFallback(generatedSlug, category)),
    imageMode: 'cover',
    sourceUrl,
    slug: generatedSlug,
  }
  if (name === 'CPE Ethernet Raisecom RAX721') {
    product.description = 'CPE Ethernet Raisecom RAX721 pour les liaisons professionnelles à très haut débit et le backhaul mobile.'
  }
  product.longDescription = [
    product.description,
    name === 'CPE Ethernet Raisecom RAX721'
      ? 'Le Raisecom RAX721 est un équipement de démarcation Ethernet conçu pour les infrastructures opérateurs et entreprises. Sa configuration exacte sera validée avec ExpertCN selon le débit, les interfaces et le service attendus.'
      : (publicText(cleanCell(longDescription)) || buildLongDescription(product)[1]),
  ].filter(Boolean)
  product.options = validatedOptions[name]
    || (type === 'Variable' ? [{ name: pendingOptions[name] || 'Configuration', values: [], pending: true }] : [])
  return product
})

const officialProducts = JSON.parse(await fs.readFile(officialProductsPath, 'utf8'))
const localBySlug = new Map(allProducts.map((product) => [product.slug, product]))
const officialAliasToLocalSlug = {
  'aiguille': 'aiguille-de-tirage',
  'aiguille-de-tirage-30m': 'aiguille-de-tirage',
  'aiguille-de-tirage-300m-11mm': 'aiguille-de-tirage',
  'aiguille-de-tirage-60m-4-5mm': 'aiguille-de-tirage',
  'aiguille-de-tirage-100m-6-7mm': 'aiguille-de-tirage',
  'aiguille-de-tirage-150m-9mm': 'aiguille-de-tirage',
  'recharge-30m': 'recharge',
  'recharge-60m': 'recharge',
  'recharge-100m': 'recharge',
  'recharge-150m': 'recharge',
  'recharge-300m': 'recharge',
  'breakout-monomode': 'breakout',
  'breakout-multimode': 'breakout',
  'pto-1-2-4fo': 'pto',
  'soudeuse-optique-fujikura-90s': 'soudeuse-fujikura-90s',
  'mini-otdr-opx-boxe': 'mini-otdr-veex-opx-boxe',
  'analyseur-pon-px92': 'analyseur-pon-veex-px92',
  'module-optique-sfp-compatible': 'gamme-sfp-newlinks-page-de-presentation',
}

function inferBrand(official, fallback) {
  if (fallback?.brand) return fallback.brand
  const value = `${official.title} ${official.slug}`.toLocaleLowerCase('fr')
  if (value.includes('fujikura')) return 'Fujikura'
  if (value.includes('sumitomo')) return 'Sumitomo'
  if (value.includes('veex')) return 'VeEX'
  if (value.includes('brady')) return 'Brady'
  if (value.includes('fiberpoint')) return 'FiberPoint'
  if (value.includes('sfp')) return 'Newlinks'
  return 'ExpertCN'
}

function inferCategory(official, fallback) {
  if (fallback?.category) return fallback.category
  const categories = official.categorySlugs || []
  const slug = official.slug
  if (categories.some((value) => ['tests-et-mesures', 'reflectometres', 'lasers-et-photometres'].includes(value))) return 'Tests et mesures'
  if (categories.some((value) => ['soudeuses-fibre-optique', 'cliveuse-fibre-optique'].includes(value)) || slug.includes('soudeuse') || slug.includes('cliveuse')) return 'Soudeuses fibre optique'
  if (categories.includes('raccordement-optique')) return 'Raccordement optique'
  if (categories.includes('aiguilles-fibre-optiques')) return 'Tirage et sécurité'
  if (categories.includes('identification-de-reseau') || slug.includes('etiqueteuse')) return 'Identification de réseau'
  if (categories.includes('consommables') || slug.includes('electrodes')) return 'Consommables'
  if (slug.includes('sfp')) return 'Équipements Actifs'
  return 'Tests et mesures'
}

function inferSubcategory(official, fallback) {
  if (fallback?.subcategory) return fallback.subcategory
  const slug = official.slug
  if (slug.includes('recharge')) return 'Recharges'
  if (slug.includes('aiguille')) return 'Aiguilles de tirage'
  if (slug.includes('breakout')) return 'Breakout'
  if (slug.includes('pto')) return 'PTO'
  if (slug === 'mpo') return 'MPO'
  if (slug.includes('jarretieres')) return 'Jarretières'
  if (slug.includes('tiroirs')) return 'Tiroirs optiques'
  if (slug.includes('pigtails')) return 'Pigtails'
  if (slug.includes('cliveuse')) return 'Cliveuses'
  if (slug.includes('soudeuse')) return 'Soudeuses'
  if (slug.includes('electrodes')) return 'Électrodes'
  if (slug.includes('etiqueteuse')) return 'Étiqueteuses'
  if (slug.includes('reflectometre') || slug.includes('otdr')) return 'OTDR/Réflectomètres'
  if (slug.includes('photometre') || slug.includes('laser')) return 'Photomètres & Lasers'
  if (slug.includes('analyseur-pon')) return 'Analyseurs PON'
  if (slug.includes('logiciel')) return 'Logiciels'
  if (slug.includes('sfp')) return 'Modules optiques'
  return official.categories?.[0] || 'Équipements spécialisés'
}

function officialProductToCatalogue(official) {
  const fallbackSlug = officialAliasToLocalSlug[official.slug] || official.slug
  const fallback = localBySlug.get(fallbackSlug)
  const longDescription = official.description?.length
    ? official.description
    : (fallback?.longDescription || [official.shortDescription].filter(Boolean))
  const firstDescription = longDescription.find((paragraph) => !paragraph.startsWith('•')) || ''
  return {
    name: official.title,
    brand: inferBrand(official, fallback),
    category: inferCategory(official, fallback),
    subcategory: inferSubcategory(official, fallback),
    sku: official.sku || fallback?.sku || null,
    description: official.shortDescription || firstDescription || fallback?.description || '',
    status: 'Garder',
    type: official.productType === 'variable' ? 'Variable' : 'Simple',
    image: official.images?.[0] || fallback?.image || categoryFallback[inferCategory(official, fallback)],
    gallery: official.images?.length ? official.images : [fallback?.image].filter(Boolean),
    imageMode: 'cover',
    sourceUrl: official.canonicalUrl || official.url,
    slug: official.slug,
    longDescription,
    options: official.options || [],
    productId: official.productId || null,
    lastModified: official.lastModified || null,
  }
}

const officialCatalogueProducts = officialProducts.map(officialProductToCatalogue)

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function getOfficialProducts(slugs) {
  return slugs
    .map((slug) => officialCatalogueProducts.find((product) => product.slug === slug))
    .filter(Boolean)
}

function buildVariableFamily({
  slug,
  name,
  sourceSlugs,
  preferredSlug,
  description,
  options,
  variations,
}) {
  const sources = getOfficialProducts(sourceSlugs)
  const preferred = sources.find((product) => product.slug === preferredSlug) || sources[0]
  if (!preferred) throw new Error(`Missing source product for ${name}`)

  return {
    ...preferred,
    slug,
    name,
    description,
    type: 'Variable',
    sku: null,
    gallery: unique(sources.flatMap((product) => product.gallery || [product.image])),
    image: preferred.image,
    sourceUrl: preferred.sourceUrl,
    longDescription: preferred.longDescription,
    options,
    variations,
    legacySlugs: sourceSlugs,
  }
}

const rechargeSourceSlugs = ['recharge-30m', 'recharge-60m', 'recharge-100m', 'recharge-150m', 'recharge-300m']
const rechargeLengths = rechargeRows.map(([, length]) => formatMetres(length))
const rechargeSources = getOfficialProducts(rechargeSourceSlugs)
const rechargeProduct = buildVariableFamily({
  slug: 'recharge',
  name: 'Recharge pour aiguille de tirage',
  sourceSlugs: rechargeSourceSlugs,
  preferredSlug: 'recharge-100m',
  description: 'Recharge pour aiguille de tirage disponible en cinq longueurs, de 30 à 300 mètres.',
  options: [{ name: 'Longueur', values: rechargeLengths }],
  variations: rechargeLengths.map((length, index) => ({
    label: `Recharge ${length}`,
    attributes: { Longueur: length },
    image: rechargeSources[index]?.image,
  })),
})

const aiguilleSourceSlugs = [
  'aiguille',
  'aiguille-de-tirage-30m',
  'aiguille-de-tirage-60m-4-5mm',
  'aiguille-de-tirage-100m-6-7mm',
  'aiguille-de-tirage-150m-9mm',
  'aiguille-de-tirage-300m-11mm',
]
const aiguilleSourceByLength = new Map(getOfficialProducts(aiguilleSourceSlugs).map((product) => {
  const match = product.slug.match(/-(30|60|100|150|300)m(?:-|$)/)
  return [match?.[1], product]
}))
const aiguilleVariations = aiguilleRows.map(([, length, diameter]) => {
  const lengthLabel = formatMetres(length)
  const diameterLabel = /confirmer/i.test(diameter) ? 'À confirmer' : formatMillimetres(diameter)
  return {
    label: `${lengthLabel} - diamètre ${diameterLabel.toLocaleLowerCase('fr')}`,
    attributes: { Longueur: lengthLabel, Diamètre: diameterLabel },
    image: aiguilleSourceByLength.get(String(length).match(/\d+/)?.[0])?.image,
  }
})
const aiguilleProduct = buildVariableFamily({
  slug: 'aiguille-de-tirage',
  name: 'Aiguille de tirage',
  sourceSlugs: aiguilleSourceSlugs,
  preferredSlug: 'aiguille-de-tirage-100m-6-7mm',
  description: 'Aiguille de tirage légère, flexible et résistante. Chaque longueur est associée à un diamètre précis.',
  options: [
    { name: 'Longueur', values: unique(aiguilleVariations.map((variation) => variation.attributes.Longueur)) },
    { name: 'Diamètre', values: unique(aiguilleVariations.map((variation) => variation.attributes.Diamètre)) },
  ],
  variations: aiguilleVariations,
})

const ptoValues = validatedOptions.PTO[0].values
const ptoProduct = buildVariableFamily({
  slug: 'pto',
  name: 'PTO',
  sourceSlugs: ['pto-1-2-4fo'],
  preferredSlug: 'pto-1-2-4fo',
  description: 'Prise terminale optique disponible en 1, 2 ou 4 fibres pour les raccordements FTTH.',
  options: [{ name: 'Nombre de fibres', values: ptoValues }],
  variations: ptoValues.map((value) => ({ label: `PTO ${value}`, attributes: { 'Nombre de fibres': value } })),
})

const breakoutSourceSlugs = ['breakout-monomode', 'breakout-multimode']
const breakoutSources = getOfficialProducts(breakoutSourceSlugs)
const breakoutValues = ['Monomode', 'Multimode']
const breakoutProduct = buildVariableFamily({
  slug: 'breakout',
  name: 'Breakout optique',
  sourceSlugs: breakoutSourceSlugs,
  preferredSlug: 'breakout-monomode',
  description: 'Breakout optique configurable en fibre monomode ou multimode selon votre infrastructure.',
  options: [{ name: 'Type de fibre', values: breakoutValues }],
  variations: breakoutValues.map((value, index) => ({
    label: `Breakout ${value}`,
    attributes: { 'Type de fibre': value },
    image: breakoutSources[index]?.image,
  })),
})

const cableProduct = {
  name: 'Câble fibre optique',
  brand: 'ExpertCN',
  category: 'Raccordement optique',
  subcategory: 'Câbles optiques',
  sku: null,
  description: 'Câble fibre optique configuré selon le type de fibre, la structure et la capacité requise.',
  status: 'À configurer',
  type: 'Variable',
  image: imageBySlug.has('breakout-optique')
    ? `/images/shop/products/${imageBySlug.get('breakout-optique')}`
    : categoryFallback['Raccordement optique'],
  gallery: [],
  imageMode: 'cover',
  sourceUrl: null,
  slug: 'cable-fibre-optique',
  longDescription: [
    'Le câble fibre optique sera proposé dans une configuration compatible avec le réseau et les conditions de pose.',
    'Les combinaisons Type de fibre, Structure et Capacité doivent être validées avant publication afin de ne pas proposer de variantes inexistantes.',
  ],
  options: [
    { name: 'Type de fibre', values: [], pending: true },
    { name: 'Structure', values: [], pending: true },
    { name: 'Capacité', values: [], pending: true },
  ],
  variations: [],
}

const consolidatedSourceSlugs = new Set([
  ...rechargeSourceSlugs,
  ...aiguilleSourceSlugs,
  'pto-1-2-4fo',
  ...breakoutSourceSlugs,
])
const consolidatedProducts = [rechargeProduct, aiguilleProduct, ptoProduct, breakoutProduct, cableProduct]
const productAliases = Object.fromEntries([
  ...rechargeSourceSlugs.map((slug) => [slug, rechargeProduct.slug]),
  ...aiguilleSourceSlugs.map((slug) => [slug, aiguilleProduct.slug]),
  ['pto-1-2-4fo', ptoProduct.slug],
  ...breakoutSourceSlugs.map((slug) => [slug, breakoutProduct.slug]),
])
const officialProductsAfterConsolidation = officialCatalogueProducts.filter((product) => !consolidatedSourceSlugs.has(product.slug))
const replacedLocalSlugs = new Set([
  ...officialProducts.map((product) => product.slug),
  ...Object.values(officialAliasToLocalSlug),
])
const v6OnlyProducts = allProducts.filter((product) => (
  product.status === 'Garder'
  && product.type !== 'Page WP (hors catalogue)'
  && !replacedLocalSlugs.has(product.slug)
))

const catalogueCategories = Object.entries(categoryCopy).map(([name, description]) => ({
  name,
  description,
  subcategories: [...new Set(
    [...officialProductsAfterConsolidation, ...v6OnlyProducts, ...consolidatedProducts]
      .filter((product) => product.category === name)
      .map((product) => product.subcategory),
  )],
}))

const partnerPage = allProducts.find((product) => product.type === 'Page WP (hors catalogue)')
const products = [...officialProductsAfterConsolidation, ...v6OnlyProducts, ...consolidatedProducts]
const pendingProducts = allProducts.filter((product) => product.status === 'À vérifier')

const source = `// Generated from ExpertCN product-sitemap.xml, WooCommerce Store API and Categorisation_Produits_ExpertCN_v6.xlsx.\n// Re-run .codex-tmp/scrape_expertcn_products.py then .codex-tmp/build_catalogue_data.mjs after source changes.\n\nexport const catalogueCategories = ${JSON.stringify(catalogueCategories, null, 2)}\n\nexport const products = ${JSON.stringify(products, null, 2)}\n\nexport const productAliases = ${JSON.stringify(productAliases, null, 2)}\n\nexport const pendingProducts = ${JSON.stringify(pendingProducts, null, 2)}\n\nexport const partnerPage = ${JSON.stringify(partnerPage, null, 2)}\n`

await fs.writeFile(outputPath, source, 'utf8')
console.log(JSON.stringify({
  categories: catalogueCategories.length,
  products: products.length,
  officialProducts: officialCatalogueProducts.length,
  consolidatedFamilies: consolidatedProducts.length,
  v6OnlyProducts: v6OnlyProducts.length,
  pending: pendingProducts.length,
  partner: partnerPage?.name,
  validatedVariables: Object.keys(validatedOptions),
  pendingVariables: Object.keys(pendingOptions),
  outputPath,
}, null, 2))
