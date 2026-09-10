import { chromium } from './node_modules/playwright/index.mjs'
import { writeFile } from 'node:fs/promises'

const phase = process.argv[2] || 'before'
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const report = []
const routes = ['/', '/sav/', '/a-propos-de-notre-mission/', '/materiel-telecom-fibre-optique/', '/formations/', '/formation.html?formation=technicien-ftto', '/boutique/', '/contact/', '/mentions-legales/']
const catalogue = await browser.newPage()
await catalogue.goto('http://localhost:5173/boutique/')
routes.push(await catalogue.locator('a.product-image').first().getAttribute('href'))
await catalogue.close()
for (const width of [1440, 900, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' })
  for (const route of routes) {
    const response = await page.goto(`http://localhost:5173${route}`)
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(150)
    await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-visible')))
    if (phase !== 'before') {
      await page.evaluate(async () => {
        for (const img of document.querySelectorAll('img[loading="lazy"]')) img.loading = 'eager'
        await Promise.all([...document.images].map(img => img.decode().catch(() => {})))
      })
    }
    const result = await page.evaluate(() => {
      const main = document.querySelector('main')
      const sections = [...(main?.children || [])].filter(el => el.getBoundingClientRect().height > 0)
      return {
        title: document.title,
        overflow: document.documentElement.scrollWidth > innerWidth,
        sections: sections.map((el, i) => {
          const rect = el.getBoundingClientRect(), style = getComputedStyle(el)
          const previous = sections[i - 1]?.getBoundingClientRect()
          return { class: el.className, title: el.querySelector('h1,h2')?.textContent, gap: previous ? Math.round(rect.top - previous.bottom) : null, padding: style.padding, height: Math.round(rect.height) }
        }),
        weights: [...new Set([...document.querySelectorAll('h1,h2,h3,strong,button,label')].map(el => getComputedStyle(el).fontWeight))].sort(),
        footerGap: main && document.querySelector('.site-footer') ? Math.round(document.querySelector('.site-footer').getBoundingClientRect().top - sections.at(-1).getBoundingClientRect().bottom) : null,
      }
    })
    report.push({ route, width, status: response.status(), ...result })
    if (width !== 900 && ['/', '/a-propos-de-notre-mission/', '/formations/', '/contact/'].includes(route)) {
      const name = route === '/' ? 'home' : route.split('/')[1]
      await page.screenshot({ path: `.codex-tmp/design-${phase}-${name}-${width}.png`, fullPage: true })
    }
  }
  await page.close()
}
await writeFile(`.codex-tmp/design-${phase}.json`, JSON.stringify(report, null, 2))
console.log(JSON.stringify(report))
await browser.close()
