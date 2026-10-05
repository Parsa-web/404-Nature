import { useEffect } from 'react'

interface Seo {
  title: string
  description: string
  image?: string
}

function setMeta(selector: string, attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

/** Keeps document title, description and Open Graph tags in sync per route. */
export function useSeo({ title, description, image }: Seo): void {
  useEffect(() => {
    document.title = title
    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    if (image) setMeta('meta[property="og:image"]', 'property', 'og:image', image)
  }, [title, description, image])
}
