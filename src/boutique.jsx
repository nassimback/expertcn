import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/outfit'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CaretDown,
  FunnelSimple,
  MagnifyingGlass,
  Package,
  Plus,
  SlidersHorizontal,
  Tag,
} from '@phosphor-icons/react'
import { catalogueCategories, partnerPage, products } from './catalogue.generated'
import { getSpellingSuggestions, isExactSearchMatch, isFuzzySearchMatch, normalizeSearchText } from './search-utils'
import { SiteFooter, SiteHeader, SiteNotice, useRequestList } from './shop-shared'
import './boutique.css'

const allCategories = [
  { name: 'Tous les équipements', key: 'all', description: 'Parcourez toute la sélection ExpertCN.' },
  ...catalogueCategories.map((category) => ({ ...category, key: category.name })),
]

const productSearchText = (product) => `${product.name} ${product.brand} ${product.category} ${product.subcategory} ${product.description}`

function ProductCard({ product, onAdd }) {
  return (
    <article className="product-card">
      <a className={`product-image ${product.imageMode === 'cover' ? 'is-cover' : ''}`} href={`/produit.html?produit=${product.slug}`} aria-label={`Voir ${product.name}`}>
        <img src={product.image} alt={product.name} loading="lazy" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/images/shop/shop-hero.jpg' }} />
      </a>
      <div className="product-details">
        <div className="product-meta"><span>{product.brand}</span><span>{product.subcategory}</span></div>
        <h3><a className="product-title-link" href={`/produit.html?produit=${product.slug}`}>{product.name}</a></h3>
        <p>{product.description}</p>
        {product.type === 'Variable' && (
          <span className="product-type"><Tag weight="duotone" />Plusieurs variantes</span>
        )}
      </div>
      <div className="product-actions">
        <button type="button" onClick={() => onAdd(product)}><Plus weight="bold" /> Ajouter</button>
        <a className="details-button" href={`/produit.html?produit=${product.slug}`}>Détails <ArrowUpRight weight="bold" /></a>
      </div>
    </article>
  )
}

function Boutique() {
  const urlParams = new URLSearchParams(window.location.search)
  const requestedCategory = urlParams.get('categorie')
  const initialCategory = catalogueCategories.some((item) => item.name === requestedCategory) ? requestedCategory : 'all'
  const initialCategoryData = catalogueCategories.find((item) => item.name === initialCategory)
  const requestedSubcategory = urlParams.get('sous-categorie')
  const [category, setCategory] = useState(initialCategory)
  const [subcategory, setSubcategory] = useState(initialCategoryData?.subcategories.includes(requestedSubcategory) ? requestedSubcategory : 'all')
  const [query, setQuery] = useState(urlParams.get('q') || '')
  const [visibleCount, setVisibleCount] = useState(12)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const { requestItems, addRequestItem, removeRequestItem, clearRequestItems } = useRequestList()

  const selectedCategory = catalogueCategories.find((item) => item.name === category)

  const scopedProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = category === 'all' || product.category === category
    const matchesSubcategory = subcategory === 'all' || product.subcategory === subcategory
    return matchesCategory && matchesSubcategory
  }), [category, subcategory])

  const exactProducts = useMemo(() => {
    if (!normalizeSearchText(query)) return scopedProducts
    return scopedProducts.filter((product) => isExactSearchMatch(query, productSearchText(product)))
  }, [query, scopedProducts])

  const filteredProducts = useMemo(() => {
    return normalizeSearchText(query)
      ? scopedProducts.filter((product) => isFuzzySearchMatch(query, productSearchText(product)))
      : scopedProducts
  }, [query, scopedProducts])

  const spellingSuggestions = useMemo(() => {
    if (!normalizeSearchText(query) || exactProducts.length) return []
    const terms = scopedProducts.flatMap((product) => [product.name, product.brand, product.category, product.subcategory])
    return getSpellingSuggestions(query, terms)
  }, [exactProducts.length, query, scopedProducts])

  const showPartnerPage = useMemo(() => {
    if (!partnerPage || !['all', 'Équipements Actifs'].includes(category)) return false
    if (!['all', 'Modules optiques'].includes(subcategory)) return false
    return !normalizeSearchText(query) || isFuzzySearchMatch(query, `${partnerPage.name} ${partnerPage.brand} ${partnerPage.subcategory}`)
  }, [category, subcategory, query])

  useEffect(() => setVisibleCount(12), [category, subcategory, query])

  useEffect(() => {
    if (window.location.hash !== '#catalogue') return
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.querySelector('#catalogue')?.scrollIntoView({ block: 'start' })
      })
    })
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    if (category !== 'all') params.set('categorie', category)
    if (subcategory !== 'all') params.set('sous-categorie', subcategory)
    if (query.trim()) params.set('q', query.trim())
    const queryString = params.toString()
    window.history.replaceState({}, '', `${window.location.pathname}${queryString ? `?${queryString}` : ''}${window.location.hash}`)
  }, [category, subcategory, query])

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
    setNotice(`${product.name} a été ajouté à votre panier.`)
  }

  const categoryCount = (key) => key === 'all' ? products.length : products.filter((product) => product.category === key).length
  const resultLabel = `${filteredProducts.length} équipement${filteredProducts.length > 1 ? 's' : ''}${showPartnerPage ? ' + 1 gamme partenaire' : ''}`

  return (
    <div className="shop-page">
      <SiteHeader active="boutique" requestItems={requestItems} onRemoveCartItem={removeRequestItem} onClearCart={clearRequestItems} />

      <main>
        <header className="shop-hero shop-hero-compact" aria-labelledby="shop-hero-title">
          <h1 id="shop-hero-title">Boutique ExpertCN</h1>
        </header>

        <section className="shop-catalogue" id="catalogue">
          <div className="catalogue-heading">
            <p className="shop-eyebrow">Catalogue ExpertCN</p>
            <h2>Trouvez votre prochaine référence.</h2>
            <p>Filtrez par famille ou usage, puis ajoutez les équipements à votre panier.</p>
          </div>

          <div className="catalogue-toolbar">
            <label className="shop-search"><MagnifyingGlass weight="bold" /><span className="sr-only">Rechercher un produit</span><input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Produit, marque ou usage" /></label>
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
              <div className="filter-help"><Package weight="duotone" /><strong>Besoin d’un conseil?</strong><p>Notre équipe vérifie la compatibilité de votre sélection.</p><a href="/contact/?sujet=Mat%C3%A9riel#contact-form">Parler à un expert <ArrowUpRight weight="bold" /></a></div>
            </aside>

            <div className="product-area">
              {spellingSuggestions.length > 0 && (
                <div className="search-correction" role="status">
                  <span>Aucun résultat exact pour « {query.trim()} ».</span>
                  <p>Vouliez-vous dire : {spellingSuggestions.map((suggestion) => <button type="button" onClick={() => setQuery(suggestion)} key={suggestion}>{suggestion}</button>)}</p>
                  {filteredProducts.length > 0 && <small>Les résultats les plus proches sont affichés ci-dessous.</small>}
                </div>
              )}
              {showPartnerPage && (
                <article className="partner-feature">
                  <div className="partner-image"><img src="/images/newlinks_cover_page.jpg" alt="Modules optiques compatibles Newlinks" /></div>
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
                <div className="empty-products"><MagnifyingGlass weight="duotone" /><h3>Aucun équipement trouvé.</h3><p>Vérifiez l’orthographe ou essayez un autre terme. Vous restez dans le catalogue.</p><button type="button" onClick={() => { setQuery(''); chooseCategory('all') }}>Réinitialiser les filtres</button></div>
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
            <p>Compatibilité, variantes et usages terrain : nous vérifions chaque point avant la validation.</p>
            <a className="shop-primary-link" href="/contact/?sujet=Mat%C3%A9riel#contact-form">Parler à un expert <ArrowRight weight="bold" /></a>
          </div>
        </section>
      </main>

      <SiteFooter />
      <SiteNotice message={notice} />
    </div>
  )
}

createRoot(document.getElementById('root')).render(<React.StrictMode><Boutique /></React.StrictMode>)
