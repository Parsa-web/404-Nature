/**
 * Central image helper.
 * All photography comes from Wikimedia Commons (freely licensed, real documentary
 * imagery). `Special:FilePath` returns the original file scaled to `width`.
 */
export function commons(file: string, width = 1600): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
    file,
  )}?width=${width}`
}

export function commonsPage(file: string): string {
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, '_'))}`
}

export const IMAGES = {
  urmiaIss: 'ISS-49 Lake Urmia, northwestern Iran.jpg',
  urmia1984: 'Lake urmia 1984.jpg',
  urmiaModis2016: 'Lake Urmia (MODIS 2016-07-06).jpg',
  urmiaGround: 'LakeUrmia SolmazDaryani00001.jpg',
  urmiaGround2: 'Solmaz daryani Urmia lake1111.jpg',
  urmiaAster: 'Lake Urmia, Iran (ASTER).jpg',

  anzali1992: 'Anzali Lagoon, Mordab-e Anzali, Bandar-e Anzali, Gilan province مرداب انزلی،دشت شقایق 1371 - panoramio.jpg',
  anzaliToday: 'Anzali lagoon by Mardetanha 6053.JPG',
  anzaliA: 'Anzali lagoon by Mardetanha 5641.jpg',
  anzaliB: 'Anzali lagoon by Mardetanha 5649.jpg',
  anzaliC: 'Anzali (Iran)- Lagoon-CaspianSea.JPG',

  zayandehA: 'Protest graffiti in Zayandeh River, Isfahan-Iran In 2014-Photographer Mostafa Meraji-Canon Photos-Free Pictures 07.jpg',
  zayandehB: 'Protest graffiti in Zayandeh River, Isfahan-Iran In 2014-Photographer Mostafa Meraji-Canon Photos-Free Pictures 13.jpg',
  zayandehC: 'Protest graffiti in Zayandeh River, Isfahan-Iran In 2014-Photographer Mostafa Meraji-Canon Photos-Free Pictures 19.jpg',
  zayandehD: 'Protest graffiti in Zayandeh River, Isfahan-Iran In 2014-Photographer Mostafa Meraji-Canon Photos-Free Pictures 22.jpg',

  hyrcanianA: 'Caspian Hyrcanian Mixed Forests in Northern Iran 02.jpg',
  hyrcanianB: 'Caspian Hyrcanian Mixed Forests in Northern Iran 11.jpg',
  hyrcanianC: 'Caspian Hyrcanian Mixed Forests in Northern Iran 12.jpg',
  hyrcanianD: 'Caspian Hyrcanian mixed forests2023-04-11 29.jpg',

  bakhteganWater: 'Bakhtegan Lake.jpg',
  bakhteganDry: 'Crisis in Bakhtegan Lake2023-07-16.jpg',
  bakhteganDry2: 'Crisis in Bakhtegan Lake2023-07-16 2.jpg',
  bakhteganSat: 'Bakhtegan lake.jpg',
  bakhteganKor: 'Kor river, Iran.jpg',
  tashk: 'Tashk lake.jpg',

  hamounWater: 'Hamun(Hamoun) wetlands Iran-Afghanistan Border هامون.jpg',
  hamounDry: 'Hamun Solmaz Daryani Hamoun 1.jpg',
  hamounDry2: 'Hamun Solmaz Daryani Hamoun 3.jpg',
  hamoun2017: 'Hamoun wetland 13960411 08.jpg',

  cheetah: 'Kooshki (Iranian Cheetah) 03.jpg',
  fallowDeer: 'Persian fallow deer in Mazandaran.jpg',
  leopard: 'Persian Leopard (Panthera pardus saxicolor).jpg',
  flamingo: 'Greater Flamingo Iran.jpg',
  onager: 'Equus hemionus onager 350907110.jpg',
} as const
