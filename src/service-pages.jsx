import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/outfit'
import {
  ArrowRight,
  ArrowUpRight,
  CaretLeft,
  CaretRight,
  ChartLineUp,
  Check,
  CheckCircle,
  ClipboardText,
  CurrencyEur,
  Database,
  FileText,
  Gauge,
  GraduationCap,
  LockKey,
  Network,
  Package,
  Quotes,
  Target,
  Toolbox,
  TrendUp,
  Wrench,
} from '@phosphor-icons/react'
import { SiteFooter, SiteHeader, SiteNotice, useRequestList } from './shop-shared'
import './service-pages.css'

function ButtonLink({ href, children, secondary = false }) {
  return <a className={`service-button ${secondary ? 'is-secondary' : ''}`} href={href}>{children} <ArrowRight weight="bold" /></a>
}

function ServiceHero({ kicker, title, description, image, imageAlt, primary, secondary, active }) {
  return (
    <header className={`service-hero service-hero-${active}`}>
      <div className="service-hero-copy">
        <p className="service-kicker">{kicker}</p>
        <h1>{title}</h1>
        <p className="service-hero-description">{description}</p>
        <div className="service-hero-actions">
          <ButtonLink href={primary.href}>{primary.label}</ButtonLink>
          {secondary && <ButtonLink href={secondary.href} secondary>{secondary.label}</ButtonLink>}
        </div>
      </div>
      <div className="service-hero-media"><img src={image} alt={imageAlt} /></div>
    </header>
  )
}

function MetricsBand({ items }) {
  return (
    <section className="metrics-band" aria-label="Chiffres clés">
      {items.map((item) => (
        <div className="metric-item" key={item.label}>
          <strong>{item.value}</strong>
          <span>{item.label}</span>
          {item.note && <small>{item.note}</small>}
        </div>
      ))}
    </section>
  )
}

function SectionHeading({ kicker, title, text }) {
  return (
    <div className="service-heading">
      {kicker && <p className="service-kicker">{kicker}</p>}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  )
}

function TestimonialSlider({ title, testimonials }) {
  const [current, setCurrent] = useState(0)
  const visibleTestimonials = Array.from(
    { length: Math.min(3, testimonials.length) },
    (_, index) => testimonials[(current + index) % testimonials.length],
  )

  return (
    <section className="testimonial-section service-section" aria-labelledby={`testimonial-${title.replaceAll(' ', '-')}`}>
      <div className="testimonial-header">
        <SectionHeading kicker="Retours d’expérience" title={title} />
        <div className="slider-controls">
          <button type="button" onClick={() => setCurrent((current - 1 + testimonials.length) % testimonials.length)} aria-label="Témoignage précédent"><CaretLeft weight="bold" /></button>
          <span>{String(current + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}</span>
          <button type="button" onClick={() => setCurrent((current + 1) % testimonials.length)} aria-label="Témoignage suivant"><CaretRight weight="bold" /></button>
        </div>
      </div>
      <div className="testimonial-grid" key={current}>
        {visibleTestimonials.map((testimonial, index) => (
          <article className="testimonial-card" key={`${testimonial.name}-${index}`}>
            <Quotes weight="fill" aria-hidden="true" />
            <blockquote>« {testimonial.quote} »</blockquote>
            <footer><strong>{testimonial.name}</strong><span>{testimonial.role}</span></footer>
          </article>
        ))}
      </div>
    </section>
  )
}

function LeadForm({ title, intro, fields, submitLabel = 'Envoyer la demande', image, imageAlt = '', className = '' }) {
  const [status, setStatus] = useState('idle')

  const handleSubmit = (event) => {
    event.preventDefault()
    setStatus('sent')
  }

  return (
    <section className={`lead-panel ${className}`.trim()} id="demande">
      <div className="lead-panel-intro">
        {image && <img src={image} alt={imageAlt} />}
        <div>
          <p className="service-kicker">Échangeons sur votre besoin</p>
          <h2>{title}</h2>
          <p>{intro}</p>
        </div>
      </div>
      <form className="service-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          {fields.map((field) => (
            <label key={field.name} className={field.wide ? 'is-wide' : ''}>
              <span>{field.label}{field.required && ' *'}</span>
              {field.type === 'textarea' ? (
                <textarea name={field.name} rows="5" required={field.required} placeholder={field.placeholder} />
              ) : field.type === 'select' ? (
                <select name={field.name} required={field.required} defaultValue="">
                  <option value="" disabled>{field.placeholder || 'Sélectionnez une option'}</option>
                  {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              ) : (
                <input name={field.name} type={field.type || 'text'} required={field.required} placeholder={field.placeholder} />
              )}
            </label>
          ))}
        </div>
        <button className="service-button form-submit" type="submit">{submitLabel} <ArrowUpRight weight="bold" /></button>
        {status === 'sent' && <p className="form-success" role="status"><CheckCircle weight="fill" /> Votre demande a bien été enregistrée. Notre équipe vous recontactera rapidement.</p>}
      </form>
    </section>
  )
}

function Faq({ title = 'Questions fréquentes', items }) {
  return (
    <section className="faq-section service-section" id="faq">
      <SectionHeading kicker="FAQ" title={title} text="Les réponses essentielles avant de lancer votre projet avec ExpertCN." />
      <div className="faq-list">
        {items.map((item, index) => (
          <details key={item.question} open={index === 0}>
            <summary>{item.question}<span>+</span></summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

function PageShell({ active = '', pageClass = '', children }) {
  const [notice, setNotice] = useState('')
  const { requestItems } = useRequestList()

  const showNotice = (message) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2600)
  }

  return (
    <div className={`service-page ${pageClass}`.trim()}>
      <SiteHeader active={active} requestCount={requestItems.length} onRequest={showNotice} />
      <main>{children}</main>
      <SiteFooter />
      <SiteNotice message={notice} />
    </div>
  )
}

const savFaq = [
  { question: 'Quels équipements prenez-vous en charge ?', answer: 'Nous intervenons sur les soudeuses de raccordement optique, les cliveuses, les réflectomètres et plusieurs équipements de test et de mesure fibre.' },
  { question: 'Quel est le délai habituel de traitement ?', answer: 'Le délai dépend du diagnostic et de la disponibilité des pièces. Après réception, notre équipe vous communique rapidement une estimation et les prochaines étapes.' },
  { question: 'Comment suivre ma demande de maintenance ?', answer: 'Chaque demande reçoit un numéro de ticket SAV. Il permet à notre équipe de centraliser les échanges et de vous informer de l’avancement.' },
  { question: 'Comment soumettre une demande ?', answer: 'Remplissez le formulaire RMA en ligne avec les informations de votre équipement. Vous recevrez ensuite les instructions de prise en charge par e-mail.' },
  { question: 'Quel est le processus de diagnostic ?', answer: 'Nos techniciens effectuent une inspection visuelle, des tests fonctionnels et des mesures ciblées avant de formaliser leurs conclusions et recommandations.' },
  { question: 'Proposez-vous des contrats de maintenance ?', answer: 'Oui. Nous pouvons étudier un contrat adapté à votre parc, à vos volumes et au niveau de disponibilité attendu.' },
]

function SavPage() {
  const services = [
    { icon: Database, title: 'Mise à jour', text: 'Versions logicielles contrôlées pour maintenir la compatibilité et les performances.' },
    { icon: Gauge, title: 'Configuration', text: 'Paramétrage précis de vos équipements selon vos usages terrain.' },
    { icon: ClipboardText, title: 'Vérification et diagnostic', text: 'Identification documentée des anomalies avant toute intervention.' },
    { icon: Target, title: 'Calibration', text: 'Précision, alignement et fiabilité restaurés selon les points de contrôle utiles.' },
    { icon: Wrench, title: 'Réparation', text: 'Interventions ciblées par une équipe spécialisée dans la fibre optique.' },
  ]
  const rmaFields = [
    { name: 'nom', label: 'Nom', required: true }, { name: 'prenom', label: 'Prénom', required: true },
    { name: 'entreprise', label: 'Entreprise', required: true }, { name: 'email', label: 'E-mail', type: 'email', required: true },
    { name: 'telephone', label: 'Téléphone', type: 'tel', required: true },
    { name: 'equipement', label: 'Type d’équipement', type: 'select', required: true, options: ['Soudeuse fibre optique', 'Cliveuse', 'Réflectomètre', 'Photomètre', 'Autre équipement'] },
    { name: 'modele', label: 'Marque et modèle', required: true }, { name: 'serie', label: 'Numéro de série' },
    { name: 'achat', label: 'Date d’achat', type: 'date' }, { name: 'fichier', label: 'Photo ou document', type: 'file' },
    { name: 'probleme', label: 'Détail du problème', type: 'textarea', wide: true, placeholder: 'Décrivez les symptômes, le contexte et les éventuels messages affichés.' },
  ]

  return (
    <PageShell active="sav">
      <ServiceHero active="sav" kicker="Centre de maintenance télécom" title="Réparez. Reprenez le terrain." description="Révision, calibration et réparation de vos équipements fibre optique par une équipe spécialisée." image="/images/expertcn-maintenance.jpg" imageAlt="Technicien ExpertCN intervenant sur une soudeuse fibre optique" primary={{ href: '#demande', label: 'Soumettre une demande' }} secondary={{ href: '#prestations', label: 'Voir les prestations' }} />
      <MetricsBand items={[{ value: '10+', label: 'ans d’expérience', note: 'en maintenance fibre optique' }, { value: '98 %', label: 'de satisfaction client' }, { value: '100+', label: 'équipements réparés', note: 'chaque mois' }]} />

      <section className="service-section intro-split" id="prestations">
        <div>
          <SectionHeading kicker="Maintenance fibre optique" title="Une expertise qui sécurise votre continuité terrain." text="ExpertCN prend en charge vos soudeuses, cliveuses et équipements de réflectométrie avec un suivi clair, de la réception au rapport final." />
          <ButtonLink href="#demande">Demander une prise en charge</ButtonLink>
        </div>
        <div className="service-bento">
          {services.map(({ icon: Icon, title, text }, index) => <article className={index === 2 ? 'is-wide' : ''} key={title}><Icon weight="duotone" /><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="process-panel service-section">
        <div className="process-media"><img src="/images/expertcn-hero.jpg" alt="Technicien contrôlant une liaison fibre optique" /></div>
        <div className="process-copy">
          <SectionHeading kicker="Parcours RMA" title="Une prise en charge lisible, du ticket au retour." text="À chaque étape, vous savez où se trouve votre équipement et quelle décision doit être prise." />
          <ol className="process-steps">
            {['Décrivez votre besoin en ligne', 'Recevez votre numéro de ticket', 'Validez le diagnostic proposé', 'Recevez le rapport d’expertise'].map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><strong>{step}</strong></li>)}
          </ol>
        </div>
      </section>

      <section className="service-section calibration-split">
        <div className="calibration-copy">
          <SectionHeading kicker="Calibration" title="Retrouvez un alignement fiable et des mesures cohérentes." text="Après un choc, une dérive ou une utilisation intensive, nous contrôlons les points critiques de votre soudeuse pour restaurer son niveau de performance." />
          <ul className="check-list"><li><Check weight="bold" /> Calibration de précision</li><li><Check weight="bold" /> Contrôle fonctionnel</li><li><Check weight="bold" /> Nettoyage en profondeur</li><li><Check weight="bold" /> Mise à jour logicielle si nécessaire</li></ul>
        </div>
        <div className="calibration-media"><img src="/images/expertcn-hero.jpg" alt="Technicien calibrant une soudeuse fibre optique en atelier" /></div>
      </section>

      <TestimonialSlider title="Ils recommandent notre centre SAV." testimonials={[
        { quote: 'ExpertCN a rapidement réparé notre soudeuse T72C+ et l’a remise en service en un rien de temps.', name: 'Joseph', role: 'Responsable technique, IMD Optique' },
        { quote: 'Une équipe très compétente et réactive. Nos appareils ont été réparés en moins de 72 heures.', name: 'Viorel', role: 'Technicien, Fusion COM' },
        { quote: 'Réactifs et de bon conseil, ils sont devenus un véritable partenaire de confiance.', name: 'Sofian', role: 'Gérant, ASN' },
        { quote: 'Le diagnostic était précis, le devis clair et le rapport final directement exploitable par nos équipes.', name: 'Mélanie', role: 'Responsable exploitation, OptiRéseaux' },
        { quote: 'Nous avons retrouvé une soudeuse parfaitement calibrée avec un suivi sérieux à chaque étape.', name: 'Karim', role: 'Chef d’équipe fibre, Connectis' },
        { quote: 'Un interlocuteur technique disponible et des délais tenus, même sur une panne difficile à identifier.', name: 'Laurent', role: 'Gérant, Fibre Services' },
      ]} />
      <LeadForm title="Formulaire de demande RMA" intro="Renseignez votre équipement et les symptômes constatés. Notre équipe vous transmettra les prochaines étapes." fields={rmaFields} submitLabel="Envoyer la demande RMA" image="/images/expertcn-maintenance.jpg" imageAlt="Intervention de maintenance sur une soudeuse fibre optique" />
      <Faq items={savFaq} />
    </PageShell>
  )
}

const auditFaq = [
  { question: 'Quelle est votre approche de l’audit télécom ?', answer: 'Nous évaluons l’infrastructure, les coûts, la sécurité, la gestion des actifs et la qualité de service. Le périmètre est adapté à vos priorités et à votre niveau de maturité.' },
  { question: 'Comment pouvez-vous réduire nos coûts télécoms ?', answer: 'Nous identifions les services inutilisés, les incohérences contractuelles, les surcapacités et les pistes de renégociation afin de construire un plan d’économies réaliste.' },
  { question: 'Comment sécurisez-vous nos systèmes ?', answer: 'L’audit met en évidence les vulnérabilités techniques et organisationnelles, puis hiérarchise les mesures correctives selon leur criticité et leur effort de mise en œuvre.' },
  { question: 'Comment mesurez-vous la qualité de service ?', answer: 'Nous analysons notamment la disponibilité, la latence, la bande passante, la résilience et l’expérience des utilisateurs sur les services critiques.' },
  { question: 'Comment démarrer un audit ?', answer: 'Un premier échange permet de préciser vos enjeux, votre périmètre et les livrables attendus. Nous proposons ensuite une méthode, un calendrier et les interlocuteurs nécessaires.' },
]

function AuditPage() {
  const services = [
    { image: '/images/expertcn-hero.jpg', title: 'Infrastructure télécom', text: 'Réseaux, serveurs et équipements analysés pour identifier les fragilités et les ressources à optimiser.' },
    { image: '/images/expertcn-rse.jpg', title: 'Analyse des coûts', text: 'Dépenses, contrats et usages rapprochés pour faire émerger des économies mesurables.' },
    { image: '/images/shop/products/analyseur-pon-fx120-veex.png', title: 'Sécurité télécom', text: 'Vulnérabilités, risques et mesures de protection hiérarchisés selon leur impact.' },
    { image: '/images/shop/products/tiroirs-optiques-actifs.png', title: 'Gestion des actifs', text: 'Inventaire, cycle de vie et besoins de mise à niveau consolidés dans une vision exploitable.' },
    { image: '/images/shop/products/reflectometre-otdr-veex-fx150.png', title: 'Qualité de service', text: 'Disponibilité, latence, bande passante et résilience évaluées sur vos usages critiques.' },
  ]
  const auditFields = [
    { name: 'nom', label: 'Nom', required: true }, { name: 'prenom', label: 'Prénom', required: true },
    { name: 'email', label: 'E-mail professionnel', type: 'email', required: true }, { name: 'telephone', label: 'Téléphone', type: 'tel' },
    { name: 'message', label: 'Votre projet', type: 'textarea', wide: true, required: true, placeholder: 'Périmètre, enjeux, nombre de sites et calendrier envisagé.' },
  ]

  return (
    <PageShell active="audit" pageClass="service-page-audit">
      <ServiceHero active="audit" kicker="Audits télécoms" title="Optimisez vos infrastructures." description="Réduisez les coûts, sécurisez vos actifs et améliorez la qualité de service grâce à un audit orienté décisions." image="/images/expertcn-rse.jpg" imageAlt="Technicien analysant une infrastructure télécom sur site" primary={{ href: '#demande', label: 'Parler de votre projet' }} secondary={{ href: '#services-audit', label: 'Explorer nos audits' }} />
      <MetricsBand items={[{ value: '15 ans', label: 'd’expérience télécom' }, { value: '30 %', label: 'de réduction des coûts', note: 'en moyenne pour nos clients' }, { value: '98 %', label: 'de satisfaction client' }]} />

      <section className="service-section image-story audit-story">
        <div className="image-story-media"><img src="/images/expertcn-hero.jpg" alt="Expert télécom vérifiant une installation fibre" /></div>
        <div className="image-story-copy"><SectionHeading kicker="Notre mission" title="Voir précisément où agir, dans quel ordre et avec quel impact." text="Notre équipe vous accompagne à chaque étape pour maximiser la valeur de vos investissements télécoms tout en réduisant les risques. Chaque recommandation est contextualisée, priorisée et exploitable." /><div className="story-note"><ChartLineUp weight="duotone" /><p><strong>Un audit utile ne s’arrête pas au constat.</strong> Il relie les données techniques, les usages, les contrats et les objectifs métiers.</p></div></div>
      </section>

      <section className="service-section audit-scope" id="services-audit">
        <SectionHeading kicker="Périmètres d’intervention" title="Cinq lectures complémentaires de votre environnement." text="Un audit global ou ciblé, construit selon vos contraintes, votre organisation et les décisions à prendre." />
        <div className="audit-services">
          {services.map(({ image, title, text }, index) => (
            <article className={index === 0 ? 'is-featured' : ''} key={title}>
              <div className="audit-service-media"><img src={image} alt="" /></div>
              <div className="audit-service-copy"><h3>{title}</h3><p>{text}</p></div>
            </article>
          ))}
        </div>
      </section>

      <LeadForm className="audit-lead" title="Parlons de votre projet d’audit." intro="Décrivez votre contexte et les décisions que vous souhaitez sécuriser. Nous vous proposerons un premier cadrage adapté." fields={auditFields} submitLabel="Être recontacté" image="/images/expertcn-rse.jpg" imageAlt="Intervention sur une infrastructure télécom et énergétique" />

      <section className="service-section audit-method">
        <div className="audit-method-intro">
          <img src="/images/expertcn-maintenance.jpg" alt="Expert réalisant un diagnostic sur un équipement télécom" />
          <div><p className="service-kicker">Pourquoi ExpertCN</p><h2>Une méthode qui transforme le diagnostic en décisions.</h2></div>
        </div>
        <div className="audit-method-grid">{[
          [Target, 'Expertise de pointe', 'Une lecture technique nourrie par les réalités du terrain.'],
          [ClipboardText, 'Approche personnalisée', 'Un périmètre et des livrables adaptés à votre organisation.'],
          [ChartLineUp, 'Résultats mesurables', 'Des recommandations reliées à des gains et risques identifiés.'],
          [LockKey, 'Confidentialité', 'Une gestion rigoureuse de vos informations et de leur sécurité.'],
        ].map(([Icon, title, text]) => <article key={title}><Icon weight="duotone" /><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
      </section>
      <Faq items={auditFaq} />
    </PageShell>
  )
}

function AboutPage() {
  const contactFields = [
    { name: 'nom', label: 'Nom', required: true }, { name: 'prenom', label: 'Prénom', required: true },
    { name: 'email', label: 'E-mail', type: 'email', required: true }, { name: 'telephone', label: 'Téléphone', type: 'tel' },
    { name: 'message', label: 'Votre message', type: 'textarea', wide: true, required: true, placeholder: 'Expliquez-nous ce que vous souhaitez construire avec ExpertCN.' },
  ]

  return (
    <PageShell>
      <ServiceHero active="about" kicker="Notre mission" title="Faire grandir vos projets." description="ExpertCN accompagne les professionnels des télécoms et de l’énergie avec une expertise concrète, durable et profondément humaine." image="/images/expertcn-rse.jpg" imageAlt="Technicien ExpertCN sur une infrastructure responsable" primary={{ href: '#demande', label: 'Nous contacter' }} secondary={{ href: '#mission', label: 'Découvrir notre histoire' }} />

      <section className="service-section mission-layout" id="mission">
        <div className="mission-statement"><p>Notre conviction</p><h2>La croissance est plus solide lorsqu’elle est partagée.</h2></div>
        <div className="mission-body"><h3>La mission d’ExpertCN</h3><p>Nous nous positionnons comme le partenaire fiable qui accompagne les entreprises vers l’excellence. Notre mission est d’aider chaque organisation à se développer grâce à des équipements rigoureusement sélectionnés, une maintenance experte, des audits utiles et des formations sur mesure.</p><p>Nous avançons avec nos clients dans une logique simple : comprendre leur réalité, mobiliser les bonnes compétences et construire des solutions qui durent.</p></div>
      </section>

      <section className="service-section history-panel">
        <div className="history-media"><img src="/images/expertcn-formation.jpg" alt="Équipe de professionnels réunie autour d’un équipement fibre optique" /></div>
        <div className="history-copy"><SectionHeading kicker="Notre histoire" title="Une expertise terrain devenue projet d’entreprise." /><p>ExpertCN a été créé par une équipe d’entrepreneurs passionnés souhaitant mettre leurs compétences au service des professionnels des télécoms et de l’énergie.</p><p>D’abord concentrée sur les infrastructures télécoms, l’entreprise a progressivement construit une approche à 360 degrés : équiper, maintenir, former et conseiller. Cette complémentarité nous permet d’accompagner les transformations techniques sans perdre de vue les enjeux humains et économiques.</p><div className="history-principles"><span>Expertise</span><span>Transmission</span><span>Impact</span></div></div>
      </section>

      <section className="rse-feature" id="rse">
        <img src="/images/expertcn-rse.jpg" alt="Installation télécom intégrée à un environnement énergétique durable" />
        <div className="rse-feature-overlay">
          <p className="service-kicker">Notre engagement RSE</p>
          <h2>Innover implique aussi d’agir de manière responsable.</h2>
          <p>Conception, traçabilité, logistique et cycle de vie des produits : nous intégrons des pratiques durables à chaque étape. Nous collaborons aussi avec des centres de formation et des partenaires locaux pour créer des parcours utiles, inclusifs et pérennes.</p>
          <ul className="check-list is-light"><li><Check weight="bold" /> Équité dans nos relations</li><li><Check weight="bold" /> Transparence dans nos choix</li><li><Check weight="bold" /> Impact positif mesurable</li></ul>
        </div>
      </section>

      <section className="service-section certification-section">
        <SectionHeading kicker="Reconnaissances" title="Des engagements évalués par des référentiels exigeants." text="Notre démarche progresse grâce à des indicateurs concrets, des évaluations externes et une volonté d’amélioration continue." />
        <div className="certification-grid">
          <article><img src="/images/ecovadis-medallion.jpg" alt="Médaille Platinum EcoVadis ExpertCN" /><div><span>Top 1 % des entreprises évaluées</span><h3>Médaille Platinum EcoVadis</h3><p>Cette distinction reconnaît la performance d’ExpertCN en matière de responsabilité sociétale et nourrit notre démarche d’amélioration continue.</p></div></article>
          <article><img src="/images/iso26000-medallion.jpg" alt="Engagement ExpertCN selon les principes ISO 26000" /><div><span>Cadre de responsabilité sociétale</span><h3>Démarche inspirée de l’ISO 26000</h3><p>Un cadre structurant pour intégrer les enjeux environnementaux, sociaux et éthiques dans nos décisions.</p></div></article>
        </div>
      </section>
      <LeadForm title="En savoir plus sur ExpertCN ?" intro="Échangeons sur votre projet, votre besoin de partenariat ou vos enjeux de développement." fields={contactFields} submitLabel="Envoyer votre message" image="/images/expertcn-hero.jpg" imageAlt="Technicien ExpertCN au travail" />
    </PageShell>
  )
}

const materialCategories = [
  { title: 'Soudeuses fibre optique', description: 'Des équipements terrain sélectionnés pour des raccordements précis.', image: '/images/expertcn-maintenance.jpg' },
  { title: 'Raccordement optique', description: 'Tiroirs, jarretières et accessoires pour organiser des liaisons fiables.', image: '/images/shop/products/tiroirs-optiques-actifs.png' },
  { title: 'Tests et mesures', description: 'OTDR, photomètres et analyseurs pour qualifier chaque intervention.', image: '/images/shop/analyseur-pon.png' },
  { title: 'Tirage et sécurité', description: 'Aiguilles, recharges et solutions adaptées aux contraintes de chantier.', image: '/images/shop/aiguille.png' },
  { title: 'Câbles optiques', description: 'Des configurations monomode et multimode pour vos infrastructures.', image: '/images/shop/products/breakout-multimode.png' },
  { title: 'Identification réseau', description: 'Étiqueteuses et consommables pour une documentation durable.', image: '/images/shop/products/etiqueteuse-m510-brady.png' },
]

const bestSellers = [
  { name: 'Analyseur PON FX120 VeEX', brand: 'Tests et mesures', description: 'Une plateforme compacte pour tester, diagnostiquer et documenter les réseaux PON.', image: '/images/shop/products/analyseur-pon-fx120-veex.png', slug: 'analyseur-pon-fx120-veex' },
  { name: 'Smooves 60 mm', brand: 'Consommables', description: 'Protection fiable des épissures optiques après raccordement.', image: '/images/shop/products/smooves-60mm.png', slug: 'smooves-60mm' },
  { name: 'Aiguille de tirage 150 m', brand: 'Tirage et sécurité', description: 'Un format chantier pour les passages longs et exigeants.', image: '/images/shop/products/aiguille-de-tirage-150m-9mm.png', slug: 'aiguille-de-tirage-150m-9mm' },
  { name: 'Breakout Multimode', brand: 'Raccordement optique', description: 'Une solution prête à intégrer pour vos liaisons multimodes.', image: '/images/shop/products/breakout-multimode.png', slug: 'breakout-multimode' },
]

function MaterialPage() {
  return (
    <PageShell active="boutique">
      <ServiceHero active="material" kicker="Matériel télécom et fibre optique" title="Le bon équipement, bien choisi." description="Une sélection professionnelle pour raccorder, mesurer, identifier et sécuriser vos infrastructures fibre optique." image="/images/shop/shop-hero.jpg" imageAlt="Équipements professionnels pour la fibre optique" primary={{ href: '/boutique.html', label: 'Visiter la boutique' }} secondary={{ href: '#gammes', label: 'Explorer les gammes' }} />
      <MetricsBand items={[{ value: '1 000+', label: 'références professionnelles' }, { value: '98 %', label: 'de stock disponible' }, { value: '24 h', label: 'pour les expéditions éligibles' }]} />

      <section className="service-section" id="gammes">
        <SectionHeading kicker="Nos gammes" title="Six univers pour équiper vos chantiers de bout en bout." text="Accédez rapidement aux familles de produits les plus utilisées par les équipes télécoms." />
        <div className="range-catalog">
          <a className="range-feature" href="/boutique.html">
            <div className="range-feature-media"><img src={materialCategories[0].image} alt={materialCategories[0].title} /></div>
            <div className="range-feature-copy"><h3>{materialCategories[0].title}</h3><p>{materialCategories[0].description}</p><span>Voir les références <ArrowUpRight weight="bold" /></span></div>
          </a>
          <div className="range-list">
            {materialCategories.slice(1).map((category) => <a className="range-row" href="/boutique.html" key={category.title}><div className="range-row-media"><img src={category.image} alt={category.title} /></div><div className="range-row-copy"><h3>{category.title}</h3><p>{category.description}</p></div><ArrowUpRight className="range-row-arrow" weight="bold" /></a>)}
          </div>
        </div>
      </section>

      <section className="partner-band" aria-label="Partenaires officiels">
        <p>Partenaires et marques de référence</p>
        <div className="partner-marquee" aria-label="Logos de nos partenaires">
          <div className="partner-track">
            {[0, 1].map((group) => <div className="partner-logo-group" aria-hidden={group === 1} key={group}>{Array.from({ length: 6 }).map((_, index) => <img src="/images/partner-logoipsum.png" alt={group === 0 && index === 0 ? 'Logo partenaire' : ''} key={`${group}-${index}`} />)}</div>)}
          </div>
        </div>
      </section>

      <section className="service-section best-sellers">
        <SectionHeading kicker="Sélection terrain" title="Les références les plus demandées." text="Des produits connus des techniciens, accompagnés par une équipe capable de valider leur compatibilité avec votre besoin." />
        <div className="product-editorial">
          <article className="product-featured">
            <a className="product-featured-media" href={`/produit.html?produit=${bestSellers[0].slug}`}><img src={bestSellers[0].image} alt={bestSellers[0].name} /></a>
            <div className="product-featured-copy"><span>{bestSellers[0].brand}</span><h3>{bestSellers[0].name}</h3><p>{bestSellers[0].description}</p><a href={`/produit.html?produit=${bestSellers[0].slug}`}>Découvrir le produit <ArrowUpRight weight="bold" /></a></div>
          </article>
          <div className="product-editorial-list">
            {bestSellers.slice(1).map((product) => <article key={product.name}><a className="product-editorial-media" href={`/produit.html?produit=${product.slug}`}><img src={product.image} alt={product.name} /></a><div><span>{product.brand}</span><h3>{product.name}</h3><p>{product.description}</p><a href={`/produit.html?produit=${product.slug}`} aria-label={`Voir ${product.name}`}><ArrowUpRight weight="bold" /></a></div></article>)}
          </div>
        </div>
      </section>

      <section className="shop-cta">
        <div className="shop-cta-media"><img src="/images/shop/shop-hero.jpg" alt="Sélection d’outils et d’équipements fibre optique" /></div>
        <div className="shop-cta-copy"><p className="service-kicker">Votre sélection en 30 secondes</p><h2>Décrivez votre chantier. Nous vérifions les références.</h2><p>Compatibilité, stock, délai et alternatives : notre équipe technique vous aide à composer une sélection cohérente.</p><ButtonLink href="/boutique.html">Accéder à la boutique</ButtonLink></div>
      </section>

      <section className="assurance-row service-section" aria-label="Services associés"><div><CurrencyEur weight="duotone" /><strong>Garantie du meilleur prix</strong><span>Une offre alignée sur votre besoin réel.</span></div><div><Package weight="duotone" /><strong>Retour facilité</strong><span>Une équipe disponible pour vous orienter.</span></div><div><Toolbox weight="duotone" /><strong>Support technique 6 j/7</strong><span>Des réponses par des spécialistes télécoms.</span></div></section>
    </PageShell>
  )
}

const formationFaq = [
  { question: 'Comment puis-je m’inscrire à une formation ?', answer: 'Vous pouvez utiliser le formulaire de cette page ou contacter notre service client au 06 67 67 69 29. Nous vous communiquerons les dates, le lieu et les prérequis.' },
  { question: 'Quelles méthodes de paiement acceptez-vous ?', answer: 'Les modalités dépendent du parcours et du financement mobilisé. Notre équipe vous présente les options disponibles avant toute inscription.' },
  { question: 'Vos formations sont-elles certifiantes ?', answer: 'Certaines formations préparent à une certification ou à une habilitation. Le niveau de reconnaissance et les modalités d’évaluation sont précisés pour chaque parcours.' },
  { question: 'Proposez-vous des formations sur mesure ?', answer: 'Oui. Nous construisons des programmes adaptés au niveau des équipes, au matériel utilisé et aux objectifs opérationnels de l’entreprise.' },
  { question: 'Vos formations sont-elles hybrides ?', answer: 'Selon le parcours, une partie théorique peut être suivie en ligne et complétée par des mises en situation pratiques en centre ou sur site.' },
  { question: 'Y a-t-il des prérequis ?', answer: 'Ils varient selon la formation. Un échange préalable permet de vérifier votre niveau et de vous orienter vers le parcours le plus adapté.' },
]

function FormationsPage() {
  const fields = [
    { name: 'nom', label: 'Nom', required: true }, { name: 'prenom', label: 'Prénom', required: true },
    { name: 'email', label: 'E-mail', type: 'email', required: true }, { name: 'telephone', label: 'Téléphone', type: 'tel', required: true },
    { name: 'formation', label: 'Formation souhaitée', type: 'select', wide: true, required: true, options: ['Fibre optique', 'Réflectométrie', 'Habilitations électriques', '5G et réseaux mobiles', 'Formation sur mesure'] },
  ]
  const courses = [
    { title: 'Fibre optique terrain', text: 'Préparation, raccordement, contrôle et bonnes pratiques pour intervenir avec méthode.', image: '/images/expertcn-formation.jpg', imageAlt: 'Apprenants pratiquant le raccordement fibre optique' },
    { title: 'Réflectométrie', text: 'Comprendre les mesures OTDR, interpréter les événements et documenter une liaison.', image: '/images/shop/products/reflectometre-otdr-veex-fx150.png', imageAlt: 'Réflectomètre OTDR utilisé pendant la formation' },
    { title: 'Habilitations électriques', text: 'Sécuriser les interventions et acquérir les réflexes adaptés à votre environnement.', image: '/images/expertcn-rse.jpg', imageAlt: 'Technicien intervenant sur une infrastructure professionnelle' },
    { title: '5G et réseaux mobiles', text: 'Développer une vision opérationnelle des architectures, équipements et usages.', image: '/images/shop/products/analyseur-pon-fx120-veex.png', imageAlt: 'Analyseur de réseau professionnel' },
  ]

  return (
    <PageShell active="formations">
      <ServiceHero active="formations" kicker="Formations télécom et énergie" title="Maîtrisez les gestes du terrain." description="Des formations concrètes, encadrées par des experts, pour renforcer vos compétences et accélérer votre évolution professionnelle." image="/images/expertcn-formation.jpg" imageAlt="Formateur accompagnant des apprenants sur une soudeuse fibre optique" primary={{ href: '#formations-list', label: 'Découvrir les formations' }} secondary={{ href: '#demande', label: 'Être conseillé' }} />
      <MetricsBand items={[{ value: '50+', label: 'entreprises partenaires' }, { value: '1 000+', label: 'clients formés avec succès' }, { value: '+20 %', label: 'd’évolution salariale', note: 'constatée après formation' }]} />

      <section className="service-section training-value">
        <div><SectionHeading kicker="Pourquoi ExpertCN" title="La technique s’apprend mieux quand elle se pratique." text="Nos parcours associent explications claires, équipements professionnels et mises en situation proches des conditions réelles d’intervention." /><ul className="value-list"><li><GraduationCap weight="duotone" /><div><strong>Formateurs experts</strong><span>Une expérience concrète des télécoms et de l’énergie.</span></div></li><li><Toolbox weight="duotone" /><div><strong>Matériel professionnel</strong><span>Des manipulations guidées sur les équipements du terrain.</span></div></li><li><TrendUp weight="duotone" /><div><strong>Accompagnement carrière</strong><span>Des conseils adaptés à votre projet et à votre expérience.</span></div></li></ul></div>
        <div className="training-value-media"><img src="/images/expertcn-formation.jpg" alt="Session pratique de formation fibre optique" /><span>Une pédagogie orientée autonomie</span></div>
      </section>

      <section className="service-section" id="formations-list">
        <SectionHeading kicker="Tous nos parcours" title="Des compétences recherchées, directement mobilisables." text="Choisissez un parcours métier ou construisons ensemble une formation adaptée à vos équipes." />
        <div className="course-grid">{courses.map((course, index) => <article key={course.title}><div className="course-media"><img src={course.image} alt={course.imageAlt} loading="lazy" /><span>{String(index + 1).padStart(2, '0')}</span></div><div className="course-copy"><h3>{course.title}</h3><p>{course.text}</p><a href="#demande">Demander le programme <ArrowUpRight weight="bold" /></a></div></article>)}</div>
      </section>

      <LeadForm className="training-lead" title="Quelle formation correspond à votre projet ?" intro="Indiquez-nous votre objectif. Nous vous aiderons à identifier le bon parcours, le format et les possibilités de financement." fields={fields} submitLabel="Recevoir des informations" image="/images/expertcn-formation.jpg" imageAlt="Apprenants en formation fibre optique" />

      <TestimonialSlider title="Ce sont nos apprenants qui en parlent le mieux." testimonials={[
        { quote: 'Une formation fibre optique complète et motivante. En cinq jours, j’ai compris le métier et gagné en autonomie sur le terrain.', name: 'Amine', role: 'Formation fibre optique' },
        { quote: 'La formation en réflectométrie était claire, accessible et proposée à proximité de chez moi.', name: 'François', role: 'Formation réflectométrie' },
        { quote: 'J’ai pu suivre mes habilitations électriques en ligne avec une équipe réactive et disponible pour chaque question.', name: 'Isaac', role: 'Habilitations électriques' },
        { quote: 'Les exercices reproduisent vraiment les contraintes du terrain. J’ai pu appliquer les méthodes dès la semaine suivante.', name: 'Sonia', role: 'Technicienne raccordement' },
        { quote: 'Le formateur a adapté le rythme à notre équipe et pris le temps de reprendre chaque mesure avec nous.', name: 'Yacine', role: 'Formation sur mesure' },
        { quote: 'Un parcours structuré, du matériel professionnel et des réponses concrètes à nos situations de chantier.', name: 'Claire', role: 'Responsable formation' },
      ]} />

      <section className="training-quality" id="qualite">
        <img src="/images/qualiopi-logo.png" alt="Logo Qualiopi, processus certifié par la République française" />
        <div><p className="service-kicker">Certification Qualiopi</p><h2>Une organisation pensée pour la qualité des parcours.</h2><p>Information, accompagnement, suivi et amélioration continue structurent chaque étape de l’expérience de formation.</p></div>
      </section>

      <section className="service-section funding-section" id="financement">
        <SectionHeading kicker="Financement" title="Plusieurs dispositifs peuvent soutenir votre projet." />
        <div className="funding-list"><div><FileText weight="duotone" /><strong>Compte Personnel de Formation</strong></div><div><Network weight="duotone" /><strong>Opérateurs de Compétences</strong></div><div><Target weight="duotone" /><strong>France Travail</strong></div><div><CurrencyEur weight="duotone" /><strong>Financement personnel</strong></div></div>
      </section>
      <Faq items={formationFaq} />

      <section className="career-panel career-panel-bottom">
        <div className="career-media"><img src="/images/expertcn-hero.jpg" alt="Technicien fibre optique en situation professionnelle" /></div>
        <div className="career-copy"><SectionHeading kicker="Votre prochain chapitre" title="Propulsez votre carrière vers des métiers porteurs." text="Accompagnement personnalisé, contenus en ligne et aide à l’insertion : nous vous donnons les moyens de transformer les acquis en compétences visibles sur le terrain." /><ButtonLink href="#demande">Construire mon parcours</ButtonLink></div>
      </section>
    </PageShell>
  )
}

const path = window.location.pathname.endsWith('/') ? window.location.pathname : `${window.location.pathname}/`
const pageComponents = {
  '/sav/': SavPage,
  '/audit-telecoms/': AuditPage,
  '/a-propos-de-notre-mission/': AboutPage,
  '/materiel-telecom-fibre-optique/': MaterialPage,
  '/formations/': FormationsPage,
}
const CurrentPage = pageComponents[path] || AboutPage

createRoot(document.getElementById('root')).render(
  <React.StrictMode><CurrentPage /></React.StrictMode>,
)
