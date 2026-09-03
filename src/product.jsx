import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createPortal } from 'react-dom'
import '@fontsource-variable/outfit'
import {
  ArrowLeft,
  ArrowRight,
  CaretDown,
  Headset,
  Package,
  ShieldCheck,
  ShoppingBag,
  Wrench,
  X,
} from '@phosphor-icons/react'
import { products } from './catalogue.generated'
import { ContactForm } from './contact-shared'
import { SiteFooter, SiteHeader, SiteNotice, useRequestList } from './shop-shared'
import './boutique.css'
import './product.css'
import './contact.css'

function RelatedProduct({ product }) {
  return (
    <a className="related-card" href={`/produit.html?produit=${product.slug}`}>
      <span className={`related-card-image ${product.imageMode === 'cover' ? 'is-cover' : ''}`}><img src={product.image} alt={product.name} loading="lazy" /></span>
      <span className="related-card-copy">
        <small>{product.brand}</small>
        <strong>{product.name}</strong>
        <span>Voir le produit <ArrowRight weight="bold" /></span>
      </span>
    </a>
  )
}

function ProductNotFound({ requestItems, notice, removeRequestItem, clearRequestItems }) {
  useEffect(() => {
    document.title = 'Produit introuvable | ExpertCN'
  }, [])

  return (
    <div className="shop-page">
      <SiteHeader active="boutique" requestItems={requestItems} onRemoveCartItem={removeRequestItem} onClearCart={clearRequestItems} />
      <main className="product-not-found">
        <Package weight="duotone" />
        <h1>Ce produit n’est pas disponible.</h1>
        <p>La référence demandée a peut-être changé. Retrouvez toutes les familles dans le catalogue ExpertCN.</p>
        <a href="/boutique/"><ArrowLeft weight="bold" /> Retour à la boutique</a>
      </main>
      <SiteFooter />
      <SiteNotice message={notice} />
    </div>
  )
}

function getComplementaryScore(product, candidate) {
  if (candidate.slug === product.slug) return Number.NEGATIVE_INFINITY

  const explicitCrossSells = product.crossSellSlugs || product.relatedSlugs || []
  const explicitIndex = explicitCrossSells.indexOf(candidate.slug)
  if (explicitIndex >= 0) return 10000 - explicitIndex

  let score = 0
  const sameBrand = product.brand === candidate.brand
  if (sameBrand) score += 24

  if (product.category === 'Soudeuses fibre optique') {
    if (candidate.subcategory === 'Électrodes' && sameBrand) score += 240
    if (product.subcategory === 'Soudeuses' && candidate.subcategory === 'Cliveuses' && sameBrand) score += 210
    if (product.subcategory === 'Cliveuses' && candidate.subcategory === 'Soudeuses' && sameBrand) score += 210
    if (/smooves/i.test(candidate.name)) score += 90
  } else if (product.category === 'Identification de réseau') {
    if (candidate.subcategory === 'Étiquettes & Rubans' && sameBrand) score += 260
  } else if (product.category === 'Équipements Actifs') {
    if (candidate.category === 'Accessoires' && sameBrand) score += 280
    if (product.subcategory === 'CPE' && candidate.subcategory === 'Modules optiques') score += 100
  } else if (product.category === 'Accessoires') {
    if (candidate.subcategory === 'CPE' && sameBrand) score += 280
  } else if (product.category === 'Tirage et sécurité') {
    if (candidate.category === product.category && candidate.subcategory !== product.subcategory) score += 190
    if (candidate.subcategory === 'Colliers') score += 110
  } else if (product.category === 'Raccordement optique') {
    if (candidate.category === 'Consommables' && ['Divers', 'Consommables', 'Colliers'].includes(candidate.subcategory)) score += 180
    if (candidate.category === product.category && candidate.subcategory !== product.subcategory) score += 105
  } else if (product.category === 'Tests et mesures') {
    if (candidate.category === product.category && sameBrand && candidate.subcategory !== product.subcategory) score += 150
    if (candidate.subcategory === 'Logiciels' && sameBrand) score += 90
  } else if (product.category === 'Consommables') {
    if (product.subcategory === 'Électrodes' && candidate.category === 'Soudeuses fibre optique' && sameBrand) score += 260
    if (product.subcategory === 'Étiquettes & Rubans' && candidate.category === 'Identification de réseau' && sameBrand) score += 260
    if (['Divers', 'Consommables', 'Colliers'].includes(product.subcategory) && candidate.category === 'Raccordement optique') score += 130
  }

  return score
}

function getComplementaryProducts(product) {
  return products
    .map((candidate, index) => ({ candidate, index, score: getComplementaryScore(product, candidate) }))
    .filter(({ score }) => score >= 80)
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .slice(0, 4)
    .map(({ candidate }) => candidate)
}

function ProductContactModal({ product, onClose }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event) => event.key === 'Escape' && onClose()
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return createPortal(
    <div className="contact-modal-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="product-contact-title">
        <header><div><span>Conseil produit</span><h2 id="product-contact-title">Parler à un expert</h2></div><button className="contact-modal-close" type="button" onClick={onClose} aria-label="Fermer le formulaire"><X /></button></header>
        <ContactForm defaultSubject="Matériel" context={`le produit « ${product.name} »`} compact />
      </section>
    </div>,
    document.body,
  )
}

function ProductPage() {
  const slug = new URLSearchParams(window.location.search).get('produit')
  const product = products.find((item) => item.slug === slug)
  const [selections, setSelections] = useState({})
  const [activeImage, setActiveImage] = useState(product?.image || '')
  const [notice, setNotice] = useState('')
  const [contactOpen, setContactOpen] = useState(false)
  const { requestItems, addRequestItem, removeRequestItem, clearRequestItems } = useRequestList()

  const relatedProducts = useMemo(() => {
    if (!product) return []
    return getComplementaryProducts(product)
  }, [product])

  useEffect(() => {
    if (!product) return
    document.title = `${product.name} | ExpertCN`
    setSelections({})
    setActiveImage(product.image)
  }, [product])

  useEffect(() => {
    if (!notice) return undefined
    const timer = window.setTimeout(() => setNotice(''), 3000)
    return () => window.clearTimeout(timer)
  }, [notice])

  if (!product) return <ProductNotFound requestItems={requestItems} notice={notice} removeRequestItem={removeRequestItem} clearRequestItems={clearRequestItems} />

  const configurableOptions = product.options.filter((option) => !option.pending)
  const allRequiredOptionsSelected = configurableOptions.every((option) => selections[option.name])
  const hasPendingOptions = product.options.some((option) => option.pending)
  const galleryImages = product.gallery?.length ? product.gallery : [product.image]

  const addConfiguredProduct = () => {
    if (!allRequiredOptionsSelected) {
      setNotice('Choisissez chaque option avant d’ajouter le produit.')
      return
    }
    const optionSummary = configurableOptions.map((option) => selections[option.name]).filter(Boolean).join(', ')
    const requestLabel = optionSummary ? `${product.name} - ${optionSummary}` : product.name
    addRequestItem(requestLabel)
    setNotice(`${product.name} a été ajouté à votre panier.`)
  }

  return (
    <div className="shop-page single-product-page">
      <SiteHeader active="boutique" requestItems={requestItems} onRemoveCartItem={removeRequestItem} onClearCart={clearRequestItems} />

      <main>
        <nav className="product-breadcrumb" aria-label="Fil d’Ariane">
          <a href="/boutique/"><ArrowLeft weight="bold" /> Boutique</a>
          <span aria-hidden="true">/</span>
          <span>{product.category}</span>
        </nav>

        <section className="single-product-hero" aria-labelledby="product-title">
          <div className={`single-product-media ${product.imageMode === 'cover' ? 'is-cover' : ''}`}>
            <img
              src={activeImage || product.image}
              alt={product.name}
              fetchPriority="high"
              onError={(event) => {
                event.currentTarget.onerror = null
                event.currentTarget.src = '/images/shop/shop-hero.jpg'
              }}
            />
            {galleryImages.length > 1 && (
              <div className="single-product-thumbnails" aria-label="Galerie produit">
                {galleryImages.map((image, index) => (
                  <button
                    className={image === activeImage ? 'is-active' : ''}
                    type="button"
                    onClick={() => setActiveImage(image)}
                    aria-label={`Afficher l’image ${index + 1} de ${product.name}`}
                    key={image}
                  >
                    <img src={image} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="single-product-purchase">
            <div className="single-product-meta"><span>{product.brand}</span><span>{product.subcategory}</span></div>
            <h1 id="product-title" className={product.name.length > 36 ? 'is-long' : ''}>{product.name}</h1>
            {product.summaryPlacement !== 'after-actions' && <p className="single-product-summary">{product.description}</p>}

            {product.type === 'Variable' && (
              <div className="product-configurator">
                <h2>Choisissez votre configuration</h2>
                {product.options.map((option) => (
                  <label className="product-option" key={option.name}>
                    <span>{option.name}</span>
                    <span className={`product-select ${option.pending ? 'is-pending' : ''}`}>
                      <select
                        disabled={option.pending}
                        value={selections[option.name] || ''}
                        onChange={(event) => setSelections((current) => ({ ...current, [option.name]: event.target.value }))}
                      >
                        <option value="">{option.pending ? 'À définir avec ExpertCN' : 'Sélectionner une option'}</option>
                        {option.values.map((value) => <option value={value} key={value}>{value}</option>)}
                      </select>
                      <CaretDown weight="bold" />
                    </span>
                    {option.pending && <small>La configuration exacte sera définie avec un conseiller technique.</small>}
                  </label>
                ))}
              </div>
            )}

            <div className="single-product-actions">
              <button type="button" onClick={addConfiguredProduct}>
                <ShoppingBag weight="duotone" /> Ajouter au panier
              </button>
              <button className="expert-contact-button" type="button" onClick={() => setContactOpen(true)}>Parler à un expert <ArrowRight weight="bold" /></button>
            </div>

            {product.summaryPlacement === 'after-actions' && <p className="single-product-summary is-after-actions">{product.description}</p>}

            {hasPendingOptions && <p className="configuration-note">Aucune option ne sera imposée. Notre équipe validera la configuration avec vous.</p>}
            <p className="quote-note">Tarif et disponibilité communiqués sur demande.</p>
          </div>
        </section>

        <section className="product-service-strip" aria-label="Accompagnement ExpertCN">
          <div><ShieldCheck weight="duotone" /><span><strong>Choix sécurisé</strong>Compatibilité vérifiée avant validation.</span></div>
          <div><Wrench weight="duotone" /><span><strong>SAV spécialisé</strong>Maintenance assurée par nos techniciens.</span></div>
          <div><Headset weight="duotone" /><span><strong>Conseil terrain</strong>Une réponse adaptée à votre usage.</span></div>
        </section>

        <section className="single-product-information" aria-labelledby="description-title">
          <div className="product-description-copy">
            <h2 id="description-title">Description</h2>
            {product.longDescription.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <a href={`/contact/?sujet=Mat%C3%A9riel&produit=${encodeURIComponent(product.slug)}#contact-form`}>Vérifier la compatibilité <ArrowRight weight="bold" /></a>
          </div>

          <dl className="product-facts">
            <div><dt>Marque</dt><dd>{product.brand}</dd></div>
            <div><dt>Famille</dt><dd>{product.category}</dd></div>
            <div><dt>Usage</dt><dd>{product.subcategory}</dd></div>
            <div><dt>Type</dt><dd>{product.type === 'Variable' ? 'Produit configurable' : 'Référence simple'}</dd></div>
            {product.sku && <div className="product-fact-wide"><dt>Référence</dt><dd>{product.sku}</dd></div>}
          </dl>
        </section>

        {relatedProducts.length > 0 && (
          <section className="related-products" aria-labelledby="related-title">
            <div className="related-heading">
              <h2 id="related-title">Produits complémentaires et accessoires</h2>
            </div>
            <div className="related-grid">
              {relatedProducts.map((item) => <RelatedProduct product={item} key={item.slug} />)}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
      <SiteNotice message={notice} />
      {contactOpen && <ProductContactModal product={product} onClose={() => setContactOpen(false)} />}
    </div>
  )
}

createRoot(document.getElementById('root')).render(<React.StrictMode><ProductPage /></React.StrictMode>)
