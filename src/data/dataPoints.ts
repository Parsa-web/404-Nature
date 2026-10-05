export type DataCategory = 'water' | 'air' | 'forest' | 'wetland' | 'biodiversity'

export const DATA_CATEGORY_LABEL: Record<DataCategory, string> = {
  water: 'آب',
  air: 'هوا',
  forest: 'جنگل',
  wetland: 'تالاب',
  biodiversity: 'تنوع زیستی',
}

export interface DataPoint {
  id: string
  category: DataCategory
  headline: string
  unit?: string
  title: string
  context: string
  date: string
  source: string
  sourceUrl: string
  /** Optional comparison bars. Values are shares of a documented total, never invented metrics. */
  bars?: { label: string; value: number; display: string }[]
}

export const DATA_POINTS: DataPoint[] = [
  {
    id: 'hyrcanian-age',
    category: 'forest',
    headline: '۲۵–۵۰',
    unit: 'میلیون سال',
    title: 'قدمت جنگل‌های هیرکانی',
    context:
      'یونسکو جنگل‌های هیرکانی را نواری از جنگل در جنوب دریای کاسپین با قدمتی میان ۲۵ تا ۵۰ میلیون سال توصیف می‌کند. این جنگل یک اکوسیستم بازمانده است و در مقیاس عمر انسان بازسازی نمی‌شود.',
    date: '۲۰۱۹ (و به‌روزرسانی‌های بعدی)',
    source: 'یونسکو — فهرست میراث جهانی، شماره ۱۵۸۴',
    sourceUrl: 'https://whc.unesco.org/en/list/1584',
  },
  {
    id: 'hyrcanian-area',
    category: 'forest',
    headline: '۱۸۶٫۹۳۳',
    unit: 'هکتار ثبت‌شده',
    title: 'پهنه ثبت‌شده هیرکانی در میراث جهانی',
    context:
      'ثبت جهانی سال ۲۰۱۹ شامل ۱۵ پهنه مجزا با مجموع ۱۸۶٫۹۳۳ هکتار و حریمی به وسعت ۱۰۲٫۶۲۷ هکتار بود.',
    date: '۲۰۱۹',
    source: 'Trees, Forests and People (Elsevier), 2025',
    sourceUrl: 'https://www.sciencedirect.com/science/article/pii/S2666719325001827',
    bars: [
      { label: 'پهنه ثبت‌شده', value: 100, display: '۱۸۶٫۹۳۳ هکتار' },
      { label: 'حریم (buffer)', value: 55, display: '۱۰۲٫۶۲۷ هکتار' },
    ],
  },
  {
    id: 'anzali-ramsar',
    category: 'wetland',
    headline: '۱۹٫۵۰۰',
    unit: 'هکتار',
    title: 'وسعت ثبت‌شده تالاب انزلی در کنوانسیون رامسر',
    context:
      'تالاب انزلی در ۲۳ ژوئن ۱۹۷۵ در استان گیلان با وسعت ۱۹٫۵۰۰ هکتار به‌عنوان تالاب با اهمیت بین‌المللی ثبت شد.',
    date: '۲۳ ژوئن ۱۹۷۵',
    source: 'کنوانسیون رامسر — فهرست مونترو',
    sourceUrl: 'https://www.ramsar.org/sites/default/files/documents/library/montreux_list_efs.pdf',
  },
  {
    id: 'anzali-montreux',
    category: 'wetland',
    headline: '۱۹۹۳',
    title: 'ورود تالاب انزلی به فهرست مونترو',
    context:
      'فهرست مونترو فهرست تالاب‌های رامسری است که ویژگی اکولوژیک آن‌ها تغییر کرده یا در خطر تغییر است. انزلی در ۳۱ دسامبر ۱۹۹۳ به این فهرست اضافه شد؛ یعنی هشدار رسمی بین‌المللی بیش از سه دهه قدمت دارد.',
    date: '۳۱ دسامبر ۱۹۹۳',
    source: 'کنوانسیون رامسر — فهرست مونترو',
    sourceUrl: 'https://www.ramsar.org/sites/default/files/documents/library/montreux_list_efs.pdf',
  },
  {
    id: 'hamoun-1998',
    category: 'water',
    headline: '۱۹۹۸',
    title: 'آغاز خشکسالی طولانی سیستان',
    context:
      'ناسا گزارش می‌دهد خشکسالی سال ۱۹۹۸ بر خلاف دوره‌های پیشین بسیار طولانی‌تر دوام آورد و تالاب هامون را از یک تالاب به زمین بایر تبدیل کرد.',
    date: '۱۹۹۸ به بعد',
    source: 'NASA Earth Observatory',
    sourceUrl:
      'https://science.nasa.gov/earth/earth-observatory/from-wetland-to-wasteland-the-destruction-of-the-hamoun-oasis/',
  },
  {
    id: 'urmia-data',
    category: 'water',
    headline: '۴۰',
    unit: 'سال داده',
    title: 'پایه داده‌ای مدل‌سازی احیای دریاچه ارومیه',
    context:
      'پژوهش مدل‌سازی احیای دریاچه ارومیه بر چهل سال داده میدانی، آزمایشگاهی، ماهواره‌ای و مدل تکیه دارد و هشت هدف احیا را به تراز آب دریاچه متصل می‌کند. یعنی «احیا» یک هدف قابل اندازه‌گیری است.',
    date: '۲۰۱۹',
    source: 'Journal of Great Lakes Research (Elsevier)',
    sourceUrl: 'https://www.sciencedirect.com/science/article/abs/pii/S0380133018301862',
  },
  {
    id: 'gavkhuni-temp',
    category: 'air',
    headline: 'خشکی گاوخونی',
    title: 'اثر خشک شدن تالاب بر دمای هوا',
    context:
      'پژوهش منتشرشده در Water (MDPI) خشک شدن تالاب گاوخونی را کمی‌سازی کرده و اثر آن را بر تغییرپذیری دمای هوا در شرق حوضه زاینده‌رود نشان داده است. خشک شدن یک تالاب فقط یک رخداد محلی نیست؛ اقلیم پیرامون را تغییر می‌دهد.',
    date: '۲۰۲۲',
    source: 'Water (MDPI)',
    sourceUrl: 'https://www.mdpi.com/2073-4441/14/2/172',
  },
  {
    id: 'urmia-unep',
    category: 'biodiversity',
    headline: 'هشدار UNEP',
    title: 'پیامدهای چندلایه افت دریاچه ارومیه',
    context:
      'برنامه محیط زیست ملل متحد افت دریاچه ارومیه را به پیامدهای منفی در دسترسی به آب، امنیت غذایی، سلامت عمومی، تنوع زیستی و سلامت اکوسیستم و حتی اقلیم محلی مرتبط می‌داند.',
    date: '۲۰۱۷',
    source: 'UNEP Foresight Brief',
    sourceUrl: 'https://www.unep.org/resources/emerging-issues/lake-urmia-signs-recovery',
  },
]

export const TIMELINE: { year: string; title: string; text: string; sourceUrl: string; source: string }[] = [
  {
    year: '۱۹۷۵',
    title: 'ثبت تالاب انزلی در کنوانسیون رامسر',
    text: 'انزلی در ۲۳ ژوئن ۱۹۷۵ با وسعت ۱۹٫۵۰۰ هکتار به‌عنوان تالاب با اهمیت بین‌المللی ثبت شد.',
    source: 'کنوانسیون رامسر',
    sourceUrl: 'https://www.ramsar.org/sites/default/files/documents/library/montreux_list_efs.pdf',
  },
  {
    year: '۱۹۹۳',
    title: 'انزلی در فهرست مونترو',
    text: 'تالاب انزلی به فهرست تالاب‌هایی اضافه شد که ویژگی اکولوژیک آن‌ها تغییر کرده یا در خطر تغییر است.',
    source: 'کنوانسیون رامسر',
    sourceUrl: 'https://www.ramsar.org/sites/default/files/documents/library/montreux_list_efs.pdf',
  },
  {
    year: '۱۹۹۸',
    title: 'آغاز خشکسالی طولانی در حوضه هیرمند',
    text: 'خشکسالی این سال، بر خلاف دوره‌های پیشین، سال‌ها دوام آورد و تالاب هامون فرصت بازگشت نیافت.',
    source: 'NASA Earth Observatory',
    sourceUrl:
      'https://science.nasa.gov/earth/earth-observatory/from-wetland-to-wasteland-the-destruction-of-the-hamoun-oasis/',
  },
  {
    year: '۲۰۱۷',
    title: 'هشدار و گزارش UNEP درباره دریاچه ارومیه',
    text: 'گزارش UNEP نشانه‌های بهبود و همچنین پیامدهای گسترده افت دریاچه را بررسی می‌کند.',
    source: 'UNEP',
    sourceUrl: 'https://www.unep.org/resources/emerging-issues/lake-urmia-signs-recovery',
  },
  {
    year: '۲۰۱۹',
    title: 'ثبت جنگل‌های هیرکانی در فهرست میراث جهانی',
    text: 'پانزده پهنه جنگلی با مجموع ۱۸۶٫۹۳۳ هکتار در فهرست میراث جهانی یونسکو ثبت شد.',
    source: 'یونسکو',
    sourceUrl: 'https://whc.unesco.org/en/list/1584',
  },
]
