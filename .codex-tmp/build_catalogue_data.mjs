import fs from 'node:fs/promises'
import path from 'node:path'
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool'

const workspace = 'C:/Users/Nassim/Documents/expertcn 5.6'
const workbookPath = path.join(workspace, 'Categorisation_Produits_ExpertCN_v4.xlsx')
const imageDir = path.join(workspace, 'public', 'images', 'shop', 'products')
const outputPath = path.join(workspace, 'src', 'catalogue.generated.js')

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
  CPE: 'Accès client et passerelles pour réseaux professionnels.',
  Switches: 'Commutation industrielle pour environnements exigeants.',
  OLT: 'Infrastructure d’accès PON pour déploiements opérateurs et entreprises.',
  'Modules optiques': 'Modules compatibles pour interconnexions multi-constructeurs.',
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
const rows = sheet.getRange('A2:K68').values
const variableSheet = workbook.worksheets.getItem('Produits variables — Specs')
const rechargeRows = variableSheet.getRange('A9:B13').values
const aiguilleRows = variableSheet.getRange('A20:C24').values
const ptoSource = publicText(variableSheet.getRange('B28').values[0][0])
const breakoutSource = publicText(variableSheet.getRange('B32').values[0][0])
const imageFiles = await fs.readdir(imageDir)
const imageBySlug = new Map(imageFiles.map((file) => [file.replace(/\.[^.]+$/, ''), file]))
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
  'ONT/HGU GPON Raisecom ISCOM HT803G': 'Modèle',
  'Switch industriel Raisecom Gazelle (rack 19")': 'Modèle',
}

const allProducts = rows.map((row) => {
  const [name, brand, category, subcategory, , sku, , shortDescription, status, notes, type] = row
  const generatedSlug = slugify(name)
  const preferredSlug = Object.hasOwn(specialSlugs, name) ? specialSlugs[name] : generatedSlug
  const imageFile = preferredSlug ? imageBySlug.get(preferredSlug) : null
  const isLogoPlaceholder = imageFile && imageSizes.get(imageFile) === 9923
  const hasUsableProductImage = imageFile && !isLogoPlaceholder
  const sourceUrl = preferredSlug && imageFile ? `https://www.expertcn.fr/produit/${preferredSlug}/` : null
  const product = {
    name,
    brand: cleanCell(brand) || 'ExpertCN',
    category,
    subcategory: subcategory || 'Équipements spécialisés',
    sku: cleanCell(sku) || null,
    description: publicText(cleanCell(shortDescription) || tidyNote(cleanCell(notes)) || subcategoryCopy[subcategory] || categoryCopy[category]),
    status,
    type,
    image: hasUsableProductImage ? `/images/shop/products/${imageFile}` : selectTechnicalFallback(generatedSlug, category),
    imageMode: hasUsableProductImage ? 'contain' : 'cover',
    sourceUrl,
    slug: generatedSlug,
  }
  product.longDescription = buildLongDescription(product)
  product.options = validatedOptions[name]
    || (type === 'Variable' ? [{ name: pendingOptions[name] || 'Configuration', values: [], pending: true }] : [])
  return product
})

const catalogueCategories = Object.entries(categoryCopy).map(([name, description]) => ({
  name,
  description,
  subcategories: [...new Set(allProducts.filter((product) => product.category === name).map((product) => product.subcategory))],
}))

const partnerPage = allProducts.find((product) => product.type === 'Page WP (hors catalogue)')
const products = allProducts.filter((product) => product.status === 'Garder' && product.type !== 'Page WP (hors catalogue)')
const pendingProducts = allProducts.filter((product) => product.status === 'À vérifier')

const source = `// Generated from Categorisation_Produits_ExpertCN_v4.xlsx.\n// Re-run .codex-tmp/build_catalogue_data.mjs after catalogue workbook changes.\n\nexport const catalogueCategories = ${JSON.stringify(catalogueCategories, null, 2)}\n\nexport const products = ${JSON.stringify(products, null, 2)}\n\nexport const pendingProducts = ${JSON.stringify(pendingProducts, null, 2)}\n\nexport const partnerPage = ${JSON.stringify(partnerPage, null, 2)}\n`

await fs.writeFile(outputPath, source, 'utf8')
console.log(JSON.stringify({
  categories: catalogueCategories.length,
  products: products.length,
  pending: pendingProducts.length,
  partner: partnerPage?.name,
  validatedVariables: Object.keys(validatedOptions),
  pendingVariables: Object.keys(pendingOptions),
  outputPath,
}, null, 2))
