import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/outfit'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CaretDown,
  Check,
  FunnelSimple,
  MagnifyingGlass,
  Package,
  Plus,
  SlidersHorizontal,
  Sparkle,
  Tag,
  Wrench,
} from '@phosphor-icons/react'
import { catalogueCategories, partnerPage, products } from './catalogue.generated'
import { SiteFooter, SiteHeader, SiteNotice, useRequestList } from './shop-shared'
import './boutique.css'

const allCategories = [
  { name: 'Tous les équipements', key: 'all', description: 'Parcourez toute la sélection ExpertCN.' },
  ...catalogueCategories.map((category) => ({ ...category, key: category.name })),
]

const categoryImages = [
  '/images/shop/products/analyseur-pon-px92.png',
  '/images/expertcn-maintenance.jpg',
  '/images/shop/products/tiroirs-optiques-coulissants.png',
  '/images/shop/products/module-optique-sfp-compatible.png',
  '/images/shop/products/aiguille-de-tirage-150m-9mm.png',
  '/images/shop/products/etiqueteuse-m710-brady.png',
  '/images/shop/products/smooves-60mm.png',
]

function ProductCard({ product, onAdd }) {
  return (
    <article className="product-card">
      <a className={`product-image ${product.imageMode === 'cover' ? 'is-cover' : ''}`} href={`/produit.html?produit=${product.slug}`} aria-label={`Voir ${product.name}`}>
        <img src={product.image} alt={product.name} loading="lazy" />
      </a>
      <div className="product-details">
        <div className="product-meta"><span>{product.brand}</span><span>{product.subcategory}</span></div>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <span className="product-type"><Tag weight="duotone" />{product.type === 'Variable' ? 'Plusieurs variantes' : 'Référence professionnelle'}</span>
      </div>
      <div className="product-actions">
        <button type="button" onClick={() => onAdd(product)}><Plus weight="bold" /> Ajouter</button>
        <a className="details-button" href={`/produit.html?produit=${product.slug}`}>Détails <ArrowUpRight weight="bold" /></a>
      </div>
    </article>
  )
}

function Boutique() {
  const [category, setCategory] = useState('all')
  const [subcategory, setSubcategory] = useState('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('featured')
  const [visibleCount, setVisibleCount] = useState(12)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const { requestItems, addRequestItem } = useRequestList()

  const selectedCategory = catalogueCategories.find((item) => item.name === category)

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('fr')
    const result = products.filter((product) => {
      const matchesCategory = category === 'all' || product.category === category
      const matchesSubcategory = subcategory === 'all' || product.subcategory === subcategory
      const searchable = `${product.name} ${product.brand} ${product.category} ${product.subcategory} ${product.description}`.toLocaleLowerCase('fr')
      return matchesCategory && matchesSubcategory && (!normalizedQuery || searchable.includes(normalizedQuery))
    })
    return result.toSorted((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name, 'fr')
      if (sort === 'brand') return a.brand.localeCompare(b.brand, 'fr') || a.name.localeCompare(b.name, 'fr')
      return products.indexOf(a) - products.indexOf(b)
    })
  }, [category, subcategory, query, sort])

  const showPartnerPage = useMemo(() => {
    if (!partnerPage || !['all', 'Équipements Actifs'].includes(category)) return false
    if (!['all', 'Modules optiques'].includes(subcategory)) return false
    const normalizedQuery = query.trim().toLocaleLowerCase('fr')
    return !normalizedQuery || `${partnerPage.name} ${partnerPage.brand} ${partnerPage.subcategory}`.toLocaleLowerCase('fr').includes(normalizedQuery)
  }, [category, subcategory, query])

  useEffect(() => setVisibleCount(12), [category, subcategory, query, sort])

  useEffect(() => {
    if (!notice) return undefined
    const timer = window.setTimeout(() => setNotice(''), 2800)
    return () => window.clearTimeout(timer)
  }, [notice])

  const chooseCategory = (nextCategory, scroll = false) => {
    setCategory(nextCategory)
    setSubcategory('all')
    setFiltersOpen(false)
    if (scroll) window.requestAnimationFrame(() => document.querySelector('#catalogue')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const addToRequest = (product) => {
    addRequestItem(product.name)
    setNotice(`${product.name} a été ajouté à votre demande.`)
  }

  const categoryCount = (key) => key === 'all' ? products.length : products.filter((product) => product.category === key).length
  const resultLabel = `${filteredProducts.length} équipement${filteredProducts.length > 1 ? 's' : ''}${showPartnerPage ? ' + 1 gamme partenaire' : ''}`

  return (
    <div className="shop-page">
      <SiteHeader active="boutique" requestCount={requestItems.length} onRequest={setNotice} />

      <main>
        <section className="shop-hero">
          <div className="shop-hero-copy">
            <p className="shop-eyebrow">Catalogue professionnel</p>
            <h1>Équipez vos chantiers.</h1>
            <p>Fibre, mesure et réseau: une sélection structurée pour les équipes de terrain.</p>
            <a className="shop-primary-link" href="#catalogue">Explorer le catalogue <ArrowRight weight="bold" /></a>
          </div>
          <div className="shop-hero-visual"><img src="/images/shop/shop-hero.jpg" alt="Équipements professionnels de raccordement et de mesure fibre optique" fetchPriority="high" /></div>
        </section>

        <section className="shop-assurances" aria-label="Services ExpertCN">
          <div><Check weight="bold" /><span><strong>Sélection terrain</strong>Des références choisies pour un usage professionnel.</span></div>
          <div><Wrench weight="duotone" /><span><strong>Maintenance spécialisée</strong>Un SAV qui connaît vos équipements.</span></div>
          <div><Sparkle weight="duotone" /><span><strong>Conseil technique</strong>Une équipe disponible avant votre choix.</span></div>
        </section>

        <section className="category-explorer" aria-labelledby="category-title">
          <div className="category-grid">
            <div className="category-intro">
              <p className="category-kicker">Nos univers métiers</p>
              <h2 id="category-title">Sept familles, un seul partenaire.</h2>
              <p>Accédez directement à chaque univers métier et à ses références techniques.</p>
            </div>
            {catalogueCategories.map((item, index) => (
              <button key={item.name} className={`category-card ${category === item.name ? 'is-active' : ''}`} type="button" onClick={() => chooseCategory(item.name, true)}>
                <span className="category-card-image"><img src={categoryImages[index]} alt={`Équipements de la famille ${item.name}`} loading="lazy" /></span>
                <span className="category-card-copy">
                  <span className="category-card-top"><strong>{item.name}</strong><b>{categoryCount(item.name)}</b></span>
                  <small>{item.description}</small>
                  <span className="category-card-action">Voir les produits <ArrowRight weight="bold" /></span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="shop-catalogue" id="catalogue">
          <div className="catalogue-heading">
            <p className="shop-eyebrow">Catalogue ExpertCN</p>
            <h2>Trouvez votre prochaine référence.</h2>
            <p>Filtrez par famille ou usage, puis ajoutez les équipements à votre demande.</p>
          </div>

          <div className="catalogue-toolbar">
            <label className="shop-search"><MagnifyingGlass weight="bold" /><span className="sr-only">Rechercher un produit</span><input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Produit, marque ou usage" /></label>
            <label className="sort-select"><span className="sr-only">Trier le catalogue</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Sélection ExpertCN</option><option value="name">Nom A-Z</option><option value="brand">Marque</option></select><CaretDown weight="bold" /></label>
            <button className="filters-toggle" type="button" onClick={() => setFiltersOpen((open) => !open)}><FunnelSimple weight="bold" /> Filtres <CaretDown weight="bold" /></button>
            <span className="result-count">{resultLabel}</span>
          </div>

          <div className="catalogue-layout">
            <aside className={`shop-filters ${filtersOpen ? 'is-open' : ''}`}>
              <div className="filter-title"><SlidersHorizontal weight="duotone" /><span>Familles</span></div>
              <div className="category-list">
                {allCategories.map((item) => <button key={item.key} className={category === item.key ? 'is-selected' : ''} type="button" onClick={() => chooseCategory(item.key)}><span>{item.name}</span><b>{categoryCount(item.key)}</b></button>)}
              </div>
              {selectedCategory && <div className="subcategory-filter"><strong>Usages</strong><button className={subcategory === 'all' ? 'is-selected' : ''} type="button" onClick={() => setSubcategory('all')}>Tous</button>{selectedCategory.subcategories.map((item) => <button className={subcategory === item ? 'is-selected' : ''} key={item} type="button" onClick={() => { setSubcategory(item); setFiltersOpen(false) }}>{item}</button>)}</div>}
              <div className="filter-help"><Package weight="duotone" /><strong>Besoin d’un conseil?</strong><p>Notre équipe vérifie la compatibilité de votre sélection.</p><a href="/#contact">Parler à un expert <ArrowUpRight weight="bold" /></a></div>
            </aside>

            <div className="product-area">
              {showPartnerPage && (
                <article className="partner-feature">
                  <div className="partner-image"><img src={partnerPage.image} alt="Modules optiques compatibles Newlinks" /></div>
                  <div><span>Partenaire modules optiques</span><h3>La gamme SFP Newlinks</h3><p>Modules SFP, SFP+ et QSFP compatibles multi-constructeurs, avec programmation autonome via la Newlinks Coding Box.</p><a href="https://newlinks.tech" target="_blank" rel="noreferrer">Découvrir Newlinks <ArrowUpRight weight="bold" /></a></div>
                </article>
              )}
              {filteredProducts.length ? (
                <>
                  <div className="product-grid">
                    {filteredProducts.slice(0, visibleCount).map((product) => <ProductCard product={product} key={product.name} onAdd={addToRequest} />)}
                  </div>
                  {visibleCount < filteredProducts.length && <button className="load-more" type="button" onClick={() => setVisibleCount((count) => count + 12)}>Afficher plus de produits <ArrowDown weight="bold" /></button>}
                </>
              ) : !showPartnerPage && (
                <div className="empty-products"><MagnifyingGlass weight="duotone" /><h3>Aucun équipement trouvé.</h3><p>Essayez un autre terme ou revenez à toutes les familles.</p><button type="button" onClick={() => { setQuery(''); chooseCategory('all') }}>Réinitialiser les filtres</button></div>
              )}
            </div>
          </div>
        </section>

        <section className="shop-support">
          <div className="shop-support-image">
            <img src="/images/expertcn-hero.jpg" alt="Technicien ExpertCN intervenant sur un équipement fibre optique" loading="lazy" />
          </div>
          <div className="shop-support-copy">
            <h2>Validez votre sélection avec un expert.</h2>
            <p>Compatibilité, variantes et usages terrain : nous vérifions chaque point avant votre demande.</p>
            <a className="shop-primary-link" href="/#contact">Parler à un expert <ArrowRight weight="bold" /></a>
          </div>
        </section>
      </main>

      <SiteFooter />
      <SiteNotice message={notice} />
    </div>
  )
}

createRoot(document.getElementById('root')).render(<React.StrictMode><Boutique /></React.StrictMode>)
