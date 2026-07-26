// Statik varlık yollarını sitenin taban yoluna göre çözer.
//
// brand.ts ve seed.ts içindeki görsel yolları "/images/..." biçiminde yazılır.
// Site kökte sunulurken bu doğrudur; ancak GitHub Pages gibi alt dizinde
// (/depo-adi/) sunulduğunda kökten mutlak yol yanlış yere gider ve 404 olur.
// Vite yalnızca import ettiği varlıkların yolunu yeniden yazar; yapılandırmada
// metin olarak duran yollara dokunmaz. Bu yüzden render sırasında çözüyoruz.

/** Vite taban yolu; her zaman "/" ile biter (kökte "/"). */
const BASE_URL = import.meta.env.BASE_URL;

/** "/images/logo.webp" → "/depo-adi/images/logo.webp" */
export function asset(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  return BASE_URL + path.replace(/^\/+/, '');
}
