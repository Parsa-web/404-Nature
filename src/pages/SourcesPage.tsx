import { Breadcrumbs } from '../components/Breadcrumbs'
import { SourceList } from '../components/SourceList'
import { SOURCES, SOURCE_TOPIC_LABEL } from '../data/sources'
import type { SourceTopic } from '../data/types'
import { useReveal } from '../hooks/useReveal'
import { useSeo } from '../hooks/useSeo'

const ORDER: SourceTopic[] = ['water', 'wetland', 'forest', 'biodiversity', 'climate']

export function SourcesPage() {
  useReveal()
  useSeo({
    title: 'منابع | ۴۰۴ — طبیعت پیدا نشد',
    description:
      'فهرست منابع پروژه ۴۰۴ شامل گزارش‌های UNEP، یونسکو، کنوانسیون رامسر، ناسا، USGS، IUCN و مقالات داوری‌شده.',
  })

  return (
    <>
      <header className="page-head">
        <div className="shell">
          <Breadcrumbs items={[{ label: 'خانه', to: '/' }, { label: 'منابع' }]} />
          <h1>منابع</h1>
          <p className="lede">
            هر منبع در این فهرست دقیقاً پشتیبان یکی از ادعاهای منتشرشده در این سایت است. منبعی که محتوایی را پشتیبانی
            نکند، در این فهرست نیست.
          </p>
        </div>
      </header>

      {ORDER.map((topic) => {
        const group = SOURCES.filter((s) => s.topic === topic)
        if (!group.length) return null
        return (
          <section className="section" key={topic} style={{ paddingBlock: 'clamp(2.2rem,5vw,3.4rem)' }}>
            <div className="shell">
              <h2 className="reveal" style={{ fontSize: 'var(--step-2)', marginBottom: '1.2rem' }}>
                {SOURCE_TOPIC_LABEL[topic]}
              </h2>
              <div className="reveal">
                <SourceList sources={group} />
              </div>
            </div>
          </section>
        )
      })}

      <section className="section">
        <div className="shell">
          <div className="note reveal">
            <b>روش کار با منابع</b>
            ترتیب کار در این پروژه این بود: ابتدا منبع، سپس محتوا. جایی که منبع معتبر و قابل دسترسی پیدا نشد، به‌جای
            تولید عدد یا تاریخ، موضوع به‌صورت توصیفی و بدون ادعای کمی نوشته شده است. تصاویر نیز از Wikimedia Commons با
            مجوز آزاد انتخاب شده‌اند و اعتبار هر تصویر زیر آن درج شده است.
          </div>
        </div>
      </section>
    </>
  )
}
