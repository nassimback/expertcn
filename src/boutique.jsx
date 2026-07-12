import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/outfit'
import {
  ArrowRight,
  ArrowUpRight,
  CaretDown,
  Check,
  EnvelopeSimple,
  FunnelSimple,
  List,
  MagnifyingGlass,
  MapPin,
  Plus,
  Phone,
  ShoppingBag,
  SlidersHorizontal,
  Sparkle,
  Wrench,
  X,
} from '@phosphor-icons/react'
import './boutique.css'

const categories = [
  { name: 'Tous les équipements', key: 'all' },
  { name: 'Soudeuses fibre optique', key: 'Soudeuses fibre optique' },
  { name: 'Tests et mesures', key: 'Tests et mesures' },
  { name: 'Raccordement optique', key: 'Raccordement optique' },
  { name: 'Tirage et sécurité', key: 'Tirage et sécurité' },
  { name: 'Identification de réseau', key: 'Identification de réseau' },
  { name: 'Consommables', key: 'Consommables' },
  { name: 'Autres équipements', key: 'Autres équipements' },
]

const products = [
  { name: 'Soudeuse optique Fujikura 90S+', category: 'Soudeuses fibre optique', image: '/images/expertcn-maintenance.jpg', badge: 'Fibre optique', description: 'Soudeuse de précision pour les chantiers exigeants.' },
  { name: 'Soudeuse Sumitomo T-57C', category: 'Soudeuses fibre optique', image: '/images/shop/shop-hero.jpg', badge: 'Fibre optique', description: 'Une solution robuste pour le raccordement terrain.' },
  { name: 'Cliveuse Sumitomo FC-8R', category: 'Soudeuses fibre optique', image: '/images/shop/shop-hero.jpg', badge: 'Préparation fibre', description: 'Clivage fiable pour des raccordements constants.' },
  { name: 'OTDR ECN50', category: 'Tests et mesures', image: '/images/shop/analyseur-pon.png', badge: 'Mesure', description: 'Réflectomètre compact pour vos diagnostics optiques.' },
  { name: 'Réflectomètre OTDR VeEX FX150', category: 'Tests et mesures', image: '/images/shop/analyseur-pon.png', badge: 'Mesure', description: 'Analyse terrain des réseaux fibre optique.' },
  { name: 'Analyseur PON FX120 VeEX', category: 'Tests et mesures', image: '/images/shop/analyseur-pon.png', badge: 'PON', description: 'Mesures PON précises et exploitables sur site.' },
  { name: 'Stylo laser Fiberpoint 250', category: 'Tests et mesures', image: '/images/shop/shop-hero.jpg', badge: 'Test fibre', description: 'Localisation visuelle des défauts et ruptures.' },
  { name: 'Etiqueteuse M210 Brady', category: 'Identification de réseau', image: '/images/shop/etiqueteuse-m210.png', badge: 'Identification', description: 'Étiquetage durable des câbles, panneaux et repères.' },
  { name: 'Etiqueteuse M710 Brady', category: 'Identification de réseau', image: '/images/shop/etiqueteuse-m210.png', badge: 'Identification', description: 'Une imprimante mobile conçue pour les interventions.' },
  { name: 'Breakout monomode', category: 'Raccordement optique', image: '/images/shop/shop-hero.jpg', badge: 'Câblage', description: 'Câble préconnectorisé pour les déploiements optiques.' },
  { name: 'Jarretières optiques', category: 'Raccordement optique', image: '/images/shop/shop-hero.jpg', badge: 'Câblage', description: 'Raccordement fiable du tiroir à l’équipement actif.' },
  { name: 'Tiroir optique coulissant', category: 'Raccordement optique', image: '/images/shop/shop-hero.jpg', badge: 'Baie réseau', description: 'Organisation et protection de vos fibres en baie.' },
  { name: 'Aiguille de tirage 100 m', category: 'Tirage et sécurité', image: '/images/shop/aiguille.png', badge: 'Tirage', description: 'Aiguille fibre 6-7 mm pour le passage des câbles.' },
  { name: 'Aiguille de tirage 150 m', category: 'Tirage et sécurité', image: '/images/shop/aiguille.png', badge: 'Tirage', description: 'Longueur adaptée aux parcours techniques étendus.' },
  { name: 'Recharge aiguille de tirage 60 m', category: 'Tirage et sécurité', image: '/images/shop/aiguille.png', badge: 'Tirage', description: 'Recharge de remplacement pour vos outils terrain.' },
  { name: 'Colliers de serrage', category: 'Tirage et sécurité', image: '/images/shop/aiguille.png', badge: 'Sécurité', description: 'Fixation propre et durable de vos faisceaux.' },
  { name: 'Électrodes Fujikura', category: 'Consommables', image: '/images/expertcn-maintenance.jpg', badge: 'Maintenance', description: 'Électrodes de remplacement pour soudeuses Fujikura.' },
  { name: 'Électrodes Sumitomo ER-10', category: 'Consommables', image: '/images/expertcn-maintenance.jpg', badge: 'Maintenance', description: 'Pièces d’entretien pour équipements Sumitomo.' },
  { name: 'Smooves 60 mm', category: 'Consommables', image: '/images/shop/shop-hero.jpg', badge: 'Protection fibre', description: 'Protection d’épissure pour raccordement optique.' },
  { name: 'Pigtails optiques', category: 'Consommables', image: '/images/shop/shop-hero.jpg', badge: 'Connectique', description: 'Finition propre et fiable de vos connexions fibre.' },
  { name: 'Aiguille de tirage 30 m', category: 'Tirage et sécurité', image: '/images/shop/aiguille.png', badge: 'Tirage', description: 'Format compact pour les parcours de proximité.' },
  { name: 'Aiguille de tirage 60 m', category: 'Tirage et sécurité', image: '/images/shop/aiguille.png', badge: 'Tirage', description: 'Outil polyvalent pour le passage de câbles.' },
  { name: 'Aiguille de tirage 300 m', category: 'Tirage et sécurité', image: '/images/shop/aiguille.png', badge: 'Tirage', description: 'Grande longueur pour les chantiers de réseau.' },
  { name: 'Embout pour aiguille de tirage', category: 'Tirage et sécurité', image: '/images/shop/aiguille.png', badge: 'Accessoire', description: 'Embout de remplacement pour guider le tirage.' },
  { name: 'Recharge aiguille de tirage 30 m', category: 'Tirage et sécurité', image: '/images/shop/aiguille.png', badge: 'Recharge', description: 'Recharge adaptée à vos aiguilles de tirage.' },
  { name: 'Recharge aiguille de tirage 100 m', category: 'Tirage et sécurité', image: '/images/shop/aiguille.png', badge: 'Recharge', description: 'Consommable de rechange pour les parcours longs.' },
  { name: 'Recharge aiguille de tirage 150 m', category: 'Tirage et sécurité', image: '/images/shop/aiguille.png', badge: 'Recharge', description: 'Recharge professionnelle pour les opérations terrain.' },
  { name: 'Recharge aiguille de tirage 300 m', category: 'Tirage et sécurité', image: '/images/shop/aiguille.png', badge: 'Recharge', description: 'Recharge grand format pour les déploiements étendus.' },
  { name: 'MPO', category: 'Raccordement optique', image: '/images/shop/shop-hero.jpg', badge: 'Connectique', description: 'Connectique haute densité pour infrastructures optiques.' },
  { name: 'Breakout multimode', category: 'Raccordement optique', image: '/images/shop/shop-hero.jpg', badge: 'Câblage', description: 'Câble multimode pour vos architectures réseau.' },
  { name: 'Tiroir optique actif', category: 'Raccordement optique', image: '/images/shop/shop-hero.jpg', badge: 'Baie réseau', description: 'Tiroir actif pour l’organisation des liaisons fibre.' },
  { name: 'Tiroir optique pivotant', category: 'Raccordement optique', image: '/images/shop/shop-hero.jpg', badge: 'Baie réseau', description: 'Accès simplifié aux raccordements en baie.' },
  { name: 'PTO 1, 2 ou 4 FO', category: 'Raccordement optique', image: '/images/shop/shop-hero.jpg', badge: 'Terminaison', description: 'Prise terminale optique pour les raccordements fibre.' },
  { name: 'Module optique SFP compatible', category: 'Raccordement optique', image: '/images/shop/analyseur-pon.png', badge: 'Actif réseau', description: 'Module compatible pour la connectivité optique active.' },
  { name: 'Soudeuse Fujikura 41S', category: 'Soudeuses fibre optique', image: '/images/expertcn-maintenance.jpg', badge: 'Fibre optique', description: 'Soudeuse compacte destinée aux opérations terrain.' },
  { name: 'Soudeuse Sumitomo T-502S', category: 'Soudeuses fibre optique', image: '/images/expertcn-maintenance.jpg', badge: 'Fibre optique', description: 'Raccordement de qualité pour les installations exigeantes.' },
  { name: 'Soudeuse Sumitomo T-402S', category: 'Soudeuses fibre optique', image: '/images/expertcn-maintenance.jpg', badge: 'Fibre optique', description: 'Soudeuse fiable pensée pour les chantiers télécoms.' },
  { name: 'Soudeuse Sumitomo T72C', category: 'Soudeuses fibre optique', image: '/images/expertcn-maintenance.jpg', badge: 'Fibre optique', description: 'Équipement de raccordement pour les interventions rapides.' },
  { name: 'Cliveuse Sumitomo FC-6+', category: 'Soudeuses fibre optique', image: '/images/shop/shop-hero.jpg', badge: 'Préparation fibre', description: 'Cliveuse professionnelle pour une coupe de fibre nette.' },
  { name: 'Photomètre PON 10G FX41XT VeEX', category: 'Tests et mesures', image: '/images/shop/analyseur-pon.png', badge: 'PON', description: 'Contrôle de puissance pour les réseaux PON 10G.' },
  { name: 'Mini OTDR VeEX OPX-BOXe', category: 'Tests et mesures', image: '/images/shop/analyseur-pon.png', badge: 'Mesure', description: 'Réflectométrie compacte pour vos diagnostics terrain.' },
  { name: 'Analyseur PON VeEX PX92', category: 'Tests et mesures', image: '/images/shop/analyseur-pon.png', badge: 'PON', description: 'Analyse avancée des réseaux optiques passifs.' },
  { name: 'Compteur VeEX PX90', category: 'Tests et mesures', image: '/images/shop/analyseur-pon.png', badge: 'Mesure', description: 'Mesure opérationnelle pour les interventions réseau.' },
  { name: 'Logiciel VeEX R-Server', category: 'Tests et mesures', image: '/images/shop/analyseur-pon.png', badge: 'Logiciel', description: 'Centralisation et exploitation des résultats de test.' },
  { name: 'Stylo laser Fiberpoint 250HP', category: 'Tests et mesures', image: '/images/shop/shop-hero.jpg', badge: 'Test fibre', description: 'Localisateur visuel haute puissance pour la fibre.' },
  { name: 'Etiqueteuse M211 Brady', category: 'Identification de réseau', image: '/images/shop/etiqueteuse-m210.png', badge: 'Identification', description: 'Étiquetage mobile pour les environnements professionnels.' },
  { name: 'Etiqueteuse M210 Lab Brady', category: 'Identification de réseau', image: '/images/shop/etiqueteuse-m210.png', badge: 'Identification', description: 'Étiqueteuse dédiée aux besoins de laboratoire et terrain.' },
  { name: 'Kit étiqueteuse M211 Brady', category: 'Identification de réseau', image: '/images/shop/etiqueteuse-m210.png', badge: 'Identification', description: 'Kit complet pour démarrer l’étiquetage immédiatement.' },
  { name: 'Etiqueteuse M510 Brady', category: 'Identification de réseau', image: '/images/shop/etiqueteuse-m210.png', badge: 'Identification', description: 'Identification industrielle pour les câbles et panneaux.' },
  { name: 'Etiqueteuse M610 Brady', category: 'Identification de réseau', image: '/images/shop/etiqueteuse-m210.png', badge: 'Identification', description: 'Solution d’étiquetage performante pour interventions terrain.' },
  { name: 'Tête Flex', category: 'Autres équipements', image: '/images/shop/shop-hero.jpg', badge: 'Accessoire', description: 'Accessoire professionnel pour vos équipements télécoms.' },
  { name: 'Smooves 45 mm', category: 'Consommables', image: '/images/shop/shop-hero.jpg', badge: 'Protection fibre', description: 'Protection d’épissure compacte pour fibre optique.' },
]

function Brand() {
  return (
    <a className="shop-brand" href="/" aria-label="ExpertCN, accueil">
      <img src="/images/expertcn-logo.png" alt="" />
      <span>EXPERT<span>CN</span></span>
    </a>
  )
}

function Boutique() {
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [notice, setNotice] = useState('')

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('fr')
    return products.filter((product) => {
      const matchesCategory = category === 'all' || product.category === category
      const searchable = `${product.name} ${product.category} ${product.badge}`.toLocaleLowerCase('fr')
      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery))
    })
  }, [category, query])

  const addToCart = (product) => {
    setCart((items) => [...items, product.name])
    setNotice(`${product.name} a été ajouté à votre demande.`)
    window.setTimeout(() => setNotice(''), 2600)
  }

  const categoryCount = (key) => key === 'all' ? products.length : products.filter((product) => product.category === key).length

  return (
    <div className="shop-page">
      <header className="shop-header">
        <div className="shop-header-inner">
          <Brand />
          <nav className="shop-nav" aria-label="Navigation principale">
            <a href="/">Accueil</a>
            <a className="is-active" href="/boutique.html">Boutique</a>
            <a href="/#maintenance">Maintenance</a>
            <a href="/#formations">Formations</a>
          </nav>
          <div className="shop-header-actions">
            <button className="cart-button" type="button" onClick={() => setNotice(cart.length ? `${cart.length} équipement${cart.length > 1 ? 's' : ''} dans votre demande.` : 'Votre demande est encore vide.')} aria-label="Voir votre demande">
              <ShoppingBag weight="duotone" />
              <span>Demande</span>
              <b>{cart.length}</b>
            </button>
            <button className="shop-menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}>
              {menuOpen ? <X /> : <List />}
            </button>
          </div>
        </div>
        {menuOpen && <nav className="shop-mobile-nav" aria-label="Navigation mobile"><a href="/">Accueil</a><a href="/boutique.html">Boutique</a><a href="/#maintenance">Maintenance</a><a href="/#formations">Formations</a></nav>}
      </header>

      <main>
        <section className="shop-hero">
          <div className="shop-hero-copy">
            <p className="shop-eyebrow">Matériels télécoms professionnels</p>
            <h1>Équipez vos interventions avec précision.</h1>
            <p>Du raccordement aux tests terrain, retrouvez les équipements et consommables qui accompagnent vos équipes au quotidien.</p>
            <a className="shop-primary-link" href="#catalogue">Voir le catalogue <ArrowRight weight="bold" /></a>
          </div>
          <div className="shop-hero-visual"><img src="/images/shop/shop-hero.jpg" alt="Sélection d’équipements professionnels pour la fibre optique" fetchPriority="high" /></div>
        </section>

        <section className="shop-assurances" aria-label="Services ExpertCN">
          <div><Check weight="bold" /><span><strong>Conseil avant achat</strong>Une sélection adaptée à votre usage.</span></div>
          <div><Wrench weight="duotone" /><span><strong>Maintenance spécialisée</strong>Un SAV qui connaît vos équipements.</span></div>
          <div><Sparkle weight="duotone" /><span><strong>Solutions professionnelles</strong>Des matériels choisis pour le terrain.</span></div>
        </section>

        <section className="shop-catalogue" id="catalogue">
          <div className="catalogue-heading">
            <div><p className="shop-eyebrow">Catalogue ExpertCN</p><h2>Le bon équipement, au bon moment.</h2></div>
            <p>Une sélection de matériels télécoms destinée aux techniciens, intégrateurs et équipes d’exploitation.</p>
          </div>

          <div className="catalogue-toolbar">
            <label className="shop-search"><MagnifyingGlass weight="bold" /><span className="sr-only">Rechercher un produit</span><input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Rechercher un équipement" /></label>
            <button className="filters-toggle" type="button" onClick={() => setFiltersOpen((open) => !open)}><FunnelSimple weight="bold" /> Filtres <CaretDown weight="bold" /></button>
            <span className="result-count">{filteredProducts.length} équipement{filteredProducts.length > 1 ? 's' : ''}</span>
          </div>

          <div className="catalogue-layout">
            <aside className={`shop-filters ${filtersOpen ? 'is-open' : ''}`}>
              <div className="filter-title"><SlidersHorizontal weight="duotone" /><span>Catégories</span></div>
              <div className="category-list">
                {categories.map((item) => <button key={item.key} className={category === item.key ? 'is-selected' : ''} type="button" onClick={() => { setCategory(item.key); setFiltersOpen(false) }}><span>{item.name}</span><b>{categoryCount(item.key)}</b></button>)}
              </div>
              <div className="filter-help"><strong>Besoin d’un conseil?</strong><p>Notre équipe vous oriente vers la solution adaptée.</p><a href="/#contact">Parler à un expert <ArrowUpRight weight="bold" /></a></div>
            </aside>

            <div className="product-area">
              {filteredProducts.length ? (
                <div className="product-grid">
                  {filteredProducts.map((product) => (
                    <article className="product-card" key={product.name}>
                      <div className="product-image"><img src={product.image} alt={product.name} loading="lazy" /><span>{product.badge}</span></div>
                      <div className="product-details"><p>{product.category}</p><h3>{product.name}</h3><span>{product.description}</span></div>
                      <div className="product-actions"><button type="button" onClick={() => addToCart(product)} aria-label={`Ajouter ${product.name} à la demande`}><Plus weight="bold" /> Ajouter au devis</button><a href="/#contact" aria-label={`Demander des informations sur ${product.name}`}>Détails <ArrowUpRight weight="bold" /></a></div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty-products"><MagnifyingGlass weight="duotone" /><h3>Aucun équipement trouvé.</h3><p>Essayez un autre terme ou explorez toutes les catégories.</p><button type="button" onClick={() => { setQuery(''); setCategory('all') }}>Réinitialiser les filtres</button></div>
              )}
            </div>
          </div>
        </section>

        <section className="shop-support">
          <div><p className="shop-eyebrow">Un doute sur la compatibilité?</p><h2>Nous vous aidons à constituer le bon ensemble.</h2></div>
          <p>Décrivez votre chantier, votre environnement ou votre matériel existant. Nous vous aidons à choisir les équipements compatibles et les consommables adaptés.</p>
          <a className="shop-primary-link" href="/#contact">Parler à un expert <ArrowRight weight="bold" /></a>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand"><Brand /><p>Formons, accompagnons et entretenons avec passion.</p></div>
          <div className="footer-column"><strong>Expertises</strong><a href="#catalogue">Matériels</a><a href="/#maintenance">SAV</a><a href="/#formations">Formations</a><a href="/#expertises">Audit</a></div>
          <div className="footer-column"><strong>ExpertCN</strong><a href="/#engagements">À propos</a><a href="/#contact">Contact</a><a href="/#engagements">Engagement RSE</a><a href="/#formations">Certification Qualiopi</a></div>
          <div className="footer-column footer-contact"><strong>Nous trouver</strong><span><MapPin weight="duotone" /> France</span><a href="tel:+33667676929"><Phone weight="duotone" /> 06 67 67 69 29</a><a href="mailto:service.client@expertcn.fr"><EnvelopeSimple weight="duotone" /> Nous écrire</a></div>
        </div>
        <p>Équipements, maintenance et formations pour les professionnels des télécoms.</p>
        <div className="footer-bottom"><span>© 2026 Expert Center Networks</span><div><a href="#">Mentions légales</a><a href="#">Politique de confidentialité</a></div></div>
        <span>© 2026 Expert Center Networks</span>
      </footer>

      {notice && <div className="shop-notice" role="status"><Check weight="bold" /> {notice}</div>}
    </div>
  )
}

createRoot(document.getElementById('root')).render(<React.StrictMode><Boutique /></React.StrictMode>)
