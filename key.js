const { randomBytes } = require('node:crypto');

class KeyGenerator {
  constructor() {
    this.key = this.Key();
  }
  Key() {
    const key_length = 32;
    const buf = randomBytes(key_length);
    return buf.toString('hex');
  }
  getKey() {
    return this.key;
  }
}

module.exports = KeyGenerator;
