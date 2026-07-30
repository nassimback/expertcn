import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
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
} from '@phosphor-icons/react'
import { products } from './catalogue.generated'
import { SiteFooter, SiteHeader, SiteNotice, useRequestList } from './shop-shared'
import './boutique.css'
import './product.css'

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
        <a href="/boutique.html"><ArrowLeft weight="bold" /> Retour à la boutique</a>
      </main>
      <SiteFooter />
      <SiteNotice message={notice} />
    </div>
  )
}

function ProductPage() {
  const slug = new URLSearchParams(window.location.search).get('produit')
  const product = products.find((item) => item.slug === slug)
  const [selections, setSelections] = useState({})
  const [activeImage, setActiveImage] = useState(product?.image || '')
  const [notice, setNotice] = useState('')
  const { requestItems, addRequestItem, removeRequestItem, clearRequestItems } = useRequestList()

  const relatedProducts = useMemo(() => {
    if (!product) return []
    const sameUse = products.filter((item) => item.slug !== product.slug && item.subcategory === product.subcategory)
    const sameFamily = products.filter((item) => item.slug !== product.slug && item.category === product.category && !sameUse.includes(item))
    return [...sameUse, ...sameFamily].slice(0, 4)
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
          <a href="/boutique.html"><ArrowLeft weight="bold" /> Boutique</a>
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
            <p className="single-product-summary">{product.description}</p>

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
              <a href="/#contact">Parler à un expert <ArrowRight weight="bold" /></a>
            </div>

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
            <a href="/#contact">Vérifier la compatibilité <ArrowRight weight="bold" /></a>
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
              <h2 id="related-title">À découvrir dans la même famille</h2>
              <a href="/boutique.html">Voir tout le catalogue <ArrowRight weight="bold" /></a>
            </div>
            <div className="related-grid">
              {relatedProducts.map((item) => <RelatedProduct product={item} key={item.slug} />)}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
      <SiteNotice message={notice} />
    </div>
  )
}

createRoot(document.getElementById('root')).render(<React.StrictMode><ProductPage /></React.StrictMode>)
