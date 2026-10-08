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

/**
 * Ten numbers, not a dashboard. Each one is chosen because it changes how the
 * rest of the archive reads, and each one points at a single document.
 */
export const DATA_POINTS: DataPoint[] = [
  {
    id: 'urmia-population',
    category: 'water',
    headline: '۶',
    unit: 'میلیون نفر',
    title: 'جمعیت حوضه آبریز دریاچه ارومیه',
    context:
      'به گزارش برنامه محیط زیست ملل متحد، در سال ۲۰۱۱ حدود شش میلیون نفر در حوضه آبریز ارومیه زندگی می‌کردند. همین عدد توضیح می‌دهد چرا افت دریاچه یک مسئله منظر نیست: آب، غذا، سلامت و اقلیم این جمعیت به آن وصل است.',
    date: '۲۰۱۱ (گزارش ۲۰۱۷)',
    source: 'UNEP Foresight Brief',
    sourceUrl: 'https://www.unep.org/resources/emerging-issues/lake-urmia-signs-recovery',
  },
  {
    id: 'hamoun-helmand',
    category: 'water',
    headline: '−۹۸٪',
    title: 'افت جریان هیرمند در مرز ایران و افغانستان',
    context:
      'ناسا گزارش می‌دهد در سال ۲۰۰۱ رود هیرمند در مرز عملاً خشک شد و جریان آن ۹۸ درصد کمتر از میانگین سالانه بود. در همان سال بارش حوضه سیستان نیز ۷۸ درصد افت کرد. تالاب هامون پس از آن دیگر فرصت بازگشت پیدا نکرد.',
    date: '۲۰۰۱',
    source: 'NASA Earth Observatory',
    sourceUrl:
      'https://science.nasa.gov/earth/earth-observatory/from-wetland-to-wasteland-the-destruction-of-the-hamoun-oasis/',
    bars: [
      { label: 'افت جریان هیرمند', value: 98, display: '−۹۸٪' },
      { label: 'افت بارش حوضه سیستان', value: 78, display: '−۷۸٪' },
    ],
  },
  {
    id: 'hamoun-life',
    category: 'biodiversity',
    headline: '۱۴۰ / ۱۵۰',
    unit: 'گونه ماهی / گونه پرنده',
    title: 'آنچه تالاب هامون در خود داشت',
    context:
      'پیش از خشکی، حدود ۱۴۰ گونه ماهی در آب‌های هامون و حدود ۱۵۰ گونه پرنده مهاجر و بومی در طول سال در آن و پیرامونش ثبت شده بود. با خشک شدن تالاب، جمعیت ماهیان و پرندگان تقریباً به‌طور کامل ناپدید شد و همه صیدگاه‌ها بسته شدند.',
    date: '۲۰۰۳',
    source: 'NASA Earth Observatory (به نقل از UNEP)',
    sourceUrl:
      'https://science.nasa.gov/earth/earth-observatory/from-wetland-to-wasteland-the-destruction-of-the-hamoun-oasis/',
  },
  {
    id: 'hamoun-towns',
    category: 'air',
    headline: 'تا ۱۰۰',
    unit: 'آبادی',
    title: 'آبادی‌هایی که زیر گردوغبار رفتند',
    context:
      'بادی که پیش‌تر از روی آب تالاب خنک می‌شد، حالا نمک و غبار بستر خشک را روی روستاها می‌ریزد. تا زمان این گزارش، گردوغبار بادآورده تا صد آبادی در منطقه را زیر خود گرفته بود. این نقطه‌ای است که یک مسئله زیست‌محیطی به یک مسئله سلامت و سکونت تبدیل می‌شود.',
    date: '۲۰۰۳',
    source: 'NASA Earth Observatory (به نقل از UNEP)',
    sourceUrl:
      'https://science.nasa.gov/earth/earth-observatory/from-wetland-to-wasteland-the-destruction-of-the-hamoun-oasis/',
  },
  {
    id: 'sistan-dust',
    category: 'air',
    headline: '۱۲۰',
    unit: 'روز باد',
    title: 'بادهای سیستان و طوفان‌های گردوغبار زابل',
    context:
      'USGS توضیح می‌دهد بادهای پیوسته بهار و تابستان — همان «باد ۱۲۰ روزه» — هر سال ده‌ها طوفان گردوغبار در زابل و پیرامون آن ایجاد می‌کنند. این غبارِ برخاسته از بستر خشک، عامل مشکلات تنفسی و گسترش بیماری‌های ریوی است و بسیاری از روستاهای منطقه رها شده‌اند.',
    date: 'به‌روزرسانی‌شده',
    source: 'USGS EROS — Earthshots',
    sourceUrl: 'https://eros.usgs.gov/earthshots/dust-storms',
  },
  {
    id: 'montreux-iran',
    category: 'wetland',
    headline: '۱۹۹۰ / ۱۹۹۳',
    title: 'هشدار رسمی بین‌المللی، بیش از سه دهه پیش',
    context:
      'فهرست مونترو، فهرست تالاب‌های رامسری است که ویژگی اکولوژیک آن‌ها تغییر کرده یا در خطر تغییر است. تالاب‌های هامون و مجموعه دریاچه‌های نی‌ریز (بختگان و طشک) در ۴ ژوئیه ۱۹۹۰ و مجموعه مرداب انزلی در ۳۱ دسامبر ۱۹۹۳ به این فهرست اضافه شدند. یعنی هشدار، دهه‌ها پیش از بحران صادر شده بود.',
    date: '۱۹۹۰ و ۱۹۹۳',
    source: 'کنوانسیون رامسر — فهرست مونترو',
    sourceUrl: 'https://www.ramsar.org/sites/default/files/documents/library/montreux_list_efs.pdf',
  },
  {
    id: 'ramsar-areas',
    category: 'wetland',
    headline: '۱۰۸٬۰۰۰',
    unit: 'هکتار',
    title: 'وسعت ثبت‌شده مجموعه نی‌ریز و کمجان در رامسر',
    context:
      'مجموعه «دریاچه‌های نی‌ریز و مرداب کمجان» در فارس — که بختگان و طشک را در بر می‌گیرد — در ۲۳ ژوئن ۱۹۷۵ با وسعت ۱۰۸٬۰۰۰ هکتار ثبت شد. در همان روز، مرداب انزلی با ۱۵٬۰۰۰ هکتار و تالاب‌های هامون با ۵۰٬۰۰۰ و ۱۰٬۰۰۰ هکتار ثبت شدند.',
    date: '۲۳ ژوئن ۱۹۷۵',
    source: 'کنوانسیون رامسر — فهرست مونترو',
    sourceUrl: 'https://www.ramsar.org/sites/default/files/documents/library/montreux_list_efs.pdf',
    bars: [
      { label: 'نی‌ریز و کمجان (بختگان)', value: 100, display: '۱۰۸٬۰۰۰ هکتار' },
      { label: 'هامون صابری و هیرمند', value: 46, display: '۵۰٬۰۰۰ هکتار' },
      { label: 'مرداب انزلی', value: 14, display: '۱۵٬۰۰۰ هکتار' },
    ],
  },
  {
    id: 'hyrcanian-age',
    category: 'forest',
    headline: '۲۵–۵۰',
    unit: 'میلیون سال',
    title: 'قدمت جنگل‌های هیرکانی',
    context:
      'یونسکو جنگل‌های هیرکانی را نواری از جنگل در جنوب دریای کاسپین با قدمتی میان ۲۵ تا ۵۰ میلیون سال توصیف می‌کند. این یک اکوسیستم بازمانده است: آنچه از دست برود، در مقیاس عمر انسان جایگزین نمی‌شود.',
    date: '۲۰۱۹ (و به‌روزرسانی‌های بعدی)',
    source: 'یونسکو — فهرست میراث جهانی، شماره ۱۵۸۴',
    sourceUrl: 'https://whc.unesco.org/en/list/1584',
  },
  {
    id: 'hyrcanian-biodiversity',
    category: 'biodiversity',
    headline: '۳٬۲۰۰',
    unit: 'گونه گیاه آوندی',
    title: 'تنوع زیستی ثبت‌شده هیرکانی',
    context:
      'یونسکو بیش از ۳٬۲۰۰ گونه گیاه آوندی، ۱۸۰ گونه پرنده و ۵۸ گونه پستاندار را در این جنگل‌ها ثبت کرده است — همراه با شکارچیان رأس زنجیره مانند پلنگ، گرگ و خرس قهوه‌ای، که نشانه کامل بودن اکوسیستم‌اند.',
    date: '۲۰۱۹',
    source: 'یونسکو — فهرست میراث جهانی، شماره ۱۵۸۴',
    sourceUrl: 'https://whc.unesco.org/en/list/1584',
    bars: [
      { label: 'گونه گیاه آوندی', value: 100, display: '۳٬۲۰۰+' },
      { label: 'گونه پرنده', value: 6, display: '۱۸۰' },
      { label: 'گونه پستاندار', value: 2, display: '۵۸' },
    ],
  },
  {
    id: 'urmia-model',
    category: 'water',
    headline: '۴۰',
    unit: 'سال داده · ۸ هدف',
    title: 'احیای ارومیه یک عدد است، نه یک شعار',
    context:
      'پژوهش مدل‌سازی احیای دریاچه ارومیه بر چهل سال داده میدانی، آزمایشگاهی، ماهواره‌ای و مدل تکیه دارد و هشت هدف احیا — از کاهش شوری تا حفظ آرتمیا و مهار گردوغبار بستر — را به تراز مشخصی از آب دریاچه متصل می‌کند.',
    date: '۲۰۱۹',
    source: 'Journal of Great Lakes Research (Elsevier)',
    sourceUrl: 'https://www.sciencedirect.com/science/article/abs/pii/S0380133018301862',
  },
  {
    id: 'gavkhuni-temp',
    category: 'air',
    headline: 'خشکی گاوخونی',
    title: 'وقتی یک تالاب خشک می‌شود، هوا هم تغییر می‌کند',
    context:
      'پژوهش منتشرشده در Water (MDPI) خشک شدن تالاب گاوخونی را کمی‌سازی کرده و اثر آن را بر تغییرپذیری دمای هوا در شرق حوضه زاینده‌رود نشان داده است. خشکی یک تالاب فقط یک رخداد محلی نیست؛ اقلیم پیرامونش را جابه‌جا می‌کند.',
    date: '۲۰۲۲',
    source: 'Water (MDPI)',
    sourceUrl: 'https://www.mdpi.com/2073-4441/14/2/172',
  },
]

/**
 * Only dates that appear in a document. The timeline is the spine of the
 * presentation: warnings first, collapse second.
 */
export const TIMELINE: { year: string; title: string; text: string; sourceUrl: string; source: string }[] = [
  {
    year: '۱۹۷۵',
    title: 'ایران چهار تالاب خود را به جهان معرفی می‌کند',
    text: 'در ۲۳ ژوئن ۱۹۷۵، مرداب انزلی، تالاب‌های هامون و مجموعه دریاچه‌های نی‌ریز و کمجان به‌عنوان تالاب‌های با اهمیت بین‌المللی در کنوانسیون رامسر ثبت شدند.',
    source: 'کنوانسیون رامسر',
    sourceUrl: 'https://www.ramsar.org/sites/default/files/documents/library/montreux_list_efs.pdf',
  },
  {
    year: '۱۹۹۰',
    title: 'نخستین هشدار: هامون و نی‌ریز در فهرست مونترو',
    text: 'در ۴ ژوئیه ۱۹۹۰ تالاب‌های هامون و مجموعه نی‌ریز (بختگان و طشک) به فهرست تالاب‌هایی اضافه شدند که ویژگی اکولوژیک آن‌ها تغییر کرده یا در خطر تغییر است.',
    source: 'کنوانسیون رامسر',
    sourceUrl: 'https://www.ramsar.org/sites/default/files/documents/library/montreux_list_efs.pdf',
  },
  {
    year: '۱۹۹۳',
    title: 'انزلی هم به فهرست مونترو اضافه می‌شود',
    text: 'در ۳۱ دسامبر ۱۹۹۳ مجموعه مرداب انزلی به همان فهرست پیوست. از این تاریخ، سه پرونده این آرشیو هشدار رسمی بین‌المللی دارند.',
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
    year: '۲۰۰۱',
    title: 'هیرمند در مرز خشک می‌شود',
    text: 'جریان رود در مرز ایران و افغانستان ۹۸ درصد کمتر از میانگین سالانه بود و بارش حوضه سیستان ۷۸ درصد افت کرد. هامون به شوره‌زار تبدیل شد.',
    source: 'NASA Earth Observatory',
    sourceUrl:
      'https://science.nasa.gov/earth/earth-observatory/from-wetland-to-wasteland-the-destruction-of-the-hamoun-oasis/',
  },
  {
    year: '۲۰۱۷',
    title: '«نشانه‌های بهبود» دریاچه ارومیه',
    text: 'گزارش UNEP نشانه‌های بهبود و در همان حال پیامدهای گسترده افت دریاچه را برای حدود شش میلیون ساکن حوضه بررسی می‌کند.',
    source: 'UNEP',
    sourceUrl: 'https://www.unep.org/resources/emerging-issues/lake-urmia-signs-recovery',
  },
  {
    year: '۲۰۱۹',
    title: 'ثبت جنگل‌های هیرکانی در فهرست میراث جهانی',
    text: 'پانزده پهنه جنگلی با مجموع ۱۸۶٬۹۳۳ هکتار در فهرست میراث جهانی یونسکو ثبت شد.',
    source: 'یونسکو',
    sourceUrl: 'https://whc.unesco.org/en/list/1584',
  },
  {
    year: '۲۰۲۲',
    title: 'علت خشکی بختگان، مستند می‌شود',
    text: 'پژوهشی در Sustainable Water Resources Management نشان می‌دهد خشک شدن دریاچه در حوضه بختگان نتیجه هم‌زمان تغییر اقلیم و فعالیت انسانی است.',
    source: 'Sustainable Water Resources Management',
    sourceUrl: 'https://doi.org/10.1007/s40899-022-00707-z',
  },
]
