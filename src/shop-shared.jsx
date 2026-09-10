import React, { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  ArrowRight,
  CaretDown,
  Check,
  ClockCounterClockwise,
  EnvelopeSimple,
  List,
  MagnifyingGlass,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  SignOut,
  Trash,
  Truck,
  UserCircle,
  X,
} from '@phosphor-icons/react'
import { catalogueCategories, products } from './catalogue.generated'
import { formationCategories, formations } from './formation-data'
import { rankSearchResults } from './search-utils'
import './site-chrome.css'

const requestStorageKey = 'expertcn-cart'
const legacyRequestStorageKey = 'expertcn-request'
const accountStorageKey = 'expertcn-account'

const sitePages = [
  { label: 'Accueil ExpertCN', href: '/', type: 'Page' },
  { label: 'Matériels', href: '/materiel-telecom-fibre-optique/', type: 'Page' },
  { label: 'Boutique', href: '/boutique/', type: 'Page' },
  { label: 'Maintenance SAV', href: '/sav/', type: 'Service' },
  { label: 'Formations', href: '/formations/', type: 'Page' },
  { label: 'À propos', href: '/a-propos-de-notre-mission/', type: 'Page' },
  { label: 'Contact', href: '/contact/', type: 'Page' },
]

// Keep the first row balanced, with active equipment leading the second row.
const megaCatalogueLayout = {
  'Tests et mesures': { order: 1, column: 1 },
  'Raccordement optique': { order: 2, column: 2 },
  Consommables: { order: 3, column: 3 },
  'Tirage et sécurité': { order: 4, column: 4 },
  'Équipements Actifs': { order: 5, column: 1 },
  'Identification de réseau': { order: 6, column: 2 },
  'Soudeuses fibre optique': { order: 7, column: 3 },
}
const megaCatalogueCategories = [...catalogueCategories].sort((a, b) => megaCatalogueLayout[a.name].order - megaCatalogueLayout[b.name].order)
const megaFormationCategories = [...formationCategories].sort((a, b) => b.courses.length - a.courses.length)

function catalogueUrl(category, subcategory = '') {
  const params = new URLSearchParams({ categorie: category })
  if (subcategory) params.set('sous-categorie', subcategory)
  return `/boutique/?${params.toString()}#catalogue`
}

function formationUrl(slug) {
  return `/formation.html?formation=${slug}`
}

export function ShopBrand() {
  return (
    <a className="shop-brand" href="/" aria-label="ExpertCN, accueil">
      <img src="/images/expertcn-logo.png" alt="" />
    </a>
  )
}

export function useRequestList() {
  const [requestItems, setRequestItems] = useState(() => {
    try {
      const savedItems = window.localStorage.getItem(requestStorageKey)
        || window.localStorage.getItem(legacyRequestStorageKey)
      return savedItems ? JSON.parse(savedItems) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    window.localStorage.setItem(requestStorageKey, JSON.stringify(requestItems))
  }, [requestItems])

  const addRequestItem = (productName) => {
    setRequestItems((items) => items.includes(productName) ? items : [...items, productName])
  }
  const removeRequestItem = (productName) => {
    setRequestItems((items) => items.filter((item) => item !== productName))
  }
  const clearRequestItems = () => setRequestItems([])

  return { requestItems, addRequestItem, removeRequestItem, clearRequestItems }
}

function GlobalSearch() {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  const suggestions = useMemo(() => {
    if (query.trim().length < 2) return []
    const productResults = rankSearchResults(products, query, (product) => `${product.name} ${product.brand} ${product.category} ${product.subcategory}`, 5)
      .map((product) => ({
        label: product.name,
        meta: `${product.brand} · ${product.subcategory}`,
        href: `/produit.html?produit=${product.slug}`,
        type: 'Produit',
      }))
    const formationResults = rankSearchResults(formations, query, (formation) => `${formation.title} ${formation.category}`, 3)
      .map((formation) => ({
        label: formation.title,
        meta: formation.category,
        href: formationUrl(formation.slug),
        type: 'Formation',
      }))
    const pageResults = rankSearchResults(sitePages, query, (page) => page.label, 2)
      .map((page) => ({ ...page, meta: page.type }))
    return [...productResults, ...formationResults, ...pageResults].slice(0, 8)
  }, [query])

  const submitSearch = (event) => {
    event.preventDefault()
    const value = query.trim()
    if (!value) return
    window.location.href = `/boutique/?q=${encodeURIComponent(value)}#catalogue`
  }

  return (
    <form className="global-search" role="search" onSubmit={submitSearch}>
      <span className="global-search-icon" aria-hidden="true"><MagnifyingGlass weight="bold" /></span>
      <label className="sr-only" htmlFor="global-search-input">Rechercher sur le site</label>
      <input
        id="global-search-input"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => window.setTimeout(() => setFocused(false), 140)}
        placeholder="Rechercher sur le site…"
        type="search"
        autoComplete="off"
      />
      <button className="global-search-submit" type="submit" aria-label="Lancer la recherche"><ArrowRight weight="bold" /></button>
      {focused && query.trim().length >= 2 && (
        <div className="global-search-results">
          {suggestions.length ? suggestions.map((result) => (
            <a href={result.href} key={`${result.type}-${result.label}`}>
              <span><strong>{result.label}</strong><small>{result.meta}</small></span>
              <b>{result.type}</b>
            </a>
          )) : (
            <div className="global-search-empty">Aucun résultat direct. Appuyez sur Entrée pour chercher dans le catalogue.</div>
          )}
        </div>
      )}
    </form>
  )
}

function MaterialMegaMenu() {
  return (
    <div className="mega-menu mega-menu-materials">
      <div className="mega-menu-intro">
        <span>Catalogue technique</span>
        <strong>Une navigation construite sur les usages terrain.</strong>
        <a href="/boutique/">Voir les {products.length} références <ArrowRight weight="bold" /></a>
      </div>
      <div className="mega-menu-grid">
        {megaCatalogueCategories.map((category) => (
          <section key={category.name} style={{ gridColumn: megaCatalogueLayout[category.name].column }}>
            <a className="mega-menu-title" href={catalogueUrl(category.name)}>{category.name}</a>
            <div>
              {category.subcategories.map((subcategory) => (
                <a href={catalogueUrl(category.name, subcategory)} key={subcategory}>{subcategory}</a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

function FormationsMegaMenu() {
  return (
    <div className="mega-menu mega-menu-formations">
      <div className="mega-menu-intro">
        <span>23 parcours</span>
        <strong>Des formations professionnelles organisées par métier.</strong>
        <a href="/formations/">Découvrir les formations <ArrowRight weight="bold" /></a>
      </div>
      <div className="mega-menu-grid">
        {megaFormationCategories.map((category) => (
          <section key={category.name}>
            <a className="mega-menu-title" href={`/formations/?categorie=${category.slug}`}>{category.name}</a>
            <div>
              {category.courses.map((formation) => (
                <a href={formationUrl(formation.slug)} key={formation.slug}>{formation.title}</a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

function CartPanel({ items, onRemove, onClear, onClose }) {
  return createPortal(
    <div className="chrome-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="chrome-panel cart-panel" role="dialog" aria-modal="true" aria-labelledby="cart-panel-title">
        <header><div><span>Votre sélection</span><h2 id="cart-panel-title">Mon panier</h2></div><button type="button" onClick={onClose} aria-label="Fermer le panier"><X /></button></header>
        {items.length ? (
          <>
            <div className="cart-list">
              {items.map((item) => (
                <div key={item}><Package weight="duotone" /><span>{item}</span><button type="button" onClick={() => onRemove?.(item)} aria-label={`Retirer ${item}`}><Trash /></button></div>
              ))}
            </div>
            <div className="cart-panel-actions">
              <a href="/contact/?sujet=Mat%C3%A9riel#contact-form">Finaliser avec un expert <ArrowRight weight="bold" /></a>
              <button type="button" onClick={onClear}>Vider le panier</button>
            </div>
          </>
        ) : (
          <div className="chrome-empty-state"><ShoppingBag weight="duotone" /><h3>Votre panier est vide.</h3><p>Ajoutez des références depuis le catalogue pour préparer votre demande.</p><a href="/boutique/">Explorer la boutique</a></div>
        )}
      </aside>
    </div>,
    document.body,
  )
}

function AccountPanel({ onClose }) {
  const [account, setAccount] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem(accountStorageKey) || 'null')
    } catch {
      return null
    }
  })
  const [tab, setTab] = useState('current')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingStatus, setTrackingStatus] = useState('')

  const createAccount = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const nextAccount = { name: data.get('name'), email: data.get('email') }
    window.localStorage.setItem(accountStorageKey, JSON.stringify(nextAccount))
    setAccount(nextAccount)
  }

  const signOut = () => {
    window.localStorage.removeItem(accountStorageKey)
    setAccount(null)
  }

  const trackOrder = (event) => {
    event.preventDefault()
    setTrackingStatus(trackingNumber.trim()
      ? 'Aucune commande locale ne correspond encore à ce numéro.'
      : 'Saisissez un numéro de commande.')
  }

  return createPortal(
    <div className="chrome-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="chrome-panel account-panel" role="dialog" aria-modal="true" aria-labelledby="account-panel-title">
        <header><div><span>Espace client</span><h2 id="account-panel-title">Mon compte</h2></div><button type="button" onClick={onClose} aria-label="Fermer le compte"><X /></button></header>
        {!account ? (
          <form className="account-create" onSubmit={createAccount}>
            <p>Créez votre espace pour retrouver vos commandes et suivre leur avancement.</p>
            <label><span>Nom complet</span><input name="name" required autoComplete="name" /></label>
            <label><span>Adresse e-mail</span><input name="email" type="email" required autoComplete="email" /></label>
            <label><span>Mot de passe</span><input name="password" type="password" minLength="8" required autoComplete="new-password" /></label>
            <button type="submit">Créer mon compte <ArrowRight weight="bold" /></button>
            <small>Prototype local : la connexion sécurisée sera reliée au CMS et au système de commandes.</small>
          </form>
        ) : (
          <div className="account-dashboard">
            <div className="account-welcome"><div><span>Bonjour</span><strong>{account.name}</strong><small>{account.email}</small></div><button type="button" onClick={signOut}><SignOut /> Déconnexion</button></div>
            <div className="account-tabs" role="tablist" aria-label="Rubriques du compte">
              <button className={tab === 'current' ? 'is-active' : ''} type="button" onClick={() => setTab('current')}><Truck /> En cours</button>
              <button className={tab === 'history' ? 'is-active' : ''} type="button" onClick={() => setTab('history')}><ClockCounterClockwise /> Historique</button>
              <button className={tab === 'tracking' ? 'is-active' : ''} type="button" onClick={() => setTab('tracking')}><Package /> Suivi</button>
            </div>
            {tab === 'tracking' ? (
              <form className="tracking-form" onSubmit={trackOrder}>
                <label><span>Numéro de commande</span><input value={trackingNumber} onChange={(event) => setTrackingNumber(event.target.value)} placeholder="Ex. ECN-2026-00124" /></label>
                <button type="submit">Suivre la commande</button>
                {trackingStatus && <p role="status">{trackingStatus}</p>}
              </form>
            ) : (
              <div className="account-order-empty">
                {tab === 'current' ? <Truck weight="duotone" /> : <ClockCounterClockwise weight="duotone" />}
                <h3>{tab === 'current' ? 'Aucune commande en cours.' : 'Aucun historique disponible.'}</h3>
                <p>Vos commandes apparaîtront ici dès que la connexion au système e-commerce sera activée.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>,
    document.body,
  )
}

export function SiteHeader({
  active = '',
  requestItems = [],
  requestCount,
  onRemoveCartItem,
  onClearCart,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const cartItems = requestItems.length ? requestItems : []
  const cartCount = requestCount ?? cartItems.length

  useEffect(() => {
    if (!cartOpen && !accountOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [cartOpen, accountOpen])

  return (
    <header className="shop-header">
      <div className="shop-header-inner">
        <ShopBrand />
        <GlobalSearch />
        <nav className="shop-nav" aria-label="Navigation principale">
          <div className="nav-menu-group">
            <div className="nav-menu-trigger">
              <a className={['material', 'boutique'].includes(active) ? 'is-active' : ''} href="/materiel-telecom-fibre-optique/">Matériels</a>
              <button type="button" className="mega-menu-toggle" aria-label="Ouvrir le menu Matériels"><CaretDown weight="bold" /></button>
            </div>
            <MaterialMegaMenu />
          </div>
          <a className={active === 'sav' ? 'is-active' : ''} href="/sav/">SAV</a>
          <div className="nav-menu-group">
            <a className={active === 'formations' ? 'is-active' : ''} href="/formations/">Formations <CaretDown weight="bold" /></a>
            <FormationsMegaMenu />
          </div>
          <a className={active === 'about' ? 'is-active' : ''} href="/a-propos-de-notre-mission/">À propos</a>
          <a className={active === 'contact' ? 'is-active' : ''} href="/contact/">Contact</a>
        </nav>
        <div className="shop-header-actions">
          <a className="header-phone" href="tel:+33189624501" aria-label="Appeler ExpertCN au 01 89 62 45 01"><Phone weight="duotone" /><span>01 89 62 45 01</span></a>
          <button className="account-button" type="button" onClick={() => setAccountOpen(true)} aria-label="Mon compte"><UserCircle weight="duotone" /><span>Mon compte</span></button>
          <button className="cart-button" type="button" onClick={() => setCartOpen(true)} aria-label="Ouvrir mon panier">
            <ShoppingBag weight="duotone" /><span>Mon panier</span><b>{cartCount}</b>
          </button>
          <button className="shop-menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}>
            {menuOpen ? <X /> : <List />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="shop-mobile-nav" aria-label="Navigation mobile">
          <details className="shop-mobile-materials"><summary><a href="/materiel-telecom-fibre-optique/" onClick={(event) => event.stopPropagation()}>Matériels</a><CaretDown /></summary><a href="/boutique/">Voir tout le catalogue</a>{catalogueCategories.map((category) => <a href={catalogueUrl(category.name)} key={category.name}>{category.name}</a>)}</details>
          <a href="/sav/">SAV</a>
          <details><summary>Formations <CaretDown /></summary>{formationCategories.map((category) => <a href={`/formations/?categorie=${category.slug}`} key={category.slug}>{category.name}</a>)}</details>
          <a href="/a-propos-de-notre-mission/">À propos</a>
          <a href="/contact/">Contact</a>
        </nav>
      )}
      {cartOpen && <CartPanel items={cartItems} onRemove={onRemoveCartItem} onClear={onClearCart} onClose={() => setCartOpen(false)} />}
      {accountOpen && <AccountPanel onClose={() => setAccountOpen(false)} />}
    </header>
  )
}

export function SiteNotice({ message }) {
  if (!message) return null
  return <div className="site-notice" role="status" aria-live="polite"><Check weight="bold" /> {message}</div>
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand"><ShopBrand /><p>Formons, accompagnons et entretenons avec passion.</p></div>
        <div className="footer-column"><strong>Expertises</strong><a href="/materiel-telecom-fibre-optique/">Matériels</a><a href="/boutique/">Boutique</a><a href="/sav/">SAV</a><a href="/formations/">Formations</a></div>
        <div className="footer-column"><strong>ExpertCN</strong><a href="/a-propos-de-notre-mission/">À propos</a><a href="/contact/">Contact</a><a href="/a-propos-de-notre-mission/#rse">Engagement RSE</a><a href="/formations/#qualite">Certification Qualiopi</a></div>
        <div className="footer-column footer-contact"><strong>Nous trouver</strong><span><MapPin weight="duotone" /> France</span><a href="tel:+33189624501"><Phone weight="duotone" /> +33 1 89 62 45 01</a><a href="mailto:service.client@expertcn.fr"><EnvelopeSimple weight="duotone" /> Nous écrire</a></div>
      </div>
      <div className="footer-bottom"><span>© 2026 Expert Center Networks</span><div><a href="/mentions-legales/">Mentions légales</a><a href="/conditions-generales-dutilisation/">Conditions générales d’utilisation</a><a href="/politique-de-confidentialite/">Politique de confidentialité</a></div></div>
    </footer>
  )
}
