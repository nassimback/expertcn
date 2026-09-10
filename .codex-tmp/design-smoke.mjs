import { chromium } from './node_modules/playwright/index.mjs'
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
await page.goto('http://localhost:5173/formations/')
await page.locator('.shop-nav .nav-menu-group').first().hover()
if (!await page.locator('.mega-menu').first().isVisible()) throw Error('Material menu is hidden')
const menuStyle = await page.locator('.mega-menu-grid section > div a').first().evaluate(el => getComputedStyle(el).fontWeight)
if (menuStyle !== '500') throw Error('Menu list weight changed')
const header = await page.locator('.shop-header').evaluate(el => ({
  height: el.getBoundingClientRect().height,
  activeLine: getComputedStyle(el.querySelector('a.is-active'), '::after').display,
  links: [...el.querySelectorAll('.shop-nav > a, .nav-menu-trigger > a, .nav-menu-group > a')].map(a => ({ text: a.textContent, center: a.getBoundingClientRect().top + a.getBoundingClientRect().height / 2 })),
}))
if (header.activeLine !== 'none') throw Error('Header underline is visible')
if (Math.max(...header.links.map(a => a.center)) - Math.min(...header.links.map(a => a.center)) > 1) throw Error('Header links are misaligned')
await page.locator('.account-button').click()
if (!await page.locator('.chrome-panel').isVisible()) throw Error('Account panel failed')
await page.screenshot({ path: '.codex-tmp/design-account-desktop.png' })
await page.locator('.chrome-panel > header > button').click()
await page.goto('http://localhost:5173/boutique/')
await page.locator('.category-list button').nth(1).click()
if (await page.locator('.product-card').count() === 0) throw Error('Catalogue filter returned no cards')
await page.setViewportSize({ width: 390, height: 844 })
await page.goto('http://localhost:5173/formations/')
await page.locator('.shop-menu-button').click()
if (!await page.locator('.shop-mobile-nav').isVisible()) throw Error('Mobile menu failed')
await page.locator('.shop-menu-button').click()
const clipIssues = []
for (const route of ['/', '/sav/', '/a-propos-de-notre-mission/', '/formations/', '/contact/']) {
  await page.goto('http://localhost:5173' + route)
  await page.evaluate(() => document.fonts.ready)
  const issues = await page.evaluate(() => [...document.querySelectorAll('.hero-actions, .service-hero-actions, .service-form, .expert-contact-form')].flatMap(el => {
    const r = el.getBoundingClientRect(), parent = el.closest('.service-hero-copy, .hero-inner, .lead-panel, .contact-form-section')?.getBoundingClientRect()
    return parent && (r.right > parent.right + 1 || r.left < parent.left - 1 || r.bottom > parent.bottom + 1) ? [el.className] : []
  }))
  clipIssues.push(...issues.map(issue => ({ route, issue })))
}
console.log(JSON.stringify({ header, menuWeight: menuStyle, clipIssues, checks: 'Menu, account panel, catalogue filters and mobile navigation passed' }, null, 2))
await page.goto('http://localhost:5173/')
await page.locator('.hero').screenshot({ path: '.codex-tmp/design-home-mobile-detail.png' })
await page.goto('http://localhost:5173/contact/')
await page.locator('.contact-form-section').screenshot({ path: '.codex-tmp/design-form-mobile-detail.png' })
await browser.close()
if (clipIssues.length) process.exitCode = 1
