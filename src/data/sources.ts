import type { Source, SourceTopic } from './types'

export const SOURCE_TOPIC_LABEL: Record<SourceTopic, string> = {
  water: 'آب',
  forest: 'جنگل',
  biodiversity: 'تنوع زیستی',
  wetland: 'تالاب‌ها',
  climate: 'تغییرات اقلیمی',
}

/**
 * Only sources that actually support a claim shown on the site are listed here.
 * Nothing on this list is decorative.
 */
export const SOURCES: Source[] = [
  {
    title: 'Lake Urmia: Signs of recovery — Foresight Brief',
    organization: 'برنامه محیط زیست ملل متحد (UNEP)',
    year: '2017',
    url: 'https://www.unep.org/resources/emerging-issues/lake-urmia-signs-recovery',
    topic: 'water',
  },
  {
    title: 'Conserving Iran and Iraq’s wetlands',
    organization: 'برنامه محیط زیست ملل متحد (UNEP)',
    year: '2021',
    url: 'https://www.unep.org/news-and-stories/story/conserving-iran-and-iraqs-wetlands',
    topic: 'wetland',
  },
  {
    title: 'List of Wetlands of International Importance included in the Montreux Record',
    organization: 'کنوانسیون رامسر',
    year: 'به‌روزرسانی‌شده',
    url: 'https://www.ramsar.org/sites/default/files/documents/library/montreux_list_efs.pdf',
    topic: 'wetland',
  },
  {
    title: 'Anzali Wetland Crisis: Unraveling the Decline of Iran’s Ecological Jewel',
    organization: 'Journal of Geophysical Research: Atmospheres (AGU)',
    year: '2024',
    url: 'https://agupubs.onlinelibrary.wiley.com/doi/10.1029/2023jd039538',
    topic: 'wetland',
  },
  {
    title: 'Hyrcanian Forests — World Heritage List, No. 1584',
    organization: 'یونسکو (UNESCO)',
    year: '2019',
    url: 'https://whc.unesco.org/en/list/1584',
    topic: 'forest',
  },
  {
    title: 'Does UNESCO designation enhance forest protection? Evidence from the Hyrcanian national forest inventory',
    organization: 'Trees, Forests and People (Elsevier)',
    year: '2025',
    url: 'https://www.sciencedirect.com/science/article/pii/S2666719325001827',
    topic: 'forest',
  },
  {
    title: 'From Wetland to Wasteland: The Destruction of the Hamoun Oasis',
    organization: 'NASA Earth Observatory',
    year: '2003',
    url: 'https://science.nasa.gov/earth/earth-observatory/from-wetland-to-wasteland-the-destruction-of-the-hamoun-oasis/',
    topic: 'wetland',
  },
  {
    title: 'The Hamoun Wetlands — Earthshots: Satellite Images of Environmental Change',
    organization: 'USGS EROS',
    year: 'به‌روزرسانی‌شده',
    url: 'https://eros.usgs.gov/earthshots/the-hamoun-wetlands',
    topic: 'water',
  },
  {
    title: 'Human and Climate Effects on the Hamoun Wetlands of Iran and Afghanistan',
    organization: 'American Meteorological Society',
    year: '2019',
    url: 'https://journals.ametsoc.org/view/journals/wcas/11/3/wcas-d-18-0070_1.xml',
    topic: 'climate',
  },
  {
    title: 'The Gavkhouni Wetland Dryness and Its Impact on Air Temperature Variability in the Zayandeh-Rud Basin',
    organization: 'Water (MDPI)',
    year: '2022',
    url: 'https://www.mdpi.com/2073-4441/14/2/172',
    topic: 'climate',
  },
  {
    title: 'Breaking the persisting supply–demand cycle: a critical review of water development and conflict in the Zayandeh-Rud basin',
    organization: 'Water Policy (IWA Publishing)',
    year: '2026',
    url: 'https://iwaponline.com/wp/article/28/2/273/110922/Breaking-the-persisting-supply-demand-cycle-a',
    topic: 'water',
  },
  {
    title: 'Determination of water requirements of the Gavkhuni wetland: A hydrological approach',
    organization: 'Journal of Arid Environments (Elsevier)',
    year: '2013',
    url: 'https://www.sciencedirect.com/science/article/abs/pii/S0140196313001304',
    topic: 'water',
  },
  {
    title: 'Investigating the restoration of Lake Urmia using a numerical modelling approach',
    organization: 'Journal of Great Lakes Research (Elsevier)',
    year: '2019',
    url: 'https://www.sciencedirect.com/science/article/abs/pii/S0380133018301862',
    topic: 'water',
  },
  {
    title: 'IUCN Red List — ارزیابی وضعیت گونه‌ها',
    organization: 'اتحادیه بین‌المللی حفاظت از طبیعت (IUCN)',
    year: 'به‌روزرسانی‌شده',
    url: 'https://www.iucnredlist.org/',
    topic: 'biodiversity',
  },
  {
    title: 'Acinonyx jubatus ssp. venaticus (یوزپلنگ آسیایی) — ارزیابی فهرست سرخ',
    organization: 'IUCN Red List',
    year: '2008',
    url: 'https://www.iucnredlist.org/search?query=Acinonyx%20jubatus%20venaticus',
    topic: 'biodiversity',
  },
  {
    title: 'Panthera pardus (پلنگ) — ارزیابی فهرست سرخ، شامل زیرگونه ایرانی',
    organization: 'IUCN Red List',
    year: 'به‌روزرسانی‌شده',
    url: 'https://www.iucnredlist.org/search?query=Panthera%20pardus%20tulliana',
    topic: 'biodiversity',
  },
  {
    title: 'Dama mesopotamica (گوزن زرد ایرانی) — ارزیابی فهرست سرخ',
    organization: 'IUCN Red List',
    year: 'به‌روزرسانی‌شده',
    url: 'https://www.iucnredlist.org/search?query=Dama%20mesopotamica',
    topic: 'biodiversity',
  },
  {
    title: 'Equus hemionus (گورخر آسیایی) — ارزیابی فهرست سرخ',
    organization: 'IUCN Red List',
    year: 'به‌روزرسانی‌شده',
    url: 'https://www.iucnredlist.org/search?query=Equus%20hemionus%20onager',
    topic: 'biodiversity',
  },
  {
    title: 'Phoenicopterus roseus (فلامینگوی بزرگ) — ارزیابی فهرست سرخ',
    organization: 'IUCN Red List',
    year: 'به‌روزرسانی‌شده',
    url: 'https://www.iucnredlist.org/search?query=Phoenicopterus%20roseus',
    topic: 'biodiversity',
  },
  {
    title: 'Ramsar Sites Information Service — پایگاه اطلاعات تالاب‌های بین‌المللی',
    organization: 'کنوانسیون رامسر',
    year: 'به‌روزرسانی‌شده',
    url: 'https://rsis.ramsar.org/',
    topic: 'wetland',
  },
]

export function sourceByUrl(url: string): Source | undefined {
  return SOURCES.find((s) => s.url === url)
}
