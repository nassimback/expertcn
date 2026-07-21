import React, { useEffect, useState } from 'react'
import {
  Check,
  EnvelopeSimple,
  List,
  MapPin,
  Phone,
  ShoppingBag,
  X,
} from '@phosphor-icons/react'
import './site-chrome.css'

const requestStorageKey = 'expertcn-request'

export function ShopBrand() {
  return (
    <a className="shop-brand" href="/" aria-label="ExpertCN, accueil">
      <img src="/images/expertcn-logo.png" alt="" />
      <span>EXPERT<span>CN</span></span>
    </a>
  )
}

export function useRequestList() {
  const [requestItems, setRequestItems] = useState(() => {
    try {
      const savedItems = window.localStorage.getItem(requestStorageKey)
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

  return { requestItems, addRequestItem }
}

export function SiteHeader({ active = '', requestCount = 0, onRequest }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const requestMessage = requestCount
    ? `${requestCount} équipement${requestCount > 1 ? 's' : ''} dans votre demande.`
    : 'Votre demande est encore vide.'

  return (
    <header className="shop-header">
      <div className="shop-header-inner">
        <ShopBrand />
        <nav className="shop-nav" aria-label="Navigation principale">
          <a className={active === 'home' ? 'is-active' : ''} href="/">Accueil</a>
          <a className={active === 'boutique' ? 'is-active' : ''} href="/boutique.html">Boutique</a>
          <a className={active === 'sav' ? 'is-active' : ''} href="/sav/">Maintenance</a>
          <a className={active === 'formations' ? 'is-active' : ''} href="/formations/">Formations</a>
        </nav>
        <div className="shop-header-actions">
          <button className="cart-button" type="button" onClick={() => onRequest?.(requestMessage)} aria-label="Voir votre demande">
            <ShoppingBag weight="duotone" /><span>Demande</span><b>{requestCount}</b>
          </button>
          <button className="shop-menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}>
            {menuOpen ? <X /> : <List />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="shop-mobile-nav" aria-label="Navigation mobile">
          <a href="/">Accueil</a>
          <a href="/boutique.html">Boutique</a>
          <a href="/sav/">Maintenance</a>
          <a href="/formations/">Formations</a>
        </nav>
      )}
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
        <div className="footer-column"><strong>Expertises</strong><a href="/materiel-telecom-fibre-optique/">Matériels</a><a href="/sav/">SAV</a><a href="/formations/">Formations</a><a href="/audit-telecoms/">Audit</a></div>
        <div className="footer-column"><strong>ExpertCN</strong><a href="/a-propos-de-notre-mission/">À propos</a><a href="/#contact">Contact</a><a href="/a-propos-de-notre-mission/#rse">Engagement RSE</a><a href="/formations/#qualite">Certification Qualiopi</a></div>
        <div className="footer-column footer-contact"><strong>Nous trouver</strong><span><MapPin weight="duotone" /> France</span><a href="tel:+33667676929"><Phone weight="duotone" /> 06 67 67 69 29</a><a href="mailto:service.client@expertcn.fr"><EnvelopeSimple weight="duotone" /> Nous écrire</a></div>
      </div>
      <div className="footer-bottom"><span>© 2026 Expert Center Networks</span><div><a href="/mentions-legales/">Mentions légales</a><a href="/conditions-generales-dutilisation/">Conditions générales d’utilisation</a><a href="/politique-de-confidentialite/">Politique de confidentialité</a></div></div>
    </footer>
  )
}
