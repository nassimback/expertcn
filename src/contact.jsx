import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/outfit'
import { EnvelopeSimple, MapPin, Phone } from '@phosphor-icons/react'
import { ContactForm } from './contact-shared'
import { products } from './catalogue.generated'
import { formationBySlug } from './formation-data'
import { SiteFooter, SiteHeader, useRequestList } from './shop-shared'
import './contact.css'

function ContactPage() {
  const params = new URLSearchParams(window.location.search)
  const subject = params.get('sujet') || ''
  const formation = params.get('formation')
  const product = params.get('produit')
  const formationName = formationBySlug.get(formation)?.title
  const productName = products.find((item) => item.slug === product)?.name
  const context = formationName
    ? `la formation « ${formationName} »`
    : productName ? `le produit « ${productName} »` : ''
  const { requestItems, removeRequestItem, clearRequestItems } = useRequestList()

  useEffect(() => { document.title = 'Contact | ExpertCN' }, [])

  useEffect(() => {
    if (window.location.hash !== '#contact-form') return undefined
    const frame = window.requestAnimationFrame(() => document.querySelector('#contact-form')?.scrollIntoView({ block: 'start' }))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  return (
    <div className="shop-page contact-page">
      <SiteHeader active="contact" requestItems={requestItems} onRemoveCartItem={removeRequestItem} onClearCart={clearRequestItems} />
      <main>
        <section className="contact-hero">
          <img className="contact-hero-media" src="/images/contact/contact-hero.png" alt="Technicien ExpertCN présentant des équipements fibre optique à un client" fetchPriority="high" />
          <div className="contact-hero-copy">
            <p>Contact ExpertCN</p>
            <h1>Parlons de votre projet.</h1>
            <span>Équipement, maintenance ou formation : décrivez votre besoin et notre équipe vous orientera vers la bonne solution.</span>
          </div>
          <aside>
            <a href="tel:+33189624501"><Phone weight="duotone" /><span><small>Téléphone</small><strong>+33 1 89 62 45 01</strong></span></a>
            <a href="mailto:service.client@expertcn.fr"><EnvelopeSimple weight="duotone" /><span><small>E-mail</small><strong>service.client@expertcn.fr</strong></span></a>
            <div><MapPin weight="duotone" /><span><small>Zone d’intervention</small><strong>France</strong></span></div>
          </aside>
        </section>
        <section className="contact-form-section" aria-labelledby="contact-form-title">
          <div className="contact-form-intro">
            <p>Votre demande</p>
            <h2 id="contact-form-title">Comment pouvons-nous vous aider ?</h2>
            <span>Les champs marqués d’un astérisque sont obligatoires.</span>
            <img src="/images/contact/contact-fibre-support.png" alt="Préparation d’une connexion fibre optique avec un appareil de mesure" loading="lazy" />
          </div>
          <ContactForm defaultSubject={subject} context={context} id="contact-form" />
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

createRoot(document.getElementById('root')).render(<React.StrictMode><ContactPage /></React.StrictMode>)
