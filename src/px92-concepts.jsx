import React, { useState } from 'react'
import { ArrowRight, CaretLeft, CaretRight, CheckCircle } from '@phosphor-icons/react'
import './px92-concepts.css'

const photo = '/images/site/nouveaute-veex-px92.png'
const productHref = '/produit.html?produit=analyseur-pon-px92'
const description = 'Un analyseur PON compact pour l’activation et le diagnostic des réseaux GPON et XGS-PON sur le terrain.'
const slides = [
  { title: 'Un format compact. Une vision complète.', text: description, label: 'Vue d’ensemble' },
  { title: 'Activez vos réseaux optiques.', text: 'Accompagnez la mise en service de vos réseaux GPON et XGS-PON avec un analyseur conçu pour le terrain.', label: 'Activation' },
  { title: 'Identifiez les défauts sur le terrain.', text: 'Analysez les signaux PON et contrôlez les niveaux de puissance optique pour guider votre diagnostic.', label: 'Diagnostic' },
]

function Photo({ className = '' }) {
  return <div className={`px92-photo ${className}`}><img src={photo} alt="Analyseur PON VeEX PX92, visuel fourni par ExpertCN" loading="lazy" width="1280" height="1590" /></div>
}

function Cta() {
  return <a className="service-button px92-cta" href={productHref}>Découvrir le produit <ArrowRight weight="bold" /></a>
}

function Copy({ children, compact = false }) {
  return <div className={`px92-copy ${compact ? 'px92-copy-compact' : ''}`}>
    <div><span className="px92-brand">VeEX</span><h3>PX92</h3><p>{description}</p>{children}</div>
    <footer><Cta /></footer>
  </div>
}

function Carousel() {
  const [slide, setSlide] = useState(0)
  const move = (step) => setSlide((value) => (value + step + slides.length) % slides.length)
  return <div className="px92-carousel">
    <Photo className={`px92-carousel-photo px92-crop-${slide}`} />
    <div className="px92-carousel-copy">
      <span className="px92-brand">VeEX PX92</span>
      <div className="px92-slide-copy" aria-live="polite" aria-atomic="true"><h3>{slides[slide].title}</h3><p>{slides[slide].text}</p></div>
      <div className="px92-slide-controls" role="group" aria-label="Vues du PX92">
        <button type="button" onClick={() => move(-1)} aria-label="Vue précédente"><CaretLeft /></button>
        <div>{slides.map((item, index) => <button type="button" key={item.label} aria-label={item.label} aria-pressed={slide === index} onClick={() => setSlide(index)}><span /></button>)}</div>
        <button type="button" onClick={() => move(1)} aria-label="Vue suivante"><CaretRight /></button>
      </div>
      <footer><Cta /></footer>
    </div>
  </div>
}

function Concept({ value }) {
  switch (value) {
    case 0: return <div className="px92-split"><Copy /><Photo /></div>
    case 1: return <div className="px92-card-scene"><article className="px92-product-card"><Photo /><Copy compact><div className="px92-networks"><span>GPON</span><span>XGS-PON</span></div></Copy></article></div>
    case 2: return <div className="px92-spotlight"><div className="px92-spotlight-name"><span className="px92-brand">VeEX</span><h3>PX92</h3><p>L’analyse PON,<br />au plus près du terrain.</p></div><Photo /><div className="px92-spotlight-detail"><p>{description}</p><span>GPON / XGS-PON</span></div><footer><Cta /></footer></div>
    case 3: return <div className="px92-asymmetric"><Photo /><div className="px92-asymmetric-panel"><Copy compact /></div></div>
    case 4: return <div className="px92-minimal"><Copy /><Photo /></div>
    case 5: return <div className="px92-features"><Photo /><div className="px92-features-copy"><span className="px92-brand">VeEX</span><h3>PX92</h3><p>De l’activation au diagnostic, un outil pour vos interventions fibre.</p><dl>{[['GPON & XGS-PON', 'Pour les réseaux optiques passifs.'], ['Activation', 'Accompagnez la mise en service.'], ['Diagnostic', 'Contrôlez les niveaux optiques.'], ['Format compact', 'Conçu pour les interventions terrain.']].map(([title, text]) => <div key={title}><CheckCircle weight="duotone" /><dt>{title}</dt><dd>{text}</dd></div>)}</dl><footer><Cta /></footer></div></div>
    case 6: return <Carousel />
    default: return null
  }
}

export default function Px92Concepts() {
  return <section className="service-section px92-review" id="nouveautes" aria-labelledby="new-arrival-title">
    <div className="px92-design px92-design-4">
      <header className="px92-section-heading"><h2 id="new-arrival-title">Nos nouveautés du moment</h2></header>
      <div className="px92-stage"><Concept value={3} /></div>
    </div>
  </section>
}
