import React, { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Buildings,
  CaretLeft,
  CaretRight,
  Check,
  EnvelopeSimple,
  GraduationCap,
  Handshake,
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
    text: 'Sélection de matériels actifs et passifs, intégrant des solutions écoresponsables et durables.',
    className: 'service-equipment',
    href: '/boutique/',
  },
  {
    icon: Wrench,
    index: '02',
    title: 'Centre de maintenance',
    text: 'Diagnostic, calibration et réparation de vos soudeuses, cliveuses et réflectomètres dans des délais maîtrisés.',
    className: 'service-maintenance',
    href: '/sav/',
  },
  {
    icon: GraduationCap,
    index: '03',
    title: 'Formations qualifiantes',
    text: 'Formations techniques spécifiques en Télécom et parcours de montée en compétences sur les métiers de demain (IoT, Énergie, Télécom).',
    className: 'service-training',
    href: '/formations/',
  },
  {
    icon: Handshake,
    index: '04',
    title: 'Accompagnement sur mesure',
    text: 'Un interlocuteur expert pour cadrer vos besoins, coordonner les bonnes solutions et faire avancer chaque projet sereinement.',
    className: 'service-audit',
    href: '/contact/?sujet=Autre+demande#contact-form',
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
  const { requestItems, removeRequestItem, clearRequestItems } = useRequestList()

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
      <SiteHeader active="home" requestItems={requestItems} onRemoveCartItem={removeRequestItem} onClearCart={clearRequestItems} />

      <main>
        <section className="hero" id="accueil">
          <div className="hero-media">
            <img src="/images/site/accueil-hero-technicien-fibre.jpg" alt="Technicien ExpertCN raccordant un équipement fibre optique" fetchPriority="high" />
          </div>
          <div className="hero-overlay" />
          <div className="hero-inner">
            <div className="hero-copy">
              <p className="eyebrow hero-kicker">Votre partenaire de confiance pour les professionnels.</p>
              <h1>Concepteur et distributeur de solutions éco-responsables pour les infrastructures Télécom &amp; Énergie</h1>
              <p className="hero-description">Fourniture d’équipements, maintenance d’infrastructures et formation : l’expertise d’un partenaire technique unique.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="/contact/#contact-form">Nous contacter <ArrowRight weight="bold" /></a>
                <a className="button button-ghost" href="/boutique/">Découvrir le catalogue</a>
              </div>
            </div>
          </div>
        </section>

        <section className="proof-strip" aria-label="Chiffres clés">
          <div className="proof-intro">
            <img src="/images/site/accueil-bloc-confiance-miniature.jpg" alt="Illustration de la relation client ExpertCN" />
            <span>La performance de vos réseaux, notre priorité.</span>
          </div>
          <div className="proof-number"><strong>+500</strong><span>clients accompagnés</span></div>
          <div className="proof-number"><strong>10 ans</strong><span>d’ingénierie et de conseil</span></div>
          <div className="proof-number"><strong>4,5/5</strong><span>satisfaction client</span></div>
        </section>

        <section className="section expertise-section" id="expertises">
          <div className="expertise-heading" data-reveal>
            <div>
              <p className="eyebrow">Partenaire technique BtoB</p>
              <h2>Un partenaire technique unique pour l&apos;ensemble de vos projets télécoms.</h2>
            </div>
            <p>Du matériel à la transmission des compétences, nous intervenons avec une lecture complète de votre activité et de vos priorités.</p>
          </div>
          <div className="expertise-layout">
            <div className="expertise-visual" data-reveal>
              <img src="/images/site/accueil-vision-360-soudeuse-gros-plan.jpg" alt="Gros plan sur une soudeuse fibre optique en cours d’utilisation" loading="lazy" />
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
                  <a href={service.href}>Découvrir <ArrowUpRight weight="bold" /></a>
                </div>
              </article>
            ))}
            <div className="expertise-secondary-image" data-reveal>
              <img src="/images/site/accueil-vision-360-formation-groupe.jpg" alt="Groupe de techniciens en formation fibre optique" loading="lazy" />
            </div>
            </div>
          </div>
        </section>

        <section className="section maintenance-section" id="maintenance">
          <div className="maintenance-image" data-reveal>
            <img src="/images/site/accueil-maintenance-soudeuse-reparation.jpg" alt="Soudeuse fibre optique en cours de réparation au centre de maintenance ExpertCN" loading="lazy" />
            <div className="image-stat">
              <strong>+100</strong>
              <span>équipements réparés et étalonnés par mois</span>
            </div>
          </div>
          <div className="maintenance-copy" data-reveal>
            <span className="inline-icon"><Wrench weight="duotone" /></span>
            <h2>Un centre de maintenance télécom adapté à chaque besoin.</h2>
            <p>Nos techniciens prennent en charge vos soudeuses, cliveuses et équipements de réflectométrie avec un suivi clair à chaque étape.</p>
            <div className="maintenance-services" aria-label="Prestations de maintenance">
              <span><Check weight="bold" /> Diagnostic</span>
              <span><Check weight="bold" /> Calibration</span>
              <span><Check weight="bold" /> Réparation</span>
              <span><Check weight="bold" /> Mise à jour</span>
            </div>
            <a className="text-link" href="/sav/#demande">Soumettre une demande RMA <ArrowRight weight="bold" /></a>
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
            <a className="button button-primary" href="/formations/">Voir les formations <ArrowRight weight="bold" /></a>
          </div>
          <div className="training-image" data-reveal>
            <img src="/images/site/accueil-formations-apprenants.jpg" alt="Apprenants en formation télécom ExpertCN" loading="lazy" />
          </div>
        </section>

        <section className="section commitments-section" id="engagements">
          <div className="commitment-media" data-reveal>
            <img src="/images/site/accueil-rse-technicien-solaire.jpg" alt="Technicien ExpertCN intervenant sur une infrastructure avec panneaux solaires" loading="lazy" />
            <div className="commitment-overlay">
              <p className="eyebrow">Notre démarche RSE</p>
              <h2>Développer les réseaux d'aujourd'hui grâce à une démarche responsable.</h2>
              <p>Sélection de composants durables, réemploi des équipements et maintenance préventive : des engagements concrets et mesurables.</p>
              <a className="text-link" href="/a-propos-de-notre-mission/#rse">Découvrir nos engagements <ArrowRight weight="bold" /></a>
            </div>
            <div className="commitment-proof" aria-label="Repères RSE">
              <div><img src="/images/ecovadis-expertcn.png" alt="Médaille Platinum EcoVadis obtenue par ExpertCN" /><strong>Platinum EcoVadis</strong><span>Parmi les 1 % les plus performantes</span></div>
              <div><img src="/images/expertcn-trust-photo.png" alt="Équipe réunie autour d’un projet environnemental" /><strong>ISO 26000</strong><span>Une démarche RSE structurée</span></div>
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
              <a href="tel:+33189624501"><Phone weight="duotone" /> +33 1 89 62 45 01</a>
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
