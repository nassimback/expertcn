import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/outfit'
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Certificate,
  Check,
  CheckCircle,
  Clock,
  CurrencyEur,
  DownloadSimple,
  EnvelopeSimple,
  Exam,
  FileText,
  GraduationCap,
  HandHeart,
  Monitor,
  Phone,
  Users,
} from '@phosphor-icons/react'
import { formationBySlug } from './formation-data'
import { SiteFooter, SiteHeader, useRequestList } from './shop-shared'
import './formation.css'

const contactPhone = '+33 1 89 62 45 01'
const contactEmail = 'formation@expertcn.fr'

function FormationButton({ href, children, secondary = false }) {
  return <a className={`formation-button ${secondary ? 'is-secondary' : ''}`} href={href}>{children} <ArrowRight weight="bold" /></a>
}

function SectionTitle({ title, text }) {
  return <div className="formation-section-title"><h2>{title}</h2>{text && <p>{text}</p>}</div>
}

function FormationNotFound({ headerProps }) {
  return (
    <div className="formation-page">
      <SiteHeader active="formations" {...headerProps} />
      <main className="formation-not-found">
        <GraduationCap weight="duotone" />
        <h1>Cette formation est en préparation.</h1>
        <p>Retrouvez tous les parcours disponibles dans le catalogue de formations ExpertCN.</p>
        <a href="/formations/"><ArrowLeft weight="bold" /> Retour aux formations</a>
      </main>
      <SiteFooter />
    </div>
  )
}

function FormationPage() {
  const slug = new URLSearchParams(window.location.search).get('formation') || 'technicien-ftto'
  const formation = formationBySlug.get(slug)
  const { requestItems, removeRequestItem, clearRequestItems } = useRequestList()
  const headerProps = { requestItems, onRemoveCartItem: removeRequestItem, onClearCart: clearRequestItems }

  useEffect(() => {
    document.title = formation ? `${formation.title} | Formation ExpertCN` : 'Formation | ExpertCN'
  }, [formation])

  if (!formation) return <FormationNotFound headerProps={headerProps} />

  const practicalItems = [
    { icon: Clock, label: 'Durée', value: formation.practical.duration },
    { icon: Monitor, label: 'Format', value: formation.practical.format },
    { icon: CalendarCheck, label: 'Accès', value: formation.practical.access },
    { icon: CurrencyEur, label: 'Tarif et financement', value: formation.practical.price },
    { icon: Users, label: 'Prérequis', value: formation.practical.prerequisites.join(' · ') },
    { icon: Exam, label: 'Évaluation', value: formation.practical.evaluation },
    { icon: Certificate, label: 'Reconnaissance', value: formation.practical.certification },
    { icon: HandHeart, label: 'Accessibilité', value: 'Aménagements étudiés avec notre référent handicap' },
  ]

  return (
    <div className="formation-page">
      <SiteHeader active="formations" {...headerProps} />
      <main>
        <section className="formation-hero">
          <div className="formation-hero-copy">
            <nav aria-label="Fil d’Ariane"><a href="/formations/">Formations</a><span>/</span><a href={`/formations/?categorie=${formation.categorySlug}`}>{formation.category}</a><span>/</span><strong>{formation.title}</strong></nav>
            <h1>{formation.title}</h1>
            <p>{formation.summary}</p>
            <div>
              <FormationButton href={`/contact/?sujet=Formation&formation=${encodeURIComponent(formation.slug)}#contact-form`}>S’inscrire</FormationButton>
              <FormationButton href="#programme-pdf" secondary>Télécharger le programme</FormationButton>
            </div>
          </div>
          <div className="formation-hero-media"><img src={formation.image} alt={`Formation ${formation.title} avec ExpertCN`} fetchPriority="high" /></div>
        </section>

        <section className="formation-section formation-results" aria-labelledby="results-title">
          <SectionTitle title="Des résultats suivis et documentés." text="Les indicateurs sont actualisés formation par formation selon la méthodologie qualité ExpertCN." />
          {formation.indicators ? (
            <div className="formation-result-grid">
              {Object.entries(formation.indicators).map(([label, value]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
            </div>
          ) : (
            <div className="indicator-pending">
              <CheckCircle weight="duotone" />
              <div><strong>Indicateurs en cours de consolidation</strong><p>Aucune valeur à zéro n’est affichée tant que les données de cette formation ne sont pas suffisamment représentatives.</p></div>
              <a href="/politique-de-confidentialite/">Méthodologie de calcul</a>
            </div>
          )}
        </section>

        <section className="formation-section formation-practical" aria-labelledby="practical-title">
          <SectionTitle title="Toutes les informations pratiques, au même endroit." text="Un cadre clair pour vérifier rapidement la durée, les modalités et les conditions d’accès." />
          <div className="formation-practical-grid">
            {practicalItems.map(({ icon: Icon, label, value }) => (
              <article key={label}><Icon weight="duotone" /><div><span>{label}</span><strong>{value}</strong></div></article>
            ))}
          </div>
          <div className="formation-contact-strip"><span>Contact dédié formation</span><a href="tel:+33189624501"><Phone weight="duotone" /> {contactPhone}</a><a href={`mailto:${contactEmail}`}><EnvelopeSimple weight="duotone" /> {contactEmail}</a></div>
        </section>

        {formation.levels && (
          <section className="formation-section formation-levels" aria-labelledby="levels-title">
            <SectionTitle title="Choisissez le niveau adapté à vos interventions." text="Le parcours IRVE s’ajuste au type d’infrastructure et au niveau de responsabilité visé." />
            <div>{formation.levels.map((level) => <article key={level.title}><strong>{level.title}</strong><p>{level.text}</p></article>)}</div>
          </section>
        )}

        <section className="formation-section formation-goals">
          <div className="formation-goals-main">
            <SectionTitle title="Ce que vous saurez faire à l’issue du parcours." />
            <ul>{formation.objectives.map((objective) => <li key={objective}><Check weight="bold" />{objective}</li>)}</ul>
            <div className="formation-audience"><h3>Public visé et prérequis</h3><ul>{formation.audience.map((item) => <li key={item}>{item}</li>)}</ul></div>
          </div>
          <aside className="formation-strengths">
            <span>Points forts</span>
            {formation.strengths.map((strength, index) => <div key={strength}><b>{String(index + 1).padStart(2, '0')}</b><strong>{strength}</strong></div>)}
          </aside>
        </section>

        <section className="formation-mid-cta" id="inscription">
          <div><span>Prochaine étape</span><h2>Préparez votre inscription à la formation {formation.title}.</h2></div>
          <p>Un conseiller vérifie votre projet, les prérequis et les prochaines dates disponibles.</p>
          <FormationButton href={`/contact/?sujet=Formation&formation=${encodeURIComponent(formation.slug)}#contact-form`}>Demander une place</FormationButton>
        </section>

        <section className="formation-section formation-program" aria-labelledby="program-title">
          <SectionTitle title="Un programme construit pour progresser par la pratique." text="Les évaluations finales sont présentées séparément pour garder un parcours lisible." />
          <div className="formation-program-layout">
            <div className="formation-modules">
              {formation.modules.map((module, index) => (
                <details open={index === 0} key={module.title}>
                  <summary><span>{String(index + 1).padStart(2, '0')}</span><strong>{module.title}</strong><b>+</b></summary>
                  <ul>{module.points.map((point) => <li key={point}>{point}</li>)}</ul>
                </details>
              ))}
            </div>
            <aside><Exam weight="duotone" /><span>Évaluation finale</span><strong>{formation.finalEvaluation}</strong><p>Les résultats sont formalisés et restitués au participant à l’issue du parcours.</p></aside>
          </div>
        </section>

        <section className="formation-section formation-download" id="programme-pdf">
          <div className="formation-download-media"><img src={formation.image} alt="" /></div>
          <div>
            <FileText weight="duotone" />
            <span>Programme détaillé</span>
            <h2>Conservez toutes les informations de la formation.</h2>
            <p>Le programme PDF spécifique sera disponible dès son ajout à la fiche média de cette formation.</p>
            {formation.programPdf
              ? <a href={formation.programPdf} download><DownloadSimple weight="bold" /> Télécharger le programme</a>
              : <button type="button" disabled><DownloadSimple weight="bold" /> Programme en préparation</button>}
          </div>
        </section>

        <section className="formation-section formation-faq" aria-labelledby="formation-faq-title">
          <SectionTitle title="Questions fréquentes" />
          <div>{formation.faq.map((item, index) => <details open={index === 0} key={item.question}><summary>{item.question}<span>+</span></summary><p>{item.answer}</p></details>)}</div>
        </section>

        <section className="formation-final-cta" id="contact-formation">
          <div className="formation-final-media"><img src="/images/expertcn-formation.jpg" alt="Échange avec l’équipe formation ExpertCN" /></div>
          <div className="formation-final-copy">
            <span>Contact formation</span>
            <h2>Construisons votre prochaine compétence.</h2>
            <p>Échangez avec notre équipe sur votre objectif, votre financement et les prochaines sessions.</p>
            <div><a href="tel:+33189624501"><Phone weight="duotone" /> {contactPhone}</a><a href={`mailto:${contactEmail}`}><EnvelopeSimple weight="duotone" /> {contactEmail}</a></div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

createRoot(document.getElementById('root')).render(<React.StrictMode><FormationPage /></React.StrictMode>)
