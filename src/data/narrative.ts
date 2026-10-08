/**
 * The three connective pieces of the archive's argument:
 *   ARCHIVE_STATUS_ORDER  what the four verdicts mean
 *   CHAIN                 how one failure becomes the next
 *   SOLUTIONS             what can actually be done
 * Every entry carries the source that supports it. Nothing here is a slogan.
 */

import type { ArchiveStatus } from './types'

/* ------------------------------------------------------------- the archive */

export const ARCHIVE_STATUS_ORDER: ArchiveStatus[] = ['lost', 'failing', 'at-risk', 'recovering']

/** Which case files currently hold each verdict. Slugs, so they stay linked. */
export const STATUS_RECORDS: Record<ArchiveStatus, string[]> = {
  lost: ['hammoun-wetland', 'bakhtegan-lake'],
  failing: ['urmia-lake', 'zayandeh-rud'],
  'at-risk': ['anazali-wetland', 'hyrcanian-forests'],
  recovering: [],
}

/** Said once, on the home page, where the archive explains itself. */
export const ARCHIVE_CONCEPT = {
  eyebrow: 'آرشیو',
  title: 'یک آرشیو، نه یک کمپین',
  lede:
    'خطای ۴۰۴ یعنی چیزی که دنبالش بودید، دیگر در آن نشانی نیست. این آرشیو همان منطق را به جغرافیای ایران می‌آورد: هر پرونده یک مکان واقعی است، با عکس مستند، منبع معتبر و یک حکم مشخص.',
  rule:
    'قاعده کار ساده است: هیچ عدد، تاریخ یا درصدی بدون منبع منتشر نمی‌شود. هر پرونده به هفت پرسش پاسخ می‌دهد — چه بود، چه تغییر کرد، چرا، چه از دست رفت، چه کسی آسیب دید، چه مانده، و آیا برمی‌گردد.',
  note:
    'وضعیت «در حال بازیابی» هنوز به هیچ پرونده‌ای داده نشده است. نزدیک‌ترین مورد ثبت‌شده، گزارش سال ۲۰۱۷ برنامه محیط زیست ملل متحد با عنوان «نشانه‌های بهبود دریاچه ارومیه» است — نشانه، نه بازگشت.',
  noteSource: 'https://www.unep.org/resources/emerging-issues/lake-urmia-signs-recovery',
} as const

/* ---------------------------------------------------------------- the chain */

export interface ChainLink {
  id: string
  title: string
  text: string
  /** One documented observation from this archive that proves the link. */
  evidence: string
  source: string
  sourceUrl: string
}

/**
 * Water loss -> habitat loss -> biodiversity decline -> soil & vegetation
 * -> dust -> human impact. Each step is a real step in a real Iranian basin.
 */
export const CHAIN: ChainLink[] = [
  {
    id: 'water',
    title: 'آب می‌رود',
    text: 'نه فقط به خاطر خشکسالی. وقتی برداشت از یک حوضه بیشتر از آبی باشد که وارد می‌شود، پایین‌دست همیشه بازنده است — و پایین‌دست معمولاً یک تالاب است.',
    evidence:
      'در حوضه زاینده‌رود، هر بار که منبع تازه‌ای اضافه شد، تقاضا هم رشد کرد. پژوهش Water Policy این را «چرخه پایدار عرضه–تقاضا» می‌نامد که با افزودن عرضه حل نمی‌شود.',
    source: 'Water Policy (IWA)',
    sourceUrl: 'https://iwaponline.com/wp/article/28/2/273/110922/Breaking-the-persisting-supply-demand-cycle-a',
  },
  {
    id: 'habitat',
    title: 'زیستگاه بسته می‌شود',
    text: 'یک تالاب فقط آب نیست؛ عمق، شوری و دوره آبگیری مشخصی است. وقتی این سه به‌هم بریزد، زیستگاه پیش از آن‌که آب تمام شود از کار می‌افتد.',
    evidence:
      'هامون در اوج آبگیری بین ۲٬۰۰۰ تا ۴٬۰۰۰ کیلومتر مربع وسعت داشت و میانگین عمقش تنها حدود سه متر بود؛ همین کم‌عمقی آن را در برابر هر افت کوچک آسیب‌پذیر کرد.',
    source: 'NASA Earth Observatory · USGS EROS',
    sourceUrl: 'https://eros.usgs.gov/earthshots/the-hamoun-wetlands',
  },
  {
    id: 'biodiversity',
    title: 'تنوع زیستی افت می‌کند',
    text: 'گونه‌ها به ترتیب نمی‌روند؛ زنجیره غذایی از پایه قطع می‌شود. اول چیزی که دیده نمی‌شود از بین می‌رود، بعد چیزی که همه می‌شناسند.',
    evidence:
      'در هامون حدود ۱۴۰ گونه ماهی و ۱۵۰ گونه پرنده ثبت شده بود؛ با خشک شدن تالاب، جمعیت ماهی‌ها و پرندگان تقریباً به‌طور کامل ناپدید شدند و تمام صیدگاه‌ها بسته شد.',
    source: 'NASA Earth Observatory',
    sourceUrl:
      'https://science.nasa.gov/earth/earth-observatory/from-wetland-to-wasteland-the-destruction-of-the-hamoun-oasis/',
  },
  {
    id: 'soil',
    title: 'خاک و پوشش گیاهی می‌شکند',
    text: 'نیزار و پوشش بومی، خاک را سر جایش نگه می‌دارند. وقتی می‌روند، بستر برهنه می‌ماند — و بستر برهنه دیگر خاک نیست، ذره است.',
    evidence:
      'نیزارهای هامون جای خود را به شوره‌زار و نیزار پوسیده دادند؛ بیشتر کشاورزی منطقه به شرایط دست‌بوم رسید و صدها هزار رأس دام از دست رفت.',
    source: 'NASA Earth Observatory',
    sourceUrl:
      'https://science.nasa.gov/earth/earth-observatory/from-wetland-to-wasteland-the-destruction-of-the-hamoun-oasis/',
  },
  {
    id: 'dust',
    title: 'گردوغبار بلند می‌شود',
    text: 'اینجا حلقه‌ای است که مسئله را از طبیعت به شهر منتقل می‌کند. باد، بستر خشک را برمی‌دارد و کیلومترها آن‌طرف‌تر پایین می‌گذارد.',
    evidence:
      'در سیستان، بادهای ۱۲۰ روزه هر سال ده‌ها طوفان گردوغبار از بستر خشک بلند می‌کنند؛ USGS این غبار را عامل مشکلات تنفسی و گسترش بیماری‌های ریوی می‌داند و می‌گوید بسیاری از روستاهای منطقه رها شده‌اند.',
    source: 'USGS EROS',
    sourceUrl: 'https://eros.usgs.gov/earthshots/dust-storms',
  },
  {
    id: 'human',
    title: 'نوبت انسان می‌رسد',
    text: 'آب، غذا، سلامت، کار و در نهایت ماندن یا رفتن. این آخرین حلقه نیست؛ همان حلقه اول است که به خانه رسیده.',
    evidence:
      'تا زمان گزارش ناسا، گردوغبار بادآورده تا ۱۰۰ آبادی در سیستان را زیر خود گرفته بود. در ارومیه نیز UNEP افت دریاچه را به دسترسی به آب، امنیت غذایی و سلامت عمومی حدود شش میلیون نفرِ ساکن حوضه مرتبط می‌داند.',
    source: 'NASA Earth Observatory · UNEP',
    sourceUrl: 'https://www.unep.org/resources/emerging-issues/lake-urmia-signs-recovery',
  },
]

/* ------------------------------------------------------------- can we fix it */

export interface Solution {
  id: string
  title: string
  text: string
  /** A concrete, documented example — never a generic recommendation. */
  evidence: string
  source: string
  sourceUrl: string
}

export const SOLUTIONS: Solution[] = [
  {
    id: 'water',
    title: 'مدیریت آب، نه تأمین آب',
    text: 'تفاوت این دو، کل تفاوت میان شکست و موفقیت است. تا وقتی هدف «آوردن آب بیشتر» باشد، هر منبع تازه‌ای هم مصرف می‌شود.',
    evidence:
      'مرور انتقادی Water Policy نشان می‌دهد پنج دهه توسعه منابع آب در حوضه زاینده‌رود، تعارض آب را حل نکرده است؛ چون هر بار عرضه بیشتر با تقاضای بیشتر پاسخ داده شد.',
    source: 'Water Policy (IWA)',
    sourceUrl: 'https://iwaponline.com/wp/article/28/2/273/110922/Breaking-the-persisting-supply-demand-cycle-a',
  },
  {
    id: 'agriculture',
    title: 'کشاورزی پایدار',
    text: 'بیشترین سهم مصرف آب در حوضه‌های این آرشیو، کشاورزی است. بزرگ‌ترین ذخیره آب کشور هم دقیقاً همان‌جاست: الگوی کشت و روش آبیاری.',
    evidence:
      'در حوضه ارومیه، UNEP کشاورزی، انرژی، صنعت و مسکن را بخش‌هایی می‌داند که همگی به همین یک منبع متکی‌اند و جمعیتشان در حال رشد است.',
    source: 'UNEP',
    sourceUrl: 'https://www.unep.org/resources/emerging-issues/lake-urmia-signs-recovery',
  },
  {
    id: 'restoration',
    title: 'احیای تالاب با عدد، نه با شعار',
    text: 'هر تالاب یک «نیاز آبی زیست‌محیطی» دارد که می‌شود آن را محاسبه کرد. بعد از آن، احیا دیگر یک آرزو نیست؛ یک تصمیم تخصیص است.',
    evidence:
      'نیاز آب زیست‌محیطی بختگان با رویکرد اکولوژیک برآورد شده و برای ارومیه، مدل‌سازی بر پایه ۴۰ سال داده، هشت هدف احیا را به تراز مشخصی از آب دریاچه گره زده است.',
    source: 'Ecological Engineering · Journal of Great Lakes Research',
    sourceUrl: 'https://www.sciencedirect.com/science/article/abs/pii/S0380133018301862',
  },
  {
    id: 'biodiversity',
    title: 'حفاظت از تنوع زیستی به‌معنای حفظ زمین',
    text: 'هیچ گونه‌ای را نمی‌شود جدا از زیستگاهش نجات داد. حفاظت مؤثر یعنی نگه‌داشتن پیوستگی زیستگاه، نه فقط شمردن جمعیت.',
    evidence:
      'یونسکو حضور شکارچیان رأس زنجیره مانند پلنگ، گرگ و خرس قهوه‌ای را نشانه کامل بودن اکوسیستم هیرکانی می‌داند؛ یعنی سلامت این گونه‌ها، شاخص سلامت کل جنگل است.',
    source: 'یونسکو (UNESCO)',
    sourceUrl: 'https://whc.unesco.org/en/list/1584',
  },
  {
    id: 'community',
    title: 'مشارکت جوامع محلی',
    text: 'حفاظتی که معیشت مردم را جایگزین نکند، دوام نمی‌آورد. در سیستان، ماندن مردم و احیای تالاب دو روی یک تصمیم‌اند.',
    evidence:
      'برنامه محیط زیست ملل متحد در احیای تالاب‌های ایران و عراق بر همکاری با جوامع محلی و مدیریت مشترک منابع آب تکیه می‌کند.',
    source: 'UNEP',
    sourceUrl: 'https://www.unep.org/news-and-stories/story/conserving-iran-and-iraqs-wetlands',
  },
  {
    id: 'transboundary',
    title: 'آب مرز نمی‌شناسد',
    text: 'دو پرونده از شش پرونده این آرشیو، آبشان از آن‌سوی مرز می‌آید. بدون توافق فرامرزی، هیچ تصمیم داخلی جریان را تضمین نمی‌کند.',
    evidence:
      'پژوهش American Meteorological Society خشکی هامون را نتیجه هم‌زمان عامل انسانی و اقلیمی در حوضه مشترک هیرمند میان ایران و افغانستان می‌داند.',
    source: 'American Meteorological Society',
    sourceUrl: 'https://journals.ametsoc.org/view/journals/wcas/11/3/wcas-d-18-0070_1.xml',
  },
]
