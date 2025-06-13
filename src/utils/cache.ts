interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class Cache<T> {
  private cache = new Map<string, CacheItem<T>>();
  private defaultTTL: number;

  constructor(defaultTTL = 5 * 60 * 1000) { // 5 minutes default
    this.defaultTTL = defaultTTL;
  }

  set(key: string, data: T, ttl?: number): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    };
    this.cache.set(key, item);
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Clean expired items
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Global cache instances
export const dataCache = new Cache<any>(10 * 60 * 1000); // 10 minutes
export const imageCache = new Cache<string>(30 * 60 * 1000); // 30 minutes
export const searchCache = new Cache<any>(5 * 60 * 1000); // 5 minutes

// Auto cleanup every 5 minutes
setInterval(() => {
  dataCache.cleanup();
  imageCache.cleanup();
  searchCache.cleanup();
}, 5 * 60 * 1000);