const { createHmac } = require('node:crypto');

class HMACGenerator {
  constructor(key) {
    this.key = key;
  }
  generateHMAC(pcMove) {
    // 'sha256', this.key
    const hash = createHmac('sha256', this.key).update(pcMove).digest('hex');
    console.log(`HMAC: ${hash}`);
    return hash;
  }
}

module.exports = HMACGenerator;
