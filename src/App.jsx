import React, { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Buildings,
  CaretLeft,
  CaretRight,
  ChartLineUp,
  Check,
  EnvelopeSimple,
  GraduationCap,
  Phone,
  Quotes,
  Wrench,
} from '@phosphor-icons/react'
import { SiteFooter, SiteHeader, SiteNotice, useRequestList } from './shop-shared'

const services = [
  {
    icon: Buildings,
    index: '01',
    title: 'Équipements télécoms',
    text: 'Une sélection professionnelle du passif à l’actif, accompagnée par une expertise technique qui sécurise chaque choix.',
    className: 'service-equipment',
  },
  {
    icon: Wrench,
    index: '02',
    title: 'Centre de maintenance',
    text: 'Diagnostic, calibration et réparation de vos soudeuses, cliveuses et réflectomètres dans des délais maîtrisés.',
    className: 'service-maintenance',
  },
  {
    icon: GraduationCap,
    index: '03',
    title: 'Formations qualifiantes',
    text: 'Des parcours concrets en fibre optique, 5G, habilitations et énergie pour développer les compétences qui comptent.',
    className: 'service-training',
  },
  {
    icon: ChartLineUp,
    index: '04',
    title: 'Audits télécoms',
    text: 'Une lecture complète de vos infrastructures, coûts, actifs et risques pour transformer les constats en résultats.',
    className: 'service-audit',
  },
]

const testimonials = [
  {
    quote: 'Des conseils adaptés à notre besoin et un service de livraison en 24 h. Une équipe réellement disponible.',
    name: 'Alexis',
    role: 'Client équipements',
  },
  {
    quote: 'Le SAV est exemplaire. Notre appareil a été diagnostiqué et réparé en moins de 72 h.',
    name: 'Samira',
    role: 'Responsable technique',
  },
  {
    quote: 'La formation sur mesure en réflectométrie m’a fait gagner en autonomie dès mon retour sur le terrain.',
    name: 'Nabil',
    role: 'Technicien fibre optique',
  },
  {
    quote: 'Le diagnostic de notre infrastructure a débouché sur un plan d’action clair et des économies mesurables.',
    name: 'Aïssa',
    role: 'Responsable de projet',
  },
  {
    quote: 'Une équipe technique qui comprend le terrain, anticipe les contraintes et reste disponible après la livraison.',
    name: 'Mélanie',
    role: 'Responsable exploitation',
  },
  {
    quote: 'Du choix de l’équipement à sa mise en service, nous avons été accompagnés avec méthode et transparence.',
    name: 'Karim',
    role: 'Chef d’équipe fibre',
  },
]

function App() {
  const [formStatus, setFormStatus] = useState('idle')
  const [headerNotice, setHeaderNotice] = useState('')
  const testimonialsRef = useRef(null)
  const { requestItems } = useRequestList()

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const elements = document.querySelectorAll('[data-reveal]')
    if (prefersReducedMotion) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14 },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!headerNotice) return undefined
    const timer = window.setTimeout(() => setHeaderNotice(''), 2800)
    return () => window.clearTimeout(timer)
  }, [headerNotice])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!event.currentTarget.checkValidity()) {
      setFormStatus('error')
      event.currentTarget.reportValidity()
      return
    }
    setFormStatus('loading')
    window.setTimeout(() => setFormStatus('success'), 700)
  }

  const scrollTestimonials = (direction) => {
    const track = testimonialsRef.current
    if (!track) return
    track.scrollBy({ left: direction * Math.round(track.clientWidth * 0.74), behavior: 'smooth' })
  }

  return (
    <div className="site-shell">
      <SiteHeader active="home" requestCount={requestItems.length} onRequest={setHeaderNotice} />

      <main>
        <section className="hero" id="accueil">
          <div className="hero-media" aria-hidden="true">
            <img src="/images/expertcn-hero.jpg" alt="" fetchPriority="high" />
          </div>
          <div className="hero-overlay" />
          <div className="hero-inner">
            <div className="hero-copy">
              <p className="eyebrow hero-kicker">Télécoms et énergie, de bout en bout</p>
              <h1>Vos projets avancent. Nous sécurisons la suite.</h1>
              <p className="hero-description">Équipements, maintenance, formation et audit réunis au sein d’un partenaire technique unique.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#contact">Nous contacter <ArrowRight weight="bold" /></a>
                <a className="button button-ghost" href="#expertises">Découvrir ExpertCN</a>
              </div>
            </div>
          </div>
        </section>

        <section className="proof-strip" aria-label="Chiffres clés">
          <div className="proof-intro">
            <img src="/images/trust-medallion.jpg" alt="Médaillon de confiance ExpertCN" />
            <span>La confiance se construit sur des résultats.</span>
          </div>
          <div className="proof-number"><strong>494+</strong><span>projets réalisés</span></div>
          <div className="proof-number"><strong>10 ans</strong><span>d’expertise terrain</span></div>
          <div className="proof-number"><strong>4,5/5</strong><span>satisfaction client</span></div>
        </section>

        <section className="section expertise-section" id="expertises">
          <div className="expertise-heading" data-reveal>
            <div>
              <p className="eyebrow">ExpertCN, partenaire opérationnel</p>
              <h2>Une seule équipe pour faire avancer l’ensemble de vos enjeux télécoms.</h2>
            </div>
            <p>Du matériel à la transmission des compétences, nous intervenons avec une lecture complète de votre activité et de vos priorités.</p>
          </div>
          <div className="expertise-layout">
            <div className="expertise-visual" data-reveal>
              <img src="/images/expertcn-maintenance.jpg" alt="Intervention de précision sur un équipement fibre optique" loading="lazy" />
              <div className="expertise-visual-caption"><strong>Une vision 360°</strong><span>Conseil, service et savoir-faire au même endroit.</span></div>
            </div>
            <div className="services-grid">
            {services.map(({ icon: Icon, ...service }, index) => (
              <article
                className={`service-card ${service.className}`}
                key={service.title}
                data-reveal
                style={{ '--delay': `${index * 90}ms` }}
              >
                <div className="service-top">
                  <span className="service-icon"><Icon weight="duotone" /></span>
                  <span className="service-index">{service.index}</span>
                </div>
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                  <a href="#contact">Découvrir <ArrowUpRight weight="bold" /></a>
                </div>
              </article>
            ))}
            <div className="expertise-secondary-image" data-reveal>
              <img src="/images/expertcn-formation.jpg" alt="Professionnels en formation pratique sur des équipements fibre optique" loading="lazy" />
            </div>
            </div>
          </div>
        </section>

        <section className="section maintenance-section" id="maintenance">
          <div className="maintenance-image" data-reveal>
            <img src="/images/expertcn-maintenance.jpg" alt="Technicien calibrant une soudeuse fibre optique dans le laboratoire ExpertCN" loading="lazy" />
            <div className="image-stat">
              <strong>100+</strong>
              <span>équipements réparés chaque mois</span>
            </div>
          </div>
          <div className="maintenance-copy" data-reveal>
            <span className="inline-icon"><Wrench weight="duotone" /></span>
            <h2>Un centre de maintenance qui réduit vraiment l’immobilisation.</h2>
            <p>Nos techniciens prennent en charge vos soudeuses, cliveuses et équipements de réflectométrie avec un suivi clair à chaque étape.</p>
            <div className="maintenance-services" aria-label="Prestations de maintenance">
              <span><Check weight="bold" /> Diagnostic</span>
              <span><Check weight="bold" /> Calibration</span>
              <span><Check weight="bold" /> Réparation</span>
              <span><Check weight="bold" /> Mise à jour</span>
            </div>
            <a className="text-link" href="#contact">Soumettre une demande RMA <ArrowRight weight="bold" /></a>
          </div>
        </section>

        <section className="section process-section">
          <div className="process-board">
            <div className="process-image" data-reveal>
              <img src="/images/expertcn-hero.jpg" alt="Technicien ExpertCN préparant une intervention sur une infrastructure télécom" loading="lazy" />
              <div className="process-image-label"><Wrench weight="duotone" /><span>Centre de maintenance certifié</span></div>
            </div>
            <div className="process-content" data-reveal>
              <p className="eyebrow">Parcours RMA</p>
              <h2>Chaque intervention est suivie avec rigueur, de la demande au rapport final.</h2>
              <p className="process-lead">Un parcours lisible, des délais suivis et une information claire à chaque moment décisif.</p>
              <ol className="process-list">
                <li><span>01</span><div><strong>Décrivez votre besoin</strong><p>La demande RMA nous donne les premières informations utiles.</p></div></li>
                <li><span>02</span><div><strong>Recevez votre ticket</strong><p>Un numéro unique centralise le suivi de votre équipement.</p></div></li>
                <li><span>03</span><div><strong>Validez le diagnostic</strong><p>Nos techniciens vous informent avant toute intervention.</p></div></li>
                <li><span>04</span><div><strong>Recevez le rapport</strong><p>Votre matériel repart avec son expertise documentée.</p></div></li>
              </ol>
            </div>
          </div>
        </section>

        <section className="section training-section" id="formations">
          <div className="training-copy" data-reveal>
            <span className="inline-icon"><GraduationCap weight="duotone" /></span>
            <h2>Des formations pensées pour le terrain.</h2>
            <p>Fibre optique, réflectométrie, 5G, habilitations ou rénovation énergétique: chaque parcours s’adapte à votre niveau et à vos objectifs.</p>
            <div className="training-details">
              <div><strong>Sur mesure</strong><span>Contenus adaptés à votre expérience</span></div>
              <div><strong>Qualifiantes</strong><span>Compétences directement mobilisables</span></div>
            </div>
            <a className="button button-primary" href="#contact">Voir les formations <ArrowRight weight="bold" /></a>
          </div>
          <div className="training-image" data-reveal>
            <img src="/images/expertcn-formation.jpg" alt="Professionnels suivant une formation pratique à la fibre optique" loading="lazy" />
          </div>
        </section>

        <section className="section commitments-section" id="engagements">
          <div className="commitment-media" data-reveal>
            <img src="/images/expertcn-rse.jpg" alt="Technicien intervenant sur une infrastructure télécom à proximité de panneaux solaires" loading="lazy" />
            <div className="commitment-overlay">
              <p className="eyebrow">Notre démarche RSE</p>
              <h2>Développer les réseaux d’aujourd’hui sans perdre de vue demain.</h2>
              <p>Traçabilité, logistique, cycle de vie des produits et parcours inclusifs: nos décisions concrètes font partie intégrante de notre métier.</p>
              <a className="text-link" href="#contact">Découvrir nos engagements <ArrowRight weight="bold" /></a>
            </div>
            <div className="commitment-proof" aria-label="Repères RSE">
              <div><img src="/images/ecovadis-medallion.jpg" alt="Médaillon visuel pour le repère Platinum EcoVadis" /><strong>Platinum EcoVadis</strong><span>Parmi les 1 % les plus performantes</span></div>
              <div><img src="/images/iso26000-medallion.jpg" alt="Médaillon visuel pour la démarche ISO 26000" /><strong>ISO 26000</strong><span>Une démarche RSE structurée</span></div>
            </div>
          </div>
        </section>

        <section className="section testimonials-section">
          <div className="testimonials-heading" data-reveal>
            <div>
              <p className="eyebrow">Retours d’expérience</p>
              <h2>Ce sont nos clients qui en parlent le mieux.</h2>
            </div>
            <div className="slider-controls" aria-label="Navigation des témoignages">
              <button type="button" onClick={() => scrollTestimonials(-1)} aria-label="Témoignage précédent"><CaretLeft weight="bold" /></button>
              <button type="button" onClick={() => scrollTestimonials(1)} aria-label="Témoignage suivant"><CaretRight weight="bold" /></button>
            </div>
          </div>
          <div className="testimonials-track" ref={testimonialsRef}>
            {testimonials.map((testimonial) => (
              <article className="testimonial" key={testimonial.name} data-reveal>
                <Quotes weight="fill" />
                <blockquote>« {testimonial.quote} »</blockquote>
                <footer><strong>{testimonial.name}</strong><span>{testimonial.role}</span></footer>
              </article>
            ))}
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-copy" data-reveal>
            <p className="eyebrow">Parlons de votre projet</p>
            <h2>Un besoin précis ou une simple question?</h2>
            <p>Notre équipe vous oriente vers la solution, le service ou la formation qui vous correspond.</p>
            <div className="contact-links">
              <a href="tel:+33667676929"><Phone weight="duotone" /> 06 67 67 69 29</a>
              <a href="mailto:service.client@expertcn.fr"><EnvelopeSimple weight="duotone" /> service.client@expertcn.fr</a>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit} noValidate data-reveal>
            {formStatus === 'success' ? (
              <div className="form-success" role="status">
                <span><Check weight="bold" /></span>
                <h3>Votre demande est prête.</h3>
                <p>Cette démo valide le parcours. La prochaine étape sera de connecter le formulaire à votre solution d’envoi.</p>
                <button type="button" onClick={() => setFormStatus('idle')}>Envoyer une autre demande</button>
              </div>
            ) : (
              <>
                <div className="form-row">
                  <label>Nom<input name="name" type="text" required autoComplete="name" /></label>
                  <label>Prénom<input name="firstName" type="text" required autoComplete="given-name" /></label>
                </div>
                <label>Email<input name="email" type="email" required autoComplete="email" /></label>
                <label>Votre besoin
                  <select name="need" required defaultValue="">
                    <option value="" disabled>Choisissez un sujet</option>
                    <option>Équipements télécoms</option>
                    <option>Maintenance et RMA</option>
                    <option>Formation</option>
                    <option>Audit télécom</option>
                  </select>
                </label>
                <label>Message<textarea name="message" rows="3" required /></label>
                {formStatus === 'error' && <p className="form-error">Merci de compléter les champs obligatoires.</p>}
                <button className="button button-primary submit-button" type="submit" disabled={formStatus === 'loading'}>
                  {formStatus === 'loading' ? 'Préparation...' : 'Envoyer la demande'} <ArrowRight weight="bold" />
                </button>
              </>
            )}
          </form>
        </section>
      </main>

      <SiteFooter />
      <SiteNotice message={headerNotice} />
    </div>
  )
}

export default App
