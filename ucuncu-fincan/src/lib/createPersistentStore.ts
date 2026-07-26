// localStorage üzerinde çalışan, React'e abone olunabilen küçük bir depo.
//
// Bu modül dışarıya sadece dört şey açar: oku, abone ol, güncelle, sıfırla.
// localStorage erişimi, JSON ayrıştırma, şema sürümü denetimi, bozuk veriden
// kurtarma ve sekmeler arası eşitleme burada kalır — bileşenler hiçbirini görmez.

export interface PersistentStore<T> {
  /** Mevcut değeri döndürür. Referans, veri değişene kadar sabittir. */
  getSnapshot: () => T;
  /** Değişiklikleri dinler; aboneliği iptal eden fonksiyon döner. */
  subscribe: (listener: () => void) => () => void;
  /** Mevcut değerden yeni değer üretir, kaydeder ve aboneleri uyarır. */
  update: (updater: (current: T) => T) => void;
  /** Başlangıç verisine döner. */
  reset: () => void;
}

interface StoreOptions<T> {
  storageKey: string;
  /** Kayıtlı veri bu sürümle uyuşmazsa başlangıç verisine dönülür. */
  schemaVersion: number;
  createSeed: () => T;
  /**
   * Ayrıştırılmış ham veriyi doğrular.
   * Geçerliyse T döner, değilse null — null gelirse başlangıç verisi kullanılır.
   */
  parse: (raw: unknown) => T | null;
}

/**
 * localStorage'a erişilebilir mi?
 * Safari'nin özel modunda ve depolama kapalıyken erişim hata fırlatır;
 * bu durumda uygulama çökmemeli, bellekte çalışmaya devam etmeli.
 */
function getStorage(): Storage | null {
  try {
    const probeKey = '__cafe_probe__';
    window.localStorage.setItem(probeKey, '1');
    window.localStorage.removeItem(probeKey);
    return window.localStorage;
  } catch {
    // Depolama kullanılamıyor (özel mod, kota, kapalı çerezler).
    // Demo yine çalışsın; sadece kalıcılık olmaz.
    return null;
  }
}

export function createPersistentStore<T>(options: StoreOptions<T>): PersistentStore<T> {
  const { storageKey, schemaVersion, createSeed, parse } = options;
  const storage = getStorage();
  const listeners = new Set<() => void>();

  /**
   * Depodan okur. Herhangi bir sorunda (yok / bozuk JSON / geçersiz yapı /
   * sürüm uyuşmazlığı) başlangıç verisine döner ve asla hata fırlatmaz.
   */
  function readFromStorage(): T {
    if (!storage) return createSeed();

    let rawText: string | null;
    try {
      rawText = storage.getItem(storageKey);
    } catch {
      return createSeed();
    }
    if (rawText === null) return createSeed();

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      // Elle kurcalanmış veya yarım yazılmış veri.
      return createSeed();
    }

    // Sürüm denetimi: demo aracında göç mantığı taşımaya değmez,
    // uyuşmayan veriyi başlangıç verisiyle değiştiriyoruz.
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      (parsed as { schemaVersion?: unknown }).schemaVersion !== schemaVersion
    ) {
      return createSeed();
    }

    return parse(parsed) ?? createSeed();
  }

  // Anlık görüntü önbelleklenir: useSyncExternalStore, veri değişmediği sürece
  // aynı referansı görmek zorunda — her çağrıda yeniden okusaydık sonsuz döngü olurdu.
  let snapshot: T = readFromStorage();

  function writeToStorage(value: T): void {
    if (!storage) return;
    try {
      storage.setItem(storageKey, JSON.stringify(value));
    } catch {
      // Kota dolmuş olabilir. Bellekteki değer geçerli kalır,
      // sadece yenilemede kaybolur — demo için kabul edilebilir.
    }
  }

  function notify(): void {
    for (const listener of listeners) listener();
  }

  function setSnapshot(next: T): void {
    snapshot = next;
    writeToStorage(next);
    notify();
  }

  // Kafe sahibi paneli ikinci sekmede açtığında menü sekmesi de güncellensin.
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
      if (event.key !== storageKey) return;
      snapshot = readFromStorage();
      notify();
    });
  }

  return {
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    update: (updater) => setSnapshot(updater(snapshot)),
    reset: () => setSnapshot(createSeed()),
  };
}
