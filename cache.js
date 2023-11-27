export function CacheWithExpiration(expirationTime) {
  this.cache = {};
  this.expirationTime = expirationTime; // in milliseconds

  this.has = function (key) {
    if (!this.cache.hasOwnProperty(key)) return false;

    const now = Date.now();
    const record = this.cache[key];

    // Check if the record has expired
    if (now - record.timestamp > this.expirationTime) {
      delete this.cache[key]; // Remove expired data
      return false;
    }

    return true;
  };

  this.get = function (key) {
    return this.has(key) ? this.cache[key].value : undefined;
  };

  this.set = function (key, value) {
    const now = Date.now();
    this.cache[key] = { value, timestamp: now };
  };
}
