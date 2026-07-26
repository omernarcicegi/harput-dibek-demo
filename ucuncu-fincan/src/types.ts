// Uygulamanın tamamında paylaşılan veri tipleri.
// Menü ve site bilgisi localStorage'da bu şekilde saklanır.

/** Ürün kartında gösterilen opsiyonel rozet. */
export type ItemBadge = 'yeni' | 'cok-satan' | 'vegan';

/** Haftanın günleri; çalışma saatleri bu sırayla tutulur. */
export type WeekDay =
  | 'pazartesi'
  | 'sali'
  | 'carsamba'
  | 'persembe'
  | 'cuma'
  | 'cumartesi'
  | 'pazar';

export interface Category {
  id: string;
  name: string;
  /** Küçükten büyüğe sıralanır. */
  order: number;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  /** Kartta görünen tek cümlelik açıklama. */
  description: string;
  /** TL cinsinden. Kuruş için ondalık kullanılabilir. */
  price: number;
  imageUrl: string;
  badge: ItemBadge | null;
  /** Detay panelinde gösterilen içerik/alerjen notu. */
  allergenNote: string;
  soldOut: boolean;
  order: number;
}

export interface MenuState {
  schemaVersion: number;
  categories: Category[];
  items: MenuItem[];
}

export interface DayHours {
  day: WeekDay;
  closed: boolean;
  /** "08:00" biçiminde. closed true ise yok sayılır. */
  openTime: string;
  closeTime: string;
}

export interface ContactInfo {
  address: string;
  /** Ekranda gösterilen biçim, örn. "0212 555 34 21". */
  phoneDisplay: string;
  /** tel: bağlantısı için sadeleştirilmiş hâli, örn. "+902125553421". */
  phoneDial: string;
  mapsUrl: string;
  instagramUrl: string;
}

export interface SiteInfoState {
  schemaVersion: number;
  hours: DayHours[];
  contact: ContactInfo;
}
