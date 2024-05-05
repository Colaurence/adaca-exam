const crypto = require('crypto');

// Generate a random secure buffer of 32 bytes (256 bits)
const secretKey = crypto.randomBytes(32).toString('hex');
console.log('Generated Secret Key:', secretKey);
