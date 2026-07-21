import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/outfit'
import {
  ArrowUpRight,
  FileText,
  Scales,
  ShieldCheck,
} from '@phosphor-icons/react'
import { SiteFooter, SiteHeader, SiteNotice, useRequestList } from './shop-shared'
import './legal.css'

const legalPages = {
  '/politique-de-confidentialite/': {
    type: 'Protection des données',
    title: 'Politique de confidentialité',
    description: 'La manière dont Expert Center Networks collecte, utilise et protège vos informations personnelles.',
    icon: ShieldCheck,
    sections: [
      {
        id: 'introduction',
        title: 'Introduction',
        content: (
          <>
            <p>Bienvenue sur le site web d’Expert Center Networks. Chez ExpertCN, nous attachons une grande importance à la protection de votre vie privée et de vos données personnelles. Cette politique explique comment nous collectons, utilisons, partageons et protégeons vos informations lorsque vous visitez notre site ou interagissez avec nos services.</p>
            <p>En utilisant notre site, vous consentez à la collecte et à l’utilisation de vos informations conformément à cette politique. Si vous n’êtes pas d’accord avec ses termes, veuillez ne pas utiliser le site.</p>
          </>
        ),
      },
      {
        id: 'collecte',
        title: 'Collecte des informations personnelles',
        content: (
          <>
            <p>Nous pouvons collecter certaines informations personnelles vous concernant, telles que votre nom, votre prénom, votre adresse e-mail, votre numéro de téléphone, votre adresse postale ainsi que des informations sur votre entreprise.</p>
            <p>Vous pouvez choisir de nous fournir ces informations lorsque vous créez un compte, passez une commande, remplissez un formulaire de contact ou communiquez avec notre service clients.</p>
            <p>Nous collectons ces informations afin de fournir nos services, de répondre à vos demandes et de vous informer sur nos produits et promotions.</p>
          </>
        ),
      },
      {
        id: 'utilisation',
        title: 'Utilisation des informations personnelles',
        content: (
          <>
            <p>Nous utilisons principalement les informations collectées pour les finalités suivantes :</p>
            <ul>
              <li>Traiter vos commandes et répondre à vos demandes.</li>
              <li>Vous informer sur nos produits, promotions, offres spéciales ou contenus susceptibles de vous intéresser.</li>
              <li>Communiquer avec vous au sujet de vos demandes, commandes ou de toute autre question liée à nos services.</li>
              <li>Améliorer notre site et nos services.</li>
              <li>Personnaliser votre expérience sur notre site.</li>
              <li>Respecter nos obligations légales.</li>
            </ul>
          </>
        ),
      },
      {
        id: 'partage',
        title: 'Partage des informations',
        content: (
          <>
            <p>Nous ne vendons, ne louons ni ne divulguons vos informations personnelles à des tiers, sauf dans les circonstances suivantes :</p>
            <ul>
              <li>Avec nos prestataires de services, tels que les prestataires de paiement, les transporteurs et les fournisseurs de services marketing, afin de fournir nos produits et services.</li>
              <li>Lorsque nous sommes légalement tenus de divulguer vos informations, notamment pour protéger nos droits, notre propriété, notre sécurité, ceux de nos clients ou du public.</li>
              <li>Avec votre consentement exprès.</li>
            </ul>
          </>
        ),
      },
      {
        id: 'securite',
        title: 'Sécurité des informations',
        content: <p>Nous mettons en place des mesures de sécurité pour protéger vos informations personnelles contre la perte, le vol, l’accès non autorisé, la divulgation, la modification ou la destruction. Cependant, aucune méthode de transmission sur Internet ni aucune méthode de stockage électronique n’est sécurisée à 100 %. Bien que nous nous efforcions de protéger vos informations personnelles, nous ne pouvons pas garantir leur sécurité absolue.</p>,
      },
      {
        id: 'cookies',
        title: 'Cookies et technologies similaires',
        content: <p>Nous utilisons des cookies et d’autres technologies similaires pour améliorer votre expérience, personnaliser le contenu, analyser les tendances et mesurer l’efficacité de nos campagnes marketing. Vous pouvez gérer vos préférences en matière de cookies dans les paramètres de votre navigateur.</p>,
      },
      {
        id: 'sites-tiers',
        title: 'Liens vers des sites tiers',
        content: <p>Notre site peut contenir des liens vers des sites web tiers. Nous ne sommes pas responsables des pratiques de confidentialité de ces sites. Nous vous encourageons à lire leurs politiques de confidentialité avant de leur fournir vos informations personnelles.</p>,
      },
      {
        id: 'droits',
        title: 'Vos choix et vos droits',
        content: (
          <>
            <p>Vous pouvez choisir de ne pas nous fournir certaines informations personnelles, mais cela peut affecter votre capacité à utiliser certaines fonctionnalités du site. Vous pouvez également ne plus recevoir nos communications marketing en suivant les instructions de désinscription incluses dans celles-ci.</p>
            <p>Vous disposez notamment du droit d’accéder à vos données, de les rectifier, de les supprimer, de vous opposer à leur traitement ou de demander leur portabilité. Pour exercer ces droits, contactez-nous à <a href="mailto:service.client@expertcn.fr">service.client@expertcn.fr</a>.</p>
          </>
        ),
      },
      {
        id: 'modifications',
        title: 'Modification de la politique',
        content: <p>Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Toute modification sera publiée sur cette page. Nous vous encourageons à la consulter régulièrement pour rester informé.</p>,
      },
      {
        id: 'contact',
        title: 'Contact',
        content: <p>Pour toute question ou préoccupation concernant cette politique de confidentialité, écrivez-nous à <a href="mailto:service.client@expertcn.fr">service.client@expertcn.fr</a>. Votre confiance est importante pour nous et nous nous engageons à protéger vos informations personnelles.</p>,
      },
    ],
  },
  '/conditions-generales-dutilisation/': {
    type: 'Cadre d’utilisation',
    title: 'Conditions générales d’utilisation',
    description: 'Les règles qui encadrent l’accès au site expertcn.fr et l’utilisation de ses contenus et services.',
    icon: FileText,
    sections: [
      {
        id: 'introduction',
        title: 'Introduction',
        content: <p>Les présentes conditions générales d’utilisation régissent l’accès et l’utilisation du site <a href="https://www.expertcn.fr">www.expertcn.fr</a>, exploité par Expert Center Networks. En accédant au site, vous acceptez de vous conformer aux présentes CGU. Si vous ne les acceptez pas, veuillez ne pas utiliser le site.</p>,
      },
      {
        id: 'utilisation',
        title: 'Utilisation du site',
        content: (
          <>
            <p>Ce site est destiné à un usage professionnel pour les entreprises du secteur de l’électronique et des télécommunications. Vous vous engagez à l’utiliser dans le respect des lois et réglementations applicables.</p>
            <p>Vous ne devez pas utiliser le site à des fins illégales, frauduleuses ou nuisibles, ni porter atteinte aux droits de tiers. Vous ne devez pas perturber, endommager ou altérer son fonctionnement, y compris son code source.</p>
          </>
        ),
      },
      {
        id: 'compte',
        title: 'Compte utilisateur',
        content: (
          <>
            <p>Pour accéder à certaines fonctionnalités, vous pouvez être amené à créer un compte utilisateur. Vous êtes responsable de la confidentialité de vos informations d’identification et de toutes les activités associées à votre compte.</p>
            <p>Vous acceptez de fournir des informations exactes, complètes et à jour lors de la création de votre compte.</p>
          </>
        ),
      },
      {
        id: 'produits',
        title: 'Informations sur les produits',
        content: <p>Les informations relatives aux produits disponibles sur le site sont fournies à titre indicatif. Nous ne garantissons pas leur exactitude, leur exhaustivité ou leur fiabilité. Nous vous invitons à vérifier les spécifications et les détails des produits avant de passer une commande.</p>,
      },
      {
        id: 'commandes',
        title: 'Commandes et transactions',
        content: (
          <>
            <p>Les produits et services disponibles sur le site sont soumis à disponibilité. Toute commande passée via le site est soumise à notre confirmation. Nous nous réservons le droit de refuser une commande, en tout ou en partie, à notre seule discrétion.</p>
            <p>Les modalités de paiement, de livraison et de retour sont régies par nos politiques commerciales spécifiques, incorporées aux présentes CGU par référence.</p>
          </>
        ),
      },
      {
        id: 'propriete-intellectuelle',
        title: 'Propriété intellectuelle',
        content: <p>Tous les contenus présents sur ce site, y compris les textes, images, logos, vidéos et éléments graphiques, sont protégés par les lois relatives à la propriété intellectuelle et appartiennent à Expert Center Networks. Vous n’êtes pas autorisé à copier, reproduire, distribuer, afficher publiquement, modifier ou créer des œuvres dérivées à partir du contenu du site sans notre consentement écrit préalable.</p>,
      },
      {
        id: 'responsabilite',
        title: 'Limitation de responsabilité',
        content: (
          <>
            <p>Le site est fourni « tel quel » et sans garantie d’aucune sorte. Nous déclinons toute responsabilité quant à l’exactitude, la fiabilité ou l’adéquation à un usage particulier des informations qui y sont fournies.</p>
            <p>En aucun cas, nous ne serons responsables des dommages indirects, accessoires, spéciaux ou consécutifs résultant de l’utilisation du site ou de l’incapacité à l’utiliser.</p>
          </>
        ),
      },
      {
        id: 'sites-tiers',
        title: 'Liens vers des sites tiers',
        content: <p>Le site peut contenir des liens vers des sites web tiers. Nous n’assumons aucune responsabilité quant au contenu ou à la sécurité de ces sites. Leur consultation se fait à vos propres risques.</p>,
      },
      {
        id: 'modifications',
        title: 'Modification des CGU',
        content: <p>Nous nous réservons le droit de modifier les présentes conditions à tout moment. Les modifications prennent effet dès leur publication sur le site. Il vous appartient de consulter régulièrement les CGU afin de prendre connaissance des éventuelles mises à jour.</p>,
      },
      {
        id: 'droit-applicable',
        title: 'Droit applicable et juridiction compétente',
        content: <p>Les présentes CGU sont soumises au droit français. Tout litige découlant de l’utilisation du site sera porté devant les tribunaux français conformément aux règles de compétence en vigueur. Pour toute question, contactez-nous à <a href="mailto:service.client@expertcn.fr">service.client@expertcn.fr</a>.</p>,
      },
    ],
  },
  '/mentions-legales/': {
    type: 'Informations légales',
    title: 'Mentions légales',
    description: 'L’identité de l’éditeur, les informations d’hébergement et les règles applicables au site expertcn.fr.',
    icon: Scales,
    sections: [
      {
        id: 'editeur',
        title: 'Éditeur du site',
        content: (
          <dl className="legal-details">
            <div><dt>Raison sociale</dt><dd>Expert Center Networks</dd></div>
            <div><dt>Forme juridique</dt><dd>SASU, société par actions simplifiée à associé unique</dd></div>
            <div><dt>Capital social</dt><dd>15 000 €</dd></div>
            <div><dt>Siège social</dt><dd>81 rue des Fraisiers, 93420 Villepinte</dd></div>
            <div><dt>Adresse e-mail</dt><dd><a href="mailto:service.client@expertcn.fr">service.client@expertcn.fr</a></dd></div>
            <div><dt>Directrice de la publication</dt><dd>Mehmood Saira</dd></div>
            <div><dt>Numéro de TVA</dt><dd>FR05978190031</dd></div>
          </dl>
        ),
      },
      {
        id: 'hebergeur',
        title: 'Hébergeur du site',
        content: (
          <dl className="legal-details">
            <div><dt>Raison sociale</dt><dd>O2Switch</dd></div>
            <div><dt>Adresse</dt><dd>222 boulevard Gustave Flaubert, 63000 Clermont-Ferrand</dd></div>
            <div><dt>Téléphone</dt><dd><a href="tel:+33444446040">(+33) 4 44 44 60 40</a></dd></div>
          </dl>
        ),
      },
      {
        id: 'propriete-intellectuelle',
        title: 'Propriété intellectuelle',
        content: <p>L’ensemble du contenu présent sur ce site, incluant notamment les textes, graphismes, logos, images, vidéos, icônes et éléments sonores, est la propriété exclusive d’Expert Center Networks ou de ses partenaires et est protégé par les lois relatives à la propriété intellectuelle. Toute reproduction, modification, distribution ou utilisation sans autorisation préalable est strictement interdite.</p>,
      },
      {
        id: 'donnees-personnelles',
        title: 'Protection des données personnelles',
        content: <p>Les informations collectées sur ce site sont destinées à Expert Center Networks et sont utilisées dans le cadre de la gestion de votre demande ou de votre commande. Vous disposez d’un droit d’accès, de rectification et de suppression des données vous concernant. Pour exercer ces droits, contactez-nous à <a href="mailto:service.client@expertcn.fr">service.client@expertcn.fr</a> ou consultez notre <a href="/politique-de-confidentialite/">politique de confidentialité</a>.</p>,
      },
      {
        id: 'responsabilite',
        title: 'Responsabilité',
        content: <p>Expert Center Networks décline toute responsabilité quant aux éventuelles interruptions du site, aux erreurs ou omissions présentes sur celui-ci ainsi qu’aux dommages directs ou indirects pouvant résulter de son utilisation.</p>,
      },
      {
        id: 'liens-cookies',
        title: 'Liens hypertextes et cookies',
        content: (
          <>
            <p>Le site <a href="https://www.expertcn.fr">www.expertcn.fr</a> contient des liens hypertextes vers d’autres sites. Expert Center Networks décline toute responsabilité concernant ces liens externes ou les liens créés par d’autres sites vers expertcn.fr.</p>
            <p>La navigation sur le site peut provoquer l’installation de cookies sur l’appareil de l’utilisateur. Un cookie est un fichier de petite taille qui enregistre des informations relatives à la navigation. Les données obtenues permettent notamment de mesurer la fréquentation du site.</p>
            <p>Vous pouvez accepter ou refuser les cookies en modifiant les paramètres de votre navigateur. Aucun cookie ne sera déposé sans votre consentement. Les cookies sont conservés pendant une durée de 12 mois.</p>
          </>
        ),
      },
      {
        id: 'droit-applicable',
        title: 'Droit applicable et juridiction compétente',
        content: <p>Les présentes mentions légales sont régies par le droit français. Tout litige relatif à leur interprétation ou à leur exécution sera porté devant les tribunaux français conformément aux règles de compétence en vigueur.</p>,
      },
    ],
  },
}

const legalLinks = [
  { href: '/mentions-legales/', label: 'Mentions légales' },
  { href: '/conditions-generales-dutilisation/', label: 'Conditions générales d’utilisation' },
  { href: '/politique-de-confidentialite/', label: 'Politique de confidentialité' },
]

function LegalApp() {
  const [notice, setNotice] = useState('')
  const { requestItems } = useRequestList()
  const path = window.location.pathname.endsWith('/') ? window.location.pathname : `${window.location.pathname}/`
  const page = legalPages[path] || legalPages['/mentions-legales/']
  const Icon = page.icon

  const showNotice = (message) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2600)
  }

  return (
    <div className="legal-shell">
      <SiteHeader requestCount={requestItems.length} onRequest={showNotice} />
      <main>
        <header className="legal-hero">
          <div className="legal-hero-copy">
            <p className="legal-kicker">{page.type}</p>
            <h1>{page.title}</h1>
            <p>{page.description}</p>
          </div>
          <div className="legal-hero-mark" aria-hidden="true"><Icon weight="duotone" /></div>
        </header>

        <nav className="legal-page-switcher" aria-label="Pages juridiques">
          {legalLinks.map((link) => (
            <a key={link.href} className={path === link.href ? 'is-current' : ''} href={link.href} aria-current={path === link.href ? 'page' : undefined}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="legal-layout">
          <aside className="legal-summary">
            <p>Sur cette page</p>
            <nav aria-label={`Sommaire de la page ${page.title}`}>
              {page.sections.map((section, index) => (
                <a key={section.id} href={`#${section.id}`}><span>{String(index + 1).padStart(2, '0')}</span>{section.title}</a>
              ))}
            </nav>
          </aside>

          <article className="legal-document">
            {page.sections.map((section, index) => (
              <section key={section.id} id={section.id} className="legal-section">
                <div className="legal-section-index">{String(index + 1).padStart(2, '0')}</div>
                <div>
                  <h2>{section.title}</h2>
                  <div className="legal-section-content">{section.content}</div>
                </div>
              </section>
            ))}
          </article>
        </div>

        <section className="legal-contact" aria-labelledby="legal-contact-title">
          <div>
            <p>Une question sur ces informations ?</p>
            <h2 id="legal-contact-title">Notre équipe reste disponible.</h2>
          </div>
          <a href="mailto:service.client@expertcn.fr">service.client@expertcn.fr <ArrowUpRight weight="bold" /></a>
        </section>
      </main>
      <SiteFooter />
      <SiteNotice message={notice} />
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LegalApp />
  </React.StrictMode>,
)
