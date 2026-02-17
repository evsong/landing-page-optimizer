import { Page } from 'puppeteer-core'

export interface DomData {
  title: string
  metaDescription: string
  ogTags: Record<string, string>
  headings: Array<{ level: number; text: string }>
  links: Array<{ href: string; text: string; isExternal: boolean }>
  images: Array<{ src: string; alt: string; hasAlt: boolean }>
  forms: Array<{ fields: number; hasSubmit: boolean; action: string }>
  buttons: Array<{ text: string; isAboveFold: boolean }>
  jsonLd: any[]
  canonicalUrl: string | null
  pageText: string
  heroText: { headline: string; subheadline: string; ctaText: string }
  sections: {
    hasHero: boolean
    hasSocialProof: boolean
    hasHowItWorks: boolean
    hasFeatures: boolean
    hasTestimonials: boolean
    hasPricing: boolean
    hasFaq: boolean
    hasLeadForm: boolean
    hasFooter: boolean
  }
}

export async function extractDomData(page: Page): Promise<DomData> {
  return page.evaluate(() => {
    const getText = (el: Element | null) => el?.textContent?.trim() || ''
    const getAttr = (el: Element | null, attr: string) => el?.getAttribute(attr) || ''
    const viewportHeight = window.innerHeight

    // Meta
    const title = document.title
    const metaDescription = getAttr(document.querySelector('meta[name="description"]'), 'content')
    const canonicalUrl = getAttr(document.querySelector('link[rel="canonical"]'), 'href') || null

    // OG tags
    const ogTags: Record<string, string> = {}
    document.querySelectorAll('meta[property^="og:"]').forEach(el => {
      const prop = getAttr(el, 'property').replace('og:', '')
      ogTags[prop] = getAttr(el, 'content')
    })

    // Headings
    const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map(el => ({
      level: parseInt(el.tagName[1]),
      text: getText(el).slice(0, 200),
    }))

    // Links
    const links = Array.from(document.querySelectorAll('a[href]')).map(el => ({
      href: getAttr(el, 'href'),
      text: getText(el).slice(0, 100),
      isExternal: getAttr(el, 'href').startsWith('http') && !getAttr(el, 'href').includes(location.hostname),
    }))

    // Images
    const images = Array.from(document.querySelectorAll('img')).map(el => ({
      src: getAttr(el, 'src'),
      alt: getAttr(el, 'alt'),
      hasAlt: el.hasAttribute('alt') && getAttr(el, 'alt').length > 0,
    }))

    // Forms
    const forms = Array.from(document.querySelectorAll('form')).map(el => ({
      fields: el.querySelectorAll('input:not([type="hidden"]),textarea,select').length,
      hasSubmit: !!el.querySelector('button[type="submit"],input[type="submit"]'),
      action: getAttr(el, 'action'),
    }))

    // Buttons/CTAs
    const buttons = Array.from(document.querySelectorAll('button,a.btn,[role="button"],.cta,[class*="cta"],[class*="button"]')).map(el => {
      const rect = el.getBoundingClientRect()
      return {
        text: getText(el).slice(0, 100),
        isAboveFold: rect.top < viewportHeight,
      }
    })

    // JSON-LD
    const jsonLd: any[] = []
    document.querySelectorAll('script[type="application/ld+json"]').forEach(el => {
      try { jsonLd.push(JSON.parse(getText(el))) } catch {}
    })

    // Page text (first 5000 chars)
    const pageText = (document.body?.innerText || '').slice(0, 5000)

    // Hero detection
    const h1 = document.querySelector('h1')
    const heroSection = h1?.closest('section,header,[class*="hero"],[class*="banner"]') || h1?.parentElement
    const heroText = {
      headline: getText(h1),
      subheadline: getText(heroSection?.querySelector('p') || null),
      ctaText: getText(heroSection?.querySelector('a,button') || null),
    }

    // Section detection
    const bodyText = document.body?.innerHTML?.toLowerCase() || ''
    const hasPattern = (patterns: string[]) => patterns.some(p => bodyText.includes(p))

    const sections = {
      hasHero: !!h1 && buttons.some(b => b.isAboveFold),
      hasSocialProof: hasPattern(['trusted by', 'used by', 'customers', 'logo', 'partner']),
      hasHowItWorks: hasPattern(['how it works', 'how-it-works', 'step 1', 'step-1']),
      hasFeatures: hasPattern(['feature', 'benefit', 'why choose', 'what you get']),
      hasTestimonials: hasPattern(['testimonial', 'review', 'what people say', 'customer say']),
      hasPricing: hasPattern(['pricing', 'price', '/mo', '/month', 'free plan', 'pro plan']),
      hasFaq: hasPattern(['faq', 'frequently asked', 'common question']),
      hasLeadForm: forms.length > 0,
      hasFooter: !!document.querySelector('footer'),
    }

    return {
      title, metaDescription, ogTags, headings, links, images, forms, buttons,
      jsonLd, canonicalUrl, pageText, heroText, sections,
    }
  })
}
